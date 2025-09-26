import {Scene} from "phaser";
import {Ground} from "./Ground";
import {Obstacle} from "./Obstacle";
import {globalConsts} from "../main";

export class Segment {
  x: number;
  y: number;
  gameWidth: number = globalConsts.gameWidth;
  gameHeight: number = globalConsts.gameHeight;
  width: number;
  height: number;
  obstacles: Obstacle[];
  obstacleBodies: Phaser.Physics.Arcade.Sprite[] = [];
  ground: Ground;
  curScene: Scene;
  segment: Phaser.Physics.Arcade.Sprite;
  segmentBodies: Phaser.Physics.Arcade.Sprite[];

  constructor(x: number, y: number, image: string, scale: number, curScene: Scene) {
    // Set variables
    this.x = x;
    this.y = y;
    this.curScene = curScene;
    this.ground = new Ground(x, y, this.curScene);
    this.obstacles = [new Obstacle((x + this.gameWidth) * 0.5, this.gameHeight - 80, "obstacle", this.curScene)];
    this.obstacles.forEach(obstacle => this.obstacleBodies.push(obstacle.sprite));
    this.segment = this.curScene.physics.add.sprite(this.x, this.y, image);
    this.segmentBodies = [this.segment, this.ground.sprite].concat(this.obstacleBodies);

    // Modifier
    this.segment.setScale(scale); // set segment scale
    this.segment.setDepth(-4); // Sets Depth to -4

    // Get sprite height & width
    this.width = this.segment.width;
    this.height = this.segment.height;
  }
}
