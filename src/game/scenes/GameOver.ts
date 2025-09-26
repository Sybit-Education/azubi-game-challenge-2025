import {Scene} from 'phaser';
import {globalConsts} from '../main.ts';

export class GameOver extends Scene {
  // Types
  background: Phaser.GameObjects.Image;
  gameover_image: Phaser.GameObjects.Image;
  restart_text: Phaser.GameObjects.Text;

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
    this.restart_text = this.add.text(170, 500, 'Deine Punktzahl:');
    this.restart_text = this.add.text(170, 530, 'Highscore:');
    this.restart_text = this.add.text(170, 560, 'Geschenke:');
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
