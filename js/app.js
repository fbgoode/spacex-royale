let app = {
    doAction: (id) => {
        switch (id) {
            case "mainPVP":
                app.menu = new Menu("t-PVPMenu","gameScreen",app.menuItems.PVPMenu);
                break;
            case "mainControls":
                app.menu = new Menu("t-controlsMenu","gameScreen",app.menuItems.controlsMenu);
                app.showControls();
                break;
            case "controlsBack":
                app.menu = new Menu("t-mainMenu","gameScreen",app.menuItems.mainMenu);
                break;
        }
    },
    showControls: () => {
        for (let key in app.gameControls) {
            document.getElementById(key).innerHTML = key.substr(2,key.length-2) + ": " + app.gameControls[key];
        }
    },
    menuItems: {
        mainMenu: [["mainPVP"],["mainControls"]],
        controlsMenu: [["controlsBack"]],
        PVPMenu: [[]]
    },
    gameControls: {
        P1Boost:"ArrowUp",
        P1TurnL:"ArrowLeft",
        P1TurnR:"ArrowRight",
        P1StrafeL:"M",
        P1StrafeR:",",
        P1Back:"ArrowDown",
        P1Shoot:".",
        P1Special:"N",
        P2Boost:"R",
        P2TurnL:"D",
        P2TurnR:"G",
        P2StrafeL:"1",
        P2StrafeR:"2",
        P2Back:"F",
        P2Shoot:"3",
        P2Special:"º"
    },
    gameControlsGP: {
        P1Boost:"",
        P1TurnL:"",
        P1TurnR:"",
        P1StrafeL:"",
        P1StrafeR:"",
        P1Back:"",
        P1Shoot:"",
        P1Special:"",
        P2Boost:"GP0[12]",
        P2TurnL:"GP0[15]",
        P2TurnR:"GP0[13]",
        P2StrafeL:"GP0[6]",
        P2StrafeR:"GP0[7]",
        P2Back:"GP0[14]",
        P2Shoot:"GP0[2]",
        P2Special:"GP0[3]"
    }
}

class Screen {
    constructor (tempid,containerid) {
        let temp = document.getElementById(tempid);
        let container = document.getElementById(containerid);
        container.innerHTML = temp.innerHTML;
    }
}

class Menu extends Screen {
    constructor (tempid,containerid,menuItemIds = [[]]) {
        super(tempid,containerid);
        this.menuItemIds = menuItemIds;
        this.menuItems = [];
        this.row = 0;
        this.col = 0;
        for (let i=0; i < this.menuItemIds.length; i++) {
            this.menuItems.push([]);
            for (let j=0; j < this.menuItemIds[i].length; j++) {
                this.menuItems[i].push(document.getElementById(this.menuItemIds[i][j]));
                this.menuItems[i][j].onmouseover = (event) => {app.menu.mMoveTo(event.target.id);};
                this.menuItems[i][j].onclick = () => {app.menu.select();};
            }
        }
        this.selectionId = this.menuItemIds[0][0];
        this.selection = this.menuItems[0][0];
        controlsManager.KBM = this;
    }
    keydownManager(e) {
        let key = e.key;
        if (key.length==1 && /^[a-x]*$/.test(key)) key=key.toUpperCase();
        let action="";
        if (e.key=="Enter") action="Shoot";
        for (let i in app.gameControls) {
            if (app.gameControls[i]==key) {
                action=i;
                break;
            }
        }
        switch(action) {
            case "P1TurnL":
            case "P2TurnL":
            case "P1StrafeL":
            case "P2StrafeL":
                this.mLeft();
                break;
            case "P1TurnR":
            case "P2TurnR":
            case "P1StrafeR":
            case "P2StrafeR":
                this.mRight();
                break;
            case "P1Boost":
            case "P2Boost":
                this.mUp();
                break;
            case "P1Back":
            case "P2Back":
                this.mDown();
                break;
            case "P1Shoot":
            case "P2Shoot":
            case "Shoot":
                this.select();
                break;
        }
    }
    keyupManager(e) {

    }
    mLeft() {
        if (this.col>0) {
            this.mMove(this.row,this.col-1);
        } else if (this.row>0) {
            this.mMove(this.row-1,this.menuItems[this.row-1].length-1);
        }
    }
    mUp() {
        if (this.row>0) {
            let newcol = (~~(this.menuItems[this.row-1].length*((this.col+1)/this.menuItems[this.row].length)))-1;
            this.mMove(this.row-1,newcol);
        } else if (this.col>0) {
            this.mMove(this.row,this.col-1);
        }
    }
    mRight() {
        if (this.col < this.menuItems[this.row].length-1) {
            this.mMove(this.row,this.col+1);
        } else if (this.row < this.menuItems.length-1) {
            this.mMove(this.row+1,0);
        }
    }
    mDown() {
        if (this.row < this.menuItems.length-1) {
            let newcol = (~~(this.menuItems[this.row+1].length*((this.col+1)/this.menuItems[this.row].length)))-1;
            this.mMove(this.row+1,newcol);
        } else if (this.col < this.menuItems[this.row].length-1) {
            this.mMove(this.row,this.col+1);
        }
    }
    mMove(row,col) {
        this.selection.classList.remove("selected");
        this.row = row;
        this.col = col;
        this.selectionId = this.menuItemIds[row][col];
        this.selection = this.menuItems[row][col];
        this.selection.classList.add("selected");
    }
    mMoveTo(item) {
        for (let i=0; i < this.menuItemIds.length; i++) {
            for (let j=0; j < this.menuItemIds[i].length; j++) {
                if (item == this.menuItemIds[i][j]) {
                    this.selection.classList.remove("selected");
                    this.row = i;
                    this.col = j;
                    this.selectionId = item;
                    this.selection = this.menuItems[i][j];
                    this.selection.classList.add("selected");
                    return;
                }
            }
        }
    }
    select() {
        app.doAction(this.selectionId);
    }
}

class Game extends Screen {

}

class ControlsManager {
    constructor(KBM) {
        this.KBM = KBM;
        this.looping = false;
        this.loop = {};
        this.gpButtons = {0:{0:false}};
    }
    kdmDelegate(e) {
        this.KBM.keydownManager(e);
    }
    kumDelegate(e) {
        this.KBM.keyupManager(e);
    }
    gpupManager(e) {
        e=this.mapKey(e);
        if (e) {
            this.kumDelegate({key:e});
        }
    }
    gpdownManager(e) {
        e=this.mapKey(e);
        if (e) {
            this.kdmDelegate({key:e});
        }
    }
    mapKey(e) {
        for (let key in app.gameControlsGP) {
            if (app.gameControlsGP[key]==e) {
                return app.gameControls[key];
            }
        }
        return false;
    }
    gpListen() {
        this.loop = setInterval(() => {controlsManager.gpLoop();},16);
        this.looping = true;
    }
    gpLoop() {
        let gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
        let stop = true;
        for (let i=0; i<gamepads.length; i++) {
            if (gamepads[i] != null) {
                stop = false;
                for (let j=0; j<gamepads[i].buttons.length; j++) {
                    if (!this.gpButtons[i][j] && gamepads[i].buttons[j].pressed){
                        this.gpdownManager("GP"+i+"["+j+"]");
                        this.gpButtons[i][j]=true;
                    } else if (this.gpButtons[i][j] && !gamepads[i].buttons[j].pressed) {
                        this.gpupManager("GP"+i+"["+j+"]");
                        this.gpButtons[i][j]=false;
                    }
                }
            }
        }
        if (stop) this.gpStop();
    }
    gpStop() {
        clearInterval(this.loop);
        this.looping = false;
    }
}

let noControls = {
    keydownManager : (e) => {},
    keyupManager : (e) => {}
};

let controlsManager = new ControlsManager(noControls);
document.addEventListener('keydown', (e) => {controlsManager.kdmDelegate(e)});
document.addEventListener('keyup', (e) => {controlsManager.kumDelegate(e)});
window.addEventListener('gamepadconnected', () => {if(!controlsManager.looping) controlsManager.gpListen();});
app.menu = new Menu("t-mainMenu","gameScreen",app.menuItems.mainMenu);