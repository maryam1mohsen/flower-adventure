var canvas = document.querySelector("canvas");
var drawingSurface = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas, false);
resizeCanvas();

var spriteObject = {
    x: 0,
    y: 0,
    width: 64,
    height: 64
};

var char = Object.create(spriteObject);
char.x = 100;
char.y = 100;

var flowers = [];
for (var i = 0; i < 10; i++) {
    flowers.push({
        x: Math.random() * (canvas.width - 40),
        y: Math.random() * (canvas.height - 40),
        width: 40,
        height: 40
    });
}

var cacti = [
    { x: 300, y: 75, width: 32, height: 50 },
    { x: 600, y: 175, width: 32, height: 50 },
    { x: 150, y: 275, width: 32, height: 50 }
];

var flowerImage = new Image();
flowerImage.src = "flower.png";

var cactusImage = new Image();
cactusImage.src = "cactus.png";

var charImage = new Image();
charImage.addEventListener("load", loadHandler, false);
charImage.src = "char.png";

var Xspeed = 0;
var Yspeed = 0;
var moveLeft = false;
var moveRight = false;
var moveUp = false;
var moveDown = false;

var lives = 3;
var flowersCollected = 0;
var cactusCollision = false;

window.addEventListener("keydown", function(e) {
    switch(e.key) {
        case "ArrowUp":
            moveUp = true;
            break;
        case "ArrowDown":
            moveDown = true;
            break;
        case "ArrowLeft":
            moveLeft = true;
            break;
        case "ArrowRight":
            moveRight = true;
            break;
    }
}, false);

window.addEventListener("keyup", function(e) {
    switch(e.key) {
        case "ArrowUp":
            moveUp = false;
            break;
        case "ArrowDown":
            moveDown = false;
            break;
        case "ArrowLeft":
            moveLeft = false;
            break;
        case "ArrowRight":
            moveRight = false;
            break;
    }
}, false);

function loadHandler() {
    update();
}

function update() {
    window.requestAnimationFrame(update, canvas);
    
    char.x += Xspeed;
    char.y += Yspeed;
    
    if (moveUp && !moveDown) {
        Yspeed = -5;
    }
    if (moveDown && !moveUp) {
        Yspeed = 5;
    }
    if (moveLeft && !moveRight) {
        Xspeed = -5;
    }
    if (moveRight && !moveLeft) {
        Xspeed = 5;
    }
    if (!moveUp && !moveDown) {
        Yspeed = 0;
    }
    if (!moveLeft && !moveRight) {
        Xspeed = 0;
    }
    
    if (char.x < 0) {
        char.x = 0;
    }
    if (char.y < 0) {
        char.y = 0;
    }
    if (char.x + char.width > canvas.width) {
        char.x = canvas.width - char.width;
    }
    if (char.y + char.height > canvas.height) {
        char.y = canvas.height - char.height;
    }

    flowers = flowers.filter(flower => {
        if (collidesWith(char, flower)) {
            flowersCollected++;
            document.getElementById('flowers').textContent = flowersCollected + "/10";
            return false;
        }
        return true;
    });

    cactusCollision = false;
    cacti.forEach(cactus => {
        if (collidesWith(char, cactus)) {
            cactusCollision = true;
        }
    });

    if (cactusCollision && !char.isInvincible) {
        lives--;
        document.getElementById('hearts').textContent = lives;
        char.isInvincible = true;
        setTimeout(() => {
            char.isInvincible = false;
        }, 1000);

        if (lives <= 0) {
            window.location.href = 'youlose.html';
        }
    }

    if (flowersCollected === 10) {
        window.location.href = 'youwin.html';
    }
    
    render();
}

function render() {
    drawingSurface.clearRect(0, 0, canvas.width, canvas.height);
    drawingSurface.drawImage(charImage, Math.floor(char.x), Math.floor(char.y), char.width, char.height);
    
    flowers.forEach(flower => {
        drawingSurface.drawImage(flowerImage, Math.floor(flower.x), Math.floor(flower.y), flower.width, flower.height);
    });

    cacti.forEach(cactus => {
        drawingSurface.drawImage(cactusImage, Math.floor(cactus.x), Math.floor(cactus.y), cactus.width, cactus.height);
    });
}

function collidesWith(sprite1, sprite2) {
    return !(sprite1.x + sprite1.width < sprite2.x ||
             sprite1.y + sprite1.height < sprite2.y ||
             sprite1.x > sprite2.x + sprite2.width ||
             sprite1.y > sprite2.y + sprite2.height);
}

function resetGame() {
    flowersCollected = 0;
    document.getElementById('flowers').textContent = flowersCollected + "/10";
    lives = 3;
    document.getElementById('hearts').textContent = lives;
    char.x = 100;
    char.y = 100;
}
