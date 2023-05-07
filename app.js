const app = {

    animation() {

        setTimeout(function () {

            app.nettoieCanvas();
            app.faireAvancerSerpent();

            app.dessineLeSerpent();

            // recursion
            app.animation();

        }, 100); // vitesse du serpent (plus le chiffre est élevé, plus le serpent est lent)
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
        snake.pop();
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

        snake = [{ x: 140, y: 150 }, { x: 130, y: 150 }, { x: 120, y: 150 }, { x: 110, y: 150 }];
    },

    init() {
        app.vitesse();
        app.animation();
        app.dessineLeSerpent();
        app.handleKeydown();
    }

}

app.init();