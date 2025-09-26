import {GameObjects, Scene} from "phaser";
import {displayPlayer, globalConsts} from "../main";
import {Button} from "../custom_classes/Button";

export class Options extends Scene {
  // Types
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
    // Player
    displayPlayer(this);

    // Background
    this.cameras.main.setBackgroundColor(globalConsts.backgroundColor);

    // TODO: This has to be finished
    // Placeholder
    this.buttonBack = new Button(this.gameW * 0.5, this.gameH * 0.25, 4, 'button_back', this, () => {
      this.scene.start('mainMenu')
    });

    // Sound: Toggle
    this.buttonSound = new Button(380, 300, 4, localStorage.getItem("isActive.sound") == "true" ?
      'button_soundActive' : 'button_soundMute', this, () => {

      if (localStorage.getItem("isActive.sound") == "true") {
        this.buttonSound.setImage('button_soundMute');
      } else {
        this.buttonSound.setImage('button_soundActive');
      }
      localStorage.setItem("isActive.sound", (localStorage.getItem("isActive.sound") != "true").toString());
    });

    // Sound: Label
    this.player_image = this.add.image(700, 300, 'button_sound');
    this.player_image.setScale(8);


    // Musik: Toggle
    this.buttonMusic = new Button(380, 400, 4, localStorage.getItem("isActive.music") == "true" ?
      'button_soundActive' : 'button_soundMute', this, () => {

      if (localStorage.getItem("isActive.music") == "true") {
        this.buttonMusic.setImage('button_soundMute');
      } else {
        this.buttonMusic.setImage('button_soundActive');
      }
      localStorage.setItem("isActive.music", (localStorage.getItem("isActive.music") != "true").toString());
    });

    // Music: Label
    this.player_image = this.add.image(700, 400, 'button_music');
    this.player_image.setScale(8);


  }
}
