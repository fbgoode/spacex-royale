
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
let aZap = document.getElementById("aZap");
aZap.volume = 0.01;
let aExplosion = document.getElementById("aExplosion");
aExplosion.volume = 0.17;
let aCollision = document.getElementById("aCollision");
aCollision.volume = 0.1;
let aDragging = document.getElementById("aDragging");
aDragging.volume = 0.15;
aDragging.loop = true;
let aDTimeout = setTimeout(()=>{});
let aBoost = document.getElementById("aBoost");
aBoost.volume = 0.3;
aBoost.loop = true;
let aBTimeout = setTimeout(()=>{});
let aGas = document.getElementById("aGas");
aGas.volume = 0.1;
aGas.loop = true;
let aGTimeout = setTimeout(()=>{});

class Game {

    particles = [];
    special = null;

    constructor (gameData) {
        this.team1 = [new Spaceship(app.ships[gameData.teams[0][0][0]],app.weapons[gameData.teams[0][0][1]],"rgb(127, 146, 255)",app.ships[gameData.teams[0][0][0]].img.blue,60,60,100,980,90,true),
                        new Spaceship(app.ships[gameData.teams[0][1][0]],app.weapons[gameData.teams[0][1][1]],"rgb(127, 146, 255)",app.ships[gameData.teams[0][1][0]].img.blue,60,60,100,980,90,true),
                        new Spaceship(app.ships[gameData.teams[0][2][0]],app.weapons[gameData.teams[0][2][1]],"rgb(127, 146, 255)",app.ships[gameData.teams[0][2][0]].img.blue,60,60,100,980,90,true),];
        this.team2 = [new Spaceship(app.ships[gameData.teams[1][0][0]],app.weapons[gameData.teams[1][0][1]],"rgb(255, 127, 127)",app.ships[gameData.teams[1][0][0]].img.red,60,60,1820,100,270,true),
                        new Spaceship(app.ships[gameData.teams[1][1][0]],app.weapons[gameData.teams[1][1][1]],"rgb(255, 127, 127)",app.ships[gameData.teams[1][1][0]].img.red,60,60,1820,100,270,true),
                        new Spaceship(app.ships[gameData.teams[1][2][0]],app.weapons[gameData.teams[1][2][1]],"rgb(255, 127, 127)",app.ships[gameData.teams[1][2][0]].img.red,60,60,1820,100,270,true),];
        this.player1 = this.team1[0];
        this.player2 = this.team2[0];
        this.player1.opacity=0;
        this.player2.opacity=0;
        this.player1i = 0;
        this.player2i = 0;
        this.life1 = new LifeBar(890,10,70,30,"rgba(50, 84, 168, 0.5)");
        this.life2 = new LifeBar(890,10,1850,1050,"rgba(168, 64, 50, 0.5)",180);
        this.map = new Map(gameData.map);
        physics = new Physics(0.006,0.8,[this.player1,this.player2],this.map.walls,this.map.salients);
        this.visibleEntities = {...this.map.entities};
        this.visibleEntities.player1 = this.player1;
        this.visibleEntities.player2 = this.player2;
        this.specialInt = setInterval(()=>{this.newSpecial()},14000);
        this.specials = ["immunity","bomb","firework"]
        this.running = true;
        this.gamefinished = false;
        this.lastFrame = null;
        this.finalOpacity=-1;
        ctx.font = "bold 26px Arial";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.renderHUD();
        this.render();
    }
    start() {
        this.gameLoop();
    }
    newSpecial() {
        this.special = new Special(this.specials[(~~(Math.random()*3))]);
        this.visibleEntities.special = this.special;
    }
    handleSpecial() {
        if (this.player1.useSpecial && this.player1.special) this.player1.special.use(this.player1);
        if (this.player2.useSpecial && this.player2.special) this.player2.special.use(this.player2);
        if (this.special===null) return;
        let Col;
        let dmin = 0;
        let mod = 0;
        for (let player of [this.player1,this.player2]) {
            let d = Physics.dCC(this.special,player);
            if (d<dmin) {
                dmin = d;
                Col = player;
            }
        }
        if (dmin) {
            Col.special = this.special;
            this.special = null;
            delete this.visibleEntities.special;
        }
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
        clearInterval(this.specialInt);
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
        clearInterval(this.specialInt);
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
            this.player1.explode();
            this.nextShipP1();
        }
        if (this.player2.HP <=0 && !this.gamefinished) {
            this.player2.HP = 0;
            this.player2.explode();
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
        this.renderParticles(deltaT);
        this.render();
        this.renderHUD();
        if (this.player1.shooting) this.player1.shoot();
        if (this.player2.shooting) this.player2.shoot();
        this.handleSpecial();
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
        ctx.globalAlpha = 0.3;
        if (this.player1.special) {
            ctx.drawImage(this.player1.special.img, 30, 110, 50, 50);
        }
        if (this.player2.special) {
            ctx.drawImage(this.player2.special.img, 1840, 915, 50, 50);
        }
        ctx.restore();
    }
    render() {
        for (let key in this.visibleEntities) {
            if (this.visibleEntities[key]) this.visibleEntities[key].draw();
        }
    }
    renderParticles(dT) {
        for (let i in this.particles) {
            if (!this.particles[i].step(dT)) this.particles.splice(i,1);;
        }
    }
    keydownManager(e) {
        let key = e.key;
        if (key.length==1 && /^[a-z]*$/.test(key)) key=key.toUpperCase();
        let action="";
        for (let i in app.gameControls) {
            if (app.gameControls[i]==key) {
                action=i;
                break;
            }
        }
        switch(action) {
            case "P1TurnL":
                if (!this.player1.t) {
                    this.player1.t = -1;
                    this.player1.va = -1;
                }
                break;
            case "P2TurnL":
                if (!this.player2.t) {
                    this.player2.t = -1;
                    this.player2.va = -1;
                }
                break;
            case "P1StrafeL":
                this.player1.al = true;
                break;
            case "P2StrafeL":
                this.player2.al = true;
                break;
            case "P1TurnR":
                if (!this.player1.t) {
                    this.player1.t = 1;
                    this.player1.va = 1;
                }
                break;
            case "P2TurnR":
                if (!this.player2.t) {
                    this.player2.t = 1;
                    this.player2.va = 1;
                }
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
            case "P1Special":
                this.player1.useSpecial = true;
                break;
            case "P2Special":
                this.player2.useSpecial = true;
                break;
        }
    }
    keyupManager(e) {
        let key = e.key;
        if (key.length==1 && /^[a-z]*$/.test(key)) key=key.toUpperCase();
        let action="";
        for (let i in app.gameControls) {
            if (app.gameControls[i]==key) {
                action=i;
                break;
            }
        }
        switch(action) {
            case "P1TurnL":
                this.player1.t = 0;
                break;
            case "P2TurnL":
                this.player2.t = 0;
                break;
            case "P1StrafeL":
                this.player1.al = false;
                break;
            case "P2StrafeL":
                this.player2.al = false;
                break;
            case "P1TurnR":
                this.player1.t = 0;
                break;
            case "P2TurnR":
                this.player2.t = 0;
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
            case "P1Special":
                this.player1.useSpecial = false;
                break;
            case "P2Special":
                this.player2.useSpecial = false;
                break;
        }
    }
    randPos(r) {
        let x;
        let y;
        do {
            x = (~~(r+Math.random()*(1920-2*r)));
            y = (~~(r+Math.random()*(1080-2*r)));
            let dmin = 2000;
            for (let key in this.visibleEntities) {
                if (key.substr(0,key.length-1)=="player") {
                    let d = Physics.dPC({x:x,y:y},this.visibleEntities[key]);
                    if (Math.abs(d)<Math.abs(dmin)) dmin = d;
                } else if (key!="special") {
                    for (let W of this.visibleEntities[key].walls) {
                        if (!Physics.bWP(W,{x:x,y:y})) continue;
                        let d = Physics.dPnP(W,{x:x,y:y});
                        if (Math.abs(d)<Math.abs(dmin)) dmin = d;
                    }
                    for (let S of this.visibleEntities[key].salients) {
                        let d = Physics.dPP(S,{x:x,y:y});
                        if (Math.abs(d)<Math.abs(dmin)) dmin = d;
                    }
                }
            }
            if (dmin-r>=0) break;
        } while (true)
        return [x,y];
    }
}

class onlineGame extends Game {
    constructor(gameData) {
        super(gameData);
        app.onlineController.menuchannel.onmessage = (message)=>{
            this.update(message.data);
        };
        this.remoteT = 0;
        this.ownBullets = {};
        this.remoteBullets = {};
        this.bulletid=0;
    }
    update(data) {
        if (data.T<this.remoteT) return;
        this.remoteT = data.T;
        this.player2.x = data.player2.x;
        this.player2.y = data.player2.y;
        this.player2.vx = data.player2.vx;
        this.player2.vy = data.player2.vy;
        this.player2.a = data.player2.a;
        this.player2.va = data.player2.va;
        this.player2.al = data.player2.al;
        this.player2.ar = data.player2.ar;
        this.player2.af = data.player2.af;
        this.player2.ab = data.player2.ab;
        for (let i in data.bullets) {
            if (this.remoteBullets[i] == 'undefined') {
                if (data.bullets[i].type=="Bullet"){
                    this.remoteBullets[i] = new Bullet();
                }
                // TODO: ESTAMOS AQUÍ ----------------------------------------------------------------<
            }
        }
    }
    keydownManager(e) {
        let key = e.key;
        if (key.length==1 && /^[a-z]*$/.test(key)) key=key.toUpperCase();
        let action="";
        for (let i in app.gameControls) {
            if (app.gameControls[i]==key) {
                action=i;
                break;
            }
        }
        switch(action) {
            case "P1TurnL":
                if (!this.player1.t) {
                    this.player1.t = -1;
                    this.player1.va = -1;
                }
                break;
            case "P1StrafeL":
                this.player1.al = true;
                break;
            case "P1TurnR":
                if (!this.player1.t) {
                    this.player1.t = 1;
                    this.player1.va = 1;
                }
                break;
            case "P1StrafeR":
                this.player1.ar = true;
                break;
            case "P1Boost":
                this.player1.af = true;
                break;
            case "P1Back":
                this.player1.ab = true;
                break;
            case "P1Shoot":
                this.player1.shooting = true;
                break;
            case "P1Special":
                this.player1.useSpecial = true;
                break;
        }
    }
    keyupManager(e) {
        let key = e.key;
        if (key.length==1 && /^[a-z]*$/.test(key)) key=key.toUpperCase();
        let action="";
        for (let i in app.gameControls) {
            if (app.gameControls[i]==key) {
                action=i;
                break;
            }
        }
        switch(action) {
            case "P1TurnL":
                this.player1.t = 0;
                break;
            case "P1StrafeL":
                this.player1.al = false;
                break;
            case "P1TurnR":
                this.player1.t = 0;
                break;
            case "P1StrafeR":
                this.player1.ar = false;
                break;
            case "P1Boost":
                this.player1.af = false;
                break;
            case "P1Back":
                this.player1.ab = false;
                break;
            case "P1Shoot":
                this.player1.shooting = false;
                break;
            case "P1Special":
                this.player1.useSpecial = false;
                break;
        }
    }
}