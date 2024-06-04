import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./custom.css";
import { AuthContext } from "../../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";

function CourtierNavigation() {
  const { token, logout } = useContext(AuthContext);
  const [courtierId, setCourtierId] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = jwtDecode(token).userId;

    fetch(`http://localhost:5000/courtiers/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setCourtierId(data.id));
  }, [token]);

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
                <Link
                  to="/courtier/profile"
                  onClick={() => setIsChecked(false)}
                >
                  Mon Profil
                </Link>
              </li>
              <li>
                {courtierId && (
                  <Link
                    to={`/courtier/demandes-courtier/${courtierId}`}
                    onClick={() => setIsChecked(false)}
                  >
                    Liste des Demandes
                  </Link>
                )}
              </li>
              <li>
                <Link
                  to={`/courtier/nouvelle-demande/${courtierId}`}
                  onClick={() => setIsChecked(false)}
                >
                  Nouvelle demande
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

export default CourtierNavigation;
