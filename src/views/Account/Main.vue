<template>
  <Layout>
    <div class="my-5 px-3 d-flex justify-content-center align-items-center">
      <div style="width: 100%; max-width: 1140px;">
        <b-card no-body style="background-color:">
          <b-tabs
            pills
            card
            vertical
            style="min-height: 520px"
            class="overflow-auto"
            nav-class="bg-white"
            nav-wrapper-class="overflow-auto py-0 py-lg-5 px-2 col-12 col-lg-3 w-100"
            content-class="overflow-auto col-12 col-lg-9 w-100"
            active-nav-item-class="bg-light text-dark font-weight-bold"
            v-model="tabIndex"
            @input="changeRoute"
          >
            <b-tab
              title-link-class="py-3 my-1 font-15 font-weight-600 text-muted text-nowrap"
              href="#profile"
              lazy
            >
              <template #title>
                <i class="mdi mdi-account-check"></i> User Profile
              </template>
              <Profile
            /></b-tab>
            <b-tab
              title-link-class="py-3 my-1 font-15 font-weight-600 text-muted text-nowrap"
              href="#blockchain-account"
              lazy
            >
              <template #title>
                <i class="mdi  mdi-key-change"></i> Blockchain Account </template
              ><b-card-text>Tab contents 2</b-card-text></b-tab
            >
            <b-tab
              title-link-class="py-3 my-1 font-15 font-weight-600 text-muted text-nowrap"
              href="#wallet"
              lazy
            >
              <template #title>
                <i class="mdi mdi-coin"></i> Crypto Wallet </template
              ><b-card-text>Tab contents 3</b-card-text></b-tab
            >
            <b-tab
              title-link-class="py-3 my-1 font-15 font-weight-600 text-muted text-nowrap"
              href="#payment-channels"
              lazy
            >
              <template #title>
                <i class="mdi mdi-cube-outline"></i> Payment Channels </template
              ><PaymentChannels
            /></b-tab>
            <b-tab
              title-link-class="py-3 my-1 font-15 font-weight-600 text-muted text-nowrap"
              href="#transactions"
              lazy
            >
              <template #title>
                <i class="mdi mdi-file-document"></i>Blockchain Transactions </template
              ><b-card-text>Tab contents 3</b-card-text></b-tab
            >
            <b-tab
              title-link-class="py-3 my-1 font-15 font-weight-600 text-muted text-nowrap"
              lazy
              href="#signed-in-devices"
            >
              <template #title>
                <i class="mdi mdi-cellphone-link"></i> Signed In Devices </template
              ><SignedInDevices
            /></b-tab>
            <b-tab
              title-link-class="py-3 my-1 font-15 font-weight-600 text-muted text-nowrap"
              lazy
              href="#two-factor-authorization"
            >
              <template #title>
                <i class="mdi mdi-cellphone-android"></i> Two Factor
                Authentication </template
              ><TwoFactorAuthentication
            /></b-tab>
            <b-tab
              title-link-class="py-3 my-1 font-15 font-weight-600 text-muted text-nowrap"
              lazy
              href="#security"
            >
              <template #title>
                <i class="mdi mdi-security"></i> Security </template
              ><Security
            /></b-tab>
          </b-tabs>
        </b-card>
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from "@/components/HorizontalLayout/Layout";
import Profile from "./Profile";
import Security from "./Security";
import TwoFactorAuthentication from "./TwoFactorAuthentication";
import SignedInDevices from "./SignedInDevices.vue";
import PaymentChannels from "./PaymentChannels.vue";

export default {
  components: {
    Layout,
    Profile,
    TwoFactorAuthentication,
    Security,
    SignedInDevices,
    PaymentChannels
  },
  data() {
    return {
      tabIndex: 0,
      tabs: [
        "#profile",
        "#blockchain-account",
        "#wallet",
        "#payment-channels",
        "#transactions",
        "#signed-in-devices",
        "#two-factor-authorization",
        "#security"
      ]
    };
  },
  created() {
    this.initFn();
  },
  watch: {
    // tabIndex(val) {
    //   console.log(val);
    // }
  },
  methods: {
    initFn() {
      this.tabIndex = this.tabs.findIndex(tab => tab === this.$route.hash);
    },
    changeRoute(value) {
      this.$router.push(this.tabs[value]);
    }
  }
};
</script>

<style></style>
