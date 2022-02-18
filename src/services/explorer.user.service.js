import Api from "./api";

export const GetUserByNicAPI = nationalID => {
  return Api().get(`/public/explorer/user/${nationalID}`);
};
