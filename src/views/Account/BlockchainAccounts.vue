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

        <div class="mt-4 d-flex flex-column justify-content-start flex-wrap">
          <div class="d-flex align-items-end">
            <b-form-checkbox switch size="lg"></b-form-checkbox>
            <span class="mr-2 font-14 text-mutted font-weight-600"
              >Wallet Accounts</span
            >
          </div>
          <div class="d-flex align-items-end mt-2">
            <b-form-checkbox switch size="lg"></b-form-checkbox>
            <span class="mr-2 font-14 text-mutted font-weight-600"
              >Payment Channels</span
            >
          </div>
          <div class="d-flex align-items-end mt-2">
            <b-form-checkbox switch size="lg"></b-form-checkbox>
            <span class="mr-2 font-14 text-mutted font-weight-600"
              >Unassigned Accounts</span
            >
          </div>
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
                :busy="isLoading3"
                @row-clicked="toggleRowDetails"
                select-mode="single"
                ref="selectableTable"
                show-empty
                selected-variant="primary"
                selectable
              >
                <template #table-busy>
                  <div class="text-center text-danger my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Loading...</strong>
                  </div>
                </template>

                <template #empty>
                  <div class="d-flex text-center justify-content-center">
                    <span>
                      There are no accounts yet.
                      <a
                        @click="scrollTo('#create-account')"
                        class="font-14 font-weight-600 text-decoration-underline"
                      >
                        Create or import your first blockchain account....
                      </a>
                    </span>
                  </div>
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
                      <div class="d-flex align-items-end">
                        <span class="mr-2 font-weight-bold"
                          >Account Identifier</span
                        >
                        <span>{{ row.item._id }}</span>
                      </div>
                      <div class="d-flex align-items-end mt-2">
                        <span class="mr-2 font-weight-bold">Account Name</span>
                        <span>{{ row.item.account_name }}</span>
                      </div>
                      <div class="d-flex align-items-end mt-2">
                        <span class="mr-2 font-weight-bold">Account ID</span>
                        <span>{{ row.item.publicKey }}</span>
                      </div>
                      <div class="d-flex align-items-end mt-2">
                        <span class="mr-2 font-weight-bold"
                          >Account Balance</span
                        >
                        <span>{{ row.item.balance }}</span>
                      </div>
                      <div class="d-flex align-items-end mt-2">
                        <b-form-checkbox switch size="lg"></b-form-checkbox>
                        <span class="mr-2 text-mutted font-weight-600"
                          >Wallet Account</span
                        >
                      </div>
                      <div class="d-flex align-items-end mt-2">
                        <b-form-checkbox switch size="lg"></b-form-checkbox>
                        <span class="mr-2 text-mutted font-weight-600"
                          >Payment Channel</span
                        >
                      </div>
                      <div class="d-flex align-items-end mt-2">
                        <b-form-checkbox switch size="lg"></b-form-checkbox>
                        <span class="mr-2 text-mutted font-weight-600"
                          >Unassigned Account</span
                        >
                      </div>
                      <div class="d-flex align-items-end mt-3">
                        <button
                          class="btn btn-sm btn-primary font-14 border border-light"
                        >
                          Save changes
                        </button>
                        <button
                          class="btn btn-sm btn-outline-light font-14 ml-2"
                        >
                          Explore services
                        </button>
                      </div>
                    </div>
                  </div>
                </template>
              </b-table>
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
      :isShow="isShowCreateAccountModal"
      @onClose="onCloseCreateAccountModalFn"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { Keypair } from "stellar-sdk";
import { CreatePaymentChannelAccountAPI } from "@/services/payment.channel.service";
import axios from "axios";
import CreateBlockchainAccount from "@/views/modals/CreateBlockchainAccount.vue";
import CustomError from "../Errors/CustomError.vue";
import { GetTxSecurityInfoAPI } from "@/services/user.service";

export default {
  components: {
    CreateBlockchainAccount,
    CustomError
  },
  data() {
    return {
      isLoading: false,
      isLoading1: false,
      isLoading2: false,
      isLoading3: false,
      txSignatureID: null,
      txPasswordHash: null,
      isShowCreateAccountModal: false,
      mainError: {
        status: false,
        code: false,
        description: null
      },
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
          key: "account_name",
          label: "NAME",
          class: "text-start bg-white"
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
      items: [
        {
          index: 1,
          _id: "SSDSKJK2O23837Q7HWJNA7Q61NBW822",
          account_name: "Test 1",
          publicKey: "GDEDFXPDM5HEJVTWR6422JKUATBG5YYTQDXU4Z723WSZI3Y7CWG3BU6S",
          balance: "100.0078563",
          status: "AVAILABLE"
        },
        {
          index: 2,
          _id: "SSDSKJK2O23837Q7HWJNA7Q61NBW822",
          account_name: "Test 1",
          publicKey: "GDEDFXPDM5HEJVTWR6422JKUATBG5YYTQDXU4Z723WSZI3Y7CWG3BU6S",
          balance: "100.0078563",
          status: "ONHOLD"
        },
        {
          index: 3,
          _id: "SSDSKJK2O23837Q7HWJNA7Q61NBW822",
          account_name: "Test 1",
          publicKey: "GDEDFXPDM5HEJVTWR6422JKUATBG5YYTQDXU4Z723WSZI3Y7CWG3BU6S",
          balance: "100.0078563",
          status: "LOCKED"
        },
        {
          index: 4,
          _id: "SSDSKJK2O23837Q7HWJNA7Q61NBW822",
          account_name: "Test 1",
          publicKey: "GDEDFXPDM5HEJVTWR6422JKUATBG5YYTQDXU4Z723WSZI3Y7CWG3BU6S",
          balance: "100.0078563",
          status: "AVAILABLE"
        },
        {
          index: 5,
          _id: "SSDSKJK2O23837Q7HWJNA7Q61NBW822",
          account_name: "Test 1",
          publicKey: "GDEDFXPDM5HEJVTWR6422JKUATBG5YYTQDXU4Z723WSZI3Y7CWG3BU6S",
          balance: "100.0078563",
          status: "AVAILABLE"
        },
        {
          index: 6,
          _id: "SSDSKJK2O23837Q7HWJNA7Q61NBW822",
          account_name: "Test 1",
          publicKey: "GDEDFXPDM5HEJVTWR6422JKUATBG5YYTQDXU4Z723WSZI3Y7CWG3BU6S",
          balance: "100.0078563",
          status: "LOCKED"
        },
        {
          index: 7,
          _id: "SSDSKJK2O23837Q7HWJNA7Q61NBW822",
          account_name: "Test 1",
          publicKey: "GDEDFXPDM5HEJVTWR6422JKUATBG5YYTQDXU4Z723WSZI3Y7CWG3BU6S",
          balance: "100.0078563",
          status: "LOCKED"
        },
        {
          index: 8,
          _id: "SSDSKJK2O23837Q7HWJNA7Q61NBW822",
          account_name: "Test 1",
          publicKey: "GDEDFXPDM5HEJVTWR6422JKUATBG5YYTQDXU4Z723WSZI3Y7CWG3BU6S",
          balance: "100.0078563",
          status: "AVAILABLE"
        },
        {
          index: 9,
          _id: "SSDSKJK2O23837Q7HWJNA7Q61NBW822",
          account_name: "Test 1",
          publicKey: "GDEDFXPDM5HEJVTWR6422JKUATBG5YYTQDXU4Z723WSZI3Y7CWG3BU6S",
          balance: "100.0078563",
          status: "AVAILABLE"
        },
        {
          index: 10,
          _id: "SSDSKJK2O23837Q7HWJNA7Q61NBW822",
          account_name: "Test 1",
          publicKey: "GDEDFXPDM5HEJVTWR6422JKUATBG5YYTQDXU4Z723WSZI3Y7CWG3BU6S",
          balance: "100.0078563",
          status: "AVAILABLE"
        }
      ]
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
    initFn() {
      this.isLoading = false;
      this.isLoading1 = false;
      this.isLoading2 = false;
      this.isLoading3 = false;
      this.txSignatureID = null;
      this.txPasswordHash = null;
      this.isShowCreateAccountModal = false;
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
          if (transactionSignatureID) this.getAllAccountsFn();
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
    showCreateAccountModalFn() {
      this.isShowCreateAccountModal = !this.isShowCreateAccountModal;
    },
    onCloseCreateAccountModalFn(data) {
      // alert(data && data.refresh ? data.refresh : "");
      this.isShowCreateAccountModal = !this.isShowCreateAccountModal;
    },
    getAllAccountsFn() {
      // this.isLoading3 = true;
      // CreatePaymentChannelAccountAPI(payload)
      //   .then(() => {})
      //   .finally(() => (this.isLoading3 = false));

      this.items = this.items.map((object, index) => {
        object.short_id = `${object._id.substr(0, 5)}......${object._id.substr(
          -5
        )}`;
        object.shortPublicKey = `${object.publicKey.substr(
          0,
          10
        )}......${object.publicKey.substr(-5)}`;
        object._showDetails = false;
        object.index = index + 1;
        return object;
      });
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
