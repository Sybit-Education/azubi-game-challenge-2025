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
  ground: Phaser.Types.Physics.Arcade.ArcadeColliderType
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
  gifts: number = 0;
  jumpTimeleft: number = 0;
  jumpLefts: number = 0;
  wasJumpKeyDownLastFrame: boolean = false;
  gamepad: Phaser.Input.Gamepad.Gamepad | null = null;

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
    
    // Setup gamepad detection
    this.setupGamepad();
  }
  
  // Setup gamepad detection
  setupGamepad(): void {
    // Check if gamepad is already connected
    if (this.scene.input.gamepad && this.scene.input.gamepad.gamepads.length > 0) {
      this.gamepad = this.scene.input.gamepad.getPad(0);
    }
    
    // Listen for gamepad connection
    this.scene.input.gamepad?.on('connected', (pad: Phaser.Input.Gamepad.Gamepad) => {
      console.log('Gamepad connected:', pad.id);
      this.gamepad = pad;
    });
    
    // Listen for gamepad disconnection
    this.scene.input.gamepad?.on('disconnected', (pad: Phaser.Input.Gamepad.Gamepad) => {
      console.log('Gamepad disconnected:', pad.id);
      if (this.gamepad === pad) {
        this.gamepad = null;
      }
    });
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

  // Gift
  getGifts(): number {
    return this.gifts;
  }

  setGifts(gifts: number): void {
    this.gifts = gifts;
  }

  increaseGifts(plusGifts: number): void {
    this.setGifts(this.getGifts() + plusGifts);
  }

  getJumpsLeft(): number {
    return this.jumpLefts;
  }

  setJumpLefts(jumps: number): void {
    this.jumpLefts = jumps;
  }

  increaseJump(): void {
    this.setJumpLefts(this.getJumpsLeft() + 1);
  }

  // Updates movement
  updateMovement(): void {
    if (this.keyUp == undefined || this.keyDown == undefined || this.keyLeft == undefined || this.keyRight == undefined) return;
    const isOnGround: boolean | undefined = this.sprite.body?.touching.down;
    
    // Check input from keyboard or gamepad
    const isLeftDown = this.keyLeft.isDown || (this.gamepad && (this.gamepad.left || this.gamepad.leftStick.x < -0.5));
    const isRightDown = this.keyRight.isDown || (this.gamepad && (this.gamepad.right || this.gamepad.leftStick.x > 0.5));
    const isUpDown = this.keyUp.isDown || (this.gamepad && (this.gamepad.up || this.gamepad.A));
    const isDownDown = this.keyDown.isDown || (this.gamepad && (this.gamepad.down || this.gamepad.B));

    // Apply direction
    if (isRightDown) {
      this.sprite.setVelocityX(160);
    } else if (isLeftDown) {
      this.sprite.setVelocityX(-160);
    } else {
      this.sprite.setVelocityX(0);
    }

    // Sneaking
    if (isDownDown) {
      this.sprite.setTexture(this.sneakingID);
      this.isSneaking = true;
    } else {
      this.sprite.setTexture(this.spriteID);
      this.isSneaking = false;
    }

    this.sprite.body?.setSize();
    this.sprite.setGravityY(!isOnGround && isDownDown ? this.sneakGravity : this.normalGravity);

    // Returns if sneaking
    if (this.isSneaking) return;

    // Start jump from the ground
    if (isOnGround && isUpDown) {
      this.jumpTimeleft = this.maxJumpTime;
      this.sprite.setVelocityY(this.startVelocity);
      this.wasJumpKeyDownLastFrame = true;
      return;
    }

    // Detect double jump
    const justPressedJump = isUpDown && !this.wasJumpKeyDownLastFrame;
    if (!isOnGround && justPressedJump && this.jumpLefts > 0 && this.jumpTimeleft <= 0) {
      this.sprite.setVelocityY(-500); // Boost
      this.jumpLefts--;
    }

    // Jump-hold mechanic
    if (this.jumpTimeleft > 0 && isUpDown) {
      const velocity: number = (this.jumpTimeleft) / 1000 + 1;
      this.jumpTimeleft -= this.scene.game.loop.delta;
      const current: number = this.sprite.body?.velocity.y ?? 0;
      this.sprite.setVelocityY(current * velocity);
    } else if (!isUpDown) {
      this.jumpTimeleft = 0;
    }

    // Update previous key state
    this.wasJumpKeyDownLastFrame = !!isUpDown;
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

