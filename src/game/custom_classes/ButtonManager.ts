import { Button } from "./Button";
import { Scene } from "phaser";

export class ButtonManager {
  private buttons: Button[] = [];
  private currentFocusIndex: number = 0;
  private scene: Scene;
  private lastGamepadState: { [key: number]: boolean } = {};
  private lastKeyboardTabState: boolean = false;

  constructor(scene: Scene) {
    this.scene = scene;
    
    // Add update event to check for navigation inputs
    this.scene.events.on('update', this.update, this);
    
    // Clean up when scene is shutdown
    this.scene.events.once('shutdown', this.destroy, this);
  }

  addButton(button: Button): void {
    this.buttons.push(button);
    
    // If this is the first button, give it focus
    if (this.buttons.length === 1) {
      this.setFocus(0);
    }
  }

  private setFocus(index: number): void {
    // Clear focus from all buttons
    this.buttons.forEach(button => button.setFocus(false));
    
    // Set focus on the selected button
    if (this.buttons.length > 0) {
      this.currentFocusIndex = (index + this.buttons.length) % this.buttons.length;
      this.buttons[this.currentFocusIndex].setFocus(true);
    }
  }

  private update(): void {
    if (this.buttons.length === 0) return;
    
    // Check keyboard Tab navigation
    const tabKey = this.scene.input.keyboard?.addKey('TAB');
    if (tabKey) {
      const tabDown = tabKey.isDown;
      if (tabDown && !this.lastKeyboardTabState) {
        // Tab was just pressed
        const shiftKey = this.scene.input.keyboard?.isKeyDown('SHIFT');
        this.navigateButtons(shiftKey ? -1 : 1);
      }
      this.lastKeyboardTabState = tabDown;
    }
    
    // Check gamepad navigation
    const gamepad = this.scene.input.gamepad?.getPad(0);
    if (gamepad) {
      // D-pad navigation
      const upPressed = gamepad.up && !this.lastGamepadState[12];
      const downPressed = gamepad.down && !this.lastGamepadState[13];
      const leftPressed = gamepad.left && !this.lastGamepadState[14];
      const rightPressed = gamepad.right && !this.lastGamepadState[15];
      
      // Left stick navigation
      const leftStickUp = gamepad.leftStick.y < -0.5 && this.lastGamepadState[1] !== true;
      const leftStickDown = gamepad.leftStick.y > 0.5 && this.lastGamepadState[2] !== true;
      const leftStickLeft = gamepad.leftStick.x < -0.5 && this.lastGamepadState[3] !== true;
      const leftStickRight = gamepad.leftStick.x > 0.5 && this.lastGamepadState[4] !== true;
      
      // Update navigation based on input
      if (upPressed || leftStickUp) {
        this.navigateButtons(-1);
      } else if (downPressed || leftStickDown) {
        this.navigateButtons(1);
      }
      
      // Store current gamepad state
      this.lastGamepadState[12] = gamepad.up;
      this.lastGamepadState[13] = gamepad.down;
      this.lastGamepadState[14] = gamepad.left;
      this.lastGamepadState[15] = gamepad.right;
      this.lastGamepadState[1] = gamepad.leftStick.y < -0.5;
      this.lastGamepadState[2] = gamepad.leftStick.y > 0.5;
      this.lastGamepadState[3] = gamepad.leftStick.x < -0.5;
      this.lastGamepadState[4] = gamepad.leftStick.x > 0.5;
      
      // Check if A button is pressed to activate the focused button
      if (gamepad.A && !this.lastGamepadState[0]) {
        this.activateFocusedButton();
      }
      this.lastGamepadState[0] = gamepad.A;
    }
  }

  private navigateButtons(direction: number): void {
    const newIndex = this.currentFocusIndex + direction;
    this.setFocus(newIndex);
  }

  private activateFocusedButton(): void {
    if (this.buttons.length > 0) {
      this.buttons[this.currentFocusIndex].activate();
    }
  }

  destroy(): void {
    this.scene.events.off('update', this.update, this);
    this.buttons = [];
  }
}
