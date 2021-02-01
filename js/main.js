var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

/*
let rect1 = new Rectangle("red",200,100,300,150,15);
let sprite1 = new Sprite("img/ship1.svg",100,100,300,150,15);
sprite1.draw();
*/

(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
  })();

function renderLoop( render ) {
    let running, lastFrame = null;
    function loop( now ) {
        // stop the loop if render returned false
        if ( running !== false ) {
            if (!lastFrame) lastFrame = now;
            let deltaT = now - lastFrame;
            // do not render frame when deltaT is too high
            if ( deltaT < 160 ) {
                running = render( deltaT );
            }
            lastFrame = now;
            requestAnimationFrame( loop );
        }
    }
    requestAnimationFrame( loop );
}

function render(deltaT) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    physics(deltaT/1000);
    player1.draw();
}

function physics(dT) {
    player1.a += dT * player1.va;
    player1.x += dT * player1.vx;
    player1.y += dT * player1.vy;
    let ax = 0;
    let ay = 0;
    if(player1.af) {
        ax += 1500 * Math.sin(player1.a);
        ay += 1500 * -Math.cos(player1.a);
    }
    if(player1.ab) {
        ax -= 500 * Math.sin(player1.a);
        ay -= 500 * -Math.cos(player1.a);
    }
    if(player1.al) {
        ax -= 500 * Math.cos(player1.a);
        ay -= 500 * Math.sin(player1.a);
    }
    if(player1.ar) {
        ax += 500 * Math.cos(player1.a);
        ay += 500 * Math.sin(player1.a);
    }
    ax -= Math.sign(player1.vx) * 0.006 * player1.vx**2;
    ay -= Math.sign(player1.vy) * 0.006 * player1.vy**2;
    player1.vx += dT * ax;
    player1.vy += dT * ay;
}

let player1 = new Spaceship("img/ship1.svg",60,60,300,150,90,true);

renderLoop(render);
