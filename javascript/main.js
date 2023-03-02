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
const timeBeforeUpdate = 10;
const timeBetweenTwoShoot = 200;

// Charger le canvas
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Créer des tableaux pour les vaisseaux et les tirs
let bulletList = [];
let spaceshipList = [];

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

    // Déplacer le vaisseau
    move() {

    }

    // Tirer
    shoot() {

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

    getHealthPoint() {
        return this.healthPoint;
    }

    setHealthPoint(newHealthPoint) {
        this.healthPoint = this.healthPoint + newHealthPoint;
    }

    // Détecter si on se fait tirer dessus

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
        if (rightPressed && this.position.x < 800) {
            this.position = { x: this.position.x + 5, y: this.position.y };
        } else if (leftPressed && this.position.x > 0) {
            this.position = { x: this.position.x - 5, y: this.position.y };
        }
    }

    shoot() {
        if (spacePressed && this.allowedToShoot) {
            let bullet = new Bullet(this.position, "player", bulletList.length);
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

    }

    shoot() {

    }

    destroy(){
         
    }
}

/** -----------------------------------
 * 
 *  Classe bullet
 *  
 ----------------------------------- */

class Bullet {
    constructor(bulletPosition, character, index) {
        this.bulletPosition = bulletPosition;
        this.character = character;
        this.index = index;
    }

    displayBullet() {
        if (this.character == "player") {
            ctx.beginPath();
            ctx.arc(this.bulletPosition.x + spaceshipPlayerWidth / 2, this.bulletPosition.y, 10, 0, Math.PI * 2);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
        } else if (this.character == "opponnent") {
        }
    }

    moveBullet() {
        this.bulletPosition = { x: this.bulletPosition.x, y: this.bulletPosition.y - 5 };
    }

    destroyBullet() {
        if (this.bulletPosition.y < 0) {
            bulletList.shift();
        }
    }

    collisionWithOpponnent(){
        for(let i = 0; i < opponnentList.length; i++){
            opponnentList[i].getPosition();
            if(this.bulletPosition.x + spaceshipPlayerWidth / 2 >= opponnentList[i].getPosition().x &&
            this.bulletPosition.x + 10 + spaceshipPlayerWidth / 2 >= opponnentList[i].getPosition().x &&
            this.bulletPosition.x <= opponnentList[i].getPosition().x + spaceshipPlayerWidth &&
            this.bulletPosition.x + 10 <= opponnentList[i].getPosition().x + spaceshipPlayerWidth){
                if(this.bulletPosition.y >= opponnentList[i].getPosition().y &&
                this.bulletPosition.y + 10 >= opponnentList[i].getPosition().y &&
                 this.bulletPosition.y <= opponnentList[i].getPosition().y + spaceshipPlayerHeight &&
                 this.bulletPosition.y + 10 <= opponnentList[i].getPosition().y + spaceshipPlayerHeight){
                    opponnentList[i].setHealthPoint(-1);
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
    constructor(color) {
        this.color = color;
    }

    display() {
        ctx.fillStyle = this.color;
        ctx.font = '30px Sans-Serif';
        ctx.textBaseline = 'top';
        ctx.fillText("Life : " + player.getHealthPoint(), 20, 20);
        ctx.fillText("Score : " + player.getHealthPoint(), 20, 80);
    }
}

/** -----------------------------------
 * 
 *  Initialiser la partie
 *  
 ----------------------------------- */

let player = new PlayerSpaceship({ x: windowMidWidth - spaceshipPlayerHeight / 2, y: windowHeigth - spaceshipPlayerWidth }, spaceshipPlayerHeight, spaceshipPlayerWidth, 10, "./picture/player.png");
let opponnentList =[
    new OpponnentSpaceship({ x: 100, y: 0 }, spaceshipPlayerHeight, spaceshipPlayerWidth, 3, "./picture/opponnent.png"),
    new OpponnentSpaceship({ x: 500 - spaceshipPlayerHeight / 2, y: 0 }, spaceshipPlayerHeight, spaceshipPlayerWidth, 3, "./picture/opponnent.png"),
    new OpponnentSpaceship({ x: 800 - spaceshipPlayerHeight / 2, y: 0 }, spaceshipPlayerHeight, spaceshipPlayerWidth, 3, "./picture/opponnent.png"),
];
let back = new Background(1, { x: 0, y: 0 });
let back2 = new Background(2, { x: 0, y: - windowHeigth });
let hud = new HUD('#00F');

/**
 * Fonction pour mise à jour de l'écran et gestions des actions
 * 
 */
function gameLoop() {
    ctx.clearRect(0, 0, windowWidth, windowHeigth);
    back.display();
    back2.display();
    back.move();
    back2.move();
    player.displaySpaceship();
    player.move();
    player.shoot();

    // Afficher les adversaires
    for(let i = 0; i < opponnentList.length; i++){
        opponnentList[i].displaySpaceship();
        console.log("adversaire" + i + " = " +opponnentList[i].getHealthPoint());
    }

    // Afficher les munitions
    for (let i = 0; i < bulletList.length; i++) {
        bulletList[i].displayBullet();
        bulletList[i].moveBullet();
        bulletList[i].destroyBullet();
        bulletList[i].collisionWithOpponnent();
    }

    hud.display();
}

// Mettre à jour l'affichage
setInterval(gameLoop, timeBeforeUpdate);