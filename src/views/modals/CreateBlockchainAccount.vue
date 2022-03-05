<template>
  <div>
    <fund-blockchain-account
      v-model="fundAccountModal"
      @onClose="onCloseFundAccountModalFn"
    />
    <b-modal
      v-model="isShow"
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
          <p class="text-muted font-15 mb-0">
            Choose a unique account name and don't reuse it for other accounts.
            Usage of a unique account name is not mandatary but will assist you
            to manage channel accounts effectively.
            <a href="#"> Learn more.</a>
          </p>
          <div class="w-100">
            <b-row>
              <b-col lg="6" class="mt-3">
                <b-form-input
                  type="text"
                  label="*Channel Name"
                  placeholder="Channel Name"
                  class="font-14 font-weight-600"
                  v-model="account_name"
                ></b-form-input>
              </b-col>
              <b-col lg="6" class="mt-3"> </b-col>
            </b-row>
            <b-row>
              <b-col lg="8" class="mt-3">
                <b-form-textarea
                  label="Channel Description"
                  placeholder="Description..."
                  rows="4"
                  max-rows="8"
                  class="font-14 font-weight-600"
                  v-model="account_description"
                ></b-form-textarea>
              </b-col>
            </b-row>
          </div>
          <h6 class="text-muted font-15 mt-3">Account Keypair:</h6>
          <p class="font-15">
            Stellar uses public key cryptography to ensure that every
            transaction is secure: every Stellar account has a keypair
            consisting of a public key and a secret key. The public key is
            always safe to share — other people need it to identify your account
            and verify that you authorized a transaction. It’s like an email
            address. The secret key, however, is private information that proves
            you own — and gives you access to — your account. It’s like a
            password, and you should never share it with anyone. Before creating
            an account, you need to generate your own keypair.
            <a
              target="_blank"
              href="https://developers.stellar.org/docs/tutorials/create-account/"
              >Learn more</a
            >
          </p>

          <div class="d-flex justify-content-center align-items-center">
            <base-button
              class="btn btn-secondary btn-sm my-0 d-flex justify-content-center align-items-center font-14"
              type="submit"
              @click="generateKeypairFn()"
              nativeType="submit"
            >
              <i class="mdi mdi-key-plus text-white mr-1"></i> Generate Keypairs
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
              <span class="text-muted">{{ generatedKeypair.publicKey }}</span>
            </p>
            <p class="font-14 font-weight-600 mb-2 p-0">
              Secret Key :
              <span class="text-muted">{{ generatedKeypair.secretKey }}</span>
            </p>
            <a
              @click="
                fundAccountModal.destination = generatedKeypair.publicKey;
                scrollTo('#fund-account');
                showFundAccountModalFn();
              "
              class="font-14 font-weight-600 text-decoration-underline"
            >
              Fund this account on the test network using the friendbot tool
              below
            </a>
          </div>

          <base-button
            class="btn btn-warning btn-sm mt-0 d-flex justify-content-center align-items-center font-14 text-light"
            type="submit"
            v-if="generatedKeypair.secretKey != null"
            @click="copyToClipboardFn"
            nativeType="submit"
          >
            <i class="mdi mdi-content-copy text-white mr-1"></i> Copy to
            Clipboard
          </base-button>
          <div class="d-flex justify-content-center align-items-center mt-3">
            <base-button
              class="btn btn-info btn-sm my-0 d-flex justify-content-center align-items-center font-14"
              type="submit"
              @click="showImportKeypairFn()"
              nativeType="submit"
            >
              <i class="mdi mdi-key-change text-white mr-1"></i> Import Existing
              Keypair
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
                v-model="importedKeypair.secretKey"
                placeholder="Enter Secret Key"
                class="font-14"
              ></b-form-input>
            </b-form-group>
          </div>

          <base-button
            class="btn btn-primary mt-3 d-flex justify-content-center align-items-center font-14"
            type="submit"
            v-if="keypair != null"
            :loading="isLoading1"
            @click="createBlockchainAccountFn"
            nativeType="submit"
          >
            <i class="mdi mdi-lock text-white mr-1"></i> Save Blockchain Account
          </base-button>

          <hr class="my-4" style="height: 2px; width: 100%;" />
        </section>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { Keypair } from "stellar-sdk";
import { CreatePaymentChannelAccountAPI } from "@/services/payment.channel.service";
import FundBlockchainAccount from "@/views/modals/FundBlockchainAccount.vue";

export default {
  components: {
    FundBlockchainAccount
  },
  data() {
    return {
      isShowFundAccountModal: false,
      account_name: null,
      account_description: null,
      keypair: null,
      fundPublicKey: null,
      generatedKeypair: {
        publicKey: null,
        secretKey: null
      },
      importedKeypair: {
        publicKey: null,
        secretKey: null
      },
      isLoading1: false,
      isLoading2: false,
      showImportKeypair: false,
      fundAccountModal: {
        destination: "",
        isShow: false
      }
    };
  },
  props: {
    isShow: Boolean
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
    }
  },
  methods: {
    showFundAccountModalFn() {
      this.fundAccountModal.isShow = true;
    },
    onCloseFundAccountModalFn(data) {
      alert(data && data.refresh ? data.refresh : "");
    },
    generateKeypairFn() {
      this.clearImportedKeypairFn();
      let keypair = Keypair.random();
      this.generatedKeypair.publicKey = keypair.publicKey();
      this.generatedKeypair.secretKey = keypair.secret();
    },
    copyToClipboardFn() {
      let text = `Payment channel account credentials\nPublic key: ${this.keypair.publicKey}\nSecret key: ${this.keypair.secretKey}`;
      this.copyToClipboad(text);
    },
    createBlockchainAccountFn() {
      if (!this.account_name) {
        this.$bvToast.toast("Channel account name is required", {
          title: "ERROR! There are fields that requires your attention",
          autoHideDelay: 6000,
          appendToast: false,
          variant: "danger",
          solid: true,
          toaster: "b-toaster-bottom-right"
        });
      } else if (!this.keypair) {
        this.$bvToast.toast("Channel account keypair is required", {
          title: "ERROR! There are fields that requires your attention",
          autoHideDelay: 6000,
          appendToast: false,
          variant: "danger",
          solid: true,
          toaster: "b-toaster-bottom-right"
        });
      } else {
        this.isLoading1 = true;
        let payload = {
          account_name: this.account_name,
          account_description: this.account_description,
          keypair: this.keypair
        };
        CreatePaymentChannelAccountAPI(payload)
          .then(() => this.resetCreateChannelFn())
          .finally(() => (this.isLoading1 = false));
      }
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
    resetCreateChannelFn() {
      this.account_name = null;
      this.account_description = null;
      this.keypair = null;
      this.generatedKeypair.publicKey = null;
      this.generatedKeypair.secretKey = null;
      this.importedKeypair.publicKey = null;
      this.importedKeypair.secretKey = null;
    },
    hideModalFn() {
      this.verification_code = null;
      this.$emit("onClose", {
        refresh: true
      });
    }
  }
};
</script>

<style scoped></style>
