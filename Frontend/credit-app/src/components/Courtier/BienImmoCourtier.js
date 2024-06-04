import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../../contexts/AuthContext";
import styles from "./BienImmoCourtier.module.css";
import React, { useContext, useState, useEffect } from "react";
import axios from "axios";

function BienImmoCourtier({ setStep, demandePretId }) {
  const { token } = useContext(AuthContext);
  const [bienImmo, setBienImmo] = useState({
    typeBien: "",
    adresse: "",
    superficie: "",
    nbPieces: "",
    valeur: "",
  });
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isImageActive, setIsImageActive] = useState(false);

  const handleChange = (event) => {
    setBienImmo({ ...bienImmo, [event.target.name]: event.target.value });
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setPreviewImage(URL.createObjectURL(event.target.files[0]));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/biensimmobiliers",
        bienImmo,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const bienImmobilierId = response.data.id;

      if (file) {
        const formData = new FormData();
        formData.append("photo", file);
        const decodedToken = jwtDecode(token);
        await axios.post(
          `http://localhost:5000/upload/bienImmobilier/photo?userId=${decodedToken.userId}&bienImmobilierId=${bienImmobilierId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      if (demandePretId) {
        await axios.put(
          `http://localhost:5000/demandesprets/${demandePretId}`,
          { bienImmobilierId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {previewImage && (
        <img
          src={previewImage}
          alt="Preview"
          className={`${styles.previewImage} ${
            isImageActive ? styles.active : ""
          }`}
          onClick={() => setIsImageActive(!isImageActive)}
        />
      )}
      <label>
        Type de bien:
        <select name="typeBien" onChange={handleChange} required>
          <option value="">--Choisissez un type--</option>
          <option value="maison">Maison</option>
          <option value="appartement">Appartement</option>
          <option value="terrain">Terrain</option>
          <option value="autre">Autre</option>
        </select>
      </label>
      <label>
        Adresse:
        <input type="text" name="adresse" onChange={handleChange} required />
      </label>
      <label>
        Superficie:
        <input
          type="number"
          name="superficie"
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Nombre de pièces:
        <input type="number" name="nbPieces" onChange={handleChange} />
      </label>
      <label>
        Valeur:
        <input type="number" name="valeur" onChange={handleChange} required />
      </label>
      <label>
        Photo:
        <input type="file" name="photo" onChange={handleFileChange} />
      </label>
      <button type="submit">Envoyer</button>
      <button type="button" onClick={() => setStep(6)}>
        Continuer
      </button>
    </form>
  );
}

export default BienImmoCourtier;
