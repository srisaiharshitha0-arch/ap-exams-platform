import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./HomePage.css";

const HomePage = () => {

  const { user } = useAuth();

  if (user) {
    return <Navigate to="/jobs" />;
  }

  const features = [
    {
      title: "All Jobs in One Place",
      description: "Find Government and Private job opportunities including IT, Banking, Railways, Police and more."
    },
    {
      title: "Official & Trusted Links",
      description: "Every job or exam redirects you to the official website for safe and secure applications."
    },
    {
      title: "Quick & Easy Search",
      description: "Search and filter jobs easily by category, company or job type without confusion."
    }
  ];

  return (
    <div className="home-page">

      <div className="announcement-bar">
        <div className="announcement-track">
          <span>Latest Updates: IT Jobs | Banking Jobs | Railway Recruitment | Police Jobs | Teaching Jobs | Private Jobs</span>
          <span>Latest Updates: IT Jobs | Banking Jobs | Railway Recruitment | Police Jobs | Teaching Jobs | Private Jobs</span>
        </div>
      </div>

      <div className="container">

        <section className="hero-section">
          <div className="homepage-header">
            <span className="hero-badge">All Jobs & Exams Portal</span>

            <h1 className="homepage-title">
              Find Your  Job Opportunity Easily
            </h1>

            <p className="homepage-subtitle">
              Discover Government and Private jobs including IT, Banking, Railways,
              Police, Teaching and more — all in one place with official application links.
            </p>
          </div>

          <div className="hero-stats">
            <div className="stat-card"><h3>All Categories</h3><p>Jobs & Exams</p></div>
            <div className="stat-card"><h3>100%</h3><p>Official Links</p></div>
            <div className="stat-card"><h3>Fast</h3><p>Job Discovery</p></div>
          </div>
        </section>

        <section className="home-section">
          <div className="section-header">
            <h2>Why Use This Platform?</h2>
            <p>A simple and powerful platform to discover job opportunities faster without searching multiple websites.</p>
          </div>

          <div className="features-grid">
            {features.map((item) => (
              <div key={item.title} className="feature-card">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </section>

      </div>

      <footer className="footer">
        <div className="footer-container">

          <div className="footer-left">
            <h3>Job Portal</h3>
            <p>
              A unified platform to explore Government and Private job opportunities
              and access official application websites in one place.
            </p>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li>Home</li>
              <li>Login</li>
              <li>Register</li>
            </ul>
          </div>

          <div className="footer-info">
            <h4>Information</h4>
            <p>
              This website does not host job notifications. It only provides links
              to official recruitment websites.
            </p>
          </div>

          <div className="footer-contact">
            <h4>Contact Us</h4>
            <p>Have a query? Reach out to us:</p>
            <a href="mailto:srisaiharshitha0@gmail.com" className="footer-email">
              srisaiharshitha0@gmail.com
            </a>
          </div>

        </div>

        <div className="footer-bottom">© 2026 Job Portal</div>
      </footer>

    </div>
  );
};

export default HomePage;