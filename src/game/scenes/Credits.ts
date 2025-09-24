import {globalConsts} from "../main";

// Config
const scrollSpeed: number = 150;
const font: string = '24px Arial';
const roleColor: string = '#ffffff';
const nameColor: string = '#ffffff';
const jsonPath: string = "./src/game/scenes/creditsConfig.json";

export class Credits extends Phaser.Scene {
  // Types
  player_image: Phaser.GameObjects.Image;
  creditTexts: Phaser.GameObjects.Text[];

  // Constructor
  constructor() {
    super("credits");
  }

  // Preloader
  preload() {
    this.load.json('creditsData', jsonPath);
  }

  // Create
  create(): void {
    // Player Icon
    this.player_image = this.add.image(globalConsts.santaX, globalConsts.santaY, 'playerId');
    this.player_image.setScale(4);

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

    // TODO | Add "SyRun: The Team" & "Thank you for playing"

    // Generate rows
    for (let role in data) {
      // Names
      const names: string[] = data[role];

      // Roles | left
      const roleText: Phaser.GameObjects.Text = this.add.text(leftX, startY, this.capitalize(role), {
        font: font,
        color: roleColor,
        align: 'left'
      }).setOrigin(0, 0);
      this.creditTexts.push(roleText);
      startY += 40;

      // Person | right
      for (let name of names) {
        const nameText = this.add.text(rightX, startY, name, {
          font: font,
          color: nameColor,
          align: 'right'
        }).setOrigin(0, 0);
        this.creditTexts.push(nameText);
        startY += 40;
      }

      // Extra space after role
      startY += 30;
    }

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
    const last: Phaser.GameObjects.Text = this.creditTexts[this.creditTexts.length - 1];
    if (last.y < -50) {
      this.scene.start("mainMenu");
    }
  }

  // Capitalize first letter
  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
