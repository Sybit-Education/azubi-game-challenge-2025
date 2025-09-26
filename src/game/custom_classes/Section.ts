import {Scene} from "phaser";
import {Obstacle} from "./Obstacle";
import {globalConsts} from "../main";

const gameW: number = globalConsts.gameWidth;
const gameH: number = globalConsts.gameHeight;

export class Segment {
  index: number; //index (used to determine when a section nears the end)
  isOnGround: boolean; //will this be on the ground or air?
  difficulty: number; //difficulty -> possible number of obstacles
  obstacles: Obstacle[]; //array containing all obstacles
  curScene: Scene //current scene
  ground: Phaser.Physics.Arcade.Sprite;

  constructor(index: number, isOnGround:boolean, difficulty: number, obstacles: Obstacle[], curScene: Scene) {
    this.index = index;
    this.isOnGround = isOnGround;
    this.difficulty = difficulty;
    this.obstacles = obstacles;
    this.curScene = curScene;

    this.ground = this.curScene.physics.add.sprite((gameW / 2) * this.index, gameH - 32, "ground");
    this.ground.setImmovable(true);
  }
  deleteSelf(){//delete all objects within the segment (ground and obstacles)
    this.ground.destroy();
    this.obstacles.forEach(entry => entry.sprite.destroy());
  }
}
// (this.gameW / amtObsctacles) * i + 1
function generateSegment(index: number, isOnGround: boolean, difficulty: number, curScene: Scene): Segment{
  let amtObstacles: number = Math.round(globalConsts.getRandomInt(0,difficulty) * 0.2);
  let obstacles: Obstacle[] = [];
  let min: number = 0;
  for(let i = 0; i < amtObstacles; i++){
    obstacles.push(new Obstacle(globalConsts.getRandomInt(min, (gameW / amtObstacles) * i + 1),gameH - 80, 'obstacle', curScene));
    min = (gameW / amtObstacles) * i + 1;
  }
  return new Segment(index,isOnGround,difficulty,obstacles,curScene);
}

export class Section {
  curScene: Scene;
  segments: Segment[] = [];
  speed: number = 160;

  constructor(curScene: Scene) {
    this.curScene = curScene;
    for(let i = 1; i <= 10; i++){
      this.segments.push(generateSegment(i,true,5,curScene));
    }
  }
  isCloseToEnd(curSegment: Segment):boolean {
    if(curSegment.index >= 8)return true;
    else return false;
  }

  updateSegments(): void {
    for (let segment of this.segments) {
      for (let segmentBody of segment.segmentBodies) {
        segmentBody.setVelocityX(speed);
      }
    }
  }

}
