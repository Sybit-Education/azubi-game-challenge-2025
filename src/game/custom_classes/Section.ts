import {Scene} from "phaser";
import {Segment} from "./Segment";
import {globalConsts} from '../main.ts';

// Config
const speed: number = -100;

export class Section {
  curScene: Scene;
  segments: Segment[] = [];
  groundSprites: Phaser.GameObjects.Sprite[] = [];
  gameHeight: number = globalConsts.gameHeight;
  gameWidth: number = globalConsts.gameWidth;
  width: number;
  height: number;

  // Construct
  constructor(scene: Scene, imageID: string) {
    this.curScene = scene;
    let image = scene.add.image(0, 0, imageID);
    this.width = image.width;
    this.height = image.height;
    for (let i = 0; i < 3; i++) {
      let lastX: number = this.gameWidth * 0.5;
      const seg = new Segment(lastX, this.gameHeight * 0.5, imageID, 1, scene);
      this.segments.push(seg);
      this.groundSprites.push(seg.ground.sprite);
    }
  }

  // Moves segments
  updateSegments() {
    for (let segment of this.segments) {
      for (let bodies of segment.segmentBodies) {
        bodies.setVelocityX(speed);
      }
    }
  }
}
