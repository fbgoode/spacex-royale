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
            if (Physics.bWP(W,player)) {
                let d = Physics.dPnC(W,player);
                if (d<dmin && d>-2*player.r) {
                    dmin = d;
                    Col = W;
                }
            }
        }
        if (dmin) {
            player.x -= Col.nx * 2 * dmin;
            player.y -= Col.ny * 2 * dmin;
            let pv = 2 * this.ce * Physics.pE(Col.nx,Col.ny,player.vx,player.vy);
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
            let d = Physics.dPC(P,player);
            if (d<dmin) {
                dmin = d;
                Col = P;
                mod = Physics.dPP(P,player);
            }
        }
        if (dmin) {
            let nx = (player.x-Col.x)/mod;
            let ny = (player.y-Col.y)/mod;
            player.x -= nx * 2 * dmin;
            player.y -= ny * 2 * dmin;
            let pv = 2 * this.ce * Physics.pE(nx,ny,player.vx,player.vy);
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
            let d = Physics.dCC(C,player);
            if (d<dmin) {
                dmin = d;
                Col = C;
                mod = Physics.dPP(C,player);
            }
        }
        if (dmin) {
            let nx = (player.x-Col.x)/mod;
            let ny = (player.y-Col.y)/mod;
            player.x -= nx * 2 * dmin;
            player.y -= ny * 2 * dmin;
            let pv = this.ce * Physics.pE(nx,ny,player.vx-Col.vx,player.vy-Col.vy);
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
    explosion(P) {
        aExplosion.currentTime = 0;
        aExplosion.play();
        for (let player of this.players) {
            if (player.opacity >= 1 && (player.x!=P.x || player.y!=P.y)) {
                let d = Physics.dPP(P,player);
                if (d<500) {
                    let v = (500-d)/2+(500-d)**2/80;
                    let nx = player.x-P.x;
                    let ny = player.y-P.y;
                    let mod = Physics.vMod(nx,ny);
                    player.vx += v*nx/mod;
                    player.vy += v*ny/mod;
                    player.HP -= v/10;
                }
            }
        }
    }
    wbCollisions(bullet) {
        let dmin = 2000;
        let nx;
        let ny;
        for (let W of this.walls) {
            if (!Physics.bWP(W,bullet)) continue;
            let d = Physics.dPnP(W,bullet);
            if (Math.abs(d)<Math.abs(dmin)) {
                dmin = d;
                nx = W.nx;
                ny = W.ny;
            }
        }
        for (let S of this.salients) {
            let d = Physics.dPP(S,bullet);
            if (Math.abs(d)<Math.abs(dmin)) {
                dmin = d;
                [nx,ny] = Physics.uPP(S,bullet);
            }
        }
        if (dmin - bullet.r <0) {
            bullet.hit(nx,ny);
            aZap.currentTime = 0;
            aZap.play();
            return true;
        } else {
            return false;
        }
    }
    pbCollisions(bullet) {
        for (let player of this.players) {
            if (player.opacity >= 1 && Physics.dCC(bullet,player)<=0) {
                player.HP -= bullet.dmg;
                player.vx += bullet.dmg * bullet.vx/500;
                player.vy += bullet.dmg * bullet.vy/500;
                let mod = Physics.dPP(bullet,player);
                let nx = (bullet.x-player.x)/mod;
                let ny = (bullet.y-player.y)/mod;
                bullet.hit(nx,ny);
                if (aCollision.volume>0) {
                    aCollision.currentTime = 0;
                    let vol = 0.008+bullet.dmg/2000;
                    aCollision.volume = vol<=1?vol:1;
                    aCollision.play();
                }
                
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
            // Turn
            if (player.t) {
                player.va += 40*player.t*dT;
                if (player.va>5) player.va = 5;
                else if (player.va<-5) player.va = -5;
            } else {
                player.va = 0;
            }
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
            let mod = Physics.vMod(player.vx,player.vy);
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
            if (this.wbCollisions(this.bullets[i]) || this.pbCollisions(this.bullets[i]) || this.bullets[i].exploded) {
                this.bullets.splice(i,1);
            }
        }
    }
    // Is point in front of wall?
    static bWP(W,P) {
        let Pn = {
            nx: W.ny,
            ny: -W.nx,
            x: W.x+W.l*W.ny/2,
            y: W.y-W.l*W.nx/2
        };
        let d = Physics.dPnP(Pn,P);
        return (d<=0 && W.l>=-d);
    }
    // Distance between point and point
    static dPP(P1,P2) {
        return Math.sqrt((P1.x-P2.x)**2+(P1.y-P2.y)**2);
    }
    // Distance between plane and point
    static dPnP(Pn,P) {
        return Physics.pE(Pn.nx,Pn.ny,P.x-Pn.x,P.y-Pn.y);
    }
    // Distance between plane and circle
    static dPnC(Pn,C) {
        return (Physics.dPnP(Pn,C)-C.r);
    }
    // Distance between point and circle
    static dPC(P,C) {
        return (Physics.dPP(P,C)-C.r);
    }
    // Distance between circle and circle
    static dCC(C1,C2) {
        return (Physics.dPP(C1,C2)-C1.r-C2.r);
    }
    // Scalar product
    static pE(x,y,x2,y2) {
        return (x*x2+y*y2);
    }
    // Cross product z component
    static pVz(x,y,x2,y2) {
        return (x*y2-y*x2);
    }
    // Module of vector
    static vMod(x,y) {
        return Math.sqrt(x**2+y**2);
    }
    // Rotate vector
    static vRotate(x,y,a) {
        let ax = math.cos(a);
        let ay = math.sin(a);
        return [ax*x-ay*y, ay*x+ax*y];
    }
    // Unit vector between points
    static uPP(P1,P2) {
        let x = P2.x-P1.x;
        let y = P2.y-P1.y;
        let mod = Physics.vMod(x,y);
        return [x/mod,y/mod];
    }
}
