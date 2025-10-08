import {displayPlayer, globalConsts} from '../main.ts';
import Image = Phaser.GameObjects.Image;
import {Button} from '../custom_classes/Button.ts';

export class Controls extends Phaser.Scene {
  // Config
  x: number = 425;
  startY: number = 540;
  space: number = 35;
  style = {
    font: "25px pixelFont",
    color: "#ffffff",
    align: 'center'
  };

  // Types
  keyboardImage: Image;
  back_button: Button;
  currentY: number = this.startY;

  // Constructor
  constructor() {
    super("controls");
  }

  // Create
  create(): void {
    // Player
    displayPlayer(this);

    // Background
    this.cameras.main.setBackgroundColor(globalConsts.backgroundColor);

    // Main info
    this.keyboardImage = this.add.image(512, 400, 'button_keyboard');
    this.keyboardImage.setScale(0.7);

    // Text
    this.scene.scene.add.text(this.x, this.getY(), "ESC - Exit active Game", this.style).setOrigin(0, 0);
    this.scene.scene.add.text(this.x, this.getY(), " W  - Jump", this.style).setOrigin(0, 0);
    this.scene.scene.add.text(this.x, this.getY(), " S  - Sneak", this.style).setOrigin(0, 0);
    this.scene.scene.add.text(this.x, this.getY(), " A  - Move left", this.style).setOrigin(0, 0);
    this.scene.scene.add.text(this.x, this.getY(), " D  - Move right", this.style).setOrigin(0, 0);

    // Back button
    this.back_button = new Button(globalConsts.gameWidth * 0.5, globalConsts.gameHeight * 0.25, 4, 'button_back', this, () => {
      this.scene.start('mainMenu')
    });
  }

  // Gets y level for text
  getY(): number {
    return this.currentY += this.space;
  }
}
