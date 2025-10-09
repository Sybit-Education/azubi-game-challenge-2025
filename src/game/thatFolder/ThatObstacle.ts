import {Scene} from "phaser"
import {globalConsts} from '../main.ts';

// TODO: Add package
export enum obstacleType {
  BIRDBLUE = "BIRDBLUE",
  BIRDPINK = "BIRDPINK",
  SNOWMAN = "SNOWMAN",
  ROCKS = "ROCKS",
  MARKER = "MARKER",
  GIFT = "GIFT"
}

// All obstacle array
export const viableObstacles: obstacleType[] = [obstacleType.BIRDBLUE, obstacleType.BIRDPINK, obstacleType.SNOWMAN, obstacleType.ROCKS];

interface obstacleProperties {
  y: () => number;
  sprites: string[],
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
    sprites: ["birdBlue"],
    width: 16,
    height: 6,
    offsetX: 8,
    offsetY: 14,
    scale: 2,
    weight: 100
  },
  [obstacleType.BIRDPINK]: {
    y: () => globalConsts.getRandomInt(globalConsts.gameHeight * 0.4, globalConsts.gameHeight * 0.8),
    sprites: ["birdPink"],
    width: 16,
    height: 6,
    offsetX: 6,
    offsetY: 6,
    scale: 2,
    weight: 100
  },
  [obstacleType.SNOWMAN]: {
    y: () => globalConsts.gameHeight - 96,
    sprites: ["snowman"],
    width: 6,
    height: 12,
    offsetX: 4,
    offsetY: 3,
    scale: 4,
    weight: 100
  },
  [obstacleType.ROCKS]: {
    y: () => globalConsts.gameHeight - 90,
    sprites: ["stone"],
    width: 164,
    height: 100,
    offsetX: 50,
    offsetY: 70,
    scale: 0.5,
    weight: 100
  },
  [obstacleType.MARKER]: {
    y: () => globalConsts.gameHeight,
    sprites: ["player"],
    width: 0,
    height: 0,
    offsetX: 0,
    offsetY: 0,
    scale: 1,
    weight: 0
  },
  [obstacleType.GIFT]: {
    y: () => globalConsts.getRandomInt(globalConsts.gameHeight * 0.6, globalConsts.gameHeight * 0.8),
    sprites: ["gift1","gift2","gift3","gift4"],
    width: 18,
    height: 18,
    offsetX: 6,
    offsetY: 6,
    scale: 2,
    weight: 0
  }
}

export class ThatObstacle {
  x: number;
  y: number;
  image: string;
  scene: Scene;
  sprite: Phaser.Physics.Arcade.Sprite
  type: obstacleType

  constructor(type: obstacleType, x: number, currentScene: Scene, isMarker: boolean, isGift: boolean) {
    this.x = x;
    this.y = obstaclePropertiesMap[type].y();
    this.image = !isGift ? obstaclePropertiesMap[type].sprites[0] : Phaser.Utils.Array.GetRandom(obstaclePropertiesMap.GIFT.sprites);
    this.scene = currentScene;
    this.type = type;

    this.sprite = this.scene.physics.add.sprite(this.x, this.y, !isMarker ? this.image : "");
    this.sprite.setAlpha(!isMarker ? 1 : 0);

    if(isGift){
      //this.sprite.setImmovable(false);
      this.sprite.setPushable(false);
    }

    if (!isMarker) this.sprite.setBodySize(obstaclePropertiesMap[type].width, obstaclePropertiesMap[type].height);
    this.sprite.setScale(obstaclePropertiesMap[type].scale);
    this.sprite.setOffset(obstaclePropertiesMap[type].offsetX, obstaclePropertiesMap[type].offsetY);
  }
}
