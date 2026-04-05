import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import "./AuthPages.css";

const LoginPage = () => {

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {

      toast.success("Login successful!");

      // LOGIN AYAKA EXAMS PAGE KI VELTUNDI
      navigate("/exams");

    } else {

      toast.error(result.error);

    }

    setLoading(false);

  };

  return (

    <div className="auth-container">

      <div className="auth-card">

        <h2 className="auth-title">Login to Your Account</h2>

        <form onSubmit={handleSubmit} className="auth-form">

          <div className="form-group">

            <label className="form-label">Email Address</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
            />

          </div>

          <div className="form-group">

            <label className="form-label">Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              required
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary auth-submit"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="auth-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>

      </div>

    </div>

  );

};

export default LoginPage;