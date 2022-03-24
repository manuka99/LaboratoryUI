<template>
  <Layout>
    <main>
      <div class="container">
        <section
          class="section register mt-5 mb-5 d-flex flex-column align-items-center justify-content-center card px-3"
        >
          <h4 class="my-4 text-dark font-weight-600">
            <i class="mdi mdi-key-change mr-2"></i>Sign Blockchain Transaction
          </h4>
          <div class="mt-0" style="max-width: 100%;">
            <div>
              <p class="font-15 text-muted m-0 p-0">
                Stellar uses signatures as authorization. Transactions always
                need authorization from at least one public key in order to be
                considered valid. Generally, transactions only need
                authorization from the public key of the source account.
                Transaction signatures are created by cryptographically signing
                the transaction object contents with a secret key. Stellar
                currently uses the ed25519 signature scheme, but there’s also a
                mechanism for adding additional types of public/private key
                schemes. A transaction with an attached signature is considered
                to have authorization from that public key.
                <a
                  href="https://developers.stellar.org/docs/glossary/multisig/"
                  target="_blank"
                >
                  Learn more.</a
                >
              </p>

              <hr style="height: 2px; width: 100%; margin: 26px 0px" />

              <h5 class="mb-3 text-muted" style="font-size: 18px">
                1) Import a transaction envelope
              </h5>

              <!-- import -->
              <div class="p-4 bg-light">
                <h6 class="mb-3 text-muted" style="font-size: 16px">
                  a) From Transaction XDR
                </h6>

                <textarea
                  label="Blockchain Description"
                  placeholder="Example: AAAAAGXNhB2hIkbP//jgzn4os/AAAAZAB+BaLPAAA5Q/xL..."
                  rows="8"
                  max-rows="20"
                  class="font-14 font-weight-600 border rounded p-2"
                  style="resize: auto; width: 480px; max-width: 100%"
                  v-model="importXdr"
                  @input="onImportXdr"
                  :disabled="loading"
                ></textarea>

                <p
                  v-if="importXdrError.status"
                  class="text-danger font-weight-600 font-15 mt-1 mb-0"
                >
                  {{ importXdrError.description }}
                </p>

                <h5 class="my-3 text-muted" style="font-size: 18px">
                  --------- or ---------
                </h5>

                <h6 class="mb-3 text-muted" style="font-size: 16px">
                  b) From Transaction Hash
                  <small class="text-muted font-weight-600"
                    >(Only for online signing)</small
                  >
                </h6>

                <b-form-input
                  type="text"
                  placeholder="Example 214ca2dbcbeb4b32....."
                  class="font-14 font-weight-600 max-width-500px"
                  v-model="importTxnHash"
                  @input="onImportTxnHash"
                  :disabled="loading"
                ></b-form-input>

                <p
                  v-if="importTxnHashError.status"
                  class="text-danger font-weight-600 font-15 mt-1 mb-0"
                >
                  {{ importTxnHashError.description }}
                </p>
              </div>

              <h5 class="my-4 text-muted" style="font-size: 18px">
                2) Select Signing Mode
              </h5>

              <div>
                <b-form-select
                  class="w-auto"
                  v-model="isOnline"
                  :options="signingModeOptions"
                  :disabled="loading || isDisableSelect"
                ></b-form-select>
              </div>

              <hr style="height: 2px; width: 100%; margin: 32px 0px 24px 0px" />

              <div v-if="isCreateTempTxnMsg">
                <p
                  class="text-danger font-weight-600 font-15 font-italic mb-3 p-0"
                >
                  There is no transaction saved under your account on the cloud.
                  If this transaction was not saved by anyone else then you can
                  save this transaction temporary on cloud. Temporary
                  transactions will only exist for a maximum of 30 days.
                </p>
                <base-button
                  class="btn btn-secondary btn-sm font-15 mt-0 mb-4"
                  type="submit"
                  @click="createTempTxnModal.isShow = true"
                  nativeType="submit"
                >
                  <i class="mdi mdi-content-save font-16"></i> Save Transaction
                  on Cloud
                </base-button>

                <hr
                  style="height: 2px; width: 100%; margin: 8px 0px 24px 0px"
                />
              </div>

              <base-button
                class="btn btn-primary font-18 p-2 m-0"
                style="width: 240px"
                type="submit"
                :disabled="
                  importXdrError.status ||
                    importTxnHashError.status ||
                    !(importXdr || importTxnHash)
                "
                @click="getTxnXdrFn"
                :loading="loading"
                nativeType="submit"
              >
                <i class="mdi mdi-key-change mr-2"></i>Sign Transaction
              </base-button>

              <hr style="height: 2px; width: 100%; margin: 32px 0px 60px 0px" />

              <div
                v-if="signedXdr"
                class="border rounded p-3 font-13 font-weight-600 bg-light word-break-all"
              >
                {{ signedXdr }}

                <base-button
                  class="btn btn-warning btn-sm mt-2 d-flex justify-content-start align-items-center font-14 text-light"
                  type="submit"
                  @click="copyToClipboadFn"
                  nativeType="submit"
                >
                  <i class="mdi mdi-content-copy text-white mr-1"></i> Copy to
                  Clipboard
                </base-button>
              </div>
            </div>
            <SignTransactionModal
              v-if="xdr"
              :xdr="xdr"
              :isOnline="isOnline"
              v-model="signTransactionModal"
              @onClose="onCloseSignTransactionModalFn"
            />
            <CreateTempTxnModal
              v-if="createTempTxnModal.isShow"
              :xdr="xdr"
              v-model="createTempTxnModal"
              @onClose="onCloseCreateTempTxnModalFn"
            />
          </div>
        </section>
      </div>
    </main>
  </Layout>
</template>

<script>
const { TransactionBuilder } = require("stellar-sdk");
import { BLOCKCHAIN_NETWORK_NAME } from "@/services/config";
import { FindTransactionsAPI } from "@/services/transaction.service";
import Layout from "@/components/HorizontalLayout/Layout";
import SignTransactionModal from "@/views/modals/SignTransactionModal.vue";
import CreateTempTxnModal from "@/views/modals/CreateTempTxnModal.vue";

export default {
  components: {
    Layout,
    SignTransactionModal,
    CreateTempTxnModal
  },
  data() {
    return {
      xdr: null,
      loading: null,
      importXdr: null,
      importTxnHash: null,
      importXdrError: {
        status: false,
        description: null
      },
      importTxnHashError: {
        status: false,
        description: null
      },
      signTransactionModal: {
        isShow: false,
        xdr: ""
      },
      createTempTxnModal: {
        isShow: false
      },
      isOnline: false,
      signingModeOptions: [
        { value: false, text: "Offline Transaction Signing" },
        { value: true, text: "Online Transaction Signing" }
      ],
      isCreateTempTxnMsg: false,
      isDisableSelect: false,
      signedXdr: null
    };
  },
  watch: {
    isOnline() {
      this.isCreateTempTxnMsg = false;
      this.xdr = null;
      this.signedXdr = null;
    }
  },
  methods: {
    initFn() {},
    onCloseSignTransactionModalFn(data) {
      console.log(data)
      if (data && data.signedXdr) this.signedXdr = signedXdr;
    },
    onCloseCreateTempTxnModalFn(data) {
      if (data && data.refresh) {
        this.getTxnXdrFn();
      }
    },
    getTxnXdrFn() {
      this.isCreateTempTxnMsg = false;
      if (this.importXdr) {
        this.validateAndSetXDR(this.importXdr, this.importTxnHashError);
        if (this.xdr) {
          if (this.isOnline) {
            this.loading = true;
            FindTransactionsAPI({
              txnXdr: this.xdr,
              network: BLOCKCHAIN_NETWORK_NAME
            })
              .then(res => {
                let txns = res.data.data.txns;
                if (!txns || txns.length == 0) this.isCreateTempTxnMsg = true;
                else this.signTransactionModal.isShow = true;
              })
              .finally(() => (this.loading = false));
          } else this.signTransactionModal.isShow = true;
        }
      } else if (this.importTxnHash) {
        this.loading = true;
        FindTransactionsAPI({
          txnHash: this.importTxnHash,
          network: BLOCKCHAIN_NETWORK_NAME
        })
          .then(res => {
            let txns = res.data.data.txns;
            if (!txns || txns.length == 0) {
              this.importTxnHashError.description =
                "Transaction was not found on cloud, this may be due to the transaction been expired, lack of permissions or it does not exist.";
              this.importTxnHashError.status = true;
            } else {
              let xdr = txns[0].txnXdr;
              this.validateAndSetXDR(xdr, this.importTxnHashError);
              this.loading = false;
              if (this.xdr) this.signTransactionModal.isShow = true;
            }
          })
          .finally(() => (this.loading = false));
      }
    },
    onImportXdr() {
      this.xdr = null;
      this.signedXdr = null;
      this.importTxnHash = null;
      this.importXdrError.status = false;
      this.importTxnHashError.status = false;
      this.loading = false;
      this.isCreateTempTxnMsg = false;
      this.validateAndSetXDR(this.importXdr, this.importXdrError);
      this.isDisableSelect = false;
    },
    onImportTxnHash() {
      this.xdr = null;
      this.signedXdr = null;
      this.importXdr = null;
      this.importXdrError.status = false;
      this.importTxnHashError.status = false;
      this.loading = false;
      this.isCreateTempTxnMsg = false;
      if (this.importTxnHash) {
        this.isDisableSelect = true;
        this.isOnline = true;
      } else this.isDisableSelect = false;
    },
    validateAndSetXDR(xdr, errorObj) {
      try {
        // disable error
        errorObj.status = false;
        if (!xdr) return;
        const tx = TransactionBuilder.fromXDR(xdr, BLOCKCHAIN_NETWORK_NAME);
        this.xdr = tx.toXDR("base64");
      } catch (error) {
        errorObj.description =
          "Unable to parse input XDR into Transaction Envelope";
        errorObj.status = true;
      }
    },
    copyToClipboadFn() {
      this.copyToClipboad(this.signedXdr);
    }
  }
};

//AAAAAgAAAAC2bCx393CCpwrwp67OKZjWCHBPgRyy08K8aG1n4DXQ1gAAAMgAAHPRAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAACgAAAAU0MzQzNAAAAAAAAAEAAAAEd2UyMgAAAAAAAAAKAAAACTMzNDJmZmRmZAAAAAAAAAEAAAADMzQzAAAAAAAAAAAD4DXQ1gAAAECrRdkUu5K3GIEMlXlVqPpwDsvWmBaoaiuE1MM+3HwlM//y8v0CX4IHYmHzGZYK7/pwgEKvfoEWFZLzAwQv+pkPOiW5hAAAAEBR72uDgeO/6gBV1IMPODvGJstumTRjasUCsEha0Ahvn71ofFKlJ/gw75esapSFgPqMjwJrzyu2z6qbX9E6sYsK8mwYpAAAACAPaprWGHVRiXxRz93wR2BHdGMqsGfZR/zLS/FTmdr+YA==
</script>

<style scoped></style>
