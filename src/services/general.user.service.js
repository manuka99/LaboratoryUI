import Api from "./api";

export const GetUserByNicAPI = nationalID => {
  return Api().get(`/public/general/user`, {
    params: {
      nationalID
    }
  });
};
