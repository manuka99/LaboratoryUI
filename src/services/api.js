import axios from "axios";
import { APP_URL, APP_USER_TOKEN, APP_USER } from "@/services/config";
import router from "@/routes/router";
import { BToast } from "bootstrap-vue";

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
      const {
        response,
        response: { data, status }
      } = error;

      var errMessage =
        response && data && data.data
          ? data.data.message
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

      if (status === 401) {
        localStorage.clear(APP_USER_TOKEN);
        localStorage.clear(APP_USER);
        router.push({ name: "Login" });
      }

      return Promise.reject(error);
    }
  );

  return Api;
}
