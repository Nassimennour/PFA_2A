import React, { useState, useEffect, useContext } from "react";
import styles from "./Step1.module.css";
import axios from "axios";
import nouvelleDemandeStyles from "./NouvelleDemande.module.css";
import progressBarStyles from "./ProgressBar.module.css";
import { AuthContext } from "../../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";
import Step2Courtier from "./Step2Courtier";
import Step3Courtier from "./Step3Courtier";
import Step4Courtier from "./Step4Courtier";
import Step5Courtier from "./Step5Courtier";
import Step6Courtier from "./Step6Courtier";
import BienImmoCourtier from "./BienImmoCourtier";
import { useParams } from "react-router-dom";
import FinalStepCourtier from "./FinalStepCourtier";

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

export default function NouvelleDemCourtier() {
  const [step, setStep] = React.useState(1);
  const [organismePretId, setSelectedOrganismeId] = React.useState(null);
  const [demandePretId, setDemandePretId] = useState(null);
  const [clientId, clientIdSetter] = useState(null);
  const [choice, setChoice] = useState(1);
  const [selectedDossierId, setSelectedDossierId] = useState(null);
  const { courtierId } = useParams();

  return (
    <div className={nouvelleDemandeStyles.container}>
      <h2 className={nouvelleDemandeStyles.title}>Nouvelle Demande de Prêt</h2>
      <div className={nouvelleDemandeStyles.form}>
        {step === 1 && (
          <Step1Courtier setStep={setStep} setChoice={setChoice} />
        )}
        {step === 2 && (
          <Step2Courtier
            setStep={setStep}
            choice={choice}
            clientIdSetter={clientIdSetter}
          />
        )}
        {step === 3 && (
          <Step3Courtier
            setStep={setStep}
            setSelectedOrganismeId={setSelectedOrganismeId}
          />
        )}
        {step === 4 && (
          <Step4Courtier
            clientId={clientId}
            organismePretId={organismePretId}
            setDemandePretId={setDemandePretId}
            setStep={setStep}
            courtierId={courtierId}
          />
        )}
        {step === 5 && (
          <BienImmoCourtier setStep={setStep} demandePretId={demandePretId} />
        )}
        {step === 6 && (
          <Step5Courtier
            setStep={setStep}
            demandePretId={demandePretId}
            clientId={clientId}
            setSelectedDossierId={setSelectedDossierId}
          />
        )}
        {step === 7 && (
          <Step6Courtier
            selectedDossierId={selectedDossierId}
            organismePretId={organismePretId}
            setStep={setStep}
          />
        )}
        {step === 8 && (
          <FinalStepCourtier
            setStep={setStep}
            clientId={clientId}
            selectedDossierId={selectedDossierId}
            demandePretId={demandePretId}
          />
        )}
      </div>
      <ProgressBar currentStep={step} totalSteps={8} />
    </div>
  );
}

export function Step1Courtier({ setStep, setChoice }) {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.card}>
        <h2 className={styles.cardHeader}>Client existant</h2>
        <p className={styles.cardText}>
          Choisisser un client parmi ceux déjà enregistrés.
        </p>
        <button
          className={styles.cardButton}
          onClick={() => {
            setChoice(1);
            setStep(2);
          }}
        >
          Continuer
        </button>
      </div>
      <div className={styles.card}>
        <h2 className={styles.cardHeader}>Nouveau client</h2>
        <p className={styles.cardText}>Créer un nouveau client.</p>
        <button
          className={styles.cardButton}
          onClick={() => {
            setChoice(2);
            setStep(2);
          }}
        >
          Continuer
        </button>
      </div>
    </div>
  );
}
