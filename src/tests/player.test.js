import { jest, describe, test, expect } from "@jest/globals";
import { HumanPlayer, CpuPlayer } from "../modules/player.js";
import { GameBoard } from "../modules/gameboard.js";
import { Ship } from "../modules/ship.js";

describe("Human player", () => {
  test("Attack specified coordinates", () => {
    const gunboat = new Ship(2, "gunboat", "horizontal");
    const gameBoard = new GameBoard();
    gameBoard.placeShip([5, 5], gunboat);
    const humanPlayer = new HumanPlayer("Ganesh");

    expect(humanPlayer.attack([0, 3], gameBoard)).toBe("miss");
    expect(humanPlayer.attack([5, 5], gameBoard)).toBe("hit");
  });

  test("Return invalid for already attacked coordinates", () => {
    const gunboat = new Ship(2, "gunboat", "horizontal");
    const gameBoard = new GameBoard();
    gameBoard.placeShip([5, 5], gunboat);
    const humanPlayer = new HumanPlayer("Ganesh");

    humanPlayer.attack([0, 3], gameBoard);
    humanPlayer.attack([5, 5], gameBoard);

    expect(humanPlayer.attack([0, 3], gameBoard)).toBe("invalid target");
    expect(humanPlayer.attack([5, 5], gameBoard)).toBe("invalid target");
  });
});
