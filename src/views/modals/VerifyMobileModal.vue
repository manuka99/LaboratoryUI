<template>
  <b-modal
    v-model="modelInfo.showMobileVerify"
    size="lg"
    footer-class="d-none"
    header-class="d-none"
    no-close-on-backdrop
  >
    <div>
      <section
        class="d-flex justify-content-end cursor-pointer"
        @click="hideModalFn"
      >
        <i class="mdi mdi-close-box-outline font-32 text-danger"></i>
      </section>
      <section
        class="d-flex flex-column align-items-center justify-content-center px-5 mb-4"
      >
        <div class="">
          <div class="row justify-content-center">
            <div
              class="d-flex flex-column align-items-center justify-content-center"
            >
              <div class="">
                <div class="">
                  <div class="pb-0">
                    <div class="d-flex justify-content-center">
                      <div
                        class="rounded-circle bg-dark d-flex justify-content-center align-items-center"
                        style="width: 36px; height: 34px;"
                      >
                        <i class="mdi mdi-lock text-white"></i>
                      </div>
                    </div>
                    <h5 class="card-title text-center pb-0 mt-2 fs-4">
                      Mobile/SMS Verification (OTP)
                    </h5>
                    <h6 class="text-danger text-center pb-0 font-14">
                      To access the requested service, user must verify their
                      identity through their registered mobile
                    </h6>
                  </div>

                  <p class="text-muted  small font-13">
                    Use your phone as your primary step to recover your account.
                    This adds an additional layer of security to your account by
                    requiring the verification of your mobile number to recover
                    your account and Lock / Unlock your account. Make sure you
                    provide your private mobile number.
                  </p>

                  <h5 class="text-danger pb-0 font-15 font-weight-bold mt-4">
                    Enter the six-digit verification code
                  </h5>
                  <h6 style="font-size: 12px; " class="text-muted mb-3">
                    After request verification code, a six-digit verification
                    code will be sent to the device
                    {{ user.phone && "(" + user.phone + ")" }}.
                  </h6>

                  <input
                    type="password"
                    class="form-control"
                    placeholder="OTP Code"
                    v-model="verification_code"
                  />
                  <h6 style="font-size: 12px; " class="text-danger my-2">
                    * You will not be able to access your account if you do not
                    follow the above steps properly. You can request support
                    from our team at any moment.
                  </h6>

                  <base-button
                    @click="requestVerificationCodeFn"
                    :loading="isLoading1"
                    nativeType="submit"
                    class="btn btn-primary font-13 cursor-pointer mt-2"
                  >
                    <i class="mdi mdi-cellphone-android mr-1"></i> Request
                    Verification Code</base-button
                  >
                  <base-button
                    class="btn btn-danger mt-2 d-flex justify-content-center align-items-center font-14"
                    :loading="isLoading2"
                    nativeType="submit"
                    @click="confirmCodeFn"
                  >
                    <i class="mdi mdi-lock text-white mr-1"></i> Verify & Enable
                    Mobile Authentication
                  </base-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </b-modal>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import {
  ConfirmMobileRequestAPI,
  ConfirmMobileAPI
} from "@/services/auth.service";
import BaseButton from "../../components/BaseButton.vue";

export default {
  components: { BaseButton },
  data() {
    return {
      isLoading1: false,
      isLoading2: false,
      verification_code: null
    };
  },
  computed: {
    ...mapGetters({
      modelInfo: "modal/getModalsInfo",
      user: "user/getUser"
    })
  },
  methods: {
    ...mapActions({
      setJwtToken: "user/setJwtToken",
      setModalsInfo: "modal/setModalsInfo"
    }),
    requestVerificationCodeFn() {
      this.isLoading1 = true;
      ConfirmMobileRequestAPI().finally(() => (this.isLoading1 = false));
    },
    confirmCodeFn() {
      const payload = {
        verification_code: this.verification_code
      };
      this.isLoading2 = true;
      ConfirmMobileAPI(payload)
        .then(response => {
          this.setJwtToken({
            jwtToken: response.data.data.token,
            autoNavigate: false
          });
          this.hideModalFn();
        })
        .finally(() => (this.isLoading2 = false));
    },
    hideModalFn() {
      this.verification_code = null;
      this.setModalsInfo({
        showMobileVerify: false
      });
    }
  }
};
</script>

<style scoped></style>
