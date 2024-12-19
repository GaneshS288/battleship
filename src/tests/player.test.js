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

  test("Create ships", () => {
    const humanPlayer = new HumanPlayer("Ganesh");
    humanPlayer.createShips();
    const idleShips = humanPlayer.idleShips.map((ship) => ship.type);

    expect(idleShips[0]).toBe("gunboat one");
    expect(idleShips[1]).toBe("gunboat two");
    expect(idleShips[2]).toBe("schooner one");
    expect(idleShips[3]).toBe("schooner two");
    expect(idleShips[4]).toBe("brig");
    expect(idleShips[5]).toBe("men of war");
  });

  test("place idle ship on player's board", () => {
    const humanPlayer = new HumanPlayer("Ganesh");
    humanPlayer.createShips();
    const ship = humanPlayer.idleShips[0];
    const secondShip = humanPlayer.idleShips[1];

    expect(humanPlayer.placeShip([0, 3], humanPlayer.gameBoard, ship)).toBe(
      true
    );
    expect(
      humanPlayer.placeShip([0, 3], humanPlayer.gameBoard, secondShip)
    ).toBe(false);
    expect(humanPlayer.idleShips.includes(ship)).toBe(false);
    expect(humanPlayer.deployedShips.includes(ship)).toBe(true);
  });

  test("move deployed ship", () => {
    const humanPlayer = new HumanPlayer("Ganesh");
    humanPlayer.createShips();
    const ship = humanPlayer.idleShips[0];
    humanPlayer.placeShip([0, 3], humanPlayer.gameBoard, ship);

    expect(humanPlayer.moveShip([0, 4], humanPlayer.gameBoard, ship)).toBe(
      true
    );
    expect(humanPlayer.moveShip([0, 10], humanPlayer.gameBoard, ship)).toBe(
      false
    );
  });

  test("remove deployed ship", () => {
    const humanPlayer = new HumanPlayer("Ganesh");
    humanPlayer.createShips();
    const ship = humanPlayer.idleShips[0];
    humanPlayer.placeShip([0, 3], humanPlayer.gameBoard, ship);

    expect(humanPlayer.removeShip([0, 3], humanPlayer.gameBoard)).toBe(true);
    expect(humanPlayer.removeShip([0, 1], humanPlayer.gameBoard)).toBe(false);
    expect(humanPlayer.idleShips.includes(ship)).toBe(true);
    expect(humanPlayer.deployedShips.includes(ship)).toBe(false);
  });

  test("check defeat", () => {
    const humanPlayer = new HumanPlayer("Ganesh");
    humanPlayer.deployedShips.push(new Ship(1, "gunboat", "horizontal"));
    humanPlayer.deployedShips.push(new Ship(1, "gunboat", "horizontal"));
    humanPlayer.deployedShips[0].hit();
    humanPlayer.deployedShips[1].hit();

    expect(humanPlayer.isDefeated()).toBe(true);
  });

  test("returns false when not defeated", () => {
    const humanPlayer = new HumanPlayer("Ganesh");
    humanPlayer.deployedShips.push(new Ship(3, "brig", "horizontal"));

    expect(humanPlayer.isDefeated()).toBe(false);
  });
});
