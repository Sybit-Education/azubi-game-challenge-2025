// Original Author: TJH

import fs from "fs";
import {Express} from 'express';
import * as path from 'node:path';

// Config
const json: string = "server/data/leaderboard.json";

// Variables
let codes: string[] = [];

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
  const folderPath: string = path.dirname(json); // path from json
  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true }); // creates folder if not exist
  fs.writeFileSync(json, data); // writes to file
}

// Generates Code
function generateCode(length: number = 12): string {
  const chars: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!?_-+=/";
  let password: string = "";
  for (let i: number = 0; i < length; i++) {
    const ind: number = Math.floor(Math.random() * chars.length);
    password += chars[ind];
  }
  return password;
}

// On start
export function startLeaderboard(app: Express): void {
  // [GET] Leaderboard
  app.get("/leaderboard", (_request, res) => {
    const leaderboard = loadLeaderboard();
    const sortedEntries = Object.entries(leaderboard).sort((a: any, b: any) => b[1] - a[1]);
    res.json(Object.fromEntries(sortedEntries));
  });

  // [GET] new Code
  app.get("/newCode", (_request, res) => {
    const code: string = generateCode(10);
    codes.push(code);
    return res.status(201).json({code: code});
  });

  // [POST] new score
  app.post("/leaderboard", (request, res) => {
    const {name, score, code} = request.body;
    if (typeof name !== "string" || typeof score !== "number" || typeof code !== "string") {
      return res.status(400).json({error: "Invalid payload"});
    }
    if (codes.indexOf(code) === -1) {
      return res.status(401).json({error: "Unauthorized"});
    }
    codes = codes.filter(item => item != code); // removes code
    const leaderboard: any = loadLeaderboard(); // Json
    const contains: boolean = leaderboard.hasOwnProperty(name);
    // Old score was better
    if (contains && leaderboard[name] >= score) {
      res.status(208).json({success: false}); // 208 = ALREADY REPORTED
      return;
    }
    leaderboard[name.toLowerCase()] = score;
    saveLeaderboard(JSON.stringify(leaderboard, null, 2));
    res.status(contains ? 200 : 201).json({success: true}); // 200 = OK | 201 = CREATED
  });

}
