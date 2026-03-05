import http from "./http";

export const addExpense = (data, billFile) => {
  // If we have a bill file, send multipart/form-data
  if (billFile) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
    formData.append("bill_file", billFile);

    return http.post("/expenses/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  // Fallback: JSON request (no file)
  return http.post("/expenses/create", data);
};
