<template>
  <div class="w-100 p-4 rounded" style="background: #00b33c">
    <b-form-select
      class="w-auto mt-0"
      style="max-width: 100%"
      v-model="selectedOperations"
      :options="operationOptions"
    ></b-form-select>
    <!-- show operations -->
    <div
      style="max-height: 68vh; width: 100%"
      v-if="selectedOperations"
      class="overflow-y-auto mt-4 pt-3 px-3 bg-white rounded border"
    >
      <div
        class="card mb-3 font-14 font-weight-600 text-muted rounded"
        v-for="(operation, index) in selectedOperations"
        :key="index"
      >
        <!-- header -->
        <div class="px-2 py-1 bg-dark text-white">
          <h6 class="m-1 p-0 font-15">
            Operation {{ index + 1 }} - {{ operation.Type }}
          </h6>
        </div>
        <!-- body -->
        <div class="p-2">
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
import { GroupTxOpsSigners } from "@/services/stellar.service";

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
    setOperationOptions(tx) {
      const groupTxOpsSigners = GroupTxOpsSigners(
        tx.toXDR("base64"),
        true,
        true
      );
      const formattedOperationOptions = [];
      for (
        let index = 0;
        index < Object.keys(groupTxOpsSigners).length;
        index++
      ) {
        var key = Object.keys(groupTxOpsSigners)[index];
        var value = groupTxOpsSigners[key];
        formattedOperationOptions.push({
          text: key,
          value
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

<style scoped>
.table-card {
  box-shadow: 0 0 1rem 0 rgba(136, 152, 170, 0.15) !important;
  border-radius: 10px !important;
  overflow: hidden;
  border: 1px solid #8898aa3a;
}

table th {
  background-color: #f6f9fc !important;
  color: #8898aa;
  font-weight: 600;
  border-bottom: 0px !important;
  font-size: 14px !important;
  text-overflow: ellipsis;
  white-space: nowrap;
}

table th {
  padding: 14px 20px !important;
}

table td {
  padding: 20px !important;
  background-color: #8898aa;
}
</style>
