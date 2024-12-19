import { Ship } from "./ship.js";

export class HumanPlayer {
    constructor(name) {
        this.name = name;
        this.attack = humanAttacks;
        this.idleShips = [];
        this.createShips = createShips;
    }
}

function humanAttacks(coordinates, gameBoard) {
    const x = coordinates[0];
    const y = coordinates[1];
    const ship = gameBoard.board[x][y].ship;
    const result = gameBoard.recieveAttack(x, y);
    
    if (result) {
        return ship ? 'hit' : 'miss';  
    }

    else return 'invalid target';
}

function createShips() {
    const gunboatOne = new Ship(2, "gunboat one", "horizontal")
    const gunboatTwo = new Ship(2, "gunboat two", "horizontal");
    const schoonerOne = new Ship(3, "schooner one", "horizontal");
    const schoonerTwo = new Ship(3, "schooner two", "horizontal");
    const brig = new Ship(4, "brig", "horizontal");
    const menOfWar = new Ship(5, "men of war", "horizontal");

    this.idleShips = [gunboatOne, gunboatTwo, schoonerOne, schoonerTwo, brig, menOfWar];
}
