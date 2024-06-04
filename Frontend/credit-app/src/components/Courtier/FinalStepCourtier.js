import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import styles from "./FinalStepCourtier.module.css";
import JSZip from "jszip";

function FinalStepCourtier({
  setStep,
  selectedDossierId,
  demandePretId,
  clientId,
}) {
  const { token } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [documents, setDocuments] = useState([]);
  const [isDossierReady, setDossierReady] = useState(false);
  const [dossierUrl, setDossierUrl] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientResponse = await axios.get(
          `http://localhost:5000/clients/${clientId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userResponse = await axios.get(
          `http://localhost:5000/users/${clientResponse.data.userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUsername(userResponse.data.username);
      } catch (error) {
        console.error("There was an error with the request!", error);
      }
    };

    fetchData();
  }, [clientId, token]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/documents/dossier/${selectedDossierId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setDocuments(response.data);
      })
      .catch((error) =>
        console.error("There was an error with the request!", error)
      );
  }, [selectedDossierId, token]);

  const handleDownload = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/pdf/${selectedDossierId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status !== 200) {
        throw new Error(
          "Server responded with status code: " + response.status
        );
      }
      const zip = new JSZip();
      await Promise.all(
        documents.map(async (doc) => {
          const docResponse = await axios.get(
            `http://localhost:5000/${doc.cheminFichier}`,
            {
              responseType: "blob",
            }
          );
          const filename = new URL(
            doc.cheminFichier,
            "http://localhost:5000/"
          ).pathname
            .split("/")
            .pop();
          zip.file(filename, docResponse.data, { binary: true });
        })
      );
      const cheminDossier = `uploads/${username}/dossier${selectedDossierId}.pdf`;
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const pdfResponse = await axios.get(
        `http://localhost:5000/${cheminDossier}`,
        {
          responseType: "blob",
        }
      );
      zip.file(`dossier_${selectedDossierId}.pdf`, pdfResponse.data, {
        binary: true,
      });

      zip.generateAsync({ type: "blob" }).then(function (content) {
        setDossierReady(true);
        setDossierUrl(URL.createObjectURL(content));
      });
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.put(
        `http://localhost:5000/demandesprets/${demandePretId}`,
        {
          dateSoumission: new Date(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage("Your application has been submitted. Congratulations!");
    } catch (error) {
      console.error("There was an error!", error);
    }
  };
  return (
    <div className={styles.finalStep}>
      <p>Votre dossier est prêt.</p>
      <button onClick={handleDownload}>Générer le dossier</button>
      <button onClick={handleSubmit}>Soumettre la demande</button>
      {isDossierReady && (
        <a href={dossierUrl} download={`dossier_${selectedDossierId}.zip`}>
          Le dossier est prêt, cliquez ici pour le télécharger
        </a>
      )}
      {message && <p className={styles.successMessage}>{message}</p>}
    </div>
  );
}

export default FinalStepCourtier;
