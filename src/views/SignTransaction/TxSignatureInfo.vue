<template>
  <div class="w-100 p-4 rounded" style="background: #00b33c">
    <h5 class="mt-1 mb-0 p-0 text-white font-18">a) Existing Transaction Signatures</h5>
    <!-- txXdrSignatures -->
    <div
      class="card mt-4 p-0 d-flex flex-sm-row flex-nowrap align-items-stretch"
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
        class="d-flex flex-column p-3 justify-content-center align-items-start"
      >
        <div>
          <span class="font-weight-600 font-16">Hint: </span>
          <span class="font-15">{{ txXdrSignature.hint }}</span>
        </div>
        <div>
          <span class="font-weight-600 font-15">Signature: </span>
          <span class="font-15 word-break-all">{{ txXdrSignature.sign }}</span>
        </div>
      </div>
    </div>
    <!-- online signatures -->
    <h5 class="mt-4 mb-0 mx-0 pt-2 pb-0 px-0 text-white font-18">
      b) Online Transaction Signatures
    </h5>
  </div>
</template>

<script>
const { TransactionBuilder, Keypair } = require("stellar-sdk");
import { BLOCKCHAIN_NETWORK_NAME } from "@/services/config";

export default {
  data() {
    return {
      txXdrSignatures: [],
      onlineSignatures: []
    };
  },
  props: {
    xdr: String,
    isOnline: Boolean
  },
  watch: {
    xdr: {
      handler(val) {
        if (val) this.getTxXdrSignatures();
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
    }
  },
  methods: {
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
    getOnlineSignatures() {
      const tx = TransactionBuilder.fromXDR(this.xdr, BLOCKCHAIN_NETWORK_NAME);
      let hash = tx.hash().toString("hex");
      console.log(hash);
    }
  }
};
</script>

<style scoped></style>
