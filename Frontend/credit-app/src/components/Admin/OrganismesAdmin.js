import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import styles from "./OrganismesAdmin.module.css";
import ReactModal from "react-modal";
import "bootstrap/dist/css/bootstrap.min.css";

ReactModal.setAppElement("#root");

const OrganismesAdmin = () => {
  const { token } = useContext(AuthContext);
  const [organismes, setOrganismes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrganisme, setSelectedOrganisme] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchOrganismes = async () => {
      const response = await axios.get(
        "http://localhost:5000/organismesprets",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrganismes(response.data);
    };

    fetchOrganismes();
  }, [token]);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleEditClick = (organisme) => {
    setSelectedOrganisme(organisme);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    await axios.delete(`http://localhost:5000/organismesprets/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setOrganismes(organismes.filter((organisme) => organisme.id !== id));
  };

  const handleCreateClick = () => {
    setSelectedOrganisme(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { nom, adresse, logo, siteWeb, telephone, email } =
      event.target.elements;
    const organisme = {
      nom: nom.value,
      adresse: adresse.value,
      logo: logo.value,
      siteWeb: siteWeb.value,
      telephone: telephone.value,
      email: email.value,
    };

    if (selectedOrganisme) {
      await axios.put(
        `http://localhost:5000/organismesprets/${selectedOrganisme.id}`,
        organisme,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } else {
      const response = await axios.post(
        "http://localhost:5000/organismesprets",
        organisme,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrganismes([...organismes, response.data]);
    }

    setIsModalOpen(false);
  };

  const paginatedOrganismes = organismes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={styles.container}>
      <button className={styles.createButton} onClick={handleCreateClick}>
        Ajouter
      </button>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Logo</th>
            <th>Nom</th>
            <th>Adresse</th>
            <th>Site Web</th>
            <th>Téléphone</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedOrganismes.map((organisme) => (
            <tr key={organisme.id}>
              <td>
                <img
                  src={organisme.logo}
                  alt={organisme.nom}
                  className={styles.logo}
                />
              </td>
              <td>{organisme.nom}</td>
              <td>{organisme.adresse}</td>
              <td>{organisme.siteWeb}</td>
              <td>{organisme.telephone}</td>
              <td>{organisme.email}</td>
              <td>
                <button
                  className={styles.editButton}
                  onClick={() => handleEditClick(organisme)}
                >
                  Modifier
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteClick(organisme.id)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.pagination}>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Précédent
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(organismes.length / itemsPerPage)}
        >
          Suivant
        </button>
      </div>

      {isModalOpen && (
        <ReactModal isOpen={isModalOpen} onRequestClose={handleCloseModal}>
          <div className="container">
            <h2 className="my-3">Détails</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nom">Nom</label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="adresse">Adresse</label>
                <input
                  type="text"
                  id="adresse"
                  name="adresse"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="logo">Logo</label>
                <input
                  type="text"
                  id="logo"
                  name="logo"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="siteWeb">Site Web</label>
                <input
                  type="text"
                  id="siteWeb"
                  name="siteWeb"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="telephone">Téléphone</label>
                <input
                  type="text"
                  id="telephone"
                  name="telephone"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  className="form-control"
                />
              </div>
              <button type="submit" className="btn btn-primary mt-3">
                Créer
              </button>
            </form>
          </div>
        </ReactModal>
      )}
    </div>
  );
};

export default OrganismesAdmin;
