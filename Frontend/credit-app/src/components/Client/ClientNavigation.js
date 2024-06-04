import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./custom.css"; // Make sure the CSS file is in the same directory
import ClientProfile from "./ClientProfile";
import { AuthContext } from "../../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";

function ClientNavigation() {
  const { token, logout } = useContext(AuthContext);
  const [clientId, setClientId] = useState(null);
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const userId = jwtDecode(token).userId;

    fetch(`http://localhost:5000/clients/userId/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setClientId(data.id));
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
                <Link to="/client/profile" onClick={() => setIsChecked(false)}>
                  Mon profil
                </Link>
              </li>
              <li>
                {clientId && (
                  <Link
                    to={`/client/demandes-client/${clientId}`}
                    onClick={() => setIsChecked(false)}
                  >
                    Mes Demandes
                  </Link>
                )}
              </li>
              <li>
                <Link
                  to="/client/nouvelle-demande"
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

export default ClientNavigation;
