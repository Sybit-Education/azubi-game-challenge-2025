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

  // Create method
  create(): void {
    // Player
    displayPlayer(this);

    // Background
    this.cameras.main.setBackgroundColor(globalConsts.backgroundColor);

    // Back button
    this.buttonBack = new Button(this.gameW * 0.5, this.gameH * 0.25, 4, 'button_back', this, () => {
      this.scene.start('mainMenu')
    });

    // Sound: Toggle
    this.buttonSound = new Button(380, 300, 4, localStorage.getItem("isActive.sound") == "true" ? 'button_soundActive' : 'button_soundMute', this, () => this.toggle("isActive.sound", this.buttonSound));

    // Sound: Label
    this.player_image = this.add.image(700, 300, 'button_sound');
    this.player_image.setScale(8);


    // Music: Toggle
    this.buttonMusic = new Button(380, 400, 4, localStorage.getItem("isActive.music") == "true" ? 'button_soundActive' : 'button_soundMute', this, () => this.toggle("isActive.music", this.buttonMusic));

    // Music: Label
    this.player_image = this.add.image(700, 400, 'button_music');
    this.player_image.setScale(8);
  }

  // Helper methode
  toggle(localStorageKey: string, button: Button): void {
    button.setImage(localStorage.getItem(localStorageKey) == "true" ? "button_soundMute" : "button_soundActive");
    localStorage.setItem(localStorageKey, (localStorage.getItem(localStorageKey) != "true").toString());
  }
}
