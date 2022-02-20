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
        <!-- <b-col cols="4" class="text-right">
        <a href="#!" class="btn btn-sm btn-primary"
          ><i class="mdi mdi-account-edit"></i> Edit Content</a
        >
      </b-col> -->
        <!-- <b-col cols="4" class="text-right">
        <a href="#!" class="btn btn-sm btn-success"
          ><i class="mdi mdi-content-save-all"></i> Save Content</a
        >
      </b-col> -->
      </b-row>

      <b-form>
        <h6 class="text-muted mb-3">
          1. User Identity Image
        </h6>
        <img
          :src="user.imagePaths[user.imagePaths.length - 1]"
          style="object-fit: contain;"
          class="bg-light"
          alt=""
          width="240"
          height="240"
        />
        <hr class="my-4" />
        <h6 class="text-muted mb-3">
          2. General Information
          <span class="font-12">(Cannot be editted)</span>
        </h6>

        <div>
          <b-row>
            <b-col lg="6">
              <base-input
                disabled
                type="text"
                label="First Name"
                placeholder="First Name"
                class="font-14 font-weight-600"
                :value="user.firstName"
              >
              </base-input>
            </b-col>
            <b-col lg="6">
              <base-input
                disabled
                type="text"
                label="Middle Name"
                placeholder="Middle Name"
                class="font-14 font-weight-600"
                :value="user.middleName"
              >
              </base-input>
            </b-col>
          </b-row>
          <b-row>
            <b-col lg="6">
              <base-input
                disabled
                type="text"
                label="Last Name"
                placeholder="Last Name"
                class="font-14 font-weight-600"
                :value="user.lastName"
              >
              </base-input>
            </b-col>
            <b-col lg="6">
              <base-input
                disabled
                type="text"
                label="Gender"
                placeholder="Gender"
                class="font-14 font-weight-600"
                :value="user.gender"
              >
              </base-input>
            </b-col>
          </b-row>
          <b-row>
            <b-col lg="6">
              <base-input
                disabled
                type="text"
                label="National ID"
                placeholder="National ID"
                class="font-14 font-weight-600"
                :value="user.nationalID"
              >
              </base-input>
            </b-col>
            <b-col lg="6">
              <base-input
                disabled
                type="text"
                label="Date of Birth"
                placeholder="Date of Birth"
                class="font-14 font-weight-600"
                :value="user.dateOfBirth"
              >
              </base-input>
            </b-col>
          </b-row>
          <b-row>
            <b-col lg="6">
              <base-input
                disabled
                type="text"
                label="Nationality"
                placeholder="Nationality"
                class="font-14 font-weight-600"
                :value="user.nationality.toString()"
              >
              </base-input>
            </b-col>
          </b-row>
        </div>
        <hr class="mt-3 mb-4" />
      </b-form>
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
export default {
  computed: {
    ...mapGetters({
      user: "user/getUser"
    })
  },
  methods: {
    updateProfile() {
      alert("Your data: " + JSON.stringify(this.user));
    }
  }
};
</script>

<style scoped></style>
