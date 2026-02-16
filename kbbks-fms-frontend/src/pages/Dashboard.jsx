import { useEffect, useState } from "react";
import http from "../services/http"; // axios instance

function Dashboard() {
  const [stats, setStats] = useState({
    total_expense: 0,
    total_income: 0,
    outstanding_amount: 0,
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await http.get("/reports/income-expense");

      // Access res.data.data (API wraps response in { status, data })
      const reportData = res.data.data || res.data;
      setStats({
        total_expense: parseFloat(reportData.total_expense) || 0,
        total_income: parseFloat(reportData.total_income) || 0,
        outstanding_amount: parseFloat(reportData.outstanding_amount) || 0,
      });
    } catch (err) {
      console.error("Dashboard API Error:", err);
    }
  };

  return (
    <div>
      <div style={styles.header}>
        <h2>Financial Dashboard</h2>
        <button style={styles.refreshBtn} onClick={fetchDashboardStats}>
          🔄 Refresh
        </button>
      </div>

      <div style={styles.cards}>
        <div style={styles.card}>
          <h4>Total Expenses</h4>
          <p>₹ {stats.total_expense}</p>
        </div>

        <div style={styles.card}>
          <h4>Total Income</h4>
          <p>₹ {stats.total_income}</p>
        </div>

        <div style={styles.card}>
          <h4>Outstanding Amount</h4>
          <p>₹ {stats.outstanding_amount}</p>
        </div>
      </div>

      <div style={styles.chart}>
        Chart Placeholder
      </div>
    </div>
  );
}

/* ✅ Styles Object (MUST be outside component) */
const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    paddingBottom: "20px",
    borderBottom: "2px solid #e0e0e0",
  },
  refreshBtn: {
    padding: "10px 20px",
    backgroundColor: "#27ae60",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "background-color 0.3s ease",
  },
  cards: {
    display: "flex",
    gap: "25px",
    marginTop: "20px",
    flexWrap: "wrap",
  },
  card: {
    backgroundColor: "#fff",
    padding: "25px",
    flex: 1,
    minWidth: "250px",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    textAlign: "center",
  },
  chart: {
    marginTop: "40px",
    padding: "40px",
    height: "250px",
    border: "2px dashed #bdc3c7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#7f8c8d",
    borderRadius: "8px",
    backgroundColor: "#f8f9fa",
  },
};

export default Dashboard;
