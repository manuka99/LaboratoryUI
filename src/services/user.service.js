import Api from "./api";
import { GetTxSecurityPwd } from "@/services/transaction.security";

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

export const ConfirmPasswordAPI = payload => {
  return Api().post(`/auth/general/verify-password`, payload);
};

export const ConfirmMobileRequestAPI = payload => {
  return Api().post(`/auth/general/verify-phone-request`, payload);
};

export const ConfirmMobileAPI = payload => {
  return Api().post(`/auth/general/verify-phone`, payload);
};

export const Confirm2FAAPI = payload => {
  return Api().post(`/auth/general/verify-2fa`, payload);
};

export const Register2FAAPI = payload => {
  return Api().post(`/general/register2fa`, payload);
};

export const Activate2FAAPI = payload => {
  return Api().post(`/general/activate2fa`, payload);
};

export const UpdateAccountPasswordAPI = payload => {
  return Api().patch(`/general/update-password`, payload);
};

export const Revoke2FAAPI = payload => {
  return Api().post(`/general/revoke2fa`, payload);
};

export const VerifyAndUpdateEmailRequestAPI = payload => {
  return Api().post(`/general/verify-email-request`, payload);
};

// transaction
export const ConfirmTxSecurityPwd = () => {
  return Api(false, { tx_pwd: GetTxSecurityPwd() }).get(`/general/tx-confirm`);
};

export const GetTxSecurityInfoAPI = () => {
  return Api().get(`/general/tx-security`);
};

export const UpdateTxPasswordAPI = payload => {
  return Api().patch(`/general/tx-password`, payload);
};

export const UpdateTxSignatureAPI = payload => {
  return Api().patch(`/general/tx-signature`, payload);
};

export const ResetTransactionSignatureAPI = () => {
  return Api().delete(`/general/reset-tx-signature`);
};
