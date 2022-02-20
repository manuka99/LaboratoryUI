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
                class="col-12 col-lg-6 col-md-8 d-flex flex-column align-items-center justify-content-center"
              >
                <div class="card mt-3 mb-5 w-100">
                  <div class="card-body">
                    <div class="pt-4 pb-2">
                      <div class="d-flex justify-content-center mb-2">
                        <div
                          class="rounded-circle bg-dark d-flex justify-content-center align-items-center"
                          style="width: 36px; height: 34px;"
                        >
                          <i class="mdi mdi-lock text-white"></i>
                        </div>
                      </div>
                      <h5 class="card-title text-center pb-0 fs-4">
                        Login to Your Account
                      </h5>
                      <p class="text-center small">
                        Enter your National ID & Password to login
                      </p>
                    </div>

                    <div class="">
                      <label for="yourUsername" class="form-label"
                        >National ID</label
                      >
                      <div class="input-group has-validation">
                        <b-input-group prepend="@">
                          <input
                            type="text"
                            class="form-control"
                            autosave="nationalID"
                            v-model="nationalID"
                            placeholder="Your National ID"
                            autocomplete
                          />
                        </b-input-group>
                      </div>
                    </div>

                    <div class=" mt-3">
                      <label for="yourPassword" class="form-label"
                        >Password</label
                      >
                      <input
                        type="password"
                        class="form-control"
                        v-model="raw_password"
                        placeholder="Your Account Password"
                        autosave="raw_password"
                        autocomplete
                      />
                    </div>

                    <div class="mt-3">
                      <div
                        class="d-flex align-items-center justify-content-start"
                      >
                        <input type="checkbox" id="rememberMe" />
                        <label
                          class="form-check-label my-0 ml-1"
                          for="rememberMe"
                          >Remember me</label
                        >
                      </div>
                    </div>

                    <div class="mt-3">
                      <base-button
                        class="btn btn-primary w-100 mt-0 d-flex justify-content-center align-items-center"
                        type="submit"
                        @click="loginFn"
                        :loading="isLoading"
                        nativeType="submit"
                      >
                        <i class="mdi mdi-lock text-white mr-1"></i> Sign In
                      </base-button>
                    </div>

                    <div class="mt-2 mb-4">
                      <router-link to="/recover-account">
                        <a class="font-13 font-weight-bold text-secondary"
                          >Recover your account ?</a
                        >
                      </router-link>
                    </div>
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
import { LoginAPI } from "@/services/user.service";
import { mapActions } from "vuex";

export default {
  components: {
    Layout
  },
  data() {
    return {
      isLoading: false,
      nationalID: null,
      raw_password: null
    };
  },
  methods: {
    ...mapActions({
      setJwtToken: "user/setJwtToken"
    }),
    loginFn() {
      this.isLoading = true;
      const payload = {
        nationalID: this.nationalID,
        raw_password: this.raw_password
      };
      LoginAPI(payload)
        .then(response => {
          this.$router.push({ name: "Introduction" });
          this.setJwtToken({
            jwtToken: response.data.data.token,
            autoNavigate: true
          });
        })
        .finally(() => (this.isLoading = false));
    }
  }
};
</script>

<style scoped></style>
