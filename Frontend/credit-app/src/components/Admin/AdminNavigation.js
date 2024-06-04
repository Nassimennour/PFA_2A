import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./custom.css";
import { AuthContext } from "../../contexts/AuthContext";

function AdminNavigation() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div>
      <nav>
        <div className="navbar">
          <div className="container nav-container">
            <input
              className="checkbox"
              type="checkbox"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
            />
            <div className="hamburger-lines">
              <span className="line line1"></span>
              <span className="line line2"></span>
              <span className="line line3"></span>
            </div>
            <div className="logo">
              <h1>Bienvenue!</h1>
            </div>
            <div className="menu-items">
              <li>
                <Link to="/admin/home" onClick={() => setIsChecked(false)}>
                  Page d'acceuil
                </Link>
              </li>
              <li>
                <Link to={`/admin/users`} onClick={() => setIsChecked(false)}>
                  Utilisateurs
                </Link>
              </li>
              <li>
                <Link
                  to={`/admin/organismes`}
                  onClick={() => setIsChecked(false)}
                >
                  Organismes de prêt
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  onClick={(e) => {
                    e.preventDefault();
                    logout();
                    navigate("/login");
                    setIsChecked(false);
                  }}
                >
                  Se déconnecter
                </Link>
              </li>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default AdminNavigation;
