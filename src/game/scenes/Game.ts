import { GameObjects, Physics, Scene } from 'phaser';

export class Game extends Scene
{
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  player: Phaser.Physics.Arcade.Sprite;
  ground: Phaser.Physics.Arcade.Sprite;
  obstacle: Phaser.Physics.Arcade.Sprite;
  colisionPlayerAndGround: Phaser.Physics.Arcade.Collider;
  colisionPlayerAndObstacle: Phaser.Physics.Arcade.Collider;
  isDucked: boolean = false;
  keyUp: Phaser.Input.Keyboard.Key;
  keyDown: Phaser.Input.Keyboard.Key;
  keyLeft: Phaser.Input.Keyboard.Key; //Todo: Delete later
  keyRight: Phaser.Input.Keyboard.Key; //Todo: Delete later

  constructor () {
    super('Game');
  }

  create () {//Todo: Add player movement
    function gameOver(): void{
      //this.scene.start("GameOver");
      console.log("Collide");
    }
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x00ff00);

    this.background = this.add.image(512, 384, 'gameBackground');

    this.ground = this.physics.add.sprite(512,736,"ground");
    this.ground.setImmovable(true);

    this.obstacle = this.physics.add.sprite(512,688,"obstacle");
    this.obstacle.setImmovable(true);

    this.player = this.physics.add.sprite(64,64,"playerIdle");
    this.player.body?.setSize(32,64,false);
    this.player.setOrigin(0.5,1);
    this.player.setCollideWorldBounds(true);
    this.player.setGravityY(500);

    this.colisionPlayerAndGround = this.physics.add.collider(this.player,this.ground);
    this.colisionPlayerAndObstacle = this.physics.add.collider(this.player,this.obstacle,gameOver());

    this.keyUp = this.input.keyboard.addKey("W");
    this.keyDown = this.input.keyboard.addKey("S");
    this.keyLeft = this.input.keyboard.addKey("A"); //Todo: delete later
    this.keyRight = this.input.keyboard.addKey("D"); //Todo: delete later
  }
  update (){
    if(this.keyDown.isDown && this.player.body?.touching.down){
      this.player.body?.setSize(32,32,false);
      this.player.setTexture("playerDucking");
      this.player.setVelocityX(0);
      this.isDucked = true;
    } else if(this.keyDown.isUp  && this.isDucked){
      this.player.body?.setSize(32,64,false);
      this.player.setTexture("playerIdle");
      this.isDucked = false;
    } else if(this.keyRight.isDown){
      this.player.setVelocityX(160); 
    } else if(this.keyLeft.isDown){
      this.player.setVelocityX(-160);
    } else {
      this.player.setVelocityX(0);
    }
    if(this.keyUp.isDown && this.player.body?.touching.down){
      this.player.setVelocityY(-330);
    }
  }
}
