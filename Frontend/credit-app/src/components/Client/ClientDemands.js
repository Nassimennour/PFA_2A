import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useParams } from "react-router-dom";
import styles from "./ClientDemands.module.css";
import axios from "axios";

const JUDGMENT_STATUS_OPTIONS_FR = {
  pending: "en attente",
  accepted: "accepté",
  rejected: "rejeté",
};
const ClientDemands = () => {
  const [demands, setDemands] = useState([]);
  const [organismesPrets, setOrganismesPrets] = useState([]);
  const { token } = useContext(AuthContext);
  const { clientId } = useParams();
  const [currentPage, setCurrentPage] = useState(0);
  const demandsPerPage = 10;

  useEffect(() => {
    fetch(`http://localhost:5000/demandesprets/client/${clientId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const sortedDemands = data.sort(
          (a, b) => new Date(b.dateSoumission) - new Date(a.dateSoumission)
        );
        setDemands(sortedDemands);
      });

    axios
      .get("http://localhost:5000/organismesprets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setOrganismesPrets(response.data);
      });
  }, [clientId, token]);

  const totalPages = Math.ceil(demands.length / demandsPerPage);

  return (
    <div className={styles["container-table"]}>
      <table>
        <thead>
          <tr>
            <th>Organisme de Prêt</th>
            <th>Montant (DH)</th>
            <th>Durée (Années)</th>
            <th>Date de Soumission</th>
            <th>Status</th>
            <th>Commentaire</th>
          </tr>
        </thead>
        <tbody>
          {demands
            .slice(
              currentPage * demandsPerPage,
              (currentPage + 1) * demandsPerPage
            )
            .map((demand, index) => {
              const organismePret = organismesPrets.find(
                (organisme) => organisme.id === demand.organismePretId
              );
              return (
                <tr key={index} className={styles[demand.judgment]}>
                  <td>{organismePret ? organismePret.nom : "N/A"}</td>
                  <td>{demand.montant}</td>
                  <td>{demand.duree}</td>
                  <td>
                    {new Date(demand.dateSoumission).toLocaleDateString()}
                  </td>
                  <td>{JUDGMENT_STATUS_OPTIONS_FR[demand.judgment]}</td>
                  <td>{demand.comment}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <div className={styles.pagination}>
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 0}
        >
          Précédent
        </button>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default ClientDemands;
