import http from "./http";

export const getBills = (params = undefined) => http.get("/bills/", { params });
export const addBill = (data) => http.post("/bills/create", data);
