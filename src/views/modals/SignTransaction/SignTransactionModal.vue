<template>
  <div>
    <b-modal
      v-model="value.isShow"
      footer-class="d-none"
      header-class="p-0"
      modal-class="w-100 p-0 d-flex justify-content-center"
      dialog-class="max-width-1100px w-100 m-4 d-flex justify-content-center align-items-center"
      content-class="height-92vh"
      body-class="overflow-y-auto"
      no-close-on-backdrop
    >
      <template #modal-header>
        <div
          class="w-100 d-flex justify-content-between align-items-center bg-dark py-2 px-4"
        >
          <span
            class="mb-0 text-white"
            style="font-size: clamp(15px, 3.5vw, 20px);"
          >
            <i class="mdi mdi-key-change mr-2"></i>{{ title }}
          </span>
          <div class="cursor-pointer" @click="hideModalFn">
            <i class="mdi mdi-close-box-outline font-32 text-white"></i>
          </div>
        </div>
      </template>
      <div>
        <section
          class="d-flex flex-column align-items-start justify-content-start px-2 w-100"
        >
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
          <hr class="mt-4 mb-3" style="height: 2px; width: 100%;" />
          <b-row class="w-100 m-0 p-0">
            <b-col cols="12" class="m-0 p-0">
              <!-- info -->
              <TransactionInfo :xdr="xdr" />
            </b-col>
            <b-col cols="12" class="m-0 p-0">
              <!-- operations -->
              <hr class="mt-5 mb-3" style="height: 2px; width: 100%;" />
              <div class="d-flex flex-column justify-content-start flex-wrap">
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
                    <p class="mr-2 m-0 p-0 font-18 text-mutted font-weight-600">
                      View {{ isTXTypeFee ? "Inner" : "" }} Transaction
                      Operations
                    </p>
                  </b-form-checkbox>
                </div>
                <TxActionsInfo
                  v-if="isShowTXOperations"
                  class="mt-4"
                  :xdr="isTXTypeFee ? innerTX : xdr"
                />
              </div>
            </b-col>
            <b-col cols="12">
              <hr class="mt-5 mb-3" style="height: 2px; width: 100%;" />
              <!-- signatures -->
            </b-col>
          </b-row>
        </section>
      </div>
    </b-modal>
  </div>
</template>

<script>
const {
  Transaction,
  FeeBumpTransaction,
  TransactionBuilder
} = require("stellar-sdk");
import TransactionInfo from "@/views/modals/SignTransaction/TransactionInfo.vue";
import TxActionsInfo from "@/views/modals/SignTransaction/TxActionsInfo.vue";
import { BLOCKCHAIN_NETWORK_NAME } from "@/services/config";

export default {
  components: {
    TransactionInfo,
    TxActionsInfo
  },
  data() {
    return {
      isTXTypeFee: false,
      isShowTXOperations: false,
      innerTX: null
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
    xdr: {
      type: String,
      default: null
    }
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
      const tx = TransactionBuilder.fromXDR(this.xdr, BLOCKCHAIN_NETWORK_NAME);
      if (tx instanceof FeeBumpTransaction) {
        this.isTXTypeFee = true;
        this.innerTX = tx.innerTransaction.toXDR();
      } else this.isTXTypeFee = false;
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
