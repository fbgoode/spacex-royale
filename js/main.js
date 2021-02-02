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
    physics.step(deltaT/1000);
    player1.draw();
    block.draw();
}

let stats = {
    boost: 1500,
    gas: 500,
    HP: 500,
    dmg: 20
}
let player1 = new Spaceship(stats,"img/ship1.svg",60,60,300,150,90,true);
let block = new Block("blue",700,300,1920/2,1080/2);
let physics = new Physics(0.006,0.8,[player1],block.walls,block.salients);

renderLoop(render);
