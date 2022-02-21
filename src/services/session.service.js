import Api from "./api";

export const GetUserSessionsAPI = () => {
  return Api().get(`/general/sessions`);
};

export const GetUserSessionAPI = id => {
  return Api().get(`/general/sessions/${id}`);
};

export const RevokeAllUserSessionsAPI = () => {
  return Api().post(`/general/revoke-sessions`);
};

export const RevokeUserSessionAPI = id => {
  return Api().post(`/general/revoke-sessions/${id}`);
};

export const DeleteAllInvalidUserSessionAPI = () => {
  return Api().delete(`/general/sessions`);
};

export const DeleteInvalidUserSessionAPI = (id) => {
  return Api().delete(`/general/sessions/${id}`);
};
