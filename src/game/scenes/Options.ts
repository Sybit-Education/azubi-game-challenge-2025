import {GameObjects, Scene} from "phaser";
import { globalConsts } from "../main";
import {Button} from "../custom_classes/Button";

export class Options extends Scene{
    placeholderText: GameObjects.Text;
    background: GameObjects.Image;
    gameW: number = globalConsts.gameWidth;
    gameH: number = globalConsts.gameHeight;
    buttonBack: Button;

    //constructor
    constructor(){
        super("options");
    }
    //TODO: Add actual options
    //create method
    create(){
        this.placeholderText = this.add.text(this.gameW / 2, this.gameH / 2, 'This is the "options" screen \n nothing here yet though :)');
        this. buttonBack = new Button(this.gameW * 0.5, this.gameH * 0.25, 'button_back', this, () => {this.scene.start('mainMenu')});
    }
}