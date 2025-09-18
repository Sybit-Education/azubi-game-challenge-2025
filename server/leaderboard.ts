import fs from "fs";
import {app} from './server.ts';

// Config
const json: string = "leaderboard.json";

// load file
function loadLeaderboard(): any {
  const empty = {}; // fallback
  if (!fs.existsSync(json)) return empty;
  const raw = fs.readFileSync(json, "utf-8");
  try {
    return JSON.parse(raw);
  } catch {
    return empty;
  }
}

// Save the JSON file
function saveLeaderboard(data: any): void {
  fs.writeFileSync(json, data);
}

// On start
export function startLeaderboard(): void {
  // [GET] Leaderboard
  app.get("/leaderboard", (_request, res) => {
    const leaderboard = loadLeaderboard();
    const sortedEntries = Object.entries(leaderboard).sort((a: any, b: any) => b[1] - a[1]);
    res.json(Object.fromEntries(sortedEntries));
  });

  // TODO | besseren score nicht überschreiben
  // [POST] new score
  app.post("/leaderboard", (request, res) => {
    const {name, score} = request.body;
    if (typeof name !== "string" || typeof score !== "number") {
      return res.status(400).json({error: "Invalid payload"});
    }
    const leaderboard = loadLeaderboard();
    const contains: boolean = leaderboard.hasOwnProperty(name);
    leaderboard[name] = score;
    saveLeaderboard(JSON.stringify(leaderboard, null, 2));
    res.status(contains ? 200 : 201).json({success: true}); // 200 = OK | 201 = CREATED
  });

}
