import { jest, describe, expect, test } from "@jest/globals";
import { GameController } from "../modules/gameController.js";
import { CpuPlayer, HumanPlayer } from "../modules/player.js";

describe("game controller", () => {
  test("initialize players", () => {
    const gameController = new GameController();
    gameController.initializePlayers(
      { name: "Ganesh", type: "human" },
      { name: "CPU", type: "cpu" }
    );

    expect(gameController.playerOne.player instanceof HumanPlayer).toBe(true);
    expect(gameController.playerTwo.player instanceof CpuPlayer).toBe(true);
  });

  test("active player places ships", () => {
    const gameController = new GameController();
    gameController.initializePlayers(
      { name: "Ganesh", type: "human" },
      { name: "CPU", type: "cpu" }
    );

    expect(gameController.activePlayerPlacesShip([0, 0])).toBe(true);
    expect(gameController.activePlayerPlacesShip([0, 0])).toBe(false);
    expect(gameController.activePlayerPlacesShip([1, 0])).toBe(true);
    expect(gameController.activePlayerPlacesShip([2, 0])).toBe(true);
    expect(gameController.activePlayerPlacesShip([3, 0])).toBe(true);
    expect(gameController.activePlayerPlacesShip([4, 0])).toBe(true);
    expect(gameController.activePlayerPlacesShip([6, 0])).toBe(true);
  });

  test("active player places ship works with cpu player", () => {
    const gameController = new GameController();
    gameController.initializePlayers(
      { name: "Ganesh", type: "human" },
      { name: "CPU", type: "cpu" }
    );

    gameController.playerOne.active = false;
    gameController.playerTwo.active = true;
    expect(gameController.activePlayerPlacesShip()).toBe(true);
    expect(gameController.playerOne.active).toBe(true);
    expect(gameController.playerTwo.player.idleShips.length).toBe(0);
  });

  test("active player can remove ships", () => {
    const gameController = new GameController();
    gameController.initializePlayers(
      { name: "Ganesh", type: "human" },
      { name: "CPU", type: "cpu" }
    );

    gameController.activePlayerPlacesShip([3, 3]);

    expect(gameController.activePlayerRemovesShip([3, 3])).toBe(true);
    expect(gameController.playerOne.player.deployedShips.length).toBe(0);
  });

  test("trying to remove from empty cell returns false", () => {
    const gameController = new GameController();
    gameController.initializePlayers(
      { name: "Ganesh", type: "human" },
      { name: "CPU", type: "cpu" }
    );

    expect(gameController.activePlayerRemovesShip([3, 3])).toBe(false);
  });

  test("active players can attack other player's gameBoard", () => {
    const gameController = new GameController();
    gameController.initializePlayers(
      { name: "Ganesh", type: "human" },
      { name: "Rahul", type: "human" }
    );

    gameController.activePlayerPlacesShip([0, 1]);
    gameController.playerOne.active = false;
    gameController.playerTwo.active = true;
    gameController.playerTwo.allShipsDeployed = true;
    expect(gameController.activePlayerAttacks([0, 1])).toBe("hit");
  });
});
