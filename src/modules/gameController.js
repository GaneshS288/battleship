import { CpuPlayer, HumanPlayer } from "./player.js";
import { PubSub } from "./pubsub.js";

export class GameController {
  constructor() {
    this.playerOne = { player: null, active: false, allShipsDeployed: false };
    this.playerTwo = { player: null, active: false, allShipsDeployed: false };
  }

  #changeShipDeployedStatus() {
    const activePlayer = this.playerOne.active
      ? this.playerOne
      : this.playerTwo;

    if (activePlayer.player.idleShips.length === 0)
      activePlayer.allShipsDeployed = true;
    else activePlayer.allShipsDeployed = false;
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
          break;
        case "cpu":
          players.push(new CpuPlayer());
          break;
      }
    });

    players[0].createShips();
    players[1].createShips();
    this.playerOne.player = players[0];
    this.playerTwo.player = players[1];

    this.changeActivePlayer();
  }

  activePlayerPlacesShip(coordinates) {
    const activePlayer = this.playerOne.active
      ? this.playerOne.player
      : this.playerTwo.player;
    let result;

    if (activePlayer.type === "cpu") {
      while (activePlayer.idleShips.length > 0) {
        result = activePlayer.placeShip(
          activePlayer.gameBoard,
          activePlayer.idleShips[0]
        );
      }
      this.#changeShipDeployedStatus();
      this.changeActivePlayer();
    } else if (activePlayer.type === "human") {
      result = activePlayer.placeShip(
        coordinates,
        activePlayer.gameBoard,
        activePlayer.idleShips[0]
      );

      if (activePlayer.idleShips.length === 0) this.#changeShipDeployedStatus();
    }

    if (result === true) {
      PubSub.publish("gameBoard changed", [this.playerOne, this.playerTwo]);
      PubSub.publish("idle area changed", [this.playerOne, this.playerTwo]);
    }

    return result;
  }

  changeActivePlayer() {
    let activePlayer;

    if (!this.playerOne.active && !this.playerTwo.active) {
      this.playerOne.active = true;
      activePlayer = this.playerOne;
    } else if (this.playerOne.active && this.playerOne.allShipsDeployed) {
      this.playerOne.active = false;
      this.playerTwo.active = true;
      activePlayer = this.playerTwo;
    } else if (this.playerTwo.active && this.playerTwo.allShipsDeployed) {
      this.playerTwo.active = false;
      this.playerOne.active = true;
      activePlayer = this.playerOne;
    }

    PubSub.publish("gameBoard changed", [this.playerOne, this.playerTwo]);
    PubSub.publish("idle area changed", [this.playerOne, this.playerTwo]);
  }
}
