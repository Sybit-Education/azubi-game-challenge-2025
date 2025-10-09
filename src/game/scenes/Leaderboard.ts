import {Scene} from 'phaser';
import {displayPlayer, globalConsts} from '../main.ts';
import {formatTime} from '../thatFolder/ThatPlayer.ts';
import {Button} from '../custom_classes/Button.ts';
import Text = Phaser.GameObjects.Text;

import {leaderboardEntry} from './GameOver.ts';
import Image = Phaser.GameObjects.Image;

// config
const range: number = 15;
const iconX: number = 150;
const categoryX: number = 260;
const style = {
  font: "20px pixelFont",
  color: "#ffffff",
  align: 'center'
}

// Variables
type leaderboardCategory = "default" | "worst" | "byName" | "byPlace";
let name: string | undefined = undefined;
let scene: Scene;
const leaderboardLines: Text[] = [];
let subtitle: Phaser.GameObjects.Text;
let leaderboardText: Phaser.GameObjects.Text;
let isLoaded: boolean = false
let currentCategory: leaderboardCategory = "default";

// Scene class
export class Leaderboard extends Scene {

  // Constructor
  constructor() {
    super('leaderboard');
  }

  create(): void {
    scene = this.scene.scene;

    // Background
    this.cameras.main.setBackgroundColor(globalConsts.backgroundColor);

    // Display player
    displayPlayer(scene);

    //  Title
    scene.add.text(50, 50, "Leaderboard", {
      font: "80px pixelFont",
      color: "#ffffff",
      align: 'center'
    });

    // Back Button
    new Button(130, 175, 3, "button_back", this.scene.scene, () => this.scene.start("mainMenu"))

    // Subtitle
    subtitle = scene.add.text(180, 163, "Loading this text", {
      font: "30px pixelFont",
      color: "#ffffff",
      align: 'center'
    });

    // TODO | add/finish search buttons

    // Actions
    this.categoryButton("default", 250); // default/top
    this.categoryButton("worst", 300); // default/top
    this.searchIcon(350);
    this.categoryButton("byName", 350); // Search by name
    this.searchIcon(400);
    this.categoryButton("byPlace", 400); // Search by place
    new Button(categoryX, 450, 4.5, "button_refresh", this.scene.scene, rerenderLeaderboard); // refresh

    // Sets lines
    if (leaderboardLines.length == 0) {
      let yCoord: number = 220;
      for (let j: number = 0; j < range; j++) {
        leaderboardLines.push(scene.add.text(490, yCoord, "", style));
        yCoord += 35;
      }
    }

    // Sets text
    leaderboardText = scene.add.text(510, 450, "", style).setOrigin(0, 0);

    // Renders leaderboard
    renderLeaderboard();
  }

  searchIcon(y: number): void {
    const image: Image = this.add.image(iconX, y, "button_search");
    image.setScale(2.5);
  }

  categoryButton(category: leaderboardCategory, y: number): void {
    const imageID: string = ({
      "default": "button_top",
      "worst": "button_worst",
      "byName": "button_byName",
      "byPlace": "button_byPlace"
    })[category] || 'resultDefault';
    new Button(categoryX, y, 4.5, imageID, this.scene.scene, () => prompt(category));
  }
}

function prompt(category: leaderboardCategory): void {
  // Check if leaderboard is loaded
  if (!isLoaded) {
    alert("The leaderboard could not be loaded\nAnd therefore no score can be uploaded");
    return;
  }

  switch (category) {
    case "worst":
    case "default":
      currentCategory = category;
      rerenderLeaderboard();
      return;
  }


  // Main prompt
  let prompt: string | null = window.prompt("please enter your abbreviation");

  // Cancel
  if (prompt == null) return;

  // YOU cannot be used
  if (prompt.toUpperCase() == "YOU") {
    alert("This cannot be used as name");
    return;
  }

  // Lowercase
  prompt = prompt.toLowerCase();

  // Sets name
  name = prompt;
}

function rerenderLeaderboard(): void {
  clearsLeaderboardLine();
  renderLeaderboard();
}

function clearsLeaderboardLine(): void {
  // Resets every lines content
  for (let line of leaderboardLines) line.setText("");
}

// Renders leaderboard
async function renderLeaderboard(): Promise<void> {
  // save state
  isLoaded = false;

  // Set loading text
  leaderboardText.setText("loading leaderboard...");
  subtitle.setText("Loading leaderboard");

  // Fetch leaderboard
  let leaderboardObj: Record<string, number> | undefined = await getLeaderboard();

  // Fetching failed
  if (leaderboardObj == undefined) {
    leaderboardText.setText("loading leaderboard\nfailed");
    subtitle.setText("Not available");
    return;
  }

  // Sort leaderboard
  const leaderboard: leaderboardEntry[] = sort(leaderboardObj);

  // Display top 3 leaderboard
  switch (currentCategory) {
    case "default":
      for (let i: number = 0; i <= (leaderboard.length > range ? range : leaderboard.length) - 1; i++) {
        const text: Text = leaderboardLines[i];
        text.setText(formatText(i, leaderboard[i].name, leaderboard[i].score));
      }
      break;
    case "worst":
      let line: number = 0;
      for (let i: number = (leaderboard.length - range) > 0 ? leaderboard.length - range : 0; i <= leaderboard.length - 1; i++) {
        const text: Text = leaderboardLines[line];
        text.setText(formatText(i, leaderboard[i].name, leaderboard[i].score));
        line++;
      }
  }


  // Removes "loading leaderboard" text
  leaderboardText.setText("");

  const entries: number = range > leaderboard.length ? leaderboard.length : range;

  // Sets subtitle
  const subtitleText: string = ({
    "default": "Top " + entries,
    "worst": "Worst " + entries,
    "byName": "Leaderboard at @abc",
    "byPlace": "Leaderboard at 1."
  })[currentCategory] || 'resultDefault';

  subtitle.setText(subtitleText);

  // save state
  isLoaded = true;
}

function formatText(i: number, name: string, score: number): string {
  return `${i + 1}. ${name} - ${formatTime(score)}`
}

// Sort record
function sort(record: Record<string, number>): leaderboardEntry[] {
  return Object.entries(record)
    .map(([name, score]): leaderboardEntry => ({name, score: Number(score)}))
    .sort((a: leaderboardEntry, b: leaderboardEntry): number => b.score - a.score);
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
