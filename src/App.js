import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import "./styles.css";

// ================= AUTH PAGE =================
function AuthPage() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const API_URL = "http://localhost:5001";

  // ================= REGISTER =================
  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("All fields are required");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      console.log("REGISTER RESPONSE:", data);

      if (!res.ok) {
        alert(data.message || data.error || "Registration failed");
        return;
      }

      // ✅ SUCCESS
      alert(
        `✅ Account Created Successfully!\n\n🏦 Account Number: ${data.accountNumber}`
      );

      // auto switch to login
      setIsLogin(true);

    } catch (err) {
      console.error(err);
      alert("Server error while registering");
    }
  };

  // ================= LOGIN =================
  const handleLogin = async () => {
    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("LOGIN RESPONSE:", data);

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // ✅ store token
      localStorage.setItem("token", data.token);

      alert("✅ Login successful");

      // ✅ proper navigation (NO reload)
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      alert("Server error during login");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>🏦 Banking System</h1>

        <button
          style={styles.switchBtn}
          onClick={() => setIsLogin(!isLogin)}
        >
          Switch to {isLogin ? "Register" : "Login"}
        </button>

        {isLogin ? (
          <>
            <h2>Login</h2>

            <input
              style={styles.input}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              style={styles.input}
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button style={styles.primaryBtn} onClick={handleLogin}>
              Login
            </button>
          </>
        ) : (
          <>
            <h2>Register</h2>

            <input
              style={styles.input}
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
            />

            <input
              style={styles.input}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              style={styles.input}
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button style={styles.primaryBtn} onClick={handleRegister}>
              Register
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ================= STYLES =================
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f4f6f8",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 0 15px rgba(0,0,0,0.1)",
    textAlign: "center",
    width: "320px",
  },
  input: {
    width: "90%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  primaryBtn: {
    width: "100%",
    padding: "10px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  switchBtn: {
    marginBottom: "15px",
    background: "#eee",
    padding: "6px",
    border: "none",
    cursor: "pointer",
  },
};

// ================= MAIN APP =================
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;