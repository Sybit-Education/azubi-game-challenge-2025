import { GameObjects, Scene} from "phaser";

//import via (import {Button} from "../custom_classes/Button")
export class Button{
    readonly x: number;
    readonly y: number;
    readonly image: string;
    readonly targetScene: string;
    readonly scene: Scene;
    button: GameObjects.Image;

    constructor(x:number, y:number, image:string, curScene:Scene, onButtonPressed: Function){
        //initialise variables
        this.x = x; //x position
        this.y = y; //y position
        this.image = image; //image as string
        this.scene = curScene; //the scene the button is in (this)

        //add button to the current scene (just "this" in the scene you implement the button)
        this.button = this.scene.add.image(this.x,this.y,this.image);

        //make button interactive
        this.button.setInteractive();

        //button actions
        this.button.on('pointerover',() => {//highlight the button gray while the mouse hovers over it
            this.button.setTint(0xcccccc);
        });

        this.button.on('pointerout',() => {//stop highlighting the button if the mouse doesn't hover above it
            this.button.clearTint();
        });

        this.button.on('pointerdown', onButtonPressed);//call function if button is pressed
    }

}