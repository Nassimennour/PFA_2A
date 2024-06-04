import React, { useState, useEffect, useContext } from "react";
import styles from "./Step1.module.css";
import axios from "axios";
import nouvelleDemandeStyles from "./NouvelleDemande.module.css";
import progressBarStyles from "./ProgressBar.module.css";
import step2Styles from "./Step2.module.css";
import step3Styles from "./Step3.module.css";
import { AuthContext } from "../../contexts/AuthContext";
import { Carousel } from "react-responsive-carousel";
import { jwtDecode } from "jwt-decode";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import Step4 from "./Step4";
import Step5 from "./Step5";
import DelegateCourtier from "./DelegateCourtier";
import BienImmoForm from "./BienImmoForm";
import FinalStep from "./FinalStep";

export function ProgressBar({ currentStep, totalSteps }) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className={progressBarStyles.progressBar}>
      <div
        className={progressBarStyles.progress}
        style={{
          width: `${progress}%`,
          backgroundColor: `rgb(${255 - progress * 2.55}, ${
            progress * 2.55
          }, 0)`,
        }}
      />
    </div>
  );
}

export default function NouvelleDemande() {
  const [step, setStep] = React.useState(1);
  const [selectedOrganismeId, setSelectedOrganismeId] = React.useState(null);
  const [demandePretId, setDemandePretId] = useState(null);
  const [clientId, clientIdSetter] = useState(null);
  const [selectedDossierId, setSelectedDossierId] = useState(null);
  const [choice, setChoice] = useState(null);

  return (
    <div className={nouvelleDemandeStyles.container}>
      <h2 className={nouvelleDemandeStyles.title}>Créer Nouvelle Demande</h2>
      <div className={nouvelleDemandeStyles.form}>
        {step === 1 && <Step1 setStep={setStep} setChoice={setChoice} />}
        {step === 2 && (
          <Step2
            setStep={setStep}
            setSelectedOrganismeId={setSelectedOrganismeId}
          />
        )}
        {step === 3 && (
          <Step3
            setStep={setStep}
            selectedOrganismeId={selectedOrganismeId}
            setDemandePretId={setDemandePretId}
            clientIdSetter={clientIdSetter}
          />
        )}
        {step === 3.5 && (
          <BienImmoForm setStep={setStep} demandePretId={demandePretId} />
        )}
        {step === 4 && (
          <Step4
            setStep={setStep}
            demandePretId={demandePretId}
            clientId={clientId}
            setSelectedDossierId={setSelectedDossierId}
          />
        )}
        {step === 5 && (
          <Step5
            setStep={setStep}
            organismePretId={selectedOrganismeId}
            selectedDossierId={selectedDossierId}
          />
        )}

        {step === 4.5 && (
          <DelegateCourtier
            setStep={setStep}
            demandePretId={demandePretId}
            clientIdSetter={clientIdSetter}
            setDemandePretId={setDemandePretId}
          />
        )}
        {step === 6 && (
          <FinalStep
            setStep={setStep}
            selectedDossierId={selectedDossierId}
            choice={choice}
            demandePretId={demandePretId}
            clientId={clientId}
          />
        )}
      </div>
      <ProgressBar currentStep={step} totalSteps={6} />
    </div>
  );
}

export function Step1({ setStep, setChoice }) {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.card}>
        <h2 className={styles.cardHeader}>Travailler seul</h2>
        <p className={styles.cardText}>
          Créez votre demande de prêt vous-même.
        </p>
        <button
          className={styles.cardButton}
          onClick={() => {
            setStep(2);
            setChoice(1);
          }}
        >
          Continuer
        </button>
      </div>
      <div className={styles.card}>
        <h2 className={styles.cardHeader}>Déléguer à un courtier</h2>
        <p className={styles.cardText}>
          Laissez un courtier créer votre demande de prêt.
        </p>
        <button
          className={styles.cardButton}
          onClick={() => {
            setStep(4.5);
            setChoice(2);
          }}
        >
          Continuer
        </button>
      </div>
    </div>
  );
}
export function Step2({ setStep, setSelectedOrganismeId }) {
  const [organismesPrets, setOrganismesPrets] = useState([]);
  const { token } = useContext(AuthContext);

  const arrowPrevStyles = {
    position: "absolute",
    zIndex: 2,
    top: "calc(50% - 15px)",
    left: 0, // This will position the arrow on the left
    width: 30,
    height: 30,
    cursor: "pointer",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    color: "#333",
  };

  const arrowNextStyles = {
    position: "absolute",
    zIndex: 2,
    top: "calc(50% - 15px)",
    right: 0, // This will position the arrow on the right
    width: 30,
    height: 30,
    cursor: "pointer",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    color: "#333",
  };
  const ArrowPrev = ({ onClickHandler, hasPrev, label }) => (
    <button
      onClick={(event) => {
        event.preventDefault();
        onClickHandler();
      }}
      disabled={!hasPrev}
      aria-label={label}
      style={arrowPrevStyles}
      className="carousel-arrow"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        className="bi bi-chevron-left"
        viewBox="0 0 16 16"
      >
        <path
          fillRule="evenodd"
          d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
        />
      </svg>
    </button>
  );

  const ArrowNext = ({ onClickHandler, hasNext, label }) => (
    <button
      onClick={(event) => {
        event.preventDefault();
        onClickHandler();
      }}
      disabled={!hasNext}
      aria-label={label}
      style={arrowNextStyles}
      className="carousel-arrow"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        className="bi bi-chevron-right"
        viewBox="0 0 16 16"
      >
        <path
          fillRule="evenodd"
          d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
        />
      </svg>
    </button>
  );

  useEffect(() => {
    axios
      .get("http://localhost:5000/organismesprets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setOrganismesPrets(response.data));
  }, [token]);
  return (
    <div className={step2Styles.container}>
      <h2 className={step2Styles.title}>Choisissez un organisme de prêt</h2>
      <div style={{ position: "relative", overflow: "visible" }}>
        <Carousel
          showThumbs={false}
          showStatus={false}
          centerMode
          centerSlidePercentage={33.33}
          showArrows
          infiniteLoop
          renderArrowPrev={(onClickHandler, hasPrev, label) => (
            <ArrowPrev
              onClickHandler={onClickHandler}
              hasPrev={hasPrev}
              label={label}
            />
          )}
          renderArrowNext={(onClickHandler, hasNext, label) => (
            <ArrowNext
              onClickHandler={onClickHandler}
              hasNext={hasNext}
              label={label}
            />
          )}
        >
          {organismesPrets.map((organisme, index) => (
            <div
              key={organisme.id}
              className={`${step2Styles.card} ${
                step2Styles["card" + ((index % 3) + 1)]
              }`}
            >
              <img
                src={organisme.logo}
                alt={organisme.nom}
                className={step2Styles.logo}
              />
              <h3>{organisme.nom}</h3>
              <p>{organisme.adresse}</p>
              <p className={step2Styles.contactInfo}>{organisme.email}</p>
              <p className={step2Styles.contactInfo}>{organisme.telephone}</p>
              <button
                className={step2Styles.cardButton}
                onClick={() => {
                  setStep(3);
                  setSelectedOrganismeId(organisme.id);
                }}
              >
                Continuer
              </button>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}

export function Step3({
  selectedOrganismeId,
  setStep,
  setDemandePretId,
  clientIdSetter,
}) {
  const [montant, setMontant] = useState("");
  const [duree, setDuree] = useState("");
  const [currency, setCurrency] = useState("MAD");
  const [clientId, setClientId] = useState("");
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
    const fetchClientId = async () => {
      const { userId } = jwtDecode(token);
      const response = await axios.get(
        `http://localhost:5000/clients/userId/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setClientId(response.data.id);
      clientIdSetter(response.data.id);
    };

    fetchClientId();
  }, [token]);

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
          `http://localhost:5000/interets/organisme/${selectedOrganismeId}`,
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

    if (selectedOrganismeId && duree) {
      fetchInterestRate();
    }
  }, [selectedOrganismeId, duree, token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const updatedMontant = montant * exchangeRate;
      const demandePret = {
        montant: updatedMontant,
        duree,
        organismePretId: selectedOrganismeId,
        clientId: clientId,
        interestRate: interestRate,
      };
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios
        .post("http://localhost:5000/demandesprets", demandePret, config)
        .then((response) => {
          setDemandePretId(response.data.id);
        });
      setStep(3.5);
      console.log("Form submitted successfully");
    } catch (error) {
      console.error("Failed to submit form", error);
    }
  };

  return (
    <div className={step3Styles.container}>
      <h2>Informations du prêt</h2>
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
