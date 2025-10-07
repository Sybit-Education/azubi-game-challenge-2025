import {Scene} from 'phaser';
import {displayPlayer, globalConsts} from '../main.ts';
import {formatTime} from '../thatFolder/ThatPlayer.ts';
import {Button} from '../custom_classes/Button.ts';
import Text = Phaser.GameObjects.Text;
import Rectangle = Phaser.GameObjects.Rectangle;

// config
const range: number = 2; // config
type leaderboardEntry = { name: string, score: number };
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

    // GameOver Image
    gameOverImage = this.add.image(512, 250, 'gameOverTitle');
    gameOverImage.setScale(0.2);

    // Sets text
    leaderboardText = scene.add.text(500, 290, "", style).setOrigin(0, 0);

    // gets score
    score = parseInt(localStorage.getItem("score"), 10);

    // Game infos
    new Button(150, 310, 4, "button_yourScore", this.scene.scene, () => {
    })
    this.add.text(250, 290, formatTime(score), style).setOrigin(0, 0);

    // Renders leaderboard
    renderLeaderboard();

    // Save score button
    saveButton = new Button(700, 700, 7, "button_save", scene, () => prompt());

    // Clicker
    const blocker: Rectangle = this.add.rectangle(0, 0, globalConsts.gameWidth, globalConsts.gameHeight, 0x000000, 0.001)
      .setOrigin(0)
      .setInteractive();
    blocker.setDepth(-1);
    blocker.once('pointerdown', () => {
      window.location.reload();
    });

  }
}

function prompt(): void {
  // Check if leaderboard is loaded
  if (!leaderboardIsLoaded) {
    alert("The leaderboard could not be loaded\nAnd therefore no score can be uploaded");
    return;
  }

  // Main prompt
  let prompt: string | null = window.prompt("please enter your abbreviation");

  if (prompt == null) return;
  if (prompt.toUpperCase() == "YOU") {
    alert("This cannot be used as name");
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
    renderLeaderboard();

    // Resets button
    saveButton.setImage("button_saved");
    saveButton.button.removeListener("pointerdown");
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

  // Fetch leaderboard
  let leaderboardObj: Record<string, number> | undefined = await getLeaderboard();

  // Fetching failed
  if (leaderboardObj == undefined) {
    leaderboardText.setText("loading leaderboard\nfailed");
    return;
  }

  // Sets displayName
  displayName = name != undefined ? name : "YOU";

  // adds yourself
  leaderboardObj[displayName] = score

  // Sort leaderboard
  const leaderboard: leaderboardEntry[] = sort(leaderboardObj);

  // Display top 3 leaderboard
  let yCoord: number = 290;
  for (let i: number = 0; i <= (leaderboard.length > 3 ? 3 : leaderboard.length) - 1; i++) {
    leaderboardLines.push(scene.add.text(525, yCoord, `${i + 1}. ${leaderboard[i].name} - ${formatTime(leaderboard[i].score)}`, style).setColor(leaderboard[i].name == displayName ? "#000000" : style.color));
    yCoord += 30;
  }

  // Display other score
  yCoord = 500;
  const index: number = leaderboard.findIndex(item => item.name === displayName);
  //console.log("> " + index);
  for (let i: number = index - range; i < index + range + 1; i++) {
    //console.log(i);
    try {
      leaderboardLines.push(scene.add.text(525, yCoord, `${i + 1}. ${leaderboard[i].name} - ${formatTime(leaderboard[i].score)}`, style).setColor(leaderboard[i].name == displayName ? "#000000" : style.color));
    } catch (e) {
      leaderboardLines.push(scene.add.text(525, yCoord, `${i + 1 > 0 ? i + 1 : 0}. xxx - ` + formatTime(0), style));
    }
    yCoord += 30;
  }

  // Removes "loading leaderboard" text
  leaderboardText.setText("");

  // save state
  leaderboardIsLoaded = true;
}

// Sort record
function sort(record: Record<string, number>): leaderboardEntry[] {
  return Object.entries(record)
    .map(([name, score]): leaderboardEntry => ({name, score: Number(score)}))
    .sort((a: leaderboardEntry, b: leaderboardEntry): number => b.score - a.score);
}


// [GET] a new key
export async function generateCode(): Promise<string | undefined> {
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
async function saveLeaderboard(name: string, key: string, value: number): Promise<Response | undefined> {
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

// [GET] the current leaderboard
async function getLeaderboard(): Promise<Record<string, number> | undefined> {
  try {
    const res: Response = await fetch(globalConsts.apiURL + "/leaderboard", {method: "GET"});
    if (!res.ok) throw new Error(`HTTP ERROR ${res.status}`);
    return await res.json();
  } catch (e) {
    return undefined;
  }
}
