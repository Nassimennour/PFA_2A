import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import styles from "./AdminUsers.module.css";

function AdminUsers() {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get("http://localhost:5000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    };

    fetchUsers();
  }, [token]);
  const handleDetailsClick = async (user) => {
    let response;
    switch (user.role) {
      case "client":
        response = await axios.get(
          `http://localhost:5000/clients/userId/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        break;
      case "courtier":
        response = await axios.get(
          `http://localhost:5000/courtiers/user/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        break;
      case "agentPret":
        response = await axios.get(
          `http://localhost:5000/agentsprets/user/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        break;
      default:
        response = null;
    }

    setSelectedUser(response.data);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Photo</th>
            <th>Login</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((user) => (
            <tr key={user.id}>
              <td>
                <img
                  src={`http://localhost:5000/${user.photo}`}
                  alt={user.username}
                  className={styles.photo}
                />
              </td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button
                  onClick={() => handleDetailsClick(user)}
                  style={{
                    backgroundColor: "blue",
                    color: "white",
                    padding: "5px",
                    borderRadius: "5px ",
                  }}
                >
                  Détails
                </button>
                <button
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    marginLeft: "10px",
                    padding: "5px",
                    borderRadius: "5px ",
                  }}
                  onClick={() => {
                    axios
                      .delete(`http://localhost:5000/users/${user.id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                      })
                      .then((res) => {
                        console.log(res);
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  }}
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
          disabled={currentPage === Math.ceil(users.length / itemsPerPage)}
        >
          Suivant
        </button>
      </div>

      {selectedUser && (
        <div className={styles.modal}>
          <button
            onClick={() => setSelectedUser(null)}
            className={styles.closeButton}
          >
            X
          </button>
          <h2>Détails</h2>
          {Object.entries(selectedUser).map(([key, value]) => (
            <div key={key} className={styles.detail}>
              <span className={styles.label}>{key}:</span>
              <span>{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
