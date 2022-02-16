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
                        Setup Two Factor Authentication
                      </h5>
                      <h6 class="text-danger text-center pb-0 font-14">
                        All users must enable Two Factor Authentication
                      </h6>
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

                    <p class="small font-14">
                      Use your phone as your second step to sign in. Two-factor
                      authentication adds an additional layer of security to
                      your account by requiring more than just a password to log
                      in. Two-factor authentication adds an extra layer of
                      security to your account. In addition to your username and
                      password, you’ll need to enter a code that MetaSpeck sends
                      to you via text or an app on your phone.
                    </p>

                    <h6 class="text-muted pb-0 font-13 font-weight-bold mt-2">
                      * Make sure that you follow the bellow two methods and
                      save the codes and scan the qr code properly. You can
                      disable Two Factor Authentication at any moment by
                      confirming your password.
                    </h6>

                    <h5 class="text-danger pb-0 font-15 font-weight-bold mt-4">
                      1. Scan QR Code.
                    </h5>

                    <img
                      src="https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=otpauth://totp/METASPECK%3ANIC%3A%20199920610568%3Fsecret=IKPBGOYSAHYH3V7AJ6ZRPFKR6MNY2HHJ%26issuer=METASPECK"
                      alt=""
                    />

                    <h6 class="text-dark pb-0 font-13 font-weight-bold mt-2">
                      Scan the above QR Code with the two-factor authentication
                      app on your phone. After scanning the QR Code, the app
                      will display a six-digit code that you can enter after
                      sign in with your credentials.
                    </h6>

                    <p class="small font-13">
                      We recommend using an application such as Authy,
                      1Password, or LastPass Authenticator. These applications
                      support secure backup of your authentication codes in the
                      cloud and can be restored if you lose access to your
                      device.
                    </p>

                    <h5 class="text-danger pb-0 font-15 font-weight-bold mt-4">
                      2. Enter the six-digit code from the application
                    </h5>
                    <h6 style="font-size: 12px; " class="text-muted mb-3">
                      After scanning the barcode image, the app will display a
                      six-digit code that you can enter below.
                    </h6>

                    <input
                      type="password"
                      name="password"
                      class="form-control"
                      id="yourPassword"
                      placeholder="TOTP Code"
                      required
                    />
                    <h6 style="font-size: 12px; " class="text-danger my-2">
                      * You will not be able to access your account if you do
                      not follow the above steps properly. You can request
                      support from our team at any moment.
                    </h6>

                    <button
                      class="btn btn-danger w-100 my-4 d-flex justify-content-center align-items-center"
                      type="submit"
                    >
                      <i class="mdi mdi-lock text-white mr-1"></i> Enable Two
                      Factor Authentication
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
