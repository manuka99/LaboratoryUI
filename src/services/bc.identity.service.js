import Api from "./api";

export const GetIdentificationApi = params => {
  return Api().get(`/general/blockchain-identity`, {
    params
  });
};

export const SaveIdentificationApi = payload => {
  return Api().post(`/general/blockchain-identity`, payload);
};
