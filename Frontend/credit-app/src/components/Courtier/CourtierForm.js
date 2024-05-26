import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CourtierForm({ username }) {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [cin, setCin] = useState("");
  const [adresse, setAdresse] = useState("");
  const [entreprise, setEntreprise] = useState("");
  const [experience, setExperience] = useState("");
  const [phone, setPhone] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userResponse = await axios.get(
        `http://localhost:5000/users/username/${username}`
      );
      console.log(userResponse.data);
      const userId = userResponse.data.id;

      const courtierResponse = await axios.post(
        "http://localhost:5000/courtiers",
        {
          userId,
          nom,
          prenom,
          cin,
          adresse,
          entreprise,
          experience,
          phone,
        }
      );

      if (courtierResponse.status === 201) {
        alert("Courtier registration successful");
        navigate("/login");
      } else {
        alert("Courtier registration failed");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during courtier registration");
    }
  };

  return (
    <div className="main">
      <section className="signup">
        <div className="container">
          <div className="signup-content">
            <form onSubmit={handleSubmit} className="signup-form">
              <h2 className="form-title">Courtier Registration</h2>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Prenom"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="CIN"
                  value={cin}
                  onChange={(e) => setCin(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Adresse"
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Entreprise"
                  value={entreprise}
                  onChange={(e) => setEntreprise(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="number"
                  className="form-input"
                  placeholder="Experience"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  className="form-input"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="submit"
                  name="submit"
                  id="submit"
                  className="form-submit"
                  value="Register"
                />
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CourtierForm;
