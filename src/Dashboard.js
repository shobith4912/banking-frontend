import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const API_URL = "https://banking-backend-nobi.onrender.com";

// ================= FOOTER =================
const Footer = () => {
  return (
    <div style={footerStyles.container}>
      <p>Designed & Developed by</p>
      <strong>Kommaddi Shobith</strong>
    </div>
  );
};

function Dashboard() {
  const [amount, setAmount] = useState("");
  const [receiverAccount, setReceiverAccount] = useState("");
  const [userId, setUserId] = useState("");
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [accountNumber, setAccountNumber] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 Token check
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again");
      window.location.href = "/";
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
    } catch {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  }, []);

  // 📡 Fetch user
  const fetchUser = async (id) => {
    try {
      const res = await fetch(`${API_URL}/user/${id}`);
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to load user");
        return;
      }

      setBalance(data.balance || 0);
      setTransactions(data.transactions || []);
      setAccountNumber(data.accountNumber || "");

    } catch {
      alert("Failed to load user data");
    }
  };

  useEffect(() => {
    if (userId) fetchUser(userId);
  }, [userId]);

  // 💰 Deposit
  const handleDeposit = async () => {
    if (!amount || Number(amount) <= 0) {
      alert("Enter valid amount");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/deposit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, amount: Number(amount) }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Deposit failed");
        return;
      }

      setBalance(data.balance);
      setTransactions(data.transactions);
      setAmount("");

    } catch {
      alert("Deposit failed");
    } finally {
      setLoading(false);
    }
  };

  // 💸 Withdraw
  const handleWithdraw = async () => {
    if (!amount || Number(amount) <= 0) {
      alert("Enter valid amount");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/withdraw`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, amount: Number(amount) }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Withdraw failed");
        return;
      }

      setBalance(data.balance);
      setTransactions(data.transactions);
      setAmount("");

    } catch {
      alert("Withdraw failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Transfer
  const handleTransfer = async () => {
    if (!receiverAccount || !amount || Number(amount) <= 0) {
      alert("Enter valid details");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/transfer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromId: userId,
          toAccountNumber: receiverAccount,
          amount: Number(amount),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Transfer failed");
        return;
      }

      setBalance(data.balance);
      setTransactions(data.transactions);
      setAmount("");
      setReceiverAccount("");

    } catch {
      alert("Transfer failed");
    } finally {
      setLoading(false);
    }
  };

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <>
      <div style={styles.container}>
        <div style={styles.card}>
          <h1>🏦 Banking Dashboard</h1>

          <p style={styles.account}>
            Account No: <strong>{accountNumber}</strong>
          </p>

          <h2 style={styles.balance}>₹ {balance}</h2>

          <input
            style={styles.input}
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <div>
            <button style={styles.deposit} onClick={handleDeposit} disabled={loading}>
              {loading ? "Processing..." : "Deposit"}
            </button>

            <button style={styles.withdraw} onClick={handleWithdraw} disabled={loading}>
              {loading ? "Processing..." : "Withdraw"}
            </button>
          </div>

          <hr />

          <input
            style={styles.input}
            placeholder="Receiver Account Number"
            value={receiverAccount}
            onChange={(e) => setReceiverAccount(e.target.value)}
          />

          <button style={styles.transfer} onClick={handleTransfer} disabled={loading}>
            {loading ? "Processing..." : "Send Money"}
          </button>

          <button style={styles.logout} onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div style={styles.transactions}>
          <h3>Transactions</h3>

          {transactions.length === 0 ? (
            <p>No transactions yet</p>
          ) : (
            transactions.map((t, i) => (
              <div key={i} style={styles.transactionItem}>
                <span>{t.type}</span>
                <span>₹{t.amount}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 🔥 FOOTER */}
      <Footer />
    </>
  );
}

// ================= STYLES =================
const styles = {
  container: {
    display: "flex",
    justifyContent: "space-around",
    padding: "50px",
    background: "linear-gradient(to right, #667eea, #764ba2)",
    minHeight: "100vh",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 0 15px rgba(0,0,0,0.2)",
    textAlign: "center",
    width: "320px",
  },
  account: {
    fontSize: "14px",
    color: "#555",
  },
  balance: {
    color: "green",
    fontSize: "32px",
  },
  input: {
    padding: "10px",
    width: "85%",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  deposit: {
    background: "green",
    color: "#fff",
    padding: "10px",
    margin: "5px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  withdraw: {
    background: "red",
    color: "#fff",
    padding: "10px",
    margin: "5px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  transfer: {
    background: "#667eea",
    color: "#fff",
    padding: "10px",
    marginTop: "10px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  logout: {
    marginTop: "15px",
    background: "#333",
    color: "#fff",
    padding: "8px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  transactions: {
    width: "300px",
  },
  transactionItem: {
    display: "flex",
    justifyContent: "space-between",
    background: "#fff",
    padding: "10px",
    marginBottom: "8px",
    borderRadius: "6px",
    boxShadow: "0 0 5px rgba(0,0,0,0.1)",
  },
};

// ================= FOOTER STYLES =================
const footerStyles = {
  container: {
    position: "fixed",
    bottom: "10px",
    right: "15px",
    textAlign: "right",
    fontSize: "12px",
    color: "#fff",
    background: "rgba(0,0,0,0.6)",
    padding: "6px 10px",
    borderRadius: "8px",
    boxShadow: "0 0 5px rgba(0,0,0,0.2)",
  },
};

export default Dashboard;