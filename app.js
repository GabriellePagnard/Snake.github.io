const app = {

    /**
     * Vitesse initiale du jeu (en millisecondes).
     * @type {number}
     */
    vitesse: 200,

    /**
     * Indique si le jeu est en pause.
     * @type {boolean}
     */
    paused: false,

    /**
     * ID de l'animation courante (utilisé pour annuler l'animation).
     * @type {number|null}
     */
    animationId: null,

    /**
     * Démarre l'animation du jeu.
     * Utilise un setTimeout pour créer une boucle d'animation récursive.
     * @function
     */
    animation() {
        if (app.paused) {
            return;
        }
        setTimeout(() => {
            app.nettoieCanvas();  // Nettoie le canvas
            app.dessinePomme();  // Dessine la pomme sur le canvas
            app.faireAvancerSerpent();  // Fait avancer le serpent
            if (app.finDuJeu()) {  // Vérifie si le jeu est terminé
                app.afficherGameOver(score);  // Affiche l'écran Game Over si le jeu est terminé
                return;
            }
            app.dessineLeSerpent();  // Dessine le serpent
            app.animation();  // Appelle récursivement l'animation
        }, app.vitesse);
    },

    /**
     * Nettoie le canvas pour redessiner.
     * Remplit le canvas avec un fond blanc et une bordure noire.
     * @function
     */
    nettoieCanvas() {
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
    },

    /**
     * Dessine une partie du serpent.
     * @param {Object} morceau - Un morceau du serpent à dessiner.
     * @param {number} morceau.x - La position x du morceau.
     * @param {number} morceau.y - La position y du morceau.
     */
    dessineLesMorceaux(morceau) {
        ctx.fillStyle = "#00a30e";
        ctx.strokeStyle = "#035811";
        ctx.fillRect(morceau.x, morceau.y, 10, 10);
        ctx.strokeRect(morceau.x, morceau.y, 10, 10);
    },

    /**
     * Dessine l'ensemble du serpent.
     * Parcourt chaque morceau du serpent et le dessine.
     * @function
     */
    dessineLeSerpent() {
        snake.forEach(morceau => {
            app.dessineLesMorceaux(morceau);
        });
    },

    /**
     * Fait avancer le serpent dans la direction actuelle.
     * Ajoute une nouvelle tête au serpent et retire la queue sauf si le serpent mange une pomme.
     * @function
     */
    faireAvancerSerpent() {
        const head = { x: snake[0].x + vx, y: snake[0].y + vy };
        snake.unshift(head);

        const serpentMangePomme = snake[0].x === pommeX && snake[0].y === pommeY;  // Vérifie si le serpent mange la pomme

        if (serpentMangePomme) {
            score += 10;
            const scoreEl = document.getElementById('score');
            if (scoreEl) {
                scoreEl.innerHTML = score;
            }
            app.creerPomme();  // Crée une nouvelle pomme
            app.vitesse -= 5;  // Augmente la vitesse du serpent
        } else {
            snake.pop();  // Retire la dernière partie du serpent si aucune pomme n'est mangée
        }
    },

    /**
     * Change la direction du serpent en fonction des touches de direction.
     * Empêche le serpent de faire demi-tour.
     * @param {KeyboardEvent} event - L'événement keydown.
     */
    changerDirection(event) {
        const FLECHE_GAUCHE = 37;
        const FLECHE_DROITE = 39;
        const FLECHE_ENHAUT = 38;
        const FLECHE_ENBAS = 40;

        const direction = event.keyCode;

        const monter = vy === -10;
        const descendre = vy === 10;
        const adroite = vx === 10;
        const agauche = vx === -10;

        // Empêche le serpent de faire demi-tour
        if (direction === FLECHE_GAUCHE && !adroite) { vx = -10; vy = 0; }
        if (direction === FLECHE_ENHAUT && !descendre) { vx = 0; vy = -10; }
        if (direction === FLECHE_DROITE && !agauche) { vx = 10; vy = 0; }
        if (direction === FLECHE_ENBAS && !monter) { vx = 0; vy = 10; }
    },

    /**
     * Ajoute un écouteur d'événements pour détecter les touches de direction.
     * Gère les mouvements du serpent avec les touches du clavier.
     * @function
     */
    handleKeydown() {
        document.addEventListener('keydown', app.changerDirection);
    },

    /**
     * Initialise les variables du jeu.
     * Configure le canvas et initialise les variables de jeu comme le serpent, la vitesse, etc.
     * @function
     */
    initialiseJeu() {
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');

        // Initialisation des variables de mouvement
        vx = 10;
        vy = 0;

        // Position de la pomme
        pommeX = 0;
        pommeY = 0;

        // Score initial
        score = 0;

        // Corps initial du serpent
        snake = [{ x: 140, y: 150 }, { x: 130, y: 150 }, { x: 120, y: 150 }, { x: 110, y: 150 }];
    },

    /**
     * Génère un nombre aléatoire pour positionner la pomme.
     * @returns {number} - Position aléatoire.
     */
    random() {
        return Math.round((Math.random() * 290) / 10) * 10;
    },

    /**
     * Crée une nouvelle pomme à une position aléatoire.
     * Vérifie que la pomme ne se superpose pas au serpent.
     * @function
     */
    creerPomme() {
        pommeX = app.random();
        pommeY = app.random();

        snake.forEach(part => {
            app.serpentSurPomme = part.x === pommeX && part.y === pommeY;
            if (app.serpentSurPomme) {
                app.creerPomme();  // Recrée une pomme si elle apparaît sur le serpent
            }
        });
    },

    /**
     * Dessine la pomme sur le canvas.
     * Utilise les coordonnées générées pour positionner la pomme.
     * @function
     */
    dessinePomme() {
        ctx.fillStyle = 'red';
        ctx.strokeStyle = 'darkred';
        ctx.beginPath();
        ctx.arc(pommeX + 5, pommeY + 5, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    },

    /**
     * Affiche la fenêtre pop-up "Game Over".
     * Permet de rejouer ou de quitter le jeu.
     * @param {number} score - Le score du joueur.
     * @function
     */
    afficherGameOver(score) {
        const popup = document.createElement('div');
        popup.classList.add('popup');

        // Message "Game Over"
        const message = document.createElement('h2');
        message.textContent = 'Game Over !';
        popup.appendChild(message);

        // Affiche le score final
        const scoreText = document.createElement('h3');
        scoreText.textContent = 'Votre Score : ' + score + ' ' + 'Bravo !';
        popup.appendChild(scoreText);

        // Bouton pour rejouer
        const btnRestart = document.createElement('button');
        btnRestart.textContent = 'Rejouer';
        btnRestart.addEventListener('click', function () {
            location.reload();  // Recharge la page pour rejouer
            app.init();
        });
        popup.appendChild(btnRestart);

        // Bouton pour quitter
        const btnQuit = document.createElement('button');
        btnQuit.textContent = 'Quitter';
        btnQuit.addEventListener('click', function () {
            app.fermerPopup();  // Ferme la fenêtre pop-up
        });
        popup.appendChild(btnQuit);

        // Ajout de la fenêtre pop-up au document
        document.body.appendChild(popup);
    },

    /**
     * Ferme la fenêtre pop-up "Game Over".
     * @function
     */
    fermerPopup() {
        const popup = document.querySelector('.popup');
        document.body.removeChild(popup);
    },

    /**
     * Vérifie si le jeu est terminé.
     * Retourne true si le serpent touche les murs ou se mord lui-même.
     * @returns {boolean} - Retourne true si le jeu est terminé, sinon false.
     */
    finDuJeu() {
        let snakeSansTete = snake.slice(1, -1);
        let mordu = false;
        snakeSansTete.forEach(morceau => {
            if (morceau.x === snake[0].x && morceau.y === snake[0].y) {
                mordu = true;
            }
        });

        const toucheMurGauche = snake[0].x < -1;
        const toucheMurDroite = snake[0].x > canvas.width - 10;
        const toucheMurTop = snake[0].y < -1;
        const toucheMurBottom = snake[0].y > canvas.height - 10;

        let gameOver = false;

        if (mordu || toucheMurGauche || toucheMurDroite || toucheMurTop || toucheMurBottom) {
            gameOver = true;
        }

        return gameOver;
    },

    /**
     * Bascule entre pause et reprise du jeu.
     * Annule l'animation si le jeu est en pause et la reprend sinon.
     * @function
     */
    togglePause() {
        app.paused = !app.paused;
        if (app.paused) {
            cancelAnimationFrame(app.animationId);  // Annule l'animation si le jeu est en pause
        } else {
            app.animationId = requestAnimationFrame(app.animation.bind(this));  // Reprend l'animation
        }
    },

    /**
     * Affiche la fenêtre pop-up de démarrage.
     * Permet de lancer le jeu.
     * @function
     */
    demarrageDuJeu() {
        const beguinPopup = document.createElement('div');
        beguinPopup.classList.add('beguinPopup');

        // Message "Lancer le jeu"
        const messageDemarrage = document.createElement('h4');
        messageDemarrage.textContent = 'Lancer le jeu';
        beguinPopup.appendChild(messageDemarrage);

        // Bouton pour commencer à jouer
        const btnStart = document.createElement('button');
        btnStart.textContent = 'Jouer';
        btnStart.addEventListener('click', function () {
            app.init();  // Initialise le jeu
            app.fermerBeguinPopup();  // Ferme la fenêtre pop-up de démarrage
        });
        beguinPopup.appendChild(btnStart);

        // Ajout de la fenêtre pop-up au document
        document.body.appendChild(beguinPopup);
    },

    /**
     * Ferme la fenêtre pop-up de démarrage.
     * @function
     */
    fermerBeguinPopup() {
        const beguinPopup = document.querySelector('.beguinPopup');
        document.body.removeChild(beguinPopup);
    },

    /**
     * Initialise et démarre le jeu.
     * Configure le jeu et démarre l'animation.
     * @function
     */
    init() {
        app.initialiseJeu();  // Initialise les variables du jeu
        app.creerPomme();  // Crée la première pomme
        app.animation();  // Démarre l'animation du jeu
        app.dessineLeSerpent();  // Dessine le serpent initial
        app.handleKeydown();  // Gère les entrées clavier pour la direction
        const pauseButton = document.getElementById('pause-button');
        pauseButton.addEventListener('click', app.togglePause.bind(app));  // Gère le bouton de pause
    },
}

// Démarre le jeu en affichant la fenêtre pop-up de démarrage
app.demarrageDuJeu();
