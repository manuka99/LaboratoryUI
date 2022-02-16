import Api from "./api";

export const GetAllAnalytics = Authorization => {
  return Api(false, { Authorization }).get(`/auth/analytics`);
};

export const GetAllSessions = Authorization => {
  return Api(false, { Authorization }).get(`/auth/sessions`);
};
