<template>
  <div>
    <b-card
      v-if="!isLoading && !mainError.status"
      header-bg-variant="secondary"
      style="min-height: 600px"
    >
      <b-row align-v="center" slot="header">
        <b-col cols="8">
          <h5 class="mb-0 text-white font-18">
            <i class="mdi  mdi-key-change"></i> Manage Blockchain Accounts
          </h5>
        </b-col>
      </b-row>

      <p class="font-15">
        Stellar uses public key cryptography to ensure that every transaction is
        secure: every Stellar account has a keypair consisting of a public key
        and a secret key. The public key is always safe to share — other people
        need it to identify your account and verify that you authorized a
        transaction. It’s like an email address. The secret key, however, is
        private information that proves you own — and gives you access to — your
        account. It’s like a password, and you should never share it with
        anyone. Before creating an account, you need to generate your own
        keypair.
        <a
          target="_blank"
          href="https://developers.stellar.org/docs/tutorials/create-account/"
          >Learn more</a
        >
      </p>

      <!-- accounts -->
      <div v-if="txSignatureID">
        <button
          @click="showCreateAccountModalFn"
          class="btn btn-outline-primary font-15"
        >
          Create Blockchain Account
        </button>

        <hr class="mt-4 mb-3" style="height: 2px; width: 100%;" />

        <div class="d-flex flex-column justify-content-start flex-wrap">
          <div class="d-flex align-items-end">
            <b-form-checkbox
              switch
              size="lg"
              v-model="isWallet"
            ></b-form-checkbox>
            <span class="mr-2 font-15 text-mutted font-weight-600"
              >Wallet Accounts</span
            >
          </div>
          <div class="d-flex align-items-end mt-2">
            <b-form-checkbox
              switch
              size="lg"
              v-model="isChannel"
            ></b-form-checkbox>
            <span class="mr-2 font-15 text-mutted font-weight-600"
              >Payment Channels</span
            >
          </div>
        </div>

        <div class="mt-3" style="width: 100%; max-width: 480px">
          <b-input-group>
            <b-input-group-prepend>
              <b-input-group-text>
                <b-icon icon="search" />
              </b-input-group-text>
            </b-input-group-prepend>
            <b-form-input
              type="text"
              placeholder="Search..."
              v-model="search"
            ></b-form-input>
          </b-input-group>
        </div>

        <b-row>
          <b-col class="mt-3">
            <div class="table-card">
              <b-table
                hover
                sticky-header
                no-border-collapse
                responsive
                :items="items"
                :fields="fields"
                class="font-14 font-weight-600 mb-0"
                style="max-height: 580px; max-width: 100%"
                head-variant="info"
                :busy="isLoading1"
                @row-clicked="toggleRowDetails"
                select-mode="single"
                ref="selectableTable"
                show-empty
                selected-variant="primary"
                selectable
              >
                <template #table-busy>
                  <div
                    class="text-center text-white my-2 font-20 d-flex justify-content-center align-items-center"
                    style="min-height: 280px"
                  >
                    <b-spinner class="align-middle mr-2"></b-spinner>
                    <strong>Loading...</strong>
                  </div>
                </template>

                <template #empty>
                  <div
                    class="d-flex text-center text-white d-flex justify-content-center align-items-center font-18"
                    style="min-height: 280px"
                  >
                    <span v-if="!search">
                      There are no accounts yet.
                      <a
                        @click="showCreateAccountModalFn"
                        v-if="!search"
                        class="text-white font-weight-600 text-decoration-underline"
                      >
                        Create or Import your first blockchain account
                      </a>
                    </span>
                    <span v-else>
                      No blockchain accounts were found with the above filters
                    </span>
                  </div>
                </template>

                <template #cell(balance)="data">
                  <b-badge
                    v-if="data.value == 'processing'"
                    variant="secondary"
                    class="py-2 font-10 text-white"
                    style="min-width: 120px;"
                  >
                    processing...</b-badge
                  >
                  <b-badge
                    v-if="data.value == 'N/A'"
                    variant="danger"
                    class="py-2 font-10 text-white"
                    style="min-width: 120px;"
                  >
                    Failed / No Account</b-badge
                  >
                  <b-badge
                    v-if="data.value != 'processing' && data.value != 'N/A'"
                    variant="primary"
                    class="py-2 font-10 text-white"
                    style="min-width: 120px;"
                  >
                    {{ data.value.toLocaleString() }} XLM
                  </b-badge>
                </template>

                <template #cell(status)="data">
                  <b-badge
                    :variant="
                      data.value == 'LOCKED'
                        ? 'danger'
                        : data.value == 'ONHOLD'
                        ? 'warning'
                        : 'success'
                    "
                    class="py-2 font-10"
                    style="width: 80px;"
                  >
                    {{ data.value }}</b-badge
                  >
                </template>

                <template #row-details="row">
                  <div
                    class="d-flex flex-column justify-content-start align-content-start"
                  >
                    <div
                      class="d-flex flex-column justify-content-start align-content-start  font-14 text-white"
                    >
                      <div class="d-flex align-items-center mb-2">
                        <b-form-select
                          size="sm"
                          v-model="accountActionOption"
                          :options="accountActionOptions"
                          class="w-auto mr-2"
                        ></b-form-select>
                        <base-button
                          v-if="accountActionOption"
                          @click="performAccountActionFn(row.item)"
                          :loading="row.item.actionLoading"
                          :disabled="row.item.actionLoading"
                          class="btn btn-sm btn-danger font-12 border border-light mr-2"
                        >
                          Continue
                        </base-button>
                      </div>
                      <div class="d-flex align-items-end">
                        <span class="mr-2 font-weight-bold"
                          >Account Identifier:</span
                        >
                        <span>{{ row.item.item._id }}</span>
                      </div>
                      <div class="d-flex align-items-end mt-2">
                        <span class="mr-2 font-weight-bold">Account Name:</span>
                        <span>{{ row.item.account_name }}</span>
                      </div>
                      <div class="d-flex align-items-end mt-2">
                        <span class="mr-2 font-weight-bold">Account ID:</span>
                        <span>{{ row.item.item.publicKey }}</span>
                      </div>
                      <div class="d-flex align-items-end mt-2">
                        <span class="mr-2 font-weight-bold"
                          >Account Balance:
                        </span>
                        <span>{{ row.item.balance }}</span>
                      </div>
                      <div class="d-flex align-items-end mt-2">
                        <b-form-checkbox
                          switch
                          size="lg"
                          disabled
                          :checked="row.item.item.accountType == 'wallet'"
                        ></b-form-checkbox>
                        <span class="mr-2 text-mutted font-weight-600"
                          >Wallet Account</span
                        >
                      </div>
                      <div class="d-flex align-items-end mt-2">
                        <b-form-checkbox
                          switch
                          size="lg"
                          disabled
                          :checked="row.item.item.accountType == 'channel'"
                        ></b-form-checkbox>
                        <span class="mr-2 text-mutted font-weight-600"
                          >Payment Channel</span
                        >
                      </div>
                      <div class="d-flex align-items-end mt-3">
                        <button
                          v-if="row.item.item.accountType == 'wallet'"
                          @click="
                            showFundAccountModalFn(row.item.item.publicKey)
                          "
                          class="btn btn-sm btn-primary font-14 border border-light mr-2"
                        >
                          Fund account (XLM)
                        </button>
                        <button class="btn btn-sm btn-outline-light font-14">
                          Explore services
                        </button>
                      </div>
                    </div>
                  </div>
                </template>
              </b-table>
            </div>

            <div>
              <base-button
                class="btn btn-outline-primary w-100 mt-3"
                type="submit"
                v-if="!isAllLoaded"
                :loading="isLoading2"
                :disabled="isLoading2"
                @click="loadMoreFn"
                nativeType="submit"
              >
                Load more...
              </base-button>
              <div v-else>
                <p class="font-weight-bold text-muted font-18 text-center mt-3">
                  ..... End of records .....
                </p>
              </div>
            </div>
          </b-col>
        </b-row>
      </div>
      <div v-else>
        <p class="text-danger font-15 font-weight-bold">
          In order to create / import blockchain accounts you must enable
          transaction security on your account and must have a transaction
          signature which will be used to sign transactions online. First enable
          transaction security and create your transaction signature then you
          can create / import blockchain accounts.
        </p>
      </div>
    </b-card>
    <!-- spinner -->
    <div
      v-if="isLoading"
      style="min-height: 400px;"
      class="d-flex justify-content-center align-items-center"
    >
      <b-spinner
        variant="primary"
        label="Spinning"
        style="width: 120px; height: 120px;"
      ></b-spinner>
    </div>
    <!-- main error -->
    <div
      v-if="mainError.status"
      style="min-height: 280px;"
      class="d-flex justify-content-center align-items-center"
    >
      <custom-error
        :code="mainError.code"
        :title="mainError.title"
        :description="mainError.description"
        :emitBtnTxt="'Refresh and try again'"
        :emitFn="'onEmit'"
        @onEmit="initFn"
      ></custom-error>
    </div>
    <create-blockchain-account
      v-if="createAccountModal.isShow"
      v-model="createAccountModal"
      @onClose="onCloseCreateAccountModalFn"
    />
    <FundBlockchainAccount
      v-if="fundAccountModal.isShow"
      v-model="fundAccountModal"
      @onClose="onCloseFundAccountModalFn"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CreateBlockchainAccount from "@/views/modals/CreateBlockchainAccount.vue";
import CustomError from "../Errors/CustomError.vue";
import { GetTxSecurityInfoAPI } from "@/services/user.service";
import {
  FindBlockchainAccountsAPI,
  RemoveBlockchainAccountAPI
} from "@/services/bc.accounts.service";
import { GetAccountNativeBalance } from "@/services/stellar.service";
import FundBlockchainAccount from "@/views/modals/FundBlockchainAccount.vue";

export default {
  components: {
    CreateBlockchainAccount,
    CustomError,
    FundBlockchainAccount
  },
  data() {
    return {
      isLoading: false,
      isLoading1: false,
      isLoading2: false,
      txSignatureID: null,
      txPasswordHash: null,
      isWallet: true,
      isChannel: false,
      isAllLoaded: false,
      search: undefined,
      page: 0,
      searchTimeout: null,
      createAccountModal: {
        isShow: false
      },
      fundAccountModal: {
        destination: "",
        isShow: false
      },
      mainError: {
        status: false,
        code: false,
        description: null
      },
      accountActionOption: null,
      accountActionOptions: [
        { value: null, text: "Select action..." },
        { value: "merge", text: "Merge Account (Blockchain)" },
        { value: "remove", text: "Remove Account (MetaSpeck)" }
      ],
      fields: [
        {
          key: "index",
          label: "#",
          sortable: true,
          sortDirection: "asc",
          class: "text-start bg-white"
        },
        // {
        //   key: "short_id",
        //   label: "IDENTIFIER",
        //   class: "text-start bg-white"
        // },
        {
          key: "account_name",
          label: "ACCOUNT NAME",
          class: "text-start bg-white text-nowrap"
        },
        {
          key: "shortPublicKey",
          label: "ACCOUNT ID",
          class: "text-start bg-white"
        },
        {
          key: "balance",
          label: "BALANCE",
          sortable: true,
          sortDirection: "desc",
          class: "text-start bg-white"
        },
        {
          key: "status",
          label: "FLAG",
          sortable: true,
          sortDirection: "desc",
          class: "text-start bg-white"
        }
      ],
      items: []
    };
  },
  computed: {
    ...mapGetters({
      user: "user/getUser"
    })
  },
  watch: {
    isWallet() {
      this.getAllAccountsFn(0);
    },
    isChannel() {
      this.getAllAccountsFn(0);
    },
    search() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = null;
      }
      this.searchTimeout = setTimeout(() => {
        this.getAllAccountsFn(0);
      }, 2000);
    }
  },
  mounted() {
    this.initFn();
  },
  methods: {
    showCreateAccountModalFn() {
      this.createAccountModal.isShow = !this.createAccountModal.isShow;
    },
    showFundAccountModalFn(destination) {
      this.fundAccountModal.isShow = true;
      this.fundAccountModal.destination = destination;
    },
    onCloseFundAccountModalFn(data) {
      if (data && data.refresh) this.getAllAccountsFn();
    },
    initFn() {
      this.isLoading = false;
      this.isLoading1 = false;
      this.isLoading2 = false;
      this.txSignatureID = null;
      this.txPasswordHash = null;
      this.createAccountModal.isShow = false;
      this.mainError = {
        status: false,
        code: false,
        description: null
      };
      this.getTransactionSignatureAndPasswordHashFn();
    },
    getTransactionSignatureAndPasswordHashFn() {
      this.isLoading = true;
      GetTxSecurityInfoAPI()
        .then(response => {
          const {
            data: {
              data: { transactionSignatureID, transactionPasswordHash }
            }
          } = response;
          this.txSignatureID = transactionSignatureID;
          this.txPasswordHash = transactionPasswordHash;
          if (transactionSignatureID) this.getAllAccountsFn(0);
        })
        .catch(({ response }) => {
          if (response) {
            this.mainError.code = response.status;
            this.mainError.description = response.data.data.message;
          } else {
            this.mainError.code = 404;
            this.mainError.description = error.message;
          }
          this.mainError.status = true;
        })
        .finally(() => (this.isLoading = false));
    },
    onCloseCreateAccountModalFn(data) {
      if (data && data.refresh) this.initFn();
    },
    loadMoreFn() {
      this.getAllAccountsFn(this.page + 1);
    },
    getAllAccountsFn(page = this.page) {
      this.isLoading1 = true;
      let accountType = [];

      if (this.isWallet) accountType.push("wallet");
      if (this.isChannel) accountType.push("channel");

      const payload = {
        accountType: accountType.join(","),
        search: this.search,
        page
      };

      if (page == 0) this.items = [];

      this.isAllLoaded = false;
      FindBlockchainAccountsAPI(payload)
        .then(response => {
          let bcAccounts = response.data.data.bcAccounts;
          if (bcAccounts && bcAccounts.length > 0) {
            this.page = page;
            let newAccounts = bcAccounts.map((account, index) => {
              return {
                _showDetails: false,
                actionLoading: false,
                index: this.items.length + 1 + index,
                account_name: account.name,
                balance: "processing",
                status: account.isLocked
                  ? account.lockSequence
                    ? "LOCKED"
                    : "ONHOLD"
                  : "AVAILABLE",
                short_id: `${account._id.substr(
                  0,
                  5
                )}......${account._id.substr(-5)}`,
                shortPublicKey: `${account.publicKey.substr(
                  0,
                  10
                )}......${account.publicKey.substr(-5)}`,
                item: account
              };
            });
            this.items = this.items.concat(newAccounts);
            this.updateAccountBalances();
          } else this.isAllLoaded = true;
        })
        .finally(() => (this.isLoading1 = false));
    },
    async updateAccountBalances() {
      for (let index = 0; index < this.items.length; index++) {
        const account = this.items[index];
        const balance = await GetAccountNativeBalance(account.item.publicKey);
        account.balance = balance == null ? "N/A" : balance;
        this.replaceAccountFn(account.item._id, account);
      }
    },
    replaceAccountFn(_id, data) {
      let i = this.items.findIndex(crnt => crnt.item && crnt.item._id == _id);
      if (i != -1) {
        if (data) {
          this.items = [
            ...this.items.slice(0, i),
            data,
            ...this.items.slice(i + 1)
          ];
        } else {
          this.items = [...this.items.slice(0, i), ...this.items.slice(i + 1)];
        }
      }
    },
    toggleRowDetails(row) {
      var rowState = row._showDetails;
      this.items = this.items.map(object => {
        object._showDetails = false;
        return object;
      });
      if (rowState == false) row._showDetails = true;
    },

    performAccountActionFn(item) {
      switch (this.accountActionOption) {
        case "merge":
          item.actionLoading = true;
          setTimeout(() => (item.actionLoading = false), 10000);
          break;
        case "remove":
          item.actionLoading = true;
          RemoveBlockchainAccountAPI(item.item._id)
            .then(res => this.replaceAccountFn(res.data.data.id, null))
            .finally(() => (item.actionLoading = false));
          break;
        default:
          alert("Action not available, please refresh and try again");
          break;
      }
    }
  }
};
</script>

<style>
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
