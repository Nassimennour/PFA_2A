import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import styles from "./Step6Courtier.module.css";
import { AuthContext } from "../../contexts/AuthContext";
import { MdInfo } from "react-icons/md";
import { jwtDecode } from "jwt-decode";

function Step6Courtier({ setStep, organismePretId, selectedDossierId }) {
  const [documentTypes, setDocumentTypes] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchDocumentTypes = async () => {
      const { data } = await axios.get(
        `http://localhost:5000/typesdocuments/organisme/${organismePretId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDocumentTypes(data);
    };

    fetchDocumentTypes();
  }, [organismePretId]);

  const categories = {
    "Financial Documents": "Documents financiers",
    "Identification Documents": "Documents d'identification",
    "Legal Documents": "Documents juridiques",
    "Medical Records": "Dossiers médicaux",
    "Educational Documents": "Documents éducatifs",
    Other: "Autre",
  };
  const handleUpload = async (event, typeDocumentId) => {
    event.preventDefault();

    const file = event.target.elements.file.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("document", file);
    formData.append("dossierPretId", selectedDossierId);
    formData.append("typeDocumentId", typeDocumentId);

    const { userId } = jwtDecode(token);

    try {
      const response = await axios.post(
        "http://localhost:5000/upload/document?userId=" + userId,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <>
      {Object.entries(categories).map(([key, value]) => {
        const documents = documentTypes.filter((doc) => doc.category === key);

        return (
          <section key={key}>
            <h2>{value}</h2>
            {documents.map((doc) => (
              <form
                key={doc.id}
                className={styles.document}
                onSubmit={(event) => handleUpload(event, doc.id)}
              >
                <label htmlFor={doc.nom}>{doc.nom}</label>
                <input
                  type="file"
                  id={doc.nom}
                  accept={doc.format}
                  name="file"
                />
                <button type="submit">Charger</button>
                <MdInfo
                  onClick={() =>
                    alert(
                      `Description: ${doc.description}\nFormat: ${doc.format}\nMax size: ${doc.maxSize}KB`
                    )
                  }
                />
              </form>
            ))}
          </section>
        );
      })}
      <button onClick={() => setStep(8)} className={styles.continueButton}>
        Continuer
      </button>
    </>
  );
}

export default Step6Courtier;
