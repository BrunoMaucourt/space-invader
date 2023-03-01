import { ctx} from './main.js';

class Spaceship {

    constructor(position,spaceshipHeight, spaceshipWidth) {
        // Préciser si c'est le vaisseau du joueur ou de l'adversaire
        // En fonction du cas afficher une image ou autre

        // On définit la taille du vaisseau
        this.spaceshipHeight = spaceshipHeight;
        this.spaceshipWidth = spaceshipWidth;
        this.position = position;
    }

    // Afficher le sprite
    displaySpaceship() {
        const spaceshipPicture = new Image();
        spaceshipPicture.src = './picture/player.png';
        // source image, posX, posY, taille X , taille Y
        ctx.drawImage(spaceshipPicture, this.position.x, this.position.y, this.spaceshipHeight, this.spaceshipWidth);
    }

    // Getter et setter
    getPosition(){
        return this.position;
    }

    setPosition(newPosition){
        this.position = newPosition;
    }


    // charger l'image du vaisseau
    // Si le vaisseau n'a plus de points de vie afficher une explosion à la place
    // Changer la taille de l'image d'explosion

    // point de vie

    // Déplacer


    // Tirer

    // Détecter si on se fait tirer dessus

    // Changer arme
}

export default Spaceship;