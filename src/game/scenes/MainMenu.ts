import {Scene, GameObjects} from 'phaser';

export class MainMenu extends Scene {
  // Variables
  background: GameObjects.Image;
  logo: GameObjects.Image;
  title: GameObjects.Text;

  // Constructor
  constructor() {
    super('mainMenu');
  }

  // Create methode
  create(): void {
    this.background = this.add.image(512, 384, 'startBackground');

    this.logo = this.add.image(512, 300, 'logo');

    this.title = this.add.text(512, 460, 'Main Menu', {
      fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
      stroke: '#000000', strokeThickness: 8,
      align: 'center'
    }).setOrigin(0.5);

    // On click: start game
    this.input.once('pointerdown', () => {
      this.scene.start('play');
    });
  }
}
