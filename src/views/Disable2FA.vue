<template>
  <div class="">
    <section
      class="d-flex flex-column align-items-center justify-content-center"
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
                      style="width: 36px; height: 34px;"
                    >
                      <i class="mdi mdi-lock text-white"></i>
                    </div>
                  </div>
                  <h5 class="card-title text-center pb-0 fs-4">
                    Two Factor Authentication
                  </h5>
                  <h6 class="text-success text-center pb-0 font-15">
                    Two Factor Authentication is enabled for this account
                  </h6>
                </div>

                <p class="small font-14 mt-3">
                  Two-factor authentication adds an extra layer of security to
                  your account. In addition to your username and password,
                  you’ll need to enter a code that Pizza Apes sends to you via
                  text or an app on your phone.
                </p>

                <div class="d-flex ">
                  <div
                    class="card d-flex flex-column align-items-center p-2 bg-light"
                  >
                    <i class="mdi mdi-lock text-dark fs-2"></i>
                    <span class="text-muted text-center font-13"
                      >When you sign in to MetaSpeck you’ll enter your username
                      and password, like always.</span
                    >
                  </div>
                  <div
                    class="card d-flex flex-column align-items-center p-2 bg-light mx-2"
                  >
                    <i class="mdi mdi-cellphone text-dark fs-2"></i>
                    <span class="text-muted text-center font-13"
                      >When logging in from a new browser, you’ll need to enter
                      an additional code from your phone or tablet.</span
                    >
                  </div>
                  <div
                    class="card d-flex flex-column align-items-center p-2 bg-light"
                  >
                    <i class="mdi mdi-lock-open text-dark fs-2"></i>
                    <span class="text-muted text-center font-13"
                      >Once you enter the code on the website, you’ll be logged
                      into MetaSpeck.</span
                    >
                  </div>
                </div>

                <h6 class="text-dark pb-0 font-13 font-weight-bold mt-4">
                  Use an application on your phone to get two factor
                  authentication codes when prompted.
                </h6>

                <p class="small font-14">
                  We recommend using an application such as Authy, 1Password, or
                  LastPass Authenticator. These applications support secure
                  backup of your authentication codes in the cloud and can be
                  restored if you lose access to your device.
                </p>

                <base-button
                  class="btn btn-danger w-100 my-4 d-flex justify-content-center align-items-center"
                  @click="twoFactorAuthDisableFn"
                  :loading="isLoading"
                  nativeType="submit"
                >
                  Disable Two Factor Authentication
                  <i class="mdi mdi-gesture-two-double-tap text-white mr-1"></i>
                </base-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>DeActivate2FA

<script>
import { Revoke2FAAPI } from "@/services/user.service";
export default {
  components: {},
  data() {
    return {
      isLoading: false
    };
  },
  methods: {
    twoFactorAuthDisableFn() {
      this.isLoading = true;
      Revoke2FAAPI()
        .then(response => {
          this.$emit("disabled2FA", response.data.data);
        })
        .finally(() => (this.isLoading = false));
    }
  }
};
</script>

<style scoped></style>
