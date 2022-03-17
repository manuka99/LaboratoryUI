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
const {
  TransactionBuilder,
  Transaction,
  FeeBumpTransaction
} = require("stellar-sdk");
import { BLOCKCHAIN_NETWORK_NAME } from "@/services/config";
import { FormatTXOperations } from "@/util/common";
import JsonViewer from "vue-json-viewer";
import { keys } from "d3";

export default {
  components: {
    JsonViewer
  },
  data() {
    return {
      items: [],
      maxItems: 4,
      operationOptions: [],
      selectedOperations: null
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
      if (tx instanceof FeeBumpTransaction)
        this.setOperationOptions(tx.innerTransaction);
      else this.setOperationOptions(tx);
    },
    setOperationOptions() {
      const tx = TransactionBuilder.fromXDR(this.xdr, BLOCKCHAIN_NETWORK_NAME);
      const txSource = tx.source;
      const xdrOperations = {
        "All Operations": tx.operations,
        [txSource]: []
      };

      // add operations based on account
      for (let index = 0; index < tx.operations.length; index++) {
        const operation = tx.operations[index];
        var source = txSource;
        if (operation.source) source = operation.source;
        // add to list
        if (xdrOperations[source]) xdrOperations[txSource].push(operation);
        else xdrOperations[source] = [operation];
      }

      // format filtered operations
      var formattedOperationOptions = [];
      for (
        let index2 = 0;
        index2 < Object.keys(xdrOperations).length;
        index2++
      ) {
        var key = Object.keys(xdrOperations)[index2];
        var value = xdrOperations[key];
        var formattedOperation = FormatTXOperations(value);
        formattedOperationOptions.push({
          value: formattedOperation,
          text: key
        });
      }
      this.operationOptions = [
        { value: null, text: "Select an account to view its operations..." },
        ...formattedOperationOptions
      ];
    },
    isObject(property) {
      return property instanceof Object;
    }
  }
};
</script>

<style scoped></style>
