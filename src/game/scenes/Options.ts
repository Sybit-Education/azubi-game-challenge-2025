import {GameObjects, Scene} from "phaser";
import {globalConsts} from "../main";
import {Button} from "../custom_classes/Button";

export class Options extends Scene {
  // Types
  placeholderText: GameObjects.Text;
  background: GameObjects.Image;
  gameW: number = globalConsts.gameWidth;
  gameH: number = globalConsts.gameHeight;
  buttonBack: Button;
  buttonSound: Button;
  buttonMusic: Button;
  player_image: Phaser.GameObjects.Image;

  // Constructor
  constructor() {
    super("options");
  }

  // TODO: Add actual options
  // Create method
  create(): void {

    // Player Icon
    this.player_image = this.add.image(globalConsts.santaX, globalConsts.santaY, 'playerId');
    this.player_image.setScale(4);

    // Background
    this.cameras.main.setBackgroundColor(globalConsts.backgroundColor);

    // TODO: This has to be finished
    // Placeholder
    this.buttonBack = new Button(this.gameW * 0.5, this.gameH * 0.25, 4,'button_back', this, () => {
      this.scene.start('mainMenu')
    });
    this.buttonSound = new Button(400,300,4,'button_active',this,() => {
      this.buttonSound.image = "button_mute";
      console.log("test")
    })
    this.buttonMusic = new Button(400,400,4,'button_active',this,() => {})


  }
}
