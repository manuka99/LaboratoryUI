import axios from "axios";
import { APP_URL, APP_USER_TOKEN } from "@/services/config";
import router from "@/routes/router";
import { BToast } from "bootstrap-vue";
import { ErrorCodes } from "./config";
import Store from "@/store";

export default function Api(nonApi = false, opts = {}) {
  let user_token = localStorage.getItem(APP_USER_TOKEN);
  const Api = axios.create({
    baseURL: `${APP_URL}${nonApi ? "" : "/api"}`,
    timeout: 30 * 60000,
    headers: {
      Authorization: `Bearer ${user_token}`,
      "Content-Type": "application/json",
      ...opts
    }
  });

  Api.interceptors.response.use(
    response => {
      let bootStrapToaster = new BToast();
      bootStrapToaster.$bvToast.toast(response.data.data.message, {
        title: "SUCCESS! Task was completed.",
        autoHideDelay: 6000,
        appendToast: false,
        variant: "success",
        solid: true,
        toaster: "b-toaster-bottom-right",
        appendToast: true
      });
      return Promise.resolve(response);
    },
    error => {
      const { response } = error;

      var errMessage =
        response && response.data && response.data.data
          ? response.data.data.message
          : error.message || "Unexpected error";

      let bootStrapToaster = new BToast();
      bootStrapToaster.$bvToast.toast(errMessage, {
        title: "ERROR! Task was not completed.",
        autoHideDelay: 6000,
        appendToast: false,
        variant: "danger",
        solid: true,
        toaster: "b-toaster-bottom-right",
        appendToast: true
      });

      // else if (status === 401) alert("Not Authorized");
      // else if (status === 404) alert("Page not Found");
      // else if (status === 500) alert("500 Error");
      // else alert(error.message);

      if (response.status === 401) {
        Store.dispatch("user/setJwtToken", {
          jwtToken: "",
          autoNavigate: true
        });
      } else if (response.status === 403) {
        const code =
          response && response.data && response.data.data
            ? response.data.data.code
            : null;
        switch (code) {
          case ErrorCodes.TWO_FACTOR_AUTH:
            Store.dispatch("modal/setModalsInfo", { show2FAVerify: true });
            break;
          case ErrorCodes.PHONE_AUTH:
            Store.dispatch("modal/setModalsInfo", { showMobileVerify: true });
            break;
          case ErrorCodes.ACCOUNT_APPROVAL:
            break;
          case ErrorCodes.ACCOUNT_LOCKED:
            break;
          case ErrorCodes.PASSWORD_VERIFICATION:
            Store.dispatch("modal/setModalsInfo", { showPasswordVerify: true });
            break;
          case ErrorCodes.PHONE_VERIFICATION:
            Store.dispatch("modal/setModalsInfo", { showMobileVerify: true });
            break;
          case ErrorCodes.TWO_FACTOR_VERIFICATION:
            Store.dispatch("modal/setModalsInfo", { show2FAVerify: true });
            break;
          case ErrorCodes.TX_PASSWORD_VERIFICATION:
            Store.dispatch("modal/setModalsInfo", {
              showTxPasswordVerify: true
            });
            break;
          default:
            break;
        }
      } else if (response.status === 406) {
        Store.dispatch("user/autoAuthNavigation", { autoNavigate: true });
      }

      return Promise.reject(error);
    }
  );

  return Api;
}
