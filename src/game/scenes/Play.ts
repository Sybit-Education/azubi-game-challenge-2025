import {Scene} from 'phaser';
import { globalConsts } from "../main";

export class Play extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  player: Phaser.Physics.Arcade.Sprite;
  ground: Phaser.Physics.Arcade.Sprite;
  obstacle: Phaser.Physics.Arcade.Sprite;
  colisionPlayerAndGround: Phaser.Physics.Arcade.Collider;
  colisionPlayerAndObstacle: Phaser.Physics.Arcade.Collider;
  gameW: number = globalConsts.gameWidth;
  gameH: number = globalConsts.gameHeight;
  isDucked: boolean = false;
  keyUp: Phaser.Input.Keyboard.Key | null | undefined;
  keyDown: Phaser.Input.Keyboard.Key | null | undefined;
  keyLeft: Phaser.Input.Keyboard.Key | null | undefined; //Todo: Delete later
  keyRight: Phaser.Input.Keyboard.Key | null | undefined; //Todo: Delete later

  // Constructor
  constructor() {
    super('play');
  }

  // Create methode
  create() {//Todo: Add player movement
    // Game over "function"
    const gameOver = () => {
      this.scene.start("gameOver");
    }

    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x00ff00);
    // was ist hier der Unterschied? ^^^ & vvv
    this.background = this.add.image(this.gameW / 2, this.gameH / 2, 'gameBackground');

    // Ground
    this.ground = this.physics.add.sprite(this.gameW / 2, this.gameH - 32, "ground");
    this.ground.setImmovable(true);

    // Test obstacle
    this.obstacle = this.physics.add.sprite(this.gameW / 2, this.gameH - 80, "obstacle");
    this.obstacle.setImmovable(true);

    // Player
    this.player = this.physics.add.sprite(64, 64, "playerIdle");
    this.player.body?.setSize(32, 64, false);
    this.player.setOrigin(0.5, 1);
    this.player.setCollideWorldBounds(true);
    this.player.setGravityY(500);

    // Collision detection
    this.colisionPlayerAndGround = this.physics.add.collider(this.player, this.ground);
    this.colisionPlayerAndObstacle = this.physics.add.collider(this.player, this.obstacle, () => {
    }, gameOver);

    // Controls
    this.keyUp = this.input.keyboard?.addKey("W");
    this.keyDown = this.input.keyboard?.addKey("S");
    this.keyLeft = this.input.keyboard?.addKey("A"); //Todo: delete later
    this.keyRight = this.input.keyboard?.addKey("D"); //Todo: delete later
  }

  // Update cycle
  update() {
    // NOTE | es ist seltsam, das man beim sneaken springen kann aber im Springen nicht sneaken. Ist ja auch nur ein Proto type

    // Movement
    if (!this.keyUp || !this.keyDown || !this.keyLeft || !this.keyRight) return;
    if (this.keyDown.isDown && this.player.body?.touching.down) {  // Sneaking
      this.player.body?.setSize(32, 32, false);
      this.player.setTexture("playerDucking");
      this.player.setVelocityX(0);
      this.isDucked = true;
    } else if (this.keyDown.isUp && this.isDucked) {
      this.player.body?.setSize(32, 64, false);
      this.player.setTexture("playerIdle");
      this.isDucked = false;
    } else if (this.keyRight.isDown) { // Right
      this.player.setVelocityX(160);
    } else if (this.keyLeft.isDown) { // Left
      this.player.setVelocityX(-160);
    } else {
      this.player.setVelocityX(0);
    }
    if (this.keyUp.isDown && this.player.body?.touching.down) {
      this.player.setVelocityY(-330);
    }
  }
}
