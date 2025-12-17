import {Scene} from 'phaser';
import {getRandomInt, globalConsts} from '../main.ts';
import {getRandomObstacleType, obstaclePropertiesMap, obstacleType, ThatObstacle} from './ThatObstacle.ts';

// Position type
type position = {
  x: number;
  y: number;
};

export class ThatSection {
  // Config
  readonly speed: number = -200;
  readonly amountObstacle: number = 3;
  readonly breakProbability: number = 25;
  readonly giftProbability: number = 3;
  readonly postionOverflowLimit: number = 100;
  readonly obstaclePadding: number = 150;
  readonly maxVoidout: number = -200;
  readonly minVoidout: number = -10;

  // Variables
  scene: Scene;
  obstacles: ThatObstacle[] = [];
  marker: ThatObstacle;
  gift: ThatObstacle | undefined;
  randomVoidOut: number;

  // Constructor
  constructor(currentScene: Scene, pause: boolean, offset: number = 2) {
    this.scene = currentScene;
    this.randomVoidOut = getRandomInt(this.minVoidout, this.maxVoidout);

    // Gift generation
    if (getRandomInt(0, this.giftProbability) == 1) {
      const gift = this.generateObstacle(offset - 1, obstacleType.GIFT);
      this.gift = gift;
      this.obstacles.push(gift);
    }

    // Marker
    this.marker = new ThatObstacle(
      obstacleType.MARKER,
      this.scene,
      globalConsts.gameWidth * offset,
    );
    // This lines controls if the next should be a break
    this.marker.sprite.setAlpha(
      !pause ? (getRandomInt(0, this.breakProbability) == 0 ? 0 : 1) : 1
    );
    this.marker.sprite.setVisible(false);
    this.obstacles.push(this.marker);

    // Generates Obstacles
    if (!pause) {
      for (let i = 0; i < this.amountObstacle; i++) {
        this.obstacles.push(this.generateObstacle(offset - 1));
      }
    } else {
      this.obstacles.push(new ThatObstacle(obstacleType.BREAK, this.scene, 30 + globalConsts.gameWidth * (offset - 1)))
    }

    // Debug
    if (globalConsts.debug) {
      console.log("Section spawned:", {
        obstacleCount: this.obstacles.length - 1, // Because the marker still counts
        pause
      });
    }
  }

  // This generates a new obstacle
  generateObstacle(offset: number, inputType?: obstacleType) {
    const type: obstacleType = inputType ?? getRandomObstacleType(); // gets random type
    const position: position = this.getRandomPosition(type, offset); // Gets random y and x
    return new ThatObstacle(type, this.scene, position.x, position.y);
  }

  // This methode generates a suitable postion for provided obsatcle type. Checks paddings
  getRandomPosition(type: obstacleType, offset: number): position {
    const property = obstaclePropertiesMap[type];
    let currentPos;
    let tries: number = 0;
    while (true) {
      currentPos = {
        x: getRandomInt(globalConsts.gameWidth * 0.1, globalConsts.gameWidth * 0.9) + offset * globalConsts.gameWidth,
        y: property.y()
      };
      let valid: boolean = true;
      for (let obstacle of this.obstacles) {
        if (!this.checkCoords(currentPos, {x: obstacle.x, y: obstacle.y})) valid = false; // to close
      }
      if (globalConsts.debug) console.log("valid: " + valid);
      if (valid) break;
      tries++;
      if (tries >= this.postionOverflowLimit) {
        console.warn("StackOverlow");
        break;
      }
    }
    return currentPos;
  }

  // This checks coords
  checkCoords(pos1: position, pos2: position): boolean {
    const distanceSquared: number = Phaser.Math.Distance.BetweenPointsSquared(pos1, pos2) / 1000;
    if (globalConsts.debug) console.log("|" + distanceSquared);
    return distanceSquared >= this.obstaclePadding;
  }

  // Moves all obstacles
  updateMovement(): void {
    for (let obstacle of this.obstacles) {
      if (obstacle.sprite.body == undefined) {
        //console.log(obstacle); // this is like an error. because the body shouldn´t and isn´t null
        continue;
      }
      obstacle.sprite.setVelocityX(this.speed * globalConsts.spriteSpeed);

    }
  }

  // Destroys all obstacles
  destroyAll(): void {
    this.marker.sprite.destroy(false)
    for (let obstacle of this.obstacles) {
      obstacle.sprite.body?.destroy();
      obstacle.sprite.destroy(true);
    }

    // Clears array
    this.obstacles = [];
  }
}
