<template>
  <div>
    <router-view></router-view>
    <VerifyMobileModal />
    <Verify2FAModal />
    <VerifyACTPWDModal />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { APP_USER_TOKEN } from "@/services/config";
import VerifyMobileModal from "@/views/modals/VerifyMobileModal";
import Verify2FAModal from "@/views/modals/Verify2FAModal";
import VerifyACTPWDModal from "./views/modals/VerifyACTPWDModal.vue";

export default {
  components: {
    VerifyMobileModal,
    Verify2FAModal,
    VerifyACTPWDModal
  },
  created() {
    this.onInitFn();
  },
  // watch: {
  //   modelInfo: {
  //     handler(newVal, oldVal) {},
  //     deep: true,
  //     immediate: true
  //   }
  // },
  methods: {
    ...mapActions({
      setJwtToken: "user/setJwtToken"
    }),
    onInitFn() {
      var jwtToken = localStorage.getItem(APP_USER_TOKEN);
      if (jwtToken) {
        this.setJwtToken({ jwtToken, autoNavigate: false });
      }
    }
  }
};
</script>
