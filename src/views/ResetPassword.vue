<template>
  <Layout>
    <main>
      <div class="container">
        <section
          class="section register my-5 d-flex flex-column align-items-center justify-content-center "
        >
          <div class="container">
            <div class="row justify-content-center">
              <div
                class="col-12 col-md-8 col-lg-7 d-flex flex-column align-items-center justify-content-center"
              >
                <div class="card mt-3 mb-2 w-100">
                  <div class="card-body">
                    <div class="pt-4 pb-0">
                      <div class="d-flex justify-content-center mb-2">
                        <div
                          class="rounded-circle bg-dark d-flex justify-content-center align-items-center"
                          style="width: 36px; height: 34px;"
                        >
                          <i class="mdi mdi-lock text-white"></i>
                        </div>
                      </div>
                      <h5 class="card-title text-center pb-0 fs-4">
                        Reset Account Password
                      </h5>
                    </div>

                    <div
                      v-if="user"
                      class="d-flex w-100 align-items-center mt-4 mb-4 px-3 py-2 bg-light rounded"
                    >
                      <div class="d-flex w-100 align-items-center">
                        <b-avatar
                          variant="info"
                          :src="
                            user.imagePaths &&
                              user.imagePaths[user.imagePaths.length - 1]
                          "
                        ></b-avatar>
                        <div class="nav-profile-text ml-2">
                          <p class="text-black font-weight-semibold m-0">
                            {{ user.firstName }} {{ user.lastName }}
                          </p>
                          <span
                            class="font-12 online-color text-muted font-weight-bold"
                            >NIC: {{ user.nationalID }}</span
                          >
                        </div>
                      </div>
                      <div class="">
                        <button class="btn btn-danger btn-sm">Cancel</button>
                      </div>
                    </div>

                    <h6
                      style="font-size: 13px; margin-top: 32px;"
                      class="text-muted mb-2"
                    >
                      *Enter the recovery code recieved on your mobile.
                    </h6>

                    <input
                      type="password"
                      class="form-control"
                      placeholder="Verification Code"
                      v-model="reset_code"
                    />
                    <h6
                      style="font-size: 13px; margin-top: 22px;"
                      class="text-muted mb-2"
                    >
                      *New Password.
                    </h6>

                    <input
                      type="password"
                      class="form-control"
                      placeholder="Your New Account Password"
                      v-model="raw_password"
                    />
                    <h6
                      style="font-size: 13px; margin-top: 22px;"
                      class="text-muted mb-2"
                    >
                      *Confirm Password.
                    </h6>

                    <input
                      type="password"
                      class="form-control"
                      placeholder="Confirm Your Account Password"
                      v-model="confirm_password"
                    />

                    <base-button
                      @click="submitFn"
                      :loading="isLoading"
                      class="btn btn-primary w-100 my-4 d-flex justify-content-center align-items-center"
                    >
                      <i class="mdi mdi-lock text-white mr-1"></i>Reset Password
                    </base-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </Layout>
</template>

<script>
import Layout from "@/components/HorizontalLayout/Layout";
import { GetUserByNicAPI } from "@/services/explorer.user.service";
import { ResetPasswordAPI } from "@/services/user.service";
import { mapActions } from "vuex";

export default {
  components: {
    Layout
  },
  data() {
    return {
      isLoading: false,
      nationalID: null,
      reset_code: null,
      raw_password: null,
      confirm_password: null,
      user: null
    };
  },
  created() {
    this.nationalID = this.$route.params.nic;
    this.getUserFn();
  },
  methods: {
    ...mapActions({
      setJwtToken: "user/setJwtToken"
    }),
    getUserFn() {
      GetUserByNicAPI(this.nationalID).then(response => {
        this.user =
          response.data && response.data && response.data.data
            ? response.data.data.user
            : null;
        if (!this.user)
          this.$router.push({ name: "Recover Account", replace: true });
      });
    },
    submitFn() {
      this.isLoading = true;
      const payload = {
        nationalID: this.nationalID,
        reset_code: this.reset_code,
        raw_password: this.raw_password,
        confirm_password: this.confirm_password
      };

      ResetPasswordAPI(payload)
        .then(response => {
          this.setJwtToken({ jwtToken: response.data.data.token });
          this.$router.push({ name: "Introduction", replace: true });
        })
        .finally(() => (this.isLoading = false));
    }
  }
};
</script>

<style scoped></style>
