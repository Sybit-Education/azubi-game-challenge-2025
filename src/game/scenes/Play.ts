import {Scene} from 'phaser';
import { globalConsts } from "../main";
import { Player } from '../custom_classes/Player';
import { Segment } from '../custom_classes/Section';

export class Play extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  player: Player;
  segment: Segment;
  obstacles: Phaser.Physics.Arcade.Group;
  ground: Phaser.Physics.Arcade.Sprite;
  colisionPlayerAndGround: Phaser.Physics.Arcade.Collider;
  colisionPlayerAndObstacle: Phaser.Physics.Arcade.Collider;
  gameW: number = globalConsts.gameWidth;
  gameH: number = globalConsts.gameHeight;
  isDucked: boolean = false;

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

    // Segment
    this.segment = new Segment('gameBackground', 1, [], this);
    this.segment = this.segment.generateTestSegment(0);
    this.obstacles = this.physics.add.group(this.segment.obstacles[0].sprite);
    
    // Player
    this.player = new Player(64, this.gameH-64, 'playerIdle', 'playerDucking', "W", "S", "A", "D", this);

    // Collision detection
    this.colisionPlayerAndGround = this.physics.add.collider(this.player.sprite, this.ground);
    this.colisionPlayerAndObstacle = this.physics.add.collider(this.player.sprite, this.obstacles, () => {
    }, gameOver);

    // Controls
  }

  // Update cycle
  update() {
    // player movement
    this.player.movementUpdate();
  }
}
