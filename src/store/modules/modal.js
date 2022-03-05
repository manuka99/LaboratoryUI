export default {
  namespaced: true,
  state: {
    showPasswordVerify: false,
    show2FAVerify: false,
    showMobileVerify: false,
    showTxPasswordVerify: false,
  },
  mutations: {
    SET_MODALS(state, payload) {
      const filteredData = JSON.parse(
        JSON.stringify(payload, [
          "showPasswordVerify",
          "show2FAVerify",
          "showMobileVerify",
          "showTxPasswordVerify",
        ])
      );
      var newState = {
        ...state,
        ...filteredData
      };
      Object.keys(newState).map(key => (state[key] = newState[key]));
    }
  },
  actions: {
    setModalsInfo({ commit }, payload) {
      commit("SET_MODALS", payload);
    }
  },
  getters: {
    getModalsInfo: state => {
      return {
        showPasswordVerify: state.showPasswordVerify,
        show2FAVerify: state.show2FAVerify,
        showMobileVerify: state.showMobileVerify,
        showTxPasswordVerify: state.showTxPasswordVerify,
      };
    }
  }
};
