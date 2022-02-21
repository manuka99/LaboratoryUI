<template>
  <div>
    <b-card v-if="user && user.nationalID" header-bg-variant="secondary">
      <b-row align-v="center" slot="header">
        <b-col cols="8">
          <h5 class="mb-0 text-white font-18">
            <i class="mdi mdi-security"></i>
            Account Security
          </h5>
        </b-col>
      </b-row>

      <h6 class="text-muted mb-3">
        1. Account Password
      </h6>
      <p class="text-muted font-14">
        Choose a strong password and don't reuse it for other accounts.
        <a href="#"> Learn more.</a> Changing your password will sign you out on
        your devices, with some <a href="#">exceptions</a>.
      </p>
      <div>
        <b-row>
          <b-col lg="6">
            <b-form-input
              type="password"
              label="*New Password"
              placeholder="New Password"
              class="font-14 font-weight-600"
              v-model="raw_password"
            ></b-form-input>
          </b-col>
          <b-col lg="6">
            <b-form-input
              type="password"
              label="*Confirm New Password"
              placeholder="Confirm New Password"
              class="font-14 font-weight-600"
              v-model="confirm_raw_password"
            ></b-form-input>
          </b-col>
        </b-row>
      </div>
      <h6 class="text-muted font-14 mt-3">Password strength:</h6>
      <p class="font-14">
        Use at least 8 characters. Don’t use a password from another site, or
        something too obvious like your pet’s name. <a href="#">Why?</a>
      </p>

      <base-button
        class="btn btn-primary mt-0 d-flex justify-content-center align-items-center font-14"
        type="submit"
        @click="changePwdFn"
        :loading="isLoading1"
        nativeType="submit"
      >
        <i class="mdi mdi-lock text-white mr-1"></i> Change Password
      </base-button>

      <hr class="my-4" />
      <h6 class="text-muted mb-3">
        2. Transaction Password
      </h6>
      <p class="text-muted font-14">
        Choose a strong password and don't reuse it for other accounts. Changing
        your transaction password will take some time to construct a
        cryptographic proof on blockchain payment channel accounts.<a href="#">
          Learn more</a
        >
      </p>
      <div>
        <b-row>
          <b-col lg="6">
            <b-form-input
              type="password"
              label="*New Transaction Password"
              placeholder="New Transaction Password"
              class="font-14 font-weight-600"
              v-model="raw_tx_password"
            ></b-form-input>
          </b-col>
          <b-col lg="6">
            <b-form-input
              type="password"
              label="*Confirm New Transaction Password"
              placeholder="Confirm New Transaction Password"
              class="font-14 font-weight-600"
              v-model="confirm_tx_raw_password"
            ></b-form-input>
          </b-col>
        </b-row>
      </div>
      <base-button
        class="btn btn-primary mt-3 d-flex justify-content-center align-items-center font-14"
        type="submit"
        @click="changeTxPwdFn"
        :loading="isLoading2"
        nativeType="submit"
      >
        <i class="mdi mdi-lock text-white mr-1"></i> Change Transaction Password
      </base-button>

      <hr class="my-4" />

      <h6 class="text-muted mb-3">
        3. Change Phone Number/SMS Authentication
      </h6>
      <p class="text-muted font-14">
        All users must verify their identity by using the account's registered
        phone number to authenticate. Therefore, before using any service, all
        users must authenticate and register a mobile number. This account is
        currently associated with the phone number <b>{{ user.phone }}</b
        >. To make changes, click on "Update & Set-up SMS Authentication".<a
          href="#"
        >
          Learn more</a
        >
      </p>
      <a
        class="w-auto btn btn-danger d-inline-flex justify-content-center align-items-center font-14"
        href="/activate-phone"
        target="_blank"
      >
        <i class="mdi mdi-cellphone-iphone text-white mr-1"></i>Update & Set-up
        SMS Authentication
      </a>

      <hr class="my-4" />

      <h6 class="text-muted mb-3">
        4. Primary Email Address
      </h6>
      <p class="text-muted font-14">
        Your primary email is used to reach you in case we detect unusual
        activity in your account or you accidentally get locked out. Your
        primary email will be used as the recovery email address which helps you
        to reset your password if:
      </p>
      <ul class="text-muted font-14">
        <li>
          You forget your password
        </li>
        <li>
          Someone else is using your account
        </li>
        <li>
          You’re locked out of your account for another reason
        </li>
      </ul>
      <div
        v-if="user && user.email"
        class="bg-secondary text-white rounded d-inline-block font-14 font-weight-600 mb-1 py-2 px-3"
      >
        <div v-if="user.email_verified_at">
          <span>{{ user.email }}</span>
          <b-badge variant="success" class="cursor-pointer ml-2 py-1 px-2">
            <i class="mdi mdi-check-circle"></i>
            Verified</b-badge
          >
        </div>
        <div v-else>
          <span>{{ user.email }}</span>
          <b-badge class="cursor-pointer ml-2  py-1 px-2 bg-white text-danger"
            >
            <i class="mdi mdi-cancel"></i>
            Not Verified</b-badge
          >
        </div>
      </div>
      <div class="d-flex justify-content-start align-items-center flex-wrap">
        <b-form-input
          type="text"
          v-if="showEmailInput"
          placeholder="New Primary Email"
          class="font-14 font-weight-600 my-2 mr-2 w-auto"
          v-model="temp_email"
        ></b-form-input>
        <base-button
          class="btn btn-sm btn-success my-2 mr-2 d-flex justify-content-center align-items-center"
          type="submit"
          v-if="temp_email"
          @click="sendEmailVerificationCodeFn"
          :loading="isLoading3"
          size="sm"
          nativeType="submit"
        >
          <i class="mdi mdi-email text-white mr-1"></i> Send Verification Code
        </base-button>
        <base-button
          v-if="showEmailInput"
          @click="showEmailInput = false"
          type="submit"
          class="btn btn-sm btn-outline-danger my-2 mr-2 font-12 font-weight-600"
          >Cancel</base-button
        >
      </div>
      <div>
        <span
          v-if="!showEmailInput"
          @click="showEmailInput = true"
          class="text-primary text-decoration-underline cursor-pointer mb-1 ml-1 font-14 font-weight-600"
          >Change primary email?</span
        >
      </div>
      <hr class="mt-3 mb-4" />
    </b-card>
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
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  UpdateAccountPasswordAPI,
  UpdateTxPasswordAPI,
  VerifyAndUpdateEmailRequestAPI
} from "@/services/user.service";

export default {
  data() {
    return {
      showEmailInput: false,
      isLoading1: false,
      isLoading2: false,
      isLoading3: false,
      raw_password: null,
      confirm_raw_password: null,
      raw_tx_password: null,
      confirm_tx_raw_password: null,
      temp_email: null
    };
  },
  computed: {
    ...mapGetters({
      user: "user/getUser"
    })
  },
  watch: {
    user: {
      handler(newVal, oldVal) {
        if (newVal && !newVal.email_verified_at) this.temp_email = newVal.email;
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    changePwdFn() {
      this.isLoading1 = true;
      const payload = {
        raw_password: this.raw_password
      };
      UpdateAccountPasswordAPI(payload)
        .then(response => {
          this.setJwtToken({
            jwtToken: response.data.data.token,
            autoNavigate: false
          });
        })
        .finally(() => (this.isLoading1 = false));
    },
    changeTxPwdFn() {
      this.isLoading2 = true;
      const payload = {
        raw_tx_password: this.raw_tx_password
      };
      UpdateTxPasswordAPI(payload).finally(() => (this.isLoading2 = false));
    },
    sendEmailVerificationCodeFn() {
      this.isLoading3 = true;
      const payload = {
        temp_email: this.temp_email
      };
      VerifyAndUpdateEmailRequestAPI(payload).finally(
        () => (this.isLoading3 = false)
      );
    }
  }
};
</script>

<style scoped></style>
