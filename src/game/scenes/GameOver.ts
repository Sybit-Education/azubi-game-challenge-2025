import {Scene} from 'phaser';
import TextStyle = Phaser.GameObjects.TextStyle;

export class GameOver extends Scene {
  // Variables
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  gameover_image: Phaser.GameObjects.Image;
  restart_text: Phaser.GameObjects.Text;



  // Constructor
  constructor() {
    super('gameOver');
  }

  preload(): void {
    // GameOver Bild
    this.gameover_image = this.add.image(512, 480, 'gameOverTitle');
    this.gameover_image.setScale(0.2);

    this.restart_text = this.add.text(170, 500, 'Deine Punktzahl:');
    this.restart_text = this.add.text(170, 530, 'Highscore:');
    this.restart_text = this.add.text(170, 560, 'Geschenke:');
  }


  // Create methode
  create(): void {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x01386A);


    // Onclick: MainMenu
    this.input.once('pointerdown', () => {
      this.scene.start('mainMenu');
    });

  }
}
