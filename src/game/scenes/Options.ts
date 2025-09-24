import {GameObjects, Scene} from "phaser";
import { globalConsts } from "../main";
import {Button} from "../custom_classes/Button";

export class Options extends Scene{
    placeholderText: GameObjects.Text;
    background: GameObjects.Image;
    gameW: number = globalConsts.gameWidth;
    gameH: number = globalConsts.gameHeight;
    buttonBack: Button;
    background: Phaser.Cameras.Scene2D.Camera;
  player_image: Phaser.GameObjects.Image;
  santaX: number = globalConsts.SantaX;
  santaY: number = globalConsts.SantaY;

    //constructor
    constructor(){
        super("options");
    }
    //TODO: Add actual options
    //create method
    create(){
        this.placeholderText = this.add.text(this.gameW / 2, this.gameH / 2, 'This is the "options" screen \n nothing here yet though :)');
        this. buttonBack = new Button(this.gameW * 0.5, this.gameH * 0.25, 'button_back', this, () => {this.scene.start('mainMenu')});



        this.background = this.cameras.main;
        this.background.setBackgroundColor(0x01386A);
      this.player_image = this.add.image(this.santaX, this.santaY, 'playerId');
      this.player_image.setScale(4);
    }
}
