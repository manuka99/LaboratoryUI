import Api from "./api";

export const GetNotice = () => {
  return Api().get(`/public/notice`);
};

export const SaveNotice = (Authorization, data) => {
  return Api(false, { Authorization }).post(`/auth/notice`, data);
};
