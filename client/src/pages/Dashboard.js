import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token || !savedUser) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);

      // If user is admin, redirect to /admin
      if (parsedUser.role === "admin") {
        navigate("/admin");
        return;
      }

      // Fetch user's complaints
      const userId = parsedUser.id || parsedUser._id;
      if (userId) {
        axios.get(`https://complaint-management-system-abw9.onrender.com/api/complaints/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => {
          setComplaints(res.data.complaints || res.data || []);
        })
        .catch((err) => {
          console.error("Dashboard complaints fetch error:", err);
        })
        .finally(() => {
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const list = Array.isArray(complaints) ? complaints : [];
  const total = list.length;
  const pending = list.filter((c) => c.status === "Pending").length;
  const inProgress = list.filter((c) => c.status === "In Progress").length;
  const resolved = list.filter((c) => c.status === "Resolved").length;

  return (
    <div className="dashboard-layout">
      <Navbar />

      <main className="dashboard-content-container">
        
        {/* Welcome Banner */}
        <div style={{
          background: "linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)",
          borderRadius: "var(--radius-xl)",
          padding: "2.5rem 2rem",
          color: "#ffffff",
          boxShadow: "var(--shadow-lg)",
          marginBottom: "2.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.5rem"
        }}>
          <div>
            <span style={{
              display: "inline-block",
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(4px)",
              padding: "0.25rem 0.75rem",
              borderRadius: "var(--radius-full)",
              fontSize: "0.8rem",
              fontWeight: 600,
              marginBottom: "0.75rem"
            }}>
              Member Portal
            </span>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.4rem" }}>
              Welcome back, {user?.name || "Member"}!
            </h1>
            <p style={{ opacity: 0.9, fontSize: "0.95rem", maxWidth: "560px" }}>
              Track the progress of your grievances in real-time and lodge new requests whenever you need assistance.
            </p>
          </div>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link to="/create-complaint" style={{
              background: "#ffffff",
              color: "var(--primary)",
              padding: "0.75rem 1.4rem",
              borderRadius: "var(--radius-md)",
              fontWeight: 700,
              fontSize: "0.95rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              File Complaint
            </Link>

            <Link to="/complaints" style={{
              background: "rgba(255, 255, 255, 0.15)",
              color: "#ffffff",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              padding: "0.75rem 1.4rem",
              borderRadius: "var(--radius-md)",
              fontWeight: 600,
              fontSize: "0.95rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem"
            }}>
              View History
            </Link>

            <button
              onClick={handleLogout}
              style={{
                background: "rgba(239, 68, 68, 0.8)",
                color: "#ffffff",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                padding: "0.75rem 1.2rem",
                borderRadius: "var(--radius-md)",
                fontWeight: 600,
                fontSize: "0.95rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer"
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="stat-cards-grid">
          
          <div className="stat-metric-card">
            <div className="stat-metric-info">
              <h4>Total Filed</h4>
              <h2>{total}</h2>
            </div>
            <div className="stat-metric-icon" style={{ background: "#eff6ff", color: "#2563eb" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
          </div>

          <div className="stat-metric-card">
            <div className="stat-metric-info">
              <h4>Pending</h4>
              <h2>{pending}</h2>
            </div>
            <div className="stat-metric-icon" style={{ background: "#fffbeb", color: "#f59e0b" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
          </div>

          <div className="stat-metric-card">
            <div className="stat-metric-info">
              <h4>In Progress</h4>
              <h2>{inProgress}</h2>
            </div>
            <div className="stat-metric-icon" style={{ background: "#eff6ff", color: "#3b82f6" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
            </div>
          </div>

          <div className="stat-metric-card">
            <div className="stat-metric-info">
              <h4>Resolved</h4>
              <h2>{resolved}</h2>
            </div>
            <div className="stat-metric-icon" style={{ background: "#ecfdf5", color: "#10b981" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
          </div>

        </div>

        {/* Recent Complaints Section */}
        <div className="saas-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <div>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--text-dark)" }}>Your Recent Complaints</h2>
              <p style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>Recent tickets submitted through your account</p>
            </div>
            <Link to="/create-complaint" style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--primary)" }}>
              + New Complaint
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem" }}>
              <p style={{ color: "var(--text-muted)" }}>Loading your records...</p>
            </div>
          ) : list.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "3.5rem 1rem",
              background: "var(--bg-page)",
              borderRadius: "var(--radius-lg)",
              border: "1px dashed var(--border-subtle)"
            }}>
              <div style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "#eff6ff",
                color: "var(--primary)",
                margin: "0 auto 1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-dark)", marginBottom: "0.5rem" }}>
                No Complaints Filed Yet
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", maxWidth: "420px", margin: "0 auto 1.5rem" }}>
                Have an issue with facilities, courses, hostelling, or administration? Lodge a grievance to get it resolved.
              </p>
              <Link to="/create-complaint" className="btn-nav-primary">
                Lodge Your First Complaint
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {list.slice(0, 5).map((item) => (
                <div key={item._id} style={{
                  padding: "1.2rem",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1rem"
                }}>
                  <div style={{ flex: "1 1 300px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.35rem" }}>
                      <span className="badge-category">{item.category}</span>
                      <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-dark)" }}>
                        {item.title}
                      </h4>
                    </div>
                    <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineClamp: 2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {item.description}
                    </p>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-light)", marginTop: "0.4rem", display: "inline-block" }}>
                      Submitted {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
                    </span>
                  </div>

                  <div>
                    <span className={`status-pill ${
                      item.status === "Resolved"
                        ? "status-pill-resolved"
                        : item.status === "In Progress"
                        ? "status-pill-in-progress"
                        : "status-pill-pending"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}

              <div style={{ textAlign: "center", paddingTop: "1rem" }}>
                <Link to="/complaints" style={{ fontWeight: 600, color: "var(--primary)", fontSize: "0.92rem" }}>
                  View All ({total}) Complaints →
                </Link>
              </div>
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;