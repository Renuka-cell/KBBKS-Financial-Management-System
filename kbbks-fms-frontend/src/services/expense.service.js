import http from "./http";

export const getExpenses = () => http.get("/expenses");
export const addExpense = (data) => http.post("/expenses", data);
export const editExpense = (id, data) => http.put(`/expenses/${id}`, data);
export const getExpense = (id) => http.get(`/expenses/${id}`);
export const deleteExpense = (id) => http.delete(`/expenses/${id}`);
