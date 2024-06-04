import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import styles from "./DemandesCourtier.module.css";

function DemandesCourtier() {
  const { token } = useContext(AuthContext);
  const { courtierId } = useParams();
  const [demandes, setDemandes] = useState([]);
  const [show, setShow] = useState("aSoumettre");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDemandes = async () => {
      const response = await axios.get(
        `http://localhost:5000/demandesprets/courtier/clients/${courtierId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDemandes(response.data);
    };

    fetchDemandes();
  }, [courtierId]);

  const aSoumettre = demandes.filter(
    (demande) => demande.montant === null && demande.duree === null
  );
  const soumises = demandes.filter(
    (demande) => demande.montant !== null && demande.duree !== null
  );

  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={() => setShow("aSoumettre")}>
          A soumettre
        </button>
        <button className={styles.button} onClick={() => setShow("soumises")}>
          Soumises
        </button>
      </div>
      {show === "aSoumettre" && (
        <div className={styles.tableContainer}>
          {aSoumettre.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Client</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {aSoumettre.map((demande) => (
                  <tr key={demande.id}>
                    <td>
                      {demande.Client
                        ? `${demande.Client.nom} ${demande.Client.prenom}`
                        : "Client not found"}
                    </td>
                    <td>
                      <button
                        className={styles.createButton}
                        onClick={() =>
                          navigate(`/courtier/nouvelle-demande/${courtierId}`)
                        }
                      >
                        Créer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className={styles.emptyMessage}>
              Il n'y a pas de demandes à soumettre.
            </div>
          )}
        </div>
      )}

      {show === "soumises" && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Client</th>
                <th>Montant (DH)</th>
                <th>Durée (Années)</th>
                <th>Organisme de prêt</th>
                <th>Taux d'intérêt</th>
                <th>Date de soumission</th>
                <th>Jugement</th>
                <th>Commentaire</th>
              </tr>
            </thead>
            <tbody>
              {soumises.map((demande) => (
                <tr key={demande.id} className={styles[demande.judgment]}>
                  <td>
                    {demande.Client.nom} {demande.Client.prenom}
                  </td>
                  <td>{demande.montant}</td>
                  <td>{demande.duree}</td>
                  <td>{demande.OrganismePret.nom}</td>
                  <td>{demande.interestRate}</td>
                  <td>
                    {new Date(demande.dateSoumission).toLocaleDateString()}
                  </td>
                  <td>{demande.judgment}</td>
                  <td>
                    {demande.comment ? demande.comment.slice(0, 20) : ""}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DemandesCourtier;
