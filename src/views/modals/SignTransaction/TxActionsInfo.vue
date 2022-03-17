<template>
  <div>
    <h5 class="m-0 p-0">Transaction Operations</h5>
    <b-form-select
      class="w-auto"
      v-model="selectedOperations"
      :options="operationOptions"
    ></b-form-select>
    <!-- show operations -->
    <div
      style="max-height: 68vh"
      v-if="selectedOperations"
      class="overflow-y-auto mt-4 pt-4 px-4 bg-light"
    >
      <div
        class="card mb-4 font-14 font-weight-600 text-muted"
        v-for="(operation, index) in selectedOperations"
        :key="index"
      >
        <!-- header -->
        <div class="px-3 py-2 bg-dark text-white">
          <h6 class="m-1 p-0">
            Operation {{ index + 1 }} - {{ operation.Type }}
          </h6>
        </div>
        <!-- body -->
        <div class="p-3">
          <template v-for="(property, index2) in Object.keys(operation)">
            <div :key="index2">
              <div
                v-if="
                  Array.isArray(operation[property]) ||
                    isObject(operation[property])
                "
                class="mt-0 mb-2"
              >
                <span class="mt-0 mb-2">{{ index2 + 1 }}) {{ property }}</span>
                <JsonViewer
                  class="mt-2"
                  :value="operation[property]"
                  :expand-depth="3"
                ></JsonViewer>
              </div>
              <p v-else class="mt-0 mb-2">
                {{ index2 + 1 }}) {{ property }} -
                {{ operation[property] ? operation[property] : "none" }}
              </p>
            </div>
          </template>
        </div>
      </div>
    </div>
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
      selectedOperations: null,
      operationOptions: []
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
      const xdrOperations = {};

      for (let index = 0; index < tx.operations.length; index++) {
        const operation = tx.operations[index];
        var source = txSource;
        if (operation.source) source = operation.source;
        // add to list
        if (xdrOperations[source]) xdrOperations[txSource].push(operation);
        else xdrOperations[source] = [operation];
      }

      xdrOperations["all"] = tx.operations;

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

      this.operationOptions = formattedOperationOptions;
    },
    isObject(property) {
      return property instanceof Object;
    }
  }
};
</script>

<style scoped></style>
