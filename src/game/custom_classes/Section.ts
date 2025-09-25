import {Scene} from "phaser";
import {Obstacle} from "./Obstacle";
import {globalConsts} from "../main";

export class Segment {
  background: string; //background
  difficulty: number; //difficulty -> possible number of obstacles
  obstacles: Obstacle[]; //array containing all obstacles
  curScene: Scene //current scene
  gameW: number = globalConsts.gameWidth;
  gameH: number = globalConsts.gameHeight;

  constructor(background: string, difficulty: number, obstacles: Obstacle[], curScene: Scene) {
    this.background = background;
    this.difficulty = difficulty;
    this.obstacles = obstacles;
    this.curScene = curScene;
  }

  generateTestSegment(pos: number): Segment {
    return new Segment(
      this.background,
      this.difficulty,
      [new Obstacle((this.gameW / 2) + this.gameW * pos, this.gameH - 80, "obstacle", this.curScene)],//put the obstacle in the same place relative to the segment
      this.curScene);
  }
}

export class Section {
  curScene: Scene;
  testSegments: Segment[];

  constructor(curScene: Scene) {
    this.curScene = curScene;
  }

  fillTestSegments() {
    let seg: Segment = new Segment("gameBackground", 1, [], this.curScene);
    for (let index = 0; index < 10; index++) {
      this.testSegments.push(seg.generateTestSegment(index));
    }
  }
}
