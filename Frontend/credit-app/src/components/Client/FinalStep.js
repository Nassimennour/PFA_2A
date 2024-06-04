import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import styles from "./FinalStep.module.css";
import JSZip from "jszip";
import { jwtDecode } from "jwt-decode";

function FinalStep({
  setStep,
  selectedDossierId,
  choice,
  demandePretId,
  clientId,
}) {
  const { token } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [documents, setDocuments] = useState([]);
  const [isDossierReady, setDossierReady] = useState(false);
  const [dossierUrl, setDossierUrl] = useState("");
  const [username, setUsername] = useState("");

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
    const userId = jwtDecode(token).userId;
    axios
      .get(`http://localhost:5000/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUsername(response.data.username);
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

      // Fetch all documents and add them to the zip file
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
      setMessage("Félicitations! Votre demande a été soumise avec succès");
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  return (
    <div className={styles.finalStep}>
      {choice === 1 ? (
        <>
          <p>Votre dossier est prêt.</p>
          <button onClick={handleDownload}>Générer le dossier</button>
          {isDossierReady && (
            <a href={dossierUrl} download={`dossier_${selectedDossierId}.zip`}>
              Le dossier est prêt, cliquez ici pour le télécharger
            </a>
          )}
          <button onClick={handleSubmit}>Soumettre la demande</button>
          {message && <p className={styles.successMessage}>{message}</p>}
        </>
      ) : (
        choice === 2 && (
          <>
            <p>
              Vous avez choisi de déléguer le processus de demande à un
              courtier.
            </p>
            <Link to={`/demandes-client/${clientId}`}>
              Vous pouvez suivre votre demande ici
            </Link>
          </>
        )
      )}
    </div>
  );
}

export default FinalStep;
