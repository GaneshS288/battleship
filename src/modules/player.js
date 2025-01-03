import { Ship } from "./ship.js";
import { GameBoard } from "./gameboard.js";

export class HumanPlayer {
  constructor(name) {
    this.name = name;
    this.type = "human";
    this.attack = humanAttacks;
    this.gameBoard = new GameBoard();
    this.idleShips = [];
    this.deployedShips = [];
    this.createShips = createShips;
    this.placeShip = humanPlacesShip;
    this.moveShip = humanMovesShip;
    this.removeShip = humanRemovesShip;
    this.isDefeated = isDefeated;
  }
}

export class CpuPlayer {
  constructor() {
    this.name = "CPU";
    this.type = "cpu";
    this.gameBoard = new GameBoard();
    this.idleShips = [];
    this.deployedShips = [];
    this.createShips = createShips;
    this.attack = cpuAttacks;
    this.placeShip = cpuPlacesShip;
    this.isDefeated = isDefeated;
  }
}

function createShips() {
  const gunboatOne = new Ship(2, "gunboat one", "horizontal");
  const gunboatTwo = new Ship(2, "gunboat two", "horizontal");
  const schoonerOne = new Ship(3, "schooner one", "horizontal");
  const schoonerTwo = new Ship(3, "schooner two", "horizontal");
  const brig = new Ship(4, "brig", "horizontal");
  const menOfWar = new Ship(5, "men of war", "horizontal");

  this.idleShips = [
    gunboatOne,
    gunboatTwo,
    schoonerOne,
    schoonerTwo,
    brig,
    menOfWar,
  ];
}

function isDefeated() {
  let isDefeated = true;

  this.deployedShips.forEach((ship) => {
    if (!ship.isSunk()) isDefeated = false;
  });

  return isDefeated;
}

function humanAttacks(coordinates, gameBoard) {
  const x = coordinates[0];
  const y = coordinates[1];
  const ship = gameBoard.board[x][y].ship;
  const result = gameBoard.recieveAttack(x, y);

  if (result) {
    //if ship was present then return hit if it was null then return miss
    return ship ? "hit" : "miss";
  } else return "invalid target";
}

function humanPlacesShip(coordinates, gameboard, ship) {
  const isSuccessful = gameboard.placeShip(coordinates, ship);

  if (isSuccessful === ship) {
    const shipIndex = this.idleShips.findIndex((idleShip) => idleShip === ship);
    this.idleShips.splice(shipIndex, 1);
    this.deployedShips.push(ship);

    return true;
  } else return false;
}

function humanMovesShip(coordinates, gameBoard, ship, alignment) {
  const isSuccessful = gameBoard.moveShip(coordinates, ship, alignment);

  if (isSuccessful === ship) return true;
  else if (isSuccessful === null) return false;
}

function humanRemovesShip(coordinates, gameBoard) {
  const ship = gameBoard.removeShip(coordinates);

  if (ship) {
    const shipIndex = this.deployedShips.findIndex(
      (deployedShip) => deployedShip === ship
    );
    this.deployedShips.splice(shipIndex, 1);
    this.idleShips.push(ship);
    return true;
  } else return false;
}

function cpuAttacks(gameBoard) {
  let result = false;
  let ship = null;

  while (result === false) {
    const [x, y] = cpuGeneratesRandomCoordinates(gameBoard.size);
    ship = gameBoard.board[x][y].ship;
    result = gameBoard.recieveAttack(x, y);
  }

  if (result) {
    //if ship was present then return hit if it was null then return miss
    return ship ? "hit" : "miss";
  } else return "invalid target";
}

function cpuPlacesShip(gameBoard, ship) {
  //randomize horizontal or vertical alignment for ship
  Math.floor(Math.random() * 2)
    ? (ship.alignment = "horizontal")
    : (ship.alignment = "vertical");

  const isSuccessful = gameBoard.placeShip(
    cpuGeneratesRandomCoordinates(gameBoard.size),
    ship
  );

  if (isSuccessful === ship) {
    const shipIndex = this.idleShips.findIndex((idleShip) => idleShip === ship);
    this.idleShips.splice(shipIndex, 1);
    this.deployedShips.push(ship);

    return true;
  } else return false;
}

function cpuGeneratesRandomCoordinates(gameBoardSize) {
  const x = Math.floor(Math.random() * gameBoardSize);
  const y = Math.floor(Math.random() * gameBoardSize);

  return [x, y];
}
