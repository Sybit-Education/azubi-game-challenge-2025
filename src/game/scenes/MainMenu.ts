import {Scene} from 'phaser';
import {globalConsts} from '../main';
import {Button} from '../custom_classes/Button';

export class MainMenu extends Scene {
  // Types
  background: Phaser.Cameras.Scene2D.Camera;
  gameW: number = globalConsts.gameWidth;
  gameH: number = globalConsts.gameHeight;
  buttonPlay: Button;
  buttonOptions: Button;
  buttonCredits: Button;
  buttonSteuerung: Button;
  player_image: Phaser.GameObjects.Image;
  buttonClose: Button;
  logo_image: Phaser.GameObjects.Image;

  // Constructor
  constructor() {
    super('mainMenu');
  }

  // Create methode
  create(): void {
    // Player Icon
    this.player_image = this.add.image(globalConsts.santaX, globalConsts.santaY, 'playerId');
    this.player_image.setScale(4);

    this.logo_image = this.add.image(  550,130,'logo' );
    this.logo_image.setScale(9);

    // Background
    this.cameras.main.setBackgroundColor(globalConsts.backgroundColor);

    // Adds buttons
    this.buttonPlay = new Button(this.gameW * 0.5, this.gameH * 0.37, 7, 'button_play', this, () => this.scene.start('gameOver'));
    this.buttonOptions = new Button(this.gameW * 0.5, this.gameH * 0.5, 7, 'button_options', this, () => this.scene.start('options'));
    this.buttonCredits = new Button(this.gameW * 0.5, this.gameH * 0.75, 7, 'button_credits', this, () => this.scene.start('credits'));
    this.buttonSteuerung = new Button(this.gameW * 0.59, this.gameH * 0.67, 0.2, 'button_steuerung', this, () => this.scene.start('steuerung'))
    if (window.opener != null) this.buttonClose = new Button(this.gameW * 0.5, this.gameH * 0.85, 6, 'button_credits', this, () => window.close()); // This is a website close button
  }

}
