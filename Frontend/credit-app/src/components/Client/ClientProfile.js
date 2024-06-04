import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Modal from "react-modal";

function ClientProfile() {
  const { token } = useContext(AuthContext);
  const [clientData, setClientData] = useState(null);
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
      const updatedClientData = {
        ...clientData,
        dateNaissance: new Date(clientData.dateNaissance)
          .toISOString()
          .split("T")[0],
      };

      const response = await axios.put(
        `http://localhost:5000/clients/${updatedClientData.id}`,
        updatedClientData,
        config
      );
      if (response.status === 200) {
        setClientData(updatedClientData);
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
    if (!clientData) {
      console.error("Client data is not available");
      return;
    }

    const formData = new FormData();
    formData.append("photo", selectedFile);
    try {
      const response = await axios.post(
        `http://localhost:5000/upload/photo?userId=${clientData.userId}`,
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
        .get(`http://localhost:5000/clients/userId/${decodedToken.userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setClientData(response.data);
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
        })
        .catch((error) => {
          console.error(
            "An error occurred while fetching client data: ",
            error
          );
        });
    }
  }, [token]);

  if (!clientData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="main">
      <section className="signup">
        <div className="container">
          <div className="signup-content">
            <div className="client-profile">
              <img
                src={`http://localhost:5000/${userData.photo}`}
                alt="client"
                className="client-profile-img"
              />{" "}
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
                {clientData.nom} {clientData.prenom}
              </h2>
              <div className="form-group">
                <p>CIN: {clientData.cin}</p>
              </div>
              <div className="form-group">
                <p>Téléphone: {clientData.telephone}</p>
              </div>
              <div className="form-group">
                <p>Addresse: {clientData.adresse}</p>
              </div>
              <div className="form-group">
                <p>
                  Date de Naissance:{" "}
                  {new Date(clientData.dateNaissance).toLocaleDateString()}
                </p>
              </div>
              <div className="form-group">
                <button
                  onClick={() => {
                    setModalIsOpen(true);
                  }}
                  className="form-submit"
                >
                  Mettre-à-jour le profil
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
                  <h2 className="form-title">Mettre-à-jour le profil</h2>
                  <div className="form-group">
                    <label htmlFor="name">Nom</label>
                    <input
                      type="text"
                      className="form-input"
                      name="name"
                      id="name"
                      placeholder="Nom"
                      value={clientData.nom}
                      onChange={(e) =>
                        setClientData({ ...clientData, nom: e.target.value })
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
                      value={clientData.prenom}
                      onChange={(e) =>
                        setClientData({ ...clientData, prenom: e.target.value })
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
                      value={clientData.cin}
                      onChange={(e) =>
                        setClientData({ ...clientData, cin: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="dateNaissance">Date de naissance</label>
                    <input
                      type="date"
                      className="form-input"
                      name="dateNaissance"
                      id="dateNaissance"
                      placeholder="Date de naissance"
                      value={
                        clientData.dateNaissance
                          ? new Date(clientData.dateNaissance)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setClientData({
                          ...clientData,
                          dateNaissance: e.target.value,
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
                      value={clientData.adresse}
                      onChange={(e) =>
                        setClientData({
                          ...clientData,
                          adresse: e.target.value,
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
                      value={clientData.telephone}
                      onChange={(e) =>
                        setClientData({
                          ...clientData,
                          telephone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="file-upload" className="custom-file-upload">
                      Choisir Nouvelle Photo
                    </label>
                    <input
                      type="file"
                      id="file-upload"
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
                      value="Update"
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

export default ClientProfile;
