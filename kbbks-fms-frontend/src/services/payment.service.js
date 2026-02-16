import http from "./http";

export const getPayments = () => http.get("/payments");
export const addPayment = (data) => http.post("/payments", data);
export const editPayment = (id, data) => http.put(`/payments/${id}`, data);
export const getPayment = (id) => http.get(`/payments/${id}`);
export const deletePayment = (id) => http.delete(`/payments/${id}`);
