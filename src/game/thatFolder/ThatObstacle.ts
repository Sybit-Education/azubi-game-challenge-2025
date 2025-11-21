import {Scene} from "phaser";
import {getRandomInt, globalConsts} from '../main.ts';

// Every obstacle
export enum obstacleType {
  BIRDBLUE = "BIRDBLUE",
  BIRDPINK = "BIRDPINK",
  SNOWMAN = "SNOWMAN",
  ROCKS = "ROCKS",
  MARKER = "MARKER",
  GIFT = "GIFT",
  BREAK = "BREAK",
}

// Every obstacle that can be randomly generated
export const viableObstacles: obstacleType[] = [
  obstacleType.BIRDBLUE,
  obstacleType.BIRDPINK,
  obstacleType.SNOWMAN,
  obstacleType.ROCKS
];

// All Properties per obstacle type
interface obstacleProperties {
  y: () => number;
  sprites: string[];
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
  scale: number;
  weight: number;
}

// Settings for every obstacle
export const obstaclePropertiesMap: Record<obstacleType, obstacleProperties> = {
  [obstacleType.BIRDBLUE]: {
    y: () => getRandomInt(globalConsts.gameHeight * 0.4, globalConsts.gameHeight * 0.8),
    sprites: ["birdBlue"],
    width: 16,
    height: 6,
    offsetX: 8,
    offsetY: 14,
    scale: 2,
    weight: 100
  },
  [obstacleType.BIRDPINK]: {
    y: () => getRandomInt(globalConsts.gameHeight * 0.4, globalConsts.gameHeight * 0.8),
    sprites: ["birdPink"],
    width: 16,
    height: 6,
    offsetX: 6,
    offsetY: 6,
    scale: 2,
    weight: 100
  },
  [obstacleType.SNOWMAN]: {
    y: () => getRandomInt(globalConsts.gameHeight * 0.866, globalConsts.gameHeight * 0.89),
    sprites: ["snowman"],
    width: 6,
    height: 12,
    offsetX: 4,
    offsetY: 3,
    scale: 4,
    weight: 100
  },
  [obstacleType.ROCKS]: {
    y: () => getRandomInt(globalConsts.gameHeight * 0.87, globalConsts.gameHeight * 0.89),
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
    sprites: [""],
    width: 0,
    height: 0,
    offsetX: 0,
    offsetY: 0,
    scale: 1,
    weight: 0
  },
  [obstacleType.GIFT]: {
    y: () => getRandomInt(globalConsts.gameHeight * 0.6, globalConsts.gameHeight * 0.8),
    sprites: ["gift1", "gift2", "gift3", "gift4"],
    width: 18,
    height: 18,
    offsetX: 6,
    offsetY: 6,
    scale: 2,
    weight: 0
  },
  [obstacleType.BREAK]: {
    y: () => globalConsts.gameHeight - 90,
    sprites: ["sign"],
    width: 164,
    height: 100,
    offsetX: 90,
    offsetY: 70,
    scale: 6,
    weight: 100
  }
};

// Gets random type
export function getRandomObstacleType(): obstacleType {
  const totalWeight = viableObstacles.reduce((sum, type) => sum + obstaclePropertiesMap[type].weight, 0);
  let random = Math.random() * totalWeight;
  for (const type of viableObstacles) {
    random -= obstaclePropertiesMap[type].weight;
    if (random <= 0) return type;
  }
  return viableObstacles[viableObstacles.length - 1]; // Fallback
}

// Class
export class ThatObstacle {
  x: number;
  y: number;
  image: string;
  scene: Scene;
  sprite: Phaser.Physics.Arcade.Sprite;
  type: obstacleType;

  constructor(type: obstacleType, currentScene: Scene, x: number, y?: number) {
    this.x = x;
    this.scene = currentScene;
    this.type = type;

    const props = obstaclePropertiesMap[type];
    this.y = y ?? props.y();

    // Get random image ID
    this.image = Phaser.Utils.Array.GetRandom(props.sprites);

    // Creates sprite
    this.sprite = this.scene.physics.add.sprite(this.x, this.y, this.image);
    this.sprite.setAlpha(type == obstacleType.MARKER ? 0 : 1);

    if (type != obstacleType.MARKER) {
      this.sprite.setBodySize(props.width, props.height);
      this.sprite.setScale(props.scale);
      this.sprite.setOffset(props.offsetX, props.offsetY);
    }
  }
}
