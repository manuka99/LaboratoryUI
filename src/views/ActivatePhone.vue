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
                class="col-12 col-md-12 col-lg-10 d-flex flex-column align-items-center justify-content-center"
              >
                <div class="card mt-3 mb-2">
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
                        Set-up Mobile/SMS Authentication
                      </h5>
                      <h6 class="text-danger text-center pb-0 font-14">
                        All users must have a verified Mobile Number
                      </h6>
                    </div>

                    <div
                      class="d-flex w-100 align-items-center mt-4 mb-4 p-2 bg-light rounded"
                      v-if="user"
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
                            {{ user.firstName }} {{ user.middleName }}
                            {{ user.lastName }}
                          </p>
                          <span
                            class="font-12 online-color text-muted font-weight-bold"
                            >NIC: {{ user.nationalID }}</span
                          >
                        </div>
                      </div>
                      <div>
                        <button @click="signOut" class="btn btn-dark btn-sm">
                          Logout
                        </button>
                      </div>
                    </div>

                    <p class="small font-13">
                      Use your phone as your primary step to recover your
                      account. This adds an additional layer of security to your
                      account by requiring the verification of your mobile
                      number to recover your account and Lock / Unlock your
                      account. Make sure you provide your private mobile number.
                    </p>

                    <h6 class="text-muted pb-0 font-13 font-weight-bold mt-2">
                      * Make sure that you follow the bellow two methods and
                      verify your account. You can change this number after
                      logged into your profile.
                    </h6>

                    <div v-if="isStep1">
                      <h5
                        class="text-danger pb-0 font-15 font-weight-bold mt-4"
                      >
                        1. Enter Mobile Number
                      </h5>

                      <input
                        type="text"
                        class="form-control mt-3"
                        placeholder="Mobile Number"
                        v-model="temp_phone"
                        required
                      />

                      <h6 class="text-dark pb-0 font-13 font-weight-bold mt-3">
                        Make sure the number you enter is secure from attackers.
                        If this number was compromised your account will be in
                        hands of another person. In case, contact our team
                        immediately.
                      </h6>

                      <p class="small font-13">
                        We recommend using a seperate mobile device with a new
                        SIM which is registered for your Name and NIC. This will
                        be helpfull to recover your account if it was
                        compromised by an attacker.
                      </p>

                      <base-button
                        class="btn btn-primary mt-2  d-flex justify-content-center align-items-center font-13"
                        type="submit"
                        :loading="isLoading1"
                        nativeType="submit"
                        @click="requestVerificationCodeFn"
                      >
                        <i class="mdi mdi-lock text-white mr-1"></i> Request
                        Verification Code
                      </base-button>

                      <div class="mt-2 mb-4">
                        <a
                          @click="isStep1 = false"
                          class="font-13 font-weight-bold text-primary cursor-pointer"
                        >
                          <i class="mdi mdi-security"></i>
                          Have a six-digit verification code ?</a
                        >
                      </div>
                    </div>

                    <div v-else>
                      <h5
                        class="text-danger pb-0 font-15 font-weight-bold mt-4"
                      >
                        2. Enter the six-digit verification code
                      </h5>
                      <h6 style="font-size: 12px; " class="text-muted mb-3">
                        After request verification code, a six-digit
                        verification code will be sent to the device ({{
                          user.tempPhone
                        }}).
                      </h6>

                      <input
                        type="password"
                        class="form-control"
                        placeholder="OTP Code"
                        v-model="verification_code"
                      />
                      <h6 style="font-size: 12px; " class="text-danger my-2">
                        * You will not be able to access your account if you do
                        not follow the above steps properly. You can request
                        support from our team at any moment.
                      </h6>

                      <base-button
                        class="btn btn-danger mt-4 d-flex justify-content-center align-items-center font-14"
                        :loading="isLoading2"
                        nativeType="submit"
                        @click="verifyAndEnableMobileAuth"
                      >
                        <i class="mdi mdi-lock text-white mr-1"></i> Verify &
                        Enable Mobile Authentication
                      </base-button>

                      <div class="mt-2 mb-4">
                        <a
                          @click="isStep1 = true"
                          class="font-13 font-weight-bold text-primary cursor-pointer"
                        >
                          <i class="mdi mdi-cellphone-android mr-1"></i> Change
                          Mobile Number ?</a
                        >
                      </div>
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
import { mapGetters, mapActions } from "vuex";
import {
  UpdateTempPhoneAPI,
  VerifyAndUpdatePhoneAPI
} from "@/services/auth.service";

export default {
  components: {
    Layout
  },
  data() {
    return {
      isStep1: true,
      isLoading1: false,
      isLoading2: false,
      temp_phone: null,
      verification_code: null
    };
  },
  computed: {
    ...mapGetters({
      user: "user/getUser"
    })
  },
  methods: {
    ...mapActions({
      signOut: "user/signOut",
      setJwtToken: "user/setJwtToken",
      setTempPhone: "user/setTempPhone"
    }),
    requestVerificationCodeFn() {
      const payload = {
        temp_phone: this.temp_phone
      };
      this.isLoading1 = true;
      UpdateTempPhoneAPI(payload)
        .then(response => {
          this.isStep1 = false;
          this.setTempPhone({ tempPhone: response.data.data.user.tempPhone });
        })
        .finally(() => (this.isLoading1 = false));
    },
    verifyAndEnableMobileAuth() {
      const payload = {
        verification_code: this.verification_code
      };
      this.isLoading2 = true;
      VerifyAndUpdatePhoneAPI(payload)
        .then(response => {
          this.setJwtToken({
            jwtToken: response.data.data.token,
            autoNavigate: true
          });
          this.$router.push({ name: "Introduction", replace: true });
        })
        .finally(() => (this.isLoading2 = false));
    }
  }
};
</script>

<style scoped></style>
