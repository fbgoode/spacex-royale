class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Plain extends Point {
    constructor(x, y, nx, ny) {
        super(x,y);
        this.nx = nx;
        this.ny = ny;
    }
}

class Wall extends Plain {
    constructor(l, x, y, nx, ny) {
        super(x,y,nx,ny);
        this.l = l;
    }
}

class Entity {
    constructor(x, y, a = 0, moves = false, vx0 = 0, vy0 = 0) {
        this.x = x;
        this.y = y;
        this.a = a * 0.01745;
        this.moves = moves;
        if (moves) {
            this.vx = vx0;
            this.vy = vy0;
            this.va = 0;
        }
    }
}

class Rectangle extends Entity {
    constructor(color,width,height,x,y,a = 0, moves = false, vx0 = 0, vy0 = 0) {
        super(x, y, a, moves, vx0, vy0);
        this.width = width;
        this.height = height;
        this.color = color;
    }
    draw() {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.translate(this.x, this.y);
        if (this.a) {
            ctx.rotate(this.a);
        }
        ctx.translate(-this.width * 0.5, -this.height * 0.5);
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.restore();
    }
}

class Block extends Rectangle {
    constructor(color,width,height,x,y,a = 0, moves = false, vx0 = 0, vy0 = 0) {
        super(color,width,height,x, y, a, moves, vx0, vy0);
        this.walls = [];
        let vxx = 1;
        let vxy = 0;
        let vyx = 0;
        let vyy = 1;
        if (a) {
            vxx = Math.cos(a);
            vxy = Math.sin(a);
            vyx = -Math.sin(a);
            vyy = Math.cos(a);
        }
        this.walls.push(new Wall(width, x + height/2 * vyx, y + height/2 * vyy, vyx, vyy));
        this.walls.push(new Wall(width, x - height/2 * vyx, y - height/2 * vyy, -vyx, -vyy));
        this.walls.push(new Wall(height, x + width/2 * vxx, y + width/2 * vxy, vxx, vxy));
        this.walls.push(new Wall(height, x - width/2 * vxx, y - width/2 * vxy, -vxx, -vxy));
        this.salients = [];
        this.salients.push(new Point(x + width/2 * vxx + height/2 * vyx, y + width/2 * vxy + height/2 * vyy));
        this.salients.push(new Point(x + width/2 * vxx - height/2 * vyx, y + width/2 * vxy - height/2 * vyy));
        this.salients.push(new Point(x - width/2 * vxx + height/2 * vyx, y - width/2 * vxy + height/2 * vyy));
        this.salients.push(new Point(x - width/2 * vxx - height/2 * vyx, y - width/2 * vxy - height/2 * vyy));
    }
}

class Sprite extends Entity {
    constructor(src,width,height,x,y,a = 0, moves = false, vx0 = 0, vy0 = 0) {
        super(x, y, a, moves, vx0, vy0);
        this.width = width;
        this.height = height;
        this.img = new Image();
        this.img.src = src;
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        if (this.a) {
            ctx.rotate(this.a);
        }
        ctx.translate(-this.width * 0.5, -this.height * 0.5);
        ctx.drawImage(this.img, 0, 0, this.width, this.height);
        ctx.restore();
    }
}

class Spaceship extends Sprite {
    constructor(stats,src,width,height,x,y,a = 0, moves = false, vx0 = 0, vy0 = 0) {
        super(src,width,height,x,y,a,moves,vx0,vy0);
        this.af = false;
        this.ab = false;
        this.al = false;
        this.ar = false;
        this.stats = stats;
        this.r = 25;
    }
}

class Physics {
    constructor(cd, ce = 0.8, players = [], walls = [], salients = []) {
        this.cd = cd;
        this.ce = ce;
        this.players = players;
        this.walls = walls;
        this.salients = salients;
    }
    wCollisions(player) {
        let Col = {};
        let dmin = 0;
        for (let W of this.walls) {
            if (this.bWP(W,player)) {
                let d = this.dPnC(W,{x:player.x,y:player.y,r:player.r});
                if (d<dmin && d>-player.r) {
                    dmin = d;
                    Col = W;
                }
            }
        }
        if (dmin) {
            player.x -= Col.nx * 2 * dmin;
            player.y -= Col.ny * 2 * dmin;
            let pv = 2 * this.ce * this.pE(Col.nx,Col.ny,player.vx,player.vy);
            if (pv < 0) {
                player.vx -= Col.nx * pv; 
                player.vy -= Col.ny * pv; 
            }
            return true;
        }
    }
    sCollisions(player) {
        let Col = {};
        let dmin = 0;
        let mod = 0;
        for (let P of this.salients) {
            let d = this.dPC(P,player);
            if (d<dmin) {
                dmin = d;
                Col = P;
                mod = this.dPP(P,player);
            }
        }
        if (dmin) {
            let nx = (player.x-Col.x)/mod;
            let ny = (player.y-Col.y)/mod;
            player.x -= nx * 2 * dmin;
            player.y -= ny * 2 * dmin;
            let pv = 2 * this.ce * this.pE(nx,ny,player.vx,player.vy);
            if (pv < 0) {
                player.vx -= nx * pv; 
                player.vy -= ny * pv; 
            }
        }
    }
    pCollisions(player,rest) {
        let Col = {};
        let dmin = 0;
        let mod = 0;
        for (let C of rest) {
            let d = this.dCC(C,player);
            if (d<dmin) {
                dmin = d;
                Col = C;
                mod = this.dPP(C,player);
            }
        }
        if (dmin) {
            let nx = (player.x-Col.x)/mod;
            let ny = (player.y-Col.y)/mod;
            player.x -= nx * 2 * dmin;
            player.y -= ny * 2 * dmin;
            let pv = this.ce * this.pE(nx,ny,player.vx-Col.vx,player.vy-Col.vy);
            player.vx -= nx * pv; 
            player.vy -= ny * pv;
            Col.vx += nx * pv; 
            Col.vy += ny * pv;
        }
    }
    step(dT) {
        let [, ...rest] = this.players
        for (var player of this.players) {
            // Increment positions from velocities
            player.a += dT * player.va;
            if (player.a>2*Math.PI) {
                player.a -= 2*Math.PI;
            }
            player.x += dT * player.vx;
            player.y += dT * player.vy;
            // Detect collisions
            if (!this.wCollisions(player)) {
                if (!this.sCollisions(player)) {
                    this.pCollisions(player,rest)
                }
            }
            // Calculate accelerations from booster forces
            let ax = 0;
            let ay = 0;
            if(player.af) {
                ax += player.stats.boost * Math.sin(player.a);
                
                ay += player.stats.boost * -Math.cos(player.a);
            }
            if(player.ab) {
                ax -= player.stats.gas * Math.sin(player.a);
                ay -= player.stats.gas * -Math.cos(player.a);
            }
            if(player.al) {
                ax -= player.stats.gas * Math.cos(player.a);
                ay -= player.stats.gas * Math.sin(player.a);
            }
            if(player.ar) {
                ax += player.stats.gas * Math.cos(player.a);
                ay += player.stats.gas * Math.sin(player.a);
            }
            // Add drag force to accelerations
            ax -= Math.sign(player.vx) * this.cd * player.vx**2;
            ay -= Math.sign(player.vy) * this.cd * player.vy**2;
            // Increment velocities from accelerations
            player.vx += dT * ax;
            player.vy += dT * ay;
            [, ...rest] = rest;
        }
    }
    // Is point in front of wall?
    bWP(W,P) {
        let Pn = {
            nx: W.ny,
            ny: -W.nx,
            x: W.x+W.l*W.ny/2,
            y: W.y-W.l*W.nx/2
        };
        let d = this.dPnP(Pn,P);
        return (d<=0 && W.l>=-d);
    }
    // Distance between point and point
    dPP(P1,P2) {
        return Math.sqrt((P1.x-P2.x)**2+(P1.y-P2.y)**2);
    }
    // Distance between plane and point
    dPnP(Pn,P) {
        return this.pE(Pn.nx,Pn.ny,P.x-Pn.x,P.y-Pn.y);
    }
    // Distance between plane and circle
    dPnC(Pn,C) {
        return (this.dPnP(Pn,C)-C.r);
    }
    // Distance between point and circle
    dPC(P,C) {
        return (this.dPP(P,C)-C.r);
    }
    // Distance between circle and circle
    dCC(C1,C2) {
        return (this.dPP(C1,C2)-C1.r-C2.r);
    }
    // Scalar product
    pE(x,y,x2,y2) {
        return (x*x2+y*y2);
    }
}
