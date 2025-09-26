import {Scene} from 'phaser';
import {globalConsts} from "../main";
import {Button} from "../custom_classes/Button";
import * as string_decoder from 'node:string_decoder';

export class Steuerung extends Scene{

  // Types
  placeholderText: GameObjects.Text;
  background: GameObjects.Image;
  gameW: number = globalConsts.gameWidth;
  gameH: number = globalConsts.gameHeight;
  buttonBack: Button;
  player_image: Phaser.GameObjects.Image;

  // Constructor
  constructor() {
    super("options");
  }

  // TODO: Add actual options
  // Create method
  create(): void {

}
