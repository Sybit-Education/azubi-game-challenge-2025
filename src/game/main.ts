import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { Game as MainGame } from './scenes/Game';
import { MainMenu } from './scenes/MainMenu';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const gameHeight: number = 768;
const gemeWidth: number = 1024;
const arcade: Phaser.Types.Core.PhysicsConfig = {default: 'arcade'};
const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: gemeWidth,
  height: gameHeight,
  parent: 'game-container',
  backgroundColor: '#028af8',
  physics: arcade,
  input: {keyboard: true, mouse: true},
  scene: [
    Boot,
    Preloader,
    MainMenu,
    MainGame,
    GameOver
  ]
};

const StartGame = (parent: string) => {

  return new Game({ ...config, parent });

}

export default StartGame;
