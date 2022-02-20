<template>
  <b-modal
    v-model="modelInfo.show2FAVerify"
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
        class="d-flex flex-column align-items-center justify-content-center "
      >
        <div class="">
          <div class="row justify-content-center">
            <div
              class="col-12 d-flex flex-column align-items-center justify-content-center"
            >
              <div class="">
                <div class="">
                  <div class="pb-0">
                    <div class="d-flex justify-content-center mb-2">
                      <div
                        class="rounded-circle bg-dark d-flex justify-content-center align-items-center"
                        style="width: 36px; height: 34px;"
                      >
                        <i class="mdi mdi-lock text-white"></i>
                      </div>
                    </div>
                    <h5 class="card-title text-center pb-0 fs-4">
                      Two Factor Authentication Challenge
                    </h5>
                    <p class="small" style="font-size: 14px">
                      Two factor authentication feature is enabled, therefore
                      the user is required to input a six digit numeric token
                      during the authentication process. This token is generated
                      using a time-based one-time password (TOTP) that can be
                      retrieved from any TOTP compatible mobile authentication
                      application such as Google Authenticator.
                    </p>
                  </div>

                  <h6
                    style="font-size: 13px; margin-top: 32px;"
                    class="text-muted mb-3"
                  >
                    *Enter the TOTP code recieved on your mobile authentication
                    application
                  </h6>

                  <input
                    type="password"
                    class="form-control"
                    placeholder="TOTP code"
                    v-model="auth_code"
                    required
                  />

                  <base-button
                    class="btn btn-primary w-100 my-4 d-flex justify-content-center align-items-center"
                    :loading="isLoading"
                    nativeType="submit"
                    @click="confirmCodeFn"
                  >
                    <i class="mdi mdi-lock text-white mr-1"></i> Verify Code
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
import { Confirm2FAAPI } from "@/services/user.service";
import BaseButton from "../../components/BaseButton.vue";

export default {
  components: { BaseButton },
  data() {
    return {
      isLoading: false,
      auth_code: null
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
    confirmCodeFn() {
      const payload = {
        auth_code: this.auth_code
      };
      this.isLoading = true;
      Confirm2FAAPI(payload)
        .then(response => {
          this.setJwtToken({
            jwtToken: response.data.data.token,
            autoNavigate: false
          });
          this.hideModalFn();
        })
        .finally(() => (this.isLoading = false));
    },
    hideModalFn() {
      this.auth_code = null;
      this.setModalsInfo({
        show2FAVerify: false
      });
    }
  }
};
</script>

<style scoped></style>
