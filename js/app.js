let app = {
    init: () => {
        app.controlsManager = new ControlsManager(noControls);
        app.cfgLoad();
        document.addEventListener('keydown', (e) => {app.controlsManager.kdmDelegate(e)});
        document.addEventListener('keyup', (e) => {app.controlsManager.kumDelegate(e)});
        window.addEventListener('gamepadconnected', () => {if(!app.controlsManager.looping) app.controlsManager.gpListen();});
        app.soundMenu();
        setTimeout(()=>{canvas.classList.add("display-block")},1000);
    },
    slaveID: window.location.hash.slice(1),
    onlineController: '',
    maps: {
        map1:map1,
        map2:map2,
        map3:map3
    },
    gameData: {
        teams: [[["",""],["",""],["",""]],[["",""],["",""],["",""]]],
        map:''
    },
    currgameData: {
        teams: [[["",""],["",""],["",""]],[["",""],["",""],["",""]]],
        map:''
    },
    sel: "P1S1",
    menuItems: {
        soundMenu: [["soundWith"],["soundWithout"]],
        mainMenu: [["mainOnline"],["mainPVP"],["mainControls"]],
        PVPMenu: [["spaceship1","spaceship2","spaceship3"],["PVPBack"]],
        PVPMenuW: [["weapon1","weapon2","weapon3"],["PVPBack"]]
    },
    gameControls: {
        P1Boost:"ArrowUp",
        P2Boost:"R",
        P1TurnL:"ArrowLeft",
        P2TurnL:"D",
        P1TurnR:"ArrowRight",
        P2TurnR:"G",
        P1StrafeL:"M",
        P2StrafeL:"1",
        P1StrafeR:",",
        P2StrafeR:"2",
        P1Back:"ArrowDown",
        P2Back:"F",
        P1Shoot:".",
        P2Shoot:"3",
        P1Special:"N",
        P2Special:"º"
    },
    gameControlsGP: {
        P1Boost:"",
        P2Boost:"GP0[12]",
        P1TurnL:"",
        P2TurnL:"GP0[15]",
        P1TurnR:"",
        P2TurnR:"GP0[13]",
        P1StrafeL:"",
        P2StrafeL:"GP0[6]",
        P1StrafeR:"",
        P2StrafeR:"GP0[7]",
        P1Back:"",
        P2Back:"GP0[14]",
        P1Shoot:"",
        P2Shoot:"GP0[2]",
        P1Special:"",
        P2Special:"GP0[3]"
    },
    defaults:{
        gameControls: {P1Boost:"ArrowUp",P2Boost:"R",P1TurnL:"ArrowLeft",P2TurnL:"D",P1TurnR:"ArrowRight",P2TurnR:"G",P1StrafeL:"M",P2StrafeL:"1",P1StrafeR:",",P2StrafeR:"2",P1Back:"ArrowDown",P2Back:"F",P1Shoot:".",P2Shoot:"3",P1Special:"N",P2Special:"º"},
        gameControlsGP: {P1Boost:"",P2Boost:"GP0[12]",P1TurnL:"",P2TurnL:"GP0[15]",P1TurnR:"",P2TurnR:"GP0[13]",P1StrafeL:"",P2StrafeL:"GP0[6]",P1StrafeR:"",P2StrafeR:"GP0[7]",P1Back:"",P2Back:"GP0[14]",P1Shoot:"",P2Shoot:"GP0[2]",P1Special:"",P2Special:"GP0[3]"}
    },
    ships: {
        shipmax: {
            HP: 650,
            boost: 2400,
            gas: 1200
        },
        spaceship1: {
            name: "Tincan",
            img: {blue:"img/ship1-b.svg",red:"img/ship1-r.svg"},
            HP: 500,
            boost: 1800,
            gas: 800
        },
        spaceship2: {
            name: "Trooper",
            img: {blue:"img/ship2-b.svg",red:"img/ship2-r.svg"},
            HP: 350,
            boost: 2400,
            gas: 1200
        },
        spaceship3: {
            name: "Heavy",
            img: {blue:"img/ship3-b.svg",red:"img/ship3-r.svg"},
            HP: 650,
            boost: 1200,
            gas: 400
        }
    },
    weapons: {
        weaponmax: {
            v: 3000,
            freq: 0.15,
            dmg: 50
        },
        weapon1: {
            name: "Classic",
            v: 1200,
            type: 'single',
            freq: 0.2,
            dmg: 15
        },
        weapon2: {
            name: "Double",
            v: 800,
            type: 'double',
            freq: 0.15,
            dmg: 8
        },
        weapon3: {
            name: "Cannon",
            v: 3000,
            type: 'single',
            freq: 0.9,
            dmg: 50
        }
    },
    cfgSave: () => {
        localStorage.setItem("gameControls",JSON.stringify(app.gameControls));
        localStorage.setItem("gameControlsGP",JSON.stringify(app.gameControlsGP));
    },
    cfgLoad: () => {
        if(localStorage.getItem("gameControls")) app.gameControls = JSON.parse(localStorage.getItem("gameControls"));
        if(localStorage.getItem("gameControlsGP")) app.gameControlsGP = JSON.parse(localStorage.getItem("gameControlsGP"));
    },
    doAction: (id) => {
        switch (id) {
            case "soundWith":
                if (debug) {
                    app.gameData.teams = [[['spaceship2','weapon2'],['spaceship1','weapon1'],['spaceship3','weapon3']],[['spaceship1','weapon1'],['spaceship2','weapon2'],['spaceship3','weapon3']]];
                    app.doAction("PVPContinue");
                } else {
                    app.playIntro();
                }
            break;
            case "skipIntro":
                clearTimeout(timeout);
                aIntro.pause();
                app.doAction("toMainMenu");
                break;
            case "soundWithout":
                aIntro.volume = 0;
                aMenu.volume = 0;
                aSwoosh.volume = 0;
                aBoost.volume = 0;
                aGas.volume = 0;
                aClassic.volume = 0;
                aDouble.volume = 0;
                aCannon.volume = 0;
                aZap.volume = 0;
                aExplosion.volume = 0;
                aCollision.volume = 0;
                aDragging.volume = 0;
                if (debug) {
                    /*app.gameData.teams = [[['spaceship2','weapon2'],['spaceship1','weapon1'],['spaceship3','weapon3']],[['spaceship1','weapon1'],['spaceship2','weapon2'],['spaceship3','weapon3']]];
                    app.doAction("PVPContinue");*/
                    app.doAction("mainOnline");
                } else {
                    app.playIntro();
                }
                break;
            case "mainOnline":
                if (app.slaveID != '') app.menu = new ConnectingMenu();
                else  app.menu = new OnlineMenu();
                app.controlsManager.KBM = app.menu;
                break;
            case "connectingAbort":
                app.onlineController.peerConnection.close();
                app.slaveID = '';
                app.onlineController = '';
                app.menu = new OnlineMenu();
                app.controlsManager.KBM = app.menu;
                break;
            case "onlineBack":
                app.doAction("toMainMenu");
                break;
            case "onlineCopy":
                let copyText = document.getElementById("onlineURL");
                let range = document.createRange();
                range.selectNode(copyText);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);
                document.execCommand("copy");
                let button = document.getElementById("onlineCopy");
                button.innerHTML = "Copied";
                setTimeout(()=>{button.innerHTML = "Copy link";},1500);
                break;
            case "mainPVP":
                app.menu = new PVPMenu();
                app.controlsManager.KBM = app.menu;
                break;
            case "mainControls":
                app.menu = new ControlsMenu("t-controlsMenu","gameScreen");
                app.controlsManager.KBM = app.menu;
                break;
            case "controlsBack":
                app.doAction("toMainMenu");
                break;
            case "controlsReset":
                for (let key in app.gameControls) {
                    app.gameControls[key] = app.defaults.gameControls[key];
                    app.gameControlsGP[key] = app.defaults.gameControlsGP[key];
                    app.cfgSave();
                }
                app.menu.showControls();
                break;
            case "toMainMenu":
                app.onlineController = '';
                app.menu = new Menu("t-mainMenu","gameScreen",app.menuItems.mainMenu);
                app.controlsManager.KBM = app.menu;
                aMenu.play();
                break;
            case "PVPContinue":
                if (app.onlineController=='') app.menu = new MapMenu(app.maps,"t-mapMenu","gameScreen");
                else app.menu = new OnlineMapMenu(app.maps,"t-mapMenu","gameScreen");
                app.controlsManager.KBM = app.menu;
                break;
            case "mapBack":
                app.gameData = {teams: [[["",""],["",""],["",""]],[["",""],["",""],["",""]]],map:''};
                app.sel = "P1S1";
                if (app.onlineController=='') {
                    app.menu = new PVPMenu();
                    app.controlsManager.KBM = app.menu;
                } else if (app.slaveID == '') {
                    app.menu = new HostPVPMenu();
                    app.controlsManager.KBM = app.menu;
                } else app.menu = new SlavePVPMenu();
                break;
        }
    },
    selectMap(selection) {
        if (selection=="mapBack") return;
        app.gameData.map=app.maps[selection];
        app.menu.resetItems([[]]);
        app.currgameData = app.gameData;
        app.gameData = {teams: [[["",""],["",""],["",""]],[["",""],["",""],["",""]]],map:''};
        app.game = new Game(app.currgameData);
        let gameScreen = document.getElementById("gameScreen");
        let gameCanvas = document.getElementById("gameCanvas");
        let stars = document.getElementById("stars");
        gameScreen.classList.add("moveDown");
        gameCanvas.classList.add("noTransform");
        stars.classList.add("bgDown");
        aMenu.pause();
        aSwoosh.play();
        setTimeout(app.startPVP,4000);
    },
    selectOnlineMap(selection) {
        if (selection=="mapBack") return;
        app.gameData.map=app.maps[selection];
        app.menu.resetItems([[]]);
        app.currgameData = app.gameData;
        app.gameData = {teams: [[["",""],["",""],["",""]],[["",""],["",""],["",""]]],map:''};
        app.game = new OnlineGame(app.currgameData);
        let gameScreen = document.getElementById("gameScreen");
        let gameCanvas = document.getElementById("gameCanvas");
        let stars = document.getElementById("stars");
        gameScreen.classList.add("moveDown");
        gameCanvas.classList.add("noTransform");
        stars.classList.add("bgDown");
        aMenu.pause();
        aSwoosh.play();
        setTimeout(app.startPVP,4000);
    },
    soundMenu: () => {
        app.menu = new Menu("t-soundMenu","gameScreen",app.menuItems.soundMenu);
        app.controlsManager.KBM = app.menu;
    },
    playIntro: () => {
        aIntro.play();
        app.menu = new Menu("t-title","gameScreen",[[]]);
        app.controlsManager.KBM = app.menu;
        setTimeout(()=>{document.getElementById("title1").classList.add("opacity-1");},1000);
        setTimeout(()=>{document.getElementById("title1").classList.remove("opacity-1");},4000);
        setTimeout(()=>{
            document.getElementById("comet").classList.add("animate");
            document.getElementById("title1").classList.add("display-none");
            document.getElementById("title2").classList.remove("display-none");
        },5200);
        setTimeout(()=>{document.getElementById("title2").classList.add("opacity-1");},6000);
        setTimeout(()=>{document.getElementById("title2").classList.remove("opacity-1");},9000);
        setTimeout(()=>{
            app.menu = new Menu("t-intro","gameScreen",[["skipIntro"]]);
            app.controlsManager.KBM = app.menu;
            setTimeout(()=>{
                document.getElementById("intro").classList.add("scroll");
            },500);
            timeout = setTimeout(()=>{
                app.menu.resetItems([[]]);
                interval = setInterval(()=>{
                    if (aIntro.volume>0) {
                        let newvol = aIntro.volume - 0.007;
                        if (newvol < 0) newvol = 0;
                        aIntro.volume = newvol;
                    } else {
                        clearInterval(interval);
                        aIntro.pause();
                        app.doAction("toMainMenu");
                    }
                },20);
            },83000);
        },11000);
        
    },
    startPVP: () => {
        app.game.start();
        app.controlsManager.KBM = app.game;
        app.sel = "P1S1";
    },
    finishGame: () => {
        let gameScreen = document.getElementById("gameScreen");
        let gameCanvas = document.getElementById("gameCanvas");
        let stars = document.getElementById("stars");
        app.game.running = false;
        app.menu = new Menu("t-mainMenu","gameScreen",app.menuItems.mainMenu);
        gameScreen.classList.remove("moveDown");
        gameCanvas.classList.remove("noTransform");
        stars.classList.remove("bgDown");
        aSwoosh.play();
        setTimeout(()=>{app.controlsManager.KBM = app.menu;},3200);
        setTimeout(()=>{aMenu.currentTime = 0;
            aMenu.play();},4450);
        
    }
}

let interval;
let timeout;
let aIntro = document.getElementById("aIntro");
let aMenu = document.getElementById("aMenu");
let aSwoosh = document.getElementById("aSwoosh");
aIntro.volume = 0.5;
aMenu.volume = 0.2;
aMenu.loop = true;
let debug = true;
app.init();