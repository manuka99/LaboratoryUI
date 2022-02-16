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
    created_at: null,
    updated_at: null,
    current_session: null,
    active_sessions: [],
    all_sessions: []
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
      state.created_at = payload.created_at;
      state.updated_at = payload.updated_at;
    },
    SET_SESSION(state, payload) {
      state.current_session = payload.current_session;
      state.active_sessions = payload.active_sessions;
      state.all_sessions = payload.all_sessions;
    },
    SET_TX_PWD(state, payload) {
      state.transactionPassword = payload.transactionPassword;
    }
  },
  actions: {
    setNotify({ commit }, payload) {
      commit("SET_USER", payload);
    },
    setNotify({ commit }, payload) {
      commit("SET_SESSION", payload);
    },
    setNotify({ commit }, payload) {
      commit("SET_TX_PWD", payload);
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
        created_at: state.created_at,
        updated_at: state.updated_at
      };
    },
    getSessionDetails: state => {
      return {
        current_session: state.current_session,
        active_sessions: state.active_sessions,
        all_sessions: state.all_sessions
      };
    },
    getSessionDetails: state => {
      return {
        current_session: state.current_session,
        active_sessions: state.active_sessions,
        all_sessions: state.all_sessions
      };
    }
  }
};
