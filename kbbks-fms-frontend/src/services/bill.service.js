import http from "./http";

export const getBills = () => http.get("/bills");
export const addBill = (data) => http.post("/bills", data);
export const editBill = (id, data) => http.put(`/bills/${id}`, data);
export const getBill = (id) => http.get(`/bills/${id}`);
export const deleteBill = (id) => http.delete(`/bills/${id}`);
