import step3Styles from "./Step4Courtier.module.css";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";

function Step4Courtier({
  clientId,
  setStep,
  setDemandePretId,
  organismePretId,
  courtierId,
}) {
  const [montant, setMontant] = useState("");
  const [duree, setDuree] = useState("");
  const [currency, setCurrency] = useState("MAD");
  const { token } = useContext(AuthContext);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [interestRate, setInterestRate] = useState(null);
  const [customDuree, setCustomDuree] = useState(null);
  const [mensualite, setMensualite] = useState(null);

  useEffect(() => {
    if (montant && (duree || customDuree) && interestRate) {
      let r = interestRate / 100 / 12;
      let PV = montant;
      let n = duree === "more" ? customDuree * 12 : duree * 12;

      let P = (r * PV) / (1 - Math.pow(1 + r, -n));

      setMensualite(P);
    }
  }, [montant, duree, customDuree, interestRate]);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      const EXCHANGE_RATES_TO_MAD = {
        USD: 9.93,
        EUR: 10.79,
        GBP: 12.68,
        MAD: 1,
      };

      const rate = EXCHANGE_RATES_TO_MAD[currency];
      if (rate) {
        setExchangeRate(rate);
      } else {
        console.error(`No exchange rate found for currency: ${currency}`);
      }
    };

    fetchExchangeRate();
  }, [currency]);

  useEffect(() => {
    const fetchInterestRate = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/interets/organisme/${organismePretId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const interestRates = response.data;
        const rate = interestRates.find((rate) => rate.duree === duree);
        setInterestRate(rate ? rate.interestRate : null);
      } catch (error) {
        console.error("Failed to fetch interest rate:", error);
      }
    };

    if (organismePretId && duree) {
      fetchInterestRate();
    }
  }, [organismePretId, duree, token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const updatedMontant = montant * exchangeRate;
      const demandePret = {
        montant: updatedMontant,
        duree,
        organismePretId: organismePretId,
        clientId: clientId,
        interestRate: interestRate,
        courtierId: courtierId,
      };
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios
        .post("http://localhost:5000/demandesprets", demandePret, config)
        .then((response) => {
          setDemandePretId(response.data.id);
        });
      setStep(5);
      console.log("Form submitted successfully");
    } catch (error) {
      console.error("Failed to submit form", error);
    }
  };

  return (
    <div className={step3Styles.container}>
      <h2>Informations du Prêt</h2>
      <form onSubmit={handleSubmit} className={step3Styles.form}>
        <label>
          Montant:
          <input
            type="number"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
            required
          />
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            required
            className={step3Styles.select}
          >
            <option value="MAD">MAD (DH)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </label>
        <div className="form-group">
          <label htmlFor="duree">Durée:</label>
          <select
            id="duree"
            className={step3Styles.select}
            value={duree}
            onChange={(e) => {
              setDuree(e.target.value);
              if (e.target.value === "more") {
                setShowCustomInput(true);
              } else {
                setShowCustomInput(false);
              }
            }}
          >
            <option value="10">10 ans</option>
            <option value="15">15 ans</option>
            <option value="20">20 ans</option>
            <option value="25">25 ans</option>
            <option value="30">30 ans</option>
            <option value="more">Autre</option>
          </select>
          {showCustomInput && (
            <input
              type="number"
              placeholder="Enter custom duration (ans)"
              onChange={(e) => {
                setCustomDuree(e.target.value);
              }}
            />
          )}
          {interestRate && (
            <p className={step3Styles.p}>
              Le taux d'intérêt est de {interestRate}%
            </p>
          )}
          {mensualite && (
            <p className={step3Styles.p}>
              La mensualité est de {mensualite.toFixed(2)} {currency}
            </p>
          )}
        </div>
        <button type="submit">Continuer</button>
      </form>
    </div>
  );
}

export default Step4Courtier;
