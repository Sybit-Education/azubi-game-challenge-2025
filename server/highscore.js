const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();

// Config
const jsonFile = "./server/highscores.json";
const port = 3001;
const top = 10;

// Main code
app.use(cors());

// Listener
// [GET] Top Highscores
app.get("/api/highscores", (_request, response) => {
  const data = getJsonContent();
  response.json(JSON.parse(data));
});

// [POST] New Highscore
app.post("/api/highscores", (request, response) => {
  const name = request.get("name");
  const score = Number.parseInt(request.get("score"));

  console.log(typeof score);
  Number.parseInt(score);
  if (!name || typeof score !== "number") {
    return response.status(400).json({message: "Invalid data"});
  }

  const data = JSON.parse(fs.readFileSync(jsonFile));
  data.push({name, score});
  data.sort((a, b) => b - a);

  fs.writeFileSync(jsonFile, JSON.stringify(data, null, 2));

  response.json({message: "Highscore saved"});
});

// Start listen
app.listen(port, () => {
  console.log("Server is running on port " + port);
});

// Functions
function getJsonContent() {
  return fs.readFileSync(jsonFile).toString();
}

