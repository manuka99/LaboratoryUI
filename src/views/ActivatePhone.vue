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
                        Verify Mobile Number
                      </h5>
                      <h6 class="text-danger text-center pb-0 font-14">
                        All users must have verified Mobile Number
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

                    <h5 class="text-danger pb-0 font-15 font-weight-bold mt-4">
                      1. Enter Mobile Number
                    </h5>

                    <input
                      type="text"
                      class="form-control mt-3"
                      placeholder="Mobile Number"
                      required
                    />

                    <h6 class="text-dark pb-0 font-13 font-weight-bold mt-3">
                      Make sure the number you enter is secure from attackers.
                      If this number was compromised your account will be in
                      hands of another person. In case, contact our team
                      immediately.
                    </h6>

                    <p class="small font-13">
                      We recommend using a seperate mobile device with a new SIM
                      which is registered for your Name and NIC. This will be
                      helpfull to recover your account if it was compromised by
                      an attacker.
                    </p>

                    <button
                      class="btn btn-primary mt-2  d-flex justify-content-center align-items-center"
                      type="submit"
                    >
                      <i class="mdi mdi-lock text-white mr-1"></i> Request
                      Verification Code
                    </button>

                    <h5 class="text-danger pb-0 font-15 font-weight-bold mt-4">
                      2. Enter the six-digit verification code
                    </h5>
                    <h6 style="font-size: 12px; " class="text-muted mb-3">
                      After request verification code, a six-digit verification
                      code will be sent to the device.
                    </h6>

                    <input
                      type="password"
                      name="password"
                      class="form-control"
                      id="yourPassword"
                      placeholder="OTP Code"
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
                      <i class="mdi mdi-lock text-white mr-1"></i> Verify &
                      Enable Mobile Authentication
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
