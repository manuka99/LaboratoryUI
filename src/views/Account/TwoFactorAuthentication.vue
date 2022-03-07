<template>
  <div>
    <b-card v-if="user && user.nationalID" header-bg-variant="secondary">
      <Disable2FA v-if="user.isTwoFactorEnabled" @disabled2FA="on2FADisFn" />
      <div v-else>
        <Setup2FA v-if="isRegStep1" @registered="on2FARegFn" />
        <Activate2FA
          v-if="isRegStep2"
          :registrationData="registrationData"
          @activated="on2FAActFn"
        />
      </div>
    </b-card>
    <div
      v-else
      style="min-height: 400px;"
      class="d-flex justify-content-center align-items-center"
    >
      <b-spinner
        variant="primary"
        label="Spinning"
        style="width: 120px; height: 120px;"
      ></b-spinner>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Setup2FA from "../Setup2FA.vue";
import Activate2FA from "../Activate2FA.vue";
import Disable2FA from "../Disable2FA.vue";

export default {
  components: { Setup2FA, Activate2FA, Disable2FA },
  data() {
    return {
      isRegStep1: true,
      isRegStep2: false,
      registrationData: {}
    };
  },
  computed: {
    ...mapGetters({
      user: "user/getUser"
    })
  },
  methods: {
    ...mapActions({
      setJwtToken: "user/setJwtToken"
    }),
    on2FARegFn(data) {
      this.registrationData = data;
      this.isRegStep1 = false;
      this.isRegStep2 = true;
    },
    on2FAActFn(data) {
      this.setJwtToken({
        jwtToken: data.token,
        autoNavigate: false
      });
      this.isRegStep1 = false;
      this.isRegStep2 = false;
    },
    on2FADisFn(data) {
      this.setJwtToken({
        jwtToken: data.token,
        autoNavigate: false
      });
      this.isRegStep1 = true;
      this.isRegStep2 = false;
    }
  }
};
</script>

<style scoped></style>
