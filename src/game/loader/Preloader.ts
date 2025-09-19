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
  }

  // Loading done: start main scene
  create(): void {
    start(this.scene);
  }
}
