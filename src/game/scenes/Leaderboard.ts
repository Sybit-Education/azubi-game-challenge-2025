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
const refreshLimit: number = 10;
const style = {
  font: "20px pixelFont",
  color: "#ffffff",
  align: 'center'
}

// Variables
type leaderboardCategory = "default" | "worst" | "byName" | "byPlace";
let value: string | number | undefined = undefined;
let scene: Scene;
const leaderboardLines: Text[] = [];
let subtitle: Phaser.GameObjects.Text;
let leaderboardText: Phaser.GameObjects.Text;
let currentCategory: leaderboardCategory = "default";
let sortedLeaderboard: leaderboardEntry[] | undefined;
let clickedRefresh: number = 0;

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
    scene.add.text(50, 50, "Leaderboards", {
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

    // Actions
    this.categoryButton("default", 250); // default/top
    this.categoryButton("worst", 300); // default/top
    this.searchIcon(350);
    this.categoryButton("byName", 350); // Search by name
    this.searchIcon(400);
    this.categoryButton("byPlace", 400); // Search by place
    new Button(categoryX, 450, 4.5, "button_refresh", this.scene.scene, () => {
      if (clickedRefresh > refreshLimit) {
        alert("STOP! Thats ENOUGH");
        return;
      }
      fetchLeaderboard().then(() => rerenderLeaderboard())// refresh
      clickedRefresh++;
    });

    // Sets lines
    if (leaderboardLines.length == 0) {
      let yCord: number = 220;
      for (let j: number = 0; j < range; j++) {
        leaderboardLines.push(scene.add.text(490, yCord, "", style));
        yCord += 35;
      }
    }

    // Sets text
    leaderboardText = scene.add.text(510, 450, "", style).setOrigin(0, 0);

    // Renders leaderboard
    fetchLeaderboard().then(() => renderLeaderboard());
  }

  // Search icon constructor
  searchIcon(y: number): void {
    const image: Image = this.add.image(iconX, y, "button_search");
    image.setScale(2.5);
  }

  // Category button constructor
  categoryButton(category: leaderboardCategory, y: number): void {
    const imageID: string = ({
      "default": "button_top",
      "worst": "button_worst",
      "byName": "button_byName",
      "byPlace": "button_byPlace",
    })[category];
    new Button(categoryX, y, 4.5, imageID, this.scene.scene, () => prompt(category));
  }
}

// On button press. Sometimes input
function prompt(category: leaderboardCategory): void {
  // Check if leaderboard is loaded
  if (sortedLeaderboard == undefined) {
    alert("The leaderboard could not be loaded\nAnd therefore cannot be sorted");
    return;
  }

  // These categories don´t need a prompt
  if (category == "worst" || category == "default") {
    currentCategory = category;
    rerenderLeaderboard();
    return;
  }

  // Prompt text
  const promptText: string | undefined = ({
    "default": undefined,
    "worst": undefined,
    "byName": "Please enter the abbreviation you want to search for",
    "byPlace": "Please enter the place you would like to see",
  })[category];

  let prompt: string | null = window.prompt(promptText);

  // Cancel
  if (prompt == null) return;

  // Logic
  if (category == "byName") {
    // To lowercase
    prompt = prompt.toLowerCase()

    // check if exists
    if (!(sortedLeaderboard.some(entry => entry.name === prompt))) {
      alert("The name " + prompt + " could not be found")
      return;
    }
  } else if (category == "byPlace") {
    const parsed: number = parseInt(prompt, 10);
    // Is a number?
    if (isNaN(parsed)) {
      alert("This isn´t a number")
      return;
    }

    // Are that many entries
    if (sortedLeaderboard.length < parsed) {
      alert("There aren't that many entries");
      return;
    }

    // Over 0
    if (0 >= parsed) {
      alert("Nobody is so good that they are placed in the minus area");
      return;
    }

  } else {
    alert("404 - not found")
    return;
  }

  // Success
  currentCategory = category; // sets category
  value = prompt; // sets name as value
  rerenderLeaderboard(); // Rerenders leaderboard
}

// Clears and renders scoreboard
function rerenderLeaderboard(): void {
  clearsLeaderboardLine();
  renderLeaderboard().then(() => {
  });
}

// Resets scoreboard lines
function clearsLeaderboardLine(): void {
  // Resets every lines content + color
  for (let line of leaderboardLines) {
    line.setText("");
    line.setColor(style.color);
  }
}

// Renders leaderboard
async function renderLeaderboard(): Promise<void> {
  // Set loading text
  leaderboardText.setText("loading leaderboard...");
  subtitle.setText("Loading leaderboard");

  // Fetching failed
  if (sortedLeaderboard == undefined) {
    leaderboardText.setText("loading leaderboard\nfailed");
    subtitle.setText("Not available");
    return;
  }

  // Variables
  let line: number = 0;
  let nameIndex: number;
  let startI: number;
  let endI: number;

  // Display top 3 leaderboard
  switch (currentCategory) {
    case "default":
      for (let i: number = 0; i <= (sortedLeaderboard.length > range ? range : sortedLeaderboard.length) - 1; i++) {
        const text: Text = leaderboardLines[i];
        text.setText(formatText(i, sortedLeaderboard[i].name, sortedLeaderboard[i].score));
      }
      break;
    case "worst":
      for (let i: number = (sortedLeaderboard.length - range) > 0 ? sortedLeaderboard.length - range : 0; i <= sortedLeaderboard.length - 1; i++) {
        const text: Text = leaderboardLines[line];
        text.setText(formatText(i, sortedLeaderboard[i].name, sortedLeaderboard[i].score));
        line++;
      }
      break
    case "byName":
      nameIndex = sortedLeaderboard.findIndex(item => item.name === value); // index by name
      startI = nameIndex - Math.round(range / 2) + 1;
      if (startI < 0) startI = 0;
      endI = nameIndex + (range / 2);
      for (let i: number = startI; i <= endI; i++) {
        const text: Text = leaderboardLines[line];

        try {
          const thatName: string = sortedLeaderboard[i].name;
          const score: number = sortedLeaderboard[i].score;
          text.setText(formatText(i, thatName, score));
          if (thatName == value) text.setColor("#000000");
        } catch (e) {
          text.setText(formatText(i, "xxx", 0));
        }

        line++;
      }
      break
    case "byPlace":
      nameIndex = parseInt(<string>value, 10) - 1; // index by value
      startI = nameIndex - Math.round(range / 2) + 1;
      if (startI < 0) startI = 0;
      endI = nameIndex + (range / 2);
      for (let i: number = startI; i <= endI; i++) {
        const text: Text = leaderboardLines[line];

        try {
          const thatName: string = sortedLeaderboard[i].name;
          const score: number = sortedLeaderboard[i].score;
          text.setText(formatText(i, thatName, score));
          if (i == nameIndex) text.setColor("#000000");
        } catch (e) {
          text.setText(formatText(i, "xxx", 0));
        }
        line++;
      }
      break
  }

  // Removes "loading leaderboard" text
  leaderboardText.setText("");

  // Amount of entries
  const entries: number = range > sortedLeaderboard.length ? sortedLeaderboard.length : range;

  // Sets subtitle
  const subtitleText: string = ({
    "default": "Top " + entries,
    "worst": "Worst " + entries,
    "byName": "Leaderboard at @ " + value,
    "byPlace": "Leaderboard at " + value + ". place"
  })[currentCategory] || 'This text failed';
  subtitle.setText(subtitleText);
}

// Formates lines
function formatText(i: number, name: string, score: number): string {
  return `${i + 1}. ${name} - ${formatTime(score)}`
}

// Sort record/entries
function sort(record: Record<string, number>): leaderboardEntry[] {
  return Object.entries(record)
    .map(([name, score]): leaderboardEntry => ({name, score: Number(score)}))
    .sort((a: leaderboardEntry, b: leaderboardEntry): number => b.score - a.score);
}

// [GET] the current leaderboard
async function fetchLeaderboard() {
  try {
    const res: Response = await fetch(globalConsts.apiURL + "/leaderboard", {method: "GET"});
    if (!res.ok) throw new Error(`HTTP ERROR ${res.status}`);
    sortedLeaderboard = sort(await res.json()); // sort and set
  } catch (e) {
    sortedLeaderboard = undefined;
  }
}
