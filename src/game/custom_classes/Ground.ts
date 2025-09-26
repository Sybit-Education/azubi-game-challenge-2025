
import {Scene} from "phaser";
import {globalConsts} from '../main.ts';

export class Ground {
  x: number;
  y: number;
  curScene: Scene
  sprite: Phaser.Physics.Arcade.Sprite

  constructor(x: number, y: number, curScene: Scene) {
    this.x = x;
    this.y = y;
    this.curScene = curScene;

    this.sprite = curScene.physics.add.sprite(this.x, globalConsts.gameHeight - 32, "ground");
  }
}
