<template>
  <div class="w-100">
    <h5 class="m-0 p-0">Existing Transaction Signatures</h5>
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
      // this.getOperationOptions();
    },
  }
};
</script>

<style scoped></style>
