import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Modal from "react-modal";

function CourtierProfile() {
  const { token } = useContext(AuthContext);
  const [courtierData, setCourtierData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [userData, setUserData] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const updatedCourtierData = {
        ...courtierData,
      };

      const response = await axios.put(
        `http://localhost:5000/courtiers/${updatedCourtierData.id}`,
        updatedCourtierData,
        config
      );
      if (response.status === 200) {
        setCourtierData(updatedCourtierData);
        setModalIsOpen(false);
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("An error occured while updating the profile: ", error);
    }
  };

  const handleUpload = async (event) => {
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }
    if (!courtierData) {
      console.error("Courtier data is not available");
      return;
    }

    const formData = new FormData();
    formData.append("photo", selectedFile);
    try {
      const response = await axios.post(
        `http://localhost:5000/upload/photo?userId=${courtierData.userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("An error occurred while uploading the image: ", error);
    }
  };

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      axios
        .get(`http://localhost:5000/courtiers/user/${decodedToken.userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          setCourtierData(response.data);
          return axios.get(
            `http://localhost:5000/users/${response.data.userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        })
        .then((response) => {
          setUserData(response.data);
          console.log("User data: ", response.data);
          console.log("Courtier data: ", courtierData);
        })
        .catch((error) => {
          console.error(
            "An error occurred while fetching courtier data: ",
            error
          );
        });
    }
  }, [token]);

  if (!courtierData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="main">
      <section className="signup">
        <div className="container">
          <div className="signup-content">
            <div className="courtier-profile">
              <div className="profile-photo-wrapper">
                <img
                  src={`http://localhost:5000/${userData.photo}`}
                  alt="courtier"
                  className="courtier-profile-img profile-photo"
                />
              </div>
              {!userData.photo && (
                <>
                  <label htmlFor="file-upload" className="custom-file-upload">
                    Choisir une photo
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    onChange={handleFileChange}
                    className="file-input"
                  />
                  <button onClick={handleUpload} className="upload-button">
                    Charger
                  </button>
                </>
              )}
              <h2 className="form-title">
                {courtierData.nom} {courtierData.prenom}
              </h2>
              <div className="form-group">
                <p>CIN: {courtierData.cin}</p>
              </div>
              <div className="form-group">
                <p>Téléphone: {courtierData.phone}</p>
              </div>
              <div className="form-group">
                <p>Addresse: {courtierData.adresse}</p>
              </div>
              <div className="form-group">
                <p>Entreprise: {courtierData.entreprise}</p>
              </div>
              <div className="form-group">
                <p>Années d'Expérience: {courtierData.experience}</p>
              </div>
              <div className="form-group">
                <button
                  onClick={() => {
                    setModalIsOpen(true);
                  }}
                  className="form-submit"
                >
                  Mettre-à-jour le Profil
                </button>
              </div>
              <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Update Profile"
              >
                <button
                  className="close-button"
                  onClick={() => setModalIsOpen(false)}
                >
                  &#10005; {/* This is the HTML entity for the cross sign */}
                </button>
                <form onSubmit={handleUpdateProfile} className="signup-form">
                  <h2 className="form-title">Mettre-à-jour le Profil</h2>
                  <div className="form-group">
                    <label htmlFor="name">Nom</label>
                    <input
                      type="text"
                      className="form-input"
                      name="name"
                      id="name"
                      placeholder="Nom"
                      value={courtierData.nom}
                      onChange={(e) =>
                        setCourtierData({
                          ...courtierData,
                          nom: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="surname">Prénom</label>
                    <input
                      type="text"
                      className="form-input"
                      name="surname"
                      id="surname"
                      placeholder="Prénom"
                      value={courtierData.prenom}
                      onChange={(e) =>
                        setCourtierData({
                          ...courtierData,
                          prenom: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cin">CIN</label>
                    <input
                      type="text"
                      className="form-input"
                      name="cin"
                      id="cin"
                      placeholder="CIN"
                      value={courtierData.cin}
                      onChange={(e) =>
                        setCourtierData({
                          ...courtierData,
                          cin: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="adresse">Adresse</label>
                    <input
                      type="text"
                      className="form-input"
                      name="adresse"
                      id="adresse"
                      placeholder="Adresse"
                      value={courtierData.adresse}
                      onChange={(e) =>
                        setCourtierData({
                          ...courtierData,
                          adresse: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="entreprise">Entreprise</label>
                    <input
                      type="text"
                      className="form-input"
                      name="entreprise"
                      id="entreprise"
                      placeholder="Entreprise"
                      value={courtierData.entreprise}
                      onChange={(e) =>
                        setCourtierData({
                          ...courtierData,
                          entreprise: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="experience">Années d'Expérience</label>
                    <input
                      type="number"
                      className="form-input"
                      name="experience"
                      id="experience"
                      placeholder="Années d'Expérience"
                      value={courtierData.experience}
                      onChange={(e) =>
                        setCourtierData({
                          ...courtierData,
                          experience: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Téléphone</label>
                    <input
                      type="tel"
                      className="form-input"
                      name="phone"
                      id="phone"
                      placeholder="Téléphone"
                      value={courtierData.phone}
                      onChange={(e) =>
                        setCourtierData({
                          ...courtierData,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label
                      htmlFor="photo-upload"
                      className="custom-file-upload"
                    >
                      Choisir Nouvelle Photo
                    </label>
                    <input
                      type="file"
                      id="photo-upload"
                      onChange={handleFileChange}
                      className="file-input"
                    />
                    <button onClick={handleUpload} className="upload-button">
                      Charger
                    </button>
                  </div>
                  <div className="form-group">
                    <input
                      type="submit"
                      name="submit"
                      id="submit"
                      className="form-submit"
                      value="Mettre-à-jour"
                    />
                  </div>
                </form>
              </Modal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CourtierProfile;
