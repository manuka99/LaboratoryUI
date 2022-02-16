<template>
  <div>
    <Header />
    <slot></slot>
    <Footer />
  </div>
</template>

<script>
import Header from "@/components/HorizontalLayout/Header";
import Footer from "@/components/HorizontalLayout/Footer";
export default {
  components: {
    Header,
    Footer
  }
};
</script>

<style scoped></style>
