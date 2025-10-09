import {Scene} from "phaser"
import {globalConsts} from '../main.ts';

// TODO: Add package
export enum obstacleType {
  BIRDBLUE = "BIRDBLUE",
  BIRDPINK = "BIRDPINK",
  SNOWMAN = "SNOWMAN",
  ROCKS = "ROCKS",
  MARKER = "MARKER",

}

// All obstacle array
export const viableObstacles: obstacleType[] = [obstacleType.BIRDBLUE, obstacleType.BIRDPINK, obstacleType.SNOWMAN, obstacleType.ROCKS];

interface obstacleProperties {
  y: () => number;
  sprite: string,
  width: number,
  height: number,
  offsetX: number,
  offsetY: number,
  scale: number,
  weight: number
}

//TODO: change weight config
const obstaclePropertiesMap: Record<obstacleType, obstacleProperties> = {
  [obstacleType.BIRDBLUE]: {
    y: () => globalConsts.getRandomInt(globalConsts.gameHeight * 0.4, globalConsts.gameHeight * 0.8),
    sprite: "birdBlue",
    width: 16,
    height: 6,
    offsetX: 8,
    offsetY: 14,
    scale: 2,
    weight: 100
  },
  [obstacleType.BIRDPINK]: {
    y: () => globalConsts.getRandomInt(globalConsts.gameHeight * 0.4, globalConsts.gameHeight * 0.8),
    sprite: "birdPink",
    width: 16,
    height: 6,
    offsetX: 6,
    offsetY: 6,
    scale: 2,
    weight: 100
  },
  [obstacleType.SNOWMAN]: {
    y: () => globalConsts.gameHeight - 96,
    sprite: "snowman",
    width: 6,
    height: 12,
    offsetX: 4,
    offsetY: 3,
    scale: 4,
    weight: 100
  },
  [obstacleType.ROCKS]: {
    y: () => globalConsts.gameHeight - 90,
    sprite: "stone",
    width: 164,
    height: 100,
    offsetX: 50,
    offsetY: 70,
    scale: 0.5,
    weight: 100
  },
  [obstacleType.MARKER]: {
    y: () => globalConsts.gameHeight,
    sprite: "player",
    width: 0,
    height: 0,
    offsetX: 0,
    offsetY: 0,
    scale: 1,
    weight: 0
  },
}


export class ThatObstacle {
  x: number;
  y: number;
  image: string;
  scene: Scene;
  sprite: Phaser.Physics.Arcade.Sprite

  constructor(type: obstacleType, x: number, currentScene: Scene, marker: boolean) {
    this.x = x;
    this.y = obstaclePropertiesMap[type].y();
    this.image = obstaclePropertiesMap[type].sprite;
    this.scene = currentScene;

    this.sprite = this.scene.physics.add.sprite(this.x, this.y, !marker ? this.image : "");
    this.sprite.setAlpha(!marker ? 1 : 0);

    if (!marker) this.sprite.setBodySize(obstaclePropertiesMap[type].width, obstaclePropertiesMap[type].height);
    this.sprite.setScale(obstaclePropertiesMap[type].scale);
    this.sprite.setOffset(obstaclePropertiesMap[type].offsetX, obstaclePropertiesMap[type].offsetY);
  }
}
