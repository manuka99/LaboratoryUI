import Api from "./api";
import { GetTxSecurityPwd } from "@/services/transaction.security";

export const SignTransactionAPI = payload => {
  return Api(false, { tx_pwd: GetTxSecurityPwd() }).post(`/user/sign-transaction`, payload);
};
