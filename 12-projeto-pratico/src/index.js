const express = require("express");
const app = express();

app.get("/games", (req, res) => {
  res.send("Hello, world!");
});

app.listen(5500, () => console.log("Server is running on http://localhost:5500"));
