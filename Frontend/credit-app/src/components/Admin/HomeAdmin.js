import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Label,
  Cell,
} from "recharts";
import styles from "./HomeAdmin.module.css";
import { counter } from "@fortawesome/fontawesome-svg-core";

function HomeAdmin() {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [organismesPrets, setOrganismesPrets] = useState([]);
  const [clients, setClients] = useState([]);
  const roleColors = {
    admin: "lightblue",
    client: "lightgreen",
    courtier: "lightcoral",
    agentPret: "violet",
  };

  useEffect(() => {
    const fetchData = async () => {
      const usersResponse = await axios.get("http://localhost:5000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(usersResponse.data);

      const organismesPretsResponse = await axios.get(
        "http://localhost:5000/organismesprets",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrganismesPrets(organismesPretsResponse.data);

      const clientsResponse = await axios.get("http://localhost:5000/clients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(clientsResponse.data);
    };

    fetchData();
  }, [token]);

  const userCounts = users.reduce((counts, user) => {
    counts[user.role] = (counts[user.role] || 0) + 1;
    return counts;
  }, {});

  const totalUsers = Object.values(userCounts).reduce(
    (total, count) => total + count,
    0
  );

  const clientAnalysis = {
    clientsByGender: clients.reduce((counts, client) => {
      counts[client.gender] = (counts[client.gender] || 0) + 1;
      return counts;
    }, {}),
    clientsByAgeRange: clients.reduce((counts, client) => {
      const age =
        new Date().getFullYear() - new Date(client.dateNaissance).getFullYear();
      const ageRange =
        age >= 50
          ? "50+"
          : age >= 40
          ? "40-49"
          : age >= 30
          ? "30-39"
          : age >= 20
          ? "20-29"
          : "Under 20";
      counts[ageRange] = (counts[ageRange] || 0) + 1;
      return counts;
    }, {}),
  };

  let clientsByGenderArray = Object.entries(clientAnalysis.clientsByGender).map(
    ([gender, count]) => ({ gender, count })
  );
  let clientsByAgeRangeArray = Object.entries(
    clientAnalysis.clientsByAgeRange
  ).map(([ageRange, count]) => ({ ageRange, count }));

  const organismesPretsCount = organismesPrets.length;
  let clientsByGenderData = clientsByGenderArray.map((gender) => ({
    name: gender.gender,
    count: gender.count,
  }));
  let clientsByAgeRangeData = clientsByAgeRangeArray.map((range) => ({
    name: range.ageRange,
    count: range.count,
  }));
  return (
    <div className={styles.container}>
      <h1
        style={{
          textAlign: "center",
          color: "black",
          fontSize: "30px",
          fontWeight: "bold",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        Bienvenue, Admin!
      </h1>

      <div className={styles.dashboard}>
        <div
          className={styles.card}
          style={{
            baackgroundColor: "lightgrey",
          }}
        >
          <h2>Nombre total d'utilisateurs</h2>
          <p
            style={{
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            {totalUsers}
          </p>
        </div>
        {Object.entries(userCounts).map(([role, count]) => (
          <div
            key={role}
            className={styles.card}
            style={{
              backgroundColor: roleColors[role],
            }}
          >
            <h2>{role}</h2>
            <p
              style={{
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              {count}
            </p>
          </div>
        ))}
      </div>
      <hr />

      {clientAnalysis && (
        <div>
          <h2>Distribution des clients par tranche d'âge</h2>
          <BarChart width={500} height={300} data={clientsByAgeRangeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
            <Label value="Tranches d'âge" offset={0} position="insideBottom" />
          </BarChart>

          <h2>Distribution des clients par genre</h2>
          <BarChart width={500} height={300} data={clientsByGenderData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count">
              {clientsByGenderData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.name === "female" ? "pink" : "blue"}
                />
              ))}
            </Bar>
            <Label value="Genre" offset={0} position="insideBottom" />
          </BarChart>
        </div>
      )}
      <hr />

      <div
        className={styles.card}
        style={{
          backgroundColor: "lightgreen",
        }}
      >
        <h2>Organismes de prêts</h2>
        <p
          style={{
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          {organismesPretsCount}
        </p>
      </div>
    </div>
  );
}

export default HomeAdmin;
