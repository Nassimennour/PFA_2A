import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import styles from "./Step5Courtier.module.css";
import { AuthContext } from "../../contexts/AuthContext";

const EXCHANGE_RATES_TO_MAD = {
  USD: 9.93,
  EUR: 10.79,
  GBP: 12.68,
  MAD: 1,
};
const CREDIT_HISTORY_OPTIONS = ["Excellent", "Good", "Fair", "Poor"];
const EMPLOYMENT_STATUS_OPTIONS = [
  "Employed",
  "Unemployed",
  "Self-employed",
  "Retired",
  "Student",
  "Other",
];

function Step5Courtier({
  setStep,
  demandePretId,
  clientId,
  setSelectedDossierId,
}) {
  const { token } = useContext(AuthContext);
  const [currency, setCurrency] = useState("MAD");
  const [salary, setSalary] = useState("");
  const [totalExpenses, setTotalExpenses] = useState("");
  const [rent, setRent] = useState("");
  const [utilities, setUtilities] = useState("");
  const [groceries, setGroceries] = useState("");
  const [transportation, setTransportation] = useState("");
  const [additionalIncome, setAdditionalIncome] = useState("");
  const [totalAssets, setTotalAssets] = useState("");
  const [totalLiabilities, setTotalLiabilities] = useState("");
  const [creditHistory, setCreditHistory] = useState("Excellent");
  const [employmentStatus, setEmploymentStatus] = useState("Employed");

  useEffect(() => {
    const fetchDefaultValues = async () => {
      try {
        const { data: lastDemande } = await axios.get(
          `http://localhost:5000/demandesprets/last/client/${clientId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { data: defaultValues } = await axios.get(
          `http://localhost:5000/dossiersprets/demandePret/${lastDemande.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSalary(defaultValues.salary || "");
        setTotalExpenses(defaultValues.totalExpenses || "");
        setRent(defaultValues.rent || "");
        setUtilities(defaultValues.utilities || "");
        setGroceries(defaultValues.groceries || "");
        setTransportation(defaultValues.transportation || "");
        setAdditionalIncome(defaultValues.additionalIncome || "");
        setTotalAssets(defaultValues.totalAssets || "");
        setTotalLiabilities(defaultValues.totalLiabilities || "");
        setCreditHistory(defaultValues.creditHistory || "");
        setEmploymentStatus(defaultValues.employmentStatus || "");
      } catch (error) {
        console.error(error);
      }
    };

    fetchDefaultValues();
  }, [clientId, token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const dossierPret = {
      salary: salary * EXCHANGE_RATES_TO_MAD[currency],
      totalExpenses: totalExpenses * EXCHANGE_RATES_TO_MAD[currency],
      rent: rent * EXCHANGE_RATES_TO_MAD[currency],
      utilities: utilities * EXCHANGE_RATES_TO_MAD[currency],
      groceries: groceries * EXCHANGE_RATES_TO_MAD[currency],
      transportation: transportation * EXCHANGE_RATES_TO_MAD[currency],
      additionalIncome: additionalIncome * EXCHANGE_RATES_TO_MAD[currency],
      totalAssets: totalAssets * EXCHANGE_RATES_TO_MAD[currency],
      totalLiabilities: totalLiabilities * EXCHANGE_RATES_TO_MAD[currency],
      creditHistory,
      employmentStatus,
      demandePretId,
    };
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    await axios
      .post("http://localhost:5000/dossiersprets", dossierPret, config)
      .then((response) => {
        setSelectedDossierId(response.data.id);
      });
    setStep(7);
  };

  return (
    <form className={styles.Step4} onSubmit={handleSubmit}>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className={styles.currencySelect}
      >
        <option value="USD" className={styles.optionUSD}>
          🇺🇸 USD
        </option>
        <option value="EUR" className={styles.optionEUR}>
          🇪🇺 EUR
        </option>
        <option value="GBP" className={styles.optionGBP}>
          🇬🇧 GBP
        </option>
        <option value="MAD" className={styles.optionMAD}>
          🇲🇦 MAD
        </option>
      </select>
      <section>
        <h2>Revenu</h2>
        <label htmlFor="employmentStatus">
          Quel est votre statut d'emploi ?
        </label>

        <select
          id="employmentStatus"
          value={employmentStatus}
          onChange={(e) => setEmploymentStatus(e.target.value)}
        >
          {EMPLOYMENT_STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <label htmlFor="salary">Salaire</label>
        <input
          id="salary"
          type="number"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          disabled={employmentStatus === "Unemployed"}
        />
        <label htmlFor="additionalIncome">Revenu supplémentaire</label>
        <input
          id="additionalIncome"
          type="number"
          value={additionalIncome}
          onChange={(e) => setAdditionalIncome(e.target.value)}
        />
      </section>
      <section>
        <h2>Dépenses</h2>
        <label htmlFor="totalExpenses">Total des dépenses par mois</label>
        <input
          id="totalExpenses"
          type="number"
          value={totalExpenses}
          onChange={(e) => setTotalExpenses(e.target.value)}
        />

        <label htmlFor="rent">Loyer</label>
        <input
          id="rent"
          type="number"
          value={rent}
          onChange={(e) => setRent(e.target.value)}
        />

        <label htmlFor="utilities">Services publics</label>
        <input
          id="utilities"
          type="number"
          value={utilities}
          onChange={(e) => setUtilities(e.target.value)}
        />

        <label htmlFor="groceries">Alimentation</label>
        <input
          id="groceries"
          type="number"
          value={groceries}
          onChange={(e) => setGroceries(e.target.value)}
        />

        <label htmlFor="transportation">Transport</label>
        <input
          id="transportation"
          type="number"
          value={transportation}
          onChange={(e) => setTransportation(e.target.value)}
        />
      </section>
      <section>
        <h2>Actifs et Passifs</h2>
        <label htmlFor="totalAssets">Quel est le total de vos actifs ?</label>
        <input
          id="totalAssets"
          type="number"
          value={totalAssets}
          onChange={(e) => setTotalAssets(e.target.value)}
        />
        <label htmlFor="totalLiabilities">
          Quel est le total de vos passifs ?
        </label>
        <input
          id="totalLiabilities"
          type="number"
          value={totalLiabilities}
          onChange={(e) => setTotalLiabilities(e.target.value)}
        />
      </section>
      <section>
        <h2>Autres Infos</h2>
        <label htmlFor="creditHistory">
          Comment est votre historique de crédit ?
        </label>
        <select
          id="creditHistory"
          value={creditHistory}
          onChange={(e) => setCreditHistory(e.target.value)}
        >
          {CREDIT_HISTORY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </section>
      <div className={styles.buttonContainer}>
        <button type="submit">Suivant</button>
        <button
          type="reset"
          onClick={() => {
            setCurrency("MAD");
            setSalary("");
            setTotalExpenses("");
            setRent("");
            setUtilities("");
            setGroceries("");
            setTransportation("");
            setAdditionalIncome("");
            setTotalAssets("");
            setTotalLiabilities("");
            setCreditHistory("");
            setEmploymentStatus("");
          }}
        >
          Réinitialiser
        </button>
      </div>
    </form>
  );
}

export default Step5Courtier;
