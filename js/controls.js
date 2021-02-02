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
        case "-":
            player1.shooting = true;
            break;
        case ",":
            player1.al = true;
            break;
        case ".":
            player1.ar = true;
            break;
        case "d":
        case "D":
            player2.va = -5;
            break;
        case "g":
        case "G":
            player2.va = 5;
            break;
        case "r":
        case "R":
            player2.af = true;
            break;
        case "f":
        case "F":
            player2.ab = true;
            break;
        case "1":
            player2.al = true;
            break;
        case "2":
            player2.ar = true;
            break;
        case "3":
            player2.shooting = true;
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
        case "-":
            player1.shooting = false;
            break;
        case ",":
            player1.al = false;
            break;
        case ".":
            player1.ar = false;
            break;
        case "d":
        case "D":
            player2.va = 0;
            break;
        case "g":
        case "G":
            player2.va = 0;
            break;
        case "r":
        case "R":
            player2.af = false;
            break;
        case "f":
        case "F":
            player2.ab = false;
            break;
        case "1":
            player2.al = false;
            break;
        case "2":
            player2.ar = false;
            break;
        case "3":
            player2.shooting = false;
            break;
    }
}

function gamepadHandler(){
    let gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
    let gp = gamepads[0];
    if (!gamepads || gamepads[0]==null || gp.buttons.length<15) {
        return;
    }
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
    player2.shooting = gp.buttons[2].pressed;
}