import {GameObjects, Scene} from "phaser";

//import via (import {Button} from "../custom_classes/Button")
export class Button {
  x: number;
  y: number;
  image: string;
  targetScene: string;
  scene: Scene;
  button: GameObjects.Image;

  // Constructor
  constructor(x: number, y: number, scale: number, image: string, curScene: Scene, onButtonPressed: Function) {
    //initialise variables
    this.x = x; //x position
    this.y = y; //y position
    this.image = image; //image as string
    this.scene = curScene; //the scene the buttons is in (this)

    //add buttons to the current scene (just "this" in the scene you implement the buttons)
    this.button = this.scene.add.image(this.x, this.y, this.image);

    // make buttons interactive
    this.button.setInteractive();

    // scales the button
    this.button.setScale(scale, scale);

    // Buttons actions
    this.button.on('pointerover', () => {
      this.button.setTint(0xcccccc); //highlight the buttons gray while the mouse hovers over it
    });

    this.button.on('pointerout', () => {
      this.button.clearTint(); //stop highlighting the buttons if the mouse doesn't hover above it
    });

    // Calls the function that is provided
    this.button.on('pointerdown', onButtonPressed);
  }

}
