import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {

  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (

    <nav className="navbar">

      <div className="navbar-container">

       <NavLink to="/" className="navbar-logo">
  <svg viewBox="0 0 420 100" width="200" height="48" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="8" width="76" height="76" rx="18" fill="#7c3aed"/>
    <rect x="20" y="20" width="32" height="40" rx="4" fill="none" stroke="white" stroke-width="2"/>
    <rect x="20" y="20" width="32" height="40" rx="4" fill="white" opacity="0.15"/>
    <line x1="26" y1="31" x2="46" y2="31" stroke="white" stroke-width="2" stroke-linecap="round"/>
    <line x1="26" y1="38" x2="46" y2="38" stroke="white" stroke-width="2" stroke-linecap="round"/>
    <line x1="26" y1="45" x2="38" y2="45" stroke="white" stroke-width="2" stroke-linecap="round"/>
    <circle cx="54" cy="54" r="11" fill="#5b21b6" stroke="white" stroke-width="2.5"/>
    <circle cx="52" cy="52" r="6" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/>
    <line x1="56.5" y1="56.5" x2="61" y2="61" stroke="white" stroke-width="2.2" stroke-linecap="round"/>
    <text x="98" y="46" font-family="'Trebuchet MS', Arial, sans-serif" font-size="28" font-weight="700" fill="#1e293b" letter-spacing="-0.5">CareerMap</text>
    <rect x="98" y="52" width="44" height="3" rx="1.5" fill="#7c3aed"/>
    <text x="99" y="72" font-family="Arial, sans-serif" font-size="12" fill="#94a3b8" letter-spacing="2">Discover Jobs That Fit You</text>
  </svg>
</NavLink>

        <div className="navbar-menu">

          {/* HOME only before login */}
          {!user && (
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "navbar-link active-link" : "navbar-link"
              }
            >
              Home
            </NavLink>
          )}

          {/* USER LOGIN */}
          {user && !isAdmin && (
            <>
              <NavLink
                to="/exams"
                className={({ isActive }) =>
                  isActive ? "navbar-link active-link" : "navbar-link"
                }
              >
                Exams
              </NavLink>

              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? "navbar-link active-link" : "navbar-link"
                }
              >
                Dashboard
              </NavLink>
            </>
          )}

          {/* ADMIN LOGIN */}
          {user && isAdmin && (
            <>
              <NavLink
                to="/exams"
                className={({ isActive }) =>
                  isActive ? "navbar-link active-link" : "navbar-link"
                }
              >
                Exams
              </NavLink>

              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  isActive ? "navbar-link active-link" : "navbar-link"
                }
              >
                Admin Panel
              </NavLink>
            </>
          )}

          {user ? (
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          ) : (
            <>
              <NavLink to="/login" className="btn btn-secondary">
                Login
              </NavLink>

              <NavLink to="/register" className="btn btn-primary">
                Register
              </NavLink>
            </>
          )}

        </div>

      </div>

    </nav>

  );

};

export default Navbar;