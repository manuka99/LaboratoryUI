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
            <i class="mdi mdi-coin"></i> Blockchain Identification
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

      <div v-if="!items || items.length == 0">
        <p class="text-danger font-15 font-weight-bold">
          There is no blockchain based identification account associated with
          your profile. Save your identification account to initiate and proof
          your identity through blockchain.
        </p>
      </div>
      <!-- identification -->
      <button
        class="btn btn-outline-primary font-15"
        v-if="!showIdentification"
        @click="
          showIdentification = true;
          getWalletAccounts();
        "
      >
        {{ !items || items.length == 0 ? "Add" : "Change" }} Blockchain
        Identification
      </button>

      <div v-if="showIdentification">
        <b-form-group
          id="fieldset-1"
          description="Enter the public key of your identification account. If the account has multiple signers then check the signer's risk level to select the most suitable public key."
          label="Account Identifiers's Public Key"
          class="font-15 font-weight-600 w-100 mt-3 max-width-500px"
          label-for="input-0"
        >
        </b-form-group>
        <div class="max-width-500px">
          <b-form-input
            id="input-0"
            type="text"
            placeholder="Enter Identifiers's Public Key (Starting with G)"
            v-model="selectedAccount"
            list="232323ad23sdcxzzz"
          ></b-form-input>

          <datalist id="232323ad23sdcxzzz">
            <option
              :value="walletAccount.value"
              v-for="(walletAccount, i) in walletAccounts"
              :key="i"
              >{{ walletAccount.text }}</option
            >
          </datalist>
        </div>
        <base-button
          class="btn btn-primary btn-sm font-15 py-1 px-3 mt-3 mr-2"
          @click="CreateBlockchainIdentificationFn"
          :disabled="!selectedAccount"
          :loading="isLoading1"
        >
          Set as Identification Account
        </base-button>
        <button
          class="btn btn-outline-danger btn-sm font-14 py-1 px-3 mt-3"
          @click="showIdentification = false"
        >
          Cancel
        </button>
      </div>

      <div v-if="createIDXdrError.status">
        <p class="font-15 text-danger mt-3 font-weight-bold">
          {{ createIDXdrError.message }}
        </p>
      </div>

      <hr class="mt-4 mb-3" style="height: 2px; width: 100%;" />

      <div v-if="items && items.length > 0">
        <h5>Account Identification History</h5>

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
                :busy="isLoading"
                @row-clicked="toggleRowDetails"
                select-mode="single"
                ref="selectableTable"
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

                <template #row-details="row">
                  <div
                    class="d-flex flex-column justify-content-start align-content-start"
                  >
                    <div
                      class="d-flex flex-column justify-content-start align-content-start  font-14 text-white"
                    >
                      <div class="d-flex align-items-end">
                        <span class="mr-2 font-weight-bold"
                          >Account Identifier:</span
                        >
                        <span>{{ row.item.item._id }}</span>
                      </div>
                      <div class="d-flex align-items-end mt-2">
                        <span class="mr-2 font-weight-bold">Account ID:</span>
                        <span>{{ row.item.item.publicKey }}</span>
                      </div>
                      <div class="d-flex align-items-end mt-2">
                        <span class="mr-2 font-weight-bold"
                          >Account Created At:</span
                        >
                        <span>{{ formatDateToSL(row.item.created_at) }}</span>
                      </div>
                      <div class="d-flex align-items-end mt-2">
                        <span class="mr-2 font-weight-bold"
                          >Account Expired At:</span
                        >
                        <span>{{
                          row.item.expired_at
                            ? formatDateToSL(row.item.expired_at)
                            : "None"
                        }}</span>
                      </div>
                      <div class="d-flex align-items-end mt-2">
                        <span class="mr-2 font-weight-bold"
                          >Cryptographic Hash:</span
                        >
                        <span>{{ row.item.item.txnHash }}</span>
                      </div>
                      <div class="d-flex align-items-end mt-3">
                        <button
                          @click="
                            showFundAccountModalFn(row.item.item.publicKey)
                          "
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
            </div>

            <div>
              <base-button
                class="btn btn-outline-primary w-100 mt-3"
                type="submit"
                v-if="!isAllLoaded"
                :loading="isLoading"
                :disabled="isLoading"
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
    <FundBlockchainAccount
      v-if="fundAccountModal.isShow"
      v-model="fundAccountModal"
      @onClose="onCloseFundAccountModalFn"
    />
    <SignTransactionModal
      v-if="signTransactionModal.isShow"
      v-model="signTransactionModal"
      @onClose="onCloseSignTransactionModalFn"
      :xdr="signTransactionModal.xdr"
      :isOnline="false"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CustomError from "../Errors/CustomError.vue";
import {
  GetIdentificationApi,
  SaveIdentificationApi
} from "@/services/bc.identity.service";
import { FindBlockchainAccountsAPI } from "@/services/bc.accounts.service";
import { CreateBCIDTransactionXDR } from "@/services/stellar.service";
import FundBlockchainAccount from "@/views/modals/FundBlockchainAccount.vue";
import SignTransactionModal from "@/views/modals/SignTransactionModal.vue";
import { formatDateToSL } from "@/util/common";

export default {
  components: {
    CustomError,
    FundBlockchainAccount,
    SignTransactionModal
  },
  data() {
    return {
      formatDateToSL: formatDateToSL,
      isLoading: false,
      isLoading1: false,
      fundAccountModal: {
        destination: "",
        isShow: false
      },
      signTransactionModal: {
        isShow: false,
        xdr: null
      },
      mainError: {
        status: false,
        code: false,
        description: null
      },
      createIDXdrError: {
        status: false,
        message: null
      },
      showIdentification: false,
      page: 0,
      selectedAccount: null,
      walletAccounts: [],
      fields: [
        {
          key: "index",
          label: "#",
          sortable: true,
          sortDirection: "asc",
          class: "text-start bg-white"
        },
        {
          key: "short_id",
          label: "IDENTIFIER",
          class: "text-start bg-white"
        },
        {
          key: "shortPublicKey",
          label: "ACCOUNT ID",
          class: "text-start bg-white"
        },
        {
          key: "created_at",
          label: "CREATED AT",
          sortable: true,
          sortDirection: "desc",
          class: "text-start bg-white"
        },
        {
          key: "expired_at",
          label: "EXPIRED AT",
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
  mounted() {
    this.initFn();
  },
  methods: {
    showFundAccountModalFn(destination) {
      this.fundAccountModal.isShow = true;
      this.fundAccountModal.destination = destination;
    },
    onCloseFundAccountModalFn(data) {
      if (data && data.refresh) this.getAllAccountsFn();
    },
    onCloseSignTransactionModalFn(data) {
      this.signTransactionModal.xdr = null;
      if (data && data.signedXdr) {
        let payload = {
          xdr: data.signedXdr,
          publicKey: this.selectedAccount
        };
        SaveIdentificationApi(payload).finally(() => (this.isLoading1 = false));
      } else this.isLoading1 = false;
    },
    initFn() {
      this.isLoading = false;
      this.isLoading1 = false;
      this.mainError = {
        status: false,
        code: false,
        description: null
      };
      this.getIdentificationInfo(0);
    },
    getWalletAccounts() {
      FindBlockchainAccountsAPI({ accountType: "wallet" }).then(response => {
        let bcAccounts = response.data.data.bcAccounts;
        let newAccounts = bcAccounts.map((account, index) => {
          return {
            value: account.publicKey,
            text: account.publicKey
          };
        });
        this.walletAccounts = newAccounts;
      });
    },
    async CreateBlockchainIdentificationFn() {
      this.isLoading1 = true;
      var txnXdr = await CreateBCIDTransactionXDR(
        this.selectedAccount,
        this.user.nationalID
      );
      if (!txnXdr) {
        this.createIDXdrError.message =
          "An error occured when creating the transaction. This might be due to the selected account not existing or invalid.";
        this.createIDXdrError.status = true;
        this.isLoading1 = false;
        return;
      }
      this.signTransactionModal.xdr = txnXdr;
      this.signTransactionModal.isShow = true;
    },
    getIdentificationInfo(page = this.page) {
      this.isLoading = true;

      const payload = {
        page
      };

      if (page == 0) this.items = [];

      this.isAllLoaded = false;
      GetIdentificationApi(payload)
        .then(response => {
          let identities = response.data.data.identities;
          if (identities && identities.length > 0) {
            this.page = page;
            let newIds = identities.map((identity, index) => {
              return {
                _showDetails: false,
                index: this.items.length + 1 + index,
                created_at: formatDateToSL(identity.created_at),
                expired_at: identity.expired_at
                  ? formatDateToSL(identity.expired_at)
                  : "None",
                short_id: `${identity._id.substr(
                  0,
                  5
                )}......${identity._id.substr(-5)}`,
                shortPublicKey: `${identity.publicKey.substr(
                  0,
                  10
                )}......${identity.publicKey.substr(-5)}`,
                item: identity
              };
            });
            this.items = this.items.concat(newIds);
          } else this.isAllLoaded = true;
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
    loadMoreFn() {
      this.getIdentificationInfo(this.page + 1);
    },
    toggleRowDetails(row) {
      var rowState = row._showDetails;
      this.items = this.items.map(object => {
        object._showDetails = false;
        return object;
      });
      if (rowState == false) row._showDetails = true;
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
