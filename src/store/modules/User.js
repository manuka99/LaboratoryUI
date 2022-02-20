import { APP_USER_TOKEN } from "@/services/config";
import { GetRequestUserAPI, LogoutAPI } from "@/services/user.service";
import router from "@/routes/router";
import Store from "@/store";
import { PermissionedRouting } from "../../routes/permission";

export default {
  namespaced: true,
  state: {
    type: null,
    firstName: null,
    middleName: null,
    lastName: null,
    gender: null,
    nationalID: null,
    dateOfBirth: null,
    phone: null,
    tempPhone: null,
    email: null,
    street: null,
    province: null,
    district: null,
    country: null,
    nationality: null,
    address: null,
    zipCode: null,
    transactionPassword: null,
    imagePaths: null,
    mainAccountID: null,
    previousAccounts: null,
    isMobileAuthenticationEnabled: null,
    isTwoFactorEnabled: null,
    isApproved: null,
    approvalReason: null,
    isLocked: null,
    phone_verified_at: null,
    email_verified_at: null,
    jwtTokenData: null,
    current_session: null,
    active_sessions: [],
    all_sessions: []
  },
  mutations: {
    SET_USER(state, payload) {
      state.type = payload.type;
      state.firstName = payload.firstName;
      state.middleName = payload.middleName;
      state.lastName = payload.lastName;
      state.gender = payload.gender;
      state.nationalID = payload.nationalID;
      state.dateOfBirth = payload.dateOfBirth;
      state.phone = payload.phone;
      state.tempPhone = payload.tempPhone;
      state.email = payload.email;
      state.street = payload.street;
      state.province = payload.province;
      state.district = payload.district;
      state.country = payload.country;
      state.nationality = payload.nationality;
      state.address = payload.address;
      state.zipCode = payload.zipCode;
      state.imagePaths = payload.imagePaths;
      state.mainAccountID = payload.mainAccountID;
      state.previousAccounts = payload.previousAccounts;
      state.isMobileAuthenticationEnabled =
        payload.isMobileAuthenticationEnabled;
      state.isTwoFactorEnabled = payload.isTwoFactorEnabled;
      state.isApproved = payload.isApproved;
      state.approvalReason = payload.approvalReason;
      state.isLocked = payload.isLocked;
      state.phone_verified_at = payload.phone_verified_at;
      state.email_verified_at = payload.email_verified_at;
    },
    SET_SESSION(state, payload) {
      state.current_session = payload.current_session;
      state.active_sessions = payload.active_sessions;
      state.all_sessions = payload.all_sessions;
    },
    SET_TX_PWD(state, payload) {
      state.transactionPassword = payload.transactionPassword;
    },
    SET_JWT_TOKEN_DATA(state, payload) {
      state.jwtTokenData = payload.jwtTokenData;
    },
    SET_TEMP_PHONE(state, payload) {
      state.tempPhone = payload.tempPhone;
    }
  },
  actions: {
    setUser({ commit }, payload) {
      commit("SET_USER", payload);
    },
    setSession({ commit }, payload) {
      commit("SET_SESSION", payload);
    },
    setTxPassword({ commit }, payload) {
      commit("SET_TX_PWD", payload);
    },
    setJwtTokenData({ commit }, payload) {
      commit("SET_JWT_TOKEN_DATA", payload);
    },
    setTempPhone({ commit }, payload) {
      commit("SET_TEMP_PHONE", payload);
    },
    setJwtToken(
      { dispatch },
      { jwtToken, autoNavigate, isFetchCurrentUserDetails = true }
    ) {
      localStorage.setItem(APP_USER_TOKEN, jwtToken);
      try {
        const jwtTokenData = JSON.parse(
          Buffer.from(jwtToken.split(".")[1], "base64").toString()
        );
        dispatch("setJwtTokenData", { jwtTokenData });
      } catch (error) {
        dispatch("setJwtTokenData", { jwtTokenData: null });
      }
      if (isFetchCurrentUserDetails)
        dispatch("fetchCurrentUserDetails", { autoNavigate });
    },
    signOut({ dispatch }) {
      LogoutAPI();
      dispatch("setJwtToken", { jwtToken: "" });
      dispatch("fetchCurrentUserDetails", { autoNavigate: true });
      router.push({ name: "Introduction" });
    },
    fetchCurrentUserDetails(context, { autoNavigate }) {
      return new Promise((resolve, reject) => {
        GetRequestUserAPI()
          .then(res => {
            const user =
              res.data && res.data.data && res.data.data.user
                ? res.data.data.user
                : {};
            if (!user || !user.nationalID)
              context.dispatch("setJwtToken", {
                jwtToken: "",
                isFetchCurrentUserDetails: false
              });
            context.dispatch("setUser", user);
            context.dispatch("autoAuthNavigation", {
              autoNavigate
            });
            PermissionedRouting(router.history.current);
            resolve(res.data);
          })
          .catch(e => {
            context.dispatch("setJwtToken", {
              jwtToken: "",
              isFetchCurrentUserDetails: false
            });
            context.dispatch("setUser", {});
            context.dispatch("autoAuthNavigation", {
              autoNavigate
            });
            reject(e);
          });
      });
    },
    // auth
    autoAuthNavigation({ state }, { autoNavigate }) {
      if (autoNavigate) {
        if (!state.jwtTokenData) {
          router.push("/sign-in");
        } else if (!state.isMobileAuthenticationEnabled) {
          router.push("/activate-phone");
        } else if (
          state.isMobileAuthenticationEnabled &&
          !state.jwtTokenData.data.isMobileAuthorized
        ) {
          Store.dispatch("modal/setModalsInfo", { showMobileVerify: true });
        } else {
          router.push("/introduction");
        }
      }
    }
  },
  getters: {
    getUser: state => {
      return {
        type: state.type,
        firstName: state.firstName,
        middleName: state.middleName,
        lastName: state.lastName,
        gender: state.gender,
        nationalID: state.nationalID,
        dateOfBirth: state.dateOfBirth,
        phone: state.phone,
        tempPhone: state.tempPhone,
        email: state.email,
        street: state.street,
        province: state.province,
        district: state.district,
        country: state.country,
        nationality: state.nationality,
        address: state.address,
        zipCode: state.zipCode,
        imagePaths: state.imagePaths,
        mainAccountID: state.mainAccountID,
        previousAccounts: state.previousAccounts,
        isMobileAuthenticationEnabled: state.isMobileAuthenticationEnabled,
        isTwoFactorEnabled: state.isTwoFactorEnabled,
        isApproved: state.isApproved,
        approvalReason: state.approvalReason,
        isLocked: state.isLocked,
        phone_verified_at: state.phone_verified_at,
        email_verified_at: state.email_verified_at
      };
    },
    getSessionDetails: state => {
      return {
        current_session: state.current_session,
        active_sessions: state.active_sessions,
        all_sessions: state.all_sessions
      };
    },
    getTxPassword: state => {
      return {
        transactionPassword: state.transactionPassword
      };
    }
  }
};
