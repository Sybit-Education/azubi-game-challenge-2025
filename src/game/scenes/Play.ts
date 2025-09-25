import {Scene} from 'phaser';
import {Player} from '../custom_classes/Player';
import {Section} from '../custom_classes/Section';
import {globalConsts} from "../main";

export class Play extends Scene {
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
  santaX: number = globalConsts.gameWidth;
  santaY: number = globalConsts.gameHeight;

  // hausi ebenen
  backHouses: Phaser.GameObjects.Image[] = [];
  midHouses: Phaser.GameObjects.Image[] = [];
  frontHouses: Phaser.GameObjects.Image[] = [];

  houseKeys: string[] = ["house1", "house2", "house3"];

  constructor() {
    super('play');
  }

  create(): void {
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

    //  Timer für jede Ebene
    this.time.addEvent({delay: 4000, callback: () => this.spawnHouse("back"), callbackScope: this, loop: true});
    this.time.addEvent({delay: 3000, callback: () => this.spawnHouse("mid"), callbackScope: this, loop: true});
    this.time.addEvent({delay: 2000, callback: () => this.spawnHouse("front"), callbackScope: this, loop: true});
  }

  update() {
    // player movement
    this.player.movementUpdate();

    // Hausi bewegen
    this.moveHouses(this.backHouses, 0.5);
    this.moveHouses(this.midHouses, 1.2);
    this.moveHouses(this.frontHouses, 6);
  }

  private spawnHouse(layer: "back" | "mid" | "front") {
    const key = Phaser.Utils.Array.GetRandom(this.houseKeys);

    let y = this.gameH - 32;
    let scale = 1;
    let depth = 0;

    if (layer === "back") {
      scale = 0.4 + Math.random() * 0.2;
      y = this.gameH - 80;
      depth = -2;
    } else if (layer === "mid") {
      scale = 0.6 + Math.random() * 0.3;
      y = this.gameH - 60;
      depth = -1;
    } else if (layer === "front") {
      scale = 6 + Math.random() * 0.4;
      y = this.gameH - 64;
      depth = 0;
    }

    const house = this.add.image(this.gameW + 100, y, key);
    house.setOrigin(0.5, 1);
    house.setScale(scale);
    house.setDepth(depth);

    if (layer === "back") this.backHouses.push(house);
    if (layer === "mid") this.midHouses.push(house);
    if (layer === "front") this.frontHouses.push(house);
  }

  private moveHouses(houses: Phaser.GameObjects.Image[], speed: number) {
    houses.forEach(house => {
      house.x -= speed;
    });

    for (let i = houses.length - 3; i >= 0; i--) {
      if (houses[i].x < -houses[i].width) {
        houses[i].destroy();
        houses.splice(i, 1);
      }
    }
  }
}
