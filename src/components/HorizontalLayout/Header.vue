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
                <span class="font-11 d-block font-weight-bold text-muted"
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
                class="d-flex justify-content-end align-items-center font-14"
              >
                <b-dropdown-item href="#">EN</b-dropdown-item>
                <b-dropdown-item href="#">ES</b-dropdown-item>
                <b-dropdown-item href="#">RU</b-dropdown-item>
                <b-dropdown-item href="#">FA</b-dropdown-item>
              </b-nav-item-dropdown>

              <!-- sign in -->
              <b-navbar-nav
                class="d-flex justify-content-end align-items-end align-items-sm-center"
              >
                <router-link to="/sign-in" class="text-decoration-none">
                  <a
                    class="btn btn-secondary d-inline-flex justify-content-end align-items-end font-14 text-nowrap"
                  >
                    <i class="mdi mdi-account-key mr-1"></i>
                    Sign In
                  </a>
                </router-link>
              </b-navbar-nav>

              <!-- profile -->
              <!-- <b-navbar-nav
                class="d-flex justify-content-end align-items-end align-items-sm-center"
              >
                <b-nav-item-dropdown right class="font-14">
                  <template #button-content>
                    <b-avatar
                      href="#bar"
                      src="https://placekitten.com/300/300"
                    ></b-avatar>
                    Manuka Yasas
                  </template>
                  <b-dropdown-item href="#">Profile</b-dropdown-item>
                  <b-dropdown-item href="#">Sign Out</b-dropdown-item>
                </b-nav-item-dropdown>
              </b-navbar-nav> -->
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
          class="d-flex flex-column flex-md-row justify-content-start justify-content-lg-between flex-wrap"
        >
          <router-link to="/" active-class="border border-white rounded" exact>
            <b-navbar-brand class="font-16 py-2 px-4"
              >Introduction</b-navbar-brand
            >
          </router-link>
          <router-link to="/sign-in" active-class="border border-white rounded">
            <b-navbar-brand class="font-16 py-2 px-4"
              >Account & Payment Management</b-navbar-brand
            >
          </router-link>
          <router-link
            to="/activate-2fa"
            active-class="border border-white rounded"
          >
            <b-navbar-brand class="font-16 py-2 px-4"
              >Services Explorer</b-navbar-brand
            >
          </router-link>
          <router-link
            to="/two-factor-challenge"
            active-class="border border-white rounded"
          >
            <b-navbar-brand class="font-16 py-2 px-4"
              >Transaction Builder</b-navbar-brand
            >
          </router-link>
          <router-link
            to="/activate-phone"
            active-class="border border-white rounded"
          >
            <b-navbar-brand class="font-16 py-2 px-4"
              >Sign Transaction</b-navbar-brand
            >
          </router-link>
          <router-link
            to="/reset-password"
            active-class="border border-white rounded"
          >
            <b-navbar-brand class="font-16 py-2 px-4"
              >Documentation</b-navbar-brand
            >
          </router-link>
        </div>
      </b-navbar>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showNavbar: false,
      showProfileMenu: false
    };
  },
  methods: {}
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
  height: 44px;
}

.width-1000 {
  max-width: 1000px;
  width: 100%;
}
</style>
