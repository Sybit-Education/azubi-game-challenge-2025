import {Scene} from "phaser"

export class Obstacle {
  x: number;
  y: number;
  image: string;
  curScene: Scene;
  sprite: Phaser.Physics.Arcade.Sprite

  constructor(x: number, y: number, image: string, curScene: Scene) {
    this.x = x;
    this.y = y;
    this.image = image;
    this.curScene = curScene;

    this.sprite = this.curScene.physics.add.sprite(this.x, this.y, this.image);
    this.sprite.setSize(32, 32);
  }
}
