import {Scene} from 'phaser';
import {globalConsts} from '../main.ts';
import {obstacleType, ThatObstacle, viableObstacles} from './ThatObstacle.ts';

export class ThatSection {

  // config
  readonly speed: number = -200;// speed of setion -> obstacles move at that speed
  readonly amountObstacle: number = 3;// amount of obstacles per section
  readonly breakProbability: number = 25;// Probability for a "break" section (section without obstacles). lower number -> more probable (max: 0 -> 100%)
  readonly giftProbability: number = 0;// Probability for a gift to spawn in a section. lower number -> more probable (max: 0 -> 100%)

  // Types
  // Values by constructor
  scene: Scene;
  // Values
  obstacles: ThatObstacle[] = [];
  marker: ThatObstacle;
  gift: ThatObstacle;
  hasGift: boolean;
  randomVoidOut: number = globalConsts.getRandomInt(-10, -200)

  // Constructor
  constructor(currentScene: Scene, pause: boolean, offset: number = 2) {
    this.scene = currentScene;

    // Marker
    this.marker = new ThatObstacle(obstacleType.MARKER, globalConsts.gameWidth * offset, this.scene, true, false);
    this.marker.sprite.setAlpha(!pause ? (globalConsts.getRandomInt(0, this.breakProbability) == 0 ? 0 : 1) : 1);
    this.marker.sprite.setVisible(false);
    this.obstacles.push(this.marker);

    // Gift
    this.hasGift = globalConsts.getRandomInt(0, this.giftProbability) == 0;
    if (this.hasGift){
      this.gift = new ThatObstacle(obstacleType.GIFT, this.generateRandomX(16) + globalConsts.gameWidth * (offset - 1), this.scene, false, true);
      this.obstacles.push(this.gift);
    }
    // Generate Obstacles
    if (!pause) for (let i = 0; i < this.amountObstacle; i++) this.obstacles.push(this.generateObstacles(false, offset - 1));
  }

  generateObstacles(marker: boolean, offset: number): ThatObstacle {
    return new ThatObstacle(Phaser.Utils.Array.GetRandom(viableObstacles), this.generateRandomX(16) + globalConsts.gameWidth * offset, this.scene, marker, false);
  }

  generateRandomX(margin: number): number {//generates a random x coordinate and checks if the new x value is within a certain margin
    let newX: number = globalConsts.getRandomInt(globalConsts.gameWidth * 0.2, globalConsts.gameWidth)
    let xWithinMargin: boolean = false;
    for (const obstacle of this.obstacles) {
      if (newX >= obstacle.x - margin && newX <= obstacle.x + margin) {
        xWithinMargin = true
      }
    }
    if (xWithinMargin) {// call method again if x is within the margin, creating a new random x (hopefully NOT within the margin again)
      // Similar to stack overflow
      console.log("oops, recursion time :p")
      return this.generateRandomX(margin);
    } else {
      return newX;
    }
  }

  updateMovement(): void {
    // Moves every Obstacle
    for (let obstacle of this.obstacles) {
      if (obstacle.sprite.body == undefined) {
        //console.log(obstacle); // this is like an error. because the body shouldn´t and isn´t null
        continue;
      }
      obstacle.sprite.setVelocityX(this.speed);
    }
  }

  // Destroys all obstacles in the section
  destroyAll(): void {
    for (let obstacle of this.obstacles) {
      obstacle.sprite.body?.destroy();
      obstacle.sprite.destroy(true);

    }
  }
}


