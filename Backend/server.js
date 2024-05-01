const express = require("express");
const db = require("./models"); // Import the db object from index.js

const app = express();

// Sync all models that aren't already in the database
db.sequelize
  .sync({ force: true })
  .then(() => {
    console.log("All models were synchronized successfully.");
  })
  .catch((error) => {
    console.error("Error syncing models: ", error);
  });

// Your existing Express setup here...

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
