import Api from "./api";

export const FindBlockchainAccountsAPI = params => {
  return Api().get(`/general/blockchain-account`, {
    params
  });
};

export const FindBlockchainAccountAPI = id => {
  return Api().get(`/general/blockchain-account/${id}`);
};

export const CreateBlockchainAccountAPI = payload => {
  return Api().post(`/general/blockchain-account`, payload);
};

export const UpdateBlockchainAccountInfoAPI = (id, payload) => {
  return Api().patch(`/general/blockchain-account/${id}`, payload);
};

export const UnLockBlockchainAccountAPI = id => {
  return Api().patch(`/general/unlock-blockchain-account/${id}`);
};

export const RemoveBlockchainAccountAPI = id => {
  return Api().delete(`/general/blockchain-account/${id}`);
};