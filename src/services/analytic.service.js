import Api from "./api";

export const GetAllConversions = Authorization => {
  return Api(false, { Authorization }).get(`/auth/conversions`);
};

export const GetAllDownloads = Authorization => {
  return Api(false, { Authorization }).get(`/auth/downloads`);
};

export const GetAllTests = Authorization => {
  return Api(false, { Authorization }).get(`/auth/test-download`);
};

export const BeginTest = data => {
  return Api().post(`/public/test-download`, data);
};

// hide
export const HideDownload = (Authorization, id) => {
  return Api(false, { Authorization }).put(`/auth/downloads-hide/${id}`);
};
