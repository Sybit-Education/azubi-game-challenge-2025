import {GameObjects, Scene} from 'phaser';
import {displayPlayer, globalConsts} from '../main.ts';
import {Button} from '../custom_classes/Button.ts';
import Image = Phaser.GameObjects.Image;

export class Steuerung extends Phaser.Scene{

  // Types
  background: GameObjects.Image;
  gameW: number = globalConsts.gameWidth;
  gameH: number = globalConsts.gameHeight;
  buttonBack: Button;
  knoepfe_image: Image;

  // Constructor
  constructor() {
    super("steuerung");
  }


  create(): void {
    // Player
    displayPlayer(this);

    // Background
    this.cameras.main.setBackgroundColor(globalConsts.backgroundColor);

    this.knoepfe_image = this.add.image(512, 400, 'button_knopfe');
    this.knoepfe_image.setScale(6);

    // Placeholder
    this.buttonBack = new Button(this.gameW * 0.5, this.gameH * 0.25, 4, 'button_back', this, () => {
      this.scene.start('mainMenu')
    });
  }}
