import {ThatPlayer} from './ThatPlayer.ts';
import {ThatGround} from './ThatGround.ts';
import {calculateScale, displayDebug, globalConsts, resetSpeed} from '../main.ts';
import {ThatSection} from './ThatSection.ts';
import {spawnHouses, updateMovement} from '../custom_classes/Background.ts';
import {generateCode} from '../scenes/GameOver.ts';
import {obstacleType, ThatObstacle} from './ThatObstacle.ts';
import {fetchLeaderboard, sortedLeaderboard} from '../scenes/Leaderboard.ts';
import Sprite = Phaser.Physics.Arcade.Sprite;
import Text = Phaser.GameObjects.Text;

export class ThatGame extends Phaser.Scene {
  // Config
  displayTop: number = 0.25; // Percentage [0-1] are possible too

  // Types
  player: ThatPlayer;
  ground: ThatGround;
  sections: ThatSection[] = [];
  leaderboardText: Text;
  jumpsLeft: Text;
  // Collusion
  collisionPlayerAndGround: Phaser.Physics.Arcade.Collider;

  // Constructor
  constructor() {
    super("thatGame");
  }

  // Create
  create(): void {
    // Displays debug
    displayDebug(this.scene.scene);

    // Resets music
    this.sound.stopAll()

    // Plays music if wanted
    if (localStorage.getItem("isActive.music") == "true") this.sound.play('gameMusic');

    // Creates player
    this.player = new ThatPlayer(this.scene.scene);
    this.player.setScore(0);
    this.player.setGifts(0);

    // Playtime-Timer
    this.time.addEvent({
      delay: 100,
      callback: () => {
        this.player.increaseScore(1);
      },
      callbackScope: this,
      loop: true
    });

    // Resets speed
    resetSpeed();

    // Speed-Timer
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        if (globalConsts.debug) console.log("Speed up");
        globalConsts.backgroundSpeed += 0.01;
        globalConsts.houseSpeed += 0.02;
        globalConsts.spriteSpeed += 0.02;
      },
      callbackScope: this,
      loop: true
    })

    // Creates Ground
    this.ground = new ThatGround(this.scene.scene);

    // Spawn houses
    spawnHouses(this.scene.scene);

    // Creates section
    this.createSection(1);
    this.createSection(1, 3);

    // Collision
    this.collisionPlayerAndGround = this.physics.add.collider(this.player.sprite, this.ground.sprite);

    // creates key for leaderboard
    generateCode().then(key => {
      if (key) localStorage.setItem("key", key);
    });

    // End game on ESC
    this.input.keyboard?.on('keydown-ESC', this.gameOver, this);

    // Display a note that you can collect gifts when starting the game
    const infoText: Text = this.add.text(
      globalConsts.gameWidth / 2, globalConsts.gameHeight * 0.25,
      "Collect the gifts to double Jump!",
      {
        font: "22px " + globalConsts.pixelFont,
        color: "#ffffff",
        fontStyle: "bold"
      }
    ).setOrigin(0.5)
      .setScale(calculateScale(1));

    // Fade-out
    this.tweens.add({
      targets: infoText,
      alpha: 0,
      delay: 3500, // start after 2.5s
      duration: 500 // fade-out-duration
    });

    // Removes text from the screen
    this.time.delayedCall(4000, () => infoText.destroy());

    // Creates leaderboard Text
    this.leaderboardText = this.add.text(globalConsts.gameWidth * 0.02, globalConsts.gameHeight * 0.97, "", {
      font: "15px " + globalConsts.pixelFont,
      color: "#ffffff",
    });

    // Creates Jumps left Text
    this.jumpsLeft = this.add.text(globalConsts.gameWidth * 0.98, globalConsts.gameHeight * 0.96, "", {
      font: "18px " + globalConsts.pixelFont,
      color: "#ffffff",
      align: "end",
    }).setOrigin(1, 0);

    // Fetches leaderboard
    fetchLeaderboard().then();
  }

  // Update
  update(): void {
    // Updates movement
    this.player.updateMovement();

    // Move background
    updateMovement();

    // Updates Double jumps left text
    this.jumpsLeft.setText("Double-Jumps left: " + this.player.jumpLefts);

    // Checks and moves sections
    this.sections.forEach(section => {
      // Checks if the marker is outside
      if (section.marker.sprite.x < section.randomVoidOut) {
        section.destroyAll();
        this.createSection(section.marker.sprite.alpha);
        this.sections.shift();
        return;
      }

      // Moves all obstacles
      section.updateMovement()
    });

    // Top x display
    if (sortedLeaderboard != undefined) {

      // Rank
      const rank: number = sortedLeaderboard.findIndex(entry => this.player.score >= entry.score);

      // Display
      if (this.displayTop > 1) { // Normal
        if (rank != -1 && rank <= this.displayTop) this.leaderboardText.setText("You´re top " + (rank + 1));
      } else { // Percentage
        const topPercent: number = (1 - (sortedLeaderboard.length - rank) / sortedLeaderboard.length) * 100; // Get %
        if (topPercent == 0) this.leaderboardText.setText("You´re top 1"); // Best player
        else if (rank != -1 && topPercent <= this.displayTop * 100) this.leaderboardText.setText("You´re top " + topPercent.toFixed(2) + "%");
      }
    }
  }

  // This creates a new section
  createSection(alpha: number, offset: number = 2): void {
    const thatSection: ThatSection = new ThatSection(this.scene.scene, alpha == 0, offset);
    this.sections.push(thatSection);
    const obstacles: Sprite[] = [];
    const gift: ThatObstacle | undefined = thatSection.gift;
    for (let obstacle of thatSection.obstacles) if (obstacle.type != obstacleType.GIFT) obstacles.push(obstacle.sprite)
    // collision player and harmful obstacles
    this.physics.add.collider(this.player.sprite, obstacles, () => {
    }, () => this.gameOver());
    // collision player and gift
    if (gift != undefined) this.physics.add.overlap(this.player.sprite, gift.sprite, () => {
    }, () => this.collectGift(gift.sprite));

  }

  // The main game over function
  gameOver(): void {
    // Pauses Game so it isn't ticking anymore
    this.game.pause();

    // Should destroy every obstacle
    for (let section of this.sections) {
      section.destroyAll();
    }

    // clears sections
    this.sections = [];

    // Saves score
    localStorage.setItem("last.score", this.player.score.toString());
    localStorage.setItem("last.jumpsLeft", this.player.jumpLefts.toString());

    // Stops scene
    this.scene.stop(this.scene.key)

    // Switch du different scene
    this.scene.start("gameOver");

    // Unpauses game
    this.game.resume();
  }

  // handle gift collecting
  collectGift(gift: Sprite): void {
    gift.destroy();// delete the sprite
    this.player.increaseGifts(1); // increase gifts by 1
    this.player.increaseJump(); // increases jumps left by 1
  }
}
