import {Scene} from 'phaser';
import {globalConsts} from '../main.ts';
import {startLeaderboard} from '../../../server/leaderboard.ts';

export class GameOver extends Scene {
  // Types
  background: Phaser.GameObjects.Image;
  gameover_image: Phaser.GameObjects.Image;
  restart_text: Phaser.GameObjects.Text;
  playerScore: Phaser.GameObjects.Image;
  uploadCode: Phaser.GameObjects.Image;
  playerName: string;
  leaderboardOurs: string = ""

  // Constructor
  constructor() {
    super('gameOver');
  }
//leaderboard
  async init(data: any) {
    // [GET] new Code
    let codeX;
    await fetch("http://localhost:3000/newCode")
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(({ code }) => {
        // optional lokal merken
        localStorage.setItem("latestCode", code);
        codeX = code;
        console.log(code);})
      .catch(err => {
        console.error("newCode fetch failed:", err);
        this.add.text(16, 16, "Code konnte nicht geladen werden.", { fontSize: "20px", color: "#ff6666" });
      });

    this.playerScore = data.score;
    console.log('playerscore ',this.playerScore)
    await fetch("http://localhost:3000/leaderboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name:  localStorage.getItem('Kuerzel') , // könnt ihr auch abfragen lassen
        score: 55,
        code: codeX,
      })
    });
    console.log('Response: ', this.playerScore)
  }

// Pre-loader
  async preload(): Promise<void> {
    // GameOver Bild
    this.gameover_image = this.add.image(512, 250, 'gameOverTitle');

    this.gameover_image.setScale(0.2);

    let leaderboardObj: Record<string, number> = {};

    try {
      const res = await fetch("http://localhost:3000/leaderboard", { method: "GET" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      leaderboardObj = await res.json();
    } catch (err) {
      console.error("Leaderboard laden fehlgeschlagen:", err);
    }

    console.log(leaderboardObj)

    const leaderboard = Object.entries(leaderboardObj)
      .map(([name, score]) => ({ name, score: Number(score) }))
      .sort((a, b) => b.score - a.score);

    console.log(leaderboard)
    let yCoord = 320;
    for(let i = 0; i <= 2; i++) {
      this.add.text(
        220,
        yCoord,
        `${i + 1}: ${leaderboard[i].name} - ${leaderboard[i].score}`,
        { fontSize: "32px", color: "#000000" }
      );
      yCoord += 50;
    }
  }

  // Create methode
  create(): void {
    // Background
    this.cameras.main.setBackgroundColor(globalConsts.backgroundColor);

    // Onclick: MainMenu
    this.input.once('pointerdown', () => {
      this.scene.start('mainMenu');
    });
  }
}
