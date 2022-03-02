<template>
  <div>
    <b-card v-if="user && user.nationalID" header-bg-variant="secondary">
      <b-row align-v="center" slot="header">
        <b-col cols="8">
          <h5 class="mb-0 text-white font-18">
            <i class="mdi mdi-cube-outline"></i> Payment Channels
          </h5>
        </b-col>
      </b-row>
      <h6 class="text-muted mb-3">
        1. Create Channel Account
      </h6>
      <p class="text-muted font-14 mb-0">
        Choose a unique account name and don't reuse it for other accounts.
        Usage of a unique account name is not mandatary but will assist you to
        manage channel accounts effectively.
        <a href="#"> Learn more.</a>
      </p>
      <div>
        <b-row>
          <b-col lg="6" class="mt-3">
            <b-form-input
              type="text"
              label="*Channel Name"
              placeholder="Channel Name"
              class="font-14 font-weight-600"
              v-model="channel_name"
            ></b-form-input>
          </b-col>
          <b-col lg="6" class="mt-3"> </b-col>
        </b-row>
        <b-row>
          <b-col lg="12" class="mt-3">
            <b-form-textarea
              label="Channel Description"
              placeholder="Description..."
              rows="3"
              max-rows="6"
              class="font-14 font-weight-600"
              v-model="channel_description"
            ></b-form-textarea>
          </b-col>
        </b-row>
      </div>
      <h6 class="text-muted font-14 mt-3">Account Keypair:</h6>
      <p class="font-14">
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

      <base-button
        class="btn btn-secondary btn-sm mt-3 d-flex justify-content-center align-items-center font-14"
        type="submit"
        @click="generateKeypairFn"
        nativeType="submit"
      >
        <i class="mdi mdi-key-plus text-white mr-1"></i> Generate Keypairs
      </base-button>

      <div v-if="keypair != null">
        <p class="font-14 font-weight-600 mt-3 mb-2">
          Public Key :
          <span class="text-muted">{{ keypair.publicKey }}</span>
        </p>
        <p class="font-14 font-weight-600 mb-3">
          Secret Key :
          <span class="text-muted">{{ keypair.secretKey }}</span>
        </p>
      </div>

      <base-button
        class="btn btn-warning btn-sm mt-2 d-flex justify-content-center align-items-center font-14 text-light"
        type="submit"
        v-if="keypair != null"
        @click="copyToClipboardFn"
        nativeType="submit"
      >
        <i class="mdi mdi-content-copy text-white mr-1"></i> Copy to Clipboard
      </base-button>

      <base-button
        class="btn btn-primary mt-3 d-flex justify-content-center align-items-center font-14"
        type="submit"
        v-if="keypair != null"
        :loading="isLoading1"
        @click="createPaymentChannelAccountFn"
        nativeType="submit"
      >
        <i class="mdi mdi-lock text-white mr-1"></i> Create Payment Channel
        Account
      </base-button>

      <hr class="my-4" />

      <h6 class="text-muted mb-3">
        2. Manage channel accounts
      </h6>

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
            >
            </b-table>
          </div>
        </b-col>
      </b-row>
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
      channel_name: null,
      channel_description: null,
      keypair: null,
      isLoading1: false,
      fields: [
        {
          key: "index",
          label: "#",
          sortable: true,
          sortDirection: "asc",
          class: "text-start"
        },
        {
          key: "_id",
          label: "Identifier",
          class: "text-start"
        },
        {
          key: "channel_name",
          label: "CHANNEL NAME",
          class: "text-start"
        },
        {
          key: "publicKey",
          label: "ACCOUNT ID",
          class: "text-start"
        },
        {
          key: "balance",
          label: "BALANCE",
          sortable: true,
          sortDirection: "desc",
          class: "text-start"
        },
        {
          key: "status",
          label: "FLAG",
          sortable: true,
          sortDirection: "desc",
          class: "text-start"
        }
      ],
      items: [
        {
          index: 1,
          _id: "AWFGB14D...2F73",
          channel_name: "Test 1",
          publicKey: "GAMYB2IUHM......XIZZQ",
          balance: "100.0078563",
          status: "UNLOCKED"
        },
        {
          index: 2,
          _id: "AWFGB14D...2F73",
          channel_name: "Test 1",
          publicKey: "GAMYB2IUHM......XIZZQ",
          balance: "100.0078563",
          status: "UNLOCKED"
        },
        {
          index: 3,
          _id: "AWFGB14D...2F73",
          channel_name: "Test 1",
          publicKey: "GAMYB2IUHM......XIZZQ",
          balance: "100.0078563",
          status: "UNLOCKED"
        },
        {
          index: 4,
          _id: "AWFGB14D...2F73",
          channel_name: "Test 1",
          publicKey: "GAMYB2IUHM......XIZZQ",
          balance: "100.0078563",
          status: "UNLOCKED"
        },
        {
          index: 5,
          _id: "AWFGB14D...2F73",
          channel_name: "Test 1",
          publicKey: "GAMYB2IUHM......XIZZQ",
          balance: "100.0078563",
          status: "UNLOCKED"
        },
        {
          index: 6,
          _id: "AWFGB14D...2F73",
          channel_name: "Test 1",
          publicKey: "GAMYB2IUHM......XIZZQ",
          balance: "100.0078563",
          status: "UNLOCKED"
        },
        {
          index: 7,
          _id: "AWFGB14D...2F73",
          channel_name: "Test 1",
          publicKey: "GAMYB2IUHM......XIZZQ",
          balance: "100.0078563",
          status: "UNLOCKED"
        },
        {
          index: 8,
          _id: "AWFGB14D...2F73",
          channel_name: "Test 1",
          publicKey: "GAMYB2IUHM......XIZZQ",
          balance: "100.0078563",
          status: "UNLOCKED"
        },
        {
          index: 9,
          _id: "AWFGB14D...2F73",
          channel_name: "Test 1",
          publicKey: "GAMYB2IUHM......XIZZQ",
          balance: "100.0078563",
          status: "UNLOCKED"
        },
        {
          index: 10,
          _id: "AWFGB14D...2F73",
          channel_name: "Test 1",
          publicKey: "GAMYB2IUHM......XIZZQ",
          balance: "100.0078563",
          status: "UNLOCKED"
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      user: "user/getUser"
    })
  },
  mounted() {},
  methods: {
    generateKeypairFn() {
      let keypair = Keypair.random();
      let publicKey = keypair.publicKey();
      let secretKey = keypair.secret();
      this.keypair = {
        publicKey,
        secretKey
      };
    },
    copyToClipboardFn() {
      let text = `Payment channel account credentials\nPublic key: ${this.keypair.publicKey}\nSecret key: ${this.keypair.secretKey}`;
      this.copyToClipboad(text);
      this.$bvToast.toast("Account credentials were copied successfully", {
        title: "SUCCESS! Task was completed.",
        autoHideDelay: 4000,
        appendToast: false,
        variant: "success",
        solid: true,
        toaster: "b-toaster-top-right"
      });
    },
    createPaymentChannelAccountFn() {
      if (!this.channel_name) {
        this.$bvToast.toast("Channel account name is required", {
          title: "ERROR! There are fields that requires your attention",
          autoHideDelay: 6000,
          appendToast: false,
          variant: "danger",
          solid: true,
          toaster: "b-toaster-top-right"
        });
      } else if (!this.keypair) {
        this.$bvToast.toast("Channel account keypair is required", {
          title: "ERROR! There are fields that requires your attention",
          autoHideDelay: 6000,
          appendToast: false,
          variant: "danger",
          solid: true,
          toaster: "b-toaster-top-right"
        });
      } else {
        this.isLoading1 = true;
        let payload = {
          channel_name: this.channel_name,
          channel_description: this.channel_description,
          keypair: this.keypair
        };
        CreatePaymentChannelAccountAPI(payload)
          .then(() => this.resetCreateChannelFn())
          .finally(() => (this.isLoading1 = false));
      }
    },
    resetCreateChannelFn() {
      this.channel_name = null;
      this.channel_description = null;
      this.keypair = null;
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
}
</style>
