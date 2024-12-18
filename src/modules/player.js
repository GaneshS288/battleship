export class HumanPlayer {
    constructor(name) {
        this.name = name;
        this.attack = humanAttacks;
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
