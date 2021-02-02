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
    constructor(stats,weapon,src,width,height,x,y,a = 0, moves = false, vx0 = 0, vy0 = 0) {
        super(src,width,height,x,y,a,moves,vx0,vy0);
        this.af = false;
        this.ab = false;
        this.al = false;
        this.ar = false;
        this.stats = stats;
        this.weapon = weapon;
        this.wrefresh = 0;
        this.r = 25;
        this.shooting = false;
    }
    shoot() {
        if (this.wrefresh<=0) {
            let a = this.a-Math.PI/2
            let mx = Math.cos(a);
            let my = Math.sin(a);
            let bullet = new Bullet(this.x+mx*30,this.y+my*30,a,this.weapon.v,this.weapon.color,this.weapon.dmg);
            physics.bullets.push(bullet);
            bullet.draw();
            this.wrefresh = this.weapon.freq;
        }
    }
}

class Bullet extends Entity {
    constructor(x, y, a, v, color, dmg) {
        let nx = Math.cos(a);
        let ny = Math.sin(a);
        super(x,y,a,true,v*nx,v*ny);
        this.nx = nx;
        this.ny = ny;
        this.l = v/50;
        this.color = color;
        this.dmg = dmg;
    }
    draw() {
        let mx = this.l/2*this.nx;
        let my = this.l/2*this.ny;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.x-mx, this.y-my);
        ctx.lineTo(this.x+mx, this.y+my);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.restore();
    }
}
