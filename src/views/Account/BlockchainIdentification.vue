<template>
  <div>
    <b-card v-if="user && user.nationalID" header-bg-variant="secondary">
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

export default {
  components: {
    CreateBlockchainAccount
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      user: "user/getUser"
    })
  },
  mounted() {
    this.getAllAccountsFn();
  },
  methods: {}
};
</script>

<style></style>
