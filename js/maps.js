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
        outer:true
    },
    TL:{
        type:"Polyblock",
        points:[
            {x:340,y:220},
            {x:840,y:220},
            {x:880,y:180},
            {x:880,y:140},
            {x:840,y:100},
            {x:740,y:100},
            {x:700,y:140},
            {x:260,y:140},
            {x:200,y:200},
            {x:200,y:800},
            {x:260,y:860},
            {x:340,y:820}
        ]
    },
    BL:{
        type:"Polyblock",
        points:[
            {x:320,y:900},
            {x:360,y:940},
            {x:840,y:940},
            {x:880,y:900},
            {x:880,y:880},
            {x:840,y:840},
            {x:440,y:840}
        ]
    },
    BR:{
        type:"Polyblock",
        points:[
            {x:1580,y:860},
            {x:1080,y:860},
            {x:1040,y:900},
            {x:1040,y:940},
            {x:1080,y:980},
            {x:1180,y:980},
            {x:1220,y:940},
            {x:1660,y:940},
            {x:1720,y:880},
            {x:1720,y:280},
            {x:1660,y:220},
            {x:1580,y:260}
        ]
    },
    TR:{
        type:"Polyblock",
        points:[
            {x:1600,y:180},
            {x:1560,y:140},
            {x:1080,y:140},
            {x:1040,y:180},
            {x:1040,y:200},
            {x:1080,y:240},
            {x:1480,y:240}
        ]
    }
}

let xyMirror = (Ps) => {
    for (let P of Ps) {
        P.x = 1920-P.x;
        P.y = 1080-P.y;
    }
}