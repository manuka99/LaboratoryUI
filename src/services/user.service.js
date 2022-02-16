import Api from "./api";

export const GetRequestUser = () => {
  return Api().get(`/public/auth-user`);
};

export const Logout = () => {
  return Api().post(`/auth/logout`);
};

export const Login = payload => {
  return Api().post(`/guest/general/login`, payload);
};

export const RecoverPassword = payload => {
  return Api().post(`/guest/general/recover-password`, payload);
};

export const ResetPassword = payload => {
  return Api().patch(`/guest/general/reset-password`, payload);
};

export const UpdateTempPhone = payload => {
  return Api().patch(`/auth/general/update-temp-phone`, payload);
};

export const VerifyAndUpdatePhone = payload => {
  return Api().patch(`/auth/general/update-phone`, payload);
};

export const Authorize2FA = payload => {
  return Api().post(`/auth/general/authorize2fa`, payload);
};

export const Register2FA = payload => {
  return Api().post(`/auth/general/register2fa`, payload);
};

export const Activate2FA = payload => {
  return Api().post(`/api/auth/general/activate2fa`, payload);
};

export const UpdateAccountPassword = payload => {
  return Api().patch(`/general/update-password`, payload);
};

export const UpdateTxPassword = payload => {
  return Api().patch(`/general/update-tx-password`, payload);
};

export const ConfirmPassword = payload => {
  return Api().post(`/general/confirm-password`, payload);
};

export const Revoke2FA = payload => {
  return Api().post(`/general/revoke2fa`, payload);
};
