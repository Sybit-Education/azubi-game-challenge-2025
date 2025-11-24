import {Scene} from 'phaser';
import {calculateScale, globalConsts} from '../main';
import Image = Phaser.GameObjects.Image;

// Layers enum
export enum Layer {
  FRONT = "FRONT",
  MIDDLE = "MIDDLE",
  /* BACK = "BACK" */
}

// All layers as array
const layers: Layer[] = [Layer.FRONT, Layer.MIDDLE, /*Layer.BACK*/];

// Config
const backgroundImage: string = "gameBackground";
const backgroundSpeed: number = 1;
const houseKeys: string[] = ["house1", "house2", "house3", "house4", "church"];
const layerPropertiesMap: Record<Layer, LayerProperties> = {
  [Layer.FRONT]: {
    delay: 3000,
    scale: () => 6 + Math.random() * 0.4,
    depth: -1,
    y: () => globalConsts.gameHeight * 0.92,
    speed: () => 2 * globalConsts.houseSpeed,
    color: 0x7d807e,
    // Data
    lastHouse: "",
    houses: []
  },
  [Layer.MIDDLE]: {
    delay: 3000,
    scale: () => 4 + Math.random() * 0.25,
    depth: -2,
    y: () => globalConsts.gameHeight * 0.92,
    speed: () => 1.2 * globalConsts.houseSpeed,
    color: 0x565756,
    // Data
    lastHouse: "",
    houses: []
  },
  /* [Layer.BACK]: {
    delay: 4000,
    scale: () => 4 + Math.random() * 0.2,
    depth: -3,
    y: () => globalConsts.gameHeight - 55,
    speed: () => 1.2 * globalConsts.houseSpeed
    speed: () => 0.6,
    opacity: 0.6,
    // Data
    lastHouse: "",
    houses: []
  } */
};

// Layer Properties
interface LayerProperties {
  // config
  delay: number;
  scale: () => number;
  depth: number;
  y: () => number;
  speed: () => number;
  color: number
  // data
  lastHouse: string;
  houses: Phaser.GameObjects.Image[];
}

// Variables
let currentScene: Scene;
let backgroundA: Image;
let backgroundB: Image;

// Spawn house for every layer
export function spawnHouses(scene: Scene): void {
  currentScene = scene;

  // Adds timer for every layer
  for (let layer of layers) {
    currentScene.time.addEvent({
      delay: getLayerDetails(layer).delay,
      callback: () => spawnHouse(layer),
      callbackScope: scene,
      loop: true
    });
  }

  // Spawn background
  createBackground();
}

// Create Background
function createBackground(): void {
  // Background A
  backgroundA = currentScene.add.image(0, 0, backgroundImage);
  backgroundA.setScale(calculateScale(3.75));
  backgroundA.setOrigin(1, 0);
  backgroundA.setDepth(-4);
  backgroundA.setAlpha(0.7)

  // Background B
  backgroundB = currentScene.add.image(backgroundA.displayWidth, 0, backgroundImage);
  backgroundB.setScale(calculateScale(3.75));
  backgroundB.setOrigin(1, 0)
  backgroundB.setDepth(-4);
  backgroundB.setAlpha(0.7)
}


// Spawn house
function spawnHouse(layer: Layer): void {
  const layerDetails: LayerProperties = getLayerDetails(layer);
  let houseID: string;

  // Gets random house
  while (true) {
    houseID = Phaser.Utils.Array.GetRandom(houseKeys);
    if (houseID != layerDetails.lastHouse) break;
  }

  // Places image
  const house: Image = currentScene.add.image(globalConsts.gameWidth + calculateScale(300), layerDetails.y(), houseID);
  house.setOrigin(1, 1);
  house.setDepth(layerDetails.depth);
  house.setScale(calculateScale(layerDetails.scale()));
  house.setTint(layerDetails.color);

  // Adds to array
  layerDetails.houses.push(house);
  layerDetails.lastHouse = houseID;
}

// Moves every house on every layer
export function updateMovement(): void {
  for (let layer of layers) moveHouses(getLayerDetails(layer).houses, getLayerDetails(layer).speed()); // Moves houses
  moveBackground(); // ️ Moves Backgrounds
}

// Moves background
function moveBackground(): void {
  backgroundB.x -= backgroundSpeed * globalConsts.backgroundSpeed;
  backgroundA.x -= backgroundSpeed * globalConsts.backgroundSpeed;

  if (backgroundA.x - backgroundA.displayWidth <= -backgroundA.displayWidth) backgroundA.x = backgroundB.x + 3 + backgroundB.displayWidth;
  if (backgroundB.x - backgroundB.displayWidth <= -backgroundB.displayWidth) backgroundB.x = backgroundA.x + 3   + backgroundA.displayWidth;
}


// Moves every house on specified layer
function moveHouses(houses: Phaser.GameObjects.Image[], speed: number): void {
  // Moves houses
  houses.forEach(house => {
    house.x -= speed;
  });

  // Destroys houses when out of bounds
  for (let i = houses.length - 3; i >= 0; i--) {
    const house = houses[i];
    if (house.x < 0) {
      house.destroy();
      houses.splice(i, 1);
    }
  }
}

// Helper methode
export function getLayerDetails(layer: Layer): LayerProperties {
  return layerPropertiesMap[layer];
}
