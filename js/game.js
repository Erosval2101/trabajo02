var config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 800,
  heigth: 600,
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: {
    preload,
    create,
    update,
  },
  physics: {
    default: 'arcade',
    arcade: {
    },
  }
};

const game = new Phaser.Game(config);
let gameStarted = false;
let platform;
let ball;
let bricks;
let violetBricks
let blueBricks;
let yellowBricks;
let redBricks;
let greenBricks;
let lives = 3;
let livesText;
let introText;
let gameOverText;
let winText;
let backgroundSound;
let hitSound;
let victorySound;
let loseSound;



function preload ()
{
    this.load.image('background', 'assets/background.png');
    this.load.image('platform', 'assets/paddle.png');
    this.load.image('brick0', 'assets/brick0.png');
    this.load.image('brick1', 'assets/brick1.png');
    this.load.image('brick2', 'assets/brick2.png');
    this.load.image('brick3', 'assets/brick3.png');
    this.load.image('brick4', 'assets/brick4.png');
    this.load.image('ball', 'assets/ball.png');

    this.load.audio('background_sound', 'assets/sounds/background_sound.wav');
    this.load.audio('hit_sound', 'assets/sounds/hit_sound_effect.mp3');
    this.load.audio('victory_sound', 'assets/sounds/victory_sound_effect.mp3');
    this.load.audio('lose_sound', 'assets/sounds/lose_sound_effect.mp3');
}

function create ()
{
    this.physics.world.setBoundsCollision(true, true, true, false);

    this.add.image(500, 400, 'background');

    livesText = this.add.text(10, 10, '', {
        fontSize: '20px',
        fill: '#FFFF'
    }).setDepth(0.1);
    livesInScreen();

    backgroundSound = this.sound.add('background_sound', {
        volume: 0.15,
        loop: true
    });
    hitSound = this.sound.add('hit_sound');

    backgroundSound.play();

    victorySound = this.sound.add('victory_sound', {
        volume: 0.15,
    });

    loseSound = this.sound.add('lose_sound', {
        volume: 0.15,
    });

    violetBricks = this.physics.add.group({
        key: 'brick0',
        repeat: 9,
        immovable: true,
        setScale: { x: 1.3, y: 1.3},
        setXY: {
        x: 80,
        y: 300,
        stepX: 70
        }
    });

    yellowBricks = this.physics.add.group({
        key: 'brick1',
        repeat: 9,
        immovable: true,
        setScale: { x: 1.3, y: 1.3},
        setXY: {
        x: 80,
        y: 250,
        stepX: 70
        }
    });

    redBricks = this.physics.add.group({
        key: 'brick2',
        repeat: 9,
        immovable: true,
        setScale: { x: 1.3, y: 1.3},
        setXY: {
        x: 80,
        y: 200,
        stepX: 70
        }
    });

    blueBricks = this.physics.add.group({
        key: 'brick3',
        repeat: 9,
        immovable: true,
        setScale: { x: 1.3, y: 1.3},
        setXY: {
        x: 80,
        y: 150,
        stepX: 70
        }
    });

    greenBricks = this.physics.add.group({
        key: 'brick4',
        repeat: 9,
        immovable: true,
        setScale: { x: 1.3, y: 1.3},
        setXY: {
        x: 80,
        y: 100,
        stepX: 70
        }
    });

    ball = this.physics.add.image(400, 680, 'ball').setCollideWorldBounds(true).setBounce(1);
    ball.setData('onPaddle', true);

    platform = this.physics.add.image(400, 700, 'platform').setImmovable();
    platform.setScale(1.7);

    this.physics.add.collider(ball, violetBricks, hitBrick, null, this);
    this.physics.add.collider(ball, yellowBricks, hitBrick, null, this);
    this.physics.add.collider(ball, redBricks, hitBrick, null, this);
    this.physics.add.collider(ball, blueBricks, hitBrick, null, this);
    this.physics.add.collider(ball, greenBricks, hitBrick, null, this);

    this.physics.add.collider(ball, platform, hitPlatform, null, this);

    introText = this.add.text(
        this.physics.world.bounds.width / 2,
        this.physics.world.bounds.height / 2,
        'Press Click to Play',
        {
            fontSize: '50px',
            fill: '#fff'
        },
    );
    introText.setOrigin(0.5);

    gameOverText = this.add.text(
        this.physics.world.bounds.width / 2,
        this.physics.world.bounds.height / 2,
        'You lost. Game Over',
        {
            fontSize: '50px',
            fill: '#fff'
        },
    );
    gameOverText.setOrigin(0.5);
    gameOverText.setVisible(false);

    winText = this.add.text(
        this.physics.world.bounds.width / 2,
        this.physics.world.bounds.height / 2,
        'You won. Congratulations!',
        {
            fontSize: '50px',
            fill: '#fff'
        },
    );
    winText.setOrigin(0.5);
    winText.setVisible(false);

    this.input.on('pointermove', function (pointer) {
        platform.x = Phaser.Math.Clamp(pointer.x, 52, 748);

        if (ball.getData('onPaddle'))
        {
            ball.x = platform.x;
        }

    }, this);

    this.input.on('pointerup', function (pointer) {
        if (ball.getData('onPaddle'))
        {
            ball.setVelocity(-75, -300);
            ball.setData('onPaddle', false);
        }

    }, this);

    this.input.on('pointerdown', function (pointer) {
        introText.setVisible(false);
    }, this);
}

function update ()
{
    if(lives === 0){
        backgroundSound.stop();
        loseSound.play();
        gameOverText.setVisible(true);
        this.input.on('pointerdown', function (pointer) {
            gameOverText.setVisible(false);
            loseSound.stop();
            backgroundSound.play();
        }, this);
        resetLevel();
    }
    if (isGameOver(this.physics.world))
        {
            ball.setVelocity(0);
            ball.setPosition(platform.x, 675);
            ball.setData('onPaddle', true);
            lives--;
            livesInScreen();
        }
    else if (isWon()){
        backgroundSound.stop();
        victorySound.play();
        winText.setVisible(true);
        this.input.on('pointerdown', function (pointer) {
            winText.setVisible(false);
            victorySound.stop();
            backgroundSound.play();
        }, this);
        resetLevel();
    }
}

function livesInScreen()
{
    livesText.setText('Lives: ' + lives);
}


function hitBrick(ball, brick) {
    hitSound.play();
    brick.disableBody(true, true);

    if (ball.body.velocity.x == 0) {
        randNum = Math.random();
        if (randNum >= 0.5) {
            ball.body.setVelocityX(150);
        } else {
            ball.body.setVelocityX(-150);
        }
    }
}


function resetLevel()
{
    lives = 3;
    livesInScreen();
    ball.setVelocity(0);
    ball.setPosition(platform.x, 675);
    ball.setData('onPaddle', true);

    violetBricks.children.each(function (brick) {
        brick.enableBody(false, 0, 0, true, true);
    });

    yellowBricks.children.each(function (brick) {
        brick.enableBody(false, 0, 0, true, true);
    });

    redBricks.children.each(function (brick) {
        brick.enableBody(false, 0, 0, true, true);
    });

    blueBricks.children.each(function (brick) {
        brick.enableBody(false, 0, 0, true, true);
    });

    greenBricks.children.each(function (brick) {
        brick.enableBody(false, 0, 0, true, true);
    });

}

function hitPlatform(ball, platform)
{
    var diff = 0;
    if (ball.x < platform.x)
    {   
        diff = platform.x - ball.x;
        ball.setVelocityX(-10 * diff);
    }
    else if (ball.x > platform.x)
    {
        diff = ball.x -platform.x;
        ball.setVelocityX(10 * diff);
    }
    else
    {
        ball.setVelocityX(2 + Math.random() * 8);
    }
}

function isGameOver(world) {
  return ball.body.y > 800;
}

function isWon() {
  return violetBricks.countActive() + blueBricks.countActive() + yellowBricks.countActive() + redBricks.countActive() + greenBricks.countActive() === 0;
}