<template>
  <router-view></router-view>
</template>

<script>
import { mapActions } from "vuex";
import { APP_USER_TOKEN } from "@/services/config";
export default {
  created() {
    this.onInitFn();
  },
  methods: {
    ...mapActions({
      setJwtToken: "user/setJwtToken"
    }),
    onInitFn() {
      var jwtToken = localStorage.getItem(APP_USER_TOKEN);
      if (jwtToken) this.setJwtToken({ jwtToken });
    }
  }
};
</script>
