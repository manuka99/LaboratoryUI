<template>
  <div>
    <router-view></router-view>
    <VerifyACTPWDModal v-if="modelInfo.showPasswordVerify" />
    <Verify2FAModal v-if="modelInfo.show2FAVerify" />
    <VerifyMobileModal v-if="modelInfo.showMobileVerify" />
    <VerifyTXNPWDModal v-if="modelInfo.showTxPasswordVerify" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { APP_USER_TOKEN } from "@/services/config";
import VerifyMobileModal from "@/views/modals/VerifyMobileModal";
import Verify2FAModal from "@/views/modals/Verify2FAModal";
import VerifyACTPWDModal from "./views/modals/VerifyACTPWDModal.vue";
import VerifyTXNPWDModal from "./views/modals/VerifyTXNPWDModal.vue";

export default {
  components: {
    VerifyMobileModal,
    Verify2FAModal,
    VerifyACTPWDModal,
    VerifyTXNPWDModal
  },
  created() {
    this.onInitFn();
  },
  computed: {
    ...mapGetters({
      modelInfo: "modal/getModalsInfo"
    })
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
