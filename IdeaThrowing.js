import Phaser, { Physics, Scene } from 'phaser';
import './style.css';

// This determins the size of the screen it's at 
const sizes = {
    width: 700,
    height: 700,
};

// Everything will have a base speed of this 
const speed = 155;

// Create the scene, with backgrond and actors 
class GameScene extends Phaser.Scene {
    constructor() {
        super('scene-game')
        this.player 
        this.cursor
        this.playerSpeed = speed; 
        this.enemies
        this.projectile 
        this.bullets = null
        this.bgMusic
    }

    preload() {
        // Load background image
        this.load.image('bg', '/assets/JOPK_Level_1_1.png')
        this.load.audio('bgMusic', '/assets/Stage 1[Music].mp3')
        // Load the player sprites 
        this.load.image('player-down', '/assets/Cowboy-down.png')
        this.load.image('player-up', '/assets/Cowboy-up.png')
        this.load.image('player-left', '/assets/Cowboy-left.png')
        this.load.image('player-right', '/assets/Cowboy-right.png')
        // Load enemy sprites 
        this.load.image('enemy','/assets/Enemy.png')
        // Load the sprite of the bullet
        this.load.image('bullet', '/assets/Bullet-1.png.png')
    }

    create() {
        // Add background image
        this.add.image(0, 0, 'bg').setOrigin(0,0).setScale(2.75)

        const worldWidth = 550;
        const worldHeight = 550; 
        const CenterX = (sizes.width-worldWidth)/2;
        const CenterY = (sizes.height-worldHeight)/2;

        this.physics.world.setBounds(CenterX, CenterY,worldHeight,worldWidth)
         
        this.bgMusic = this.sound.add("bgMusic", {
            volume: 0.2
        })
        this.bgMusic.play()
        // Load player into scene 
        this.player = this.physics.add
        .image(370,370,'player-down')
        .setOrigin(0.5,0.5).setScale(3)
        this.player.setImmovable(true)
        this.player.body.allowGravity = false
        this.cursor = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.player.setCollideWorldBounds(true)

        // Adds bullets to the game 
        this.bullets = this.physics.add.group()

        // This is to load the enemy/enemies 
        this.enemies = this.physics.add.group()

        //Controls the rate of spawning enemies 
        // the ends of which are the spawn locations 
        this.time.addEvent({
            delay: 3000,
            callback:() => this.spawnEnemy(700,330),
            callbackScope: this, 
            loop:true 
        });
        this.time.addEvent({
            delay: 4000,
            callback:() => this.spawnEnemy(10,330),
            callbackScope: this, 
            loop:true 
        });
        this.time.addEvent({
            delay: 3000,
            callback:() => this.spawnEnemy(350,10),
            callbackScope: this, 
            loop:true 
        });
        this.time.addEvent({
            delay: 4000,
            callback:() => this.spawnEnemy(370,700),
            callbackScope: this, 
            loop:true 
        });
        // Method to detect if enemies are hit by the bullet and what action to take 
        this.physics.add.collider(this.enemies, this.bullets, this.hitEnemy, null, this)
    }

    update() {
        // Player controls and sprite changes when needed 
        const { left, right, up, down, space} = this.cursor;
        if (left.isDown) {
            this.player.setVelocityX(-this.playerSpeed);
            this.player.setTexture('player-left');
        } else if (right.isDown) {
            this.player.setVelocityX(this.playerSpeed);
            this.player.setTexture('player-right');
        } else if (up.isDown) {
            this.player.setVelocityY(-this.playerSpeed);
            this.player.setTexture('player-up');
        } else if (down.isDown) {
            this.player.setVelocityY(this.playerSpeed);
            this.player.setTexture('player-down');
        } else {
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
        }
        // Shooting bullets
        if(Phaser.Input.Keyboard.JustDown(this.spacebar)){
            this.shootBullet()
        }
        // Enemy behavior 
        this.enemies.getChildren().forEach((enemy) => {
            this.physics.moveToObject(enemy, this.player, this.playerSpeed);
        });
    }

    shootBullet() {
        // Load in the bullet at the players location
        const bullet = this.bullets.get(this.player.x, this.player.y, 'bullet');
        if (bullet) {
            bullet.setActive(true).setVisible(true);
            bullet.setScale(1);
            bullet.body.setVelocity(0);
    
            if (this.player.texture.key === 'player-left') {
                bullet.setVelocityX(-300);
            } else if (this.player.texture.key === 'player-right') {
                bullet.setVelocityX(300);
            } else if (this.player.texture.key === 'player-up') {
                bullet.setVelocityY(-300);
            } else if (this.player.texture.key === 'player-down') {
                bullet.setVelocityY(300);
            }
        }
    }
    
    

    hitEnemy(bullet, enemy) {
        if (bullet) bullet.destroy();
        if (enemy) enemy.destroy();
    }
    spawnEnemy(x, y) {
        const enemy = this.enemies.create(x, y, 'enemy')
            .setOrigin(0.5, 0.5)
            .setScale(3);
        enemy.setCollideWorldBounds(false);
    }
}

// Phaser game configuration
const config = {
    type: Phaser.WEBGL,
    width: sizes.width,
    height: sizes.height,
    canvas: gameCanvas,
    physics:{
        default: 'arcade',
        arcade:{
            debug: true,
        }
    }, scene:[GameScene]
};

// Initialize the game
const game = new Phaser.Game(config);
