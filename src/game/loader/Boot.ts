import {Scene} from 'phaser';

export class Boot extends Scene {

  // Constructor
  constructor() {
    super('boot');
  }

  // Load global assets
  preload(): void {
    this.load.image("startBackground", "assets/bg.png");
  }

  // Loading done: load theme elements
  create(): void {
    this.scene.start('preloader-main');
  }
}

// When all assets are done
// When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
// For example, you can define global animations here, so we can use them in other scenes.
export function start(scene: Phaser.Scenes.ScenePlugin): void {

  // Switch to main menu
  scene.start('mainMenu');
}
