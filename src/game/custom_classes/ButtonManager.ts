import {Button} from "./Button";
import {Scene} from "phaser";
import {get2} from '../thatFolder/ThatPlayer.ts';

export class ButtonManager {
  private buttons: Button[] = [];
  private currentFocusIndex: number = 0;
  private readonly scene: Scene;
  private lastGamepadState: { [key: number]: boolean } = {};
  private lastKeyboardTabState: boolean = false;
  private lastUpKeyState: boolean = false;
  private lastDownKeyState: boolean = false;
  private lastLeftKeyState: boolean = false;
  private lastRightKeyState: boolean = false;
  private lastSpaceKeyState: boolean = false;
  private blocker: boolean = true;

  constructor(scene: Scene) {
    this.scene = scene;

    // Add update event to check for navigation inputs
    this.scene.events.on('update', this.update, this);

    // Clean up when the scene is shutdown
    this.scene.events.once('shutdown', this.destroy, this);
  }

  // Adds Button
  addButton(button: Button): void {
    this.buttons.push(button);
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
    const spaceKey = this.scene.input.keyboard?.addKey('SPACE');
    const upKey = this.scene.input.keyboard?.addKey('UP');
    const downKey = this.scene.input.keyboard?.addKey('DOWN');
    const leftKey = this.scene.input.keyboard?.addKey('LEFT');
    const rightKey = this.scene.input.keyboard?.addKey('RIGHT');

    // Check for Enter/Space keys to activate the focused button
    if (spaceKey?.isDown && !this.lastSpaceKeyState) {
      this.activateFocusedButton();
    }

    this.lastSpaceKeyState = spaceKey?.isDown || false;

    // Next button
    if (tabKey) {
      const tabDown: boolean = tabKey.isDown;
      if (tabDown && !this.lastKeyboardTabState) {
        // Tab was just pressed
        const shiftKey = this.scene.input.keyboard?.addKey('SHIFT');
        this.navigateButtons(shiftKey?.isDown ? -1 : 1);
      }
      this.lastKeyboardTabState = tabDown;
    }

    // Check cursor keys for navigation
    if (upKey?.isDown && !this.lastUpKeyState || leftKey?.isDown && !this.lastLeftKeyState) {
      this.navigateButtons(-1);
    }
    if (downKey?.isDown && !this.lastDownKeyState || rightKey?.isDown && !this.lastRightKeyState) {
      this.navigateButtons(1);
    }

    // Store the current keyboard state
    this.lastUpKeyState = upKey?.isDown || false;
    this.lastDownKeyState = downKey?.isDown || false;
    this.lastLeftKeyState = leftKey?.isDown || false;
    this.lastRightKeyState = rightKey?.isDown || false;

    // Check gamepad navigation
    const gamepad = this.scene.input.gamepad?.getPad(0);
    if (gamepad) {
      // D-pad navigation
      const upPressed = gamepad.up && !this.lastGamepadState[12];
      const downPressed = gamepad.down && !this.lastGamepadState[13];
      const leftPressed = gamepad.left && !this.lastGamepadState[14];
      const rightPressed = gamepad.right && !this.lastGamepadState[15];

      // Left stick navigation
      const leftStickUp = gamepad.leftStick.y < -0.5 && !this.lastGamepadState[1];
      const leftStickDown = gamepad.leftStick.y > 0.5 && !this.lastGamepadState[2];
      const leftStickLeft = gamepad.leftStick.x < -0.5 && !this.lastGamepadState[3];
      const leftStickRight = gamepad.leftStick.x > 0.5 && !this.lastGamepadState[4];

      // Update navigation based on input
      if (upPressed || leftPressed || leftStickUp || leftStickLeft) {
        this.navigateButtons(-1);
      } else if (downPressed || rightPressed || leftStickDown || leftStickRight) {
        this.navigateButtons(1);
      }

      // Store the current gamepad state
      this.lastGamepadState[12] = gamepad.up;
      this.lastGamepadState[13] = gamepad.down;
      this.lastGamepadState[14] = gamepad.left;
      this.lastGamepadState[15] = gamepad.right;
      this.lastGamepadState[1] = gamepad.leftStick.y < -0.5;
      this.lastGamepadState[2] = gamepad.leftStick.y > 0.5;
      this.lastGamepadState[3] = gamepad.leftStick.x < -0.5;
      this.lastGamepadState[4] = gamepad.leftStick.x > 0.5;

      // Check if button 2 is pressed to activate the focused button
      if (get2(gamepad)) {
        if (!this.blocker && !this.lastGamepadState[0]) {
          this.activateFocusedButton();
          this.blocker = true;
        }
      } else this.blocker = false;
      this.lastGamepadState[0] = get2(gamepad);
    }
  }

  private navigateButtons(direction: number): void {
    const newIndex: number = this.currentFocusIndex + direction;
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
