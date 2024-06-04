import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import step2Styles from "./Step3Courtier.module.css";
import { Carousel } from "react-responsive-carousel";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "react-responsive-carousel/lib/styles/carousel.min.css";

function Step3Courtier({ setStep, setSelectedOrganismeId }) {
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
                  setSelectedOrganismeId(organisme.id);
                  setStep(4);
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

export default Step3Courtier;
