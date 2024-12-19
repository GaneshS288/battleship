import { jest, expect, test, describe, xdescribe } from "@jest/globals";
import { Ship } from "../modules/ship.js";
import { GameBoard } from "../modules/gameboard.js";

//const gameBoard = new GameBoard();
//const submarine = new Ship(3, "submarine");
//const cruiser = new Ship(3, "curiser", "vertical");
//const spySubmarineHit = jest.spyOn(submarine, "hit");

describe("gameboard", () => {
  test("ship placed vertically", () => {
    const gameBoard = new GameBoard();
    const cruiser = new Ship(3, "curiser", "vertical");

    expect(gameBoard.placeShip([0, 1], cruiser)).toBe(cruiser);

    expect(gameBoard.board[0][1].ship).toBe(cruiser);
    expect(gameBoard.board[1][1].ship).toBe(cruiser);
    expect(gameBoard.board[2][1].ship).toBe(cruiser);
  });

  test("ship placed horizontally", () => {
    const gameBoard = new GameBoard();
    const submarine = new Ship(3, "submarine", "horizontal");

    expect(gameBoard.placeShip([4, 0], submarine)).toBe(submarine);

    expect(gameBoard.board[4][0].ship).toBe(submarine);
    expect(gameBoard.board[4][1].ship).toBe(submarine);
    expect(gameBoard.board[4][2].ship).toBe(submarine);
  });

  test("starting coordinates set on placed ships", () => {
    const gameBoard = new GameBoard();
    const cruiser = new Ship(3, "curiser", "vertical");
    gameBoard.placeShip([0, 1], cruiser);

    const submarine = new Ship(3, "submarine", "horizontal");
    gameBoard.placeShip([4, 0], submarine);

    expect(
      `${cruiser.startCoordinates[0]}, ${cruiser.startCoordinates[1]}`
    ).toBe("0, 1");
    expect(
      `${submarine.startCoordinates[0]}, ${submarine.startCoordinates[1]}`
    ).toBe("4, 0");
  });

  test("ship not placed with bad coordinates", () => {
    const gameBoard = new GameBoard();
    const submarine = new Ship(3, "submarine", "horizontal");
    gameBoard.placeShip([4, 0], submarine);

    const cruiser = new Ship(3, "curiser", "vertical");

    expect(gameBoard.placeShip([-1, 1], cruiser)).toBe("invalid coordinates");
    expect(gameBoard.placeShip([11, 7], cruiser)).toBe("invalid coordinates");
    expect(gameBoard.placeShip([3, 9], submarine)).toBe("invalid coordinates");
    expect(gameBoard.placeShip([4, 1], cruiser)).toBe("invalid coordinates");
  });

  test("ship removed vertically", () => {
    const gameBoard = new GameBoard();
    const cruiser = new Ship(3, "curiser", "vertical");
    gameBoard.placeShip([0, 1], cruiser);

    expect(gameBoard.removeShip([1, 1])).toBe(cruiser);
    expect(gameBoard.board[0][1].ship).toBe(null);
    expect(gameBoard.board[1][1].ship).toBe(null);
    expect(gameBoard.board[2][1].ship).toBe(null);
  });

  test("ship removed horizontally", () => {
    const gameBoard = new GameBoard();
    const submarine = new Ship(3, "submarine", "horizontal");
    gameBoard.placeShip([4, 0], submarine);

    expect(gameBoard.removeShip([4, 2])).toBe(submarine);
    expect(gameBoard.board[4][0].ship).toBe(null);
    expect(gameBoard.board[4][1].ship).toBe(null);
    expect(gameBoard.board[4][2].ship).toBe(null);
  });

  test("tryin to remove from empty coordinates returns null", () => {
    const gameBoard = new GameBoard();

    expect(gameBoard.removeShip([2, 3])).toBe(null);
  });

  test("move ship", () => {
    const gameBoard = new GameBoard();
    const gunboat = new Ship(2, "gunboat", "vertical");
    gameBoard.placeShip([2, 2], gunboat);

    expect(gameBoard.moveShip([4, 2], gunboat)).toBe(gunboat);
    expect(gameBoard.board[4][2].ship).toBe(gunboat);
    expect(gameBoard.board[5][2].ship).toBe(gunboat);
    expect(gameBoard.board[2][2].ship).toBe(null);
    expect(gameBoard.board[3][2].ship).toBe(null);
  });

  test("ship can be moved to coordinates that overlap with its old coordinates", () => {
    const gameBoard = new GameBoard();
    const gunboat = new Ship(2, "gunboat", "horizontal");
    gameBoard.placeShip([2, 2], gunboat);

    expect(gameBoard.moveShip([2, 3], gunboat)).toBe(gunboat);
    expect(gameBoard.board[2][3].ship).toBe(gunboat);
    expect(gameBoard.board[2][4].ship).toBe(gunboat);
    expect(gameBoard.board[2][2].ship).toBe(null);
  });

  test("move and change ship alignment", () => {
    const gameBoard = new GameBoard();
    const gunboat = new Ship(2, "gunboat", "horizontal");
    gameBoard.placeShip([5, 5], gunboat);

    expect(gameBoard.moveShip([5, 5], gunboat, "vertical")).toBe(gunboat);
    expect(gunboat.alignment).toBe("vertical");
    expect(gameBoard.board[5][5].ship).toBe(gunboat);
    expect(gameBoard.board[6][5].ship).toBe(gunboat);
  });

  test("returns null if moving to invalid coordinates", () => {
    const gameBoard = new GameBoard();
    const brig = new Ship(3, "brig", "vertical");
    gameBoard.placeShip([2, 3], brig);
    const gunboat = new Ship(2, "gunboat", "horizontal");
    gameBoard.placeShip([5, 5], gunboat);

    expect(gameBoard.moveShip([-1, 0], gunboat)).toBe(null);
    expect(gameBoard.moveShip([2, 3], gunboat)).toBe(null);
  });

  test("attack recieved", () => {
    const gameBoard = new GameBoard();
    const submarine = new Ship(3, "submarine", "horizontal");
    const spySubmarineHit = jest.spyOn(submarine, "hit");
    gameBoard.placeShip([0, 3], submarine);

    expect(gameBoard.recieveAttack(0, 3)).toBe(true);
    expect(gameBoard.recieveAttack(0, 5)).toBe(true);
    expect(gameBoard.recieveAttack(3, 3)).toBe(true);
    expect(gameBoard.recieveAttack(4, 2)).toBe(true);

    expect(spySubmarineHit.mock.calls.length).toBe(2);
  });

  test("attack recieved returns false if alredy targeted cell hit", () => {
    const gameBoard = new GameBoard();
    const submarine = new Ship(3, "submarine", "horizontal");
    gameBoard.placeShip([0, 3], submarine);

    gameBoard.recieveAttack(0, 3);
    gameBoard.recieveAttack(2, 3);

    expect(gameBoard.recieveAttack(0, 3)).toBe(false);
    expect(gameBoard.recieveAttack(2, 3)).toBe(false);
  });
});
