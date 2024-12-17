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

  #areValidCoordinates(coordinates, ship) {
    const x = coordinates[0];
    const y = coordinates[1];
    //check if any of coordinates exceed gameboard size
    if (x < 0 || y < 0 || x >= this.size || y >= this.size) return false;
    //check if coordinates + ship length exceed gameboard size
    else if (
      (x + ship.length >= this.size && ship.alignment === "vertical") ||
      (y + ship.length >= this.size && ship.alignment === "horizontal")
    ) {
      return false;
    }

    //check if the nodes that ship will occupy already contain a different ship and return false if they do
    else if (ship.alignment === "vertical") {
      for (let i = 0; i < ship.length; i++) {
        let node = this.board[x + i][y];

        if (node.ship === ship) continue;

        if (node.ship) {
          return false;
        }
      }
    } else if (ship.alignment === "horizontal") {
      for (let i = 0; i < ship.length; i++) {
        let node = this.board[x][y + i];

        if (node.ship === ship) continue;

        if (node.ship) {
          return false;
        }
      }
    }

    return true;
  }

  #getShipCoordinates(ship) {
    const coordinates = [];

    if (ship.alignment === "vertical") {
      for (let i = 0; i < ship.length; i++) {
        coordinates.push([
          ship.startCoordinates[0] + i,
          ship.startCoordinates[1],
        ]);
      }
    } else if (ship.alignment === "horizontal") {
      for (let i = 0; i < ship.length; i++) {
        coordinates.push([
          ship.startCoordinates[0],
          ship.startCoordinates[1] + i,
        ]);
      }
    }

    return coordinates;
  }

  placeShip(coordinates, ship) {
    const isValidCoor = this.#areValidCoordinates(coordinates, ship);

    if (isValidCoor && ship.alignment === "vertical") {
      ship.startCoordinates = coordinates;

      for (let i = 0; i < ship.length; i++) {
        this.board[coordinates[0] + i][coordinates[1]]["ship"] = ship;
      }
    } else if (isValidCoor && ship.alignment === "horizontal") {
      ship.startCoordinates = coordinates;

      for (let i = 0; i < ship.length; i++) {
        this.board[coordinates[0]][coordinates[1] + i]["ship"] = ship;
      }
    } else if (!isValidCoor) return "invalid coordinates";
  }

  removeShip(coordinates) {
    let ship = this.board[coordinates[0]][coordinates[1]].ship;

    if (ship === null) return null;

    this.#getShipCoordinates(ship).forEach((coord) => {
      this.board[coord[0]][coord[1]].ship = null;
    });

    return ship;
  }

  moveShip(coordinates, ship, alignment) {
    if (alignment !== undefined) {
      const originalAlignment = ship.alignment;
      ship.alignment = alignment;

      if (this.#areValidCoordinates(coordinates, ship)) {
        this.removeShip(ship.startCoordinates);
        this.placeShip(coordinates, ship);

        return ship;
      } else {
        ship.alignment = originalAlignment;

        return null;
      }
    } else if (this.#areValidCoordinates(coordinates, ship)) {
      this.removeShip(ship.startCoordinates);
      this.placeShip(coordinates, ship);

      return ship;
    } else return null;
  }

  recieveAttack(x, y) {
    const node = this.board[x][y];
    if (node.ship !== null && !node.targeted) {
      node.ship.hit();
      node.targeted = true;
    }
  }
}
