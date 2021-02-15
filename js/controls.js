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
    kdmDelegateCopy(e) {
        this.KBM.keydownManager(e);
    }
    kumDelegate(e) {
        this.KBM.keyupManager(e);
    }
    gpupManager(e) {
        let key=this.mapKey(e);
        if (key) {
            this.kumDelegate({key:key});
        }
    }
    gpdownManager(e) {
        let key=this.mapKey(e);
        if (key) {
            this.kdmDelegate({key:key});
        }
    }
    gpdownManagerCopy(e) {
        let key=this.mapKey(e);
        if (key) {
            this.kdmDelegate({key:key});
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
        this.loop = setInterval(() => {app.controlsManager.gpLoop();},16);
        this.looping = true;
        if (app.menu.isControlsMenu) app.menu.showControls();
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
        this.gpButtons = {0:{0:false}};
        this.looping = false;
        if (app.menu.isControlsMenu) app.menu.showControls();
    }
}

let noControls = {
    keydownManager : (e) => {},
    keyupManager : (e) => {}
};