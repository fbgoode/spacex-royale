
let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;

let physics;
let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
ctx.lineCap = "round";
ctx.font = "bold 26px Arial";

let aClassic = document.getElementById("aClassic");
aClassic.volume = 0.08;
let aDouble = document.getElementById("aDouble");
aDouble.volume = 0.08;
let aCannon = document.getElementById("aCannon");
aCannon.volume = 0.08;

class Game {
    constructor (teams) {
        this.team1 = [new Spaceship(app.ships[teams[0][0][0]],app.weapons[teams[0][0][1]],"blue",app.ships[teams[0][0][0]].img.blue,60,60,100,980,90,true),
                        new Spaceship(app.ships[teams[0][1][0]],app.weapons[teams[0][1][1]],"blue",app.ships[teams[0][1][0]].img.blue,60,60,100,980,90,true),
                        new Spaceship(app.ships[teams[0][2][0]],app.weapons[teams[0][2][1]],"blue",app.ships[teams[0][2][0]].img.blue,60,60,100,980,90,true),];
        this.team2 = [new Spaceship(app.ships[teams[1][0][0]],app.weapons[teams[1][0][1]],"red",app.ships[teams[1][0][0]].img.red,60,60,1820,100,270,true),
                        new Spaceship(app.ships[teams[1][1][0]],app.weapons[teams[1][1][1]],"red",app.ships[teams[1][1][0]].img.red,60,60,1820,100,270,true),
                        new Spaceship(app.ships[teams[1][2][0]],app.weapons[teams[1][2][1]],"red",app.ships[teams[1][2][0]].img.red,60,60,1820,100,270,true),];
        this.player1 = this.team1[0];
        this.player2 = this.team2[0];
        this.player1.opacity=0;
        this.player2.opacity=0;
        this.player1i = 0;
        this.player2i = 0;
        this.life1 = new LifeBar("rgba(50, 84, 168, 0.5)",890,10,70,30);
        this.life2 = new LifeBar("rgba(168, 64, 50, 0.5)",890,10,1850,1050,180);
        let block = new Block("purple",700,300,1920/2,1080/2);
        let edges = [
            new Wall(1920,1920/2,0,0,1),
            new Wall(1920,1920/2,1080,0,-1),
            new Wall(1080,0,1080/2,1,0),
            new Wall(1080,1920,1080/2,-1,0)
        ];
        physics = new Physics(0.006,0.8,[this.player1,this.player2],[...edges,...block.walls],block.salients);
        this.visibleEntities = {block1:block};
        this.visibleEntities.player1 = this.player1;
        this.visibleEntities.player2 = this.player2;
        this.running = true;
        this.gamefinished = false;
        this.lastFrame = null;
        this.finalOpacity=-1;
        block.draw();
        this.renderHUD();
    }
    start() {
        this.gameLoop();
    }
    nextShipP1() {
        if (this.player1i<2) {
            this.player1i++;
            this.player1 = this.team1[this.player1i];
            this.player1.opacity=0;
            this.visibleEntities.player1 = this.player1;
            physics.players = [this.player1,this.player2];
        } else {
            this.visibleEntities.player1 = false;
            this.gameFinishP2();
        }
    }
    nextShipP2() {
        if (this.player2i<2) {
            this.player2i++;
            this.player2 = this.team2[this.player2i];
            this.player2.opacity=0;
            this.visibleEntities.player2 = this.player2;
            physics.players = [this.player1,this.player2];
        } else {
            this.visibleEntities.player2 = false;
            this.gameFinishP1();
        }
    }
    gameFinishP2() {
        this.gamefinished = true;
        this.stopMoving();
        this.keyupManager = () => {};
        this.keydownManager = () => {};
        this.renderHUD = () => {
            if (this.finalOpacity<1) this.finalOpacity +=0.007;
            if (this.finalOpacity>0) {
                ctx.fillStyle = "rgba(255,255,255,"+this.finalOpacity+")";
                ctx.fillRect(960 - 900 * 0.5, 540 - 300 * 0.5, 900, 300);
                ctx.font = "bold 100px Monospace";
                ctx.fillStyle = "rgba(168, 64, 50, "+this.finalOpacity+")";
                ctx.fillText("Player 2 Wins", 603, 565);
            }
        };
        setTimeout(()=>{app.finishGame();},7000);
    }
    gameFinishP1() {
        this.gamefinished = true;
        this.stopMoving();
        this.keyupManager = () => {};
        this.keydownManager = () => {};
        this.renderHUD = () => {
            if (this.finalOpacity<1) this.finalOpacity +=0.007;
            if (this.finalOpacity>0) {
                ctx.fillStyle = "rgba(255,255,255,"+this.finalOpacity+")";
                ctx.fillRect(960 - 900 * 0.5, 540 - 300 * 0.5, 900, 300);
                ctx.font = "bold 100px Monospace";
                ctx.fillStyle = "rgba(50, 84, 168, "+this.finalOpacity+")";
                ctx.fillText("Player 1 Wins", 603, 565);
            }
        };
        setTimeout(()=>{app.finishGame();},7000);
    }
    stopMoving() {
        this.player1.va = 0;
        this.player2.va = 0;
        this.player1.al = false;
        this.player2.al = false;
        this.player1.va = 0;
        this.player2.va = 0;
        this.player1.ar = false;
        this.player2.ar = false;
        this.player1.af = false;
        this.player2.af = false;
        this.player1.ab = false;
        this.player2.ab = false;
        this.player1.shooting = false;
        this.player2.shooting = false;
    }
    checkDeath() {
        if (this.player1.HP <=0 && !this.gamefinished) {
            this.player1.HP = 0;
            this.nextShipP1();
        }
        if (this.player2.HP <=0 && !this.gamefinished) {
            this.player2.HP = 0;
            this.nextShipP2();
        }
    }
    gameLoop() {
        requestAnimationFrame( (t)=>{app.game.loop(t);} );
    }
    loop( now ) {
        // stop the loop if running is false
        if ( this.running !== false ) {
            if (!this.lastFrame) this.lastFrame = now;
            let deltaT = now - this.lastFrame;
            // do not render frame when deltaT is too high
            if ( deltaT < 160 ) {
                this.frame( deltaT );
            }
            this.lastFrame = now;
            requestAnimationFrame( (t)=>{app.game.loop(t);} );
        }
    }
    frame(deltaT) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        physics.step(deltaT/1000);
        this.checkDeath();
        this.render();
        this.renderHUD();
        if (this.player1.shooting) this.player1.shoot();
        if (this.player2.shooting) this.player2.shoot();
    }
    renderHUD() {
        this.life1.width = this.player1.HP/this.player1.stats.HP*890;
        this.life2.width = this.player2.HP/this.player2.stats.HP*890;
        this.life1.draw();
        this.life2.draw();
        ctx.fillStyle = "rgba(50, 84, 168, 0.5)";
        ctx.fillText("HP", 22, 45);
        ctx.fillStyle = "rgba(168, 64, 50, 0.5)";
        ctx.fillText("HP", 1862, 1054);
        ctx.save();
        ctx.globalAlpha = 0.5;
        for (let i = this.player1i;i<3;i++) {
            ctx.drawImage(this.team1[i].img, 150-i*60, 55, 50, 50);
        }
        for (let i = this.player2i;i<3;i++) {
            ctx.drawImage(this.team2[i].img, 1720+i*60, 970, 50, 50);
        }
        ctx.restore();
    }
    render() {
        for (let key in this.visibleEntities) {
            if (this.visibleEntities[key]) this.visibleEntities[key].draw();
        }
    }
    keydownManager(e) {
        let key = e.key;
        if (key.length==1 && /^[a-x]*$/.test(key)) key=key.toUpperCase();
        let action="";
        for (let i in app.gameControls) {
            if (app.gameControls[i]==key) {
                action=i;
                break;
            }
        }
        switch(action) {
            case "P1TurnL":
                this.player1.va = -3.4;
                break;
            case "P2TurnL":
                this.player2.va = -3.4;
                break;
            case "P1StrafeL":
                this.player1.al = true;
                break;
            case "P2StrafeL":
                this.player2.al = true;
                break;
            case "P1TurnR":
                this.player1.va = 3.4;
                break;
            case "P2TurnR":
                this.player2.va = 3.4;
                break;
            case "P1StrafeR":
                this.player1.ar = true;
                break;
            case "P2StrafeR":
                this.player2.ar = true;
                break;
            case "P1Boost":
                this.player1.af = true;
                break;
            case "P2Boost":
                this.player2.af = true;
                break;
            case "P1Back":
                this.player1.ab = true;
                break;
            case "P2Back":
                this.player2.ab = true;
                break;
            case "P1Shoot":
                this.player1.shooting = true;
                break;
            case "P2Shoot":
                this.player2.shooting = true;
                break;
        }
    }
    keyupManager(e) {
        let key = e.key;
        if (key.length==1 && /^[a-x]*$/.test(key)) key=key.toUpperCase();
        let action="";
        for (let i in app.gameControls) {
            if (app.gameControls[i]==key) {
                action=i;
                break;
            }
        }
        switch(action) {
            case "P1TurnL":
                this.player1.va = 0;
                break;
            case "P2TurnL":
                this.player2.va = 0;
                break;
            case "P1StrafeL":
                this.player1.al = false;
                break;
            case "P2StrafeL":
                this.player2.al = false;
                break;
            case "P1TurnR":
                this.player1.va = 0;
                break;
            case "P2TurnR":
                this.player2.va = 0;
                break;
            case "P1StrafeR":
                this.player1.ar = false;
                break;
            case "P2StrafeR":
                this.player2.ar = false;
                break;
            case "P1Boost":
                this.player1.af = false;
                break;
            case "P2Boost":
                this.player2.af = false;
                break;
            case "P1Back":
                this.player1.ab = false;
                break;
            case "P2Back":
                this.player2.ab = false;
                break;
            case "P1Shoot":
                this.player1.shooting = false;
                break;
            case "P2Shoot":
                this.player2.shooting = false;
                break;
        }
    }

}