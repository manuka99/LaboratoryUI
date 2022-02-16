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
                        Recover your account
                      </h5>
                      <p class="small" style="font-size: 14px">
                        Enter your National ID to recieve a verification code to
                        the registered mobile number.
                      </p>
                    </div>

                    <h6
                      style="font-size: 13px; margin-top: 12px;"
                      class="text-muted mb-3"
                    >
                      *National ID
                    </h6>

                    <input
                      type="text"
                      class="form-control"
                      placeholder="Your National ID"
                      required
                    />

                    <button
                      class="btn btn-primary w-100 my-4 d-flex justify-content-center align-items-center"
                      type="submit"
                    >
                      <i class="mdi mdi-lock text-white mr-1"></i> Send
                      Verification Code
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
