/** -----------------------------------
 * 
 *  Space invader
 *  
 ----------------------------------- */


/** -----------------------------------
* 
*  Déclarer les constantes
*  
----------------------------------- */

const windowWidth = 900;
const windowMidWidth = windowWidth / 2;
const windowHeigth = 700;
const spaceshipPlayerHeight = 100;
const spaceshipPlayerWidth = 100;
const spaceshipPlayerVelocity = 5;
const spaceshipPlayerHealthPoint = 3;
const spaceshipOpponnentVelocity = 1;
const spaceshipOpponnentHealthPoint = 1;
const bulletWidth = 25;
const bulletHeight = 25;
const bulletVelocity = 5;
const collisionDamage = -1;
const bulletDamagePlayer = -1;
const bulletDamageBoss = -1;
const scoreOpponnent = 10;
const collisionNotDetected = -1;
const bonusTypeShield = 1;
const timeBeforeUpdate = 10;
const timeBetweenTwoShoot = 400;
const explosionAnimationDuration = 40;
const hudX = 20;
const hudLifeY = 20;
const hudScoreY = 80;
const hudBonusY = 140;

// Charger le canvas
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Créer des tableaux pour les vaisseaux, les tirs, les explosions, les bonus
let bulletListPlayer = [];
let bulletListOpponnent = [];
let explosionList = [];
let opponnentList = [];
let bonusList = [];

/** -----------------------------------
* 
*  Gérer les touches du clavier
*  
----------------------------------- */

// Déclarer les variables pour la gestion des touches
let upPressed = false;
let downPressed = false;
let rightPressed = false;
let leftPressed = false;
let spacePressed = false;

// (nom de l'eventlistener, nom de la fonction appelée, )
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    switch(e.key){
        case "Up":
        case "ArrowUp":
            upPressed = true;
            break;
        case "Down":
        case "ArrowDown":
            downPressed = true;
            break;
        case "Right":
        case "ArrowRight":
            rightPressed = true;
            break;
        case "Left":
        case "ArrowLeft":
            leftPressed = true;
            break;
        case " ":
            spacePressed = true;
            break;
    }
}

function keyUpHandler(e) {
    switch(e.key){
        case "Up":
        case "ArrowUp":
            upPressed = false;
            break;
        case "Down":
        case "ArrowDown":
            downPressed = false;
            break;
        case "Right":
        case "ArrowRight":
            rightPressed = false;
            break;
        case "Left":
        case "ArrowLeft":
            leftPressed = false;
            break;
        case " ":
            spacePressed = false;
            break;
    }
}

/** -----------------------------------
* 
*  Classe Spaceship
*  
----------------------------------- */

class Spaceship {

    constructor(position, spaceshipHeight, spaceshipWidth, healthPoint, picture) {
        this.spaceshipHeight = spaceshipHeight;
        this.spaceshipWidth = spaceshipWidth;
        this.position = position;
        this.healthPoint = healthPoint;
        this.picture = picture;
        this.allowedToShoot = true

        // Abstract class
        if (this.constructor == Spaceship) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    // Afficher l'image du vaisseau
    displaySpaceship() {
        const spaceshipPicture = new Image();
        spaceshipPicture.src = this.picture;
        ctx.drawImage(spaceshipPicture, this.position.x, this.position.y, this.spaceshipHeight, this.spaceshipWidth);
    }

    checkIfDead() {
        if (this.healthPoint <= 0) {
            return true;
        } else {
            return false;
        }
    }

    collisionWithBullet(array) {
        let collision = GameManagement.collision(this, array);
        if (collision > collisionNotDetected) {
            if (array == bulletListOpponnent) {
                if(player.getBonus() == bonusTypeShield){
                    player.setBonus(0);
                }else{
                    player.setHealthPoint(bulletDamageBoss);
                }
                bulletListOpponnent.splice(collision, 1);
            } else if (array == bulletListPlayer) {
                score += scoreOpponnent;
                this.setHealthPoint(bulletDamagePlayer);
                bulletListPlayer.splice(collision, 1);
            }
        }
    }

    // Changer arme

    /**
     * Getter et setter
     * 
     */

    getPosition() {
        return this.position;
    }

    setPosition(newPosition) {
        this.position = newPosition;
    }

    getHeight() {
        return this.spaceshipHeight;
    }

    getWidth() {
        return this.spaceshipWidth;
    }

    getHealthPoint() {
        return this.healthPoint;
    }

    setHealthPoint(newHealthPoint) {
        this.healthPoint = this.healthPoint + newHealthPoint;
    }
}

/** -----------------------------------
 * 
 *  Classe PlayerSpaceship
 *  
 ----------------------------------- */

class PlayerSpaceship extends Spaceship {
    constructor(position, spaceshipHeight, spaceshipWidth, healthPoint, shootType, bonus, picture) {
        super(position, spaceshipHeight, spaceshipWidth, healthPoint, picture);
        this.shootType = shootType;
        this.bonus = bonus;
    }

    move() {
        if (upPressed && this.position.y > 0) {
            this.position = { x: this.position.x, y: this.position.y - spaceshipPlayerVelocity };
        } else if (downPressed && this.position.y < windowHeigth - this.spaceshipHeight) {
            this.position = { x: this.position.x, y: this.position.y + spaceshipPlayerVelocity};
        } else if (rightPressed && this.position.x < windowWidth - spaceshipPlayerWidth) {
            this.position = { x: this.position.x + spaceshipPlayerVelocity, y: this.position.y };
        } else if (leftPressed && this.position.x > 0) {
            this.position = { x: this.position.x - spaceshipPlayerVelocity, y: this.position.y };
        }
    }

    shoot() {
        if (spacePressed && this.allowedToShoot) {
            let bullet = new Bullet({ x: this.position.x + spaceshipPlayerWidth / 2 - bulletWidth / 2, y: this.position.y }, "player");
            bulletListPlayer.push(bullet);
            this.allowedToShoot = false;
            setTimeout(() => {
                this.allowedToShoot = true;
            }, timeBetweenTwoShoot)
        }
    }

    checkCollisionSpaceship() {
        let collision = GameManagement.collision(this, opponnentList);
        if (collision > collisionNotDetected) {
            if (this.bonus == bonusTypeShield) {
                this.bonus = 0;
            } else {
                this.healthPoint += collisionDamage;
            }
            opponnentList[collision].explosion();
            opponnentList.splice(collision, 1);
        }
    }

    checkCollisionWithBonus() {
        let collision = GameManagement.collision(this, bonusList);
        if (collision > collisionNotDetected) {
            this.bonus = bonusList[collision].getBonusType();
            bonusList.splice(collision, 1);
        }
    }

    getBonus() {
        return this.bonus;
    }

    setBonus(newBonus){
        this.bonus = newBonus;
    }
}

/** -----------------------------------
 * 
 *  Classe OpponnentSpaceship
 *  
 ----------------------------------- */

class OpponnentSpaceship extends Spaceship {
    constructor(position, spaceshipHeight, spaceshipWidth, healthPoint, picture) {
        super(position, spaceshipHeight, spaceshipWidth, healthPoint, picture);

        // Abstract class
        if (this.constructor == Spaceship) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    checkIfOffScreen() {
        if (this.position.y > windowHeigth) {
            return true;
        }
    }

    explosion() {
        let explosion = new Explosion(this.position, this.spaceshipHeight, this.spaceshipWidth, "./picture/explosion.png", explosionAnimationDuration);
        explosionList.push(explosion);
    }
}

/** -----------------------------------
 * 
 *  Classe Asteroids
 *  
 ----------------------------------- */

class Asteroids extends OpponnentSpaceship {
    constructor(position, spaceshipHeight, spaceshipWidth, healthPoint, picture) {
        super(position, spaceshipHeight, spaceshipWidth, healthPoint, picture);
    }

    move() {
        this.position = { x: this.position.x, y: this.position.y + 1 };
    }
}

/** -----------------------------------
 * 
 *  Classe BaseSpaceship
 *  
 ----------------------------------- */

class BaseSpaceship extends OpponnentSpaceship {
    constructor(position, spaceshipHeight, spaceshipWidth, healthPoint, picture, direction) {
        super(position, spaceshipHeight, spaceshipWidth, healthPoint, picture);
        this.direction = direction;
    }

    move() {
        if (this.direction == "right" && this.position.x) {
            this.position = { x: this.position.x + spaceshipOpponnentVelocity, y: this.position.y + 0.5 };
        } else {
            this.position = { x: this.position.x - spaceshipOpponnentVelocity, y: this.position.y + 0.5 };
        }
    }

    switchDirection() {
        if (this.position.x > windowWidth - this.spaceshipWidth) {
            this.direction = "left";
        } else if (this.position.x < 0) {
            this.direction = "right";
        }
    }
}

/** -----------------------------------
 * 
 *  Classe BossSpaceship
 *  
 ----------------------------------- */

class BossSpaceship extends OpponnentSpaceship {
    constructor(position, spaceshipHeight, spaceshipWidth, healthPoint, picture, direction) {
        super(position, spaceshipHeight, spaceshipWidth, healthPoint, picture);
        this.direction = direction;
    }

    move() {
        if (this.direction == "right" && this.position.x) {
            this.position = { x: this.position.x + spaceshipOpponnentVelocity, y: this.position.y };
        } else {
            this.position = { x: this.position.x - spaceshipOpponnentVelocity, y: this.position.y };
        }
    }

    switchDirection() {
        if (this.position.x > windowWidth - this.spaceshipWidth) {
            this.direction = "left";
        } else if (this.position.x < 0) {
            this.direction = "right";
        }
    }

    shoot() {
        if (this.allowedToShoot) {
            let bullet = new Bullet({ x: this.position.x + spaceshipPlayerWidth / 2 - bulletWidth / 2, y: this.position.y }, "opponnent");
            bulletListOpponnent.push(bullet);
            this.allowedToShoot = false;
            setTimeout(() => {
                this.allowedToShoot = true;
            }, timeBetweenTwoShoot * 5)
        }
    }
}

/** -----------------------------------
 * 
 *  Classe bullet
 *  
 ----------------------------------- */

class Bullet {
    constructor(bulletPosition, shooter) {
        this.bulletPosition = bulletPosition;
        this.shooter = shooter;
    }

    displayBullet() {
        let bullet = new Image();
        if (this.shooter == "player") {
            bullet.src = "./picture/bulletPlayer.png";
        } else if (this.shooter == "opponnent") {
            bullet.src = "./picture/bulletOpponnent.png";
        }
        ctx.drawImage(bullet, this.bulletPosition.x, this.bulletPosition.y, bulletWidth, bulletHeight);
    }

    moveBullet() {
        if (this.shooter == "player") {
            this.bulletPosition = { x: this.bulletPosition.x, y: this.bulletPosition.y - bulletVelocity };
        } else if (this.shooter == "opponnent") {
            this.bulletPosition = { x: this.bulletPosition.x, y: this.bulletPosition.y + bulletVelocity };
        }
    }

    checkIfBulletOffScreen() {
        if (this.bulletPosition.y > windowHeigth || this.bulletPosition.y < 0) {
            return true;
        }
    }

    getPosition() {
        return this.bulletPosition;
    }

    getHeight() {
        return bulletHeight;
    }

    getWidth() {
        return bulletWidth;
    }
}

/** -----------------------------------
 * 
 *  Classe Explosion
 *  
 ----------------------------------- */

class Explosion {
    constructor(position, heigth, width, picture, animationMaxDuration) {
        this.position = position;
        this.heigth = heigth;
        this.width = width;
        this.picture = picture;
        this.animationDuration = 0;
        this.animationMaxDuration = animationMaxDuration;
    }

    displayExplosion() {
        let explosionPicture = new Image();
        explosionPicture.src = "./picture/explosion.png";
        ctx.drawImage(explosionPicture, this.position.x, this.position.y, this.width, this.heigth);
    }

    nextAnimationStep(number) {
        this.animationDuration += number;
    }

    checkAnimationDuration() {
        if (this.animationDuration >= this.animationMaxDuration) {
            return true;
        }
    }
}

/** -----------------------------------
 * 
 *  Classe Bonus
 *  
 ----------------------------------- */

class Bonus {
    constructor(position, type, height, width, picture) {
        this.position = position;
        this.type = type;
        this.height = height;
        this.width = width;
        this.picture = picture;
    }

    displayBonus() {
        let bonusPicture = new Image();
        bonusPicture.src = this.picture;
        ctx.drawImage(bonusPicture, this.position.x, this.position.y, this.height, this.width);
    }

    move() {
        this.position = { x: this.position.x, y: this.position.y + 1 };
    }

    bonusIsOffScreen() {
        if (this.position.y > windowHeigth) {
            return true;
        }
    }

    getPosition() {
        return this.position;
    }

    getHeight() {
        return this.height;
    }

    getWidth() {
        return this.width;
    }

    setPosition(newPosition) {
        this.position = newPosition;
    }

    getBonusType() {
        return this.type;
    }
}

/** -----------------------------------
 * 
 *  Classe background
 *  
 ----------------------------------- */

class Background {
    constructor(number, position) {
        this.number = number;
        this.backgroundPicture = new Image();
        this.backgroundPicture.src = './picture/background.png';
        this.position = position;
    }

    display() {
        ctx.drawImage(this.backgroundPicture, this.position.x, this.position.y, windowWidth, windowHeigth);
    }

    move() {
        this.position = { x: this.position.x, y: this.position.y + 5 };
        if (this.number == 1 && this.position.y > windowHeigth) {
            this.position = { x: 0, y: 0 };
        } else if (this.number == 2 && this.position.y > 0) {
            this.position = { x: 0, y: - windowHeigth };
        }
    }
}

/** -----------------------------------
 * 
 *  Classe HUD
 *  
 ----------------------------------- */

class HUD {
    constructor(fontColor) {
        this.fontColor = fontColor;
    }

    display() {
        ctx.fillStyle = this.fontColor;
        ctx.font = '30px Sans-Serif';
        ctx.textBaseline = 'top';
        // Mettre sous forme de constante les positions
        ctx.fillText("Life : " + player.getHealthPoint(), hudX, hudLifeY);
        ctx.fillText("Score : " + score, hudX, hudScoreY);
        ctx.fillText("Bonus : " + player.getBonus(), hudX, hudBonusY);
    }
}

/** -----------------------------------
 * 
 *  Classe GameManagement
 *  
 ----------------------------------- */

class GameManagement {
    static game_initialization() {
        player = new PlayerSpaceship({ x: windowMidWidth - spaceshipPlayerHeight / 2, y: windowHeigth - spaceshipPlayerWidth }, spaceshipPlayerHeight, spaceshipPlayerWidth, spaceshipPlayerHealthPoint, 0, 0, "./picture/player.png");
        back = new Background(1, { x: 0, y: 0 });
        back2 = new Background(2, { x: 0, y: - windowHeigth });
        hud = new HUD('#00F');
        score = 0;
        bulletListPlayer = [];
        bulletListOpponnent = [];
        opponnentList = [];
        explosionList = [];
    }

    static addOpponnent() {
        if (newOpponnentAllowed == true) {
            let newOP = new BaseSpaceship({ x: GameManagement.getRandomNumber(0, 800), y: 0 }, spaceshipPlayerHeight, spaceshipPlayerWidth, spaceshipOpponnentHealthPoint, "./picture/opponnent.png", "left");
            let asteroid = new Asteroids({ x: GameManagement.getRandomNumber(0, 800), y: 0 }, spaceshipPlayerHeight, spaceshipPlayerWidth, spaceshipOpponnentHealthPoint, "./picture/asteroid.png")
            let newBoss = new BossSpaceship({ x: GameManagement.getRandomNumber(0, 800), y: 0 }, spaceshipPlayerHeight, spaceshipPlayerWidth, spaceshipOpponnentHealthPoint, "./picture/boss.png", "left");
            let bonus = new Bonus({ x: GameManagement.getRandomNumber(0, 800), y: 0 }, bonusTypeShield, 100, 100, "./picture/bonus.png");
            opponnentList.push(newOP);
            opponnentList.push(asteroid);
            opponnentList.push(newBoss);
            bonusList.push(bonus);
            newOpponnentAllowed = false;
            setTimeout(
                newOpponnentAllowed = true,
                9000
            );
        }
    }

    static getRandomNumber(min, max) {
        return Math.random() * (max - min) + min;
    }

    /**
     * Elements pour gérer les collisions
     * @param {*} a (vaisseaux joueur ou de l'adversaire)
     * @param {*} array  tableau avec tous les éléments B
     */
    static collision(a, array) {
        let currentIndexNumber = -1;
        let positionA = a.getPosition();
        let heigthA = a.getHeight();
        let widthA = a.getWidth();
        for (let i = 0; i < array.length; i++) {
            let positionB = array[i].getPosition();
            let heigthB = array[i].getHeight();
            let widthB = array[i].getWidth();
            if (positionA.x + widthA >= positionB.x &&
                positionB.x + widthB >= positionA.x &&
                positionA.y + heigthA >= positionB.y &&
                positionB.y + heigthB >= positionA.y) {
                currentIndexNumber = i;
            }
        }
        return currentIndexNumber;
    }

    static bulletManagement(array) {
        for (let i = 0; i < array.length; i++) {
            array[i].displayBullet();
            array[i].moveBullet();
            if (array[i].checkIfBulletOffScreen()) {
                array.splice(i, 1);
            }
        }
    }
}

/** -----------------------------------
 * 
 *  Initialiser la partie
 *  
 ----------------------------------- */

let player = new PlayerSpaceship({ x: windowMidWidth - spaceshipPlayerHeight / 2, y: windowHeigth - spaceshipPlayerWidth }, spaceshipPlayerHeight, spaceshipPlayerWidth, spaceshipPlayerHealthPoint, 0, 0, "./picture/player.png");
let back = new Background(1, { x: 0, y: 0 });
let back2 = new Background(2, { x: 0, y: - windowHeigth });
let hud = new HUD('#00F');
let score = 0;
let newOpponnentAllowed = true;

/**
 * Fonction pour mise à jour de l'écran et gestions des actions
 * 
 */
function gameLoop() {
    // Effacer l'affichage précédant
    ctx.clearRect(0, 0, windowWidth, windowHeigth);
    // Background
    back.display();
    back2.display();
    back.move();
    back2.move();
    // PlayerSpaceship
    player.displaySpaceship();
    player.move();
    player.shoot();
    player.checkCollisionSpaceship();
    player.collisionWithBullet(bulletListOpponnent);
    player.checkCollisionWithBonus();
    if (player.getHealthPoint() < 1) {
        GameManagement.game_initialization();
    }

    // Afficher les adversaires
    for (let i = 0; i < opponnentList.length; i++) {
        opponnentList[i].displaySpaceship();
        opponnentList[i].move();
        opponnentList[i].collisionWithBullet(bulletListPlayer);
        if (opponnentList[i] instanceof BossSpaceship || opponnentList[i] instanceof BaseSpaceship) {
            opponnentList[i].switchDirection();
        }
        if (opponnentList[i] instanceof BossSpaceship) {
            opponnentList[i].shoot();
        }

        // Vérifier si les adversaires sont toujours vivants (ou hors de l'écran)
        if (opponnentList[i].checkIfOffScreen() || opponnentList[i].checkIfDead()) {
            opponnentList[i].explosion();
            opponnentList.splice(i, 1);
        }
    }

    if (opponnentList.length == 0) {
        GameManagement.addOpponnent();
    }

    // Afficher et gérer les munitions des adversaires et du joueur
    GameManagement.bulletManagement(bulletListOpponnent);
    GameManagement.bulletManagement(bulletListPlayer);

    // Afficher les explosions
    for (let i = 0; i < explosionList.length; i++) {
        explosionList[i].displayExplosion();
        explosionList[i].nextAnimationStep(1);
        if (explosionList[i].checkAnimationDuration()) {
            explosionList.splice(i, 1);
        }
    }

    // Afficher les bonus
    for (let i = 0; i < bonusList.length; i++) {
        bonusList[i].displayBonus();
        bonusList[i].move();
        if (bonusList[i].bonusIsOffScreen()) {
            bonusList.splice(i, 1);
        }
    }

    hud.display();
}

// Mettre à jour l'affichage
setInterval(gameLoop, timeBeforeUpdate);