import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const res = await axios.post(
        "https://complaint-management-system-abw9.onrender.com/api/auth/login",
        {
          email,
          password,
        }
      );

      setSuccessMessage(res.data.message || "Login Successful! Redirecting...");

      // Save JWT token
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      // Save user information
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      // Redirect based on role
      setTimeout(() => {
        if (res.data.user?.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }, 700);

    } catch (err) {
      console.error("Login failed:", err);
      const msg = err.response?.data?.message || (err.request ? "Backend server is unreachable. Please ensure the server is running." : "Login failed. Please check your credentials.");
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* 1. Modern Responsive Navigation Bar */}
      <Navbar />

      {/* 2. Hero Section with Split Layout */}
      <section id="hero" className="saas-hero-section">
        <div className="saas-hero-container">
          
          {/* Left Column: Project Introduction & Highlights */}
          <div className="hero-content">
            <div className="hero-pill">
              <span className="hero-pill-dot"></span>
              Official Grievance Redressal Portal
            </div>

            <h1 className="hero-title">
              Your Voice Matters. <br />
              <span className="hero-title-highlight">We Make It Heard.</span>
            </h1>

            <p className="hero-subtitle">
              A centralized, transparent platform engineered to bridge communication between users and administration. Submit issues, track resolutions live, and experience true accountability.
            </p>

            {/* Feature Highlights Checklist */}
            <div className="hero-features-list">
              <div className="hero-feature-item">
                <div className="hero-feature-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="hero-feature-text">
                  <strong>Easy Complaint Submission</strong> — File grievances in seconds with categorized departments and structured descriptions.
                </div>
              </div>

              <div className="hero-feature-item">
                <div className="hero-feature-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="hero-feature-text">
                  <strong>Real-Time Status Tracking</strong> — Instant visibility through Pending, In Progress, and Resolved lifecycle stages.
                </div>
              </div>

              <div className="hero-feature-item">
                <div className="hero-feature-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="hero-feature-text">
                  <strong>Transparent Resolution</strong> — Direct administrative feedback, authenticated updates, and complete accountability.
                </div>
              </div>
            </div>

            {/* Quick Metrics / Trust Bar */}
            <div className="hero-stats-bar">
              <div className="hero-stat-item">
                <h4>100%</h4>
                <p>Digital Redressal</p>
              </div>
              <div className="hero-stat-item">
                <h4>24/7</h4>
                <p>Status Tracking</p>
              </div>
              <div className="hero-stat-item">
                <h4>&lt; 48 hrs</h4>
                <p>Avg. First Action</p>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Modern Login Card */}
          <div className="auth-card-wrapper">
            <div className="auth-card-backdrop"></div>
            
            <div className="auth-card">
              <div className="auth-card-header">
                <span className="auth-badge">Secure Portal Access</span>
                <h2 className="auth-card-title">Welcome Back</h2>
                <p className="auth-card-subtitle">Sign in to manage and track your complaints</p>
              </div>

              {/* Error / Success Feedback */}
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

              {/* Working Login Form */}
              <form onSubmit={handleLogin} className="auth-form">
                
                {/* Email Field */}
                <div className="form-group">
                  <label className="form-label" htmlFor="login-email">
                    Email Address
                  </label>
                  <div className="input-with-icon">
                    <span className="input-icon-left">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </span>
                    <input
                      id="login-email"
                      type="email"
                      className="saas-input"
                      placeholder="name@organization.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password Field with Visibility Toggle */}
                <div className="form-group">
                  <div className="form-label">
                    <label htmlFor="login-password">Password</label>
                    <Link to="/forgot-password">Forgot Password?</Link>
                  </div>
                  <div className="input-with-icon">
                    <span className="input-icon-left">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      className="saas-input"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      style={{ paddingRight: "2.75rem" }}
                    />
                    <button
                      type="button"
                      className="input-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        /* Eye Slash */
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        /* Eye */
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 1s linear infinite" }}>
                        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                        <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                        <path d="M12 2a10 10 0 0 1 10 10" />
                      </svg>
                      Authenticating...
                    </>
                  ) : (
                    <>
                      Sign In
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </>
                  )}
                </button>

              </form>

              {/* Footer Switcher */}
              <div className="auth-footer">
                Don't have an account?{" "}
                <Link to="/register" style={{ fontWeight: 700, color: "var(--primary)" }}>
                  Create an Account
                </Link>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 3. Three Feature Cards (Submit, Track, Resolve) */}
      <section id="features" className="saas-features-section">
        <div className="section-header">
          <span className="section-tag">Core Capabilities</span>
          <h2 className="section-title">Designed for Fast & Fair Resolutions</h2>
          <p className="section-desc">
            Empowering students, employees, and community members with an intuitive three-step lifecycle.
          </p>
        </div>

        <div className="features-grid">
          
          {/* Card 1: Submit */}
          <div className="feature-card">
            <div className="feature-card-icon icon-blue">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </div>
            <h3>1. Submit</h3>
            <p>
              Lodge your grievance effortlessly with structured categories (Academic, Hostel, Infrastructure, Technical) and detailed explanations.
            </p>
            <span className="feature-tag-badge" style={{ background: "#eff6ff", color: "#2563eb" }}>
              Instant Lodging
            </span>
          </div>

          {/* Card 2: Track */}
          <div className="feature-card">
            <div className="feature-card-icon icon-amber">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h3>2. Track</h3>
            <p>
              Monitor the exact real-time progress of your case as it transitions through Pending review and Active Investigation with full audit trails.
            </p>
            <span className="feature-tag-badge" style={{ background: "#fffbeb", color: "#b45309" }}>
              Live Status Updates
            </span>
          </div>

          {/* Card 3: Resolve */}
          <div className="feature-card">
            <div className="feature-card-icon icon-emerald">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3>3. Resolve</h3>
            <p>
              Get verified closures from assigned department authorities with actionable outcomes and transparent closing remarks.
            </p>
            <span className="feature-tag-badge" style={{ background: "#ecfdf5", color: "#047857" }}>
              Verified Closure
            </span>
          </div>

        </div>
      </section>

      {/* 4. How It Works Section */}
      <section id="how-it-works" className="saas-how-section">
        <div className="section-header">
          <span className="section-tag">User Journey</span>
          <h2 className="section-title">How It Works in 4 Steps</h2>
          <p className="section-desc">
            Simple, streamlined redressal process from registration to permanent resolution.
          </p>
        </div>

        <div className="how-grid">
          <div className="how-step-card">
            <div className="how-step-number">01</div>
            <h4>Create an Account</h4>
            <p>Sign up securely with your email and name to receive your personal tracking portal.</p>
          </div>

          <div className="how-step-card">
            <div className="how-step-number">02</div>
            <h4>File Your Complaint</h4>
            <p>Specify the topic, department, and detailed problem statement in a few simple clicks.</p>
          </div>

          <div className="how-step-card">
            <div className="how-step-number">03</div>
            <h4>Admin Action</h4>
            <p>Designated administrators review, categorize, and transition status to In Progress.</p>
          </div>

          <div className="how-step-card">
            <div className="how-step-number">04</div>
            <h4>Final Resolution</h4>
            <p>Issue is resolved with verified status updates visible on your complaint history.</p>
          </div>
        </div>
      </section>

      {/* 5. Professional Footer */}
      <Footer />
    </div>
  );
}

export default Login;