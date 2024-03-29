import { APP_USER_TOKEN } from "../services/config";
import router from "./router";
import Store from "@/store";

export const PermissionedRouting = (to, from, next) => {
  const publicRoutes = ["Introduction", "NOTFOUND", "Submit Transaction"];
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
    "Activate Phone",
    "Account Management",
    "Sign Transaction"
  ];
  const generalAccountProtectedRoutes = [...protectedAccessRoutes];
  const serviceAccountProtectedRoutes = [...protectedAccessRoutes];

  var userDetails = null;
  var tokenExpired = true;
  if (localStorage.getItem(APP_USER_TOKEN)) {
    try {
      const jwtTokenData = JSON.parse(
        Buffer.from(
          localStorage.getItem(APP_USER_TOKEN).split(".")[1],
          "base64"
        ).toString()
      );
      userDetails = jwtTokenData;
      tokenExpired = userDetails.exp * 1000 <= Date.now();
    } catch (error) {
      userDetails = null;
    }
  }

  if (userDetails && userDetails.data) {
    switch (userDetails.data.type) {
      case "general":
        protectedAccessRoutes = generalAccountProtectedRoutes;
        break;
      case "SERVICE":
        protectedAccessRoutes = serviceAccountProtectedRoutes;
        break;
      default:
        break;
    }
  }

  if (!userDetails || !userDetails.data || tokenExpired) {
    Store.dispatch("user/setJwtToken", {
      jwtToken: "",
      autoNavigate: false,
      isFetchCurrentUserDetails: false
    });
    Store.dispatch("user/setUser", {});
  }

  const allRoutes = [
    ...guestAccessRoutes,
    ...generalAccountProtectedRoutes,
    ...serviceAccountProtectedRoutes
  ];
  if (publicRoutes.includes(to.name)) next && next();
  else if (userDetails && userDetails.data && !tokenExpired) {
    // logged in
    if (protectedAccessRoutes.includes(to.name)) next && next();
    else if (guestAccessRoutes.includes(to.name))
      router.push({
        name: "Already Authorized"
      });
    else if (allRoutes.includes(to.name))
      router.push({
        name: "No Required Permissions"
      });
    else
      router.push({
        name: "NOTFOUND"
      });
  } else {
    if (guestAccessRoutes.includes(to.name)) next && next();
    else
      router.push({
        name: "No Authorization Found"
      });
  }
};
