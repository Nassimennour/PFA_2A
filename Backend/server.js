const express = require("express");
const db = require("./models");
const routes = require("./routes");
const logger = require("./logger");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// JWT verification middleware
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
// Middleware to exclude routes from JWT authentication
function excludeRoutes(paths, middleware) {
  return function (req, res, next) {
    const baseRoute = req.path.split("/")[1];
    if (
      (paths.includes(`/${baseRoute}`) && req.method === "POST") ||
      ((req.path.startsWith("/users/username") ||
        req.path.startsWith("/users/id") ||
        req.path.startsWith("/organismesprets")) &&
        req.method === "GET")
    ) {
      return next();
    } else {
      return middleware(req, res, next);
    }
  };
}
// List of routes to exclude from JWT authentication
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

// Login route
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

app.use(excludeRoutes(excludedRoutes, authenticateToken));

// Apply the JWT verification middleware to your routes
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
  logger.info("Server started on port 3000");
  try {
    // Sync models with the database
    await db.sequelize.sync({ force: true });
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
});
