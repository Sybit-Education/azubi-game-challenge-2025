import {GameObjects, Scene} from "phaser";
import { globalConsts } from "../main";

export class Options extends Scene{
    placeholderText: GameObjects.Text;
    background: GameObjects.Image;
    gameW: number = globalConsts.gameWidth;
    gameH: number = globalConsts.gameHeight;
    buttonBack: GameObjects.Image

    //constructor
    constructor(){
        super("options");
    }
    //Todo: Add actual options and a "go back" button that takes the player back to the main menu
    //create method
    create(){
        const goToMainMenu = () => {
            this.scene.start("mainMenu");
        }
        const highlightButton = (button: GameObjects.Image) => {
            button.setTint(0xffffff);
        }
        const highlightButtonOff = (button: GameObjects.Image) => {
            button.clearTint();
        }
        this.placeholderText = this.add.text(this.gameW / 2, this.gameH / 2, 'This is the "options" screen \n nothing here yet though :)');
        this.buttonBack = this.add.sprite(this.gameW / 2, this.gameH * 0.75, 'button_back');
        this.buttonBack.setInteractive();
        this.background = this.add.image(this.gameW / 2, this.gameH / 2, 'startBackground');

        this.buttonBack.on('pointerover',highlightButton);
        this.buttonBack.on('pointerout',highlightButtonOff);
        this.buttonBack.on('pointerdown',goToMainMenu);
    }
    update(){

    }
}