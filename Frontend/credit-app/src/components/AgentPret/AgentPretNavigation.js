import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";
import "./custom.css";
import axios from "axios";

function AgentPretNavigation() {
  const { token, logout } = useContext(AuthContext);
  const [agentPretId, setAgentPretId] = useState(null);
  const [organismePretId, setOrganismePretId] = useState(null);
  const [isChecked, setIsChecked] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const { userId } = jwtDecode(token);
    axios
      .get(`http://localhost:5000/agentsprets/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setAgentPretId(response.data.id);
        setOrganismePretId(response.data.organismePretId);
        console.log("OrganismePretId = ", response.data.organismePretId);
      });
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
                <Link to="/agent/profile" onClick={() => setIsChecked(false)}>
                  Mon Profil
                </Link>
              </li>
              <li>
                {organismePretId && (
                  <Link
                    to={`/agent/demandes/${organismePretId}`}
                    onClick={() => setIsChecked(false)}
                  >
                    Consulter les Demandes
                  </Link>
                )}
              </li>
              <li>
                <Link
                  to={`/agent/organisme/${organismePretId}`}
                  onClick={() => setIsChecked(false)}
                >
                  Mon Organisme
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

export default AgentPretNavigation;
