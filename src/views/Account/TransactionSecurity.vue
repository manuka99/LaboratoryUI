<template>
  <div>
    <b-card
      v-if="user && user.nationalID && !isLoading"
      header-bg-variant="secondary"
    >
      <b-row align-v="center" slot="header">
        <b-col cols="8">
          <h5 class="mb-0 text-white font-18">
            <i class="mdi mdi-playlist-check font-22 mr-1"></i>Transaction
            Security
          </h5>
        </b-col>
      </b-row>

      <h6 class="text-muted mb-3">
        1. Transaction Signature
      </h6>

      <p class="font-15 text-muted">
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

      <div v-if="!txPasswordHash">
        <p class="font-15 font-weight-600 mb-2 p-0">
          <span class="text-danger"
            >In order to create a transaction signature you must have a
            transaction password. First create your transaction password and
            then create your transaction signature.
          </span>
        </p>
      </div>

      <div v-else>
        <div class="mb-3" v-if="txSignatureID != null">
          <div class="mb-2 w-100 bg-info text-light p-3 rounded">
            <p class="font-14 font-weight-600 m-0 p-0">
              Transaction Signature ID:
              <span class="font-weight-bold ml-1">{{ txSignatureID }}</span>
            </p>
          </div>
          <span
            @click="showGenerateKeypair = !showGenerateKeypair"
            class="text-danger text-decoration-underline cursor-pointer mb-1 ml-1 font-14 font-weight-600"
          >
            {{
              showGenerateKeypair
                ? "Cancel signature generation?"
                : "Change transaction signature?"
            }}</span
          >
        </div>

        <div v-if="txSignatureID == null || showGenerateKeypair">
          <div class="d-flex justify-content-start align-items-center">
            <base-button
              class="btn btn-secondary btn-sm my-0 d-flex justify-content-center align-items-center font-14"
              type="submit"
              @click="generateKeypairFn()"
              nativeType="submit"
            >
              <i class="mdi mdi-key-plus text-white mr-1"></i> Generate
              Signature
            </base-button>
            <base-button
              class="btn btn-light btn-sm my-0 d-flex justify-content-center align-items-center py-0 font-12 font-weight-600 px-2 ml-2"
              type="submit"
              v-if="keypair.secretKey != null"
              @click="clearGeneratedKeypairFn()"
              nativeType="submit"
            >
              <i class="mdi mdi-close-box p-0 font-16 text-danger mr-1"></i>
              <span class="text-mutted">CLEAR</span>
            </base-button>
          </div>

          <div v-if="keypair.secretKey != null" class="mb-3 w-100">
            <p class="font-14 font-weight-600 mt-3 mb-2 p-0">
              Public Key :
              <span class="text-muted">{{ keypair.publicKey }}</span>
            </p>
            <p class="font-14 font-weight-600 mb-2 p-0">
              Secret Key :
              <span class="text-muted">{{ keypair.secretKey }}</span>
            </p>
            <p class="font-14 font-weight-600 mb-2 p-0">
              <span class="text-danger"
                >This is the last time you will see the signature. Therefore,
                make sure you save it securely. Once saved, changing signature
                will take some time to construct a cryptographic proof and the
                operation is expensive. Operation cost is computed based on the
                number of active blockchain accounts.
                <a
                  target="_blank"
                  href="https://developers.stellar.org/docs/tutorials/create-account/"
                  >Learn more</a
                >
              </span>
            </p>
          </div>

          <base-button
            class="btn btn-warning btn-sm mt-0 d-flex justify-content-center align-items-center font-14 text-light"
            type="submit"
            v-if="keypair.secretKey != null"
            @click="copyToClipboardFn"
            nativeType="submit"
          >
            <i class="mdi mdi-content-copy text-white mr-1"></i> Copy to
            Clipboard
          </base-button>

          <div v-if="keypair.publicKey != null">
            <b-form-input
              type="password"
              label="*Current Transaction Password"
              placeholder="Current Transaction Password"
              class="font-14 font-weight-600 mt-3"
              v-model="current_tx_password"
            ></b-form-input>

            <base-button
              class="btn btn-primary mt-3 d-flex justify-content-center align-items-center font-14"
              type="submit"
              :loading="isLoading1"
              @click="CreateTransactionSignatureFn"
              nativeType="submit"
            >
              <i class="mdi mdi-lock text-white mr-1"></i> Save Transaction
              Signature
            </base-button>
          </div>
        </div>
      </div>

      <hr class="my-4" />
      <h6 class="text-muted mb-3">
        2. Transaction Password
      </h6>
      <p class="font-15">
        Choose a strong password and don't reuse it for other accounts.
        <a href="#"> Learn more.</a>
        Use at least 8 characters. Don’t use a password from another site, or
        something too obvious like your pet’s name.
      </p>

      <div>
        <div v-if="txPasswordHash">
          <b-row class="mb-2">
            <b-col lg="6" class="mt-0" v-if="showInputTxPWD">
              <b-form-input
                type="password"
                label="*Current Transaction Password"
                placeholder="Current Transaction Password"
                class="font-14 font-weight-600"
                v-model="raw_old_tx_password"
              ></b-form-input>
            </b-col>
            <b-col lg="6" class="mt-0" v-else>
              <b-form-input
                type="password"
                label="*Transaction Signature Key"
                placeholder="Transaction Signature Key"
                class="font-14 font-weight-600"
                v-model="raw_tx_signature_key"
              ></b-form-input>
            </b-col>
          </b-row>
          <b-row class="mb-3">
            <b-col lg="6" class="mt-0">
              <span
                @click="
                  showInputTxPWD = !showInputTxPWD;
                  raw_old_tx_password = null;
                  raw_tx_signature_key = null;
                "
                class="text-danger text-decoration-underline cursor-pointer mb-1 ml-1 font-15 font-weight-600"
              >
                {{
                  showInputTxPWD
                    ? "Have transaction signature key?"
                    : "Enter transaction password?"
                }}</span
              >
            </b-col>
          </b-row>
        </div>
        <b-row>
          <b-col lg="6" class="mt-0">
            <b-form-input
              type="password"
              label="*New Transaction Password"
              placeholder="New Transaction Password"
              class="font-14 font-weight-600"
              v-model="raw_tx_password"
            ></b-form-input>
          </b-col>
          <b-col lg="6" class="mt-2 m-md-0">
            <b-form-input
              type="password"
              label="*Confirm New Transaction Password"
              placeholder="Confirm New Transaction Password"
              class="font-14 font-weight-600"
              v-model="confirm_tx_raw_password"
            ></b-form-input>
          </b-col>
        </b-row>
      </div>
      <base-button
        class="btn btn-primary mt-3 d-flex justify-content-center align-items-center font-14"
        type="submit"
        @click="changeTxPwdFn"
        :loading="isLoading2"
        :disabled="
          !raw_tx_password ||
            raw_tx_password.length < 8 ||
            raw_tx_password != confirm_tx_raw_password
        "
        nativeType="submit"
      >
        <i class="mdi mdi-lock text-white mr-1"></i> Change Transaction Password
      </base-button>

      <hr class="my-4" />
    </b-card>
    <div
      v-else
      style="min-height: 400px;"
      class="d-flex justify-content-center align-items-center"
    >
      <b-spinner
        variant="primary"
        label="Spinning"
        style="width: 120px; height: 120px;"
      ></b-spinner>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { Keypair } from "stellar-sdk";
import { CreatePaymentChannelAccountAPI } from "@/services/payment.channel.service";

export default {
  data() {
    return {
      isLoading: false,
      isLoading1: false,
      showGenerateKeypair: false,
      txSignatureID: null,
      current_tx_password: null,
      txPasswordHash: null,
      keypair: {
        publicKey: null,
        secretKey: null
      },
      isLoading2: false,
      showInputTxPWD: true,
      raw_old_tx_password: null,
      raw_tx_signature_key: null,
      raw_tx_password: null,
      confirm_tx_raw_password: null
    };
  },
  computed: {
    ...mapGetters({
      user: "user/getUser"
    })
  },
  mounted() {
    this.getTransactionSignatureAndPasswordHashFn();
  },
  methods: {
    getTransactionSignatureAndPasswordHashFn() {
      // this.txSignatureID =
      // "GAZNE5YYM7RPTOQODT3ORQDEAVRURMTSRE5RHBUVU2ISVKDB4AMAVMKD";
      this.txPasswordHash = "";
      this.isLoading = false;
      CreatePaymentChannelAccountAPI()
        .then(() => this.clearGeneratedKeypairFn())
        .finally(() => (this.isLoading = false));
    },
    generateKeypairFn() {
      let keypair = Keypair.random();
      this.keypair.publicKey = keypair.publicKey();
      this.keypair.secretKey = keypair.secret();
    },
    copyToClipboardFn() {
      let text = `Transaction Signature Credentials For ${this.user.fullname} \n\n***** WARNING: DO NOT SHARE THIS ******\n\nPublic key: ${this.keypair.publicKey}\nSecret key: ${this.keypair.secretKey}`;
      this.copyToClipboad(text);
    },
    CreateTransactionSignatureFn() {
      if (!this.current_tx_password)
        return this.$bvToast.toast("Transaction password is required", {
          title: "ERROR! There are fields that requires your attention",
          autoHideDelay: 6000,
          appendToast: false,
          variant: "danger",
          solid: true,
          toaster: "b-toaster-bottom-right"
        });

      this.isLoading1 = true;
      let payload = {
        current_tx_password: this.current_tx_password,
        keypair: this.keypair
      };
      CreatePaymentChannelAccountAPI(payload)
        .then(() => this.clearGeneratedKeypairFn())
        .finally(() => (this.isLoading1 = false));
    },
    clearGeneratedKeypairFn() {
      this.keypair.publicKey = null;
      this.keypair.secretKey = null;
    },
    changeTxPwdFn() {
      if (
        !this.raw_tx_password ||
        this.raw_tx_password != this.confirm_tx_raw_password
      )
        return this.$bvToast.toast(
          "Transaction password and its confirmation is required",
          {
            title: "ERROR! There are fields that requires your attention",
            autoHideDelay: 6000,
            appendToast: false,
            variant: "danger",
            solid: true,
            toaster: "b-toaster-bottom-right"
          }
        );
      this.isLoading2 = true;
      const payload = {
        raw_old_tx_password: this.raw_old_tx_password,
        raw_tx_signature_key: this.raw_tx_signature_key,
        raw_tx_password: this.raw_tx_password
      };
      UpdateTxPasswordAPI(payload).finally(() => (this.isLoading2 = false));
    }
  }
};
</script>

<style></style>
