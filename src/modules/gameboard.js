class BoardNode {
  constructor() {
    this.ship = null;
    this.targeted = false;
  }
}

export class GameBoard {
  constructor(size = 10) {
    this.size = size;
    this.board = this.#createGameboard(size);
  }

  #createGameboard(size) {
    const board = [];

    for (let i = 0; i < size; i++) {
      board.push([]);

      for (let j = 0; j < size; j++) {
        board[i].push(new BoardNode());
      }
    }

    return board;
  }

  #areValidCoordinates(coordinates, alignment, ship) {
    //check if any of coordinates exceed gameboard length
    if (
      (coordinates[0] + ship.length >= this.size && alignment === "vertical") ||
      (coordinates[1] + ship.length >= this.size && alignment === "horizontal")
    ) {
      return false;
    }

    //check if the nodes that ship will occupy already contain another ship and return false in that case
    else if (alignment === "vertical") {
      for (let i = 0; i < ship.length; i++) {
        let node = this.board[coordinates[0] + i][coordinates[1]];

        if (node.ship) {
          return false;
        }
      }
    } else if (alignment === "horizontal") {
      for (let i = 0; i < ship.length; i++) {
        let node = this.board[coordinates[0]][coordinates[1] + i];

        if (node.ship) {
          return false;
        }
      }
    }

    return true;
  }

  placeShip(coordinates, alignment, ship) {
    const isValidCoor = this.#areValidCoordinates(coordinates, alignment, ship);

    if (isValidCoor && alignment === "vertical") {
      for (let i = 0; i < ship.length; i++) {
        this.board[coordinates[0] + i][coordinates[1]]["ship"] = ship;
      }
    } else if (isValidCoor && alignment === "horizontal") {
      for (let i = 0; i < ship.length; i++) {
        this.board[coordinates[0]][coordinates[1] + i]["ship"] = ship;
      }
    } else if (!isValidCoor) return "invalid coordinates";
  }

  recieveAttack(x, y) {
    const node = this.board[x][y];
    if (node.ship !== null && !node.targeted) {
      node.ship.hit();
      node.targeted = true;
    }
  }
}
