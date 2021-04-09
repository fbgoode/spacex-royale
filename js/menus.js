
class Screen {
    constructor (tempid,containerid) {
        let temp = document.getElementById(tempid);
        let container = document.getElementById(containerid);
        container.innerHTML = temp.innerHTML;
    }
}

class Menu extends Screen {
    constructor (tempid,containerid,menuItemIds = [[]],onMove = () => {},onSelect = () => {}) {
        super(tempid,containerid);
        this.menuItemIds = menuItemIds;
        this.menuItems = [];
        this.row = 0;
        this.col = 0;
        for (let i=0; i < this.menuItemIds.length; i++) {
            this.menuItems.push([]);
            for (let j=0; j < this.menuItemIds[i].length; j++) {
                this.menuItems[i].push(document.getElementById(this.menuItemIds[i][j]));
                this.menuItems[i][j].onmouseenter = (event) => {app.menu.mMoveTo(event.target.id);};
                this.menuItems[i][j].onclick = () => {app.menu.select();};
            }
        }
        this.selectionId = this.menuItemIds[0][0];
        this.selection = this.menuItems[0][0];
        this.onMove=onMove;
        this.onSelect=onSelect;
        this.onMove(this.selectionId);
    }
    keydownManager(e) {
        let key = e.key;
        if (key.length==1 && /^[a-z]*$/.test(key)) key=key.toUpperCase();
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
    resetItems(menuItemIds,row=0,col=0) {
        for (let i=0; i < this.menuItemIds.length; i++) {
            for (let j=0; j < this.menuItemIds[i].length; j++) {
                this.menuItems[i][j].onmouseenter = "";
                this.menuItems[i][j].onclick = "";
            }
        }
        if ( this.selection) this.selection.classList.remove("selected");
        this.menuItemIds = menuItemIds;
        this.menuItems = [];
        this.row = row;
        this.col = col;
        for (let i=0; i < this.menuItemIds.length; i++) {
            this.menuItems.push([]);
            for (let j=0; j < this.menuItemIds[i].length; j++) {
                this.menuItems[i].push(document.getElementById(this.menuItemIds[i][j]));
                this.menuItems[i][j].onmouseenter = (event) => {app.menu.mMoveTo(event.target.id);};
                this.menuItems[i][j].onclick = () => {app.menu.select();};
                if (this.selectionId==this.menuItemIds[i][j]) {
                    this.row = i;
                    this.col = j;
                }
            }
        }
        this.selectionId = this.menuItemIds[this.row][this.col];
        if (this.selectionId) {
            this.selection = this.menuItems[this.row][this.col];
            this.selection.classList.add("selected");
            this.onMove(this.selectionId);
        }
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
            newcol=(newcol<0)?0:newcol;
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
            newcol=(newcol<0)?0:newcol;
            this.mMove(this.row+1,newcol);
        } else if (this.col < this.menuItems[this.row].length-1) {
            this.mMove(this.row,this.col+1);
        }
    }
    mMove(row,col,doonmove = true) {
        this.selection.classList.remove("selected");
        this.row = row;
        this.col = col;
        this.selectionId = this.menuItemIds[row][col];
        this.selection = this.menuItems[row][col];
        this.selection.classList.add("selected");
        if (doonmove) this.onMove(this.selectionId);
    }
    mMoveTo(item,doonmove = true) {
        for (let i=0; i < this.menuItemIds.length; i++) {
            for (let j=0; j < this.menuItemIds[i].length; j++) {
                if (item == this.menuItemIds[i][j]) {
                    this.mMove(i,j,doonmove);
                    return;
                }
            }
        }
    }
    select(doonselect = true, selectionId = this.selectionId) {
        app.doAction(selectionId);
        if (doonselect) this.onSelect(selectionId);
    }
}

class ControlsMenu extends Menu {
    constructor (tempid,containerid) {
        super(tempid,containerid,[[]],()=>{},()=>{});
        this.showControls();
        this.buildMenu();
        this.isControlsMenu=true;
        this.changingControl="";
    }
    buildMenu() {
        let i = 0;
        let j = 0;
        let Ids = [[]];
        for (let key in app.gameControls) {
            Ids[j].push(key);
            i++;
            if (i%2==0) {
                Ids.push([]);
                j++;
            }
        }
        Ids[j]=['controlsBack','controlsReset'];
        this.resetItems(Ids,8);
    }
    showControls() {
        if (app.controlsManager.looping) this.showControlsGP();
        else this.showControlsKB();
    }
    showControlsGP() {
        document.getElementById("gamePadMsg").innerHTML ='<span style="color:#9cff9c">- GamePad connected -</span>';
        for (let key in app.gameControls) {
            let control = app.gameControlsGP[key];
            if (!control) control = app.gameControls[key];
            document.getElementById(key).innerHTML = key.substr(2,key.length-2) + ": " + control;
        }
    }
    showControlsKB() {
        document.getElementById("gamePadMsg").innerHTML ='- GamePad not found -';
        for (let key in app.gameControls) {
            document.getElementById(key).innerHTML = key.substr(2,key.length-2) + ": " + app.gameControls[key];
        }
    }
    select() {
        if (this.selectionId=="controlsBack" || this.selectionId=="controlsReset") {
            super.select();
            return;
        }
        this.selection.innerHTML = `<span style="color:#9cff9c">${this.selectionId.substr(2,this.selectionId.length-2)}: press key</span>`;
        this.changingControl=this.selectionId;
        app.controlsManager.kdmDelegate=(e)=>{this.changeControl(e.key);};
        app.controlsManager.gpdownManager=(key)=>{this.changeControl(key);};
        this.resetItems([[]]);
    }
    changeControl(key) {
        app.controlsManager.kdmDelegate=app.controlsManager.kdmDelegateCopy;
        app.controlsManager.gpdownManager=app.controlsManager.gpdownManagerCopy;
        if (key.length==1 && /^[a-z]*$/.test(key)) key=key.toUpperCase();
        let controls;
        if(key.substr(0,2)=="GP") controls=app.gameControlsGP;
        else controls=app.gameControls;
        for (let i in controls) {
            if (controls[i] == key) controls[i] = controls[this.changingControl];
        }
        controls[this.changingControl] = key;
        this.showControls();
        this.buildMenu();
        this.mMoveTo(this.changingControl);
        this.changingControl="";
        app.cfgSave();
    }
}

class MapMenu extends Menu {
    constructor (maps,tempid,containerid) {
        super(tempid,containerid,[[]],()=>{},(selection)=>{app.selectMap(selection)});
        this.mapIds=[[]];
        this.addMapOptions(maps);
        this.resetItems(this.mapIds);
    }
    addMapOptions(maps) {
        let html='';
        for (let key in maps) {
            html += `<div id="${key}" class="mapOption"><div class="mapTitle menuText">${maps[key].name}</div><canvas class="mapCanvas" width="1920" height="1080"></div>`;
            this.mapIds[0].push(key);
        }
        document.getElementById('mapContainer').innerHTML = html;
        let mapCanvas = document.getElementsByClassName('mapCanvas');
        let i = 0;
        for (let key in maps) {
            ctx = mapCanvas[i].getContext("2d");
            let map = new Map(maps[key]);
            for (let key in map.entities) {
                map.entities[key].draw();
            }
            i++;
        }
        this.mapIds[0].push('mapBack');
        ctx = canvas.getContext("2d");
    }
}

class PVPMenu extends Menu {
    constructor () {
        super("t-PVPMenu","gameScreen",app.menuItems.PVPMenu);
        this.onMove = (selectionId)=>{this.PVPStatsUpdate(selectionId)},
        this.onSelect = (selectionId)=>{this.PVPUpdate(selectionId)};
    }
    PVPStatsUpdate(selectionId) {
        let spaceshipName = document.getElementById("spaceshipName");
        let spaceshipStatHP = document.getElementById("spaceshipStatHP");
        let spaceshipStatSPD = document.getElementById("spaceshipStatSPD");
        let spaceshipStatGAS = document.getElementById("spaceshipStatGAS");
        let weaponName = document.getElementById("weaponName");
        let weaponStatDMG = document.getElementById("weaponStatDMG");
        let weaponStatSPD = document.getElementById("weaponStatSPD");
        let weaponStatFRQ = document.getElementById("weaponStatFRQ");
        let type = selectionId.substr(0,selectionId.length-1);
        if(type=="spaceship") {
            spaceshipName.innerHTML=app.ships[selectionId].name;
            spaceshipStatHP.style.width = `${(~~(app.ships[selectionId].HP/app.ships.shipmax.HP*100))}%`;
            spaceshipStatSPD.style.width = `${(~~(app.ships[selectionId].boost/app.ships.shipmax.boost*100))}%`;
            spaceshipStatGAS.style.width = `${(~~(app.ships[selectionId].gas/app.ships.shipmax.gas*100))}%`;
            weaponName.innerHTML="Weapon";
            weaponStatDMG.style.width = "0";
            weaponStatSPD.style.width = "0";
            weaponStatFRQ.style.width = "0";
        } else if(type=="weapon") {
            spaceshipName.innerHTML="Ship";
            spaceshipStatHP.style.width = "0";
            spaceshipStatSPD.style.width = "0";
            spaceshipStatGAS.style.width = "0";
            weaponName.innerHTML=app.weapons[selectionId].name;
            weaponStatDMG.style.width = `${(~~(app.weapons[selectionId].dmg/app.weapons.weaponmax.dmg*100))}%`;
            weaponStatSPD.style.width = `${(~~(app.weapons[selectionId].v/app.weapons.weaponmax.v*100))}%`;
            weaponStatFRQ.style.width = `${(~~(app.weapons.weaponmax.freq/app.weapons[selectionId].freq*100))}%`;
            if(app.weapons[selectionId].type=="double") document.getElementById("weaponX2").classList.remove("display-none");
            else document.getElementById("weaponX2").classList.add("display-none");
        } else {
            spaceshipName.innerHTML="Ship";
            spaceshipStatHP.style.width = "0";
            spaceshipStatSPD.style.width = "0";
            spaceshipStatGAS.style.width = "0";
            weaponName.innerHTML="Weapon";
            weaponStatDMG.style.width = "0";
            weaponStatSPD.style.width = "0";
            weaponStatFRQ.style.width = "0";
        }
    }
    changeColors(color) {
        let spaceship1 = document.getElementById("spaceship1");
        let spaceship2 = document.getElementById("spaceship2");
        let spaceship3 = document.getElementById("spaceship3");
        let weapon1 = document.getElementById("weapon1");
        let weapon2 = document.getElementById("weapon2");
        let weapon3 = document.getElementById("weapon3");
        let sc1 = "shipBlue";
        let sc2 = "shipRed";
        let wc1 = "weaponBlue";
        let wc2 = "weaponRed";
        if (color=="blue") {
            sc1 = "shipRed";
            sc2 = "shipBlue";
            wc1 = "weaponRed";
            wc2 = "weaponBlue";
        }
        spaceship1.classList.remove(sc1);
        spaceship1.classList.add(sc2);
        spaceship2.classList.remove(sc1);
        spaceship2.classList.add(sc2);
        spaceship3.classList.remove(sc1);
        spaceship3.classList.add(sc2);
        weapon1.classList.remove(wc1);
        weapon1.classList.add(wc2);
        weapon2.classList.remove(wc1);
        weapon2.classList.add(wc2);
        weapon3.classList.remove(wc1);
        weapon3.classList.add(wc2);
    }
    selectShip(id,selectionId) {
        let spaceshipContainer = document.getElementById("spaceshipContainer");
        let weaponContainer = document.getElementById("weaponContainer");
        spaceshipContainer.classList.add("opacity-03");
        weaponContainer.classList.remove("opacity-03");
        let ship = document.getElementById(id);
        ship.classList.remove("spaceship2");
        ship.classList.remove("not-selected");
        ship.classList.add(selectionId);
    }
    removeShip(id) {
        let spaceshipContainer = document.getElementById("spaceshipContainer");
        let weaponContainer = document.getElementById("weaponContainer");
        spaceshipContainer.classList.remove("opacity-03");
        weaponContainer.classList.add("opacity-03");
        let ship = document.getElementById(id);
        ship.classList.add("not-selected");
        ship.classList.remove("spaceship1","spaceship2","spaceship3");
        ship.classList.add("spaceship2");
    }
    selectWeapon(id,selectionId) {
        let spaceshipContainer = document.getElementById("spaceshipContainer");
        let weaponContainer = document.getElementById("weaponContainer");
        spaceshipContainer.classList.remove("opacity-03");
        weaponContainer.classList.add("opacity-03");
        let weapon = document.getElementById(id);
        weapon.innerHTML=`<div class="${selectionId} weapon"><div></div><div></div></div>`;
        weapon.classList.remove("not-selected");
    }
    removeWeapon(id) {
        let spaceshipContainer = document.getElementById("spaceshipContainer");
        let weaponContainer = document.getElementById("weaponContainer");
        spaceshipContainer.classList.add("opacity-03");
        weaponContainer.classList.remove("opacity-03");
        let weapon = document.getElementById(id);
        weapon.innerHTML=`<div class="weapon2 weapon"><div></div><div></div></div>`;
        weapon.classList.add("not-selected");
    }
    PVPUpdate(selectionId) {
        let msg = document.getElementById("PVPMsg");
        let spaceshipContainer = document.getElementById("spaceshipContainer");
        if (selectionId=="PVPBack") {
            switch (app.sel) {
                case "P1S1":
                    app.doAction("toMainMenu");
                    break;
                case "P1W1":
                    app.gameData.teams[0][0][0] = "";
                    this.removeShip("team1Ship1");
                    this.resetItems(app.menuItems.PVPMenu);
                    msg.innerHTML = `- <span class="blueText">Player 1</span> select Ship 1 -`;
                    app.sel = "P1S1";
                    break;
                case "P2S1":
                    app.gameData.teams[0][0][1] = "";
                    this.removeWeapon("team1Weapon1");
                    this.resetItems(app.menuItems.PVPMenuW);
                    msg.innerHTML = `- <span class="blueText">Player 1</span> select Weapon 1 -`;
                    app.sel = "P1W1";
                    this.changeColors("blue");
                    break;
                case "P2W1":
                    app.gameData.teams[1][0][0] = "";
                    this.removeShip("team2Ship1");
                    this.resetItems(app.menuItems.PVPMenu);
                    msg.innerHTML = `- <span class="redText">Player 2</span> select Ship 1 -`;
                    app.sel = "P2S1";
                    break;
                case "P2S2":
                    app.gameData.teams[1][0][1] = "";
                    this.removeWeapon("team2Weapon1");
                    this.resetItems(app.menuItems.PVPMenuW);
                    msg.innerHTML = `- <span class="redText">Player 2</span> select Weapon 1 -`;
                    app.sel = "P2W1";
                    break;
                case "P2W2":
                    app.gameData.teams[1][1][0] = "";
                    this.removeShip("team2Ship2");
                    this.resetItems(app.menuItems.PVPMenu);
                    msg.innerHTML = `- <span class="redText">Player 2</span> select Ship 2 -`;
                    app.sel = "P2S2";
                    break;
                case "P1S2":
                    app.gameData.teams[1][1][1] = "";
                    this.removeWeapon("team2Weapon2");
                    this.resetItems(app.menuItems.PVPMenuW);
                    msg.innerHTML = `- <span class="redText">Player 2</span> select Weapon 2 -`;
                    app.sel = "P2W2";
                    this.changeColors("red");
                    break;
                case "P1W2":
                    app.gameData.teams[0][1][0] = "";
                    this.removeShip("team1Ship2");
                    this.resetItems(app.menuItems.PVPMenu);
                    msg.innerHTML = `- <span class="blueText">Player 1</span> select Ship 2 -`;
                    app.sel = "P1S2";
                    break;
                case "P1S3":
                    app.gameData.teams[0][1][1] = "";
                    this.removeWeapon("team1Weapon2");
                    this.resetItems(app.menuItems.PVPMenuW);
                    msg.innerHTML = `- <span class="blueText">Player 1</span> select Weapon 2 -`;
                    app.sel = "P1W2";
                    break;
                case "P1W3":
                    app.gameData.teams[0][2][0] = "";
                    this.removeShip("team1Ship3");
                    this.resetItems(app.menuItems.PVPMenu);
                    msg.innerHTML = `- <span class="blueText">Player 1</span> select Ship 3 -`;
                    app.sel = "P1S3";
                    break;
                case "P2S3":
                    app.gameData.teams[0][2][1] = "";
                    this.removeWeapon("team1Weapon3");
                    this.resetItems(app.menuItems.PVPMenuW);
                    msg.innerHTML = `- <span class="blueText">Player 1</span> select Weapon 3 -`;
                    app.sel = "P1W3";
                    this.changeColors("blue");
                    break;
                case "P2W3":
                    app.gameData.teams[1][2][0] = "";
                    this.removeShip("team2Ship3");
                    this.resetItems(app.menuItems.PVPMenu);
                    msg.innerHTML = `- <span class="redText">Player 2</span> select Ship 3 -`;
                    app.sel = "P2S3";
                    break;
                case "ready":
                    app.gameData.teams[1][2][1] = "";
                    this.removeWeapon("team2Weapon3");
                    this.resetItems(app.menuItems.PVPMenuW);
                    document.getElementById("PVPContinue").classList.add("opacity-03");
                    msg.innerHTML = `- <span class="redText">Player 2</span> select Weapon 3 -`;
                    app.sel = "P2W3";
                    break;
            }
        } else {
            switch (app.sel) {
                case "P1S1":
                    app.gameData.teams[0][0][0] = selectionId;
                    this.selectShip("team1Ship1",selectionId);
                    this.resetItems(app.menuItems.PVPMenuW);
                    msg.innerHTML = `- <span class="blueText">Player 1</span> select Weapon 1 -`;
                    app.sel = "P1W1";
                    break;
                case "P1W1":
                    app.gameData.teams[0][0][1] = selectionId;
                    this.selectWeapon("team1Weapon1",selectionId);
                    this.resetItems(app.menuItems.PVPMenu);
                    msg.innerHTML = `- <span class="redText">Player 2</span> select Ship 1 -`;
                    app.sel = "P2S1";
                    this.changeColors("red");
                    break;
                case "P2S1":
                    app.gameData.teams[1][0][0] = selectionId;
                    this.selectShip("team2Ship1",selectionId);
                    this.resetItems(app.menuItems.PVPMenuW);
                    msg.innerHTML = `- <span class="redText">Player 2</span> select Weapon 1 -`;
                    app.sel = "P2W1";
                    break;
                case "P2W1":
                    app.gameData.teams[1][0][1] = selectionId;
                    this.selectWeapon("team2Weapon1",selectionId);
                    this.resetItems(app.menuItems.PVPMenu);
                    msg.innerHTML = `- <span class="redText">Player 2</span> select Ship 2 -`;
                    app.sel = "P2S2";
                    break;
                case "P2S2":
                    app.gameData.teams[1][1][0] = selectionId;
                    this.selectShip("team2Ship2",selectionId);
                    this.resetItems(app.menuItems.PVPMenuW);
                    msg.innerHTML = `- <span class="redText">Player 2</span> select Weapon 2 -`;
                    app.sel = "P2W2";
                    break;
                case "P2W2":
                    app.gameData.teams[1][1][1] = selectionId;
                    this.selectWeapon("team2Weapon2",selectionId);
                    this.resetItems(app.menuItems.PVPMenu);
                    msg.innerHTML = `- <span class="blueText">Player 1</span> select Ship 2 -`;
                    app.sel = "P1S2";
                    this.changeColors("blue");
                    break;
                case "P1S2":
                    app.gameData.teams[0][1][0] = selectionId;
                    this.selectShip("team1Ship2",selectionId);
                    this.resetItems(app.menuItems.PVPMenuW);
                    msg.innerHTML = `- <span class="blueText">Player 1</span> select Weapon 2 -`;
                    app.sel = "P1W2";
                    break;
                case "P1W2":
                    app.gameData.teams[0][1][1] = selectionId;
                    this.selectWeapon("team1Weapon2",selectionId);
                    this.resetItems(app.menuItems.PVPMenu);
                    msg.innerHTML = `- <span class="blueText">Player 1</span> select Ship 3 -`;
                    app.sel = "P1S3";
                    break;
                case "P1S3":
                    app.gameData.teams[0][2][0] = selectionId;
                    this.selectShip("team1Ship3",selectionId);
                    this.resetItems(app.menuItems.PVPMenuW);
                    msg.innerHTML = `- <span class="blueText">Player 1</span> select Weapon 3 -`;
                    app.sel = "P1W3";
                    break;
                case "P1W3":
                    app.gameData.teams[0][2][1] = selectionId;
                    this.selectWeapon("team1Weapon3",selectionId);
                    this.resetItems(app.menuItems.PVPMenu);
                    msg.innerHTML = `- <span class="redText">Player 2</span> select Ship 3 -`;
                    app.sel = "P2S3";
                    this.changeColors("red");
                    break;
                case "P2S3":
                    app.gameData.teams[1][2][0] = selectionId;
                    this.selectShip("team2Ship3",selectionId);
                    this.resetItems(app.menuItems.PVPMenuW);
                    msg.innerHTML = `- <span class="redText">Player 2</span> select Weapon 3 -`;
                    app.sel = "P2W3";
                    break;
                case "P2W3":
                    app.gameData.teams[1][2][1] = selectionId;
                    this.selectWeapon("team2Weapon3",selectionId);
                    spaceshipContainer.classList.add("opacity-03");
                    this.resetItems([["PVPBack","PVPContinue"]],0,1);
                    document.getElementById("PVPContinue").classList.remove("opacity-03");
                    msg.innerHTML = `- Ready? -`;
                    app.sel = "ready";
                    break;
            }
        }
    }
}

class OnlineMapMenu extends MapMenu {
    constructor (maps,tempid,containerid) {
        super (maps,tempid,containerid);
        this.onMove = (selectionId)=>{
            app.onlineController.menuchannel.send('move:'+selectionId);
        };
        this.onSelect = (selectionId)=>{
            app.onlineController.menuchannel.send('select:'+selectionId);
            app.selectOnlineMap(selectionId);
        };
        app.onlineController.menuchannel.onmessage = (message)=>{
            console.log(message);
            let data = message.data.split(':');
            if (data[0]=='move') {
                this.mMoveTo(data[1],false);
            } else if (data[0]=='select') {
                app.selectOnlineMap(data[1]);
            }
        };
    }
}

class OnlinePVPMenu extends PVPMenu {
    constructor(){
        super();
        this.onMove = (selectionId)=>{
            app.onlineController.menuchannel.send('move:'+selectionId);
            this.PVPStatsUpdate(selectionId);
        };
        this.onSelect = (selectionId)=>{
            app.onlineController.menuchannel.send('select:'+selectionId);
            this.PVPUpdate(selectionId);
        };
        app.onlineController.menuchannel.onmessage = (message)=>{
            console.log(message);
            let data = message.data.split(':');
            if (data[0]=='move') {
                this.mMoveTo(data[1],false);
                this.PVPStatsUpdate(data[1]);
            } else if (data[0]=='select') {
                this.select(false);
                this.PVPUpdate(data[1]);
            }
        };
    }
    removeControls() {
        app.controlsManager.KBM = noControls;
        for (let i=0; i < this.menuItemIds.length; i++) {
            for (let j=0; j < this.menuItemIds[i].length; j++) {
                this.menuItems[i][j].onmouseenter = () => {};
                this.menuItems[i][j].onclick = () => {};
            }
        }
    }
    PVPUpdate(selectionId) {
        if (selectionId=='PVPContinue') return;
        super.PVPUpdate(selectionId);
        if (app.sel.substr(0,2)!=this.P && app.sel!='ready') this.removeControls();
        else app.controlsManager.KBM = this;
    }
}

class ConnectingMenu extends Menu {
    constructor () {
        super("t-connectingMenu","gameScreen",[['connectingAbort']],()=>{},()=>{});
        app.onlineController = new SlaveController(app.slaveID,()=>{this.PVPMenu();});
    }
    PVPMenu() {
        app.menu = new SlavePVPMenu();
    }
}

class OnlineMenu extends Menu {
    constructor () {
        super("t-onlineMenu","gameScreen",[['onlineCopy'],['onlineBack']],()=>{},()=>{});
        app.onlineController = new HostController(()=>{this.PVPMenu();});
        this.setLink(app.onlineController.ID);
    }
    PVPMenu() {
        app.menu = new HostPVPMenu();
        app.controlsManager.KBM = app.menu;
    }
    setLink(ID){
        document.getElementById("onlineURL").innerHTML = window.location.href.split('#')[0] + '#' + ID;
    }
}

class HostPVPMenu extends OnlinePVPMenu {
    constructor(){
        super();
        this.P = 'P1';
    }
}

class SlavePVPMenu extends OnlinePVPMenu {
    constructor(){
        super();
        this.P = 'P2';
        this.removeControls();
    }
}