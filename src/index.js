import { GameController } from "./modules/gameController.js";
import { createGameBoard } from "./modules/dom.js";
import styles from './styles/styles.css'

const gameController = new GameController();
gameController.initializePlayers(
  { name: "Ganesh", type: "human" },
  { name: "CPU", type: "cpu" }
);

gameController.playerTwo.active = true;
gameController.playerOne.active = false;

const playerInfoOne = {active : gameController.playerTwo.active, gameBoard : gameController.playerTwo.player.gameBoard.board}
const playerInfoTwo = {active : gameController.playerOne.active, gameBoard : gameController.playerOne.player.gameBoard.board}

gameController.activePlayerPlacesShip()
gameController.playerTwo.player.attack(gameController.playerOne.player.gameBoard);
gameController.playerTwo.player.attack(gameController.playerOne.player.gameBoard);

const gameBoardContainer = document.querySelectorAll(".gameBoard");

createGameBoard(playerInfoTwo, gameBoardContainer[0]);
createGameBoard(playerInfoOne, gameBoardContainer[1]);

gameBoardContainer[0].addEventListener("click", (e) => {
e.stopPropagation();    
console.log(e.target)
})