const express = require("express");
const bodyParser = require("body-parser");
const db = require("./models"); // Import your Sequelize models

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Define your routes here when you have them
// app.use('/api', yourRouter);

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to your Express application!");
});

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  try {
    // Sync models with the database
    await db.sequelize.sync({ force: true }); // Set force to true if you want to drop existing tables and recreate them
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
});
