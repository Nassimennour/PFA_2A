import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AgentPretForm({ username }) {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [adresse, setAdresse] = useState("");
  const [cin, setCin] = useState("");
  const [telephone, setTelephone] = useState("");
  const [numLicence, setNumLicence] = useState("");
  const [anneesExperience, setAnneesExperience] = useState("");
  const [diplome, setDiplome] = useState("");
  const [organismePretId, setOrganismePretId] = useState("");
  const [organismesPrets, setOrganismesPrets] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrganismesPrets = async () => {
      const response = await axios.get("http://localhost:5000/organismesprets");
      setOrganismesPrets(response.data);
    };
    fetchOrganismesPrets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userResponse = await axios.get(
        `http://localhost:5000/users/username/${username}`
      );
      const userId = userResponse.data.id;

      const agentPretResponse = await axios.post(
        "http://localhost:5000/agentsprets",
        {
          userId,
          nom,
          prenom,
          adresse,
          cin,
          telephone,
          numLicence,
          anneesExperience,
          diplome,
          organismePretId,
        }
      );

      if (agentPretResponse.status === 201) {
        alert("AgentPret registration successful");
        navigate("/login");
      } else {
        alert("AgentPret registration failed");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during agentPret registration");
    }
  };

  return (
    <div className="main">
      <section className="signup">
        <div className="container">
          <div className="signup-content">
            <form onSubmit={handleSubmit} className="signup-form">
              <h2 className="form-title">Agent Prêt Registration</h2>
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
                  placeholder="Adresse"
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
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
                  type="tel"
                  className="form-input"
                  placeholder="Telephone"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <select
                  className="form-input"
                  value={organismePretId}
                  onChange={(e) => setOrganismePretId(e.target.value)}
                  required
                >
                  <option value="">Votre organisme de prêt</option>
                  {organismesPrets.map((organisme) => (
                    <option key={organisme.id} value={organisme.id}>
                      {organisme.nom}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Num Licence"
                  value={numLicence}
                  onChange={(e) => setNumLicence(e.target.value)}
                />
              </div>
              <div className="form-group">
                <input
                  type="number"
                  className="form-input"
                  placeholder="Annees Experience"
                  value={anneesExperience}
                  onChange={(e) => setAnneesExperience(e.target.value)}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Diplome"
                  value={diplome}
                  onChange={(e) => setDiplome(e.target.value)}
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

export default AgentPretForm;
