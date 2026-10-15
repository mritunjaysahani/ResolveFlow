import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  const navigate = useNavigate();

  const loadComplaints = async () => {
    try {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (!token) {
        navigate("/login");
        return;
      }

      if (savedUser) {
        const user = JSON.parse(savedUser);
        if (user.role !== "admin") {
          navigate("/dashboard");
          return;
        }
      }

      const res = await axios.get("https://complaint-management-system-abw9.onrender.com/api/complaints", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(res.data)) {
        setComplaints(res.data);
      } else if (Array.isArray(res.data.complaints)) {
        setComplaints(res.data.complaints);
      } else {
        setComplaints([]);
      }
    } catch (error) {
      console.error("Error loading complaints:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const updateStatus = async (id, status) => {
    try {
      setStatusUpdatingId(id);
      const token = localStorage.getItem("token");

      await axios.put(
        `https://complaint-management-system-abw9.onrender.com/api/complaints/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      loadComplaints();
    } catch (error) {
      console.error("Status update error:", error);
      alert(error.response?.data?.message || "Status update failed");
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const deleteComplaint = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this complaint?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`https://complaint-management-system-abw9.onrender.com/api/complaints/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      loadComplaints();
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  // Safe statistics calculations
  const list = Array.isArray(complaints) ? complaints : [];
  const total = list.length;
  const pending = list.filter((c) => c && c.status === "Pending").length;
  const inProgress = list.filter((c) => c && c.status === "In Progress").length;
  const resolved = list.filter((c) => c && c.status === "Resolved").length;

  const filteredList = list.filter((item) => {
    const matchesFilter = activeFilter === "All" || item.status === activeFilter;
    const matchesSearch =
      searchQuery === "" ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="dashboard-layout">
      <Navbar />

      <main className="dashboard-content-container">
        
        {/* Admin Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "2rem"
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
              <span className="role-tag role-tag-admin">Administrator Control Center</span>
            </div>
            <h1 style={{ fontSize: "2.1rem", fontWeight: 800, color: "var(--text-dark)" }}>
              Admin Operations Dashboard
            </h1>
            <p style={{ fontSize: "0.95rem", color: "var(--text-muted)" }}>
              Audit grievance cases, assign status updates, and oversee community resolutions.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={loadComplaints}
              className="btn-nav-ghost"
              style={{ border: "1px solid var(--border-subtle)", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="stat-cards-grid">
          
          <div className="stat-metric-card">
            <div className="stat-metric-info">
              <h4>Total Cases</h4>
              <h2>{total}</h2>
            </div>
            <div className="stat-metric-icon" style={{ background: "#eff6ff", color: "#2563eb" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
          </div>

          <div className="stat-metric-card">
            <div className="stat-metric-info">
              <h4>Pending Review</h4>
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
              <h4>Resolved Cases</h4>
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

        {/* Filters and Management Section */}
        <div className="saas-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
            
            {/* Filter Tabs */}
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {["All", "Pending", "In Progress", "Resolved"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  style={{
                    padding: "0.45rem 1rem",
                    borderRadius: "var(--radius-full)",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    background: activeFilter === tab ? "var(--primary)" : "var(--bg-alt)",
                    color: activeFilter === tab ? "#ffffff" : "var(--text-sub)",
                    transition: "var(--transition)"
                  }}
                >
                  {tab} ({tab === "All" ? total : tab === "Pending" ? pending : tab === "In Progress" ? inProgress : resolved})
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div style={{ position: "relative", minWidth: "260px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-light)" }}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search by title, user, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="saas-input"
                style={{ paddingLeft: "2.5rem", paddingRight: "1rem", paddingTop: "0.5rem", paddingBottom: "0.5rem" }}
              />
            </div>

          </div>

          {/* Complaints Table/Cards */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "4rem" }}>
              <p style={{ color: "var(--text-muted)" }}>Loading records...</p>
            </div>
          ) : filteredList.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3.5rem 1rem" }}>
              <p style={{ color: "var(--text-muted)" }}>No complaints found matching this filter.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {filteredList.map((complaint) => (
                <div key={complaint._id} style={{
                  padding: "1.5rem",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  background: "#ffffff",
                  transition: "var(--transition)"
                }}>
                  
                  {/* Top Bar: Title, Category, Status */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "0.75rem" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                        <span className="badge-category">{complaint.category}</span>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-light)" }}>
                          ID: #{complaint._id?.slice(-6).toUpperCase()}
                        </span>
                      </div>
                      <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-dark)" }}>
                        {complaint.title}
                      </h3>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <span className={`status-pill ${
                        complaint.status === "Resolved"
                          ? "status-pill-resolved"
                          : complaint.status === "In Progress"
                          ? "status-pill-in-progress"
                          : "status-pill-pending"
                      }`}>
                        <span style={{
                          width: "7px",
                          height: "7px",
                          borderRadius: "50%",
                          background: complaint.status === "Resolved" ? "#10b981" : complaint.status === "In Progress" ? "#2563eb" : "#f59e0b"
                        }}></span>
                        {complaint.status}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{ fontSize: "0.92rem", color: "var(--text-sub)", lineHeight: 1.6, marginBottom: "1.2rem", whiteSpace: "pre-line" }}>
                    {complaint.description}
                  </p>

                  {/* Metadata and Admin Action Bar */}
                  <div style={{
                    paddingTop: "1rem",
                    borderTop: "1px solid var(--border-subtle)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "1rem"
                  }}>
                    {/* User info */}
                    <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.85rem", color: "var(--text-muted)", flexWrap: "wrap" }}>
                      <span>
                        <strong>Complainant:</strong> {complaint.user?.name || "Unknown"} ({complaint.user?.email || "No email"})
                      </span>
                      <span>
                        <strong>Logged:</strong> {complaint.createdAt ? new Date(complaint.createdAt).toLocaleString() : "Unknown"}
                      </span>
                    </div>

                    {/* Action Controls */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-sub)" }}>
                        Update Status:
                      </label>
                      <select
                        value={complaint.status || "Pending"}
                        disabled={statusUpdatingId === complaint._id}
                        onChange={(e) => updateStatus(complaint._id, e.target.value)}
                        className="saas-input"
                        style={{ padding: "0.35rem 0.75rem", fontSize: "0.85rem", width: "auto" }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>

                      <button
                        onClick={() => deleteComplaint(complaint._id)}
                        style={{
                          padding: "0.4rem 0.85rem",
                          borderRadius: "var(--radius-sm)",
                          background: "var(--status-danger-bg)",
                          color: "var(--status-danger)",
                          border: "1px solid var(--status-danger-border)",
                          fontWeight: 600,
                          fontSize: "0.82rem",
                          cursor: "pointer"
                        }}
                      >
                        Delete
                      </button>
                    </div>

                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

      </main>

      <Footer />
    </div>
  );
}

export default AdminDashboard;