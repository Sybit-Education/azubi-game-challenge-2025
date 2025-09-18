import express, {Express} from 'express';
import {startLeaderboard} from './leaderboard.ts';

// Variables
export const app: Express = express();
app.use(express.json());

// Config
export const debug: boolean = false;
const port: number = 3000;

// Start different systems
if (debug) console.log("Starting server");
startLeaderboard();

// Listen
app.listen(port, () => {
  console.log("Server running at http://localhost:" + port);
});
