import {Scene} from "phaser"
import {globalConsts} from '../main.ts';

export enum obstacleType {
  GROUND = "GROUND",
  AIR = "AIR",
  MARKER = "MARKER"
}

export const viableObstacles: obstacleType[] = [obstacleType.AIR, obstacleType.GROUND];

interface obstacleProperties {
  y: () => number;
  spriteVariants: string[],
  weight: number
}

const obstaclePropertiesMap: Record<obstacleType, obstacleProperties> = {//TODO: change weight config
  [obstacleType.GROUND]: {
    y: () => globalConsts.getRandomInt(globalConsts.gameHeight - 80, globalConsts.gameHeight - 80),
    spriteVariants: ["stone", "snowman"],
    weight: 100
  },
  [obstacleType.AIR]: {
    y: () => globalConsts.getRandomInt(32, globalConsts.gameHeight * 0.5),
    spriteVariants: ["birdBlue", "birdPink"],
    weight: 100
  },
  [obstacleType.MARKER]: {
    y: () => globalConsts.gameHeight,
    spriteVariants: ["player"],
    weight: 0
  }
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
    this.image = Phaser.Utils.Array.GetRandom(obstaclePropertiesMap[type].spriteVariants);
    this.scene = currentScene;

    this.sprite = this.scene.physics.add.sprite(this.x, this.y, !marker ? this.image : "");
    this.sprite.setAlpha(!marker ? 1 : 0);

    switch (this.image) {
      case("rocks"): {
        this.sprite.setScale(0.6);
        this.sprite.setCircle(64);
        break;
      }
      case("snowman"): {
        this.sprite.setScale(4);
        this.sprite.setBodySize(16, 32);
        break;
      }
      case("birdBlue"): {
        this.sprite.setScale(2);
        this.sprite.setBodySize(40, 28);
        break;
      }
      case("birdPink"): {
        this.sprite.setScale(2);
        this.sprite.setBodySize(46, 32);
        break;
      }
    }
  }
}
