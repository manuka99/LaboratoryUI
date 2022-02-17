import Api from "./api";

export const GetRequestUserAPI = () => {
  return Api().get(`/public/auth-user`);
};

export const LogoutAPI = () => {
  return Api().post(`/auth/logout`);
};

export const LoginAPI = payload => {
  return Api().post(`/guest/general/login`, payload);
};

export const RecoverPasswordAPI = payload => {
  return Api().post(`/guest/general/recover-password`, payload);
};

export const ResetPasswordAPI = payload => {
  return Api().patch(`/guest/general/reset-password`, payload);
};

export const UpdateTempPhoneAPI = payload => {
  return Api().patch(`/auth/general/update-temp-phone`, payload);
};

export const VerifyAndUpdatePhoneAPI = payload => {
  return Api().patch(`/auth/general/update-phone`, payload);
};

export const Authorize2FAAPI = payload => {
  return Api().post(`/auth/general/authorize2fa`, payload);
};

export const Register2FAAPI = payload => {
  return Api().post(`/auth/general/register2fa`, payload);
};

export const Activate2FAAPI = payload => {
  return Api().post(`/api/auth/general/activate2fa`, payload);
};

export const UpdateAccountPasswordAPI = payload => {
  return Api().patch(`/general/update-password`, payload);
};

export const UpdateTxPasswordAPI = payload => {
  return Api().patch(`/general/update-tx-password`, payload);
};

export const ConfirmPasswordAPI = payload => {
  return Api().post(`/general/confirm-password`, payload);
};

export const Revoke2FAAPI = payload => {
  return Api().post(`/general/revoke2fa`, payload);
};
