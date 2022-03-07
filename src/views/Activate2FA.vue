<template>
  <main>
    <div class="">
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
                  <div class="pt-2 pb-0">
                    <div class="d-flex justify-content-center mb-2">
                      <div
                        class="rounded-circle bg-dark d-flex justify-content-center align-items-center"
                        style="width: 46px; height: 42px;"
                      >
                        <i class="mdi mdi-lock text-white font-22"></i>
                      </div>
                    </div>
                    <h5 class="card-title text-center pb-0 fs-4">
                      Enable Two Factor Authentication
                    </h5>
                    <h6 class="text-danger text-center pb-0 font-15">
                      Two Factor Authentication is not enabled for this account
                    </h6>
                  </div>

                  <p class="small font-15 mt-3">
                    Use your phone as your second step to sign in. Two-factor
                    authentication adds an additional layer of security to your
                    account by requiring more than just a password to log in.
                    Two-factor authentication adds an extra layer of security to
                    your account. In addition to your username and password,
                    you’ll need to enter a code that MetaSpeck sends to you via
                    text or an app on your phone.
                  </p>

                  <h6 class="text-muted pb-0 font-15 font-weight-bold mt-2">
                    * Make sure that you follow the bellow two methods and save
                    the codes and scan the qr code properly. You can disable Two
                    Factor Authentication at any moment by confirming your
                    password.
                  </h6>

                  <h5 class="text-danger pb-0 font-15 font-weight-bold mt-4">
                    1. Scan QR Code.
                  </h5>

                  <img :src="registrationData.qr" alt="" />

                  <h6 class="text-dark pb-0 font-15 font-weight-bold mt-2">
                    Scan the above QR Code with the two-factor authentication
                    app on your phone. After scanning the QR Code, the app will
                    display a six-digit code that you can enter after sign in
                    with your credentials.
                  </h6>

                  <p class="small font-15">
                    We recommend using an application such as Authy, 1Password,
                    or LastPass Authenticator. These applications support secure
                    backup of your authentication codes in the cloud and can be
                    restored if you lose access to your device.
                  </p>

                  <h5 class="text-danger pb-0 font-15 font-weight-bold mt-4">
                    2. Enter the six-digit code from the application
                  </h5>
                  <h6 class="text-muted mb-3 font-13">
                    After scanning the barcode image, the app will display a
                    six-digit code that you can enter below.
                  </h6>

                  <input
                    type="password"
                    class="form-control"
                    placeholder="TOTP Code"
                    v-model="auth_code"
                    required
                  />
                  <h6 class="text-danger my-2 font-15">
                    * You will not be able to access your account if you do not
                    follow the above steps properly. You can request support
                    from our team at any moment.
                  </h6>

                  <base-button
                    class="btn btn-danger w-100 my-4 d-flex justify-content-center align-items-center"
                    @click="twoFactorAuthActivationFn"
                    :loading="isLoading"
                    nativeType="submit"
                  >
                    <i class="mdi mdi-lock text-white mr-1"></i> Enable Two
                    Factor Authentication
                  </base-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script>
import { Activate2FAAPI } from "@/services/user.service";
export default {
  components: {},
  props: {
    registrationData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      auth_code: null,
      isLoading: false
    };
  },
  methods: {
    twoFactorAuthActivationFn() {
      this.isLoading = true;
      const payload = {
        auth_code: this.auth_code
      };
      Activate2FAAPI(payload)
        .then(response => {
          this.$emit("activated", response.data.data);
        })
        .finally(() => (this.isLoading = false));
    }
  }
};
</script>

<style scoped></style>
