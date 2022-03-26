<template>
  <Layout>
    <main>
      <div class="container">
        <section
          class="section register mt-5 mb-5 d-flex flex-column align-items-center justify-content-center card px-3"
        >
          <h4 class="my-4 text-dark font-weight-600">
            <i class="mdi mdi-key-change mr-2"></i>Submit Blockchain Transaction
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
                  :disabled="loading || loading2"
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
                  :disabled="loading || loading2"
                ></b-form-input>

                <p
                  v-if="importTxnHashError.status"
                  class="text-danger font-weight-600 font-15 mt-1 mb-0"
                >
                  {{ importTxnHashError.description }}
                </p>
              </div>

              <base-button
                class="btn btn-info font-16 p-2 m-0 mt-4"
                v-if="importTxnHash"
                style="width: 240px"
                type="submit"
                :disabled="loading || loading2"
                @click="getTxnXdrFn"
                :loading="loading"
                nativeType="submit"
              >
                <i class="mdi mdi-key-change mr-2"></i>Fetch Transaction XDR
              </base-button>

              <hr style="height: 2px; width: 100%; margin: 32px 0px 0px 0px" />

              <div v-if="importTxnHash && xdr" class="mt-4">
                <h6 class="text-decoration-underline mb-3 ml-1">
                  Fetched Transaction Envelope XDR
                </h6>

                <div
                  class="border rounded p-3 font-13 font-weight-600 bg-light word-break-all"
                >
                  {{ xdr }}

                  <base-button
                    class="btn btn-warning btn-sm mt-2 d-flex justify-content-start align-items-center font-14 text-light"
                    type="submit"
                    @click="copyToClipboadFn(xdr)"
                    nativeType="submit"
                  >
                    <i class="mdi mdi-content-copy text-white mr-1"></i> Copy to
                    Clipboard
                  </base-button>
                </div>
              </div>

              <div v-if="xdr">
                <base-button
                  class="btn btn-primary font-16 p-2 m-0 mt-4"
                  v-if="xdr"
                  style="width: 240px"
                  type="submit"
                  :disabled="loading2"
                  @click="submitTxFn"
                  :loading="loading2"
                  nativeType="submit"
                >
                  <i class="mdi mdi-key-change mr-2"></i>Submit Transaction
                </base-button>

                <hr
                  style="height: 2px; width: 100%; margin: 32px 0px 0px 0px"
                />
              </div>

              <div class="mt-4 mb-5">
                <div v-if="submittedData">
                  <h6 class="text-decoration-underline mb-3 ml-1">
                    Submitted Transaction Information
                  </h6>

                  <div
                    class="border rounded p-3 font-13 font-weight-600 bg-light word-break-all"
                  >
                    <JsonViewer
                      :value="submittedData"
                      :expand-depth="1"
                    ></JsonViewer>

                    <base-button
                      class="btn btn-warning btn-sm mt-2 d-flex justify-content-start align-items-center font-14 text-light"
                      type="submit"
                      @click="copyToClipboadFn(submittedData)"
                      nativeType="submit"
                    >
                      <i class="mdi mdi-content-copy text-white mr-1"></i> Copy
                      to Clipboard
                    </base-button>
                  </div>
                </div>
              </div>
            </div>
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
import {
  SubmitTransactionsAPI,
  FormatTXValues
} from "@/services/stellar.service";
import Layout from "@/components/HorizontalLayout/Layout";
import JsonViewer from "vue-json-viewer";

export default {
  components: {
    Layout,
    JsonViewer
  },
  data() {
    return {
      xdr: null,
      loading: null,
      loading2: null,
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
      submitTxError: {
        status: false,
        description: null
      },
      submittedData: null
    };
  },
  methods: {
    initFn() {},
    getTxnXdrFn() {
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
          }
        })
        .finally(() => (this.loading = false));
    },
    onImportXdr() {
      this.xdr = null;
      this.signedXdr = null;
      this.importTxnHash = null;
      this.submittedData = null;
      this.importXdrError.status = false;
      this.importTxnHashError.status = false;
      this.submitTxError.status = false;
      this.loading = false;
      this.validateAndSetXDR(this.importXdr, this.importXdrError);
    },
    onImportTxnHash() {
      this.xdr = null;
      this.signedXdr = null;
      this.importXdr = null;
      this.submittedData = null;
      this.importXdrError.status = false;
      this.importTxnHashError.status = false;
      this.submitTxError.status = false;
      this.loading = false;
    },
    submitTxFn() {
      this.loading2 = true;
      SubmitTransactionsAPI(this.xdr)
        .then(res => {
          const formattedData = FormatTXValues(res);
          this.submittedData = formattedData;
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => (this.loading2 = false));
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
    copyToClipboadFn(data) {
      this.copyToClipboad(data);
    }
  }
};
</script>

<style scoped></style>
