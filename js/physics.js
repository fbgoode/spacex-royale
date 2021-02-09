class Physics {
    constructor(cd, ce = 0.8, players = [], walls = [], salients = [], bullets = []) {
        this.cd = cd;
        this.ce = ce;
        this.players = players;
        this.walls = walls;
        this.salients = salients;
        this.bullets = bullets;
    }
    wpCollisions(player) {
        let Col = {};
        let dmin = 0;
        for (let W of this.walls) {
            if (this.bWP(W,player)) {
                let d = this.dPnC(W,player);
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
                if (pv<-300) player.HP += Math.floor(pv * (1/this.ce - 1) / 10);
            }
            player.hit(Col.nx,Col.ny,pv*(1/this.ce-1));
            return true;
        }
        return false;
    }
    spCollisions(player) {
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
                if (pv<-300) player.HP += Math.floor(pv * (1/this.ce - 1) / 10);
            }
            player.hit(nx,ny,pv*(1/this.ce-1));
            return true;
        }
        return false;
    }
    ppCollisions(player,rest) {
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
            if (pv<-300) {
                let dmg = Math.floor(pv * (1/this.ce - 1) / 10);
                player.HP += dmg;
                Col.HP += dmg;
            }
            player.hit(nx,ny,pv*(1/this.ce-1));
        }
    }
    wbCollisions(bullet) {
        let dmin = -80;
        let nx;
        let ny;
        for (let W of this.walls) {
            if (this.bWP(W,bullet)) {
                let d = this.dPnP(W,bullet);
                if (d<0 && d>dmin) {
                    dmin=d;
                    nx=W.nx;
                    ny=W.ny;
                }
            }
        }
        if (dmin>-80) {
            bullet.hit(nx,ny);
            return true;
        } else {
            return false;
        }
    }
    pbCollisions(bullet) {
        for (let player of this.players) {
            if (this.dCC(bullet,player)<=0) {
                player.HP -= bullet.dmg;
                player.vx += bullet.dmg * bullet.vx/500;
                player.vy += bullet.dmg * bullet.vy/500;
                let mod = this.dPP(bullet,player);
                let nx = (bullet.x-player.x)/mod;
                let ny = (bullet.y-player.y)/mod;
                bullet.hit(nx,ny);
                return true;
            }
        }
        return false;
    }
    step(dT) {
        let [, ...rest] = this.players
        for (var player of this.players) {
            // Increment positions from velocities
            player.a += dT * player.va;
            if (player.a>2*Math.PI) {
                player.a -= 2*Math.PI;
            } else if (player.a<-2*Math.PI) {
                player.a += 2*Math.PI;
            }
            player.x += dT * player.vx;
            player.y += dT * player.vy;
            // Detect collisions
            if (!this.wpCollisions(player)) {
                if (!this.spCollisions(player)) {
                    this.ppCollisions(player,rest);
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
            let mod = this.vMod(player.vx,player.vy);
            ax -= player.vx * this.cd * mod;
            ay -= player.vy * this.cd * mod;
            // Increment velocities from accelerations
            player.vx += dT * ax;
            player.vy += dT * ay;
            [, ...rest] = rest;
            // Subtract dT from weapon refresh timer
            player.wrefresh -= dT;
        }
        // Move bullets
        for (let bullet of this.bullets) {
            bullet.x += dT * bullet.vx;
            bullet.y += dT * bullet.vy;
            bullet.draw();
        }
        // Detect collisions
        for (let i in this.bullets) {
            if (this.wbCollisions(this.bullets[i]) || this.pbCollisions(this.bullets[i])) {
                this.bullets.splice(i,1);
            }
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
    // Module of vector
    vMod(x,y) {
        return Math.sqrt(x**2+y**2);
    }
}
