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

class Special extends Sprite {
    constructor(type,x = 0,y = 0,width = 50,height = 50,a = 0, moves = false, vx0 = 0, vy0 = 0) {
        let src = "";
        switch (type) {
            case "immunity":
                src="img/immunity.svg";
                break;
            case "firework":
                src="img/firework.svg";
                break;
            case "bomb":
                src="img/bomb.svg";
                break;
        }
        if (x==0 && y==0) [x,y] = app.game.randPos(width,height);
        super(src,width,height,x,y,a,moves,vx0,vy0);
        this.opacity = 0;
        this.r=width/2;
        this.type=type;
    }
    use(player) {
        switch (this.type) {
            case "immunity":
                player.immune=true;
                setTimeout(()=>{player.immune = false;},5000);
                break;
            case "firework":
                player.shootFwk();
                break;
            case "bomb":
                player.setBomb();
                break;
        }
        player.special = null;
    }
    draw() {
        super.draw();
        let arnd = Math.random()*6.283;
        let rnd = Math.random();
        let rnd2 = Math.random();
        let rnd3 = Math.random();
        let mx = Math.cos(arnd);
        let my = Math.sin(arnd);
        let v = 0.04+rnd*0.02;
        let w = 3+(~~(rnd2*3));
        let t = 500+rnd3*1000;
        let cS = {r:255*rnd,g:255*rnd2,b:255*rnd3,a:1};
        let cF = {r:255*rnd,g:255*rnd2,b:255*rnd3,a:0};
        app.game.particles.push(new Particle(this.x+rnd2*40-20,this.y+rnd3*40-20,v*mx,v*my,w,t,cS,cF));
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
        this.useSpecial = false;
        this.special = null;
        this.immune = false;
    }
    drawAura() {
        let gradient = ctx.createRadialGradient(this.x, this.y, 25, this.x, this.y, 50);
        gradient.addColorStop(0, "rgba(217, 232, 160, 0.2)");
        gradient.addColorStop(1, "rgba(217, 232, 160, 0)");
        ctx.arc(this.x, this.y, 50, 0, 2 * Math.PI);
        ctx.fillStyle = gradient;
        ctx.fill();
    }
    draw() {
        if (this.immune) {
            this.opacity=0.5;
            this.drawAura();
        }
        super.draw();
        if (this.af) {
            this.boost();
            this.boost();
            this.boost();
        }
        if (this.al) this.gas(0);
        if (this.ar) this.gas(3.1416);
        if (this.ab) this.gas(-1.5708);
    }
    gas(an) {
        clearTimeout(aGTimeout);
        aGas.play();
        aGTimeout = setTimeout(()=>{
            aGas.pause();
            aGas.currentTime = 0;
        },100);
        let arnd = Math.random()*0.3;
        let rnd = Math.random();
        let rnd2 = Math.random();
        let rnd3 = Math.random();
        let a = this.a+an+arnd-0.15;
        let mx = Math.cos(a);
        let my = Math.sin(a);
        let v = 0.4+rnd*0.1;
        let w = 4+(~~(rnd2*2));
        let t = 150+rnd3*40;
        let rnd7 = 0.7+rnd*0.3;
        let cS = {r:255*rnd7,g:255*rnd7,b:255*rnd7,a:1};
        let cF = {r:255*rnd7,g:255*rnd7,b:255*rnd7,a:0};
        app.game.particles.push(new Particle(this.x+this.r*Math.cos(this.a+an)+rnd2*4-2,this.y+this.r*Math.sin(this.a+an)+rnd3*4-2,this.vx/1000+v*mx,this.vy/1000+v*my,w,t,cS,cF));
    }
    boost() {
        clearTimeout(aBTimeout);
        aBoost.play();
        aBTimeout = setTimeout(()=>{
            aBoost.pause();
            aBoost.currentTime = 0;
        },100);
        let arnd = Math.random()*0.2;
        let rnd = Math.random();
        let rnd2 = Math.random();
        let rnd3 = Math.random();
        let a = this.a+1.5708+arnd-0.1;
        let mx = Math.cos(a);
        let my = Math.sin(a);
        let v = 0.4+(2+rnd*0.6)*this.stats.boost/10000;
        let w = 4+(~~(rnd2*4));
        let t = 200+rnd3*60;
        let rnd5 = 0.5+rnd*0.5;
        let rnd52 = 0.5+rnd2*0.5;
        let cS = {r:255*rnd5,g:50*rnd52,b:0,a:1};
        let cF = {r:255,g:255,b:255,a:0};
        app.game.particles.push(new Particle(this.x+this.r*Math.cos(this.a+1.5708)+rnd2*12-6,this.y+this.r*Math.sin(this.a+1.5708)+rnd3*12-6,this.vx/1000+v*mx,this.vy/1000+v*my,w,t,cS,cF));
    }
    hit(nx,ny,pv) {
        if (aCollision.volume>0) {
            if (pv<-35) {
                aCollision.currentTime = 0;
                let vol = 0.04+Math.abs(pv)/4000;
                aCollision.volume = vol<=1?vol:1;
                aCollision.play();
            } else {
                clearTimeout(aDTimeout);
                aDragging.play();
                aDTimeout = setTimeout(()=>{
                    aDragging.pause();
                    aDragging.currentTime = 0;
                },100);
            }
        }
        let vMod = physics.vMod(this.vx,this.vy);
        let pnx = (this.vx)/vMod+Math.sign(this.vx)*Math.abs(ny)*0.7+nx*0.3; 
        let pny = (this.vy)/vMod+Math.sign(this.vy)*Math.abs(nx)*0.7+ny*0.3;
        let pMod = physics.vMod(pnx,pny);
        pnx /= pMod; 
        pny /= pMod;
        pv = Math.abs(pv)/350;
        let vp = vMod/1000-40*pv;
        for (let i = 0; i<3; i++) {
            let rnd = Math.random();
            let rnd2 = Math.random();
            let w = (~~(2+pv*5+rnd*4));
            let t = 300+rnd*300;
            let rnd5 = 0.5+rnd*0.5;
            let rnd52 = 0.5+rnd2*0.5;
            let cS = {r:205*rnd5,g:205*rnd52,b:0,a:1};
            let cF = {r:105*rnd5,g:105*rnd52,b:0,a:0};
            app.game.particles.push(new Particle((this.x-this.r*nx)+rnd*10-7,(this.y-this.r*ny)+rnd2*10-7,pnx*(vMod/700+pv)*rnd5,pny*(vMod/700+pv)*rnd52,w,t,cS,cF));
        }
    }
    explode() {
        for (let a = 0; a<6.28; a+=0.12) {
            let rnd = Math.random();
            let mx = Math.cos(a+rnd);
            let my = Math.sin(a+rnd);
            let v = 0.1+rnd*0.5;
            let w = 3+(~~(rnd*8));
            let t = 500+rnd*1000;
            let rnd50 = (~~(rnd*50));
            let cS = {r:255-rnd50,g:100+rnd50,b:0,a:1};
            let cF = {r:255-rnd50,g:255-rnd50,b:0,a:0};
            app.game.particles.push(new Particle(this.x+rnd*40-20,this.y+rnd*40-20,v*mx,v*my,w,t,cS,cF));
        }
        physics.explosion(this);
    }
    setBomb() {
        let a = this.a+Math.PI/2;
        let mx = Math.cos(a);
        let my = Math.sin(a);
        let bomb = new Bomb(this,this.x+mx*50,this.y+my*50);
        physics.bullets.push(bomb);
    }
    shootFwk() {
        let a = this.a-Math.PI/2;
        let mx = Math.cos(a);
        let my = Math.sin(a);
        aCannon.currentTime = 0;
        aCannon.play();
        let firework = new Firework(this,this.x+mx*30,this.y+my*30,a,this.vx,this.vy);
        physics.bullets.push(firework);
    }
    shoot() {
        if (this.wrefresh<=0) {
            let a = this.a-Math.PI/2;
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
    constructor(x, y, vx, vy, w, t, colorS, colorF = {r:0,g:0,b:0,a:0}) {
        super(x,y,null,true,vx,vy);
        this.w = w;
        this.cS = colorS; // In RGBA ex: {r:255,g:255,b:255,a:1}
        this.cF = colorF; // In RGBA
        this.c = "rgba("+colorS.r+","+colorS.g+","+colorS.b+","+colorS.a+")";
        this.t = t;
        this.dt = 0;
    }
    step(dT) {
        this.draw();
        this.dt += dT;
        if (this.dt>this.t) return false;
        this.c  = "rgba("+(this.cS.r+(this.cF.r-this.cS.r)*this.dt/this.t)
        +","+(this.cS.g+(this.cF.g-this.cS.g)*this.dt/this.t)
        +","+(this.cS.b+(this.cF.b-this.cS.b)*this.dt/this.t)
        +","+(this.cS.a+(this.cF.a-this.cS.a)*this.dt/this.t)
        +")";
        this.x += this.vx*dT;
        this.y += this.vy*dT;
        return true;
    }
    draw(){
        ctx.fillStyle = this.c;
        ctx.fillRect(this.x, this.y, this.w, this.w);
    }
}

class Bullet extends Entity {
    constructor(x, y, a, v, color, dmg, vxs = 0, vys = 0, r = 0) {
        let nx = Math.cos(a);
        let ny = Math.sin(a);
        super(x,y,a,true,v*nx+vxs,v*ny+vys);
        this.nx = nx;
        this.ny = ny;
        this.l = v/40;
        this.color = color;
        this.dmg = dmg;
        if (r) this.r = r;
        else this.r = 2+dmg/6;
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
    hit(nx,ny) {
        let pv = 2 * 0.7 * physics.pE(nx,ny,this.vx,this.vy);
        let vx = (this.vx - nx * pv)/1000; 
        let vy = (this.vy - ny * pv)/1000;
        if (pv>0) {
            vx = this.vx/1500; 
            vy = this.vy/1500;
        }
        let color = this.color.match(/\d+/g);
        for (let i = 0; i<3; i++) {
            let rnd = Math.random();
            let w = (~~(this.r/2+rnd*4));
            let t = 300+rnd*300;
            let rnd5 = 0.5+rnd*0.5;
            let rnd52 = 1-rnd*0.5;
            let cS = {r:color[0]*rnd5,g:color[1]*rnd5,b:color[2]*rnd5,a:1};
            let cF = {r:255*rnd5,g:255*rnd5,b:255*rnd5,a:0};
            app.game.particles.push(new Particle(this.x+rnd*20-10,this.y+rnd*20-10,vx*rnd5,vy*rnd52,w,t,cS,cF));
        }
    }
}

class Firework extends Bullet {
    constructor(player, x, y, a, vxs = 0, vys = 0, v = 800, color = "rgb(215, 125, 240)", dmg = 40, r = 0) {
        super(x, y, a, v, color, dmg, vxs, vys, r);
        this.player=player;
        this.exploded = false;
        this.player.useSpecial=false;
    }
    draw() {
        super.draw();
        if (this.player.useSpecial) this.explode();
    }
    hit() {
        this.explode();
    }
    explode() {
        this.exploded = true;
        let color = this.color.match(/\d+/g);
        for (let a = 0; a<6.28; a+=0.12) {
            let rnd = Math.random();
            let mx = Math.cos(a+rnd);
            let my = Math.sin(a+rnd);
            let v = 0.1+rnd*0.5;
            let w = 3+(~~(rnd*8));
            let t = 500+rnd*1000;
            let rnd5 = 0.5+rnd*0.5;
            let cS = {r:color[0]*rnd5,g:color[1]*rnd5,b:color[2]*rnd5,a:1};
            let cF = {r:255*rnd5,g:255*rnd5,b:0,a:0};
            app.game.particles.push(new Particle(this.x+rnd*40-20,this.y+rnd*40-20,v*mx,v*my,w,t,cS,cF));
        }
        physics.explosion(this);
    }
}

class Bomb extends Firework {
    constructor(player, x, y, a = 0, vxs = 0, vys = 0, v = 0, color = "rgb(168, 44, 35)", dmg = 40, r = 25) {
        super(player, x, y, a, vxs, vys, v, color, dmg, r);
        this.timer = setTimeout(()=>{this.explode();},5000);
    }
    explode() {
        clearTimeout(this.timer);
        super.explode();
    }
}
