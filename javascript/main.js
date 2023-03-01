// Importer les modules
import Spaceship from './spaceship.js';

// Déclarer des constantes
const largeurEcran = 900;
const hauteurEcran = 700;

// Charger le canvas
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let player = new Spaceship({ x: largeurEcran / 2 - 50, y: hauteurEcran - 100 }, 100, 100);

/*
* Gérer les touches du clavier
*/

let rightPressed = false;
let leftPressed = false;
let spacePressed = false;

// (nom de l'eventlistener, nom de la fonction appelée, )
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
    else if (e.key == " ") {
        spacePressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
    else if (e.key == " ") {
        spacePressed = false;
    }
}



/*
* Test de fonction pour mise à jour de l'image
*/
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.displaySpaceship();
    player.move();
    player.shoot();

}

setInterval(update, 10);
// Rendre accésible la constante ctx à d'autres modules
export { ctx, rightPressed, leftPressed, spacePressed };