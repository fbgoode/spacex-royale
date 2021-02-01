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

function animLoop( render ) {
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
    player1.x += dT * player1.vx * Math.sin(player1.a);
    player1.y += dT * player1.vx * -Math.cos(player1.a);
}

let player1 = new Sprite("img/ship1.svg",100,100,300,150,90,true);

animLoop(render);
