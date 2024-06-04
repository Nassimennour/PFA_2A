const express = require("express");
const db = require("./models");
const routes = require("./routes");
const logger = require("./logger");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const path = require("path");
const { arch } = require("os");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    db.User.findOne({ where: { id: req.query.userId } })
      .then((user) => {
        if (user) {
          const dir = "./uploads/" + user.username;
          fs.mkdirSync(dir, { recursive: true });
          cb(null, dir);
        } else {
          cb(new Error("User not found."));
        }
      })
      .catch((err) => cb(err));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

// Helper function to translate gender
function translateGender(gender) {
  switch (gender) {
    case "male":
      return "Masculin";
    case "female":
      return "Féminin";
    default:
      return gender;
  }
}

// Helper function to translate employment status
function translateEmploymentStatus(status) {
  switch (status) {
    case "Employed":
      return "Employé";
    case "Unemployed":
      return "Chômeur";
    case "Self-employed":
      return "Auto-employé";
    case "Retired":
      return "Retraité";
    case "Student":
      return "Étudiant";
    case "Other":
      return "Autre";
    default:
      return status;
  }
}

// Helper function to translate credit history
function translateCreditHistory(history) {
  switch (history) {
    case "Excellent":
      return "Excellent";
    case "Good":
      return "Bon";
    case "Fair":
      return "Équitable";
    case "Poor":
      return "Pauvre";
    default:
      return history;
  }
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("fr-FR");
}

const upload = multer({ storage: storage });

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).send("No token provided");
  jwt.verify(
    token,
    "847f261db7bb0f11275cf160417b43e5f325ea984cd77e00c02853e1ca02bc5f",
    (err, user) => {
      if (err) return res.status(403).send("Invalid token");
      req.user = user;
      next();
    }
  );
}
function excludeRoutes(paths, middleware) {
  return function (req, res, next) {
    const baseRoute = req.path.split("/")[1];
    if (
      (paths.includes(`/${baseRoute}`) && req.method === "POST") ||
      ((req.path.startsWith("/users/username") ||
        req.path.startsWith("/users") ||
        req.path.startsWith("/organismesprets")) &&
        req.method === "GET")
    ) {
      return next();
    } else {
      return middleware(req, res, next);
    }
  };
}
const excludedRoutes = [
  "/login",
  "/users",
  "/clients",
  "/agentsprets",
  "/courtiers",
];

//Logging middleware
app.use((req, res, next) => {
  logger.info(`Received a ${req.method} request for ${req.url}`);
  next();
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await db.User.findOne({ where: { username } });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      "847f261db7bb0f11275cf160417b43e5f325ea984cd77e00c02853e1ca02bc5f"
    );
    res.json({ token });
  } else {
    res.status(401).send("Invalid credentials");
  }
});

app.post("/upload/photo", upload.single("photo"), async (req, res) => {
  try {
    const user = await db.User.findOne({
      where: { id: req.query.userId },
    });
    if (user) {
      user.photo = req.file.path;
      await user.save();
      res.status(200).json({ message: "Photo uploaded successfully." });
    } else {
      res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    console.error("Error uploading photo:", error);
    res
      .status(500)
      .json({ error: "An error occurred while uploading the photo." });
  }
});

app.post("/upload/document", upload.single("document"), async (req, res) => {
  try {
    const user = await db.User.findOne({ where: { id: req.query.userId } });
    if (user) {
      const document = await db.Document.create({
        cheminFichier: req.file.path,
        nomOriginal: req.file.originalname,
        typeFichier: req.file.mimetype.split("/")[1],
        taille: req.file.size / 1024, // convert bytes to kilobytes
        dossierPretId: req.body.dossierPretId,
        typeDocumentId: req.body.typeDocumentId,
        status: "pending",
      });
      res.status(201).json(document);
    } else {
      res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    console.error("Error uploading document:", error);
    res
      .status(500)
      .json({ error: "An error occurred while uploading the document." });
  }
});

app.post(
  "/upload/bienImmobilier/photo",
  upload.single("photo"),
  async (req, res) => {
    try {
      const bienImmobilier = await db.BienImmobilier.findOne({
        where: { id: req.query.bienImmobilierId },
      });
      if (bienImmobilier) {
        bienImmobilier.photo = req.file.path;
        await bienImmobilier.save();
        res.status(200).json({ message: "Photo uploaded successfully." });
      } else {
        res.status(404).json({ error: "Bien Immobilier not found." });
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      res
        .status(500)
        .json({ error: "An error occurred while uploading the photo." });
    }
  }
);

const fetchDossierData = async (dossierPretId) => {
  const dossierPret = await db.DossierPret.findOne({
    where: { id: dossierPretId },
    include: [
      {
        model: db.Document,
        include: [db.TypeDocument],
      },
      {
        model: db.DemandePret,
        include: [
          {
            model: db.Client,
            include: [
              {
                model: db.User,
              },
            ],
          },
          {
            model: db.BienImmobilier,
          },
          {
            model: db.OrganismePret,
          },
        ],
      },
    ],
  });

  if (!dossierPret) {
    throw new Error(`No DossierPret found with id: ${dossierPretId}`);
  }

  return dossierPret;
};

app.use("/uploads", express.static("uploads"));
app.use(excludeRoutes(excludedRoutes, authenticateToken));

app.get("/pdf/:id", async (req, res) => {
  try {
    const dossierPret = await fetchDossierData(req.params.id);
    const doc = new PDFDocument();
    // Client's personal info
    doc.text("Informations Personnelles:", { underline: true });
    if (dossierPret.DemandePret.Client.User.photo) {
      doc.image(
        path.join(__dirname, dossierPret.DemandePret.Client.User.photo),
        {
          width: 100,
          height: 100,
          x: doc.page.width - 100 - 50, // position the image at the top right, with a margin of 50
          y: 50, // position the image at the top of the page, with a margin of 50
        }
      );
    }

    doc.text(
      `Nom complet: ${dossierPret.DemandePret.Client.nom} ${dossierPret.DemandePret.Client.prenom}`
    );
    doc.text(`CIN: ${dossierPret.DemandePret.Client.cin}`);
    doc.text(`Téléphone: ${dossierPret.DemandePret.Client.telephone}`);
    doc.text(`Addresse: ${dossierPret.DemandePret.Client.adresse}`);
    doc.text(
      `Date de Naissance: ${formatDate(
        dossierPret.DemandePret.Client.dateNaissance
      )}`
    );

    doc.text(`Sexe: ${translateGender(dossierPret.DemandePret.Client.sexe)}`);
    doc.text(`Email: ${dossierPret.DemandePret.Client.User.email}`);
    doc.moveDown();

    // Financial information
    doc.text("Informations financières:", { underline: true });
    doc.text(
      `Status : ${translateEmploymentStatus(dossierPret.employmentStatus)}`
    );

    doc.text(`Salaire: ${dossierPret.salary} DH`);
    doc.text(`Revenu additionnel: ${dossierPret.additionalIncome} DH`);

    doc.text(`Total des Dépenses: ${dossierPret.totalExpenses} DH`);
    doc.text(`Loyer: ${dossierPret.rent} DH`);
    doc.text(`Services publiques : ${dossierPret.utilities} DH`);
    doc.text(`Alimentation: ${dossierPret.groceries} DH`);
    doc.text(`Transport: ${dossierPret.transportation} DH`);
    doc.text(`Total Actifs: ${dossierPret.totalAssets} DH`);
    doc.text(`Total Passifs: ${dossierPret.totalLiabilities} DH`);
    doc.text(
      `Historique de crédit: ${translateCreditHistory(
        dossierPret.creditHistory
      )}`
    );
    doc.moveDown();
    // DemandePret information
    doc.text("Informations de la Demande:", { underline: true });
    doc.text(`Montant: ${dossierPret.DemandePret.montant} DH`);
    doc.text(`Durée: ${dossierPret.DemandePret.duree} Ans`);
    doc.text(`Taux d'intérêt: ${dossierPret.DemandePret.interestRate}%`);
    doc.text(
      `Date de Soumission: ${formatDate(
        dossierPret.DemandePret.dateSoumission
      )}`
    );
    doc.moveDown();
    doc.text("Informations du Bien Immobilier:", { underline: true });
    if (dossierPret.DemandePret.BienImmobilier.photo) {
      doc.text("Photo:", { underline: true });
      doc.image(
        path.join(__dirname, dossierPret.DemandePret.BienImmobilier.photo),
        {
          width: 100,
          height: 100,
          x: doc.page.width - 100 - 50, // position the image at the top right, with a margin of 50
          y: doc.y + 50, // position the image below the current y position, with a margin of 50
        }
      );
    }
    doc.text(`Type: ${dossierPret.DemandePret.BienImmobilier.typeBien}`);
    doc.text(`Addresse: ${dossierPret.DemandePret.BienImmobilier.adresse}`);
    doc.text(
      `Superficie (Mètre carré): ${dossierPret.DemandePret.BienImmobilier.superficie}`
    );
    doc.text(
      `Nombre de pièces: ${dossierPret.DemandePret.BienImmobilier.nbPieces}`
    );
    doc.text(`Valeur: ${dossierPret.DemandePret.BienImmobilier.valeur} DH`);

    doc.moveDown();

    const filePath = path.join(
      __dirname,
      "uploads",
      dossierPret.DemandePret.Client.User.username,
      `dossier${req.params.id}.pdf`
    );
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);
    console.log("wselt hna");
    doc.on("finish", async () => {
      try {
        console.log("wselt hna2");
        const relativeFilePath = path.relative(
          path.join(__dirname, "uploads"),
          filePath
        );
        dossierPret.cheminDossier = relativeFilePath;
        console.log("nouveau chemin : ", relativeFilePath);
        await dossierPret.save();
        console.log("PDF generated and saved successfully.");
        res
          .status(200)
          .json({ message: "PDF generated and saved successfully." });
      } catch (error) {
        console.error("Error updating cheminDossier:", error);
      }
    });
    const relativeFilePath = path.relative(
      path.join(__dirname, "uploads"),
      filePath
    );
    dossierPret.cheminDossier = relativeFilePath;
    console.log("nouveau chemin : ", relativeFilePath);
    await dossierPret.save();
    res.status(200).json({ message: "PDF generated and saved successfully." });
    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res
      .status(500)
      .json({ error: "An error occurred while generating the PDF." });
  }
});

app.use("/users", routes.userRoutes);
app.use("/clients", routes.clientRoutes);
app.use("/courtiers", routes.courtierRoutes);
app.use("/dossiersprets", routes.dossierPretRoutes);
app.use("/biensimmobiliers", routes.bienImmobilierRoutes);
app.use("/notes", routes.noteRoutes);
app.use("/documents", routes.documentRoutes);
app.use("/agentsprets", routes.agentPretRoutes);
app.use("/organismesprets", routes.organismePretRoutes);
app.use("/demandesprets", routes.demandePretRoutes);
app.use("/typesdocuments", routes.typeDocumentRoutes);
app.use("/interets", routes.interestRateRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to your Express application!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).send("Something went wrong");
});

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  logger.info("Server started on port 5000");
  try {
    await db.sequelize.sync({ force: false });
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
});
