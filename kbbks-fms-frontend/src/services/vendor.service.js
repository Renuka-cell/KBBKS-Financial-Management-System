import http from "./http";

export const getVendors = () => http.get("/vendors");
export const addVendor = (data) => http.post("/vendors", data);
export const editVendor = (id, data) => http.put(`/vendors/${id}`, data);
export const getVendor = (id) => http.get(`/vendors/${id}`);
export const deleteVendor = (id) => http.delete(`/vendors/${id}`);
