import http from "./http";

export const getIncomeExpense = () => http.get("/reports/income-expense");
export const getVendorOutstanding = () => http.get("/reports/vendor-outstanding");
export const getMonthlyExpense = () => http.get("/reports/monthly-expense");
