<template>
  <div class="w-100">
    <h5 class="m-0 p-0">Transaction Signatures</h5>
    <b-form-select
      class="w-auto mt-3"
      style="max-width: 100%"
      v-model="selectedOperations"
      :options="operationOptions"
    ></b-form-select>
    <!-- show operations -->
  </div>
</template>

<script>
const { TransactionBuilder, FeeBumpTransaction } = require("stellar-sdk");
import { BLOCKCHAIN_NETWORK_NAME } from "@/services/config";
import {
  GroupTxOpsSigners,
  CalculateTxAccountReserves,
  AccountRiskLevelForTransaction
} from "@/services/stellar.service";

export default {
  data() {
    return {
      items: [],
      maxItems: 4,
      operationOptions: [],
      selectedOperations: null,
      signatureInfo: null
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
      this.getOperationOptions();
    },
    getOperationOptions() {
      const tx = TransactionBuilder.fromXDR(this.xdr, BLOCKCHAIN_NETWORK_NAME);
      if (tx instanceof FeeBumpTransaction) {
        this.signatureInfo = [
          { accountID: tx.feeSource, fee: tx.fee, reserves: 0, signatures: [] }
        ];
      } else {
        const groupTxOpsSigners = GroupTxOpsSigners(this.xdr);
        const allSignatureInfo = [];
        for (
          let index = 0;
          index < Object.keys(groupTxOpsSigners).length;
          index++
        ) {
          var key = Object.keys(groupTxOpsSigners)[index];
          var value = groupTxOpsSigners[key];
          allSignatureInfo.push({
            accountID: key,
            fee: tx.source == key ? tx.fee : 0,
            reserves: "processing",
            operations: value.length,
            risk: "processing",
            signatures: []
          });
        }
        this.signatureInfo = allSignatureInfo;
        this.calculateAllAccountRisk();
        this.calculateAllAccountReserves();
      }
    },
    async calculateAllAccountReserves() {
      for (let index = 0; index < this.signatureInfo.length; index++) {
        const signatureInfo = this.signatureInfo[index];
        var reserves = await CalculateTxAccountReserves(
          signatureInfo.accountID,
          this.xdr
        );
        signatureInfo.reserves = `${reserves} XLM`;
      }
      console.log(this.signatureInfo);
    },
    async calculateAllAccountRisk() {
      for (let index = 0; index < this.signatureInfo.length; index++) {
        const signatureInfo = this.signatureInfo[index];
        var risk = await AccountRiskLevelForTransaction(
          signatureInfo.accountID,
          this.xdr
        );
        signatureInfo.risk = risk;
      }
      console.log(this.signatureInfo);
    },
    isObject(property) {
      return property instanceof Object;
    }
  }
};
</script>

<style scoped></style>
