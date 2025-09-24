import {Scene} from 'phaser';
import {globalConsts} from "../main";

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
  santaX: number = globalConsts.gameWidth;
  santaY: number = globalConsts.gameHeight;
  isDucked: boolean = false;
  keyUp: Phaser.Input.Keyboard.Key | null | undefined;
  keyDown: Phaser.Input.Keyboard.Key | null | undefined;
  keyLeft: Phaser.Input.Keyboard.Key | null | undefined;
  keyRight: Phaser.Input.Keyboard.Key | null | undefined;

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

    this.ground = this.physics.add.sprite(this.gameW / 2, this.gameH - 32, "ground");
    this.ground.setImmovable(true);

    this.obstacle = this.physics.add.sprite(this.gameW / 2, this.gameH - 80, "obstacle");
    this.obstacle.setImmovable(true);

    this.player = this.physics.add.sprite(64, 64, "playerIdle");
    this.player.body?.setSize(32, 64, false);
    this.player.setOrigin(0.5, 1);
    this.player.setCollideWorldBounds(true);
    this.player.setGravityY(500);
    this.player.setDepth(1);

    this.colisionPlayerAndGround = this.physics.add.collider(this.player, this.ground);
    this.colisionPlayerAndObstacle = this.physics.add.collider(this.player, this.obstacle, () => {
    }, gameOver);

    this.keyUp = this.input.keyboard?.addKey("W");
    this.keyDown = this.input.keyboard?.addKey("S");
    this.keyLeft = this.input.keyboard?.addKey("A");
    this.keyRight = this.input.keyboard?.addKey("D");

    //  Timer für jede Ebene
    this.time.addEvent({delay: 4000, callback: () => this.spawnHouse("back"), callbackScope: this, loop: true});
    this.time.addEvent({delay: 3000, callback: () => this.spawnHouse("mid"), callbackScope: this, loop: true});
    this.time.addEvent({delay: 2000, callback: () => this.spawnHouse("front"), callbackScope: this, loop: true});
  }

  update() {
    if (!this.keyUp || !this.keyDown || !this.keyLeft || !this.keyRight) return;

    if (this.keyDown.isDown && this.player.body?.touching.down) {
      this.player.body?.setSize(32, 32, false);
      this.player.setTexture("playerDucking");
      this.player.setVelocityX(0);
      this.isDucked = true;
    } else if (this.keyDown.isUp && this.isDucked) {
      this.player.body?.setSize(32, 64, false);
      this.player.setTexture("playerIdle");
      this.isDucked = false;
    } else if (this.keyRight.isDown) {
      this.player.setVelocityX(160);
    } else if (this.keyLeft.isDown) {
      this.player.setVelocityX(-160);
    } else {
      this.player.setVelocityX(0);
    }
    if (this.keyUp.isDown && this.player.body?.touching.down && !this.isDucked) {
      this.player.setVelocityY(-330);
    }

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
