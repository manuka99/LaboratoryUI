<template>
  <div>
    <b-toast id="example-toast" title="BootstrapVue" static no-auto-hide>
      Hello, world! This is a toast message.
    </b-toast>
    <Header />
    <slot></slot>
    <ToastNotification />
    <Footer />
  </div>
</template>

<script>
import Header from "@/components/HorizontalLayout/Header";
import Footer from "@/components/HorizontalLayout/Footer";
import ToastNotification from "@/components/ToastNotification";

export default {
  components: {
    Header,
    Footer,
    ToastNotification
  }
};
</script>

<style scoped></style>
