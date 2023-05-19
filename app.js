const app = {

    vitesse: 200,
    paused: false,
    animationId: null,

    animation() {
        if (app.paused) {
            return;
        }
        setTimeout(() => {
            app.nettoieCanvas();
            app.dessinePomme()
            app.faireAvancerSerpent();
            if (app.finDuJeu()) {
                console.log('3')
                app.afficherGameOver(score);
                return;
            }
            app.dessineLeSerpent();
            // recursion
            app.animation();
        }, app.vitesse);
    },

    nettoieCanvas() {
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
    },

    dessineLesMorceaux(morceau) {
        ctx.fillStyle = "#00a30e";
        ctx.strokeStyle = "#035811";
        ctx.fillRect(morceau.x, morceau.y, 10, 10);
        ctx.strokeRect(morceau.x, morceau.y, 10, 10);

    },

    dessineLeSerpent() {
        snake.forEach(morceau => {
            app.dessineLesMorceaux(morceau);
        })
    },



    faireAvancerSerpent() {
        const head = { x: snake[0].x + vx, y: snake[0].y + vy };
        snake.unshift(head);


        const serpentMangePomme = snake[0].x === pommeX && snake[0].y === pommeY;  // Vérifi si la tête du serpent est sur la pomme

        if (serpentMangePomme) {
            score += 10;
            const scoreEl = document.getElementById('score');
            if (scoreEl) {
                scoreEl.innerHTML = score;
            }
            app.creerPomme();
            app.vitesse -= 5; // Permet d'augmenter la vitesse du serpent automatiquement plus il mange de pommes
        } else {
            snake.pop();
        }

    },

    changerDirection(event) {
        //console.log(event)

        const FLECHE_GAUCHE = 37;
        const FLECHE_DROITE = 39;
        const FLECHE_ENHAUT = 38;
        const FLECHE_ENBAS = 40;

        const direction = event.keyCode;

        const monter = vy === -10;
        const descendre = vy === 10;
        const adroite = vx === 10;
        const agauche = vx === -10;


        // Pour interdir le retournement du serpent
        if (direction === FLECHE_GAUCHE && !adroite) { vx = -10; vy = 0 }
        if (direction === FLECHE_ENHAUT && !descendre) { vx = 0; vy = -10 }
        if (direction === FLECHE_DROITE && !agauche) { vx = 10; vy = 0 }
        if (direction === FLECHE_ENBAS && !monter) { vx = 0; vy = 10 }

    },

    handleKeydown() {
        document.addEventListener('keydown', app.changerDirection);
    },

    initialiseJeu() {
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');

        // variables

        // Vitesse sur X
        vx = 10;

        // Vitesse sur Y
        vy = 0;

        // PommeX
        pommeX = 0;

        // PommeY
        pommeY = 0;

        // Score
        score = 0;

        snake = [{ x: 140, y: 150 }, { x: 130, y: 150 }, { x: 120, y: 150 }, { x: 110, y: 150 }];
    },

    random() {

        return Math.round((Math.random() * 290) / 10) * 10;
    },

    creerPomme() {

        pommeX = app.random();
        pommeY = app.random();

        snake.forEach(part => {

            app.serpentSurPomme = part.x == pommeX && part.y == pommeY;

            if (app.serpentSurPomme) {
                app.creerPomme();
            }
        })
    },

    dessinePomme() {
        ctx.fillStyle = 'red';
        ctx.strokeStyle = 'darkred';
        ctx.beginPath();
        ctx.arc(pommeX + 5, pommeY + 5, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    },
    

    afficherGameOver(score) {
        // Création de la fenêtre pop-up
        const popup = document.createElement('div');
        popup.classList.add('popup');

        // Contenu de la fenêtre pop-up
        const message = document.createElement('h2');
        message.textContent = 'Game Over !';
        popup.appendChild(message);

        const scoreText = document.createElement('h3');
        scoreText.textContent = 'Votre Score : ' + score + ' ' + 'Bravo !';
        popup.appendChild(scoreText);

        const btnRestart = document.createElement('button');
        btnRestart.textContent = 'Rejouer';
        btnRestart.addEventListener('click', function () {
            // Action à effectuer lors du clic sur le bouton "Rejouer"

            location.reload();
            app.init();

        });
        popup.appendChild(btnRestart);

        const btnQuit = document.createElement('button');
        btnQuit.textContent = 'Quitter';
        btnQuit.addEventListener('click', function () {
            // Action à effectuer lors du clic sur le bouton "Quitter"

            app.fermerPopup();
        });
        popup.appendChild(btnQuit);

        // Ajout de la fenêtre pop-up au document
        document.body.appendChild(popup);

        
    },

    // Fonction pour fermer la fenêtre pop-up
    fermerPopup() {
        const popup = document.querySelector('.popup');
        document.body.removeChild(popup);
    },

    finDuJeu() {

        let snakeSansTete = snake.slice(1, -1);
        let mordu = false;
        snakeSansTete.forEach(morceau => {
            if (morceau.x === snake[0].x && morceau.y === snake[0].y) {
                mordu = true;
            }
        })

        const toucheMurGauche = snake[0].x < -1;
        const toucheMurDroite = snake[0].x > canvas.width - 10;
        const toucheMurTop = snake[0].y < -1;
        const toucheMurBottom = snake[0].y > canvas.height - 10;

        let gameOver = false;

        if (mordu || toucheMurGauche || toucheMurDroite || toucheMurTop || toucheMurBottom) {
            console.log('5')
            gameOver = true;
        }


        return gameOver;
    },

    togglePause() {
        app.paused = !app.paused;
        if (app.paused) {
            cancelAnimationFrame(app.animationId);
        } else {
            app.animationId = requestAnimationFrame(app.animation.bind(this));
        }
    },

    demarrageDuJeu() {
        // Création de la fenêtre pop-up
        const beguinPopup = document.createElement('div');
        beguinPopup.classList.add('beguinPopup');

        // Contenu de la fenêtre pop-up
        const messageDemarrage = document.createElement('h4');
        messageDemarrage.textContent = 'Lancer le jeu';
        beguinPopup.appendChild(messageDemarrage);

        const btnStart = document.createElement('button');
        btnStart.textContent = 'Jouer';
        btnStart.addEventListener('click', function () {
            // Action à effectuer lors du clic sur le bouton "Jouer"

            app.init();
            app.fermerBeguinPopup();

        });
        beguinPopup.appendChild(btnStart);

        // Ajout de la fenêtre pop-up au document
        document.body.appendChild(beguinPopup);

        
    },

    // Fonction pour fermer la fenêtre pop-up
    fermerBeguinPopup() {
        const beguinPopup = document.querySelector('.beguinPopup');
        document.body.removeChild(beguinPopup);
    },




    init() {
        app.initialiseJeu();
        app.creerPomme();
        app.animation();
        app.dessineLeSerpent();
        app.handleKeydown();
        const pauseButton = document.getElementById('pause-button');
        pauseButton.addEventListener('click', app.togglePause.bind(app));
    },
}

app.demarrageDuJeu()