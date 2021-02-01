document.addEventListener('keydown', keydownManager);
document.addEventListener('keyup', keyupManager);

function keydownManager (e) {
    switch (e.key) {
        case "ArrowLeft":
            player1.va = -5;
            break;
        case "ArrowRight":
            player1.va = 5;
            break;
        case "ArrowUp":
            player1.vx = 200;
            break;
        case "ArrowDown":
            player1.vx = -200;
            break;
    }
}
function keyupManager (e) {
    switch (e.key) {
        case "ArrowLeft":
            player1.va = 0;
            break;
        case "ArrowRight":
            player1.va = 0;
            break;
        case "ArrowUp":
            player1.vx = 0;
            break;
        case "ArrowDown":
            player1.vx = 0;
            break;
    }
}