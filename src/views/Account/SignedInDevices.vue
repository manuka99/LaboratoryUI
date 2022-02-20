<template>
  <div>
    <b-card header-bg-variant="secondary">
      <b-row align-v="center" slot="header">
        <b-col cols="8">
          <h5 class="mb-0 text-white font-18">
            <i class="mdi mdi-cellphone-link"></i>
            Signed In Devices
          </h5>
        </b-col>
      </b-row>

      <p class="font-15">
        This is a list of devices that have logged into your account. Revoke any
        device that you do not recognize. You can see your sign-in history,
        including the dates and times that your account was used. You can also
        see the IP addresses which were used to access your account. These are
        the details displayed from the device
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

      <base-button
        class="btn btn-outline-primary mt-0 d-flex justify-content-center align-items-center font-14"
        type="submit"
        @click="refreshDevicesFn"
        :loading="isLoading"
        nativeType="submit"
      >
        <i class="mdi mdi-repeat mr-1"></i> Refresh Devices
      </base-button>

      <div v-if="!isLoading" class="d-flex justify-content-start flex-wrap">
        <div
          v-for="session in sessions"
          :key="session._id"
          class="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3 d-flex flex-column justify-content-center align-items-center py-3"
        >
          <div
            class="d-flex justify-content-center align-items-center font-32"
            :class="currentSession._id === session._id && 'text-success'"
          >
            <i v-if="session.deviceType == 'bot'" class="mdi mdi-robot "></i>
            <i
              v-if="session.deviceType == 'desktop'"
              class="mdi mdi-laptop-chromebook"
            ></i>
            <i
              v-if="
                session.deviceType != 'bot' && session.deviceType != 'desktop'
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
          <div class="d-flex justify-content-center align-items-center mt-3">
            <button
              @click="showMoreDetailsFn(session)"
              class="btn btn-sm btn-primary font-13 py-0 px-2 font-weight-bold"
            >
              more
            </button>
          </div>
        </div>
      </div>

      <div
        v-else
        style="min-height: 400px;"
        class="d-flex justify-content-center align-items-center"
      >
        <b-spinner
          variant="primary"
          label="Spinning"
          style="width: 120px; height: 120px;"
        ></b-spinner>
      </div>
      <SignInDeviceInfo
        :isShow="isShow"
        :sessionID="selectedSessionID"
        @onClose="onCloseFn"
      />
    </b-card>
  </div>
</template>

<script>
import SignInDeviceInfo from "../modals/SignInDeviceInfo.vue";
import { GetUserSessionsAPI } from "@/services/session.service";
import moment from "moment";

export default {
  data() {
    return {
      isLoading: false,
      sessions: null,
      currentSession: null,
      isShow: false,
      selectedSessionID: null
    };
  },
  created() {
    this.onInitFn();
  },
  methods: {
    onInitFn() {
      this.refreshDevicesFn();
    },
    moment(data) {
      return moment(data);
    },
    refreshDevicesFn() {
      this.isLoading = true;
      GetUserSessionsAPI()
        .then(response => {
          const data = response.data.data;
          this.sessions = data.sessions;
          this.currentSession = data.current;
        })
        .finally(() => (this.isLoading = false));
    },
    showMoreDetailsFn(session) {
      this.selectedSessionID = session._id;
      this.isShow = true;
    },
    onCloseFn() {
      this.isShow = false;
      this.selectedSessionID = null;
    }
  },
  components: { SignInDeviceInfo }
};
</script>

<style scoped></style>
