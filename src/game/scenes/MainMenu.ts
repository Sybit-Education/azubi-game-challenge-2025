import {Scene, GameObjects} from 'phaser';
import { globalConsts } from '../main';
import { Button } from '../custom_classes/Button';

export class MainMenu extends Scene {
  // Variables
  background: GameObjects.Image;
  gameW: number = globalConsts.gameWidth;
  gameH: number = globalConsts.gameHeight;
  buttonPlay: Button;
  buttonOptions: Button;
  buttonCredits: Button;

  // Constructor
  constructor() {
    super('mainMenu');
  }

  // Create methode
  create(): void {
    this.background = this.add.image(this.gameW / 2, this.gameH / 2, 'startBackground');

    //add buttons
    this.buttonPlay = new Button(this.gameW * 0.5, this.gameH * 0.25, 'button_play', this, () => {this.scene.start('play')});
    this.buttonOptions = new Button(this.gameW * 0.5, this.gameH * 0.5, 'button_options', this, () => {this.scene.start('options')});
    this.buttonCredits = new Button(this.gameW * 0.5, this.gameH * 0.75, 'button_credits', this, () => {this.scene.start('credits')});
  }
}
