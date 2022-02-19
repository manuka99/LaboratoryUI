<template>
  <Layout>
    <div class="container my-5">
      <b-card no-body>
        <b-tabs
          pills
          card
          vertical
          style="min-height: 520px"
          nav-class="bg-white"
          nav-wrapper-class="py-5 px-2"
          active-nav-item-class="bg-light text-dark font-weight-bold"
        >
          <b-tab
            active
            title-link-class="py-3 my-1 font-15 font-weight-600 text-muted"
            lazy
          >
            <template #title>
              <i class="mdi mdi-account-check"></i> User Profile
            </template>
            <Profile
          /></b-tab>
          <b-tab
            title-link-class="py-3 my-1 font-15 font-weight-600 text-muted"
          >
            <template #title>
              <i class="mdi  mdi-key-change"></i> Blockchain Account </template
            ><b-card-text>Tab contents 2</b-card-text></b-tab
          >
          <b-tab
            title-link-class="py-3 my-1 font-15 font-weight-600 text-muted"
          >
            <template #title>
              <i class="mdi mdi-coin"></i> Crypto Wallet </template
            ><b-card-text>Tab contents 3</b-card-text></b-tab
          >
          <b-tab
            title-link-class="py-3 my-1 font-15 font-weight-600 text-muted"
          >
            <template #title>
              <i class="mdi mdi-cube-outline"></i> Payment Channels </template
            ><b-card-text>Tab contents 3</b-card-text></b-tab
          >
          <b-tab
            title-link-class="py-3 my-1 font-15 font-weight-600 text-muted"
          >
            <template #title>
              <i class="mdi mdi-file-document"></i>Blockchain Transactions </template
            ><b-card-text>Tab contents 3</b-card-text></b-tab
          >
          <b-tab
            title-link-class="py-3 my-1 font-15 font-weight-600 text-muted"
          >
            <template #title>
              <i class="mdi mdi-laptop-mac"></i> Logged In Devices </template
            ><b-card-text>Tab contents 3</b-card-text></b-tab
          >
          <b-tab
            title-link-class="py-3 my-1 font-15 font-weight-600 text-muted"
          >
            <template #title>
              <i class="mdi mdi-security"></i> Security </template
            ><b-card-text>Tab contents 3</b-card-text></b-tab
          >
        </b-tabs>
      </b-card>
    </div>
  </Layout>
</template>

<script>
import Layout from "@/components/HorizontalLayout/Layout";
import Profile from "./Profile";
export default {
  components: {
    Layout,
    Profile
  },
  data() {
    return {};
  },
  mounted() {
    this.initFn();
  },
  methods: {
    initFn() {}
  }
};
</script>

<style></style>
