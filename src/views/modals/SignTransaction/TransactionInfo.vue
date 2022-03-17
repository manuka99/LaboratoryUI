<template>
  <div>
    <h5 class="m-0 p-0">Transaction Overview</h5>
    <div class="mt-3 w-100 overflow-auto">
      <table class="w-100 border rounded">
        <tr
          class="border"
          v-for="item in items.slice(0, maxItems)"
          :key="item.name"
        >
          <td
            class="text-secondary font-weight-600 bg-white px-3 py-2 text-nowrap font-15"
          >
            {{ item.name }}
          </td>
          <td class="text-secondary font-weight-600 bg-white px-3 py-2">
            <div
              class="bg-light px-3 py-2 border border-light rounded font-15"
              style="word-break: break-all;"
            >
              {{ item.value }}
            </div>
          </td>
        </tr>
      </table>
    </div>
    <div class="mt-1">
      <a
        v-if="maxItems != undefined"
        @click="maxItems = undefined"
        class="font-14 font-weight-600 text-decoration-underline cursor-pointer"
      >
        View additional infomation?
      </a>
      <a
        v-if="maxItems == undefined"
        @click="maxItems = 4"
        class="font-14 font-weight-600 text-decoration-underline cursor-pointer text-danger"
      >
        Hide additional infomation?
      </a>
    </div>
  </div>
</template>

<script>
const {
  Transaction,
  FeeBumpTransaction,
  TransactionBuilder
} = require("stellar-sdk");
import { BLOCKCHAIN_NETWORK_NAME } from "@/services/config";

export default {
  data() {
    return {
      items: [],
      maxItems: 4
    };
  },
  props: {
    xdr: {
      type: String
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
      if (tx instanceof FeeBumpTransaction) this.setFeeBumpInfo(tx);
      if (tx instanceof Transaction) this.setTxInfo(tx);
    },
    setFeeBumpInfo(tx) {
      const items = [];
      items.push({
        name: "Blockchain Network",
        value: tx.networkPassphrase
      });
      items.push({
        name: "Transaction Hash",
        value: tx.hash().toString("hex")
      });
      items.push({
        name: "Fee Payer Account",
        value: tx.feeSource
      });
      items.push({
        name: "Total Fee (stroops)",
        value: parseFloat(tx.fee).toLocaleString()
      });
      items.push({
        name: "Fee Transaction XDR",
        value: tx.toXDR("base64")
      });
      items.push({
        name: "Inner Transaction Hash",
        value: tx.innerTransaction.hash().toString("hex")
      });
      items.push({
        name: "Inner Transaction Source",
        value: tx.innerTransaction.source
      });
      items.push({
        name: "Inner Transaction Sequence",
        value: tx.innerTransaction.sequence
      });
      items.push({
        name: "Inner Transaction Memo",
        value: tx.innerTransaction.memo.value
      });
      items.push({
        name: "Inner Transaction Timebound (Min)",
        value: new Date(
          parseInt(tx.innerTransaction.timeBounds.minTime)
        ).toLocaleTimeString("en-US", {
          timeZone: "Asia/Colombo",
          year: "2-digit",
          month: "2-digit",
          day: "2-digit"
        })
      });
      items.push({
        name: "Inner Transaction Timebound (Max)",
        value: new Date(
          parseInt(tx.innerTransaction.timeBounds.maxTime)
        ).toLocaleTimeString("en-US", {
          timeZone: "Asia/Colombo",
          year: "2-digit",
          month: "2-digit",
          day: "2-digit"
        })
      });
      items.push({
        name: "Inner Transaction XDR",
        value: tx.innerTransaction.toXDR()
      });
      items.push({
        name: "Inner Transaction Operations",
        value: tx.innerTransaction.operations.length
      });
      this.items = items;
    },
    setTxInfo(tx) {
      const items = [];
      items.push({
        name: "Blockchain Network",
        value: tx.networkPassphrase
      });
      items.push({
        name: "Transaction Hash",
        value: tx.hash().toString("hex")
      });
      items.push({
        name: "Source Account",
        value: tx.source
      });
      items.push({
        name: "Transaction Fee (stroops)",
        value: parseFloat(tx.fee).toLocaleString()
      });
      items.push({
        name: "Transaction Sequence",
        value: tx.sequence
      });
      items.push({
        name: "Transaction Memo",
        value: tx.memo.value
      });
      items.push({
        name: "Transaction Timebound (Min)",
        value: new Date(parseInt(tx.timeBounds.minTime)).toLocaleTimeString(
          "en-US",
          {
            timeZone: "Asia/Colombo",
            year: "2-digit",
            month: "2-digit",
            day: "2-digit"
          }
        )
      });
      items.push({
        name: "Transaction Timebound (Max)",
        value: new Date(parseInt(tx.timeBounds.maxTime)).toLocaleTimeString(
          "en-US",
          {
            timeZone: "Asia/Colombo",
            year: "2-digit",
            month: "2-digit",
            day: "2-digit"
          }
        )
      });
      items.push({
        name: "Transaction Operations",
        value: tx.operations.length
      });
      items.push({
        name: "Transaction XDR",
        value: tx.toXDR("base64")
      });
      this.items = items;
    }
  }
};
</script>

<style scoped>
@media screen and (max-width: 720px) {
  td {
    display: inline-block !important;
    width: 100%;
  }
}
</style>
