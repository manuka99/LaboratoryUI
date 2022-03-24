<template>
  <div class="w-100 p-4 rounded" style="background: #00b33c">
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
    <div v-else>
      <h5 class="mt-1 mb-0 p-0 text-white font-18">
        a) Existing Transaction Signatures
      </h5>
      <!-- txXdrSignatures -->
      <div
        v-if="txXdrSignatures.length > 0"
        style="max-height: 48vh; width: 100%; overflow-y: auto"
        class="mt-4 bg-white border rounded pt-3 px-3"
      >
        <div
          class="card mb-3 p-0 d-flex flex-sm-row flex-nowrap align-items-stretch"
          v-for="(txXdrSignature, index) in txXdrSignatures"
          :key="index"
        >
          <!-- header -->
          <div
            class="p-3 bg-light d-flex justify-content-center align-items-center"
          >
            <span class="font-weight-600 font-16">{{ index + 1 }} </span>
          </div>
          <!-- body -->
          <div
            class="d-flex flex-column p-2 justify-content-center align-items-start"
          >
            <div>
              <span class="font-weight-600 font-14">Hint: </span>
              <span class="font-14">{{ txXdrSignature.hint }}</span>
            </div>
            <div>
              <span class="font-weight-600 font-14">Signature: </span>
              <span class="font-14 word-break-all">{{
                txXdrSignature.sign
              }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <p
          class="font-14 font-italic font-weight-bold text-white mt-2 mb-0 mx-4 p-0"
        >
          No Existing Transaction Signatures
        </p>
      </div>

      <div class="mt-3" v-if="txXdrSignatures.length > 0">
        <div v-if="!showSignedXdr">
          <button
            @click="showSignedXdr = true"
            class="btn btn-primary font-14 font-weight-600 cursor-pointer text-white border-white"
          >
            View Signed Transaction XDR
          </button>
        </div>
        <div v-if="showSignedXdr">
          <button
            @click="showSignedXdr = false"
            class="btn btn-danger mb-3 font-14 font-weight-600 cursor-pointer text-white border-white"
          >
            Hide Signed Transaction XDR
          </button>
          <div
            class="border rounded p-3 font-13 font-weight-600 bg-light word-break-all"
          >
            {{ onlineSignedXdr ? onlineSignedXdr : xdr }}

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
      </div>

      <!-- pre auth signatures -->
      <h5 class="mt-4 mb-0 mx-0 pt-2 pb-0 px-0 text-white font-18">
        b) Pre-Auth Transaction Signatures
      </h5>

      <!-- preAuthSignatures -->
      <div
        v-if="preAuthSignaturesLoading"
        style="min-height: 80px;"
        class="d-flex justify-content-start ml-4 mt-2 align-items-center"
      >
        <b-spinner
          variant="white"
          label="Spinning"
          style="width: 40px; height: 40px;"
        ></b-spinner>
      </div>

      <div v-else>
        <div
          v-if="preAuthSignatures.length > 0"
          style="max-height: 48vh; width: 100%; overflow-y: auto"
          class="mt-4 bg-white border rounded pt-3 px-3"
        >
          <div
            class="card mb-3 p-0 d-flex flex-sm-row flex-nowrap align-items-stretch"
            v-for="(preAuthSignature, index) in preAuthSignatures"
            :key="index"
          >
            <!-- header -->
            <div
              class="p-3 bg-light d-flex justify-content-center align-items-center"
            >
              <span class="font-weight-600 font-16">{{ index + 1 }} </span>
            </div>
            <!-- body -->
            <div
              class="d-flex flex-column p-2 justify-content-center align-items-start"
            >
              <div>
                <span class="font-weight-600 font-14">Public Key: </span>
                <span class="font-14">{{
                  preAuthSignature.shortPublicKey
                }}</span>
              </div>
              <div>
                <span class="font-weight-600 font-14">Signature Weight: </span>
                <span
                  class="font-14 word-break-all text-uppercase font-weight-600"
                  :class="
                    preAuthSignature.risk == 'high'
                      ? 'text-danger'
                      : preAuthSignature.risk == 'medium'
                      ? 'text-warning'
                      : preAuthSignature.risk == 'low'
                      ? 'text-info'
                      : 'text-secondary'
                  "
                  >{{ preAuthSignature.risk }}</span
                >
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <p
            class="font-14 font-italic font-weight-bold text-white mt-2 mb-0 mx-4 p-0"
          >
            No Pre Auth Transactions
          </p>
        </div>
      </div>

      <!-- online signatures -->
      <div v-if="isOnline">
        <h5 class="mt-4 mb-0 mx-0 pt-2 pb-0 px-0 text-white font-18">
          c) Online Transaction Signatures
        </h5>

        <!-- onlineSignatures -->
        <div
          v-if="onlineSignaturesLoading"
          style="min-height: 80px;"
          class="d-flex justify-content-start ml-4 mt-2 align-items-center"
        >
          <b-spinner
            variant="white"
            label="Spinning"
            style="width: 40px; height: 40px;"
          ></b-spinner>
        </div>

        <div v-else>
          <div
            v-if="onlineSignatures.length > 0"
            style="max-height: 48vh; width: 100%; overflow-y: auto"
            class="mt-4 bg-white border rounded pt-3 px-3"
          >
            <div
              class="card mb-3 p-0 d-flex flex-sm-row flex-nowrap align-items-stretch"
              v-for="(onlineSignature, index) in onlineSignatures"
              :key="index"
            >
              <!-- header -->
              <div
                class="p-3 bg-light d-flex justify-content-center align-items-center"
              >
                <span class="font-weight-600 font-16">{{ index + 1 }} </span>
              </div>
              <!-- body -->
              <div
                class="d-flex flex-column p-2 justify-content-center align-items-start"
              >
                <div>
                  <span class="font-weight-600 font-14">Public Key: </span>
                  <span class="font-14 word-break-all">{{
                    onlineSignature.accountID
                  }}</span>
                </div>
                <div>
                  <span class="font-weight-600 font-14">Signature: </span>
                  <span class="font-14 word-break-all">{{
                    onlineSignature.sign
                  }}</span>
                </div>
                <div v-if="onlineSignature.user">
                  <span class="font-weight-600 font-14"
                    >Placed by (User):
                  </span>
                  <a
                    :href="'/explorer/user?id=' + onlineSignature.user._id"
                    target="_blank"
                    class="font-weight-600 font-14"
                    >{{ onlineSignature.user.firstName
                    }}{{ onlineSignature.user.middleName }}
                    {{
                      onlineSignature.user.nationalID &&
                        "(NIC - " + onlineSignature.user.nationalID + ")"
                    }}
                  </a>
                </div>
                <div class="d-flex my-2">
                  <base-button
                    v-if="onlineSignature.isAccepted"
                    :loading="onlineSignature.isLoading1"
                    :disabled="
                      onlineSignature.isLoading1 || onlineSignature.isLoading2
                    "
                    @click="toggleAcceptRejectSignFn(onlineSignature, false)"
                    type="submit"
                    class="btn btn-sm btn-outline-danger mr-2 py-1 px-3 font-13 font-weight-600"
                  >
                    <i class="mdi mdi-close-box-outline"></i> Reject Sign
                  </base-button>
                  <base-button
                    v-else
                    :loading="onlineSignature.isLoading1"
                    :disabled="
                      onlineSignature.isLoading1 || onlineSignature.isLoading2
                    "
                    @click="toggleAcceptRejectSignFn(onlineSignature, true)"
                    type="submit"
                    class="btn btn-sm btn-outline-primary mr-2 py-1 px-3 font-13 font-weight-600"
                  >
                    <i class="mdi mdi-checkbox-marked-outline"></i> Accept Sign
                  </base-button>
                  <base-button
                    :loading="onlineSignature.isLoading2"
                    :disabled="
                      onlineSignature.isLoading1 || onlineSignature.isLoading2
                    "
                    @click="deleteSignFn(onlineSignature)"
                    type="submit"
                    class="btn btn-sm btn-danger py-1 px-3 font-13 font-weight-600"
                  >
                    <i class="mdi mdi-delete"></i> Delete Sign Forever
                  </base-button>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <p
              class="font-14 font-italic font-weight-bold text-white mt-2 mb-0 mx-4 p-0"
            >
              No Online Transactions
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const { TransactionBuilder, Keypair, sign } = require("stellar-sdk");
import { BLOCKCHAIN_NETWORK_NAME } from "@/services/config";
import { TransactionPreAuthSignatures } from "@/services/stellar.service";
import {
  FindTransactionsAPI,
  AcceptRejectSignAPI,
  RemoveSignAPI
} from "@/services/transaction.service";

export default {
  data() {
    return {
      isLoading: false,
      txnHash: null,
      txXdrSignatures: [],
      preAuthSignatures: [],
      onlineSignatures: [],
      preAuthSignaturesLoading: false,
      onlineSignaturesLoading: false,
      onlineSignedXdr: null,
      showSignedXdr: false
    };
  },
  props: {
    xdr: String,
    isOnline: Boolean,
    refreshSignatures: Boolean
  },
  watch: {
    xdr: {
      handler() {
        this.onInitFn();
      },
      deep: true,
      immediate: true
    },
    isOnline: {
      handler() {
        this.onInitFn();
      },
      deep: true,
      immediate: true
    },
    refreshSignatures() {
      this.onInitFn();
    }
  },
  methods: {
    onInitFn() {
      try {
        this.isLoading = true;
        this.onlineSignedXdr = null;
        const tx = TransactionBuilder.fromXDR(
          this.xdr,
          BLOCKCHAIN_NETWORK_NAME
        );
        let txnHash = tx.hash().toString("hex");
        this.txnHash = txnHash;
        if (!this.isOnline) {
          this.getTxXdrSignatures();
          this.getPreAuthSignatures();
          this.isLoading = false;
          return;
        }
        // for online
        FindTransactionsAPI({
          txnHash,
          network: BLOCKCHAIN_NETWORK_NAME
        })
          .then(res => {
            let txns = res.data.data.txns;
            if (txns && txns.length > 0) {
              var signedTxnXdr = txns[0].signedTxnXdr
                ? txns[0].signedTxnXdr
                : this.xdr;
              this.onlineSignedXdr = signedTxnXdr;
              this.getTxXdrSignatures(signedTxnXdr);
              this.getPreAuthSignatures();
              this.processOnlineSignatures(txns[0]);
            } else this.onErrorFn({});
          })
          .finally(() => (this.isLoading = false));
      } catch (error) {
        this.isLoading = false;
        this.onErrorFn(error);
      }
    },
    getTxXdrSignatures(xdr = this.xdr) {
      const tx = TransactionBuilder.fromXDR(xdr, BLOCKCHAIN_NETWORK_NAME);
      this.txXdrSignatures = tx.signatures.map(signature => {
        let sign = signature.signature().toString("base64");
        let partialPublicKey = Buffer.concat([
          new Buffer.allocUnsafe(28).fill(0),
          signature.hint()
        ]);
        let keypair = new Keypair({
          type: "ed25519",
          publicKey: partialPublicKey
        });
        let hint =
          "G" +
          new Buffer.allocUnsafe(9).fill(".").toString() +
          keypair.publicKey().substring(46);
        return {
          hint,
          sign
        };
      });
    },
    copyToClipboadFn() {
      const xdr = this.onlineSignedXdr ? this.onlineSignedXdr : this.xdr;
      this.copyToClipboad(xdr);
    },
    async getPreAuthSignatures() {
      this.preAuthSignaturesLoading = true;
      TransactionPreAuthSignatures(this.xdr)
        .then(signers => {
          this.preAuthSignatures = Object.keys(signers).map(signer => {
            let shortPublicKey = `${signer.substr(0, 10)}......${signer.substr(
              -5
            )}`;
            let weight = signers[signer].sign.weight;
            let low_threshold = signers[signer].thresholds.low_threshold;
            let med_threshold = signers[signer].thresholds.med_threshold;
            let high_threshold = signers[signer].thresholds.high_threshold;
            return {
              shortPublicKey,
              weight,
              risk:
                weight >= high_threshold
                  ? "high"
                  : weight >= med_threshold
                  ? "medium"
                  : weight >= low_threshold
                  ? "low"
                  : "locked"
            };
          });
        })
        .finally(() => (this.preAuthSignaturesLoading = false));
    },
    toggleAcceptRejectSignFn(onlineSignature, isAccepted) {
      onlineSignature.isLoading2 = true;
      let payload = {
        signID: onlineSignature._id,
        txnHash: this.txnHash,
        network: BLOCKCHAIN_NETWORK_NAME,
        isAccepted
      };
      AcceptRejectSignAPI(payload).finally(() => this.onErrorFn({}));
    },
    deleteSignFn(onlineSignature) {
      onlineSignature.isLoading2 = true;
      let payload = {
        signID: onlineSignature._id,
        accountID: onlineSignature.accountID,
        txnHash: this.txnHash,
        network: BLOCKCHAIN_NETWORK_NAME,
        sign: onlineSignature.sign
      };
      RemoveSignAPI(payload).finally(() => this.onErrorFn({}));
    },
    processOnlineSignatures(txn) {
      if (txn && txn.signatures) {
        this.onlineSignatures = txn.signatures.map(signature => {
          return {
            ...signature,
            isLoading1: false,
            isLoading2: false
          };
        });
      } else this.onlineSignatures = [];
    },
    onErrorFn(error) {
      this.$emit("onError", error);
    }
  }
};
</script>

<style scoped></style>
