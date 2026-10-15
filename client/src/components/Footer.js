import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="saas-footer">
      <div className="saas-footer-container">
        {/* Brand Column */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <div className="saas-logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
            </div>
            <span>ResolveFlow</span>
          </Link>
          <p className="footer-desc">
            Next-generation Complaint Management System designed for institutions and enterprises. Transparent, fast, and accountable issue resolution.
          </p>
        </div>

        {/* Product Column */}
        <div className="footer-col">
          <h4>Platform</h4>
          <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><Link to="/create-complaint">Submit Complaint</Link></li>
            <li><Link to="/complaints">Track Status</Link></li>
          </ul>
        </div>

        {/* Access Column */}
        <div className="footer-col">
          <h4>Account</h4>
          <ul>
            <li><Link to="/login">Sign In</Link></li>
            <li><Link to="/register">Create Account</Link></li>
            <li><Link to="/forgot-password">Reset Password</Link></li>
            <li><Link to="/admin">Admin Portal</Link></li>
          </ul>
        </div>

        {/* Support & Legal Column */}
        <div className="footer-col">
          <h4>Support & Legal</h4>
          <ul>
            <li><a href="mailto:support@resolveflow.com">Help & Support</a></li>
            <li><a href="#privacy" onClick={(e) => { e.preventDefault(); alert("Privacy Policy: Your grievance data and personal identity are encrypted and handled with strict confidentiality under modern data governance standards."); }}>Privacy Policy</a></li>
            <li><a href="#terms" onClick={(e) => { e.preventDefault(); alert("Terms of Service: Users must provide accurate issue details without abusive content."); }}>Terms of Service</a></li>
            <li><a href="mailto:contact@resolveflow.com">Contact Us</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Complaint Management System (ResolveFlow). All rights reserved.</p>
        <div className="footer-legal-links">
          <a href="#privacy" onClick={(e) => { e.preventDefault(); alert("Privacy: All user records and submitted data are strictly confidential."); }}>Privacy</a>
          <a href="#terms" onClick={(e) => { e.preventDefault(); alert("Terms: Please abide by campus and organization acceptable use standards."); }}>Terms</a>
          <a href="mailto:help@resolveflow.com">Contact</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
