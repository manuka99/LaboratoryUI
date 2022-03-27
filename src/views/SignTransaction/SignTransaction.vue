<template>
  <div class="w-100">
    <section
      class="d-flex flex-column align-items-start justify-content-start px-0 w-100"
    >
      <!-- spinner -->
      <div
        v-if="isLoading"
        style="min-height: 400px;"
        class="d-flex justify-content-center align-items-center w-100"
      >
        <b-spinner
          variant="primary"
          label="Spinning"
          style="width: 120px; height: 120px;"
        ></b-spinner>
      </div>
      <div v-else class="w-100">
        <!-- error -->
        <div
          v-if="mainError.status"
          style="min-height: 280px;"
          class="d-flex justify-content-center align-items-center w-100"
        >
          <p class="text-danger font-weight-600 font-18">
            {{ mainError.description }}
          </p>
        </div>
        <div v-else class="w-100">
          <div
            v-if="isOnline && expire_at"
            class="bg-danger p-2 rounded mb-3 d-flex justify-content-center"
          >
            <p class="font-15 font-weight-600 text-white m-0 p-0">
              Transaction will expire in {{ formatDateToSL(expire_at) }}.
              <a
                href="https://developers.stellar.org/docs/glossary/multisig/"
                target="_blank"
                class="text-white text-decoration-underline font-15"
              >
                Learn more.</a
              >
            </p>
          </div>
          <p class="font-15 text-muted m-0 p-0">
            The transaction signer lets you add signatures to a Stellar
            transaction. Signatures are used in the network to prove that the
            account is authorized to perform the operations in the transaction.
            For simple transactions, you only need one signature from the
            correct account. Some advanced signatures may require more than one
            signature if there are multiple source accounts or signing keys.
            <a
              href="https://developers.stellar.org/docs/glossary/multisig/"
              target="_blank"
            >
              Learn more.</a
            >
          </p>
          <hr style="height: 2px; width: 100%; margin: 20px 0px" />
          <b-row class="w-100 m-0 p-0 w-100">
            <b-col cols="12" class="m-0 p-0 ">
              <!-- info -->
              <TransactionInfo :xdr="xdr" @onError="onErrorFn" />
            </b-col>
            <b-col cols="12" class="m-0 p-0">
              <!-- operations -->
              <hr style="height: 2px; width: 100%; margin: 28px 0px" />
              <div
                class="d-flex flex-column justify-content-start flex-wrap w-100"
              >
                <div
                  class="d-flex align-items-center p-3 border rounded card"
                  :class="
                    isShowTXOperations
                      ? 'bg-success text-white'
                      : 'bg-info text-white'
                  "
                >
                  <b-form-checkbox
                    switch
                    size="lg"
                    v-model="isShowTXOperations"
                  >
                    <p
                      class="mr-2 m-0 p-0 fontc-18 text-mutted font-weight-600 text-nowrap"
                    >
                      View {{ isTXTypeFee ? "Inner" : "" }} Transaction
                      Operations
                    </p>
                  </b-form-checkbox>
                </div>
                <TxActionsInfo
                  v-if="isShowTXOperations"
                  class="mt-4"
                  :xdr="xdr"
                  @onError="onErrorFn"
                />
              </div>
            </b-col>
            <b-col cols="12" class="m-0 p-0">
              <!-- signatures -->
              <hr style="height: 2px; width: 100%; margin: 28px 0px" />
              <div
                class="d-flex flex-column justify-content-start flex-wrap w-100"
              >
                <div
                  class="d-flex align-items-center p-3 border rounded card"
                  :class="
                    isShowTXSignatures
                      ? 'bg-success text-white'
                      : 'bg-info text-white'
                  "
                >
                  <b-form-checkbox
                    switch
                    size="lg"
                    v-model="isShowTXSignatures"
                  >
                    <p
                      class="mr-2 m-0 p-0 fontc-18 text-mutted font-weight-600 text-nowrap"
                    >
                      View {{ isTXTypeFee ? "Inner" : "" }} Transaction
                      Signatures
                    </p>
                  </b-form-checkbox>
                </div>
                <TxSignatureInfo
                  v-if="isShowTXSignatures"
                  class="mt-4"
                  :xdr="signedXdr ? signedXdr : xdr"
                  :isOnline="isOnline"
                  :refreshSignatures="refreshSignatures"
                  @onError="onErrorFn"
                />
              </div>
            </b-col>
            <b-col cols="12" class="m-0 p-0">
              <hr style="height: 2px; width: 100%; margin: 36px 0px 26px 0px" />
              <!-- signatures -->
              <TxSignerInfo
                :xdr="signedXdr ? signedXdr : xdr"
                :isOnline="isOnline"
                @signed="onTxSignedFn"
                @onError="onErrorFn"
              />
              <hr style="height: 2px; width: 100%; margin: 40px 0px 28px 0px" />
            </b-col>
            <b-col
              v-if="!isOnline"
              cols="12"
              class="mt-0 mb-4 p-0 d-flex justify-content-end"
            >
              <button
                class="btn btn-danger mr-3 min-width-140px"
                @click="hideModalFn(null)"
              >
                <i class="mdi mdi-close-outline"></i> Close
              </button>
              <button
                class="btn btn-primary min-width-140px"
                @click="
                  hideModalFn({
                    isConfirm: true,
                    signedXdr: signedXdr ? signedXdr : xdr
                  })
                "
              >
                <i class="mdi mdi-checkbox-multiple-marked-outline"></i> Confirm
              </button>
            </b-col>
          </b-row>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
const {
  Transaction,
  FeeBumpTransaction,
  TransactionBuilder
} = require("stellar-sdk");
import TransactionInfo from "@/views/SignTransaction/TransactionInfo.vue";
import TxActionsInfo from "@/views/SignTransaction/TxActionsInfo.vue";
import TxSignatureInfo from "@/views/SignTransaction/TxSignatureInfo.vue";
import TxSignerInfo from "@/views/SignTransaction/TxSignerInfo.vue";
import { FindTransactionsAPI } from "@/services/transaction.service";
import { BLOCKCHAIN_NETWORK_NAME } from "@/services/config";
import CustomError from "../Errors/CustomError.vue";
import { formatDateToSL } from "@/util/common";

export default {
  components: {
    TransactionInfo,
    TxActionsInfo,
    TxSignatureInfo,
    TxSignerInfo,
    CustomError
  },
  data() {
    return {
      isTXTypeFee: false,
      isShowTXOperations: false,
      isShowTXSignatures: false,
      isLoading: false,
      mainError: {
        status: false,
        code: false,
        description: null
      },
      signedXdr: null,
      refreshSignatures: false,
      expire_at: null,
      formatDateToSL: formatDateToSL
    };
  },
  props: {
    value: {
      type: Object,
      default: function() {
        return {
          isShow: false
        };
      }
    },
    title: {
      type: String,
      default: "Sign Blockchain Transaction"
    },
    xdr: String,
    isOnline: Boolean
  },
  watch: {
    xdr: {
      handler(val) {
        if (val) this.initFn();
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    initFn() {
      try {
        // disable error
        this.isLoading = true;
        this.mainError.status = false;
        const tx = TransactionBuilder.fromXDR(
          this.xdr,
          BLOCKCHAIN_NETWORK_NAME
        );
        if (tx instanceof FeeBumpTransaction) this.isTXTypeFee = true;
        else this.isTXTypeFee = false;
        if (this.isOnline) {
          let txnHash = tx.hash().toString("hex");
          FindTransactionsAPI({
            txnHash,
            network: BLOCKCHAIN_NETWORK_NAME
          })
            .then(res => {
              let txns = res.data.data.txns;
              if (!txns || txns.length == 0) {
                this.mainError.code = 404;
                this.mainError.description =
                  "Transaction was not found on cloud, this may be due the transaction been expired or not having enough permissions";
                this.mainError.status = true;
              } else {
                let signedXdr = txns[0].signedTxnXdr;
                this.expire_at = txns[0].expire_at;
                if (signedXdr) this.signedXdr = signedXdr;
              }
            })
            .catch(err => {
              this.mainError.code = error.status;
              this.mainError.description = err.message;
              this.mainError.status = true;
            })
            .finally(() => (this.isLoading = false));
        } else {
          this.isLoading = false;
        }
      } catch (error) {
        this.mainError.code = 500;
        this.mainError.description =
          "Unable to parse input XDR into Transaction Envelope";
        this.mainError.status = true;
        this.isLoading = false;
      }
    },
    onTxSignedFn(signInfo) {
      const { type, mode, accountID, signature } = signInfo;
      if (type == "general") {
        if (this.isOnline) this.refreshSignatures = !this.refreshSignatures;
        else this.signedXdr = signature;
      } else {
        this.refreshSignatures = !this.refreshSignatures;
      }
    },
    onErrorFn() {
      this.initFn();
    },
    hideModalFn(data = {}) {
      this.value.isShow = false;
      this.$emit("onClose", data);
    }
  }
};
</script>

<style scoped></style>
