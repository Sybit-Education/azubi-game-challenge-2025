import {Scene} from 'phaser';
import {globalConsts} from '../main.ts';

export class GameOver extends Scene {
  // Types
  gameW: number = globalConsts.gameWidth;
  gameH: number = globalConsts.gameHeight;
  background: Phaser.GameObjects.Image;
  gameover_image: Phaser.GameObjects.Image;
  restart_text: Phaser.GameObjects.Text;
  highscore_image: Phaser.GameObjects.Image;
  deinScore_image: Phaser.GameObjects.Image;
  gifts_image: Phaser.GameObjects.Image;

  // Constructor
  constructor() {
    super('gameOver');
  }

  // Pre-loader
  preload(): void {
    // GameOver Bild
    this.gameover_image = this.add.image(512, 480, 'gameOverTitle');
    this.gameover_image.setScale(0.2);

    // Info
    this.highscore_image = this.add.image(250, 500, 'button_highscore');
    this.highscore_image.setScale(4.5);
    this.deinScore_image = this.add.image(250, 550, 'button_deinScore');
    this.deinScore_image.setScale(4.5);
    this.gifts_image = this.add.image(215, 600, 'button_gifts');
    this.gifts_image.setScale(4.4);
  }

  // Create methode
  create(): void {
    // Background
    this.cameras.main.setBackgroundColor(globalConsts.backgroundColor);

    // Onclick: MainMenu
    this.input.once('pointerdown', () => {
      this.scene.start('mainMenu');
    });
  }
}
