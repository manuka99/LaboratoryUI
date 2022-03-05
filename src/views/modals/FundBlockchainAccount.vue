<template>
  <b-modal
    v-model="value.isShow"
    footer-class="d-none"
    header-class="p-0"
    modal-class="w-100 p-0 d-flex justify-content-center"
    dialog-class="max-width-900px m-4"
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
          <i class="mdi  mdi-key-change"></i> Blockchain Account Funding
        </span>
        <div class="cursor-pointer" @click="hideModalFn">
          <i class="mdi mdi-close-box-outline font-32 text-white"></i>
        </div>
      </div>
    </template>
    <div>
      <section
        class="d-flex flex-column align-items-start justify-content-start px-2"
      >
        <p class="font-15">
          On the public network, where live users make live transactions, your
          next step would be to acquire XLM, which you can do by consulting our
          lumen buying guide. Because this version of the application is running
          on the test network, you can get 10,000 test XLM from Friendbot, which
          is a friendly account funding tool.
        </p>

        <div
          class="bg-light py-4 px-3 mt-2 border rounded w-100"
          style="max-width: 560px;"
        >
          <b-form-group
            id="input-group-2"
            label="Account ID:"
            label-for="input-2"
            class="font-14 font-weight-600 text-mutted m-0"
          >
            <b-form-input
              id="input-2"
              v-model="value.destination"
              placeholder="Enter Public Key"
              class="font-14"
            ></b-form-input>
          </b-form-group>

          <base-button
            class="btn btn-primary btn-sm mt-3 d-flex justify-content-center align-items-center font-14"
            type="submit"
            :loading="isLoading"
            :disabled="!value.destination"
            @click="fundAccountWithTestXLMFn"
            nativeType="submit"
          >
            <i class="mdi mdi-coin text-white mr-1 font-16"></i> Fund account
            with test XLM
          </base-button>
        </div>

        <hr class="mt-4 mb-5" style="height: 2px; width: 100%;" />
      </section>
    </div>
  </b-modal>
</template>

<script>
import { Keypair } from "stellar-sdk";
import axios from "axios";

export default {
  data() {
    return {
      isLoading: false
    };
  },
  props: {
    value: {
      type: Object,
      default: {
        destination: "",
        isShow: false
      }
    },
    destination: null
  },
  methods: {
    fundAccountWithTestXLMFn() {
      if (!this.value.destination) {
        this.$bvToast.toast("Account ID is required", {
          title: "ERROR! There are fields that requires your attention",
          autoHideDelay: 6000,
          appendToast: false,
          variant: "danger",
          solid: true,
          toaster: "b-toaster-bottom-right"
        });
      } else {
        this.isLoading = true;
        axios
          .get(`https://friendbot.stellar.org/?addr=${this.value.destination}`)
          .then(() => {
            this.$bvToast.toast("Account ID was funded with test XLM", {
              title: "SUCCESS! Task was completed successfully",
              autoHideDelay: 6000,
              appendToast: false,
              variant: "success",
              solid: true,
              toaster: "b-toaster-bottom-right"
            });
          })
          .catch(({ response, ...error }) => {
            var errMessage =
              response && response.data
                ? response.data.detail
                : error.message || "Unexpected error";
            this.$bvToast.toast(errMessage, {
              title: "ERROR! Task was not completed.",
              autoHideDelay: 6000,
              appendToast: false,
              variant: "danger",
              solid: true,
              toaster: "b-toaster-bottom-right",
              appendToast: true
            });
          })
          .finally(() => (this.isLoading = false));
      }
    },
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
