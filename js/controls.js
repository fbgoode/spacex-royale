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

function gamepadHandler(){
    let gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
    if (!gamepads || gamepads[0]==null) {
        return;
    }
    let gp = gamepads[0];
    if (gp.buttons[15].pressed) {
        player2.va = -5;
    } else if (gp.buttons[13].pressed) {
        player2.va = 5;
    } else {
        player2.va = 0;
    }
    player2.af = gp.buttons[12].pressed;
    player2.ab = gp.buttons[14].pressed;
    player2.al = gp.buttons[6].pressed;
    player2.ar = gp.buttons[7].pressed;
}