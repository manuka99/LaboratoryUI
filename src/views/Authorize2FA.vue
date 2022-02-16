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
                        Two Factor Authentication Challenge
                      </h5>
                      <p class="small" style="font-size: 14px">
                        Two factor authentication feature is enabled, therefore
                        the user is required to input a six digit numeric token
                        during the authentication process. This token is
                        generated using a time-based one-time password (TOTP)
                        that can be retrieved from any TOTP compatible mobile
                        authentication application such as Google Authenticator.
                      </p>
                    </div>

                    <div
                      class="d-flex w-100 align-items-center mt-4 mb-4 p-2 bg-light"
                    >
                      <div class="d-flex w-100 align-items-center">
                        <b-avatar
                          variant="light"
                          src="https://placekitten.com/300/300"
                        ></b-avatar>
                        <div class="nav-profile-text ml-2">
                          <p class="text-black font-weight-semibold m-0">
                            Olson jass
                          </p>
                          <span
                            class="font-12 online-color text-muted font-weight-bold"
                            >NIC: 199920610568</span
                          >
                        </div>
                      </div>
                      <div class="">
                        <button class="btn btn-dark btn-sm">Logout</button>
                      </div>
                    </div>

                    <h6
                      style="font-size: 13px; margin-top: 32px;"
                      class="text-muted mb-3"
                    >
                      *Enter the TOTP code recieved on your mobile
                      authentication application
                    </h6>

                    <input
                      type="password"
                      name="password"
                      class="form-control"
                      id="yourPassword"
                      placeholder="Your Account Password"
                      required
                    />

                    <button
                      class="btn btn-primary w-100 my-4 d-flex justify-content-center align-items-center"
                      type="submit"
                    >
                      <i class="mdi mdi-lock text-white mr-1"></i> Verify Code
                    </button>
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
export default {
  components: {
    Layout
  }
};
</script>

<style scoped></style>
