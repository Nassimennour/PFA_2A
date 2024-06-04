import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import styles from "./DelegateCourtier.module.css";
import Modal from "react-modal";
import { jwtDecode } from "jwt-decode";

Modal.setAppElement("#root");

function DelegateCourtier({
  setStep,
  demandePretId,
  clientIdSetter,
  setDemandePretId,
}) {
  const { token } = useContext(AuthContext);
  const [courtiers, setCourtiers] = useState([]);
  const [selectedCourtier, setSelectedCourtier] = useState(null);
  const [courtierStats, setCourtierStats] = useState(null);
  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    const fetchCourtiers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/courtiers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const courtiersData = await Promise.all(
          response.data.map(async (courtier) => {
            const userResponse = await axios.get(
              `http://localhost:5000/users/${courtier.userId}`
            );
            return { ...courtier, userData: userResponse.data };
          })
        );
        setCourtiers(courtiersData);
      } catch (error) {
        console.error("Error fetching courtiers:", error);
      }
    };

    fetchCourtiers();
  }, [token]);
  useEffect(() => {
    const fetchClientId = async () => {
      try {
        const decodedToken = jwtDecode(token);
        const response = await axios.get(
          `http://localhost:5000/clients/userId/${decodedToken.userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const clientId = response.data.id;
        clientIdSetter(clientId);
        setClientId(clientId);
      } catch (error) {
        console.error("Error fetching client ID:", error);
      }
    };

    fetchClientId();
  }, [token, clientIdSetter]);

  const handleSelect = async (courtierId) => {
    try {
      if (demandePretId) {
        await axios.put(
          `http://localhost:5000/demandesprets/${demandePretId}`,
          { courtierId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios
          .post(
            `http://localhost:5000/demandesprets`,
            { clientId, courtierId },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            setDemandePretId(response.data.id);
          });
      }
      setStep(6);
    } catch (error) {
      console.error("Error selecting courtier:", error);
    }
  };

  const handleDetails = async (courtier) => {
    setSelectedCourtier(courtier);
    try {
      const response = await axios.get(
        `http://localhost:5000/courtiers/stats/${courtier.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCourtierStats(response.data);
    } catch (error) {
      console.error("Error fetching courtier stats:", error);
    }
  };

  const closeModal = () => {
    setSelectedCourtier(null);
  };

  return (
    <div className={styles.container}>
      {courtiers.map((courtier) => (
        <div key={courtier.id} className={styles.courtier}>
          {courtier.userData?.photo && (
            <img
              src={`http://localhost:5000/${courtier.userData?.photo}`}
              alt="Courtier"
              className={styles.photo}
            />
          )}
          <h2>
            {courtier.nom} {courtier.prenom}
          </h2>
          <button
            className={styles.detailsButton}
            onClick={() => handleDetails(courtier)}
          >
            Détails
          </button>
          <button
            className={styles.selectButton}
            onClick={() => handleSelect(courtier.id)}
          >
            Séléctionner
          </button>
        </div>
      ))}
      {selectedCourtier && (
        <Modal
          isOpen={true}
          onRequestClose={closeModal}
          className={styles.modal}
        >
          {selectedCourtier.userData?.photo && (
            <img
              src={`http://localhost:5000/${selectedCourtier.userData?.photo}`}
              alt="Courtier"
              className={styles.modalPhoto}
            />
          )}
          <h2>
            {selectedCourtier.nom} {selectedCourtier.prenom}
          </h2>
          <p>
            <strong>CIN:</strong> {selectedCourtier.cin}
          </p>
          <p>
            <strong>Adresse:</strong> {selectedCourtier.adresse}
          </p>
          <p>
            <strong>Entreprise:</strong> {selectedCourtier.entreprise}
          </p>
          <p>
            <strong>Expérience:</strong> {selectedCourtier.experience} Années
          </p>
          <p>
            <strong>Téléphone:</strong> {selectedCourtier.phone}
          </p>
          {courtierStats && (
            <>
              <p>
                <strong>Nombre de prêts:</strong> {courtierStats.loanCount}
              </p>
              <p>
                <strong>Moyenne des montants de prêts:</strong>{" "}
                {courtierStats.averageLoanAmount}
              </p>
            </>
          )}
          <button onClick={closeModal}>Fermer</button>
        </Modal>
      )}
    </div>
  );
}

export default DelegateCourtier;
