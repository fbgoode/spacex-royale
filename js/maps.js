class Map {
    constructor(map) {
        this.walls = [];
        this.salients = [];
        this.entities = {};
        this.build(map);
        this.name = map.name;
    }
    build(map) {
        for (let key in map) {
            if (key=="name") continue;
            let entity;
            switch (map[key].type) {
                case "Polyblock":
                    entity = new Polyblock (map[key].points,map[key].outer,map[key].color);
                    break;
                case "Block":
                    entity = new Block (map[key].width,map[key].height,map[key].x,map[key].y,map[key].color);
                    break;
                case "OuterBox":
                    entity = new OuterBox ();
                    break;
            }
            if (entity) {
                this.entities[key] = entity;
                this.walls.push(...entity.walls);
                this.salients.push(...entity.salients);
            }
        }
    }
}

let map1 = {
    name:"Nostalgia",
    outer:{
        type:"OuterBox"
    },
    block:{
        type:"Block",
        width:700,
        height:300,
        x:960,
        y:540
    }
}

let map2 = {
    name:"Arena",
    outer:{
        type:"Polyblock",
        points:[
            {x:0,y:0},
            {x:700,y:0},
            {x:740,y:40},
            {x:840,y:40},
            {x:860,y:0},
            {x:1920,y:0},
            {x:1920,y:1080},
            {x:1220,y:1080},
            {x:1180,y:1040},
            {x:1080,y:1040},
            {x:1040,y:1080},
            {x:0,y:1080}
        ],
        outer:true,
        color:"rgba(50, 168, 68, 0.5)"
    },
    TL:{
        type:"Polyblock",
        points:[
            {x:340,y:200},
            {x:840,y:200},
            {x:880,y:160},
            {x:880,y:120},
            {x:840,y:80},
            {x:740,y:80},
            {x:700,y:120},
            {x:260,y:120},
            {x:200,y:180},
            {x:200,y:800},
            {x:260,y:860},
            {x:340,y:820}
        ],
        color:"rgba(168, 64, 50, 0.5)"
    },
    BL:{
        type:"Polyblock",
        points:[
            {x:300,y:900},
            {x:340,y:940},
            {x:840,y:940},
            {x:880,y:900},
            {x:880,y:880},
            {x:840,y:840},
            {x:420,y:840}
        ],
        color:"rgba(168, 64, 50, 0.5)"
    },
    BR:{
        type:"Polyblock",
        points:[
            {x:1580,y:880},
            {x:1080,y:880},
            {x:1040,y:920},
            {x:1040,y:960},
            {x:1080,y:1000},
            {x:1180,y:1000},
            {x:1220,y:960},
            {x:1660,y:960},
            {x:1720,y:900},
            {x:1720,y:280},
            {x:1660,y:220},
            {x:1580,y:260}
        ],
        color:"rgba(50, 84, 168, 0.5)"
    },
    TR:{
        type:"Polyblock",
        points:[
            {x:1620,y:180},
            {x:1580,y:140},
            {x:1080,y:140},
            {x:1040,y:180},
            {x:1040,y:200},
            {x:1080,y:240},
            {x:1500,y:240}
        ],
        color:"rgba(50, 84, 168, 0.5)"
    }
}

let map3 = {
    name:"Diamond",
    outer:{
        type:"Polyblock",
        points:[
            {x:0,y:0},
            {x:800,y:0},
            {x:880,y:180},
            {x:960,y:200},
            {x:1040,y:180},
            {x:1120,y:0},
            {x:1920,y:0},
            {x:1920,y:1080},
            {x:1120,y:1080},
            {x:1040,y:900},
            {x:960,y:880},
            {x:880,y:900},
            {x:800,y:1080},
            {x:0,y:1080}
        ],
        outer:true,
        color:"rgba(115, 50, 168, 0.5)"
    },
    Center:{
        type:"Polyblock",
        points:[
            {x:680,y:540},
            {x:960,y:700},
            {x:1240,y:540},
            {x:960,y:380}
        ],
        color:"rgba(168, 50, 152, 0.5)"
    },
    SquareL1:{
        type:"Polyblock",
        points:[
            {x:360,y:80},
            {x:340,y:160},
            {x:420,y:180},
            {x:440,y:100}
        ],
        color:"rgba(50, 168, 139, 0.5)"
    },
    SquareL2:{
        type:"Polyblock",
        points:[
            {x:520,y:120},
            {x:500,y:200},
            {x:580,y:220},
            {x:600,y:140}
        ],
        color:"rgba(119, 168, 50, 0.5)"
    },
    SquareL3:{
        type:"Polyblock",
        points:[
            {x:320,y:240},
            {x:300,y:320},
            {x:380,y:340},
            {x:400,y:260}
        ],
        color:"rgba(50, 72, 168, 0.5)"
    },
    SquareL4:{
        type:"Polyblock",
        points:[
            {x:480,y:280},
            {x:460,y:360},
            {x:540,y:380},
            {x:560,y:300}
        ],
        color:"rgba(168, 150, 50, 0.5)"
    },
    SquareL5:{
        type:"Polyblock",
        points:[
            {x:280,y:400},
            {x:260,y:480},
            {x:340,y:500},
            {x:360,y:420}
        ],
        color:"rgba(168, 50, 140, 0.5)"
    },
    SquareL6:{
        type:"Polyblock",
        points:[
            {x:120,y:360},
            {x:100,y:440},
            {x:180,y:460},
            {x:200,y:380}
        ],
        color:"rgba(168, 78, 50, 0.5)"
    },
    SquareR1:{
        type:"Polyblock",
        points:[{x:1560,y:1000},{x:1580,y:920},{x:1500,y:900},{x:1480,y:980}],
        color:"rgba(50, 168, 139, 0.5)"
    },
    SquareR2:{
        type:"Polyblock",
        points:[{x:1400,y:960},{x:1420,y:880},{x:1340,y:860},{x:1320,y:940}],
        color:"rgba(119, 168, 50, 0.5)"
    },
    SquareR3:{
        type:"Polyblock",
        points:[{x:1600,y:840},{x:1620,y:760},{x:1540,y:740},{x:1520,y:820}],
        color:"rgba(50, 72, 168, 0.5)"
    },
    SquareR4:{
        type:"Polyblock",
        points:[{x:1440,y:800},{x:1460,y:720},{x:1380,y:700},{x:1360,y:780}],
        color:"rgba(168, 150, 50, 0.5)"
    },
    SquareR5:{
        type:"Polyblock",
        points:[{x:1640,y:680},{x:1660,y:600},{x:1580,y:580},{x:1560,y:660}],
        color:"rgba(168, 50, 140, 0.5)"
    },
    SquareR6:{
        type:"Polyblock",
        points:[{x:1800,y:720},{x:1820,y:640},{x:1740,y:620},{x:1720,y:700}],
        color:"rgba(168, 78, 50, 0.5)"
    }
}

let xyMirror = (Ps) => {
    for (let P of Ps) {
        P.x = 1920-P.x;
        P.y = 1080-P.y;
    }
}