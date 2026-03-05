import { useEffect, useState } from "react";
import http from "../services/http";
import { useDarkMode } from "../contexts/DarkModeContext";

function Dashboard() {
  const { isDarkMode } = useDarkMode();

  const [stats, setStats] = useState({
    total_expense: 0,
    total_income: 0,
    outstanding_amount: 0,
  });

  const [trend, setTrend] = useState({
    monthly_income: [],
    monthly_expense: [],
  });

  const [categoryDist, setCategoryDist] = useState([]);

  useEffect(() => {
    fetchDashboardStats();
    fetchTrend();
    fetchCategory();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await http.get("/reports/dashboard-summary");
      const data = res.data.data || res.data;
      setStats({
        total_expense: parseFloat(data.total_expense) || 0,
        total_income: parseFloat(data.total_income) || 0,
        outstanding_amount: parseFloat(data.total_outstanding) || 0,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTrend = async () => {
    try {
      const res = await http.get("/reports/dashboard-trend");
      setTrend(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategory = async () => {
    try {
      const res = await http.get("/reports/expense-category-distribution");
      setCategoryDist(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{
        background: isDarkMode ? "#121212" : "#f9fafc",
        minHeight: "100vh",
        padding: "40px 20px",
        transition: "0.3s",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h2
          style={{
            textAlign: "center",
            fontSize: "2rem",
            fontWeight: 800,
            marginBottom: 40,
            color: isDarkMode ? "#fff" : "#222",
          }}
        >
          Dashboard Overview
        </h2>

        {/* SUMMARY CARDS */}
        <div style={styles.cardWrapper}>
          {[
            {
              icon: "💸",
              label: "Total Expenses",
              value: stats.total_expense,
              light: "linear-gradient(135deg,#ffebee,#ffcdd2)",
              dark: "#2a1f1f",
              color: "#ef5350",
            },
            {
              icon: "💰",
              label: "Total Income",
              value: stats.total_income,
              light: "linear-gradient(135deg,#e8f5e9,#b2dfdb)",
              dark: "#1f2a24",
              color: "#66bb6a",
            },
            {
              icon: "🧾",
              label: "Outstanding Amount",
              value: stats.outstanding_amount,
              light: "linear-gradient(135deg,#fff3e0,#ffe0b2)",
              dark: "#2a251f",
              color: "#ffa726",
            },
          ].map((card, i) => (
            <div
              key={i}
              style={{
                ...styles.card,
                background: isDarkMode ? card.dark : card.light,
                color: isDarkMode ? "#fff" : card.color,
              }}
            >
              <div style={{ fontSize: "2.2em" }}>{card.icon}</div>
              <div style={{ fontWeight: 700, marginTop: 10 }}>
                {card.label}
              </div>
              <div style={{ fontSize: "1.6em", marginTop: 8 }}>
                ₹ {card.value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* MONTHLY TREND */}
        <h3 style={{ color: isDarkMode ? "#fff" : "#222", marginTop: 50 }}>
          Monthly Trend
        </h3>

        <div style={styles.trendWrapper}>
          {[
            {
              title: "Income",
              data: trend.monthly_income,
              color: "#4caf50",
            },
            {
              title: "Expense",
              data: trend.monthly_expense,
              color: "#f44336",
            },
          ].map((section, i) => (
            <div
              key={i}
              style={{
                ...styles.trendCard,
                background: isDarkMode ? "#1e1e1e" : "#fff",
                color: isDarkMode ? "#fff" : "#333",
              }}
            >
              <h4>{section.title}</h4>
              {section.data.length === 0 ? (
                <div>No data</div>
              ) : (
                section.data.map((m) => {
                  const max = Math.max(
                    ...section.data.map((x) => x.total),
                    1
                  );
                  return (
                    <div key={m.month} style={styles.barRow}>
                      <span>{m.month}</span>
                      <div
                        style={{
                          ...styles.barTrack,
                          background: isDarkMode ? "#333" : "#eee",
                        }}
                      >
                        <div
                          style={{
                            ...styles.bar,
                            width: `${(m.total / max) * 100}%`,
                            background: section.color,
                          }}
                        />
                      </div>
                      <span>₹{m.total}</span>
                    </div>
                  );
                })
              )}
            </div>
          ))}
        </div>

        {/* CATEGORY DISTRIBUTION */}
        <h3 style={{ color: isDarkMode ? "#fff" : "#222", marginTop: 50 }}>
          Expense Category Distribution
        </h3>

        <div style={styles.categoryWrapper}>
          {categoryDist.length === 0 ? (
            <div>No data</div>
          ) : (
            categoryDist.map((c) => {
              const max = Math.max(
                ...categoryDist.map((x) => x.total),
                1
              );
              return (
                <div
                  key={c.category}
                  style={{
                    ...styles.categoryCard,
                    background: isDarkMode ? "#1e1e1e" : "#fff",
                    color: isDarkMode ? "#fff" : "#222",
                  }}
                >
                  <strong>{c.category}</strong>
                  <div
                    style={{
                      ...styles.categoryTrack,
                      background: isDarkMode ? "#333" : "#eee",
                    }}
                  >
                    <div
                      style={{
                        ...styles.categoryBar,
                        width: `${(c.total / max) * 100}%`,
                      }}
                    />
                  </div>
                  <span>₹{c.total}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

/* STYLES */
const styles = {
  cardWrapper: {
    display: "flex",
    gap: 30,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  card: {
    flex: "1 1 250px",
    minWidth: 250,
    padding: 30,
    borderRadius: 20,
    textAlign: "center",
    transition: "0.3s",
  },
  trendWrapper: {
    display: "flex",
    gap: 30,
    flexWrap: "wrap",
  },
  trendCard: {
    flex: "1 1 300px",
    padding: 20,
    borderRadius: 15,
  },
  barRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  barTrack: {
    flex: 1,
    height: 10,
    borderRadius: 6,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    borderRadius: 6,
  },
  categoryWrapper: {
    display: "flex",
    flexWrap: "wrap",
    gap: 20,
  },
  categoryCard: {
    flex: "1 1 220px",
    padding: 20,
    borderRadius: 15,
  },
  categoryTrack: {
    height: 8,
    borderRadius: 6,
    margin: "10px 0",
    overflow: "hidden",
  },
  categoryBar: {
    height: "100%",
    background: "#ffb300",
  },
};

export default Dashboard;