import {Scene} from 'phaser';
import {start} from './Boot.ts';

export class Preloader extends Scene {

  // Constructor
  constructor() {
    super('preloader-main');
  }

  // Load all theme related assets
  preload(): void {
    this.load.setPath('assets');
    this.load.image('gameBackground', 'Background_Test_Sprite.png');
    this.load.image("playerIdle", "Player_Test_Sprite.png");
    this.load.image("playerDucking", "Player_Test_Sprite_Ducking.png");
    this.load.image("obstacle", "Obstacle_Test_Sprite.png");
    this.load.image('logo', 'logo.png');
    this.load.image("ground", "Ground_Test_Sprite.png");
    //this.load.image('gameOverTitle', 'GameOver.png');
    this.load.image('button_play', 'Button_Play.png');
    this.load.image('button_options', 'Button_Options.png');
    this.load.image('button_credits', 'Button_Credits.png');
    this.load.image('button_back', 'Button_Back.png');
  }

  // Loading done: start main menu scene
  create(): void {
    start(this.scene);
  }
}
