import {Boot} from './loader/Boot.ts';
import {GameOver} from './scenes/GameOver';
import {Play as ThatGame} from './scenes/Play.ts';
import {MainMenu} from './scenes/MainMenu';
import {AUTO, Game} from 'phaser';
import {Preloader} from './loader/Preloader.ts';
import {Options} from './scenes/Options.ts';
import {Credits} from './scenes/Credits.ts';

// Config for Game
// Docs: https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig

//declaring global variables for using the games width and height dynamically (import { globalConsts } from "../main") 
const gameW: number = 1024;
const gameH: number = 768;

export const globalConsts = {
  gameWidth: gameW,
  gameHeight: gameH
};

const arcade: Phaser.Types.Core.PhysicsConfig = {default: 'arcade'};
const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: gameW, // Width of the game container
  height: gameH, // Height of the game container
  parent: 'game-container', // ID of the div in wich it should be displayed
  physics: arcade,
  input: {keyboard: true, mouse: true,}, // Wich inputs are enabled
  scene: [ // All scenes
    // Loader
    Boot,
    Preloader,
    // Scenes
    MainMenu,
    ThatGame,
    GameOver,
    Credits,
    Options
  ]
};

// Creates new Game instance
export default function startGame() {
  return new Game({...config});
}
