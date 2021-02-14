
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
    mMove(row,col) {
        this.selection.classList.remove("selected");
        this.row = row;
        this.col = col;
        this.selectionId = this.menuItemIds[row][col];
        this.selection = this.menuItems[row][col];
        this.selection.classList.add("selected");
        this.onMove(this.selectionId);
    }
    mMoveTo(item) {
        for (let i=0; i < this.menuItemIds.length; i++) {
            for (let j=0; j < this.menuItemIds[i].length; j++) {
                if (item == this.menuItemIds[i][j]) {
                    this.mMove(i,j);
                    return;
                }
            }
        }
    }
    select() {
        app.doAction(this.selectionId);
        this.onSelect(this.selectionId);
    }
}

class MapMenu extends Menu {
    constructor (maps,tempid,containerid) {
        super(tempid,containerid,[[]],()=>{},(selection)=>{app.selectMap(selection)});
        this.mapIds=[[]];
        this.addMapOptions(maps);
        this.resetItems(this.mapIds)
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