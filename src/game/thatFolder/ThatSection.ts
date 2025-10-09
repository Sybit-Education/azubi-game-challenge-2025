import {Scene} from 'phaser';
import {globalConsts} from '../main.ts';
import {obstacleType, ThatObstacle, viableObstacles} from './ThatObstacle.ts';
import {ThatPlayer} from './ThatPlayer.ts';

export class ThatSection {

  // config
  readonly speed: number = -200;
  readonly amountObstacle: number = 3;
  readonly probability: number = 25;
  readonly obstaclePropertiesMap = {}
  GIFT1: `gift1`;
  PLAYER: 'player2'

  // Types
  // Values by constructor
  scene: Scene;
  // Values
  obstacles: ThatObstacle[] = [];
  marker: ThatObstacle;
  randomVoidOut: number = globalConsts.getRandomInt(-10, -200)

  // Constructor
  constructor(currentScene: Scene, pause: boolean, offset: number = 2) {
    this.scene = currentScene;

    // Marker
    this.marker = new ThatObstacle(obstacleType.MARKER, globalConsts.gameWidth * offset, this.scene, true);
    this.marker.sprite.setAlpha(!pause ? (globalConsts.getRandomInt(0, this.probability) == 0 ? 0 : 1) : 1);
    this.marker.sprite.setVisible(false);
    this.obstacles.push(this.marker);

    // Generate Obstacles
    if (!pause) for (let i = 0; i < this.amountObstacle; i++) this.obstacles.push(this.generateObstacles(false, offset - 1));
  }

  generateObstacles(marker: boolean, offset: number): ThatObstacle {
    return new ThatObstacle(Phaser.Utils.Array.GetRandom(viableObstacles), this.generateRandomX(16) + globalConsts.gameWidth * offset, this.scene, marker);
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
      obstacle.sprite.setVelocityX(this.speed)
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

/* this.image = this.physics.add.group({
  key: 'gift1',
  repeat: -1,
  setXY: { x: 350, y: 90 },
});
this.physics.add.collider(this.image, 'ground');
this.physics.add.overlap(this.player, this.gift1, this.collectGifts, null, this);
this.gift.create(this.gameW, this.gameH, 'apple');
*/


