import {displayPlayer, escapeOption, globalConsts} from "../main";
import Text = Phaser.GameObjects.Text;
import {Button} from "../custom_classes/Button";
import {ButtonManager} from "../custom_classes/ButtonManager";

// Config
const scrollSpeed: number = 150;
const roleColor: string = '#000000';
const nameColor: string = '#000000';
const jsonPath: string = "./src/game/scenes/creditsConfig.json";

// TODO | add "thanks to all testers"
export class Credits extends Phaser.Scene {
  // Types
  creditTexts: Phaser.GameObjects.Text[];
  buttonManager: ButtonManager;
  back_button: Button;

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
    const font: string = globalConsts.pixelFont;
    const data = this.cache.json.get('creditsData'); // Json

    // Background
    this.cameras.main.setBackgroundColor(globalConsts.backgroundColor);

    // Creates a button manager
    this.buttonManager = new ButtonManager(this);

    // Back button
    this.back_button = new Button(globalConsts.gameWidth * 0.15, globalConsts.gameHeight * 0.1, 4, 'button_back', this, () => {
      this.scene.start('mainMenu')
    }, 'B', 0, this.buttonManager);

    // Variables
    this.creditTexts = [];

    // Config
    const leftX: number = gameW * 0.44;
    const rightX: number = gameW * 0.72;
    let startY: number = gameH;

    // Title | NOTE: I hate you
    const text: Text = this.add.text(gameW * 0.42, startY, "SyRun: Team", {
      font: "40px " + font,
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
        font: "20px " + font,
        color: roleColor,
        align: 'left'
      }).setOrigin(0, 0);
      this.creditTexts.push(roleText);

      // Person | right
      for (let name of names) {
        const nameText: Text = this.add.text(rightX, startY, name, {
          font: "20px " + font,
          color: nameColor,
          align: 'right'
        }).setOrigin(0, 0);
        this.creditTexts.push(nameText);
        startY += 40;
      }

      // Extra space after a role
      startY += 50;
    }

    // Extra space for footer
    startY += 350;

    // "Thank you for playing" text
    const footer: Text = this.add.text(gameW * 0.38, startY, "Thank you for playing", {
      font: "30px " + font,
      color: roleColor,
      align: 'center'
    }).setOrigin(0, 0);
    this.creditTexts.push(footer);

    // Add ESC key handler
    escapeOption(this.scene.scene);

    // Onclick: MainMenu (keep for mouse users)
    this.input.once('pointerdown', () => {
      this.scene.start('mainMenu');
    });
  }

  // Scroll Effect
  update(_time: number, delta: any): void {
    for (let text of this.creditTexts) {
      text.y -= scrollSpeed * (delta / 1000);
    }

    // All name done
    const last: Phaser.GameObjects.Text = this.creditTexts[this.creditTexts.length - 2];
    if (last == undefined || last.y == undefined) return;
    if (last.y < -20) {
      this.creditTexts.splice(this.creditTexts.length - 1, 1);
      this.time.addEvent({delay: 500, callback: () => this.scene.start("mainMenu"), callbackScope: this, loop: false});
    }
  }

  // Capitalize the first letter
  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

}
