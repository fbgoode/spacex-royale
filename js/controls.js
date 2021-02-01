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
            player1.af = true;
            break;
        case "ArrowDown":
            player1.ab = true;
            break;
        case ".":
            player1.al = true;
            break;
        case "-":
            player1.ar = true;
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
            player1.af = false;
            break;
        case "ArrowDown":
            player1.ab = false;
            break;
        case ".":
            player1.al = false;
            break;
        case "-":
            player1.ar = false;
            break;
    }
}