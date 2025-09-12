const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT: number = 3001;

const HIGHSCORE_FILE = "./server/highscores.json";

app.use(cors());
app.use(express.json());

// GET Highscores
app.get("/api/highscores", (req, res) => {
  const data = fs.readFileSync(HIGHSCORE_FILE);
  res.json(JSON.parse(data));
});

// POST New Highscore
app.post("/api/highscores", (req, res) => {
  const {name, score} = req.body;

  if (!name || typeof score !== "number") {
    return res.status(400).json({message: "Invalid data"});
  }

  const data = JSON.parse(fs.readFileSync(HIGHSCORE_FILE));
  data.push({name, score});
  data.sort((a, b) => b.score - a.score);
  //data.splice(10); // Only top 10

  fs.writeFileSync(HIGHSCORE_FILE, JSON.stringify(data, null, 2));

  res.status(201).json({message: "Highscore saved"});
});

// Start listen
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
