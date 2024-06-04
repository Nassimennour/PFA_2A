import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./AgentPretOrganism.module.css";
import { AuthContext } from "../../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faGlobe,
  faPhone,
  faEnvelope,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

const AgentPretOrganism = () => {
  const { organismePretId } = useParams();
  const [organismePret, setOrganismePret] = useState(null);
  const [agents, setAgents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const agentsPerPage = 5;
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrganismePret = async () => {
      const response = await axios.get(
        `http://localhost:5000/organismesprets/${organismePretId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrganismePret(response.data);
    };

    const fetchAgents = async () => {
      const response = await axios.get(
        `http://localhost:5000/agentsprets/organisme/${organismePretId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const sortedAgents = response.data.sort((a, b) => {
        const nameA = a.nom.toLowerCase() + a.prenom.toLowerCase();
        const nameB = b.nom.toLowerCase() + b.prenom.toLowerCase();
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
      });
      setAgents(sortedAgents);
    };

    fetchOrganismePret();
    fetchAgents();
  }, [organismePretId]);

  const totalPages = Math.ceil(agents.length / agentsPerPage);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Mon Organisme</h1>
      {organismePret && (
        <>
          <img
            src={organismePret.logo}
            alt={organismePret.nom}
            className={styles.logo}
          />
          <h2 className={styles.title}>{organismePret.nom}</h2>
          <p className={styles.info}>
            <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.icon} />
            {organismePret.adresse}
          </p>
          <p className={styles.info}>
            <FontAwesomeIcon icon={faGlobe} className={styles.icon} />
            <a href={organismePret.siteWeb}>{organismePret.siteWeb}</a>
          </p>
          <p className={styles.info}>
            <FontAwesomeIcon icon={faPhone} className={styles.icon} />
            {organismePret.telephone}
          </p>
          <p className={styles.info}>
            <FontAwesomeIcon icon={faEnvelope} className={styles.icon} />
            {organismePret.email}
          </p>
          <button
            className={styles.agentsButton}
            onClick={() => setShowModal(true)}
          >
            <FontAwesomeIcon icon={faUsers} className={styles.icon} /> Les
            Agents
          </button>
        </>
      )}

      {showModal && (
        <div className={styles.modal}>
          <button
            className={styles.closeButton}
            onClick={() => setShowModal(false)}
          >
            &times;
          </button>
          {agents
            .slice(
              currentPage * agentsPerPage,
              (currentPage + 1) * agentsPerPage
            )
            .map((agent, index) => (
              <div key={index} className={styles.agent}>
                <p>
                  {agent.nom} {agent.prenom}
                </p>
              </div>
            ))}
          <div className={styles.pagination}>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 0}
            >
              Précédent
            </button>
            <button onClick={() => setCurrentPage(currentPage + 1)}>
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentPretOrganism;
