import {Scene} from 'phaser';
import {start} from './Boot.ts';

export class Preloader extends Scene {

  // Constructor
  constructor() {
    super('preloader-main');
  }

  // Load all theme related assets
  preload(): void {
    // Sprites
    this.load.setPath('sprites');
    this.load.image('bench', 'bench.png');
    this.load.image('gift1', 'gift1.png');
    this.load.image("gift2", "gift2.png");
    this.load.image("gift3", "gift3.png");
    this.load.image("gift4", "gift4.png");
    this.load.image("player", "player.png");
    this.load.image("player2", "player2.png");
    this.load.image("playerSneaking", "playerSneaking.png");
    this.load.image("playerSneaking2", "playerSneaking2.png");
    this.load.image("trash", "trash.png");
    this.load.image("birdBlue","birdBlue.png");
    this.load.image("birdPink","birdPink.png");
    this.load.image("snowman","snowman.png");
    this.load.image("stone","stone.png");

    // Background
    this.load.setPath('background');
    this.load.image('church', 'church.png');
    this.load.image('cloud1', 'cloud1.png');
    this.load.image('ground', 'ground.png');
    this.load.image("house1", "house1.png");
    this.load.image("house2", "house2.png");
    this.load.image("house3", "house3.png");
    this.load.image("house4", "house4.png");
    this.load.image('gameBackground', 'image1.png');
    this.load.image('gameBackground2', 'image2.png');
  }

  // Loading done: start main menu scene
  create(): void {
    start(this.scene);
  }
}
