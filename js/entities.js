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

class LifeBar extends Entity {
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
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.restore();
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
        this.opacity = 1;
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        if (this.a) {
            ctx.rotate(this.a);
        }
        if (this.opacity < 1) {
            this.opacity += 0.01;
            ctx.globalAlpha = this.opacity;
        }
        ctx.translate(-this.width * 0.5, -this.height * 0.5);
        ctx.drawImage(this.img, 0, 0, this.width, this.height);
        ctx.restore();
    }
}

class Spaceship extends Sprite {
    constructor(stats,weapon,color,src,width,height,x,y,a = 0, moves = false, vx0 = 0, vy0 = 0) {
        super(src,width,height,x,y,a,moves,vx0,vy0);
        this.af = false;
        this.ab = false;
        this.al = false;
        this.ar = false;
        this.HP = stats.HP;
        this.stats = stats;
        this.weapon = weapon;
        this.color = color;
        this.wrefresh = 0;
        this.r = 25;
        this.shooting = false;
    }
    shoot() {
        if (this.wrefresh<=0) {
            let a = this.a-Math.PI/2
            if (this.weapon.type=="single") {
                if (this.weapon.dmg<25) {
                    aClassic.currentTime = 0;
                    aClassic.play();
                } else {
                    aCannon.currentTime = 0;
                    aCannon.play();
                }
                let mx = Math.cos(a);
                let my = Math.sin(a);
                let bullet = new Bullet(this.x+mx*30,this.y+my*30,a,this.weapon.v,this.color,this.weapon.dmg,this.vx,this.vy);
                physics.bullets.push(bullet);
                this.vx -= this.weapon.dmg * this.weapon.v/500 * mx;
                this.vy -= this.weapon.dmg * this.weapon.v/500 * my;

            } else {
                aDouble.currentTime = 0;
                aDouble.play();
                let mx1 = Math.cos(a+0.35);
                let my1 = Math.sin(a+0.35);
                let mx2 = Math.cos(a-0.35);
                let my2 = Math.sin(a-0.35);
                let bullet1 = new Bullet(this.x+mx1*30,this.y+my1*30,a,this.weapon.v,this.color,this.weapon.dmg,this.vx,this.vy);
                let bullet2 = new Bullet(this.x+mx2*30,this.y+my2*30,a,this.weapon.v,this.color,this.weapon.dmg,this.vx,this.vy);
                physics.bullets.push(bullet1,bullet2);
                this.vx -= this.weapon.dmg * this.weapon.v/500 * Math.cos(a) * 2;
                this.vy -= this.weapon.dmg * this.weapon.v/500 * Math.sin(a) * 2;
            }
            this.wrefresh = this.weapon.freq;
        }
    }
}

class Particle extends Entity {
    constructor(x, y, vx, vy, w, t, colorS, colorF = "") {
        super(x,y,null,true,vx,vy);
        this.w = w;
        this.cS = colorS; // In RGB {r:255,g:255,b:255}
        this.cF = colorF; // In RGB
        this.t = t;
    }
    draw() {
    }
}

class Bullet extends Entity {
    constructor(x, y, a, v, color, dmg, vxs = 0, vys = 0) {
        let nx = Math.cos(a);
        let ny = Math.sin(a);
        super(x,y,a,true,v*nx+vxs,v*ny+vys);
        this.nx = nx;
        this.ny = ny;
        this.l = v/40;
        this.color = color;
        this.dmg = dmg;
        this.r = 2+dmg/6;
    }
    draw() {
        let mx = this.l/2*this.nx;
        let my = this.l/2*this.ny;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.x-mx, this.y-my);
        ctx.lineTo(this.x+mx, this.y+my);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.r;
        ctx.stroke();
        ctx.restore();
    }
}
