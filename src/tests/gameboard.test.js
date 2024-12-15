import { jest, expect, test, describe } from "@jest/globals";
import { Ship } from "../modules/ship.js";
import { GameBoard } from "../modules/gameboard.js";

const gameBoard = new GameBoard();
const submarine = new Ship(3, "submarine");
const cruiser = new Ship(3, "curiser", "vertical");
const spyhit = jest.spyOn(submarine, "hit");

describe("gameboard", () => {
  test("ship placed vertically", () => {
    gameBoard.placeShip([0, 1], cruiser);

    expect(gameBoard.board[0][1].ship).toBe(cruiser);
    expect(gameBoard.board[1][1].ship).toBe(cruiser);
    expect(gameBoard.board[2][1].ship).toBe(cruiser);
  });

  test("ship placed horizontally", () => {
    gameBoard.placeShip([4, 0], submarine);

    expect(gameBoard.board[4][0].ship).toBe(submarine);
    expect(gameBoard.board[4][1].ship).toBe(submarine);
    expect(gameBoard.board[4][2].ship).toBe(submarine);
  });

  test("starting coordinates set on placed ships", () => {
    expect(
      `${cruiser.startCoordinates[0]}, ${cruiser.startCoordinates[1]}`
    ).toBe("0, 1");
    expect(
      `${submarine.startCoordinates[0]}, ${submarine.startCoordinates[1]}`
    ).toBe("4, 0");
  });

  test("ship not placed with bad coordinates", () => {
    expect(gameBoard.placeShip([0, 1], cruiser)).toBe("invalid coordinates");
    expect(gameBoard.placeShip([7, 7], cruiser)).toBe("invalid coordinates");
    expect(gameBoard.placeShip([3, 9], submarine)).toBe("invalid coordinates");
    expect(gameBoard.placeShip([4, 1], cruiser)).toBe("invalid coordinates");
  });

  test("ship removed", () => {
    expect(gameBoard.removeShip([1, 1])).toBe(cruiser);
  });

  test("tryin to remove from empty coordinates returns null", () => {
    expect(gameBoard.removeShip([2, 3])).toBe(null);
  });

  test("attack recieved", () => {
    gameBoard.recieveAttack(0, 3);
    gameBoard.recieveAttack(2, 1);
    gameBoard.recieveAttack(3, 3);
    gameBoard.recieveAttack(4, 2);
    gameBoard.recieveAttack(5, 7);

    expect(spyhit.mock.calls.length).toBe(1);
  });
});
