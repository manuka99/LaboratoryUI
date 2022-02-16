let checkUser = () => {
  return JSON.parse(localStorage.getItem("user")) ? true : false;
};

exports.APP_URL = process.env.VUE_APP_URL;
exports.APP_USER_TOKEN = process.env.VUE_APP_TOKEN;
exports.APP_USER = process.env.VUE_APP_USER;
exports.checkUser = checkUser;
