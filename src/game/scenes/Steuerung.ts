import {displayPlayer, globalConsts} from '../main.ts';
import Image = Phaser.GameObjects.Image;
import {Button} from '../custom_classes/Button.ts';

export class Steuerung extends Phaser.Scene {
  // Types
  knoepfe_image: Image;
  back_button: Button;

  // Constructor
  constructor() {
    super("steuerung");
  }

  // Create
  create(): void {
    // Player
    displayPlayer(this);

    // Background
    this.cameras.main.setBackgroundColor(globalConsts.backgroundColor);

    // Main info
    this.knoepfe_image = this.add.image(512, 400, 'button_knöpfe');
    this.knoepfe_image.setScale(6);

    // Back button
    this.back_button = new Button(globalConsts.gameWidth * 0.5, globalConsts.gameHeight * 0.25, 4, 'button_back', this, () => {
      this.scene.start('mainMenu')
    });
  }


}
