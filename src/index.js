import { GameController } from "./modules/gameController.js";
import { createGameBoard, Render } from "./modules/dom.js";
import { PubSub } from "./modules/pubsub.js"
import styles from "./styles/styles.css";

let gameController = new GameController();

PubSub.subscribe("opponent selection prompted", Render.opponentSelection);
PubSub.subscribe("idle area changed", Render.idleAreas);
PubSub.subscribe("gameBoard changed", Render.gameBoards);
PubSub.subscribe("opponent selected", gameController.initializePlayers.bind(gameController));


Render.startButton();