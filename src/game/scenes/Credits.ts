import {displayPlayer, globalConsts} from "../main";
import Text = Phaser.GameObjects.Text;

// Config
const scrollSpeed: number = 150;
const font: string = "Tiny5";
const roleColor: string = '#ffffff';
const nameColor: string = '#ffffff';
const jsonPath: string = "./src/game/scenes/creditsConfig.json";

export class Credits extends Phaser.Scene {
  // Types
  creditTexts: Phaser.GameObjects.Text[];

  // Constructor
  constructor() {
    super("credits");
  }

  // Preloader
  preload(): void {
    this.load.json('creditsData', jsonPath);
  }

  // Create
  create(): void {
    // Player Icon
    displayPlayer(this);

    // Variables
    const gameW: number = globalConsts.gameWidth;
    const gameH: number = globalConsts.gameHeight;
    const data = this.cache.json.get('creditsData'); // Json

    // Background
    this.cameras.main.setBackgroundColor(globalConsts.backgroundColor);

    // Variables
    this.creditTexts = [];

    // Config
    const leftX: number = gameW * 0.45;
    const rightX: number = gameW * 0.65;
    let startY: number = gameH;

    // Title
    const text: Text = this.add.text(gameW * 0.45, startY, "SyRun: Team", {
      fontFamily: font,
      fontSize: "75px",
      color: roleColor,
      align: 'center'
    }).setOrigin(0, 0);
    this.creditTexts.push(text);

    // Space
    startY += 125;

    // Generate rows
    for (let role in data) {
      // Names
      const names: string[] = data[role];

      // Roles | left
      const roleText: Text = this.add.text(leftX, startY, this.capitalize(role), {
        font: "30px " + font,
        color: roleColor,
        align: 'left'
      }).setOrigin(0, 0);
      this.creditTexts.push(roleText);

      // Person | right
      for (let name of names) {
        const nameText: Text = this.add.text(rightX, startY, name, {
          font: "30px " + font,
          color: nameColor,
          align: 'right'
        }).setOrigin(0, 0);
        this.creditTexts.push(nameText);
        startY += 40;
      }

      // Extra space after role
      startY += 50;
    }

    // Extra space for footer
    startY += 350;

    // "Thank you for playing" text
    const footer: Text = this.add.text(gameW * 0.45, startY, "Thank you for playing", {
      font: "48px " + font,
      color: roleColor,
      align: 'center'
    }).setOrigin(0, 0);
    this.creditTexts.push(footer);

    // Onclick: MainMenu
    this.input.once('pointerdown', () => {
      this.scene.start('mainMenu');
    });
  }

  // Scroll Effekt
  update(_time: number, delta: any): void {
    for (let text of this.creditTexts) {
      text.y -= scrollSpeed * (delta / 1000);
    }

    // All name done
    const last: Phaser.GameObjects.Text = this.creditTexts[this.creditTexts.length - 2];
    if (last == undefined || last.y == undefined) return;
    if (last.y < -50) {
      this.creditTexts.splice(this.creditTexts.length - 1, 1);
      this.time.addEvent({delay: 500, callback: () => this.scene.start("mainMenu"), callbackScope: this, loop: false});
    }
  }

  // Capitalize first letter
  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
