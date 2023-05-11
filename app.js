const app = {

    animation() {

        setTimeout(function () {

            app.nettoieCanvas();
            app.dessinePomme()
            app.faireAvancerSerpent();
            if(app.finDuJeu()){
                return;
            }

            app.dessineLeSerpent();

            // recursion
            app.animation();

        }, 100); // vitesse du serpent (plus le chiffre est élevé, plus le serpent est lent)
    },

    nettoieCanvas() {
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        /*ctx.font = "20px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("Score: " + score, 10, 30);*/

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
            //document.getElementById('score').innerHTML = score;
            const scoreEl = document.getElementById('score');
            if (scoreEl) {
                scoreEl.innerHTML = score;
            }
            app.creerPomme();
        } else {
            snake.pop();
        }

        if (head.x < 0 || head.x > canvas.width - 10 || head.y < 0 || head.y > canvas.height - 10) {
            cancelAnimationFrame(animationId);
            app.finDuJeu();
            return;
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

    vitesse() {
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

    finDuJeu() {
        let snakeSansTete = snake.slice(1,-1);
        let mordu = false;
        snakeSansTete.forEach(morceau => {
            if(morceau.x === snake[0].x && morceau.y === snake[0].y) {
                mordu = true;
            }
        })
        return mordu;
    },

    init() {
        app.vitesse();
        app.creerPomme();
        app.animation();
        app.dessineLeSerpent();
        app.handleKeydown();
    }

}

app.init();