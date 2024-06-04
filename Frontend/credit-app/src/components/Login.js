import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { saveToken } = useContext(AuthContext);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });
      if (response.status === 200) {
        alert("Login successful");
        const token = response.data.token;
        saveToken(token);
        const role = jwtDecode(token).role;
        if (role === "client") {
          navigate("/client/profile");
        } else if (role === "courtier") {
          navigate("/courtier/profile");
        } else if (role === "agentPret") {
          navigate("/agent/profile");
        } else if (role === "admin") {
          navigate("/admin/home");
        }
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during login");
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="main">
      <section className="signup">
        <div className="container">
          <div className="signup-content">
            <form onSubmit={handleSubmit} className="signup-form">
              <h2 className="form-title">Se connecter</h2>
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
                  type="submit"
                  name="submit"
                  id="submit"
                  className="form-submit"
                  value="Log in"
                />
              </div>
            </form>
            <p className="loginhere">
              Vous n'avez pas de compte?{" "}
              <a href="#" className="loginhere-link" onClick={handleRegister}>
                Inscrivez-vous ici
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
