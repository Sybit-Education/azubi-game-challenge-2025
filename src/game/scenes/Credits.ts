import {GameObjects, Scene} from "phaser";

export class Credits extends Scene{
    placeholderText: GameObjects.Text;
    background: GameObjects.Image;

    //constructor
    constructor(){
        super("credits");
    }
    //Todo: Add credits screen and a "go back" button that takes the player back to the main menu

}