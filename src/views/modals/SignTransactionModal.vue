<template>
  <div>
    <b-modal
      v-model="value.isShow"
      footer-class="d-none"
      header-class="p-0"
      modal-class="w-100 p-0 d-flex justify-content-center"
      dialog-class="max-width-1100px w-100 m-4 d-flex justify-content-center align-items-center"
      content-class="height-92vh"
      body-class="overflow-y-auto"
      no-close-on-backdrop
    >
      <template #modal-header>
        <div
          class="w-100 d-flex justify-content-between align-items-center bg-dark py-2 px-4"
        >
          <span
            class="mb-0 text-white"
            style="font-size: clamp(15px, 3.5vw, 20px);"
          >
            <i class="mdi mdi-key-change mr-2"></i>{{ title }}
          </span>
          <div class="cursor-pointer" @click="hideModalFn">
            <i class="mdi mdi-close-box-outline font-32 text-white"></i>
          </div>
        </div>
      </template>
      <div>
        <section
          class="d-flex flex-column align-items-start justify-content-start px-2 w-100"
        >
          <SignTransaction :xdr="xdr" :isOnline="isOnline" />
        </section>
      </div>
    </b-modal>
  </div>
</template>

<script>
import SignTransaction from "@/views/SignTransaction/SignTransaction.vue";

export default {
  components: {
    SignTransaction
  },
  data() {
    return {};
  },
  props: {
    value: {
      type: Object,
      default: function() {
        return {
          isShow: false
        };
      }
    },
    title: {
      type: String,
      default: "Sign Blockchain Transaction"
    },
    xdr: String,
    isOnline: Boolean
  },
  methods: {
    initFn() {},
    hideModalFn() {
      this.value.destination = null;
      this.value.isShow = false;
      this.$emit("onClose", {
        refresh: true
      });
    }
  }
};
</script>

<style scoped></style>
