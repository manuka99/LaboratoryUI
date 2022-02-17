<template>
  <Layout>
    <div style="height: 400px;"></div>
  </Layout>
</template>

<script>
import Layout from "@/components/HorizontalLayout/Layout";

export default {
  components: {
    Layout
  },
  name: "MainPage",
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
