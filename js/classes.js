
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
    constructor(src,width,height,x,y,a = 0, moves = false, vx0 = 0, vy0 = 0) {
        super(src,width,height,x,y,a,moves,vx0,vy0);
        this.af = false;
        this.ab = false;
        this.al = false;
        this.ar = false;
    }
}
