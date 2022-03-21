<template>
  <div class="w-100 p-4 rounded" style="background: #00b33c">
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
          {{ xdr }}

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
              <span class="font-14">{{ preAuthSignature.shortPublicKey }}</span>
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
    <h5
      class="mt-4 mb-0 mx-0 pt-2 pb-0 px-0 text-white font-18"
      v-if="isOnline"
    >
      c) Online Transaction Signatures
    </h5>
  </div>
</template>

<script>
const { TransactionBuilder, Keypair, sign } = require("stellar-sdk");
import { BLOCKCHAIN_NETWORK_NAME } from "@/services/config";
import { TransactionPreAuthSignatures } from "@/services/stellar.service";

export default {
  data() {
    return {
      txXdrSignatures: [],
      preAuthSignatures: [],
      onlineSignatures: [],
      preAuthSignaturesLoading: false,
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
      handler(val) {
        if (val) this.onInitFn();
      },
      deep: true,
      immediate: true
    },
    isOnline: {
      handler(val) {
        if (val) this.getOnlineSignatures();
        else this.onlineSignatures = [];
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
      this.getTxXdrSignatures();
      this.getPreAuthSignatures();
      this.getOnlineSignatures();
    },
    getTxXdrSignatures() {
      const tx = TransactionBuilder.fromXDR(this.xdr, BLOCKCHAIN_NETWORK_NAME);
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
      this.copyToClipboad(this.xdr);
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
    getOnlineSignatures() {
      const tx = TransactionBuilder.fromXDR(this.xdr, BLOCKCHAIN_NETWORK_NAME);
      let hash = tx.hash().toString("hex");
      console.log(hash);
    }
  }
};
</script>

<style scoped></style>
