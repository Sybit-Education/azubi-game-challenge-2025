import {Scene} from 'phaser';
import {globalConsts} from '../main.ts';
import Sprite = Phaser.Physics.Arcade.Sprite;
import Text = Phaser.GameObjects.Text;

export class ThatPlayer {
  // Config
  spriteID: string = "player2"
  idleID: string = "playerSneaking2";
  keyIdUp: string = "W";
  keyIdDown: string = "S";
  keyIdLeft: string = "A";
  keyIdRight: string = "D";

  // Types
  // Values
  isSneaking: boolean = false;
  score: number = 0;
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
    this.sprite.setOrigin(0.5, 1);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setGravityY(500);

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

    if (this.keyDown.isDown && this.sprite.body?.touching.down) {
      //this.sprite.setBodySize(32, 32, false);
      this.sprite.setTexture(this.idleID);
      this.sprite.setVelocityX(0);
      this.isSneaking = true;
    } else if (this.keyDown.isUp && this.isSneaking) {
      this.sprite.setBodySize(32, 64, false); // TODO | smaller hitbox
      this.sprite.setTexture(this.idleID);
      this.isSneaking = false;
    } else if (this.keyRight.isDown) { // Moving right
      this.sprite.setVelocityX(160);
    } else if (this.keyLeft.isDown) { // moving left
      this.sprite.setVelocityX(-160);
    } else { // No force
      this.sprite.setVelocityX(0);
    }

    //sneaking
    if (this.keyUp.isDown && this.sprite.body?.touching.down && !this.isSneaking) {
      this.sprite.setVelocityY(-500);
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
