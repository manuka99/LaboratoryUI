<template>
  <div class="w-100">
    <section
      class="d-flex flex-column align-items-start justify-content-start px-0 w-100"
    >
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
        <p class="font-15 text-muted m-0 p-0">
          The transaction signer lets you add signatures to a Stellar
          transaction. Signatures are used in the network to prove that the
          account is authorized to perform the operations in the transaction.
          For simple transactions, you only need one signature from the correct
          account. Some advanced signatures may require more than one signature
          if there are multiple source accounts or signing keys.
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
            <TransactionInfo :xdr="xdr" />
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
                <b-form-checkbox switch size="lg" v-model="isShowTXOperations">
                  <p
                    class="mr-2 m-0 p-0 fontc-18 text-mutted font-weight-600 text-nowrap"
                  >
                    View {{ isTXTypeFee ? "Inner" : "" }} Transaction Operations
                  </p>
                </b-form-checkbox>
              </div>
              <TxActionsInfo
                v-if="isShowTXOperations"
                class="mt-4"
                :xdr="xdr"
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
                <b-form-checkbox switch size="lg" v-model="isShowTXSignatures">
                  <p
                    class="mr-2 m-0 p-0 fontc-18 text-mutted font-weight-600 text-nowrap"
                  >
                    View {{ isTXTypeFee ? "Inner" : "" }} Transaction Signatures
                  </p>
                </b-form-checkbox>
              </div>
              <TxSignatureInfo
                v-if="isShowTXSignatures"
                class="mt-4"
                :xdr="signedXdr ? signedXdr : xdr"
                :isOnline="isOnline"
                :refreshSignatures="refreshSignatures"
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
            />
            <hr style="height: 2px; width: 100%; margin: 40px 0px 60px 0px" />
          </b-col>
        </b-row>
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
import { BLOCKCHAIN_NETWORK_NAME } from "@/services/config";
import CustomError from "../Errors/CustomError.vue";

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
      mainError: {
        status: false,
        code: false,
        description: null
      },
      signedXdr: null,
      refreshSignatures: false
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
    },
  },
  methods: {
    initFn() {
      try {
        const tx = TransactionBuilder.fromXDR(
          this.xdr,
          BLOCKCHAIN_NETWORK_NAME
        );
        if (tx instanceof FeeBumpTransaction) this.isTXTypeFee = true;
        else this.isTXTypeFee = false;
        // disable error
        this.mainError.status = false;
      } catch (error) {
        console.log("error", error);
        this.mainError.code = 500;
        this.mainError.description =
          "Unable to parse input XDR into Transaction Envelope";
        this.mainError.status = true;
      }
    },
    onTxSignedFn(signInfo) {
      const { type, mode, accountID, signature } = signInfo;
      if (type == "general") {
        if (this.isOnline) this.refreshSignatures = !this.refreshSignatures;
        else this.signedXdr = signature;
      } else {
        // type - ['secure', 'general']
        // mode - ['metaspeck', 'direct']
      }
    },
    hideModalFn() {
      this.value.destination = null;
      this.value.isShow = false;
      this.$emit("onClose", {
        refresh: true
      });
    }
  }
};
</script>

<style scoped></style>
