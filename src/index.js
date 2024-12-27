import { GameController } from "./modules/gameController.js";
import { createGameBoard, Render } from "./modules/dom.js";
import { PubSub } from "./modules/pubsub.js"
import styles from "./styles/styles.css";

let gameController = new GameController();

PubSub.subscribe("opponent selection prompted", Render.opponentSelection.bind(Render));
PubSub.subscribe("idle area changed", Render.idleAreas);
PubSub.subscribe("gameBoard changed", Render.gameBoards);
PubSub.subscribe("gameBoard changed", Render.footer);
PubSub.subscribe("attack successful", Render.footer);

PubSub.subscribe("opponent selected", gameController.initializePlayers.bind(gameController));
PubSub.subscribe("ship placed", gameController.activePlayerPlacesShip.bind(gameController));
PubSub.subscribe("ship removed", gameController.activePlayerRemovesShip.bind(gameController));
PubSub.subscribe("change player", gameController.changeActivePlayer.bind(gameController));
PubSub.subscribe("alignment changed", gameController.changeActivePlayerShipAlignment.bind(gameController));
PubSub.subscribe("player attacked", gameController.activePlayerAttacks.bind(gameController));

Render.startButton();