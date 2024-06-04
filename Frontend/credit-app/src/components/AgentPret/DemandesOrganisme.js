import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./DemandesOrganisme.module.css";
import Modal from "react-modal";
import JSZip from "jszip";

const JUDGMENT_STATUS_OPTIONS_FR = {
  pending: "en attente",
  accepted: "acceptée",
  rejected: "rejetée",
};

Modal.setAppElement("#root"); // Add this line to avoid warning on console

function DemandesOrganisme() {
  const { token } = useContext(AuthContext);
  const { organismePretId } = useParams();
  const [demands, setDemands] = useState([]);
  const [organisme, setOrganisme] = useState(null);
  const [modalContent, setModalContent] = useState(null);
  const [selectedDemand, setSelectedDemand] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const demandsPerPage = 10;

  useEffect(() => {
    axios
      .get(`http://localhost:5000/demandesprets/organisme/${organismePretId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const sortedDemands = res.data.sort((a, b) => {
          if (a.judgment === "pending") return -1;
          if (b.judgment === "pending") return 1;
          if (a.judgment === "accepted" && b.judgment !== "accepted") return -1;
          if (b.judgment === "accepted" && a.judgment !== "accepted") return 1;
          return 0;
        });
        setDemands(sortedDemands);
        axios
          .get(`http://localhost:5000/organismesprets/${organismePretId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setOrganisme(res.data);
          });
      });
  }, [organismePretId, token]);

  const handleClientClick = (clientId) => {
    axios
      .get(`http://localhost:5000/clients/${clientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setModalContent(res.data);
      });
  };

  const handleCourtierClick = (courtierId) => {
    axios
      .get(`http://localhost:5000/courtiers/${courtierId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setModalContent(res.data);
      });
  };

  const handleJudgmentSubmit = (index) => {
    setSelectedDemand({ ...demands[index], index });
  };

  const handleJudgmentChange = (judgment) => {
    setSelectedDemand({ ...selectedDemand, judgment });
  };

  const handleCommentChange = (comment) => {
    setSelectedDemand({ ...selectedDemand, comment });
  };

  const handleDossierClick = async (demandePretId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/dossiersprets/demandePret/${demandePretId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const dossierId = response.data.id; // assuming the id is in the response
      const cheminDossier = response.data.cheminDossier; // assuming the cheminDossier is in the response

      const zip = new JSZip();

      const documentsResponse = await axios.get(
        `http://localhost:5000/documents/dossier/${dossierId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const documents = documentsResponse.data; // assuming the documents are in the response data

      await Promise.all(
        documents.map(async (doc) => {
          const docResponse = await axios.get(
            `http://localhost:5000/${doc.cheminFichier}`,
            {
              responseType: "blob",
            }
          );
          const filename = doc.cheminFichier.split("\\").pop();
          zip.file(filename, docResponse.data, { binary: true });
        })
      );

      const pdfResponse = await axios.get(
        `http://localhost:5000/uploads/${cheminDossier}`,
        {
          responseType: "blob",
        }
      );
      const pdfFilename = cheminDossier.split("\\").pop();
      zip.file(pdfFilename, pdfResponse.data, { binary: true });

      zip.generateAsync({ type: "blob" }).then(function (content) {
        const url = URL.createObjectURL(content);
        const link = document.createElement("a");
        link.href = url;
        link.download = "documents.zip";
        link.click();
      });
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const handleSubmit = () => {
    axios
      .put(
        `http://localhost:5000/demandesprets/${selectedDemand.id}`,
        {
          judgment: selectedDemand.judgment,
          comment: selectedDemand.comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        const updatedDemands = [...demands];
        updatedDemands[selectedDemand.index] = selectedDemand;
        setDemands(updatedDemands);
        setSelectedDemand(null);
      });
  };
  const indexOfLastDemand = currentPage * demandsPerPage;
  const indexOfFirstDemand = indexOfLastDemand - demandsPerPage;
  const currentDemands = demands.slice(indexOfFirstDemand, indexOfLastDemand);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Demandes de l'Organisme</h1>
      {organisme && organisme.logo && (
        <img
          src={organisme.logo}
          alt="Organisme Logo"
          className={styles.logo}
        />
      )}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Montant (DH)</th>
            <th>Durée (Ans)</th>
            <th>Taux d'intérêt</th>
            <th>Date de Soumission</th>
            <th>Client</th>
            <th>Courtier</th>
            <th>Jugement</th>
            <th>Commentaire</th>
            <th>Dossier</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentDemands.map((demand, index) => (
            <tr key={index}>
              <td>{demand.montant}</td>
              <td>{demand.duree}</td>
              <td>{demand.interestRate}</td>
              <td>{new Date(demand.dateSoumission).toLocaleDateString()}</td>
              <td>
                <button
                  onClick={() => handleClientClick(demand.clientId)}
                  className={styles.button}
                >
                  Voir Client
                </button>
              </td>
              <td>
                {demand.courtierId ? (
                  <button
                    onClick={() => handleCourtierClick(demand.courtierId)}
                    className={styles.button}
                  >
                    Voir Courtier
                  </button>
                ) : (
                  "Pas de Courtier"
                )}
              </td>
              <td>{JUDGMENT_STATUS_OPTIONS_FR[demand.judgment]}</td>{" "}
              <td>{demand.comment}</td>
              <td>
                <button
                  className={styles.downloadButton}
                  onClick={() => {
                    handleDossierClick(demand.id);
                  }}
                >
                  Télécharger
                </button>
              </td>
              <td>
                {demand.judgment === "pending" && (
                  <button
                    className={styles.submitJudgmentButton}
                    onClick={() => handleJudgmentSubmit(index)}
                  >
                    Soumettre Jugement
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.pagination}>
        <button
          className={styles.prevButton}
          onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
          disabled={currentPage === 1}
        >
          Précédent
        </button>
        <span className={styles.pageNumber}>{currentPage}</span>
        <button
          className={styles.nextButton}
          onClick={() =>
            setCurrentPage((page) =>
              Math.min(page + 1, Math.ceil(demands.length / demandsPerPage))
            )
          }
          disabled={currentPage === Math.ceil(demands.length / demandsPerPage)}
        >
          Suivant
        </button>
      </div>
      {modalContent && (
        <Modal
          isOpen={!!modalContent}
          onRequestClose={() => setModalContent(null)}
          style={{
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
            },
          }}
        >
          <button
            className={styles.closeButton}
            onClick={() => setModalContent(null)}
          >
            &times;
          </button>
          <div className={styles.modalContent}>
            <p>
              <span className={styles.label}>Nom Complet:</span>{" "}
              <span className={styles.value}>
                {modalContent.nom} {modalContent.prenom}
              </span>
            </p>
            <p>
              <span className={styles.label}>CIN:</span>{" "}
              <span className={styles.value}>{modalContent.cin}</span>
            </p>
            <p>
              <span className={styles.label}>Téléphone:</span>{" "}
              <span className={styles.value}>{modalContent.telephone}</span>
            </p>
            <p>
              <span className={styles.label}>Addresse:</span>{" "}
              <span className={styles.value}>{modalContent.adresse}</span>
            </p>
            <p>
              <span className={styles.label}>Date de Naissance:</span>{" "}
              <span className={styles.value}>{modalContent.dateNaissance}</span>
            </p>
          </div>
        </Modal>
      )}
      {selectedDemand && (
        <Modal
          isOpen={!!selectedDemand}
          onRequestClose={() => setSelectedDemand(null)}
        >
          <button
            className={styles.closeButton}
            onClick={() => setSelectedDemand(null)}
          >
            &times;
          </button>
          <div className={styles.judgmentModalContent}>
            <h2 className={styles.judgmentModalHeader}>
              Soumettre un jugement
            </h2>

            <select
              className={styles.select}
              value={selectedDemand.judgment}
              onChange={(e) => handleJudgmentChange(e.target.value)}
            >
              <option value="accepted">Accepter</option>
              <option value="rejected">Rejeter</option>
              <option value="pending">Attendre</option>
            </select>
            <textarea
              className={styles.textarea}
              value={selectedDemand.comment || ""}
              placeholder="Commentaire..."
              onChange={(e) => handleCommentChange(e.target.value)}
            />
            <button className={styles.submitButton} onClick={handleSubmit}>
              Soumettre
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default DemandesOrganisme;
