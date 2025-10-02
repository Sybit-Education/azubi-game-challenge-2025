import {GameObjects, Scene} from "phaser";

//import via (import {Button} from "../custom_classes/Button")
export class Button {
  readonly x: number;
  readonly y: number;
  image: string;
  readonly scene: Scene;
  button: GameObjects.Image;

  // Constructor
  constructor(x: number, y: number, scale: number, image: string, curScene: Scene, onButtonPressed: Function) {
    //initialise variables
    this.x = x; //x position
    this.y = y; //y position
    this.image = image; //image as string
    this.scene = curScene; //the scene the buttons is in (this)

    // add buttons to the current scene (just "this" in the scene you implement the buttons)
    this.button = this.scene.add.image(this.x, this.y, this.image);

    // make buttons interactive
    this.button.setInteractive();

    // scales the button
    this.button.setScale(scale, scale);

    // Buttons actions
    this.button.on('pointerover', () => {
      this.button.setAlpha(0.7);
    });

    this.button.on('pointerout', () => {
      this.button.setAlpha(1);
    });
    // Calls function that is provided
    this.button.on('pointerdown', onButtonPressed);
  }

  setImage(newImage: string): void {
    this.image = newImage;
    this.button.setTexture(newImage)
  }
}
