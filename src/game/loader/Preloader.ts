import {Scene} from 'phaser';
import {start} from './Boot.ts';

export class Preloader extends Scene {

  // Constructor
  constructor() {
    super('preloader-main');
  }

  // Load all theme related assets
  preload(): void {
    // General, which we are trying to replace in the future
    this.load.setPath('assets');
    this.load.image("playerIdle", "Player_Test_Sprite.png");
    this.load.image("playerDucking", "Player_Test_Sprite_Ducking.png");
    this.load.image("obstacle", "Obstacle_Test_Sprite.png");
    this.load.image("ground", "Ground_Test_Sprite.png");
    this.load.image("testBackground","Background_Test_Sprite.png");

    // Sprites
    this.load.setPath('sprites');
    this.load.image('bench', 'bench.png');
    this.load.image('gift1', 'gift1.png');
    this.load.image("gift2", "gift2.png");
    this.load.image("gift3", "gift3.png");
    // NOTE: I don't want to overwrite the player right now
    this.load.image("playerId", "player.png");
    //this.load.image("playerDucking", "playerSneaking.png");
    this.load.image("trash", "trash.png");

    // Background
    this.load.setPath('background');
    this.load.image('gameBackground', 'image.png');
    this.load.image('gameBackground2', 'image2.png');
    this.load.image('church', 'church.png');
    this.load.image('cloud1', 'cloud1.png');
    this.load.image("house1", "house1.png");
    this.load.image("house2", "house2.png");
    this.load.image("house3", "house3.png");
    this.load.image("house4", "house4.png");
  }

  // Loading done: start main menu scene
  create(): void {
    start(this.scene);
  }
}
