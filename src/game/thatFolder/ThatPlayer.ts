import {Scene} from 'phaser';
import {globalConsts} from '../main.ts';
import Sprite = Phaser.Physics.Arcade.Sprite;
import Text = Phaser.GameObjects.Text;

export class ThatPlayer {
  // Config
  // Gravity
  normalGravity: number = 500;
  sneakGravity: number = 3000;

  // Textures
  spriteID: string = "player2"
  sneakingID: string = "playerSneaking2";
  // Keys
  keyIdUp: string = "W";
  keyIdDown: string = "S";
  keyIdLeft: string = "A";
  keyIdRight: string = "D";
  // Jumping
  maxJumpTime: number = 180; // 185
  startVelocity: number = -250; //-400

  // Types
  // Values
  isSneaking: boolean = false;
  score: number = 0;
  jumpTimeleft: number = 0;
  // Values by constructor
  scene: Scene;
  sprite: Sprite;
  scoreText: Text;
  keyUp: Phaser.Input.Keyboard.Key | null | undefined;
  keyDown: Phaser.Input.Keyboard.Key | null | undefined;
  keyLeft: Phaser.Input.Keyboard.Key | null | undefined;
  keyRight: Phaser.Input.Keyboard.Key | null | undefined;

  // Constructor
  constructor(currentScene: Scene, startX: number = 100, startY: number = globalConsts.gameHeight - 100) {
    this.scene = currentScene;

    // Create sprite
    this.sprite = currentScene.physics.add.sprite(startX, startY, this.spriteID);
    //this.sprite.setBodySize(32, 64, false); // NOTE: setBodySize und nicht setSize!!! Origin is not in center.
    this.sprite.setOrigin(0, 1); // Bottom left
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setGravityY(this.normalGravity);
    this.sprite.setScale(2.25);

    // Create Score text
    this.scoreText = this.scene.add.text(globalConsts.gameWidth * 0.42, 100, this.getScore().toString(), {
      font: "30px " + globalConsts.pixelFont,
      color: "#ffffff",
      align: 'center'
    }).setOrigin(0, 0);

    // Keybinds
    this.keyUp = currentScene.input.keyboard?.addKey(this.keyIdUp);
    this.keyDown = currentScene.input.keyboard?.addKey(this.keyIdDown);
    this.keyLeft = currentScene.input.keyboard?.addKey(this.keyIdLeft);
    this.keyRight = currentScene.input.keyboard?.addKey(this.keyIdRight);
  }

  // Score
  getScore(): number {
    return this.score;
  }

  setScore(newScore: number): void {
    // Sets scores
    this.score = newScore;

    // Updates text
    this.scoreText.setText(formatTime(newScore));
  }

  increaseScore(plusScore: number): void {
    this.setScore(this.getScore() + plusScore);
  }

  // Updates movement
  updateMovement(): void {
    if (!this.keyUp || !this.keyDown || !this.keyLeft || !this.keyRight) return;
    const isOnGround: boolean | undefined = this.sprite.body?.touching.down;

    // Apply direction
    if (this.keyRight.isDown) { // Right
      this.sprite.setVelocityX(160);
    } else if (this.keyLeft.isDown) { // Left
      this.sprite.setVelocityX(-160);
    } else { // Reset force
      this.sprite.setVelocityX(0);
    }

    // Sneaking
    if (this.keyDown.isDown) { // is pressing down button && is touching ground
      this.sprite.setTexture(this.sneakingID);
      this.isSneaking = true;
    } else {
      this.sprite.setTexture(this.spriteID);
      this.isSneaking = false;
    }

    // Sets the body to sprite size
    this.sprite.body?.setSize();


    // Fast fall when sneaking
    this.sprite.setGravityY(!isOnGround && this.keyDown?.isDown ? this.sneakGravity : this.normalGravity); // Heavier gravity while sneaking in air

    // Sneaking -> end
    if (this.isSneaking) return;

    // start jumping
    if (isOnGround && this.keyUp.isDown) {
      this.jumpTimeleft = this.maxJumpTime;
      this.sprite.setVelocityY(this.startVelocity);
      return; // Check on next frame again
    }

    // Sneaking in air
    if (!isOnGround && this.keyDown.isDown) {
      this.sprite.setGravityY(500);
      return;
    }

    // No lime left. No extra jump-height/checks
    if (this.jumpTimeleft <= 0) return;

    // Extra velocity while button is pressed down
    if (this.keyUp.isDown) {
      const velocity: number = (this.jumpTimeleft) / 1000 + 1;
      this.jumpTimeleft -= this.scene.game.loop.delta;
      const current: number = this.sprite.body?.velocity.y ?? 0;
      this.sprite.setVelocityY(current * velocity);
    } else {
      this.jumpTimeleft = 0;
    }
  }
}

export function formatTime(milliseconds: number): string {
  milliseconds *= 100;
  const minutes: number = Math.floor(milliseconds / 60000);
  const seconds: number = Math.floor((milliseconds % 60000) / 1000);
  const ms: number = milliseconds % 1000;

  let result: string = "";
  if (minutes > 0) result += `${minutes}m `;
  if (seconds > 0 || minutes > 0) result += `${seconds}s `;
  if (ms != 0) result += `${ms}ms`;
  else result += "000ms"
  return result.trim();
}
