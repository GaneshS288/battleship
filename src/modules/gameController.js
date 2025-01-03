import { CpuPlayer, HumanPlayer } from "./player.js";
import { PubSub } from "./pubsub.js";

export class GameController {
  constructor() {
    this.playerOne = {
      player: null,
      active: false,
      allShipsDeployed: false,
      ready: false,
    };
    this.playerTwo = {
      player: null,
      active: false,
      allShipsDeployed: false,
      ready: false,
    };
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

    //set false on properties to reset the game
    this.playerOne.allShipsDeployed = false
    this.playerOne.ready = false;
    this.playerOne.active = false;
    this.playerTwo.allShipsDeployed = false;
    this.playerTwo.ready = false;
    this.playerTwo.active = false;

    //assign players after populating their ships
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

  activePlayerRemovesShip(coordinates) {
    const activePlayer = this.playerOne.active
      ? this.playerOne.player
      : this.playerTwo.player;

    const result = activePlayer.removeShip(coordinates, activePlayer.gameBoard);

    if (result) {
      PubSub.publish("gameBoard changed", [this.playerOne, this.playerTwo]);
      PubSub.publish("idle area changed", [this.playerOne, this.playerTwo]);
    }
    return result;
  }

  activePlayerAttacks(coordinates) {
    const activePlayer = this.playerOne.active
      ? this.playerOne
      : this.playerTwo;
    const inactivePlayer = this.playerOne.active
      ? this.playerTwo
      : this.playerOne;

    let result;

    if (activePlayer.player.type === "cpu") {
      result = activePlayer.player.attack(inactivePlayer.player.gameBoard);
      this.changeActivePlayer();
    } else {
      result = activePlayer.player.attack(
        coordinates,
        inactivePlayer.player.gameBoard
      );
      this.changeActivePlayer();
    }

    //check if the last shot defeated player so you can skip turn and show defeat prompt
    this.#inactivePlayerReportsDefeat(activePlayer, inactivePlayer);

    PubSub.publish("attack successful", [activePlayer, inactivePlayer, result]);

    return result;
  }

  #inactivePlayerReportsDefeat(activePlayer, inactivePlayer) {
    const inactivePlayerDefeated = inactivePlayer.player.isDefeated();

    if (inactivePlayerDefeated) {
      PubSub.publish("player defeated", [
        activePlayer.player.name,
        inactivePlayer.player.name,
      ]);
      return true;
    } else return false;
  }

  changeActivePlayerShipAlignment(newAlignment) {
    const activePlayer = this.playerOne.active
      ? this.playerOne
      : this.playerTwo;

    activePlayer.player.idleShips.forEach(
      (ship) => (ship.alignment = newAlignment)
    );

    PubSub.publish("idle area changed", [this.playerOne, this.playerTwo]);
  }

  changeActivePlayer() {
    let activePlayer;

    if (!this.playerOne.active && !this.playerTwo.active) {
      this.playerOne.active = true;
      activePlayer = this.playerOne;
    } else if (this.playerOne.active && this.playerOne.allShipsDeployed) {
      this.playerOne.active = false;
      this.playerOne.ready = true;
      this.playerTwo.active = true;
      activePlayer = this.playerTwo;
    } else if (this.playerTwo.active && this.playerTwo.allShipsDeployed) {
      this.playerTwo.active = false;
      this.playerTwo.ready = true;
      this.playerOne.active = true;
      activePlayer = this.playerOne;
    }

    if (
      activePlayer.player.type === "cpu" &&
      activePlayer.allShipsDeployed === false
    ) {
      this.activePlayerPlacesShip();
    }

    PubSub.publish("player changed", [this.playerOne, this.playerTwo]);
  }
}
