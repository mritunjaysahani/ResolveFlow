import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function ViewComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (!token || !savedUser) {
        navigate("/login");
        return;
      }

      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      const userId = parsedUser.id || parsedUser._id;

      // Admin fetches all, normal user fetches their own
      const endpoint = parsedUser.role === "admin"
        ? "https://complaint-management-system-abw9.onrender.com/api/complaints"
        : (userId ? `https://complaint-management-system-abw9.onrender.com/api/complaints/user/${userId}` : "https://complaint-management-system-abw9.onrender.com/api/complaints");

      const res = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setComplaints(res.data.complaints || res.data || []);
    } catch (error) {
      console.error("Fetch Complaints Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const updateStatus = async (id, status) => {
    try {
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

      fetchComplaints();
    } catch (error) {
      console.error("Update Status Error:", error);
      alert(error.response?.data?.message || "Failed to update complaint status");
    }
  };

  const deleteComplaint = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this complaint record?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`https://complaint-management-system-abw9.onrender.com/api/complaints/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchComplaints();
    } catch (error) {
      console.error("Delete Complaint Error:", error);
      alert(error.response?.data?.message || "Failed to delete complaint");
    }
  };

  const list = Array.isArray(complaints) ? complaints : [];

  const filteredList = list.filter((item) => {
    const matchesFilter = activeFilter === "All" || item.status === activeFilter;
    const matchesSearch =
      searchQuery === "" ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1, padding: "2.5rem 1.5rem", background: "var(--bg-page)" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
          
          {/* Header & Controls */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                <Link to={user?.role === "admin" ? "/admin" : "/dashboard"}>Dashboard</Link>
                <span>/</span>
                <span style={{ color: "var(--text-dark)", fontWeight: 600 }}>Grievance Records</span>
              </div>
              <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-dark)" }}>
                {user?.role === "admin" ? "All System Complaints" : "My Complaint History"}
              </h1>
              <p style={{ fontSize: "0.92rem", color: "var(--text-muted)" }}>
                {user?.role === "admin"
                  ? "Manage, update resolution statuses, and audit all filed tickets"
                  : "Track the real-time lifecycle and administrative updates of your filed tickets"}
              </p>
            </div>

            <Link to="/create-complaint" className="btn-nav-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              File New Complaint
            </Link>
          </div>

          {/* Search Bar & Filter Tabs */}
          <div className="saas-card" style={{ padding: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
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
                  {tab}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div style={{ position: "relative", minWidth: "240px", flex: "0 1 320px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-light)" }}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="saas-input"
                style={{ paddingLeft: "2.5rem", paddingRight: "1rem", paddingTop: "0.55rem", paddingBottom: "0.55rem" }}
              />
            </div>
          </div>

          {/* Complaints List */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "4rem" }}>
              <p style={{ color: "var(--text-muted)" }}>Loading records...</p>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="saas-card" style={{ textAlign: "center", padding: "4rem 1.5rem" }}>
              <div style={{ width: "54px", height: "54px", borderRadius: "50%", background: "#eff6ff", color: "var(--primary)", margin: "0 auto 1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-dark)", marginBottom: "0.4rem" }}>
                No Complaints Match Your Criteria
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", maxWidth: "380px", margin: "0 auto 1.5rem" }}>
                Try switching the filter tab or clearing your search keywords.
              </p>
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(""); setActiveFilter("All"); }}
                  className="btn-nav-ghost"
                  style={{ border: "1px solid var(--border-subtle)" }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {filteredList.map((item) => (
                <div key={item._id} className="saas-card" style={{ margin: 0, padding: "1.75rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
                        <span className="badge-category">{item.category}</span>
                        <span style={{ fontSize: "0.82rem", color: "var(--text-light)" }}>
                          • ID: {item._id?.slice(-6).toUpperCase()}
                        </span>
                      </div>
                      <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-dark)" }}>
                        {item.title}
                      </h2>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <span className={`status-pill ${
                        item.status === "Resolved"
                          ? "status-pill-resolved"
                          : item.status === "In Progress"
                          ? "status-pill-in-progress"
                          : "status-pill-pending"
                      }`}>
                        <span style={{
                          width: "7px",
                          height: "7px",
                          borderRadius: "50%",
                          background: item.status === "Resolved" ? "#10b981" : item.status === "In Progress" ? "#2563eb" : "#f59e0b"
                        }}></span>
                        {item.status}
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: "0.95rem", color: "var(--text-main)", lineHeight: 1.6, marginBottom: "1.25rem", whiteSpace: "pre-line" }}>
                    {item.description}
                  </p>

                  <div style={{
                    paddingTop: "1rem",
                    borderTop: "1px solid var(--border-subtle)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "1rem",
                    fontSize: "0.85rem",
                    color: "var(--text-muted)"
                  }}>
                    <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                      <span>
                        <strong>Filed By:</strong> {item.user?.name || "Member"} {item.user?.email ? `(${item.user.email})` : ""}
                      </span>
                      <span>
                        <strong>Submitted:</strong> {item.createdAt ? new Date(item.createdAt).toLocaleString() : "Recently"}
                      </span>
                    </div>

                    {/* Admin Actions */}
                    {user?.role === "admin" && (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <label style={{ fontWeight: 600, color: "var(--text-sub)", fontSize: "0.85rem" }}>
                          Status:
                        </label>
                        <select
                          value={item.status}
                          onChange={(e) => updateStatus(item._id, e.target.value)}
                          className="saas-input"
                          style={{ padding: "0.35rem 0.75rem", fontSize: "0.85rem", width: "auto" }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>

                        <button
                          onClick={() => deleteComplaint(item._id)}
                          style={{
                            padding: "0.4rem 0.8rem",
                            borderRadius: "var(--radius-sm)",
                            background: "var(--status-danger-bg)",
                            color: "var(--status-danger)",
                            border: "1px solid var(--status-danger-border)",
                            fontWeight: 600,
                            fontSize: "0.82rem"
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
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

export default ViewComplaints;