import {Scene} from 'phaser';
import Image = Phaser.GameObjects.Image;
import {globalConsts} from '../main';

// Layers enum
export enum Layer {
  FRONT = "FRONT",
  MIDDLE = "MIDDLE",
  /* BACK = "BACK" */
}

// All layers as array
const layers: Layer[] = [Layer.FRONT, Layer.MIDDLE, /*Layer.BACK*/];

// Config
const backgroundSpeed: number = 1;
const houseKeys: string[] = ["house1", "house2", "house3", "house4", "church"];
const layerPropertiesMap: Record<Layer, LayerProperties> = {
  [Layer.FRONT]: {
    delay: 3000,
    scale: () => 10 + Math.random() * 0.4,
    depth: -1,
    y: () => globalConsts.gameHeight - 64,
    speed: () => 2 * globalConsts.houseSpeed,
    opacity: 0.925,
    // Data
    lastHouse: "",
    houses: []
  },
  [Layer.MIDDLE]: {
    delay: 3000,
    scale: () => 6 + Math.random() * 0.25,
    depth: -2,
    y: () => globalConsts.gameHeight - 58,
    speed: () =>  1.2 * globalConsts.houseSpeed,
    opacity: 0.8,
    // Data
    lastHouse: "",
    houses: []
  },
  /* [Layer.BACK]: {
    delay: 4000,
    scale: () => 4 + Math.random() * 0.2,
    depth: -3,
    y: () => globalConsts.gameHeight - 55,
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
  opacity: number;
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
  backgroundA = currentScene.add.image(globalConsts.gameWidth / 2, globalConsts.gameHeight / 2.2, "gameBackground3");
  backgroundA.setScale(4.5);
  backgroundA.setDepth(-4);

  // Background B
  backgroundB = currentScene.add.image(globalConsts.gameWidth / 2 + backgroundA.displayWidth, globalConsts.gameHeight / 2.2, "gameBackground3");
  backgroundB.setScale(4.5);
  backgroundB.setDepth(-4);
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
  const house: Image = currentScene.add.image(globalConsts.gameWidth + 300, layerDetails.y(), houseID);
  house.setOrigin(0.5, 1);
  house.setDepth(layerDetails.depth);
  house.setScale(layerDetails.scale());
  house.setAlpha(layerDetails.opacity);

  // Adds to array
  layerDetails.houses.push(house);
  layerDetails.lastHouse = houseID;
}

// Moves every house on every layer
export function updateMovement(): void {
  for (let layer of layers) moveHouses(getLayerDetails(layer).houses, getLayerDetails(layer).speed()); // Moves houses
  moveBackground(); // ️ Moves Background
}

// Moves background
function moveBackground(): void {
  backgroundA.x -= backgroundSpeed * globalConsts.backgroundSpeed;
  backgroundB.x -= backgroundSpeed * globalConsts.backgroundSpeed;


  if (backgroundA.x <= -backgroundA.displayWidth / 2) backgroundA.x = backgroundB.x + backgroundB.displayWidth;
  if (backgroundB.x <= -backgroundB.displayWidth / 2) backgroundB.x = backgroundA.x + backgroundA.displayWidth;
}


// Moves every house on specified layer
function moveHouses(houses: Phaser.GameObjects.Image[], speed: number): void {
  houses.forEach(house => {
    house.x -= speed;
  });

  for (let i = houses.length - 3; i >= 0; i--) {
    if (houses[i].x < -houses[i].width * 4 - 50) {
      houses[i].destroy();
      houses.splice(i, 1);
    }
  }
}

// Helper methode
export function getLayerDetails(layer: Layer): LayerProperties {
  return layerPropertiesMap[layer];
}
