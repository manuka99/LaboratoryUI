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
                        <span class="input-group-text" id="inputGroupPrepend"
                          >@</span
                        >
                        <input
                          type="text"
                          class="form-control"
                          :value="nationalID"
                          placeholder="Your National ID"
                          required
                        />
                      </div>
                    </div>

                    <div class=" mt-3">
                      <label for="yourPassword" class="form-label"
                        >Password</label
                      >
                      <input
                        type="password"
                        class="form-control"
                        :value="raw_password"
                        placeholder="Your Account Password"
                        required
                      />
                    </div>

                    <div class=" mt-3">
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          name="remember"
                          value="true"
                          id="rememberMe"
                        />
                        <label class="form-check-label" for="rememberMe"
                          >Remember me</label
                        >
                      </div>
                    </div>

                    <div>
                      <router-link to="/recover-account">
                        <a class="font-13 font-weight-bold">Recover account?</a>
                      </router-link>
                    </div>
                    <div class=" mt-3">
                      <button
                        class="btn btn-primary w-100 mt-0 mb-4 d-flex justify-content-center align-items-center"
                        type="submit"
                        @click="loginFn"
                      >
                        <i class="mdi mdi-lock text-white mr-1"></i> Sign In
                      </button>
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
export default {
  components: {
    Layout
  },
  data() {
    return {
      nationalID: null,
      raw_password: null
    };
  },
  methods: {
    loginFn() {
      const payload = {
        nationalID: this.nationalID,
        raw_password: this.raw_password
      };
      this.$bvToast.toast(`This is toast number ${this.nationalID}`, {
        title: "BootstrapVue Toast",
        autoHideDelay: 50000000000000,
        appendToast: false
      });
      LoginAPI(payload)
        .then(response => {
          console.log(response);
          var notifyPayload = {
            isToast: true,
            title: "SUCCESS! User Was Created",
            content: "All data was saved successfully",
            variant: "success"
          };
          this.$store.dispatch("notification/setNotify", notifyPayload);
        })
        .catch(err => {
          console.log(err);
          // alert(err.message);
          var notifyPayload = {
            isToast: true,
            title: "Error! User Was Created",
            content: "All data was saved successfully",
            variant: "danger"
          };
          this.$store.dispatch("notification/setNotify", notifyPayload);
        });
    }
  }
};
</script>

<style scoped></style>
