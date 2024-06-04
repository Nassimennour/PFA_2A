import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Modal from "react-modal";
import { Link } from "react-router-dom";

function AgentPretProfile() {
  const { token } = useContext(AuthContext);
  const [agentData, setAgentData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [userData, setUserData] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [organismeData, setOrganismeData] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const updatedAgentData = {
        ...agentData,
      };

      const response = await axios.put(
        `http://localhost:5000/agentsprets/${updatedAgentData.id}`,
        updatedAgentData,
        config
      );
      if (response.status === 200) {
        setAgentData(updatedAgentData);
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
    if (!agentData) {
      console.error("Agent data is not available");
      return;
    }

    const formData = new FormData();
    formData.append("photo", selectedFile);
    try {
      const response = await axios.post(
        `http://localhost:5000/upload/photo?userId=${agentData.userId}`,
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
      let organismePretId;
      axios
        .get(`http://localhost:5000/agentsprets/user/${decodedToken.userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          setAgentData(response.data);
          organismePretId = response.data.organismePretId;
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
          console.log("Agent data: ", agentData);
          return axios.get(
            `http://localhost:5000/organismesprets/${organismePretId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        })
        .then((response) => {
          setOrganismeData(response.data);
        })
        .catch((error) => {
          console.error("An error occurred while fetching agent data: ", error);
        });
    }
  }, [token]);

  if (!agentData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="main">
      <section className="signup">
        <div className="container">
          <div className="signup-content">
            <div className="agent-profile">
              <div className="profile-photo-wrapper">
                <img
                  src={`http://localhost:5000/${userData.photo}`}
                  alt="agent"
                  className="agent-profile-img profile-photo"
                />
              </div>
              {!userData.photo && (
                <>
                  <label htmlFor="file-upload" className="custom-file-upload">
                    Choose File
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    onChange={handleFileChange}
                    className="file-input"
                  />
                  <button onClick={handleUpload} className="upload-button">
                    Upload
                  </button>
                </>
              )}
              <h2 className="form-title">
                {agentData.nom} {agentData.prenom}
              </h2>
              <div className="form-group">
                <p>CIN: {agentData.cin}</p>
              </div>
              <div className="form-group">
                <p>Phone: {agentData.telephone}</p>
              </div>
              <div className="form-group">
                <p>Address: {agentData.adresse}</p>
              </div>
              <div className="form-group">
                <p>License Number: {agentData.numLicence}</p>
              </div>
              <div className="form-group">
                <p>Years of Experience: {agentData.anneesExperience}</p>
              </div>
              <div className="form-group">
                <p>Diploma: {agentData.diplome}</p>
              </div>
              {organismeData && (
                <div className="form-group">
                  <p>
                    Organisme:{" "}
                    <Link to={`/agent/organisme/${organismeData.id}`}>
                      {organismeData.nom}
                    </Link>
                  </p>
                </div>
              )}
              <div className="form-group">
                <button
                  onClick={() => {
                    setModalIsOpen(true);
                  }}
                  className="form-submit"
                >
                  Update Profile
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
                  <h2 className="form-title">Update Profile</h2>
                  <div className="form-group">
                    <label htmlFor="name">Nom</label>
                    <input
                      type="text"
                      className="form-input"
                      name="name"
                      id="name"
                      placeholder="Nom"
                      value={agentData.nom}
                      onChange={(e) =>
                        setAgentData({ ...agentData, nom: e.target.value })
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
                      value={agentData.prenom}
                      onChange={(e) =>
                        setAgentData({ ...agentData, prenom: e.target.value })
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
                      value={agentData.cin}
                      onChange={(e) =>
                        setAgentData({ ...agentData, cin: e.target.value })
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
                      value={agentData.adresse}
                      onChange={(e) =>
                        setAgentData({ ...agentData, adresse: e.target.value })
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
                      value={agentData.telephone}
                      onChange={(e) =>
                        setAgentData({
                          ...agentData,
                          telephone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="numLicence">Numéro de licence</label>
                    <input
                      type="text"
                      className="form-input"
                      name="numLicence"
                      id="numLicence"
                      placeholder="Numéro de licence"
                      value={agentData.numLicence}
                      onChange={(e) =>
                        setAgentData({
                          ...agentData,
                          numLicence: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="anneesExperience">
                      Années d'expérience
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      name="anneesExperience"
                      id="anneesExperience"
                      placeholder="Années d'expérience"
                      value={agentData.anneesExperience}
                      onChange={(e) =>
                        setAgentData({
                          ...agentData,
                          anneesExperience: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="diplome">Diplôme</label>
                    <input
                      type="text"
                      className="form-input"
                      name="diplome"
                      id="diplome"
                      placeholder="Diplôme"
                      value={agentData.diplome}
                      onChange={(e) =>
                        setAgentData({ ...agentData, diplome: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label
                      htmlFor="photo-upload"
                      className="custom-file-upload"
                    >
                      Choose New Photo
                    </label>
                    <input
                      type="file"
                      id="photo-upload"
                      onChange={handleFileChange}
                      className="file-input"
                    />
                    <button onClick={handleUpload} className="upload-button">
                      Upload New Photo
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

export default AgentPretProfile;
