import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ClientForm from "./Client/ClientForm";
import CourtierForm from "./Courtier/CourtierForm";
import AgentPretForm from "./AgentPret/AgentPretForm";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [role, setRole] = useState("client"); // default role
  const [agreeTerm, setAgreeTerm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== rePassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/users", {
        username,
        email,
        password,
        role,
      });
      if (response.status === 201) {
        alert("Registration successful");
        setIsRegistered(true);
      } else {
        alert("Registration failed");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during registration");
    }
  };

  if (isRegistered) {
    if (role === "client") {
      return <ClientForm username={username} />;
    } else if (role === "courtier") {
      return <CourtierForm username={username} />;
    } else if (role === "agentPret") {
      return <AgentPretForm username={username} />;
    }
  }

  return (
    <div className="main">
      <section className="signup">
        <div className="container">
          <div className="signup-content">
            <form onSubmit={handleSubmit} className="signup-form">
              <h2 className="form-title">Créer un compte</h2>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  name="username"
                  id="username"
                  placeholder="Login"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  className="form-input"
                  name="email"
                  id="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  name="password"
                  id="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  onClick={togglePasswordVisibility}
                  toggle="#password"
                  className="zmdi zmdi-eye field-icon toggle-password"
                ></span>
              </div>
              <div className="form-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  name="re_password"
                  id="re_password"
                  placeholder="Répéter votre mot de passe"
                  value={rePassword}
                  onChange={(e) => setRePassword(e.target.value)}
                />
                <span
                  onClick={togglePasswordVisibility}
                  toggle="#re_password"
                  className="zmdi zmdi-eye field-icon toggle-password"
                ></span>
              </div>
              <div className="form-group">
                <select
                  className="form-input"
                  name="role"
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="client">Client</option>
                  <option value="courtier">Courtier</option>
                  <option value="agentPret">Agent Pret</option>
                </select>
              </div>
              <div className="form-group">
                <input
                  type="checkbox"
                  name="agree-term"
                  id="agree-term"
                  className="agree-term"
                  checked={agreeTerm}
                  onChange={(e) => setAgreeTerm(e.target.checked)}
                />
                <label htmlFor="agree-term" className="label-agree-term">
                  <span>
                    <span></span>
                  </span>
                  J'accepte toutes les déclarations dans{" "}
                  <a href="#" className="term-service">
                    Les conditions d'utilisation
                  </a>
                </label>
              </div>
              <div className="form-group">
                <input
                  type="submit"
                  name="submit"
                  id="submit"
                  className="form-submit"
                  value="Créer"
                />
              </div>
            </form>
            <p className="loginhere">
              Vous avez déjà un compte ?{" "}
              <a href="#" className="loginhere-link" onClick={handleLogin}>
                Connectez-vous ici
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Register;
