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
        mainMenu: [["mainPVP"],["mainControls"]],
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
                    app.gameData.teams = [[['spaceship2','weapon2'],['spaceship1','weapon1'],['spaceship3','weapon3']],[['spaceship1','weapon1'],['spaceship2','weapon2'],['spaceship3','weapon3']]];
                    app.doAction("PVPContinue");
                } else {
                    app.playIntro();
                }
                break;
            case "mainPVP":
                app.menu = new Menu("t-PVPMenu","gameScreen",app.menuItems.PVPMenu,
                (selectionId)=>{app.PVPStatsUpdate(selectionId)},
                (selectionId)=>{app.PVPUpdate(selectionId)});
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
                app.menu = new Menu("t-mainMenu","gameScreen",app.menuItems.mainMenu);
                app.controlsManager.KBM = app.menu;
                aMenu.play();
                break;
            case "PVPContinue":
                app.menu = new MapMenu(app.maps,"t-mapMenu","gameScreen");
                app.controlsManager.KBM = app.menu;
                break;
            case "mapBack":
                app.gameData = {teams: [[["",""],["",""],["",""]],[["",""],["",""],["",""]]],map:''};
                app.sel = "P1S1";
                app.doAction("mainPVP");
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
        },5200);
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
        },6000);
        
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
        
    },
    PVPStatsUpdate: (selectionId) => {
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
    },
    PVPUpdate: (selectionId) => {
        let msg = document.getElementById("PVPMsg");
        let spaceshipContainer = document.getElementById("spaceshipContainer");
        let weaponContainer = document.getElementById("weaponContainer");
        const changeColors= (color) => {
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
        };
        const selectShip = (id) => {
            spaceshipContainer.classList.add("opacity-03");
            weaponContainer.classList.remove("opacity-03");
            let ship = document.getElementById(id);
            ship.classList.remove("spaceship2");
            ship.classList.remove("not-selected");
            ship.classList.add(selectionId);
        };
        const removeShip = (id) => {
            spaceshipContainer.classList.remove("opacity-03");
            weaponContainer.classList.add("opacity-03");
            let ship = document.getElementById(id);
            ship.classList.add("not-selected");
            ship.classList.remove("spaceship1","spaceship2");
            ship.classList.add("spaceship2");
        };
        const selectWeapon = (id) => {
            spaceshipContainer.classList.remove("opacity-03");
            weaponContainer.classList.add("opacity-03");
            let weapon = document.getElementById(id);
            weapon.innerHTML=`<div class="${selectionId} weapon"><div></div><div></div></div>`;
            weapon.classList.remove("not-selected");
        };
        const removeWeapon = (id) => {
            spaceshipContainer.classList.add("opacity-03");
            weaponContainer.classList.remove("opacity-03");
            let weapon = document.getElementById(id);
            weapon.innerHTML=`<div class="weapon2 weapon"><div></div><div></div></div>`;
            weapon.classList.add("not-selected");
        };
        if (selectionId=="PVPBack") {
            switch (app.sel) {
                case "P1S1":
                    app.doAction("toMainMenu");
                    break;
                case "P1W1":
                    app.gameData.teams[0][0][0] = "";
                    removeShip("team1Ship1");
                    app.menu.resetItems(app.menuItems.PVPMenu);
                    msg.innerHTML = `- <span class="blueText">Player 1</span> select Ship 1 -`;
                    app.sel = "P1S1";
                    break;
                case "P2S1":
                    app.gameData.teams[0][0][1] = "";
                    removeWeapon("team1Weapon1");
                    app.menu.resetItems(app.menuItems.PVPMenuW);
                    msg.innerHTML = `- <span class="blueText">Player 1</span> select Weapon 1 -`;
                    app.sel = "P1W1";
                    changeColors("blue");
                    break;
                case "P2W1":
                    app.gameData.teams[1][0][0] = "";
                    removeShip("team2Ship1");
                    app.menu.resetItems(app.menuItems.PVPMenu);
                    msg.innerHTML = `- <span class="redText">Player 2</span> select Ship 1 -`;
                    app.sel = "P2S1";
                    break;
                case "P2S2":
                    app.gameData.teams[1][0][1] = "";
                    removeWeapon("team2Weapon1");
                    app.menu.resetItems(app.menuItems.PVPMenuW);
                    msg.innerHTML = `- <span class="redText">Player 2</span> select Weapon 1 -`;
                    app.sel = "P2W1";
                    break;
                case "P2W2":
                    app.gameData.teams[1][1][0] = "";
                    removeShip("team2Ship2");
                    app.menu.resetItems(app.menuItems.PVPMenu);
                    msg.innerHTML = `- <span class="redText">Player 2</span> select Ship 2 -`;
                    app.sel = "P2S2";
                    break;
                case "P1S2":
                    app.gameData.teams[1][1][1] = "";
                    removeWeapon("team2Weapon2");
                    app.menu.resetItems(app.menuItems.PVPMenuW);
                    msg.innerHTML = `- <span class="redText">Player 2</span> select Weapon 2 -`;
                    app.sel = "P2W2";
                    changeColors("red");
                    break;
                case "P1W2":
                    app.gameData.teams[0][1][0] = "";
                    removeShip("team1Ship2");
                    app.menu.resetItems(app.menuItems.PVPMenu);
                    msg.innerHTML = `- <span class="blueText">Player 1</span> select Ship 2 -`;
                    app.sel = "P1S2";
                    break;
                case "P1S3":
                    app.gameData.teams[0][1][1] = "";
                    removeWeapon("team1Weapon2");
                    app.menu.resetItems(app.menuItems.PVPMenuW);
                    msg.innerHTML = `- <span class="blueText">Player 1</span> select Weapon 2 -`;
                    app.sel = "P1W2";
                    break;
                case "P1W3":
                    app.gameData.teams[0][2][0] = "";
                    removeShip("team1Ship3");
                    app.menu.resetItems(app.menuItems.PVPMenu);
                    msg.innerHTML = `- <span class="blueText">Player 1</span> select Ship 3 -`;
                    app.sel = "P1S3";
                    break;
                case "P2S3":
                    app.gameData.teams[0][2][1] = "";
                    removeWeapon("team1Weapon3");
                    app.menu.resetItems(app.menuItems.PVPMenuW);
                    msg.innerHTML = `- <span class="blueText">Player 1</span> select Weapon 3 -`;
                    app.sel = "P1W3";
                    changeColors("blue");
                    break;
                case "P2W3":
                    app.gameData.teams[1][2][0] = "";
                    removeShip("team2Ship3");
                    app.menu.resetItems(app.menuItems.PVPMenu);
                    msg.innerHTML = `- <span class="redText">Player 2</span> select Ship 3 -`;
                    app.sel = "P2S3";
                    break;
                case "ready":
                    app.gameData.teams[1][2][1] = "";
                    removeWeapon("team2Weapon3");
                    app.menu.resetItems(app.menuItems.PVPMenuW);
                    document.getElementById("PVPContinue").classList.add("opacity-03");
                    msg.innerHTML = `- <span class="redText">Player 2</span> select Weapon 3 -`;
                    app.sel = "P2W3";
                    break;
            }
        } else {
            switch (app.sel) {
                case "P1S1":
                    app.gameData.teams[0][0][0] = selectionId;
                    selectShip("team1Ship1");
                    app.menu.resetItems(app.menuItems.PVPMenuW);
                    msg.innerHTML = `- <span class="blueText">Player 1</span> select Weapon 1 -`;
                    app.sel = "P1W1";
                    break;
                case "P1W1":
                    app.gameData.teams[0][0][1] = selectionId;
                    selectWeapon("team1Weapon1");
                    app.menu.resetItems(app.menuItems.PVPMenu);
                    msg.innerHTML = `- <span class="redText">Player 2</span> select Ship 1 -`;
                    app.sel = "P2S1";
                    changeColors("red");
                    break;
                case "P2S1":
                    app.gameData.teams[1][0][0] = selectionId;
                    selectShip("team2Ship1");
                    app.menu.resetItems(app.menuItems.PVPMenuW);
                    msg.innerHTML = `- <span class="redText">Player 2</span> select Weapon 1 -`;
                    app.sel = "P2W1";
                    break;
                case "P2W1":
                    app.gameData.teams[1][0][1] = selectionId;
                    selectWeapon("team2Weapon1");
                    app.menu.resetItems(app.menuItems.PVPMenu);
                    msg.innerHTML = `- <span class="redText">Player 2</span> select Ship 2 -`;
                    app.sel = "P2S2";
                    break;
                case "P2S2":
                    app.gameData.teams[1][1][0] = selectionId;
                    selectShip("team2Ship2");
                    app.menu.resetItems(app.menuItems.PVPMenuW);
                    msg.innerHTML = `- <span class="redText">Player 2</span> select Weapon 2 -`;
                    app.sel = "P2W2";
                    break;
                case "P2W2":
                    app.gameData.teams[1][1][1] = selectionId;
                    selectWeapon("team2Weapon2");
                    app.menu.resetItems(app.menuItems.PVPMenu);
                    msg.innerHTML = `- <span class="blueText">Player 1</span> select Ship 2 -`;
                    app.sel = "P1S2";
                    changeColors("blue");
                    break;
                case "P1S2":
                    app.gameData.teams[0][1][0] = selectionId;
                    selectShip("team1Ship2");
                    app.menu.resetItems(app.menuItems.PVPMenuW);
                    msg.innerHTML = `- <span class="blueText">Player 1</span> select Weapon 2 -`;
                    app.sel = "P1W2";
                    break;
                case "P1W2":
                    app.gameData.teams[0][1][1] = selectionId;
                    selectWeapon("team1Weapon2");
                    app.menu.resetItems(app.menuItems.PVPMenu);
                    msg.innerHTML = `- <span class="blueText">Player 1</span> select Ship 3 -`;
                    app.sel = "P1S3";
                    break;
                case "P1S3":
                    app.gameData.teams[0][2][0] = selectionId;
                    selectShip("team1Ship3");
                    app.menu.resetItems(app.menuItems.PVPMenuW);
                    msg.innerHTML = `- <span class="blueText">Player 1</span> select Weapon 3 -`;
                    app.sel = "P1W3";
                    break;
                case "P1W3":
                    app.gameData.teams[0][2][1] = selectionId;
                    selectWeapon("team1Weapon3");
                    app.menu.resetItems(app.menuItems.PVPMenu);
                    msg.innerHTML = `- <span class="redText">Player 2</span> select Ship 3 -`;
                    app.sel = "P2S3";
                    changeColors("red");
                    break;
                case "P2S3":
                    app.gameData.teams[1][2][0] = selectionId;
                    selectShip("team2Ship3");
                    app.menu.resetItems(app.menuItems.PVPMenuW);
                    msg.innerHTML = `- <span class="redText">Player 2</span> select Weapon 3 -`;
                    app.sel = "P2W3";
                    break;
                case "P2W3":
                    app.gameData.teams[1][2][1] = selectionId;
                    selectWeapon("team2Weapon3");
                    spaceshipContainer.classList.add("opacity-03");
                    app.menu.resetItems([["PVPBack","PVPContinue"]],0,1);
                    document.getElementById("PVPContinue").classList.remove("opacity-03");
                    msg.innerHTML = `- Ready? -`;
                    app.sel = "ready";
                    break;
            }
        }
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
let debug = false;
app.init();
