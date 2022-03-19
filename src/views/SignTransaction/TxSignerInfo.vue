<template>
  <div class="w-100">
    <h5 class="m-0 p-0">Transaction Signers</h5>
    <!-- show signers -->
    <b-row class="mt-2">
      <b-col class="mt-3">
        <div class="table-card">
          <b-table
            hover
            sticky-header
            no-border-collapse
            responsive
            :items="signatureInfo"
            :fields="fields"
            class="font-14 font-weight-600 mb-0"
            style="max-height: 580px; max-width: 100%"
            head-variant="info"
            @row-clicked="toggleRowDetails"
            select-mode="single"
            ref="selectableTable"
            show-empty
            selected-variant="primary"
            selectable
          >
            <template #cell(fee)="data">
              <b-badge
                v-if="data.value == 'processing'"
                variant="secondary"
                class="py-2 font-10 text-white"
                style="min-width: 120px;"
              >
                processing...</b-badge
              >
              <b-badge
                v-else
                variant="secondary"
                class="py-2 font-11 text-white"
                style="min-width: 120px;"
              >
                {{ data.value.toLocaleString() }} Stroops
              </b-badge>
            </template>

            <template #cell(reserves)="data">
              <b-badge
                v-if="data.value == 'processing'"
                variant="secondary"
                class="py-2 font-10 text-white"
                style="min-width: 120px;"
              >
                processing...</b-badge
              >
              <b-badge
                v-else
                variant="secondary"
                class="py-2 font-11 text-white"
                style="min-width: 120px;"
              >
                {{ data.value.toLocaleString() }}
              </b-badge>
            </template>

            <template #cell(risk)="data">
              <b-badge
                v-if="data.value == 'processing'"
                variant="secondary"
                class="py-2 font-10 text-white"
                style="min-width: 120px;"
              >
                processing...</b-badge
              >
              <template v-else>
                <b-badge
                  v-if="data.value == 0"
                  variant="info"
                  class="py-2 font-11 text-white"
                  style="min-width: 120px;"
                >
                  LOW
                </b-badge>
                <b-badge
                  v-if="data.value == 2"
                  variant="warning"
                  class="py-2 font-11 text-white"
                  style="min-width: 120px;"
                >
                  MEDIUM
                </b-badge>
                <b-badge
                  v-if="data.value == 3"
                  variant="danger"
                  class="py-2 font-11 text-white"
                  style="min-width: 120px;"
                >
                  HIGH
                </b-badge>
              </template>
            </template>

            <template #row-details="row">
              <div
                class="d-flex flex-column justify-content-start align-content-start"
              >
                <div
                  class="d-flex flex-column justify-content-start align-content-start  font-14 text-white"
                >
                  <div class="d-flex align-items-end">
                    <span class="mr-2 font-weight-bold text-nowrap"
                      >Signer ID / Public Key:</span
                    >
                    <span>{{ row.item.accountID }}</span>
                  </div>
                  <div class="d-flex align-items-end mt-2">
                    <span class="mr-2 font-weight-bold text-nowrap"
                      >Account Profile:</span
                    >
                    <span>{{ row.item.profile }}</span>
                  </div>
                  <div class="d-flex align-items-end mt-2">
                    <span class="mr-2 font-weight-bold text-nowrap"
                      >Transaction Fee:</span
                    >
                    <span>{{ row.item.fee }} Stroops</span>
                  </div>
                  <div class="d-flex align-items-end mt-2">
                    <span class="mr-2 font-weight-bold text-nowrap"
                      >Reserves Required:
                    </span>
                    <span>{{ row.item.reserves }}</span>
                  </div>
                  <div class="d-flex align-items-end mt-2">
                    <span class="mr-2 font-weight-bold text-nowrap"
                      >Transaction Operations:
                    </span>
                    <span>{{ row.item.operations }}</span>
                  </div>
                  <div class="d-flex align-items-center mt-2">
                    <span class="mr-2 font-weight-bold text-nowrap"
                      >Signer's Risk:
                    </span>
                    <span v-if="row.item.risk == 'processing'">
                      processing...</span
                    >
                    <template v-else>
                      <span v-if="row.item.risk == 1" class="font-italic">
                        low
                      </span>
                      <span v-if="row.item.risk == 2" class="font-italic">
                        medium
                      </span>
                      <span v-if="row.item.risk == 3" class="font-italic">
                        high
                      </span>
                    </template>
                  </div>

                  <div
                    class="d-flex flex-column align-items-start mt-2"
                    v-if="row.item.profileInfo"
                  >
                    <span class="mr-2 font-weight-bold text-nowrap"
                      >Profile Information:
                    </span>
                    <JsonViewer
                      class="mt-2"
                      :value="row.item"
                      :expand-depth="1"
                    ></JsonViewer>
                  </div>

                  <div class="d-flex align-items-end mt-3">
                    <button
                      @click="showFundAccountModalFn(row.item.accountID)"
                      class="btn btn-sm btn-primary font-14 border border-light mr-2"
                    >
                      Fund Account (XLM)
                    </button>
                    <button class="btn btn-sm btn-outline-light font-14">
                      Explore Blockchain Account
                    </button>
                  </div>
                </div>
              </div>
            </template>
          </b-table>
        </div></b-col
      ></b-row
    >
    <FundBlockchainAccount
      v-if="fundAccountModal.isShow"
      v-model="fundAccountModal"
    />
  </div>
</template>

<script>
import { TransactionBuilder, FeeBumpTransaction } from "stellar-sdk";
import JsonViewer from "vue-json-viewer";
import FundBlockchainAccount from "@/views/modals/FundBlockchainAccount.vue";
import { BLOCKCHAIN_NETWORK_NAME } from "@/services/config";
import {
  GroupTxOpsSigners,
  CalculateTxAccountReserves,
  AccountRiskLevelForTransaction
} from "@/services/stellar.service";

export default {
  components: {
    JsonViewer,
    FundBlockchainAccount
  },
  data() {
    return {
      signatureInfo: null,
      fundAccountModal: {
        destination: "",
        isShow: false
      },
      fields: [
        {
          key: "shortPublicKey",
          label: "SIGNER ID",
          class: "text-center bg-white"
        },
        {
          key: "profile",
          label: "ACCOUNT PROFILE",
          class: "text-start bg-white text-nowrap"
        },
        {
          key: "fee",
          label: "TXN FEE",
          sortable: true,
          sortDirection: "desc",
          class: "text-start bg-white"
        },
        {
          key: "reserves",
          label: "RESERVES",
          sortable: true,
          sortDirection: "desc",
          class: "text-start bg-white"
        },
        {
          key: "risk",
          label: "RISK",
          sortable: true,
          sortDirection: "desc",
          class: "text-start bg-white"
        }
      ]
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
      this.getSignerInfo();
    },
    showFundAccountModalFn(destination) {
      this.fundAccountModal.isShow = true;
      this.fundAccountModal.destination = destination;
    },
    getSignerInfo() {
      const tx = TransactionBuilder.fromXDR(this.xdr, BLOCKCHAIN_NETWORK_NAME);
      if (tx instanceof FeeBumpTransaction) {
        this.signatureInfo = [
          {
            accountID: tx.feeSource,
            shortPublicKey: this.getShortPublicKey(tx.feeSource),
            profile: "processing",
            profileInfo: {
              type: ""
            },
            fee: tx.fee,
            reserves: 0,
            operations: 0,
            risk: 2,
            _showDetails: false
          }
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
            shortPublicKey: this.getShortPublicKey(key),
            profile: "processing",
            profileInfo: {
              type: ""
            },
            fee: tx.source == key ? tx.fee : 0,
            reserves: "processing",
            operations: value.length,
            risk: "processing",
            _showDetails: false
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
    },
    toggleRowDetails(row) {
      var rowState = row._showDetails;
      this.signatureInfo = this.signatureInfo.map(object => {
        object._showDetails = false;
        return object;
      });
      if (rowState == false) row._showDetails = true;
    },
    getShortPublicKey(pk) {
      return `${pk.substr(0, 10)}......${pk.substr(-10)}`;
    },
    isObject(property) {
      return property instanceof Object;
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep {
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
}
</style>
