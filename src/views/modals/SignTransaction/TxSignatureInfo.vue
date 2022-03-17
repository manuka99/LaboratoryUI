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
import { GetAccount } from "@/services/stellar.service";

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
        const txSource = tx.source;
        const signatureInfo = [
          {
            accountID: txSource,
            fee: tx.fee,
            reserves: 0,
            operations: 0,
            signatures: []
          }
        ];
        for (let index = 0; index < tx.operations.length; index++) {
          const operation = tx.operations[index];
          var source = txSource;
          if (operation.source) source = operation.source;
          // add to list
          var i = signatureInfo.findIndex(crnt => crnt.accountID == source);
          if (i == -1) {
            signatureInfo.push({
              accountID: source,
              fee: 0,
              reserves: 0,
              operations: 0,
              signatures: []
            });
            i = signatureInfo.length - 1;
          }
          signatureInfo[i].operations = signatureInfo[i].operations + 1;
        }
        this.signatureInfo = signatureInfo;
        this.calculateAllAccountReserves(tx.operations);
      }
    },
    async calculateAllAccountReserves(operations) {
      const newSignatureInfo = [];
      for (let index = 0; index < this.signatureInfo.length; index++) {
        const signatureInfo = this.signatureInfo[index];
        for (let index2 = 0; index2 < operations.length; index2++) {
          const operation = operations[index2];
          var reserve = await this.calculateAccountReserves(
            signatureInfo.accountID,
            operation
          );
          signatureInfo.reserves = signatureInfo.reserves + reserve;
        }
      }
      this.signatureInfo = newSignatureInfo;
    },
    async calculateAccountReserves(accountID, operation) {
      const account = await GetAccount(accountID);
      console.log(account);
      if (!account) return 0;
      switch (operation.type) {
        case "createAccount":
          break;

        case "manageData":
          break;

        case "changeTrust":
          break;

        case "beginSponsoringFutureReserves":
          break;

        case "setOptions":
          break;

        case "createClaimableBalance":
          break;

        case "manageSellOffer":
          break;

        case "createPassiveSellOffer":
          break;

        default:
          break;
      }
    },
    isObject(property) {
      return property instanceof Object;
    }
  }
};
</script>

<style scoped></style>
