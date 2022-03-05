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
import axios from "axios";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      user: "user/getUser"
    })
  },
  mounted() {},
  methods: {}
};
</script>

<style></style>
