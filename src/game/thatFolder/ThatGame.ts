import {ThatPlayer} from './ThatPlayer.ts';
import {ThatGround} from './ThatGround.ts';
import {displayDebug, globalConsts} from '../main.ts';
import {ThatSection} from './ThatSection.ts';
import {spawnHouses, updateMovement} from '../custom_classes/Background.ts';
import {generateCode} from '../scenes/GameOver.ts';
import Sprite = Phaser.Physics.Arcade.Sprite;
import {obstacleType} from './ThatObstacle.ts';
import Text = Phaser.GameObjects.Text;
import {fetchLeaderboard, sortedLeaderboard} from '../scenes/Leaderboard.ts';

export class ThatGame extends Phaser.Scene {
  // Config
  displayTop: number = 0.25; // Percentage [0-1] are possible too

  // Types
  player: ThatPlayer;
  ground: ThatGround;
  sections: ThatSection[] = [];
  leaderboardText: Text;
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

    // Plays music if wanted
    if (localStorage.getItem("isActive.music") == "true") this.sound.play('gameMusic');

    // Creates player
    this.player = new ThatPlayer(this.scene.scene);
    this.player.setScore(0);
    this.player.setGifts(0);

    // Timer
    this.time.addEvent({
      delay: 100,
      callback: () => {
        this.player.increaseScore(1);
      },
      callbackScope: this,
      loop: true
    });

    //Timer // ToDo muss noch einstellen
    this.time.addEvent({
      delay: 10000,
      callback: () => {
        console.log("Speed") ;
        globalConsts.currentSpeed += 2;
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
      this.cameras.main.centerX, globalConsts.gameHeight * 0.25,
      "Collect the gifts to get extra points!",
      {
        font: "22px " + globalConsts.pixelFont,
        color: "#ffffff",
        fontStyle: "bold"
      }
    ).setOrigin(0.5);

    // Fade-out
    this.tweens.add({
      targets: infoText,
      alpha: 0,
      delay: 2500, // start after 2.5s
      duration: 500 // fade-out-duration
    });

    // Removes text from screen
    this.time.delayedCall(3000, () => infoText.destroy());

    // Creates leaderboard Text
    this.leaderboardText = this.add.text(50, globalConsts.gameHeight * 0.955, "", {
      font: "20px " + globalConsts.pixelFont,
      color: "#ffffff",
    });

    // Fetches leaderboard
    fetchLeaderboard().then();
  }

  // Update
  update(): void {
    // Updates movement
    this.player.updateMovement();

    // Move background
    updateMovement();

    // Checks and moves sections
    this.sections.forEach(section => {
      // Checks if marker is outside
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

  createSection(alpha: number, offset?: number): void {
    const thatSection: ThatSection = new ThatSection(this.scene.scene, alpha == 0, offset);
    this.sections.push(thatSection);
    const obstacles: Sprite[] = [];
    const gift: Sprite = thatSection.gift.sprite;
    for (let obstacle of thatSection.obstacles) if (obstacle.type != obstacleType.GIFT) obstacles.push(obstacle.sprite)
    // collision player and harmful obstacles
    this.physics.add.collider(this.player.sprite, obstacles, () => {
    }, () => this.gameOver());
    // collision player and gift
    if (thatSection.hasGift) this.physics.add.overlap(this.player.sprite, gift, () => {
    }, () => this.collectGift(gift));
  }

  gameOver(): void {
    // Pauses Game so it isn't ticking anymore
    this.game.pause();

    // Should destroy every obstacle
    for (let section of this.sections) {
      section.destroyAll();
    }

    // Saves score
    localStorage.setItem("score", this.player.score.toString())

    // Switch du different scene
    this.scene.start("gameOver");

    // Unpauses game
    this.game.resume();
  }

  // handle gift collecting
  collectGift(gift: Sprite): void {
    gift.destroy();// delete the sprite
    this.player.increaseGifts(1);// increase gifts by 1
    console.log(this.player.getGifts());
  }
}
