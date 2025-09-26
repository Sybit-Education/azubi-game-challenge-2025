import {Scene} from 'phaser';

export class Player {
  score: number;
  x: number;
  y: number;
  idleSprite: string;
  duckingSprite: string;
  keyUp: Phaser.Input.Keyboard.Key | null | undefined;
  keyDown: Phaser.Input.Keyboard.Key | null | undefined;
  keyLeft: Phaser.Input.Keyboard.Key | null | undefined; //TODO: Delete later
  keyRight: Phaser.Input.Keyboard.Key | null | undefined; //TODO: Delete later
  curScene: Scene
  sprite: Phaser.Physics.Arcade.Sprite;
  isDucked: boolean;

  // Constructor
  constructor(
    x: number,
    y: number,
    idleSprite: string,
    duckingSprite: string,
    keyUp: string,
    keyDown: string,
    keyLeft: string,
    keyRight: string,
    curScene: Scene) {
    this.x = x;
    this.y = y;
    this.idleSprite = idleSprite;
    this.duckingSprite = duckingSprite;
    this.keyUp = curScene.input.keyboard?.addKey(keyUp);
    this.keyDown = curScene.input.keyboard?.addKey(keyDown);
    this.keyLeft = curScene.input.keyboard?.addKey(keyLeft);
    this.keyRight = curScene.input.keyboard?.addKey(keyRight);

    this.isDucked = false;

    this.sprite = curScene.physics.add.sprite(this.x, this.y, this.idleSprite);

    this.sprite.setBodySize(32, 64, false); //NOTE: setBodySize und nicht setSize!!! Origin is not in center.
    this.sprite.setOrigin(0.5, 1);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setGravityY(500);
  }

  // Updates movement
  movementUpdate() {
    if (!this.keyUp || !this.keyDown || !this.keyLeft || !this.keyRight) return;
    if (this.keyDown.isDown && this.sprite.body?.touching.down) {//ducking
      this.sprite.setBodySize(32, 32, false);
      this.sprite.setTexture(this.duckingSprite);
      this.sprite.setVelocityX(0);
      this.isDucked = true;
    } else if (this.keyDown.isUp && this.isDucked) {
      this.sprite.setBodySize(32, 64, false);
      this.sprite.setTexture(this.idleSprite);
      this.isDucked = false;
    } else if (this.keyRight.isDown) {//TODO: Delete later
      this.sprite.setVelocityX(160);
    } else if (this.keyLeft.isDown) {//TODO: Delete later
      this.sprite.setVelocityX(-160);
    } else {
      this.sprite.setVelocityX(0);
    }
    if (this.keyUp.isDown && this.sprite.body?.touching.down && !this.isDucked) {
      this.sprite.setVelocityY(-500);
    }
  }
}
