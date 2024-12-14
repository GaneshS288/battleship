import { jest, expect, test, describe } from "@jest/globals";
import { Ship } from "../modules/ship.js";
import { GameBoard } from "../modules/gameboard.js";

const gameBoard = new GameBoard(8);
const submarine = new Ship(3, "submarine");
const spyhit = jest.spyOn(submarine, "hit");

describe("gameboard", () => {
  test("ship placed vertically", () => {
    gameBoard.placeShip([0, 1], "vertical", submarine);

    expect(gameBoard.board[0][1].ship).toBe(submarine);
    expect(gameBoard.board[1][1].ship).toBe(submarine);
    expect(gameBoard.board[2][1].ship).toBe(submarine);
  });

  test("ship placed horizontally", () => {
    gameBoard.placeShip([4, 0], "horizontal", submarine);

    expect(gameBoard.board[4][0].ship).toBe(submarine);
    expect(gameBoard.board[4][1].ship).toBe(submarine);
    expect(gameBoard.board[4][2].ship).toBe(submarine);
  });

  test('ship not placed with bad coordinates', () => {
    expect(gameBoard.placeShip([0,1], 'vertical', submarine)).toBe('invalid coordinates');
    expect(gameBoard.placeShip([7,7], 'vertical', submarine)).toBe('invalid coordinates');
  })

  test("attack recived", () => {
    gameBoard.recieveAttack(0, 3);
    gameBoard.recieveAttack(2, 1);
    gameBoard.recieveAttack(3, 3);
    gameBoard.recieveAttack(4, 2);
    gameBoard.recieveAttack(5, 7);

    expect(spyhit.mock.calls.length).toBe(2);
  });
});
