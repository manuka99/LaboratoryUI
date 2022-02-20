<template>
  <b-modal
    v-model="modelInfo.showPasswordVerify"
    size="md"
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
                      Confirm Your Password
                    </h5>
                    <p class="small" style="font-size: 14px">
                      You are trying to access a password protected content
                      therefore, you must verify your identity by confirming
                      your password before proceeding.
                    </p>
                  </div>

                  <h6
                    style="font-size: 13px;"
                    class="text-muted mb-3"
                  >
                    *Enter your account password for verification
                  </h6>

                  <input
                    type="password"
                    class="form-control"
                    placeholder="Your Password"
                    v-model="raw_password"
                    required
                  />

                  <base-button
                    class="btn btn-primary w-100 my-4 d-flex justify-content-center align-items-center"
                    :loading="isLoading"
                    nativeType="submit"
                    @click="confirmCodeFn"
                  >
                    <i class="mdi mdi-lock text-white mr-1"></i> Verify Password
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
import { ConfirmPasswordAPI } from "@/services/user.service";
import BaseButton from "../../components/BaseButton.vue";

export default {
  components: { BaseButton },
  data() {
    return {
      isLoading: false,
      raw_password: null
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
        raw_password: this.raw_password
      };
      this.isLoading = true;
      ConfirmPasswordAPI(payload)
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
      this.raw_password = null;
      this.setModalsInfo({
        showPasswordVerify: false
      });
    }
  }
};
</script>

<style scoped></style>
