import { APP_USER_TOKEN } from "@/services/config";
import { GetRequestUserAPI } from "@/services/user.service";

export default {
  namespaced: true,
  state: {
    type: null,
    firstName: null,
    lastName: null,
    nationalID: null,
    dateOfBirth: null,
    phone: null,
    email: null,
    address: null,
    transactionPassword: null,
    imagePaths: null,
    mainAccountID: null,
    previousAccounts: null,
    isTwoFactorEnabled: null,
    isApproved: null,
    approvalReason: null,
    approvedBy: null,
    phone_verified_at: null,
    email_verified_at: null,
    createdAt: null,
    updatedAt: null,
    current_session: null,
    active_sessions: [],
    all_sessions: []
    // jwtToken: null
  },
  mutations: {
    SET_USER(state, payload) {
      state.type = payload.type;
      state.firstName = payload.firstName;
      state.lastName = payload.lastName;
      state.nationalID = payload.nationalID;
      state.dateOfBirth = payload.dateOfBirth;
      state.phone = payload.phone;
      state.email = payload.email;
      state.address = payload.address;
      state.imagePaths = payload.imagePaths;
      state.mainAccountID = payload.mainAccountID;
      state.previousAccounts = payload.previousAccounts;
      state.isTwoFactorEnabled = payload.isTwoFactorEnabled;
      state.isApproved = payload.isApproved;
      state.approvalReason = payload.approvalReason;
      state.approvedBy = payload.approvedBy;
      state.phone_verified_at = payload.phone_verified_at;
      state.createdAt = payload.createdAt;
      state.updatedAt = payload.updatedAt;
    },
    SET_SESSION(state, payload) {
      state.current_session = payload.current_session;
      state.active_sessions = payload.active_sessions;
      state.all_sessions = payload.all_sessions;
    },
    SET_TX_PWD(state, payload) {
      state.transactionPassword = payload.transactionPassword;
    }
    // SET_JWT_TOKEN(state, payload) {
    //   state.jwtToken = payload.jwtToken;
    // }
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
    setJwtToken({ dispatch }, payload) {
      localStorage.setItem(APP_USER_TOKEN, payload.jwtToken);
      // commit("SET_JWT_TOKEN", payload);
      dispatch("fetchCurrentUserDetails");
    },
    fetchCurrentUserDetails(context) {
      return new Promise((resolve, reject) => {
        GetRequestUserAPI()
          .then(res => {
            const user =
              res.data && res.data.data && res.data.data.user
                ? res.data.data.user
                : {};
            context.dispatch("setUser", user);
            resolve(res.data);
          })
          .catch(e => reject(e));
      });
    }
  },
  getters: {
    getUser: state => {
      return {
        type: state.type,
        firstName: state.firstName,
        lastName: state.lastName,
        nationalID: state.nationalID,
        dateOfBirth: state.dateOfBirth,
        phone: state.phone,
        email: state.email,
        address: state.address,
        imagePaths: state.imagePaths,
        mainAccountID: state.mainAccountID,
        previousAccounts: state.previousAccounts,
        isTwoFactorEnabled: state.isTwoFactorEnabled,
        isApproved: state.isApproved,
        approvalReason: state.approvalReason,
        approvedBy: state.approvedBy,
        phone_verified_at: state.phone_verified_at,
        createdAt: state.createdAt,
        updatedAt: state.updatedAt
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
    },
    getJwtToken: state => {
      return {
        jwtToken: state.jwtToken
      };
    }
  }
};
