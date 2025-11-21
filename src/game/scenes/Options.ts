import {Scene} from "phaser";
import {calculateScale, displayPlayer, escapeOption, globalConsts} from "../main";
import {Button} from "../custom_classes/Button";
import {ButtonManager} from "../custom_classes/ButtonManager";

export class Options extends Scene {
  // Types
  buttonBack: Button;
  buttonSound: Button;
  buttonMusic: Button;
  buttonManager: ButtonManager;

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

    // Creates the button manager
    this.buttonManager = new ButtonManager(this);

    // Back button - with keyboard 'B' and gamepad button 1 (B/Circle)
    this.buttonBack = new Button(globalConsts.gameWidth * 0.05, globalConsts.gameHeight * 0.08, calculateScale(4), 'button_back', this, () => {
      this.scene.start('mainMenu')
    }, 'B', 1, this.buttonManager);


    // Add ESC key handler
    escapeOption(this.scene.scene);

    // Sound
    this.buttonSound = new Button(
      globalConsts.gameWidth * 0.4,
      globalConsts.gameHeight * 0.4,
      calculateScale(3),
      localStorage.getItem("isActive.sound") == "true" ? 'button_soundActive' : 'button_soundMute',
      this,
      () => this.toggle("isActive.sound", this.buttonSound),
      'S',
      0,
      this.buttonManager
    );
    this.add.image(globalConsts.gameWidth * 0.48, globalConsts.gameHeight * 0.4, 'button_sound')
      .setScale(calculateScale(6))
      .setOrigin(0, 0.5);

    // Music
    this.buttonMusic = new Button(
      globalConsts.gameWidth * 0.4,
      globalConsts.gameHeight * 0.5,
      calculateScale(3),
      localStorage.getItem("isActive.music") == "true" ? 'button_soundActive' : 'button_soundMute',
      this,
      () => this.toggle("isActive.music", this.buttonMusic),
      'M',
      0,
      this.buttonManager
    );
    this.add.image(globalConsts.gameWidth * 0.48, globalConsts.gameHeight * 0.5, 'button_music')
      .setScale(calculateScale(6))
      .setOrigin(0, 0.5);

  }

  // Helper methode
  toggle(localStorageKey: string, button: Button): void {
    button.setImage(localStorage.getItem(localStorageKey) == "true" ? "button_soundMute" : "button_soundActive");
    localStorage.setItem(localStorageKey, (localStorage.getItem(localStorageKey) != "true").toString());
  }
}
