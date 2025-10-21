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

    // Back button - with keyboard 'B' and gamepad button 1 (B/Circle)
    this.buttonBack = new Button(this.gameW * 0.5, this.gameH * 0.25, 4, 'button_back', this, () => {
      this.scene.start('mainMenu')
    }, 'B', 1);

    // Sound: Toggle - with keyboard 'S' and gamepad button 0 (A/X)
    this.buttonSound = new Button(380, 300, 4, localStorage.getItem("isActive.sound") == "true" ? 'button_soundActive' : 'button_soundMute', this, () => this.toggle("isActive.sound", this.buttonSound), 'S', 0);

    // Sound: Label
    this.player_image = this.add.image(700, 300, 'button_sound');
    this.player_image.setScale(8);

    // Music: Toggle - with keyboard 'M' and gamepad button 2 (X/Square)
    this.buttonMusic = new Button(380, 400, 4, localStorage.getItem("isActive.music") == "true" ? 'button_soundActive' : 'button_soundMute', this, () => this.toggle("isActive.music", this.buttonMusic), 'M', 2);

    // Music: Label
    this.player_image = this.add.image(700, 400, 'button_music');
    this.player_image.setScale(8);
    
    // Add instructions text
    this.add.text(this.gameW * 0.5, this.gameH * 0.7, 'Steuerung: Maus, Tastatur (B,S,M) oder Gamepad', {
      font: "16px " + globalConsts.pixelFont,
      color: "#ffffff",
      align: 'center'
    }).setOrigin(0.5);
  }

  // Helper methode
  toggle(localStorageKey: string, button: Button): void {
    button.setImage(localStorage.getItem(localStorageKey) == "true" ? "button_soundMute" : "button_soundActive");
    localStorage.setItem(localStorageKey, (localStorage.getItem(localStorageKey) != "true").toString());
  }
}
