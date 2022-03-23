<template>
  <div>
    <b-modal
      v-model="value.isShow"
      footer-class="d-none"
      header-class="p-0"
      modal-class="w-100 p-0 d-flex justify-content-center"
      dialog-class="max-width-900px m-4"
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
            <i class="mdi  mdi-key-change"></i> Cloud Transaction Creation
          </span>
          <div class="cursor-pointer" @click="hideModalFn">
            <i class="mdi mdi-close-box-outline font-32 text-white"></i>
          </div>
        </div>
      </template>
      <div>
        <section
          class="d-flex flex-column align-items-start justify-content-start px-2"
        >
          <p class="text-muted font-15 font-weight-600 mb-2">
            Transactions are commands that modify the ledger state. They consist
            of a list of anywhere from 1 to 100 operations, and they are signed,
            submitted to the network, and considered for inclusion in the
            transaction set via SCP.
          </p>

          <p class="text-muted font-15 font-weight-600 mt-0">
            They contain the operations used to send payments, enter orders into
            the decentralized exchange, change settings on accounts, and
            authorize accounts to hold assets. If you think of the ledger as a
            database, then transactions are SQL commands.
          </p>

          <div class="w-100">
            <b-row>
              <b-col md="4" class="mt-0">
                <b-form-input
                  type="text"
                  label="Transaction Title"
                  placeholder="Transaction Title"
                  class="font-14 font-weight-600"
                  v-model="title"
                ></b-form-input>
              </b-col>
              <b-col md="6" class="mt-3"> </b-col>
            </b-row>
            <b-row>
              <b-col md="8" class="mt-3">
                <b-form-textarea
                  label="Transaction Description"
                  placeholder="Transaction Description..."
                  rows="4"
                  max-rows="8"
                  class="font-14 font-weight-600"
                  v-model="description"
                ></b-form-textarea>
              </b-col>
            </b-row>
          </div>

          <div
            class="border rounded p-3 font-13 font-weight-600 bg-light word-break-all mt-3"
          >
            {{ xdr }}

            <base-button
              class="btn btn-warning btn-sm mt-2 d-flex justify-content-start align-items-center font-14 text-light"
              type="submit"
              @click="copyToClipboardFn"
              nativeType="submit"
            >
              <i class="mdi mdi-content-copy text-white mr-1"></i> Copy to
              Clipboard
            </base-button>
          </div>

          <hr class="mt-4 mb-3" style="height: 2px; width: 100%;" />

          <base-button
            class="btn btn-primary btn-sm d-flex justify-content-center align-items-center font-16"
            type="submit"
            :loading="isLoading"
            @click="onSubmitFn"
            nativeType="submit"
          >
            <i class="mdi mdi-arrow-right-thick text-white mr-1"></i> Save
            Transaction
          </base-button>

          <hr class="my-3" style="height: 2px; width: 100%;" />
        </section>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { CreateTempTxnAPI } from "@/services/transaction.service";
import { BLOCKCHAIN_NETWORK_NAME } from "@/services/config";

export default {
  data() {
    return {
      isRefresh: false,
      isLoading: false,
      title: null,
      description: null
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
    xdr: String
  },
  methods: {
    copyToClipboardFn() {
      this.copyToClipboad(this.xdr);
    },
    async onSubmitFn() {
      this.isLoading = true;
      let payload = {
        title: this.title,
        description: this.description,
        txnXdr: this.xdr,
        network: BLOCKCHAIN_NETWORK_NAME
      };
      CreateTempTxnAPI(payload)
        .then(() => {
          this.isRefresh = true;
        })
        .finally(() => (this.isLoading = false));
    },
    hideModalFn() {
      this.value.isShow = false;
      this.$emit("onClose", {
        refresh: this.isRefresh
      });
    }
  }
};
</script>

<style scoped></style>
