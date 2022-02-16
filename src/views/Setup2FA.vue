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
                      <h6 class="text-danger text-center pb-0 fs-8">
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
                      Two-factor authentication adds an extra layer of security
                      to your account. In addition to your username and
                      password, you’ll need to enter a code that Pizza Apes
                      sends to you via text or an app on your phone.
                    </p>

                    <div class="d-flex ">
                      <div
                        class="card d-flex flex-column align-items-center p-2 bg-light"
                      >
                        <i class="mdi mdi-lock text-dark fs-2"></i>
                        <span class="text-muted text-center font-13"
                          >When you sign in to MetaSpeck you’ll enter your
                          username and password, like always.</span
                        >
                      </div>
                      <div
                        class="card d-flex flex-column align-items-center p-2 bg-light mx-2"
                      >
                        <i class="mdi mdi-cellphone text-dark fs-2"></i>
                        <span class="text-muted text-center font-13"
                          >When logging in from a new browser, you’ll need to
                          enter an additional code from your phone or
                          tablet.</span
                        >
                      </div>
                      <div
                        class="card d-flex flex-column align-items-center p-2 bg-light"
                      >
                        <i class="mdi mdi-lock-open text-dark fs-2"></i>
                        <span class="text-muted text-center font-13"
                          >Once you enter the code on the website, you’ll be
                          logged into MetaSpeck.</span
                        >
                      </div>
                    </div>

                    <h6 class="text-dark pb-0 font-13 font-weight-bold mt-4">
                      Use an application on your phone to get two factor
                      authentication codes when prompted.
                    </h6>

                    <p class="small font-14">
                      We recommend using an application such as Authy,
                      1Password, or LastPass Authenticator. These applications
                      support secure backup of your authentication codes in the
                      cloud and can be restored if you lose access to your
                      device.
                    </p>

                    <button
                      class="btn btn-primary w-100 my-4 d-flex justify-content-center align-items-center"
                      type="submit"
                    >
                      Register for Two Factor Authentication
                      <i
                        class="mdi mdi-gesture-two-double-tap text-white mr-1"
                      ></i>
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
