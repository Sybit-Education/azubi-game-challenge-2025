import {Boot} from './loader/Boot.ts';
import {GameOver} from './scenes/GameOver';
import {MainMenu} from './scenes/MainMenu';
import {AUTO, Game, Scene} from 'phaser';
import {Preloader} from './loader/Preloader.ts';
import {Options} from './scenes/Options.ts';
import {Credits} from './scenes/Credits.ts';
import {Controls} from './scenes/Controls.ts';
import {ThatGame} from './thatFolder/ThatGame.ts';
import {Leaderboard} from './scenes/Leaderboard.ts';
import {get3} from "./thatFolder/ThatPlayer.ts";
import Gamepad = Phaser.Input.Gamepad.Gamepad;
import Image = Phaser.GameObjects.Image;

// Config
const big: boolean = true
const gameW: number = big ? 1920 : 1024; // 1024
const gameH: number = big ? 1080 : 768; // 768
const background: number = 0xd3d1fa;
const debugMode: boolean = false;
const pixelFontName: string = "pixelFont";
const api: string | undefined = undefined // "http://localhost:3000"; // Dont forget the http(s) | undefined -> localstorage
let speed: number = 1;

// Global variables
export const globalConsts = {
  gameWidth: gameW,
  gameHeight: gameH,
  backgroundColor: background,
  debug: debugMode,
  pixelFont: pixelFontName,
  apiURL: api,
  backgroundSpeed: speed,
  houseSpeed: speed,
  spriteSpeed: speed,
};

// Config for Game
// Docs: https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const arcade: Phaser.Types.Core.PhysicsConfig = {default: 'arcade'};
const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: gameW, // Width of the game container
  height: gameH, // Height of the game container
  parent: 'game-container', // ID of the div in which it should be displayed
  physics: arcade,
  input: {
    keyboard: true,
    mouse: true,
    gamepad: true, // Enable gamepad support
  },
  render: {
    pixelArt: true, // Pixels are preserved
    antialias: false // Removes jagged edges
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
    Controls,
    Leaderboard
  ]
};

// Creates new Game instance
export default function startGame(): void {
  new Game({...config});
}

// Displays player in the corner
export function displayPlayer(that: Scene): void {
  const player: Image = that.add.image(10, globalConsts.gameHeight - 10, 'player2');
  player.setOrigin(0, 1)
  player.setScale(calculateScale(4));
}

// Displays debug if enabled
export function displayDebug(scene: Scene): void {
  if (!debugMode) return;
  scene.add.graphics().setAlpha(0.75);
  scene.physics.world.createDebugGraphic();
}

// Adds a Shortcut to exit the current menu
export function escapeOption(that: Scene, gamepad?: Gamepad): void {
  const escKey = that.input.keyboard?.addKey('ESC');
  escKey?.on('down', () => {
    that.scene.start('mainMenu');
  });

  if (gamepad) {
    if (get3(gamepad)) {
      that.scene.start('mainMenu');
      return;
    }
  }
}


// Get random Int between to points
export function getRandomInt(min: number, max: number): number {
  const minCeiled: number = Math.ceil(min);
  const maxFloored: number = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled)
}

// Calculates new scale
export function calculateScale(
  refScale: number
): number {
  const diagonal = (w: number, h: number) => Math.sqrt(w * w + h * h);
  const targetDiagonal = diagonal(globalConsts.gameWidth, globalConsts.gameHeight);
  const refDiagonal = diagonal(1024, 768);
  const ratio = targetDiagonal / refDiagonal;
  return parseFloat((refScale * ratio).toFixed(2)); // round to 2 digits
}

// Resets speeds to default
export function resetSpeed(): void {
  globalConsts.backgroundSpeed = speed;
  globalConsts.houseSpeed = speed;
  globalConsts.spriteSpeed = speed;
}
