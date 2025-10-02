import {Scene} from 'phaser';
import {displayPlayer, globalConsts} from '../main';
import {Button} from '../custom_classes/Button';

export class MainMenu extends Scene {
  // Types
  background: Phaser.Cameras.Scene2D.Camera;
  gameW: number = globalConsts.gameWidth;
  gameH: number = globalConsts.gameHeight;
  logo_image: Phaser.GameObjects.Image;
  buttonPlay: Button;
  buttonOptions: Button;
  buttonSteuerung: Button;
  buttonCredits: Button;
  buttonClose: Button;

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

    // Adds buttons
    this.buttonPlay = new Button(this.gameW * 0.5, this.gameH * 0.37, 7, 'button_play', this, () => this.scene.start('thatGame'));
    this.buttonOptions = new Button(this.gameW * 0.5, this.gameH * 0.5, 7, 'button_options', this, () => this.scene.start('options'));
    this.buttonCredits = new Button(this.gameW * 0.5, this.gameH * 0.75, 7, 'button_credits', this, () => this.scene.start('credits'));
    this.buttonSteuerung = new Button(this.gameW * 0.5, this.gameH * 0.63, 7, 'button_steuerung', this, () => this.scene.start('steuerung'))
    if (window.opener != null) this.buttonClose = new Button(this.gameW * 0.5, this.gameH * 0.85, 6, 'button_close', this, () => window.close()); // This is a website close button
  }
}
