import Api from "./api";
import { GetTxSecurityPwd } from "@/services/transaction.security";

export const SignTransactionAPI = payload => {
  return Api(false, { tx_pwd: GetTxSecurityPwd() }).post(
    `/user/sign-transaction`,
    payload
  );
};

export const CreateTempTxnAPI = payload => {
  return Api().post(`/user/create-temp-transaction`, payload);
};

export const AddSignAPI = payload => {
  return Api().post(`/user/add-sign`, payload);
};

export const RemoveSignAPI = payload => {
  return Api().post(`/user/remove-sign`, payload);
};

export const FindCreatedTransactionsAPI = params => {
  return Api().get(`/user/find-created-transactions`, {
    params
  });
};

export const FindSharedTransactionsAPI = params => {
  return Api().get(`/user/find-shared-transactions`, {
    params
  });
};

export const FindTransactionsAPI = params => {
  return Api().get(`/user/find-transactions`, {
    params
  });
};
