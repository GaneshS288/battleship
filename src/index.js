import { GameController } from "./modules/gameController.js";
import { createGameBoard, Render } from "./modules/dom.js";
import { PubSub } from "./modules/pubsub.js"
import styles from "./styles/styles.css";

let gameController = new GameController();

//Render gameBoard needs to come before Render idleAreas because idleAreas need width and height from rendered gameBoard cells
PubSub.subscribe("opponent selection prompted", Render.opponentSelection.bind(Render));
PubSub.subscribe("player changed", Render.playerNames);
PubSub.subscribe("gameBoard changed", Render.gameBoards);
PubSub.subscribe("player changed", Render.gameBoards);
PubSub.subscribe("idle area changed", Render.idleAreas);
PubSub.subscribe("player changed", Render.idleAreas);
PubSub.subscribe("gameBoard changed", Render.footer);
PubSub.subscribe("player changed", Render.footer);
PubSub.subscribe("attack successful", Render.footer);

PubSub.subscribe("opponent selected", gameController.initializePlayers.bind(gameController));
PubSub.subscribe("ship placed", gameController.activePlayerPlacesShip.bind(gameController));
PubSub.subscribe("ship removed", gameController.activePlayerRemovesShip.bind(gameController));
PubSub.subscribe("change player", gameController.changeActivePlayer.bind(gameController));
PubSub.subscribe("alignment changed", gameController.changeActivePlayerShipAlignment.bind(gameController));
PubSub.subscribe("player attacked", gameController.activePlayerAttacks.bind(gameController));

Render.startButton();