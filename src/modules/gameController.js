import { CpuPlayer, HumanPlayer } from "./player.js";

export class GameController {
  constructor() {
    this.playerOne = {player : null, active : false};
    this.playerTwo = {player : null, active : false};
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
    this.playerOne.player = players[0];
    this.playerOne.active = true;
    this.playerTwo.player = players[1];
  }

  activePlayerPlacesShip(coordinates) {
    const activePlayer = this.playerOne.active ? this.playerOne.player : this.playerTwo.player;
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
    const activePlayer = this.playerOne.active ? this.playerOne.player : this.playerTwo.player;

    if (this.playerOne.active) {
        this.playerOne.active = false
        this.playerTwo.active = true;
    }

    else if(this.playerTwo.active) {
        this.playerTwo.active = false;
        this.playerOne.active = true;
    }
  }
}
