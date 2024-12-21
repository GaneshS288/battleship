import { CpuPlayer, HumanPlayer } from "./player.js";

export class GameController {
  constructor() {
    this.playerOne = null;
    this.playerTwo = null;
    this.activePlayer = null;
  }

  initializePlayers(
    playerOneData = { name: "player", type: "human" },
    playerTwoData = { name: "CPU", type: "cpu" }
  ) {
    const players = [];

    [playerOneData, playerTwoData].forEach((playerData) => {
      switch (playerData.type) {
        case "human":
          players.push(new HumanPlayer(playerData.name));
        case "cpu":
          players.push(new CpuPlayer());
      }
    });

    players[0].createShips();
    players[1].createShips();
    this.playerOne = players[0];
    this.playerTwo = players[1];
    this.activePlayer = this.playerOne;
  }

  activePlayerPlacesShip(coordinates) {
    const activePlayer = this.activePlayer;
    let result;

    if (activePlayer.type === "cpu") {
      while (activePlayer.idleShips.length > 0) {
        result = activePlayer.placeShip(
          activePlayer.gameBoard,
          activePlayer.idleShips[0]
        );
      }

      this.#changeActivePlayer();
    } else if (activePlayer.type === "human") {
      result = activePlayer.placeShip(
        coordinates,
        activePlayer.gameBoard,
        activePlayer.idleShips[0]
      );
    }

    return result;
  }

  #changeActivePlayer() {
    if (this.activePlayer.idleShips.length > 0) return false;

    this.activePlayer =
      this.activePlayer === this.playerTwo ? this.playerOne : this.playerTwo;
  }
}
