let app = {
    swapScreen: (id1,id2) => {
        document.getElementById(id1).classList.add("display-none");
        document.getElementById(id2).classList.remove("display-none");
    }
}

class Screen {

}

class Menu extends Screen {

}

class Game extends Screen {

}