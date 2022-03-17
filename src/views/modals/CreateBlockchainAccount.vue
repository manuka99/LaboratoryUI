<template>
  <div>
    <fund-blockchain-account
      v-if="fundAccountModal.isShow"
      v-model="fundAccountModal"
      @onClose="onCloseFundAccountModalFn"
    />
    <SignTransactionModal
      v-if="signTransactionModal.isShow"
      v-model="signTransactionModal"
      @onClose="onCloseSignTransactionModalFn"
    />
    <b-modal
      v-model="value.isShow"
      footer-class="d-none"
      header-class="p-0"
      modal-class="w-100 p-0 d-flex justify-content-center"
      dialog-class="max-width-900px m-4"
      no-close-on-backdrop
    >
      <template #modal-header>
        <div
          class="w-100 d-flex justify-content-between align-items-center bg-dark py-2 px-4"
        >
          <span
            class="mb-0 text-white"
            style="font-size: clamp(15px, 3.5vw, 20px);"
          >
            <i class="mdi  mdi-key-change"></i> Blockchain Account Creation
          </span>
          <div class="cursor-pointer" @click="hideModalFn">
            <i class="mdi mdi-close-box-outline font-32 text-white"></i>
          </div>
        </div>
      </template>
      <div>
        <section
          class="d-flex flex-column align-items-start justify-content-start px-2"
        >
          <!-- loading -->
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

          <div v-if="!isLoading && !txSignatureID">
            <p class="text-danger font-15 font-weight-bold">
              In order to create / import blockchain accounts you must enable
              transaction security on your account and must have a transaction
              signature which will be used to sign transactions online. First
              enable transaction security and create your transaction signature
              then you can create / import blockchain accounts.
            </p>
          </div>

          <!-- phase 1 -->
          <div v-if="!isLoading && txSignatureID && isStep1">
            <p class="text-muted font-15 mb-0">
              1. Choose a unique account name and don't reuse it for other
              accounts. Usage of a unique account name is not mandatary but will
              assist you to manage channel accounts effectively.
              <a href="#"> Learn more.</a>
            </p>
            <div class="w-100">
              <b-row>
                <b-col md="4" class="mt-3">
                  <b-form-input
                    type="text"
                    label="*Blockchain Account Name"
                    placeholder="Blockchain Account Name"
                    class="font-14 font-weight-600"
                    v-model="account_name"
                  ></b-form-input>
                </b-col>
                <b-col md="6" class="mt-3"> </b-col>
              </b-row>
              <b-row>
                <b-col md="8" class="mt-3">
                  <b-form-textarea
                    label="Blockchain Description"
                    placeholder="Description..."
                    rows="4"
                    max-rows="8"
                    class="font-14 font-weight-600"
                    v-model="account_description"
                  ></b-form-textarea>
                </b-col>
              </b-row>
            </div>

            <hr class="mt-4 mb-3" style="height: 2px; width: 100%;" />

            <base-button
              class="btn btn-primary btn-sm d-flex justify-content-center align-items-center font-16"
              type="submit"
              :disabled="!account_name"
              @click="isStep1 = false"
              nativeType="submit"
            >
              <i class="mdi mdi-arrow-right-thick text-white mr-1"></i> Next
              (Set-up account keypair )
            </base-button>
          </div>

          <!-- phase 2 -->
          <div v-if="!isLoading && txSignatureID && !isStep1">
            <h3 class="text-muted font-15 mt-3 mb-2">
              2. Blockchain Account Keypair
            </h3>
            <p class="font-15 text-muted m-0">
              Every Blockchain account has a keypair consisting of a public key
              and a secret key. The public key is always safe to share other
              people need it to identify your account and verify that you
              authorized a transaction. The secret key is private information
              that proves you own and gives you access to your account. Before
              creating an account, you need to select the account type.
              <a
                target="_blank"
                href="https://developers.stellar.org/docs/tutorials/create-account/"
                >Learn more</a
              >
            </p>

            <div class="mt-3 w-auto">
              <b-form-select
                class="w-auto"
                v-model="accountType"
                :options="accountTypeOptions"
              ></b-form-select>
            </div>

            <!-- generate key pair -->
            <div
              v-if="accountType != null && importedKeypair.secretKey == null"
            >
              <div class="d-flex justify-content-start align-items-center mt-3">
                <base-button
                  class="btn btn-secondary my-0 d-flex justify-content-start align-items-center font-14"
                  type="submit"
                  @click="generateKeypairFn()"
                  nativeType="submit"
                  style="width: 220px"
                >
                  <i class="mdi mdi-key-plus text-white mr-1"></i> a. Generate
                  Keypairs
                </base-button>
                <base-button
                  class="btn btn-light btn-sm my-0 d-flex justify-content-center align-items-center py-0 font-12 font-weight-600 px-2 ml-2"
                  type="submit"
                  v-if="generatedKeypair.secretKey != null"
                  @click="clearGeneratedKeypairFn()"
                  nativeType="submit"
                >
                  <i class="mdi mdi-close-box p-0 font-16 text-danger mr-1"></i>
                  <span class="text-mutted">CLEAR</span>
                </base-button>
              </div>

              <div v-if="generatedKeypair.secretKey != null" class="mb-3 w-100">
                <p class="font-14 font-weight-600 mt-3 mb-2 p-0">
                  Public Key :
                  <span class="text-muted">{{
                    generatedKeypair.publicKey
                  }}</span>
                </p>
                <p class="font-14 font-weight-600 mb-0 p-0">
                  Secret Key :
                  <span class="text-muted">{{
                    generatedKeypair.secretKey
                  }}</span>
                </p>
              </div>

              <base-button
                class="btn btn-warning btn-sm mt-0 d-flex justify-content-start align-items-center font-14 text-light"
                type="submit"
                v-if="generatedKeypair.secretKey != null"
                @click="copyToClipboardFn"
                nativeType="submit"
                style="width: 220px"
              >
                <i class="mdi mdi-content-copy text-white mr-1"></i> Copy to
                Clipboard
              </base-button>
            </div>

            <div
              v-if="
                accountType == 'channel' && generatedKeypair.secretKey != null
              "
              style="margin-bottom: 32px"
            >
              <h3 class="text-muted font-15 mt-4">
                2. Sponsoring Payment Channel Creation
              </h3>
              <div class="mt-3 w-auto">
                <div
                  v-if="isLoading2"
                  style="min-height: 60px; margin-left: 32px"
                  class="d-flex justify-content-start align-items-center"
                >
                  <b-spinner
                    variant="primary"
                    label="Spinning"
                    style="width: 32px; height: 32px;"
                  ></b-spinner>
                </div>
                <div v-if="!isLoading2 && sponsors.length <= 1">
                  <p class="text-danger font-14 font-weight-bold">
                    There are no sponsoring accounts created yet. In order to
                    create a transaction/payment channel, an account must
                    sponsor its creation. Any wallet account can sponsor payment
                    channels. Create a wallet account and try again.
                    <a
                      target="_blank"
                      href="https://developers.stellar.org/docs/glossary/sponsored-reserves/"
                      >Learn more</a
                    >
                  </p>
                </div>
                <b-form-select
                  v-if="!isLoading2 && sponsors.length > 1"
                  v-model="sponsorID"
                  :options="sponsors"
                  class="w-auto"
                ></b-form-select>

                <div v-if="!isLoading2" class="mt-2">
                  <a
                    @click="getAllSponsorAccountsFn"
                    class="font-14 font-weight-600 text-decoration-underline mt-2 cursor-pointer"
                  >
                    Refresh account list and balances?
                  </a>
                </div>

                <div v-if="sponsorID" class="mt-1">
                  <a
                    @click="
                      fundAccountModal.destination = sponsorID;
                      showFundAccountModalFn();
                    "
                    class="font-14 font-weight-600 text-decoration-underline m-0 p-0 cursor-pointer"
                  >
                    Fund selected sponsoring account?
                  </a>
                </div>

                <div
                  v-if="
                    sponsorID &&
                      sponsorIDInfo &&
                      sponsorIDInfo.item &&
                      sponsorIDInfo.item.balance <= 0
                  "
                  class="mt-3"
                >
                  <p class="text-danger font-14 font-weight-bold m-0 p-0">
                    Selected sponsoring account does not have enough funds to
                    sponsor payment channel creation. An account must have at
                    least 2.1 XLM to sponsor an account, current account balance
                    is {{ sponsorIDInfo.item.balance }} XLM. This depends on the
                    amount of reserves.
                    <a
                      target="_blank"
                      href="https://developers.stellar.org/docs/glossary/minimum-balance/"
                      >Learn more</a
                    >
                  </p>
                </div>
              </div>
            </div>

            <!-- import key pair -->
            <div
              v-if="
                accountType == 'wallet' && generatedKeypair.secretKey == null
              "
              class="w-100 mt-3"
            >
              <div class="d-flex justify-content-start align-items-center">
                <base-button
                  class="btn btn-secondary my-0 d-flex justify-content-start align-items-center font-14"
                  type="submit"
                  @click="showImportKeypairFn()"
                  nativeType="submit"
                  style="width: 220px"
                >
                  <i class="mdi mdi-key-change text-white mr-1 text-nowrap"></i
                  >b. Import Existing Keypair
                </base-button>
                <base-button
                  class="btn btn-light btn-sm my-0 d-flex justify-content-center align-items-center py-0 font-12 font-weight-600 px-2 ml-2"
                  type="submit"
                  v-if="showImportKeypair"
                  @click="clearImportedKeypairFn()"
                  nativeType="submit"
                >
                  <i class="mdi mdi-close-box p-0 font-16 text-danger mr-1"></i>
                  <span class="text-mutted">CANCEL</span>
                </base-button>
              </div>

              <div
                v-if="showImportKeypair"
                class="bg-light py-4 px-3 mt-3 border rounded w-100"
                style="max-width: 560px;"
              >
                <b-form-group
                  id="input-group-2"
                  label="Account ID:"
                  label-for="input-2"
                  class="font-14 font-weight-600 text-mutted m-0"
                >
                  <b-form-input
                    id="input-2"
                    v-model="importedKeypair.publicKey"
                    placeholder="Enter Public Key"
                    class="font-14"
                  ></b-form-input>
                </b-form-group>
                <b-form-group
                  id="input-group-2"
                  label="Account Secret:"
                  label-for="input-2"
                  class="font-14 font-weight-600 text-mutted mt-3 mb-0"
                >
                  <b-form-input
                    id="input-2"
                    type="password"
                    v-model="importedKeypair.secretKey"
                    placeholder="Enter Secret Key"
                    class="font-14"
                  ></b-form-input>
                </b-form-group>
              </div>
            </div>

            <!-- save wallet account -->
            <base-button
              class="btn btn-success btn-lg w-100 d-flex justify-content-center align-items-center font-16"
              style="margin: 32px 0px"
              type="submit"
              v-if="keypair.secretKey != null && accountType == 'wallet'"
              :loading="isLoading1"
              @click="createBlockchainAccountFn"
              nativeType="submit"
            >
              <i class="mdi mdi-lock text-white mr-1"></i> Save Blockchain
              Account
            </base-button>

            <!-- create payment channel -->
            <base-button
              class="btn btn-success mt-2 btn-lg w-100 d-flex justify-content-center align-items-center font-16"
              style="margin-bottom: 32px"
              type="submit"
              v-if="
                keypair.secretKey != null &&
                  accountType == 'channel' &&
                  sponsorID != null &&
                  sponsorIDInfo &&
                  sponsorIDInfo.item &&
                  sponsorIDInfo.item.balance > 0
              "
              :loading="isLoading1"
              @click="createPaymentChannelFn"
              nativeType="submit"
            >
              <i class="mdi mdi-lock text-white mr-1"></i> Create Payment
              Channel
            </base-button>

            <hr class="mt-4 mb-3" style="height: 2px; width: 100%;" />

            <base-button
              class="btn btn-danger btn-sm d-flex justify-content-center align-items-center font-16 m-0"
              type="submit"
              @click="isStep1 = true"
              nativeType="submit"
            >
              <i class="mdi mdi-arrow-left-thick text-white mr-1"></i> Back
              (Account information )
            </base-button>
          </div>

          <div v-if="!isLoading && !txSignatureID" class="mt-3"></div>

          <hr class="my-3" style="height: 2px; width: 100%;" />
        </section>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { Keypair } from "stellar-sdk";
import { GetTxSecurityInfoAPI } from "@/services/user.service";
import { CreateBlockchainAccountAPI } from "@/services/bc.accounts.service";
import FundBlockchainAccount from "@/views/modals/FundBlockchainAccount.vue";
import SignTransactionModal from "@/views/modals/SignTransaction/SignTransactionModal.vue";
import { EncryptWithRawPublicKey } from "@/services/rsa.service";
import { FindBlockchainAccountsAPI } from "@/services/bc.accounts.service";
import { GetAccountNativeBalance } from "@/services/stellar.service";

export default {
  components: {
    FundBlockchainAccount,
    SignTransactionModal
  },
  data() {
    return {
      isRefresh: false,
      isStep1: true,
      // init
      isLoading: false,
      txSignatureID: null,
      txPasswordHash: null,
      // save account
      isLoading1: false,
      account_name: "",
      account_description: "",
      accountType: null,

      generatedKeypair: {
        publicKey: null,
        secretKey: null
      },
      importedKeypair: {
        publicKey: null,
        secretKey: null
      },
      keypair: {
        publicKey: null,
        secretKey: null
      },
      isLoading2: false,
      sponsorID: null,
      sponsorIDInfo: null,
      sponsors: [{ value: null, text: "Select sponsoring account" }],
      showImportKeypair: false,

      // modals
      fundAccountModal: {
        destination: "",
        isShow: false
      },
      signTransactionModal: {
        isShow: false
      },

      // options
      accountTypeOptions: [
        { value: null, text: "Select account type" },
        { value: "wallet", text: "Wallet account" },
        { value: "channel", text: "Channel account" }
      ]
    };
  },
  props: {
    value: {
      type: Object,
      default: function() {
        return {
          isShow: false
        };
      }
    }
  },
  watch: {
    generatedKeypair: {
      handler(val) {
        this.keypair = val;
      },
      deep: true
    },
    importedKeypair: {
      handler(val) {
        this.keypair = val;
      },
      deep: true
    },
    accountType(val) {
      this.clearGeneratedKeypairFn();
      this.clearImportedKeypairFn();
      this.sponsorID = null;
      this.sponsors = null;
      this.isLoading2 = null;
      if (val == "channel") this.getAllSponsorAccountsFn();
    },
    sponsorID(val) {
      this.sponsorIDInfo = this.sponsors.find(cnt => cnt.value == val);
    }
  },
  mounted() {
    this.initFn();
  },
  methods: {
    initFn() {
      this.resetCreateAccountFn();
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
        })
        .finally(() => (this.isLoading = false));
    },
    showFundAccountModalFn() {
      this.fundAccountModal.isShow = true;
    },
    onCloseFundAccountModalFn(data) {
      if (data && data.refresh) this.getAllSponsorAccountsFn();
    },
    onCloseSignTransactionModalFn(data) {
      this.savePaymentChannelFn(data);
    },
    generateKeypairFn() {
      this.clearImportedKeypairFn();
      let keypair = Keypair.random();
      this.generatedKeypair.publicKey = keypair.publicKey();
      this.generatedKeypair.secretKey = keypair.secret();
    },
    copyToClipboardFn() {
      let text = `Blockchain Account Credentials\nPublic key: ${this.keypair.publicKey}\nSecret key: ${this.keypair.secretKey}`;
      this.copyToClipboad(text);
    },
    async createBlockchainAccountFn() {
      if (!this.account_name) {
        this.$bvToast.toast("Blockchain account name is required", {
          title: "ERROR! There are fields that requires your attention",
          autoHideDelay: 6000,
          appendToast: false,
          variant: "danger",
          solid: true,
          toaster: "b-toaster-bottom-right"
        });
      } else if (!this.keypair) {
        this.$bvToast.toast("Blockchain account keypair is required", {
          title: "ERROR! There are fields that requires your attention",
          autoHideDelay: 6000,
          appendToast: false,
          variant: "danger",
          solid: true,
          toaster: "b-toaster-bottom-right"
        });
      } else {
        this.isLoading1 = true;
        var encryptedSecret = await EncryptWithRawPublicKey(
          this.txSignatureID,
          this.keypair.secretKey
        );
        let payload = {
          name: this.account_name,
          description: this.account_description,
          crntTransactionSignatureID: this.txSignatureID,
          accountType: this.accountType,
          keypair: {
            publicKey: this.keypair.publicKey,
            secretKey: encryptedSecret
          }
        };
        CreateBlockchainAccountAPI(payload)
          .then(() => {
            this.initFn();
            this.isRefresh = true;
          })
          .finally(() => (this.isLoading1 = false));
      }
    },
    getAllSponsorAccountsFn() {
      this.sponsorID = null;
      this.isLoading2 = true;
      const payload = {
        accountType: "wallet"
      };
      this.sponsors = [];
      FindBlockchainAccountsAPI(payload)
        .then(response => {
          let bcAccounts = response.data.data.bcAccounts;
          var newAccounts = [
            { value: null, text: "Select sponsoring account" }
          ];
          if (bcAccounts && bcAccounts.length > 0) {
            let bcs = bcAccounts.map(account => {
              return {
                value: account.publicKey,
                text: `${account.name} ${account.publicKey.substr(
                  0,
                  10
                )}......${account.publicKey.substr(-5)}`,
                item: account
              };
            });
            newAccounts = [...newAccounts, ...bcs];
            this.sponsors = newAccounts;
            this.updateAccountBalances();
          }
        })
        .finally(() => (this.isLoading2 = false));
    },
    async updateAccountBalances() {
      for (let index = 0; index < this.sponsors.length; index++) {
        const account = this.sponsors[index];
        if (account.item) {
          const balance = await GetAccountNativeBalance(account.item.publicKey);
          const blnText = balance == null ? "(0 XLM)" : "(" + balance + " XLM)";
          account.item.balance = balance == null ? 0 : balance;
          account.text = account.text + " " + blnText;
        }
      }
    },
    replaceAccount(data) {
      let i = this.sponsors.findIndex(
        crnt => crnt.item && crnt.item._id == data.item._id
      );
      this.items = [
        ...this.sponsors.slice(0, i),
        data,
        ...this.sponsors.slice(i + 1)
      ];
    },
    createPaymentChannelFn() {
      if (!this.account_name) {
        this.$bvToast.toast("Payment chnanel name is required", {
          title: "ERROR! There are fields that requires your attention",
          autoHideDelay: 6000,
          appendToast: false,
          variant: "danger",
          solid: true,
          toaster: "b-toaster-bottom-right"
        });
      } else if (!this.keypair) {
        this.$bvToast.toast("Blockchain account keypair is required", {
          title: "ERROR! There are fields that requires your attention",
          autoHideDelay: 6000,
          appendToast: false,
          variant: "danger",
          solid: true,
          toaster: "b-toaster-bottom-right"
        });
      } else if (!this.sponsorID) {
        this.$bvToast.toast("Sponsor's account ID / public key is required", {
          title: "ERROR! There are fields that requires your attention",
          autoHideDelay: 6000,
          appendToast: false,
          variant: "danger",
          solid: true,
          toaster: "b-toaster-bottom-right"
        });
      } else {
        this.signTransactionModal.isShow = true;
      }
    },
    savePaymentChannelFn(signData) {
      this.isLoading1 = true;
      let payload = {
        name: this.account_name,
        description: this.account_description,
        keypair: this.keypair
      };
      CreateBlockchainAccountAPI(payload)
        .then(() => this.resetCreateAccountFn())
        .finally(() => (this.isLoading1 = false));
    },
    showImportKeypairFn() {
      this.showImportKeypair = true;
      this.clearGeneratedKeypairFn();
    },
    clearGeneratedKeypairFn() {
      this.generatedKeypair.publicKey = null;
      this.generatedKeypair.secretKey = null;
    },
    clearImportedKeypairFn() {
      this.importedKeypair.publicKey = null;
      this.importedKeypair.secretKey = null;
      this.showImportKeypair = false;
    },
    resetCreateAccountFn() {
      this.isStep1 = true;
      // init
      this.isLoading = false;
      this.txSignatureID = null;
      this.txPasswordHash = null;
      // save account
      this.isLoading1 = false;
      this.account_name = "";
      this.account_description = "";
      this.accountType = null;
      this.generatedKeypair = {
        publicKey: null,
        secretKey: null
      };
      this.importedKeypair = {
        publicKey: null,
        secretKey: null
      };
      this.keypair = {
        publicKey: null,
        secretKey: null
      };
      this.sponsorID = null;
      this.isLoading2 = false;
      this.sponsors = [{ value: null, text: "Select sponsoring account" }];
      this.showImportKeypair = false;

      // modals
      this.fundAccountModal = {
        destination: "",
        isShow: false
      };
      this.signTransactionModal = {
        isShow: false
      };

      // options
      this.accountTypeOptions = [
        { value: null, text: "Select account type" },
        { value: "wallet", text: "Wallet account" },
        { value: "channel", text: "Channel account" }
      ];
    },
    hideModalFn() {
      this.value.isShow = false;
      this.resetCreateAccountFn();
      this.$emit("onClose", {
        refresh: this.isRefresh
      });
    }
  }
};
</script>

<style scoped></style>
