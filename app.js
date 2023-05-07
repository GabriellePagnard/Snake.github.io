const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

ctx.fillStyle = "white";
ctx.strokeStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.strokeRect(0, 0, canvas.width, canvas.height);

let snake = [{ x: 140, y: 150 }, { x: 130, y: 150 }, { x: 120, y: 150 }, { x: 110, y: 150 }];

function dessineLesMorceaux(morceau) {

    ctx.fillStyle = "#00a30e";
    ctx.strokeStyle = '#035811';
    ctx.fillRect(morceau.x, morceau.y, 10, 10);
    ctx.strokeRect(morceau.x, morceau.y, 10, 10);

}

function dessineLeSerpent() {
    snake.forEach(morceau => {
        dessineLesMorceaux(morceau);
    })
}
dessineLeSerpent();

