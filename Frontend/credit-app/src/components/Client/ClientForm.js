import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ClientForm({ username }) {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [cin, setCin] = useState("");
  const [adresse, setAdresse] = useState("");
  const [telephone, setTelephone] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [gender, setGender] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userResponse = await axios.get(
        `http://localhost:5000/users/username/${username}`
      );
      const userId = userResponse.data.id;

      const clientResponse = await axios.post("http://localhost:5000/clients", {
        userId,
        nom,
        prenom,
        cin,
        gender,
        adresse,
        telephone,
        dateNaissance,
      });

      if (clientResponse.status === 201) {
        alert("Client registration successful");
        navigate("/login");
      } else {
        alert("Client registration failed");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during client registration");
    }
  };

  return (
    <div className="main">
      <section className="signup">
        <div className="container">
          <div className="signup-content">
            <form onSubmit={handleSubmit} className="signup-form">
              <h2 className="form-title">Compléter votre inscription</h2>
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
                  placeholder="Prénom"
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
                <select
                  className="form-input"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="">Sexe</option>
                  <option value="male">Homme</option>
                  <option value="female">Femme</option>
                </select>
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
                  type="tel"
                  className="form-input"
                  placeholder="Téléphone"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="date"
                  className="form-input"
                  placeholder="Date de Naissance"
                  value={dateNaissance}
                  onChange={(e) => setDateNaissance(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="submit"
                  name="submit"
                  id="submit"
                  className="form-submit"
                  value="S'inscrire"
                />
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ClientForm;
