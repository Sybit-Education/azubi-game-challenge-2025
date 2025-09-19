import {Boot} from './loader/Boot.ts';
import {GameOver} from './scenes/GameOver';
import {Game as ThatGame} from './scenes/Game';
import {MainMenu} from './scenes/MainMenu';
import {Credits} from './scenes/Credits';
import {AUTO, Game} from 'phaser';
import {Preloader} from './loader/Preloader.ts';

// Config for Game
// Docs: https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const arcade: Phaser.Types.Core.PhysicsConfig = {default: 'arcade'};
const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: 1024, // Width of the game container
  height: 768, // Height of the game container
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
    Credits
  ]
};

// Creates new Game instance
export default function startGame() {
  return new Game({...config});
}
