import http from "./http";

export const getVendors = () => http.get("/vendors/");

// support FormData when uploading logo
export const addVendor = (data) => {
  return http.post("/vendors/create", data);
};

export const editVendor = (id, data) => {
  return http.post(`/vendors/update/${id}`, data);
};

export const deleteVendor = (id) => http.get(`/vendors/delete/${id}`);
