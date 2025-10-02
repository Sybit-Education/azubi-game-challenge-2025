import {Scene} from 'phaser';
import {Player} from '../custom_classes/Player';
import {Section} from '../custom_classes/Section';
import {globalConsts} from "../main";
import Image = Phaser.GameObjects.Image;

export class Play extends Scene {
  background: Phaser.GameObjects.TileSprite;
  player: Player;
  section: Section;
  obstacles: Phaser.Physics.Arcade.Group;
  ground: Phaser.Physics.Arcade.Sprite;
  collisionPlayerAndGround: Phaser.Physics.Arcade.Collider;
  collisionPlayerAndObstacle: Phaser.Physics.Arcade.Collider;
  groundObjects: Phaser.Physics.Arcade.Group;
  colisionPlayerAndGround: Phaser.Physics.Arcade.Collider;
  colisionPlayerAndObstacle: Phaser.Physics.Arcade.Collider;
  gameW: number = globalConsts.gameWidth;
  gameH: number = globalConsts.gameHeight;
  santaX: number = globalConsts.santaX;
  santaY: number = globalConsts.santaY;
  name: string;
  score: number;


  // Config
  houseKeys: string[] = ["house1", "house2", "house3", "house4", "church"];

  // Constructor
  constructor() {
    super('play');
  }

  create(): void {

    //Text Input
    const usernameInput = document.getElementById('Kuerzel') as HTMLInputElement;
    const result = document.getElementById('result') as HTMLParagraphElement;
    document.getElementById('submitBtn')?.addEventListener('click', () => {
      const username = usernameInput.value;
      if (username) {
        result.textContent = `Entered Kürzel: ${username}`;
      } else {
        result.textContent = 'Input field cannot be empty';
      }
      localStorage.setItem('Kuerzel', usernameInput.value);
    })


    // Game over function
    const gameOver = () => {
      this.scene.start("gameOver", {score: name,});
    };

    this.background = this.add.tileSprite(
      0,
      0,
      this.gameW,
      this.gameH,
      'gameBackground2' // Stelle sicher, dass dieses Bild geladen wurde!
    ).setOrigin(0, 0);
    this.background.setScale(4.5);
    this.background.setAlpha(1);
    this.background.setDepth(-4);

    // Ground
    this.ground = this.physics.add.sprite(this.gameW / 2, this.gameH - 32, "ground");
    this.ground.setImmovable(true);

  }



  // Updates every frame
  update(): void {
    // player movement
    this.player.movementUpdate();

    //scrolling background
    this.background.tilePositionX += 0.1;

    // Move housis
    this.moveHouses(getLayerDetails(Layer.FRONT).houses, getLayerDetails(Layer.FRONT).speed);
    this.moveHouses(getLayerDetails(Layer.MIDDLE).houses, getLayerDetails(Layer.MIDDLE).speed);
    this.moveHouses(getLayerDetails(Layer.BACK).houses, getLayerDetails(Layer.BACK).speed);
  }

  // Spawn house
  private spawnHouse(layer: Layer): void {
    // Variables
    const layerDetails: LayerProperties = getLayerDetails(layer);
    let houseID: string;

    // Get random house
    while (true) {
      houseID = Phaser.Utils.Array.GetRandom(this.houseKeys)
      if (houseID != layerDetails.lastHouse) break;
    }

    // Setter
    const house: Image = this.add.image(this.gameW + 100, layerDetails.y(), houseID);
    house.setOrigin(0.5, 1);
    house.setDepth(layerDetails.depth);
    house.setScale(layerDetails.scale());
    house.setAlpha(layerDetails.opacity);

    layerDetails.houses.push(house);
    layerDetails.lastHouse = houseID;
  }

  // Moves every house on specified layer
  private moveHouses(houses: Phaser.GameObjects.Image[], speed: number): void {
    houses.forEach(house => {
      house.x -= speed;
    });

    for (let i = houses.length - 3; i >= 0; i--) {
      if (houses[i].x < -houses[i].width - (houses[i].width * 3)) {
        houses[i].destroy();
        houses.splice(i, 1);
      }
    }
  }
}

// Layers enum
enum Layer {
  FRONT = "FRONT",
  MIDDLE = "MIDDLE",
  BACK = "BACK"
}

// Layer Properties
interface LayerProperties {
  // config
  delay: number;
  scale: () => number;
  depth: number;
  y: () => number;
  speed: number;
  opacity: number,
  // data
  lastHouse: string;
  houses: Phaser.GameObjects.Image[];
}

// Config
const layerPropertiesMap: Record<Layer, LayerProperties> = {
  [Layer.FRONT]: {
    delay: 2100,
    scale: () => 6 + Math.random() * 0.4,
    depth: -1,
    y: () => globalConsts.gameHeight - 64,
    speed: 2,
    opacity: 1,
    // Data
    lastHouse: "",
    houses: []
  },
  [Layer.MIDDLE]: {
    delay: 2500,
    scale: () => 3 + Math.random() * 0.3,
    depth: -2,
    y: () => globalConsts.gameHeight - 60,
    speed: 1.2,
    opacity: 1,
    // Data
    lastHouse: "",
    houses: []
  },
  [Layer.BACK]: {
    delay: 4000,
    scale: () => 2 + Math.random() * 0.2,
    depth: -3,
    y: () => globalConsts.gameHeight - 10,
    speed: 0.5,
    opacity: 1,
    // Data
    lastHouse: "",
    houses: []
  }
};

// Helper methode
function getLayerDetails(layer: Layer): LayerProperties {
  return layerPropertiesMap[layer];
}
