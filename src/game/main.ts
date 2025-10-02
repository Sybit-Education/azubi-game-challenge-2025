import {Boot} from './loader/Boot.ts';
import {GameOver} from './scenes/GameOver';
import {MainMenu} from './scenes/MainMenu';
import {AUTO, Game, Scene} from 'phaser';
import {Preloader} from './loader/Preloader.ts';
import {Options} from './scenes/Options.ts';
import {Credits} from './scenes/Credits.ts';
import {Steuerung} from './scenes/Steuerung.ts';
import Image = Phaser.GameObjects.Image;
import {ThatGame} from './thatFolder/ThatGame.ts';

// Config
const gameW: number = 1024;
const gameH: number = 768;
const santaXPosition: number = 200;
const santaYPosition: number = 680;
const background: number = 0xd3d1fa;
const debugMode: boolean = false;
const pixelFontName: string = "pixelFont";
const api: string = "http://localhost:3000";
const getRandomInt: Function = (min: number, max: number): number => {//return a random number between min(inclusive) and max(inclusive)
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled)
}

// Global variables
export const globalConsts = {
  gameWidth: gameW,
  gameHeight: gameH,
  santaX: santaXPosition,
  santaY: santaYPosition,
  backgroundColor: background,
  debug: debugMode,
  pixelFont: pixelFontName,
  apiURL: api,
  getRandomInt: getRandomInt,
};

// Config for Game
// Docs: https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const arcade: Phaser.Types.Core.PhysicsConfig = {default: 'arcade'};
const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: gameW, // Width of the game container
  height: gameH, // Height of the game container
  parent: 'game-container', // ID of the div in wich it should be displayed
  physics: arcade,
  input: {keyboard: true, mouse: true,}, // Wich inputs are enabled
  render: {
    pixelArt: true,   // macht die Sprites pixelig statt weich
    antialias: false  // schaltet Kantenglättung aus
  },
  scene: [ // All scenes
    // Loader
    Boot,
    Preloader,
    // Scenes
    Credits,
    ThatGame,
    GameOver,
    MainMenu,
    Options,
    Steuerung,
  ]
};

// Creates new Game instance
export default function startGame() {
  return new Game({...config});
}

// Displays player
export function displayPlayer(that: any): void {
  const player: Image = that.add.image(globalConsts.santaX, globalConsts.santaY, 'player2');
  player.setScale(4);
}

// Displays debug if enabled
export function displayDebug(scene: Scene): void {
  if (!debugMode) return;
  scene.add.graphics().setAlpha(0.75);
  scene.physics.world.createDebugGraphic();
}
