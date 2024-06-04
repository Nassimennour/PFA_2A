import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import styles from "./Step2Courtier.module.css";
import { AuthContext } from "../../contexts/AuthContext";

function Step2Courtier({ setStep, choice, clientIdSetter }) {
  const [clients, setClients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [filterAttribute, setFilterAttribute] = useState("nom");
  const { token } = useContext(AuthContext);
  const [clientData, setClientData] = useState({
    nom: "",
    prenom: "",
    cin: "",
    telephone: "",
    adresse: "",
    dateNaissance: "",
    gender: "male",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (event) => {
    setClientData({
      ...clientData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/clients",
        clientData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      clientIdSetter(response.data.id);
      setSuccessMessage("Client created successfully");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchClients = async () => {
      const response = await axios.get("http://localhost:5000/clients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(response.data);
    };
    fetchClients();
  }, []);

  const filteredClients = clients
    .filter((client) =>
      client[filterAttribute].toLowerCase().includes(filter.toLowerCase())
    )
    .slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <div className={styles.container}>
      {choice === 1 ? (
        <>
          <div className={styles.filterContainer}>
            <input
              className={styles.filterInput}
              type="text"
              placeholder="Filter clients"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <select
              className={styles.filterSelect}
              value={filterAttribute}
              onChange={(e) => setFilterAttribute(e.target.value)}
            >
              <option value="nom">Nom</option>
              <option value="prenom">Prénom</option>
              <option value="gender">Sexe</option>
              <option value="adresse">Adresse</option>
            </select>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Sexe</th>
                <th>Adresse</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id}>
                  <td>{client.nom}</td>
                  <td>{client.prenom}</td>
                  <td>{client.gender}</td>
                  <td>{client.adresse}</td>
                  <td>
                    <button
                      className={styles.selectButton}
                      onClick={() => {
                        clientIdSetter(client.id);
                        setStep(3);
                      }}
                    >
                      Selectionner
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.paginationContainer}>
            <button
              className={styles.paginationButton}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => page - 1)}
            >
              Previous
            </button>
            <button
              className={styles.paginationButton}
              disabled={filteredClients.length < 10}
              onClick={() => setCurrentPage((page) => page + 1)}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <label className={styles.formLabel}>Nom:</label>
            <input
              className={styles.formInput}
              type="text"
              name="nom"
              required
              onChange={handleInputChange}
            />

            <label className={styles.formLabel}>Prénom:</label>
            <input
              className={styles.formInput}
              type="text"
              name="prenom"
              required
              onChange={handleInputChange}
            />

            <label className={styles.formLabel}>CIN:</label>
            <input
              className={styles.formInput}
              type="text"
              name="cin"
              onChange={handleInputChange}
              required
            />
            <label className={styles.formLabel}>Sexe:</label>
            <select
              className={styles.formInput}
              name="gender"
              required
              onChange={handleInputChange}
            >
              <option value="male">Homme</option>
              <option value="female">Femme</option>
            </select>
            <label className={styles.formLabel}>Téléphone:</label>
            <input
              className={styles.formInput}
              onChange={handleInputChange}
              type="text"
              name="telephone"
            />
            <label className={styles.formLabel}>Adresse:</label>
            <input
              className={styles.formInput}
              onChange={handleInputChange}
              type="text"
              name="adresse"
            />

            <label className={styles.formLabel}>Date de Naissance:</label>
            <input
              className={styles.formInput}
              type="date"
              name="dateNaissance"
              required
              onChange={handleInputChange}
            />

            <input className={styles.formSubmit} type="submit" value="Créer" />
            {successMessage && (
              <>
                <p className={styles.successMessage}>{successMessage}</p>
                <button
                  className={styles.continueButton}
                  onClick={() => setStep(3)}
                >
                  Continuer
                </button>
              </>
            )}
          </form>
        </div>
      )}
    </div>
  );
}

export default Step2Courtier;
