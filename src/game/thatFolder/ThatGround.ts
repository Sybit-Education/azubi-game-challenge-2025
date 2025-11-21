import {Scene} from "phaser";
import {calculateScale, globalConsts} from '../main.ts';

export class ThatGround {
  // Types
  sprite: Phaser.Physics.Arcade.Sprite;

  // Constructor
  constructor(currentScene: Scene) {
    // Creates sprite
    this.sprite = currentScene.physics.add.sprite(globalConsts.gameWidth * 0.5, globalConsts.gameHeight - 10, "ground");
    this.sprite.setImmovable(false);
    this.sprite.setPushable(false);
    this.sprite.setDepth(0);
    this.sprite.setScale(calculateScale(13))
    // TODO | Add scroll effect
  }
}
