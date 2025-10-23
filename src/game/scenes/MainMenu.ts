import {Scene} from 'phaser';
import {displayPlayer, globalConsts} from '../main';
import {Button} from '../custom_classes/Button';
import {ButtonManager} from '../custom_classes/ButtonManager';

export class MainMenu extends Scene {
  // Types
  background: Phaser.Cameras.Scene2D.Camera;
  gameW: number = globalConsts.gameWidth;
  gameH: number = globalConsts.gameHeight;
  logo_image: Phaser.GameObjects.Image;
  buttonPlay: Button;
  buttonOptions: Button;
  buttonControl: Button;
  buttonCredits: Button;
  buttonLeaderboard: Button;
  buttonClose: Button;
  buttonManager: ButtonManager;

  // Constructor
  constructor() {
    super('mainMenu');
  }

  // Create methode
  create(): void {
    // Player Icon
    displayPlayer(this);

    // Logo
    this.logo_image = this.add.image(550, 130, 'logo');
    this.logo_image.setScale(9);

    // Background
    this.cameras.main.setBackgroundColor(globalConsts.backgroundColor);

    // Create a button manager
    this.buttonManager = new ButtonManager(this);

    // Adds buttons
    this.buttonPlay = new Button(this.gameW * 0.5, this.gameH * 0.36, 8, 'button_play', this, () => this.scene.start('thatGame'), 'P', 0, this.buttonManager);
    this.buttonOptions = new Button(this.gameW * 0.5, this.gameH * 0.47, 5, 'button_options', this, () => this.scene.start('options'), 'O', 1, this.buttonManager);
    this.buttonControl = new Button(this.gameW * 0.5, this.gameH * 0.55, 5, 'button_controls', this, () => this.scene.start('controls'), 'T', 2, this.buttonManager);
    this.buttonCredits = new Button(this.gameW * 0.5, this.gameH * 0.63, 5, 'button_credits', this, () => this.scene.start('credits'), 'C', 3, this.buttonManager);
    this.buttonLeaderboard = new Button(this.gameW * 0.5, this.gameH * 0.71, 5, "button_leaderboard", this, () => this.scene.start('leaderboard'), 'L', 4, this.buttonManager);

    // Close button (only if opened in a popup)
    if (window.opener != null) {
      this.buttonClose = new Button(this.gameW * 0.94, this.gameH * 0.07, 4, 'button_close', this, () => window.close(), 'X', 5, this.buttonManager); // This is a website close button
    }

    // Add navigation instructions
    this.add.text(this.gameW * 0.7, this.gameH * 0.9, 'Navigation: Arrow keys, Tab, Space\nor Gamepad D-Pad/Stick', {
      font: "16px " + globalConsts.pixelFont,
      color: "#000000",
      align: 'center'
    }).setOrigin(0.5);
  }
}
