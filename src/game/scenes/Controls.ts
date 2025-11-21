import {calculateScale, displayPlayer, globalConsts} from '../main.ts';
import {Button} from '../custom_classes/Button.ts';
import {ButtonManager} from '../custom_classes/ButtonManager.ts';
import Image = Phaser.GameObjects.Image;

// TODO | add controller controls
export class Controls extends Phaser.Scene {
  // Config
  style = {
    font: "25px pixelFont",
    color: "#ffffff",
    align: 'center'
  };

  // Types
  currentY: number
  keyboardImage: Image;
  back_button: Button;
  buttonManager: ButtonManager;

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

    // Creates the button manager
    this.buttonManager = new ButtonManager(this);

    // Back button
    this.back_button = new Button(globalConsts.gameWidth * 0.07, globalConsts.gameHeight * 0.1, calculateScale(3.5), 'button_back', this, () => {
      this.scene.start('mainMenu')
    }, 'B', 3, this.buttonManager);

    // Main info
    this.keyboardImage = this.add.image(globalConsts.gameWidth / 2, globalConsts.gameHeight * 0.15, 'button_keyboard');
    this.keyboardImage.setScale(calculateScale(0.7));
    this.keyboardImage.setOrigin(0.5, 0);

    // Resets currentY
    this.currentY = globalConsts.gameHeight * 0.68;
    const x = globalConsts.gameWidth * 0.38;
    const scale = calculateScale(1);

    // Text
    this.scene.scene.add.text(x, this.getY(), "ESC - Exit active Game", this.style).setOrigin(0, 0).setScale(scale);
    this.scene.scene.add.text(x, this.getY(), " W  - Jump", this.style).setOrigin(0, 0).setScale(scale);
    this.scene.scene.add.text(x, this.getY(), " S  - Sneak", this.style).setOrigin(0, 0).setScale(scale);
    this.scene.scene.add.text(x, this.getY(), " A  - Move left", this.style).setOrigin(0, 0).setScale(scale);
    this.scene.scene.add.text(x, this.getY(), " D  - Move right", this.style).setOrigin(0, 0).setScale(scale);

    // Add ESC key handler
    const escKey = this.input.keyboard?.addKey('ESC');
    escKey?.on('down', () => {
      this.scene.start('mainMenu');
    });
  }

  // Gets y level for text
  getY(): number {
    return this.currentY += calculateScale(31);
  }
}
