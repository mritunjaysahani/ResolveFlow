import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function CreateComplaint() {
  const [complaint, setComplaint] = useState({
    title: "",
    description: "",
    category: "Infrastructure",
    user: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token || !savedUser) {
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(savedUser);
      setComplaint((prev) => ({
        ...prev,
        user: user.id || user._id || "",
      }));
    } catch (error) {
      console.error("User data error:", error);
    }
  }, [navigate]);

  const handleChange = (e) => {
    setComplaint({
      ...complaint,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!complaint.user) {
      setErrorMessage("Please login first to submit a complaint");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "https://complaint-management-system-abw9.onrender.com/api/complaints",
        complaint,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage(res.data.message || "Complaint submitted successfully!");

      setComplaint((prev) => ({
        title: "",
        description: "",
        category: "Infrastructure",
        user: prev.user,
      }));

      setTimeout(() => {
        navigate("/complaints");
      }, 1200);

    } catch (err) {
      console.error("Complaint Error:", err);
      const msg = err.response?.data?.message || (err.request ? "Server is offline. Please start the backend." : "Unable to submit complaint.");
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1, padding: "3rem 1.5rem", background: "var(--bg-page)" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          
          {/* Breadcrumb Navigation */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
            <Link to="/dashboard">Dashboard</Link>
            <span>/</span>
            <span style={{ color: "var(--text-dark)", fontWeight: 600 }}>Create Complaint</span>
          </div>

          <div className="saas-card" style={{ padding: "2.5rem" }}>
            <div style={{ marginBottom: "2rem" }}>
              <span className="auth-badge">New Grievance Ticket</span>
              <h1 style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--text-dark)", marginBottom: "0.4rem" }}>
                Submit a Complaint
              </h1>
              <p style={{ fontSize: "0.92rem", color: "var(--text-muted)" }}>
                Provide precise details so the relevant authority can inspect and resolve your issue quickly.
              </p>
            </div>

            {errorMessage && (
              <div className="saas-alert saas-alert-error">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="saas-alert saas-alert-success">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              
              {/* Category Dropdown */}
              <div className="form-group">
                <label className="form-label" htmlFor="complaint-category">
                  Department / Category
                </label>
                <select
                  id="complaint-category"
                  name="category"
                  value={complaint.category}
                  onChange={handleChange}
                  className="saas-input"
                  style={{ paddingLeft: "1rem" }}
                  required
                >
                  <option value="Infrastructure">Infrastructure & Maintenance</option>
                  <option value="Academic">Academic & Examination</option>
                  <option value="Hostel">Hostel & Mess</option>
                  <option value="Technical">IT & Technical Support</option>
                  <option value="Administration">Administration & Fees</option>
                  <option value="Library">Library Services</option>
                  <option value="Other">Other / General</option>
                </select>
              </div>

              {/* Title */}
              <div className="form-group">
                <label className="form-label" htmlFor="complaint-title">
                  Subject / Title
                </label>
                <input
                  id="complaint-title"
                  type="text"
                  name="title"
                  placeholder="Brief summary of the issue (e.g. WiFi outage in Block B)"
                  value={complaint.title}
                  onChange={handleChange}
                  className="saas-input"
                  style={{ paddingLeft: "1rem" }}
                  required
                />
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label" htmlFor="complaint-desc">
                  Detailed Description
                </label>
                <textarea
                  id="complaint-desc"
                  name="description"
                  placeholder="Describe where, when, and how the problem occurred..."
                  value={complaint.description}
                  onChange={handleChange}
                  className="saas-input"
                  rows={5}
                  style={{ paddingLeft: "1rem", minHeight: "130px", resize: "vertical" }}
                  required
                />
              </div>

              {/* Submit Button */}
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={loading}
                  style={{ flex: 1 }}
                >
                  {loading ? "Submitting Ticket..." : "Submit Grievance"}
                </button>

                <Link
                  to="/dashboard"
                  style={{
                    padding: "0.85rem 1.5rem",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    color: "var(--text-sub)",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  Cancel
                </Link>
              </div>

            </form>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default CreateComplaint;