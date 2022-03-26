<template>
  <div class="w-100">
    <div class="w-100 d-flex align-items-center justify-content-center">
      <b-navbar
        toggleable="sm"
        class="width-1000 d-flex flex-column flex-sm-row align-items-center justify-content-between"
      >
        <div class="d-flex justify-content-between w-100">
          <b-navbar-brand href="/">
            <div
              class="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center w-100"
            >
              <a class="navbar-brand brand-logo">
                <img src="@/assets/images/metaspeck_logo2.jpg" alt="logo" />
                <span class="font-13 d-block font-weight-600 text-muted"
                  >Smart Legal Contract Laboratory
                </span>
              </a>
            </div>
          </b-navbar-brand>

          <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        </div>

        <div class="d-flex justify-content-end w-100">
          <b-collapse id="nav-collapse" is-nav>
            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto">
              <b-nav-item-dropdown
                text="Lang"
                right
                class="d-flex justify-content-end align-items-center font-14 font-weight-bold"
              >
                <b-dropdown-item href="#">EN</b-dropdown-item>
                <b-dropdown-item href="#">ES</b-dropdown-item>
                <b-dropdown-item href="#">RU</b-dropdown-item>
                <b-dropdown-item href="#">FA</b-dropdown-item>
              </b-nav-item-dropdown>

              <!-- sign in -->
              <b-navbar-nav
                v-if="!user.nationalID"
                class="d-flex justify-content-end align-items-end align-items-sm-center"
              >
                <router-link to="/sign-in" class="text-decoration-none">
                  <a
                    class="btn btn-secondary d-inline-flex justify-content-end align-items-end font-15 text-nowrap font-weight-600"
                  >
                    <i class="mdi mdi-account-key mr-1"></i>
                    Sign In
                  </a>
                </router-link>
              </b-navbar-nav>

              <!-- profile -->
              <b-navbar-nav
                v-else
                class="d-flex justify-content-end align-items-end align-items-sm-center"
              >
                <b-nav-item-dropdown right no-caret>
                  <template #button-content>
                    <div class="d-flex">
                      <b-avatar
                        :src="
                          user.imagePaths &&
                            user.imagePaths[user.imagePaths.length - 1]
                        "
                      ></b-avatar>
                      <div class="ml-2 d-flex flex-column">
                        <span class="font-weight-bold font-13"
                          >{{ user.firstName }} {{ user.lastName }}</span
                        >
                        <span class="text-mutted font-weight-bold font-12"
                          >NIC: {{ user.nationalID }}</span
                        >
                      </div>
                      <div
                        class="ml-2 d-flex flex-column justify-content-end align-items-end"
                      >
                        <i
                          class="mdi mdi-arrow-down-drop-circle-outline font-18 text-mutted"
                        ></i>
                      </div>
                    </div>
                  </template>
                  <b-dropdown-item href="#">Profile</b-dropdown-item>
                  <b-dropdown-item @click="signOut">Sign Out</b-dropdown-item>
                </b-nav-item-dropdown>
              </b-navbar-nav>
              <!-- end profile -->
            </b-navbar-nav>
          </b-collapse>
        </div>
      </b-navbar>
    </div>
    <!-- partial:partials/_horizontal-navbar.html -->
    <div class="w-100">
      <b-navbar
        toggleable="lg"
        type="dark"
        variant="primary"
        class="d-flex justify-content-start justify-content-md-center w-100 flex-wrap"
      >
        <div
          class="d-flex flex-column flex-md-row justify-content-start flex-wrap"
        >
          <router-link
            to="/"
            class="border border-primary"
            active-class="border border-white rounded"
            exact
          >
            <b-navbar-brand
              class="btn btn-ripple font-15 py-2 px-4 m-0 font-weight-600 text-center"
              >Introduction</b-navbar-brand
            >
          </router-link>
          <router-link
            to="/account-management"
            class="border border-primary"
            active-class="border border-white rounded"
          >
            <b-navbar-brand
              class="btn btn-ripple font-15 py-2 px-4 m-0 font-weight-600 text-center"
              >Account & Payment Management</b-navbar-brand
            >
          </router-link>
          <router-link
            to="/activate-2fa"
            class="border border-primary"
            active-class="border border-white rounded"
          >
            <b-navbar-brand
              class="btn btn-ripple font-15 py-2 px-4 m-0 font-weight-600"
              >Services Explorer</b-navbar-brand
            >
          </router-link>
          <router-link
            to="/two-factor-challenge"
            class="border border-primary"
            active-class="border border-white rounded"
          >
            <b-navbar-brand
              class="btn btn-ripple font-15 py-2 px-4 m-0 font-weight-600"
              >Contract Builder</b-navbar-brand
            >
          </router-link>
          <router-link
            to="/txsigner"
            class="border border-primary"
            active-class="border border-white rounded"
          >
            <b-navbar-brand
              class="btn btn-ripple font-15 py-2 px-4 m-0 font-weight-600"
              >Sign Transaction</b-navbar-brand
            >
          </router-link>
          <router-link
            to="/submit"
            class="border border-primary"
            active-class="border border-white rounded"
          >
            <b-navbar-brand
              class="btn btn-ripple font-15 py-2 px-4 m-0 font-weight-600"
              >Submit Transaction</b-navbar-brand
            >
          </router-link>
        </div>
      </b-navbar>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      showNavbar: false,
      showProfileMenu: false
    };
  },
  computed: {
    ...mapGetters({
      user: "user/getUser"
    })
  },
  methods: {
    ...mapActions({
      signOut: "user/signOut"
    })
  }
};
</script>

<style scoped>
.navbar .top-navbar {
  background-color: white;
}

.navbar-brand .brand-logo {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}
.navbar-brand .brand-logo img {
  height: 52px;
}

.width-1000 {
  max-width: 1000px;
  width: 100%;
}
</style>
