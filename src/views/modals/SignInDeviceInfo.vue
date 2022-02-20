<template>
  <b-modal
    v-model="isShow"
    size="lg"
    footer-class="d-none"
    header-class="d-none"
    no-close-on-backdrop
  >
    <div>
      <section
        class="d-flex justify-content-end cursor-pointer"
        @click="hideModalFn"
      >
        <i class="mdi mdi-close-box-outline font-32 text-danger"></i>
      </section>
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
                  <div class="pb-0">
                    <div class="d-flex justify-content-center mb-2">
                      <div
                        class="rounded-circle bg-dark d-flex justify-content-center align-items-center"
                        style="width: 46px; height: 42px;"
                      >
                        <i
                          class="mdi mdi-cellphone-link text-white font-22"
                        ></i>
                      </div>
                    </div>
                    <h5 class="card-title text-center pb-0 fs-4">
                      Signed In Device Information
                    </h5>
                    <p class="font-15">
                      This is a list of devices that have logged into your
                      account. Revoke any device that you do not recognize. You
                      can see your sign-in history, including the dates and
                      times that your account was used. You can also see the IP
                      addresses which were used to access your account. These
                      are the details displayed from the device
                    </p>
                    <ul class="font-15">
                      <li>
                        IP address
                      </li>
                      <li>
                        Browser/App infomation
                      </li>
                      <li>
                        Device information
                      </li>
                      <li>
                        Accessed location
                      </li>
                    </ul>
                  </div>

                  <div v-if="!isLoading" class="row">
                    <div v-if="session" class="col-12 col-md-6">
                      <div
                        class="d-flex flex-column justify-content-center align-items-center py-3"
                      >
                        <div
                          class="d-flex justify-content-center align-items-center font-32"
                          :class="
                            currentSession._id === session._id && 'text-success'
                          "
                        >
                          <i
                            v-if="session.deviceType == 'bot'"
                            class="mdi mdi-robot "
                          ></i>
                          <i
                            v-if="session.deviceType == 'desktop'"
                            class="mdi mdi-laptop-chromebook"
                          ></i>
                          <i
                            v-if="
                              session.deviceType != 'bot' &&
                                session.deviceType != 'desktop'
                            "
                            class="mdi mdi-cellphone-android"
                          ></i>
                        </div>
                        <div
                          class="d-flex flex-column justify-content-center align-items-center font-14 mt-0 font-weight-600"
                        >
                          <span class="d-block">
                            {{ session.ip_address }}
                          </span>
                          <span class="d-block">
                            {{
                              currentSession._id === session._id
                                ? "Current device"
                                : moment(new Date(session.updatedAt)).fromNow()
                            }}
                          </span>
                          <span class="d-block">
                            {{
                              session.deviceType === "bot"
                                ? "Robot | Machine"
                                : session.osInfo
                            }}
                          </span>
                        </div>
                        <div
                          class="d-flex justify-content-center align-items-center mt-3"
                        >
                          <button
                            @click="showMoreDetailsFn(session)"
                            class="btn btn-sm btn-primary font-13 py-0 px-2 font-weight-bold"
                          >
                            more
                          </button>
                        </div>
                      </div>
                    </div>
                    <div v-if="geoData" class="col-12 col-md-6 font-14">
                      <span class="d-block">
                        <strong> Last location:</strong>
                      </span>
                      <span class="d-block">
                        {{
                          `${geoData.city}, ${geoData.region},
                        ${geoData.country}`
                        }}
                      </span>
                      <span class="d-block mt-2">
                        <strong> Time zone:</strong>
                      </span>
                      <span class="d-block">
                        {{ geoData.timezone }}
                      </span>
                      <span class="d-block mt-2">
                        <strong> Longitudes & Latitutes:</strong>
                      </span>
                      <span class="d-block">
                        {{ geoData.ll }}
                      </span>
                      <span class="d-block mt-2">
                        <strong> The approximate accuracy radius (km): </strong>
                      </span>
                      <span class="d-block">
                        {{ geoData.area }}
                      </span>
                    </div>
                    <div v-else class="p-4">
                      <h6>
                        Error: Requested device data is not available as it may
                        be deleted or invalid.
                      </h6>
                    </div>
                  </div>

                  <div
                    v-else
                    style="min-height: 240px;"
                    class="d-flex justify-content-center align-items-center"
                  >
                    <b-spinner
                      variant="primary"
                      label="Spinning"
                      style="width: 120px; height: 120px;"
                    ></b-spinner>
                  </div>

                  <base-button
                    class="btn btn-danger w-100 my-4 d-flex justify-content-center align-items-center"
                    :loading="isLoading2"
                    nativeType="submit"
                    @click="revokeDeviceFn"
                  >
                    <i class="mdi mdi-lock text-white mr-1"></i> REVOKE DEVICE
                  </base-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </b-modal>
</template>

<script>
import {
  GetUserSessionAPI,
  RevokeUserSessionAPI
} from "@/services/session.service";
import BaseButton from "../../components/BaseButton.vue";
import moment from "moment";

export default {
  components: { BaseButton },
  props: {
    isShow: Boolean,
    sessionID: String
  },
  data() {
    return {
      isLoading: false,
      isLoading2: false,
      session: null,
      currentSession: null,
      geoData: null
    };
  },
  watch: {
    sessionID() {
      this.getSessionInfo();
    }
  },
  methods: {
    moment(data) {
      return moment(data);
    },
    getSessionInfo() {
      this.isLoading = true;
      GetUserSessionAPI(this.sessionID)
        .then(response => {
          const data = response.data.data;
          this.session = data.session;
          this.currentSession = data.current;
          this.geoData = data.geo_data;
        })
        .finally(() => (this.isLoading = false));
    },
    revokeDeviceFn() {
      this.isLoading2 = true;
      RevokeUserSessionAPI(this.sessionID).finally(
        () => (this.isLoading2 = false)
      );
    },
    hideModalFn() {
      this.resetFn();
      this.$emit("onClose");
    },
    resetFn() {
      this.isLoading = false;
      this.session = null;
    }
  }
};
</script>

<style scoped></style>
