import { Scene } from "phaser";
import { Player } from "../custom_classes/Player";
import { Section } from "../custom_classes/Section";
import { globalConsts } from "../main";

export class TestScene extends Scene {
  background: Phaser.GameObjects.Image;
  player: Player;
  section: Section;
  obstacles: Phaser.Physics.Arcade.Group;
  groundObjects: Phaser.Physics.Arcade.Group;
  collisionPlayerAndGround: Phaser.Physics.Arcade.Collider;
  collisionPlayerAndObstacle: Phaser.Physics.Arcade.Collider;
  gameW: number = globalConsts.gameWidth;
  gameH: number = globalConsts.gameHeight;

  // Constructor
  constructor() {
    super("testScene");
  }

  create() {
    // Game over function
    const gameOver = () => {
      this.scene.start("gameOver");
    };

    // Fallback background color
    this.cameras.main.setBackgroundColor(0x00ff00);

    // Sections
    this.section = new Section(this);

    // Player
    this.player = new Player(64, this.gameH - 64, 'playerIdle', 'playerDucking', "W", "S", "A", "D", this);

    // Collision detection
    this.groundObjects = this.physics.add.group(this.section.groundSprites);
    this.collisionPlayerAndGround = this.physics.add.collider(this.player.sprite, this.groundObjects);
    this.collisionPlayerAndObstacle = this.physics.add.collider(this.player.sprite, this.obstacles, () => {
    }, gameOver);

  }

  update(): void {
    this.player.movementUpdate(); // Updates movement
    this.section.updateSegments(); // Moves segments
  }
}