// Diese Datei dient als starten und verwalten des Backends
// Original Author: TJH

import express, {Express} from 'express';
import {startLeaderboard} from './leaderboard.ts';
const cors = require('cors');

// Config
export const debug: boolean = false;
const port: number = 3000;

// Variables
const app: Express = express();
// Configure CORS options (optional)
const corsOptions = {
  origin: '*', // Allow all origins (use specific domains in production for security)
  methods: '*', // Allowed HTTP methods
  allowedHeaders: '*', // Allowed headers
};

// Enable CORS middleware with options
app.use(cors());
app.use(express.json());

// Start different systems
if (debug) console.log("Starting server");
startLeaderboard(app);

// Listen
app.listen(port, () => {
  console.log("Server running at http://localhost:" + port);
});

