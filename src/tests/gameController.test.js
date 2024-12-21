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
      { name: "CPU", type: "cpu" },
      { name: "Ganesh", type: "human" }
    );

    expect(gameController.activePlayerPlacesShip()).toBe(true);
    expect(gameController.playerTwo.active).toBe(true);
    expect(gameController.playerOne.player.idleShips.length).toBe(0);
  });
});
