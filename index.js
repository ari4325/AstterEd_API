require("dotenv").config();
const express = require("express");
const app = express();

require("./src/startup/db")(); // db connection
require("./src/startup/routes")(app); // db connection

app.get("/", (req, res) => {
  res.json({
    message: "Hello World",
    creator: "AstterEd",
  });
});

// server establishment
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log("Backend server has started at " + PORT);
});
