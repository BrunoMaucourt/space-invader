// Importer les modules
import Spaceship from './spaceship.js';

// Déclarer des constantes
const largeurEcran = 900;
const hauteurEcran = 700;

// Charger le canvas
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let player = new Spaceship({ x: 0, y: 0 }, 100, 100);

/*
* Gérer les touches du clavier
*/

let rightPressed = false;
let leftPressed = false;

// (nom de l'eventlistener, nom de la fonction appelée, )
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}



/*
* Test de fonction pour mise à jour de l'image
*/
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.displaySpaceship();
    player.move();

}

setInterval(update, 10);
// Rendre accésible la constante ctx à d'autres modules
export { ctx, rightPressed, leftPressed };