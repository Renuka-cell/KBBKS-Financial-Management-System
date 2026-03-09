import http from "./http";

export const getVendorOutstanding = () => http.get("/reports/vendor-outstanding");
export const getMonthlyExpense = () => http.get("/reports/monthly-expense");
export const getIncomeExpense = () => http.get("/reports/income-expense");
export const getVendorSummary = (vendorId, params = {}) => {
  // remove empty values because URLSearchParams will include them and backend
  // treats empty strings as "no filter" anyway, but it's nicer to not send
  // unnecessary keys.
  const filtered = {};
  Object.entries(params).forEach(([k, v]) => {
    if (v !== '' && v !== null && v !== undefined) filtered[k] = v;
  });
  const query = new URLSearchParams(filtered).toString();
  return http.get(`/reports/vendor-summary/${vendorId}${query ? `?${query}` : ''}`);
};

export const getDashboardSummary = () => http.get("/reports/dashboard-summary");
export const getDashboardTrend = () => http.get("/reports/dashboard-trend");
export const getExpenseCategoryDistribution = () => http.get("/reports/expense-category-distribution");

// Excel/CSV exports (Expense & Payment)
export const downloadExpensesExcel = () =>
  http.get("/reports/expenses-export", { responseType: "blob" });

export const downloadPaymentsExcel = () =>
  http.get("/reports/payments-export", { responseType: "blob" });
