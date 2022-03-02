import Api from "./api";

export const GetRequestUserAPI = () => {
  return Api().get(`/public/auth-user`);
};

export const CreatePaymentChannelAccountAPI = (payload) => {
  return Api().post(`/general/payment-channel/create`, payload);
};
