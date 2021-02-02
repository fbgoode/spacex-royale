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

function gameLoop( frame ) {
    let running, lastFrame = null;
    function loop( now ) {
        // stop the loop if render returned false
        if ( running !== false ) {
            if (!lastFrame) lastFrame = now;
            let deltaT = now - lastFrame;
            // do not render frame when deltaT is too high
            if ( deltaT < 160 ) {
                running = frame( deltaT );
            }
            lastFrame = now;
            requestAnimationFrame( loop );
        }
    }
    requestAnimationFrame( loop );
}

function frame(deltaT) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gamepadHandler();
    physics.step(deltaT/1000);
    player1.draw();
    player2.draw();
    block.draw();
    if (player1.shooting) player1.shoot();
    if (player2.shooting) player2.shoot();
}

let stats = {
    boost: 1500,
    gas: 500,
    HP: 500
}
let weapon = {
    v: 1000,
    color: "blue",
    type: 'single',
    freq: 0.4,
    dmg: 20
}
let player1 = new Spaceship(stats,weapon,"img/ship1.svg",60,60,300,150,90,true);
let player2 = new Spaceship(stats,weapon,"img/ship1.svg",60,60,400,500,270,true);
let block = new Block("blue",700,300,1920/2,1080/2);
let edges = [
    new Wall(1920,1920/2,0,0,1),
    new Wall(1920,1920/2,1080,0,-1),
    new Wall(1080,0,1080/2,1,0),
    new Wall(1080,1920,1080/2,-1,0)
];
let physics = new Physics(0.006,0.8,[player1,player2],[...edges,...block.walls],block.salients);

gameLoop(frame);
