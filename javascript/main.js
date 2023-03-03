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
const timeBeforeUpdate = 10;
const timeBetweenTwoShoot = 200;

// Charger le canvas
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Créer des tableaux pour les vaisseaux et les tirs
let bulletList = [];
let opponnentList = [];

/** -----------------------------------
* 
*  Gérer les touches du clavier
*  
----------------------------------- */

// Déclarer les variables pour la gestion des touches
let rightPressed = false;
let leftPressed = false;
let spacePressed = false;

// (nom de l'eventlistener, nom de la fonction appelée, )
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    } else if (e.key == " ") {
        spacePressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    } else if (e.key == " ") {
        spacePressed = false;
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
    }

    // Afficher l'image du vaisseau
    displaySpaceship() {
        const spaceshipPicture = new Image();
        spaceshipPicture.src = this.picture;
        ctx.drawImage(spaceshipPicture, this.position.x, this.position.y, this.spaceshipHeight, this.spaceshipWidth);

        // Si le vaisseau n'a plus de points de vie afficher une explosion à la place
        // Changer la taille de l'image d'explosion
    }

    checkIfAlive() {
        if (this.position.y > windowHeigth || this.healthPoint < 1) {
            return true;
        }
    }

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

    getSpaceshipHeight() {
        return this.spaceshipHeight;
    }

    getSpaceshipWidth() {
        return this.spaceshipWidth;
    }

    getHealthPoint() {
        return this.healthPoint;
    }

    setHealthPoint(newHealthPoint) {
        this.healthPoint = this.healthPoint + newHealthPoint;
    }

    // Changer arme
}

/** -----------------------------------
 * 
 *  Classe PlayerSpaceship
 *  
 ----------------------------------- */

class PlayerSpaceship extends Spaceship {
    constructor(position, spaceshipHeight, spaceshipWidth, healthPoint, picture) {
        super(position, spaceshipHeight, spaceshipWidth, healthPoint, picture);
    }

    move() {
        if (rightPressed && this.position.x < windowWidth - spaceshipPlayerWidth) {
            this.position = { x: this.position.x + spaceshipPlayerVelocity, y: this.position.y };
        } else if (leftPressed && this.position.x > 0) {
            this.position = { x: this.position.x - spaceshipPlayerVelocity, y: this.position.y };
        }
    }

    shoot() {
        if (spacePressed && this.allowedToShoot) {
            let bullet = new Bullet(this.position, "player");
            bulletList.push(bullet);
            this.allowedToShoot = false;
            setTimeout(() => {
                this.allowedToShoot = true;
            }, timeBetweenTwoShoot)
        }
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
    }

    move() {
        this.position = { x: this.position.x, y: this.position.y + spaceshipOpponnentVelocity };
    }
}

/** -----------------------------------
 * 
 *  Classe BossSpaceship
 *  
 ----------------------------------- */

class BossSpaceship extends Spaceship {
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
            let bullet = new Bullet(this.position, "opponnent");
            bulletList.push(bullet);
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
    constructor(bulletPosition, character) {
        this.bulletPosition = bulletPosition;
        this.character = character;
    }

    displayBullet() {
        if (this.character == "player") {
            ctx.beginPath();
            ctx.arc(this.bulletPosition.x + spaceshipPlayerWidth / 2, this.bulletPosition.y, 10, 0, Math.PI * 2);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
        } else if (this.character == "opponnent") {
            ctx.beginPath();
            ctx.arc(this.bulletPosition.x + spaceshipPlayerWidth / 2, this.bulletPosition.y, 10, 0, Math.PI * 2);
            ctx.fillStyle = "#ff0000";
            ctx.fill();
            ctx.closePath();
        }
    }

    moveBullet() {
        if (this.character == "player") {
            this.bulletPosition = { x: this.bulletPosition.x, y: this.bulletPosition.y - 5 };
        } else if (this.character == "opponnent") {
            this.bulletPosition = { x: this.bulletPosition.x, y: this.bulletPosition.y + 5 };
        }
    }

    destroyBullet() {
        if (this.bulletPosition.y > windowHeigth && this.bulletPosition.y < 0) {
            return true;
        }
    }

    collisionWithOpponnent() {
        if (this.character == "player") {
            for (let i = 0; i < opponnentList.length; i++) {
                opponnentList[i].getPosition();
                if (this.bulletPosition.x + spaceshipPlayerWidth / 2 >= opponnentList[i].getPosition().x &&
                    this.bulletPosition.x <= opponnentList[i].getPosition().x + spaceshipPlayerWidth) {
                    if (this.bulletPosition.y >= opponnentList[i].getPosition().y && this.bulletPosition.y <= opponnentList[i].getPosition().y + spaceshipPlayerHeight) {
                        opponnentList[i].setHealthPoint(-1);
                        score += 10;
                        return true;
                    }
                }
            }
        }
    }

    collisionWithplayer() {
        if (this.character == "opponnent") {
            for (let i = 0; i < opponnentList.length; i++) {
                player.getPosition();
                if (this.bulletPosition.x + spaceshipPlayerWidth / 2 >= player.getPosition().x &&
                    this.bulletPosition.x <= player.getPosition().x + spaceshipPlayerWidth) {
                    if (this.bulletPosition.y >= player.getPosition().y && this.bulletPosition.y <= player.getPosition().y + spaceshipPlayerHeight) {
                        player.setHealthPoint(-1);
                        return true;
                    }
                }
            }
        }
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
        ctx.fillText("Life : " + player.getHealthPoint(), 20, 20);
        ctx.fillText("Score : " + score, 20, 80);
    }
}

/** -----------------------------------
 * 
 *  Classe GameManagement
 *  
 ----------------------------------- */

class GameManagement {
    static game_initialization() {
        console.log("reset");
        player = new PlayerSpaceship({ x: windowMidWidth - spaceshipPlayerHeight / 2, y: windowHeigth - spaceshipPlayerWidth }, spaceshipPlayerHeight, spaceshipPlayerWidth, spaceshipPlayerHealthPoint, "./picture/player.png");
        back = new Background(1, { x: 0, y: 0 });
        back2 = new Background(2, { x: 0, y: - windowHeigth });
        hud = new HUD('#00F');
        score = 0;
        bulletList = [];
        opponnentList = [];
    }

    static addOpponnent() {
        if (newOpponnentAllowed == true) {

            let newOP = new OpponnentSpaceship({ x: GameManagement.getRandomNumber(0, 800), y: 0 }, spaceshipPlayerHeight, spaceshipPlayerWidth, spaceshipOpponnentHealthPoint, "./picture/opponnent.png");
            let newBoss = new BossSpaceship({ x: GameManagement.getRandomNumber(0, 800), y: 0 }, spaceshipPlayerHeight, spaceshipPlayerWidth, spaceshipOpponnentHealthPoint, "./picture/boss.png", "left");
            opponnentList.push(newOP);
            opponnentList.push(newBoss);
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
     * Elements pour gérer les collissions
     * @param {*} a (vaisseaux joueur ou de l'adversaire)
     * @param {*} array  tableau avec tous les éléments B
     */
    static collision(a, array) {
        let positionA = a.getPosition();
        let heigthA = a.getSpaceshipHeight();
        let widthA = a.getSpaceshipWidth();
        for (let i = 0; i < array.length; i++) {
            let positionB = array[i].getPosition();
            let heigthB = array[i].getSpaceshipHeight();
            let widthB = array[i].getSpaceshipWidth();
            // Regarder s'il y a une collision sur l'axe x
            if (positionA.x <= positionB.x && positionB.x <= positionA.x + widthA || positionA.x <= positionB.x && positionB.x + widthB <= positionA.x + widthA) {
                console.log("C'est bon pour l'axe X");
                // regarder s'il y a une collision sur l'axe des y
                if (positionA.y <= positionB.y && positionA.y <= positionA.y + heigthA || positionA.y <= positionB.y + heigthB && positionA.y <= positionA.y + heigthA) {
                    console.log("c'est bon pour l'axe Y");
                    a.setHealthPoint(-1);
                    array.splice(i, 1);
                }
            }
        }
    }
}

/** -----------------------------------
 * 
 *  Initialiser la partie
 *  
 ----------------------------------- */

let player = new PlayerSpaceship({ x: windowMidWidth - spaceshipPlayerHeight / 2, y: windowHeigth - spaceshipPlayerWidth }, spaceshipPlayerHeight, spaceshipPlayerWidth, spaceshipPlayerHealthPoint, "./picture/player.png");
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



    //test de collission 
    GameManagement.collision(player, opponnentList);





    if (player.getHealthPoint() < 1) {
        GameManagement.game_initialization();
    }

    // Afficher les adversaires
    for (let i = 0; i < opponnentList.length; i++) {
        opponnentList[i].displaySpaceship();
        opponnentList[i].move();
        if (opponnentList[i] instanceof BossSpaceship) {
            opponnentList[i].switchDirection();
            //opponnentList[i].shoot();
        }
        // Vérifier si les adversaires sont toujours vivants (ou hors de l'écran)
        if (opponnentList[i].checkIfAlive()) {
            opponnentList.splice(i, 1);
        }
    }

    if (opponnentList.length == 0) {
        GameManagement.addOpponnent();
    }

    // Afficher et gérer les munitions
    for (let i = 0; i < bulletList.length; i++) {
        bulletList[i].displayBullet();
        bulletList[i].moveBullet();
        // Retirer 
        if (bulletList[i].destroyBullet() || bulletList[i].collisionWithplayer() || bulletList[i].collisionWithOpponnent()) {
            bulletList.splice(i, 1);
        }
    }
    hud.display();
}

// Mettre à jour l'affichage
setInterval(gameLoop, timeBeforeUpdate);