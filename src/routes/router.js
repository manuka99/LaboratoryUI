import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";
import { APP_USER_TOKEN } from "../services/config";
import store from "../store";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  routes,
  linkActiveClass: "active",
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return { selector: to.hash };
    }
    return { x: 0, y: 0 };
  }
});

router.beforeEach((to, from, next) => {
  const publicRoutes = ["Introduction", "NOTFOUND"];
  const guestAccessRoutes = [
    ...publicRoutes,
    "Sign In",
    "Recover Account",
    "Reset Password",
    "No Authorization Found"
  ];
  var protectedAccessRoutes = [
    ...publicRoutes,
    "No Required Permissions",
    "Already Authorized",
    "Authorize 2FA",
    "Setup 2FA",
    "Activate 2FA",
    "Activate Phone",
    "Account Management"
  ];
  const generalAccountProtectedRoutes = [...protectedAccessRoutes];
  const serviceAccountProtectedRoutes = [...protectedAccessRoutes];

  var userDetails = null;
  if (localStorage.getItem(APP_USER_TOKEN)) {
    try {
      const jwtTokenData = JSON.parse(
        Buffer.from(
          localStorage.getItem(APP_USER_TOKEN).split(".")[1],
          "base64"
        ).toString()
      );
      userDetails = jwtTokenData;
    } catch (error) {
      userDetails = null;
    }
  }

  if (userDetails) {
    switch (userDetails.type) {
      case "GENERAL":
        protectedAccessRoutes = generalAccountProtectedRoutes;
        break;
      case "SERVICE":
        protectedAccessRoutes = serviceAccountProtectedRoutes;
        break;
      default:
        break;
    }
  }

  const allRoutes = [
    ...guestAccessRoutes,
    ...generalAccountProtectedRoutes,
    ...serviceAccountProtectedRoutes
  ];

  if (publicRoutes.includes(to.name)) next();
  else if (userDetails) {
    // logged in
    if (protectedAccessRoutes.includes(to.name)) next();
    else if (guestAccessRoutes.includes(to.name))
      next({
        name: "Already Authorized"
      });
    else if (allRoutes.includes(to.name))
      next({
        name: "No Required Permissions"
      });
    else
      next({
        name: "NOTFOUND"
      });
  } else {
    if (guestAccessRoutes.includes(to.name)) next();
    else
      next({
        name: "No Authorization Found"
      });
  }
});

export default router;
