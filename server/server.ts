// Diese Datei dient als starten und verwalten des Backends
// Config -> Sind einstellungen die einfach verändert werden können
// Variables -> Daten werden gespeichert
// Start different systems -> Dort werden alle Systeme nacheinander gestartet
// Original Author: TJH

import express, {Express} from 'express';
import {startLeaderboard} from './leaderboard.ts';

// Config
export const debug: boolean = false;
const port: number = 3000;

// Variables
const app: Express = express();
app.use(express.json());

// Start different systems
if (debug) console.log("Starting server");
startLeaderboard(app);

// Listen
app.listen(port, () => {
  console.log("Server running at http://localhost:" + port);
});
