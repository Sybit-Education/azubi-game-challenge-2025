import {GameObjects, Scene, Input} from "phaser";
import { ButtonManager } from "./ButtonManager";
import Gamepad = Phaser.Input.Gamepad.Gamepad;

//import via (import {Button} from "../custom_classes/Button")
export class Button {
  readonly x: number;
  readonly y: number;
  image: string;
  readonly scene: Scene;
  button: GameObjects.Image;
  keyboardKey?: Input.Keyboard.Key;
  gamepadButtonIndex?: number;
  isFocused: boolean = false;
  onButtonPressed?: Function;
  gamepadCheckActive: boolean = false;
  buttonManager?: ButtonManager;

  // Constructor
  constructor(x: number, y: number, scale: number, image: string, curScene: Scene, onButtonPressed?: Function, keyboardKey?: string, gamepadButtonIndex?: number, buttonManager?: ButtonManager) {
    //initialise variables
    this.x = x; //x position
    this.y = y; //y position
    this.image = image; //image as string
    this.scene = curScene; //in the scene the button is in (this)
    this.onButtonPressed = onButtonPressed;
    this.gamepadButtonIndex = gamepadButtonIndex; // does this even work?
    this.buttonManager = buttonManager;

    // add buttons to the current scene (just "this" in the scene you implement the buttons)
    this.button = this.scene.add.image(this.x, this.y, this.image);

    // make buttons interactive
    this.button.setInteractive();

    // scales the button
    this.button.setScale(scale, scale);

    // Buttons actions
    this.button.on('pointerover', () => {
      this.setFocus(true);
    });

    this.button.on('pointerout', () => {
      this.setFocus(false);
    });

    // Calls function that is provided
    this.button.on('pointerdown', () => this.activate());

    // Setup keyboard key if provided
    if (keyboardKey) {
      this.keyboardKey = this.scene.input.keyboard?.addKey(keyboardKey);

      // Add update event to the scene to check for key press
      this.scene.events.on('update', this.checkKeyboardInput, this);
    }

    // Set up gamepad check if needed
    if (gamepadButtonIndex !== undefined) {
      this.gamepadCheckActive = true;
      this.scene.events.on('update', this.checkGamepadInput, this);
    }

    // Register with the button manager if provided
    if (this.buttonManager) {
      this.buttonManager.addButton(this);
    }
  }

  setFocus(focused: boolean): void {
    this.isFocused = focused;
    this.button.setAlpha(focused ? 0.7 : 1);
  }

  setImage(newImage: string): void {
    this.image = newImage;
    this.button.setTexture(newImage);
  }

  activate(): void {
    this.setFocus(true);
    if (this.onButtonPressed) this.onButtonPressed();
    // Reset focus after a short delay if not managed by ButtonManager
    if (!this.buttonManager) {
      this.scene.time.delayedCall(200, () => {
        this.setFocus(false);
      });
    }
  }

  checkKeyboardInput(): void {
    if (this.keyboardKey && Phaser.Input.Keyboard.JustDown(this.keyboardKey)) {
      this.activate();
    }
  }

  checkGamepadInput(): void {
    if (!this.gamepadCheckActive || this.gamepadButtonIndex === undefined) return;

    const pad: Gamepad | undefined = this.scene.input.gamepad?.getPad(0);
    if (!pad) return;

    // Check if the button was just pressed
    if (pad.buttons[this.gamepadButtonIndex].pressed && pad.buttons[this.gamepadButtonIndex].value === 1) {
      if (!pad.buttons[this.gamepadButtonIndex].pressed) {
        this.activate();
      }
    }
  }

  destroy(): void {
    // Clean up event listeners
    this.scene.events.off('update', this.checkKeyboardInput, this);
    this.scene.events.off('update', this.checkGamepadInput, this);
    this.button.destroy();
  }
}
