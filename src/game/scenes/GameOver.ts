import {Scene} from 'phaser';
import {displayPlayer, globalConsts} from '../main.ts';
import {formatTime, get1, get3} from '../thatFolder/ThatPlayer.ts';
import {Button} from '../custom_classes/Button.ts';
import {ButtonManager} from '../custom_classes/ButtonManager.ts';
import Text = Phaser.GameObjects.Text;
import {fetchLeaderboard, removeEntry, sortedLeaderboard, sortLeaderboard} from './Leaderboard.ts';
import Gamepad = Phaser.Input.Gamepad.Gamepad;

// config
const range: number = 2;
export type leaderboardEntry = { name: string, score: number };
const style = {
  font: "20px pixelFont",
  color: "#ffffff",
  align: 'center'
}

// Variables
let name: string | undefined = undefined;
let displayName: string;
let score: number;
let scene: Scene;
const leaderboardLines: Text[] = [];
let leaderboardText: Phaser.GameObjects.Text;
let gameOverImage: Phaser.GameObjects.Image;
let saveButton: Button;
let leaderboardIsLoaded: boolean = false;
let savedScore: boolean = false;
let buttonManager: ButtonManager;
let gamePad: Gamepad;

// Scene class
export class GameOver extends Scene {

  // Constructor
  constructor() {
    super('gameOver');
  }

  create(): void {
    scene = this.scene.scene;

    // Background
    this.cameras.main.setBackgroundColor(globalConsts.backgroundColor);

    // Display player
    displayPlayer(scene);

    // Creates the button manager
    buttonManager = new ButtonManager(scene);

    // GameOver Image
    gameOverImage = this.add.image(512, 250, 'gameOverTitle');
    gameOverImage.setScale(0.2);

    // Sets text
    leaderboardText = scene.add.text(500, 290, "", style).setOrigin(0, 0);

    // gets score
    const item: string | null = localStorage.getItem("last.score");
    score = parseInt(item ? item : "0", 10);

    // Game infos
    new Button(70, 298, 4, "button_yourScore", this.scene.scene).button.setOrigin(0, 0.5);
    this.add.text(265, 290, formatTime(score), style).setOrigin(0, 0);

    new Button(70, 338, 4, "button_jumpsLeft", this.scene.scene).button.setOrigin(0, 0.5);
    this.add.text(265, 330, localStorage.getItem("last.jumpsLeft") ?? "0", style).setOrigin(0, 0);

    // Renders leaderboard
    renderLeaderboard().then();


    // Adds the restart button
    new Button(globalConsts.gameWidth * 0.8, globalConsts.gameHeight * 0.85, 5, "button_play", scene, () => exit(), 'ENTER', 3, buttonManager).button.setVisible(true);

    // Save score button
    saveButton = new Button(600, 650, 7, "button_save", scene, () => prompt(), 'S', 1, buttonManager);

    // Add navigation instructions
    scene.add.text(globalConsts.gameWidth * 0.67, globalConsts.gameHeight * 0.92, "Press S or 1 to save", {
      font: "16px " + globalConsts.pixelFont,
      color: "#ffffff",
      align: 'center'
    }).setOrigin(0.5);

    scene.add.text(globalConsts.gameWidth * 0.67, globalConsts.gameHeight * 0.95, "Press ENTER or 3 to restart", {
      font: "16px " + globalConsts.pixelFont,
      color: "#ffffff",
      align: 'center'
    }).setOrigin(0.5);

    // Sets gamepad
    if (this.input.gamepad && this.input.gamepad.gamepads.length > 0) {
      gamePad = this.input.gamepad.getPad(0);
    }
  }

  update(): void {
    // 1 -> Save
    if (get1(gamePad)) {
      prompt();
      return;
    }

    // 3 -> back
    if (get3(gamePad)) {
      exit();
      return
    }
  }
}

// Exit to the main Menu
function exit(): void {
  window.location.reload();
}

// Prompt to save
function prompt(): void {
  // Already saved score | TODO | fix me
  if (savedScore) return;

  // Check if the leaderboard is loaded
  if (!leaderboardIsLoaded) {
    alert("The leaderboard could not be loaded\nAnd therefore no score can be uploaded");
    return;
  }

  // Main prompt
  let prompt: string | null = window.prompt("please enter your abbreviation");

  // Cancel
  if (prompt == null) return;

  // "YOU" cannot be used
  if (prompt.toUpperCase() == "YOU") {
    alert("This cannot be used as name");
    return;
  }

  // Neither does xxx
  if (prompt.toLowerCase() == "xxx") {
    alert("xxx doesn't work either");
    return;
  }

  // Lowercase
  prompt = prompt.toLowerCase();

  // Sets name
  name = prompt;

  // Main fetch
  saveLeaderboard(prompt, localStorage.getItem("key"), score).then(response => {
    if (response == undefined) {
      alert("Upload to leaderboard failed");
      return;
    }

    // Isn´t okay
    if (!response.ok) {
      alert("Something went wrong while uploading your score to the leaderboard: " + response.status + " - " + response.statusText);
      return;
    }

    // Same/better score already reached
    if (response.status == 208) {
      alert("Same/Better score for this name already exists")
      return;
    }

    // Feedback
    alert("Your score has been successfully uploaded");

    // Removes and rerenders leaderboard
    clearsLeaderboardLine();
    renderLeaderboard().then();

    // Disables button
    saveButton.setImage("button_saved");
    savedScore = true;
  })
}

function clearsLeaderboardLine(): void {
  // Clears array
  for (let i: number = 0; i < leaderboardLines.length; i++) {
    leaderboardLines[i].destroy(true);
    delete leaderboardLines[i];
  }

  // Sets text
  leaderboardText.setText("loading leaderboard...");
}

// Renders leaderboard
async function renderLeaderboard(): Promise<void> {
  // save state
  leaderboardIsLoaded = false;

  // Set loading text
  leaderboardText.setText("loading leaderboard...");

  // Try fetching the leaderboard again
  if (sortedLeaderboard == undefined) await fetchLeaderboard();

  // Fetching failed
  if (sortedLeaderboard == undefined) {
    leaderboardText.setText("loading leaderboard\nfailed");
    return;
  }

  // Sets displayName
  displayName = name != undefined ? name : "YOU";

  // adds yourself
  sortedLeaderboard.push({
    name: displayName,
    score: score
  });

  // sort
  sortLeaderboard();

  // Display top 3 leaderboard
  let yCoord: number = 290;
  for (let i: number = 0; i <= (sortedLeaderboard.length > 3 ? 3 : sortedLeaderboard.length) - 1; i++) {
    leaderboardLines.push(scene.add.text(525, yCoord, `${i + 1}. ${sortedLeaderboard[i].name} - ${formatTime(sortedLeaderboard[i].score)}`, style).setColor(sortedLeaderboard[i].name == displayName ? "#000000" : style.color));
    yCoord += 30;
  }

  // Display another score
  yCoord = 450;
  const index: number = sortedLeaderboard.findIndex(item => item.name === displayName);
  for (let i: number = index - range; i < index + range + 1; i++) {
    try {
      leaderboardLines.push(scene.add.text(525, yCoord, `${i + 1}. ${sortedLeaderboard[i].name} - ${formatTime(sortedLeaderboard[i].score)}`, style).setColor(sortedLeaderboard[i].name == displayName ? "#000000" : style.color));
    } catch (e) {
      leaderboardLines.push(scene.add.text(525, yCoord, `${i + 1 > 0 ? i + 1 : 0}. xxx - ` + formatTime(0), style));
    }
    yCoord += 30;
  }

  // Removes "loading leaderboard" text
  leaderboardText.setText("");

  // save state
  leaderboardIsLoaded = true;

  // removes self
  removeEntry("YOU");
}

// [GET] a new key
export async function generateCode(): Promise<string | undefined> {
  // Local-storage
  if (globalConsts.apiURL == undefined) return;

  // Main fetch
  try {
    const response: Response = await fetch(globalConsts.apiURL + "/newCode", {method: "GET"});
    const result: any = await response.json();
    return result.code;
  } catch (e) {
    return undefined;
  }
}

// [POST] new score
async function saveLeaderboard(name: string, key: string | null, value: number): Promise<Response | undefined> {
  // Local-storage
  if (globalConsts.apiURL == undefined) {
    const oldEntry: leaderboardEntry | undefined = getEntryByName(name);
    if (oldEntry && oldEntry.score > value) return new Response(JSON.stringify({success: false}), {status: 208}); // Better score exists
    sortedLeaderboard?.push({name: name, score: value}); // Adds entry
    sortedLeaderboard?.filter(entry => entry.name !== "YOU"); // Removes YOU
    localStorage.setItem("leaderboard", JSON.stringify(sortedLeaderboard, null, 0))
    return new Response(JSON.stringify({success: true}), {status: 200});
  }

  // Request info
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // Main fetch
    return await fetch(globalConsts.apiURL + "/leaderboard", {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({
        "name": name,
        "score": value,
        "code": key
      }),
    });
  } catch (e) {
    return undefined;
  }
}

// Gets leaderboard entry by name
function getEntryByName(name: string): leaderboardEntry | undefined {
  return sortedLeaderboard?.find(entry => entry.name === name);
}
