import {Scene} from "phaser";
import {Player} from "../custom_classes/Player";
import {Section} from "../custom_classes/Section";
import {globalConsts} from "../main";

export class TestScene extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  player: Player;
  section: Section;
  obstacles: Phaser.Physics.Arcade.Group;
  groundObjects: Phaser.Physics.Arcade.Group;
  colisionPlayerAndGround: Phaser.Physics.Arcade.Collider;
  colisionPlayerAndObstacle: Phaser.Physics.Arcade.Collider;
  gameW: number = globalConsts.gameWidth;
  gameH: number = globalConsts.gameHeight;

  constructor() {
    super("testScene");
  }

  create() {

    const gameOver = () => {
      this.scene.start("gameOver");
    };

    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x00ff00);

    this.background = this.add.image(this.gameW / 2, this.gameH / 2, 'gameBackground');

    // Sections
    this.section = new Section(this);

    // Player
    this.player = new Player(64, this.gameH - 64, 'playerIdle', 'playerDucking', "W", "S", "A", "D", this);

    // Collision detection
    this.groundObjects = this.physics.add.group()
    this.colisionPlayerAndGround = this.physics.add.collider(this.player.sprite, this.groundObjects);
    this.colisionPlayerAndObstacle = this.physics.add.collider(this.player.sprite, this.obstacles, () => {
    }, gameOver);

  }
}
