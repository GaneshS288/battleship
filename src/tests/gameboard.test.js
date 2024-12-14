import { jest, expect, test, describe } from "@jest/globals";
import { Ship } from "../modules/ship.js";
import { GameBoard } from "../modules/gameboard.js";

const gameBoard = new GameBoard(8);
const submarine = new Ship(3, "submarine");

gameBoard.board[2][3].ship = submarine;
gameBoard.board[3][3].ship = submarine;
gameBoard.board[4][3].ship = submarine;

const spyhit = jest.spyOn(submarine, "hit");

describe("gameboard", () => {
  test("attack recived", () => {
    gameBoard.recieveAttack(2, 3);
    gameBoard.recieveAttack(3, 3);
    gameBoard.recieveAttack(4, 2);
    gameBoard.recieveAttack(5, 7);

    expect(spyhit.mock.calls.length).toBe(2);
  });
});
