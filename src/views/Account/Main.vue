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
                <div class="d-flex justify-content-start align-items-center">
                  <i class="mdi mdi-account-card-details font-18 mr-1"></i> User
                  Profile
                </div>
              </template>
              <Profile
            /></b-tab>
            <b-tab
              title-link-class="py-3 my-1 font-15 font-weight-600 text-muted text-nowrap"
              href="#blockchain-accounts"
              lazy
            >
              <template #title>
                <div class="d-flex justify-content-start align-items-center">
                  <i class="mdi mdi-key-change font-16 mr-1"></i> Blockchain
                  Accounts
                </div>
              </template>
              <BlockchainAccounts />
            </b-tab>
            <b-tab
              title-link-class="py-3 my-1 font-15 font-weight-600 text-muted text-nowrap"
              href="#blockchain-identification"
              lazy
            >
              <template #title>
                <div class="d-flex justify-content-start align-items-center">
                  <i class="mdi mdi-account-check font-20"></i> Blockchain
                  Identification
                </div> </template
              ><BlockchainIdentification
            /></b-tab>
            <b-tab
              title-link-class="py-3 my-1 font-15 font-weight-600 text-muted text-nowrap"
              lazy
              href="#signed-in-devices"
            >
              <template #title>
                <div class="d-flex justify-content-start align-items-center">
                  <i class="mdi mdi-cellphone-link font-18 mr-1"></i> Signed In
                  Devices
                </div> </template
              ><SignedInDevices
            /></b-tab>
            <b-tab
              title-link-class="py-3 my-1 font-15 font-weight-600 text-muted text-nowrap"
              lazy
              href="#two-factor-authorization"
            >
              <template #title>
                <div class="d-flex justify-content-start align-items-center">
                  <i class="mdi mdi-cellphone-android font-18"></i> Two Factor
                  Authentication
                </div> </template
              ><TwoFactorAuthentication
            /></b-tab>
            <b-tab
              title-link-class="py-3 my-1 font-15 font-weight-600 text-muted text-nowrap"
              lazy
              href="#transaction-security"
            >
              <template #title>
                <div class="d-flex justify-content-start align-items-center">
                  <i class="mdi mdi-playlist-check font-22"></i>Transaction
                  Security
                </div> </template
              ><TransactionSecurity
            /></b-tab>
            <b-tab
              title-link-class="py-3 my-1 font-15 font-weight-600 text-muted text-nowrap"
              lazy
              href="#account-security"
            >
              <template #title>
                <div class="d-flex justify-content-start align-items-center">
                  <i class="mdi mdi-security font-16"></i> Account Security
                </div> </template
              ><AccountSecurity
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
import BlockchainAccounts from "./BlockchainAccounts.vue";
import BlockchainIdentification from "./BlockchainIdentification.vue";
import SignedInDevices from "./SignedInDevices.vue";
import TwoFactorAuthentication from "./TwoFactorAuthentication";
import TransactionSecurity from "./TransactionSecurity.vue";
import AccountSecurity from "./AccountSecurity";

export default {
  components: {
    Layout,
    Profile,
    TwoFactorAuthentication,
    AccountSecurity,
    SignedInDevices,
    TransactionSecurity,
    BlockchainAccounts,
    BlockchainIdentification
  },
  data() {
    return {
      tabIndex: 0,
      tabs: [
        "#profile",
        "#blockchain-accounts",
        "#blockchain-identification",
        "#payment-channels",
        "#transactions",
        "#signed-in-devices",
        "#two-factor-authorization",
        "#transaction-security",
        "#account-security"
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
