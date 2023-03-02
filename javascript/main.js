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

    constructor(position, spaceshipHeight, spaceshipWidth) {
        // Préciser si c'est le vaisseau du joueur ou de l'adversaire
        // En fonction du cas afficher une image ou autre

        // On définit la taille du vaisseau
        this.spaceshipHeight = spaceshipHeight;
        this.spaceshipWidth = spaceshipWidth;
        this.position = position;
        this.allowedToShoot = true
    }

    // Afficher l'image du vaisseau
    displaySpaceship() {
        const spaceshipPicture = new Image();
        spaceshipPicture.src = './picture/player.png';
        ctx.drawImage(spaceshipPicture, this.position.x, this.position.y, this.spaceshipHeight, this.spaceshipWidth);
        //console.log("spaceship X = " + this.position.x);        
        //console.log("spaceship Y = " + this.position.y);
    }

    // Déplacer le vaisseau
    move() {
        if (rightPressed && this.position.x < 800) {
            this.position = { x: this.position.x + 5, y: this.position.y };
        } else if (leftPressed && this.position.x > 0) {
            this.position = { x: this.position.x - 5, y: this.position.y };
        }
    }

    // Tirer
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

    allowToShoot() {
        console.log("allowed to shoot");
        this.allowedToShoot = true;
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

    // charger l'image du vaisseau
    // Si le vaisseau n'a plus de points de vie afficher une explosion à la place
    // Changer la taille de l'image d'explosion

    // point de vie

    // Détecter si on se fait tirer dessus

    // Changer arme
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
            ctx.arc(this.bulletPosition.x + spaceshipPlayerWidth / 2, this.bulletPosition.y, 20, 0, Math.PI * 2);
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
}

/** -----------------------------------
 * 
 *  Classe background
 *  
 ----------------------------------- */

class Background {
    constructor(number, position) {
        this.number= number;
        this.backgroundPicture = new Image();
        this.backgroundPicture.src = './picture/background.png';
        this.position = position;
    }

    display() {
        ctx.drawImage(this.backgroundPicture, this.position.x, this.position.y, windowWidth, windowHeigth);
    }

    move(){
        this.position = { x: this.position.x, y: this.position.y + 5 };
        if(this.number == 1 && this.position.y > windowHeigth){
            this.position = { x: 0, y: 0 }; 
        }else if(this.number == 2 && this.position.y > 0){
            this.position = { x: 0, y: - windowHeigth }; 
        }
    }
}

/** -----------------------------------
 * 
 *  Créer les vaisseaux
 *  
 ----------------------------------- */

let player = new Spaceship({ x: windowMidWidth - spaceshipPlayerHeight / 2, y: windowHeigth - spaceshipPlayerWidth }, spaceshipPlayerHeight, spaceshipPlayerWidth);
let back = new Background(1, { x: 0, y: 0 });
let back2 = new Background(2, { x: 0, y: - windowHeigth });

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

    // Afficher les munitions
    for (let i = 0; i < bulletList.length; i++) {
        bulletList[i].displayBullet();
        bulletList[i].moveBullet();
        bulletList[i].destroyBullet();
    }
}

// Mettre à jour l'affichage
setInterval(gameLoop, timeBeforeUpdate);