import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./HomePage.css";

const HomePage = () => {

  const { user } = useAuth();

  if (user) {
    return <Navigate to="/exams" />;
  }

  const features = [
    {
      title: "Easy Navigation",
      description: "Find Andhra Pradesh government exam categories quickly in one place."
    },
    {
      title: "Official Sources",
      description: "Every exam card redirects users to the official government recruitment website."
    },
    {
      title: "User Friendly",
      description: "Clean interface designed to help users explore exam opportunities easily."
    }
  ];

  return (
    <div className="home-page">

      <div className="announcement-bar">
        <div className="announcement-track">
          <span>Latest Updates: APPSC Notifications | Police Recruitment | Teaching Exams | Banking Exams | Official Government Links</span>
          <span>Latest Updates: APPSC Notifications | Police Recruitment | Teaching Exams | Banking Exams | Official Government Links</span>
        </div>
      </div>

      <div className="container">

        <section className="hero-section">
          <div className="homepage-header">
            <span className="hero-badge">Andhra Pradesh Government Exams</span>
            <h1 className="homepage-title">Welcome to AP Job Exams Portal</h1>
            <p className="homepage-subtitle">
              Discover Andhra Pradesh government exam categories in one place
              and easily access official recruitment websites.
            </p>
          </div>

          <div className="hero-stats">
            <div className="stat-card"><h3>Official</h3><p>Government Sources</p></div>
            <div className="stat-card"><h3>100%</h3><p>Verified Links</p></div>
            <div className="stat-card"><h3>Fast</h3><p>Exam Discovery</p></div>
          </div>
        </section>

        <section className="home-section">
          <div className="section-header">
            <h2>Why Use This Platform?</h2>
            <p>A simple portal created to help students discover government exam categories faster and easier.</p>
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
            <h3>AP Exams Portal</h3>
            <p>A platform to explore Andhra Pradesh government exam categories and access official recruitment websites in one place.</p>
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
            <p>This website does not host recruitment notifications. It only provides links to official government websites.</p>
          </div>
          <div className="footer-contact">
            <h4>Contact Us</h4>
            <p>Have a query? Reach out to us:</p>
            <a href="mailto:srisaiharshitha0@gmail.com" className="footer-email">
              srisaiharshitha0@gmail.com
            </a>
          </div>
        </div>
        <div className="footer-bottom">© 2026 AP Exams Portal</div>
      </footer>

    </div>
  );
};

export default HomePage;