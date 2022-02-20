<template>
  <div>
    <router-view></router-view>
    <VerifyMobileModal />
    <Verify2FAModal />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { APP_USER_TOKEN } from "@/services/config";
import VerifyMobileModal from "@/views/modals/VerifyMobileModal";
import Verify2FAModal from "@/views/modals/Verify2FAModal";

export default {
  components: {
    VerifyMobileModal,
    Verify2FAModal
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
