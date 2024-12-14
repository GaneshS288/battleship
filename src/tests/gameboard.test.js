import { jest, expect, test, describe } from "@jest/globals";
import { Ship } from "../modules/ship";
import { GameBoard } from "../modules/gameboard";

const gameBoard = new GameBoard();
const submarine = new Ship(3, "submarine");

gameBoard.board[2][3] = submarine;
gameBoard.board[3][3] = submarine;
gameBoard.board[4][3] = submarine;

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
