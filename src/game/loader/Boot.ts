import {Scene} from 'phaser';

export class Boot extends Scene {

  // Constructor
  constructor() {
    super("boot");
  }

  // Load global assets
  preload(): void {
    // Font
    this.load.font("pixelFont", "PressStart2P.ttf", "truetype")

    // Hud
    this.load.setPath("hud");
    this.load.image("gameOverTitle", "gameOver.png");
    this.load.image("logo", "logo.png");

    // Buttons
    this.load.setPath("hud/buttons");
    this.load.image("button_back", "back.png");
    this.load.image("button_byName", "byName.png");
    this.load.image("button_byPlace", "byPlace.png");
    this.load.image("button_byScore", "byScore.png");
    this.load.image("button_close", "close.png");
    this.load.image("button_controller", "controller.png");
    this.load.image("button_controls", "controls.png");
    this.load.image("button_credits", "credits.png");
    this.load.image("button_default", "default.png");
    this.load.image("button_gifts", "gifts.png");
    this.load.image("button_highscore", "highscore.png");
    this.load.image("button_jumpsLeft", "jumpsLeft.png");
    this.load.image("button_keyboard", "keyboard.png");
    this.load.image("button_leaderboard", "leaderboard.png");
    this.load.image("button_music", "music.png");
    this.load.image("button_options", "options.png");
    this.load.image("button_play", "play.png");
    this.load.image("button_refresh", "refresh.png");
    this.load.image("button_save", "save.png");
    this.load.image("button_saved", "saved.png");
    this.load.image("button_search", "search.png");
    this.load.image("button_sound", "sound.png");
    this.load.image("button_soundActive", "soundActive.png");
    this.load.image("button_soundMute", "soundMute.png");
    this.load.image("button_top", "top.png");
    this.load.image("button_worst", "worst.png");
    this.load.image("button_yourScore", "yourScore.png");
  }

  // Loading done: load theme elements
  create(): void {
    this.scene.start('preloader-main');
  }
}

// When all assets are done
export function start(scene: Phaser.Scenes.ScenePlugin): void {

  // Switch to main menu
  scene.start('mainMenu');
}
