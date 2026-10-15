import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(`/#${id}`);
    }
  };

  return (
    <nav className="saas-nav">
      <div className="saas-nav-container">
        {/* Project Logo */}
        <Link to="/" className="saas-logo">
          <div className="saas-logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
          </div>
          <span>Resolve<strong style={{ color: "var(--primary)" }}>Flow</strong></span>
        </Link>

        {/* Navigation Links */}
        <ul className={`saas-nav-links ${mobileMenuOpen ? "mobile-open" : ""}`}>
          <li>
            <a href="#hero" onClick={(e) => { e.preventDefault(); scrollToSection("hero"); }}>
              Home
            </a>
          </li>
          <li>
            <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection("features"); }}>
              Features
            </a>
          </li>
          <li>
            <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollToSection("how-it-works"); }}>
              How It Works
            </a>
          </li>
          {token && user && (
            <li>
              <Link
                to={user.role === "admin" ? "/admin" : "/dashboard"}
                onClick={() => setMobileMenuOpen(false)}
                style={{ fontWeight: 600, color: "var(--primary)" }}
              >
                Dashboard
              </Link>
            </li>
          )}
        </ul>

        {/* Nav Action Buttons */}
        <div className="saas-nav-actions">
          {token && user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
                Hi, <strong>{user.name}</strong>
              </span>
              <button onClick={handleLogout} className="btn-nav-ghost">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-nav-ghost">
                Sign In
              </Link>
              <Link to="/register" className="btn-nav-primary">
                Register
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </>
          )}

          {/* Mobile hamburger button */}
          <button
            className="saas-nav-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
