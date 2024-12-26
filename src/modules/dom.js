import { PubSub } from "./pubsub.js";

const gameBoardContainers = document.querySelectorAll(".gameBoard");
const idleAreas = document.querySelectorAll(".idle-area");
const dialog = document.querySelector("dialog");
const footer = document.querySelector("footer");

gameBoardContainers[0].addEventListener("mouseleave", clearAllPlacementId);

//get all possible coordinates ship can occupy when a gameBoard cell is hovered over by taking that cell's coordinates as starting point
function getPossibleCoordinates(coordinates, length, alignment) {
  const x = coordinates[0];
  const y = coordinates[1];
  const possibleCoordinates = [];
  if (alignment === "vertical") {
    for (let i = 0; i < length; i++) {
      if (x + i >= 10) break;
      possibleCoordinates.push([x + i, y]);
    }
  } else if (alignment === "horizontal") {
    for (let i = 0; i < length; i++) {
      if (y + i >= 10) break;
      possibleCoordinates.push([x, y + i]);
    }
  }

  return possibleCoordinates;
}

//check if the coordinates of the gameboard cell being hovered can occupy the whole ship
function areValidCoordinates(coordinates, length, alignment) {
  const x = coordinates[0];
  const y = coordinates[1];
  let areValid = false;

  if (alignment === "vertical") {
    x + (length - 1) < 10 ? (areValid = true) : (areValid = false);
  } else if (alignment === "horizontal") {
    y + (length - 1) < 10 ? (areValid = true) : (areValid = false);
  }

  return areValid;
}

//clear all gameboard cells with id so we can render more
function clearAllPlacementId() {
  const validElements = Array.from(
    document.querySelectorAll("#validPlacement")
  );
  const invalidElements = Array.from(
    document.querySelectorAll("#invalidPlacement")
  );

  validElements.forEach((element) => element.removeAttribute("id"));
  invalidElements.forEach((element) => element.removeAttribute("id"));
}

function createElement(elementType, classArray, attributeArray) {
  const element = document.createElement(elementType);
  element.classList.add(...classArray);

  if (attributeArray) {
    attributeArray.forEach((attribute) => {
      element.setAttribute(attribute.type, attribute.value);
    });
  }

  return element;
}

function createGameBoard(gameBoard, domGameBoard) {
  gameBoard.forEach((row, rowIndex) => {
    row.forEach((node, columnIndex) => {
      let classesArray = [];
      node.ship ? classesArray.push("ship") : classesArray.push("empty");
      node.targeted
        ? classesArray.push("targeted")
        : classesArray.push("untargeted");

      const cell = createElement("div", classesArray);
      cell.setAttribute("data-coordinates", `${rowIndex},${columnIndex}`);

      if (node.ship) cell.setAttribute("data-ship-type", `${node.ship.type}`);
      domGameBoard.append(cell);
    });
  });
}

function createIdleArea(ship, activeIdleArea) {
  if (ship === null) {
    return activeIdleArea.firstChild.remove();
  }

  const shipElement = createElement(
    "div",
    ["ship"],
    [
      { type: "data-length", value: ship.length },
      { type: "data-alignment", value: ship.alignment },
    ]
  );
  const gameBoardCellHeight =
    document.querySelector(".gameBoard > div").offsetHeight;
  const gameBoardCellWidth =
    document.querySelector(".gameBoard > div").offsetWidth;

  shipElement.style.display = "grid";
  shipElement.style.marginBottom = "20px";

  if (ship.alignment === "vertical") {
    shipElement.style.gridTemplateRows = `repeat(${ship.length}, 1fr)`;
    shipElement.style.minWidth = `${gameBoardCellWidth}px`;
    shipElement.style.minHeight = `${gameBoardCellHeight * ship.length}px`;
  } else if (ship.alignment === "horizontal") {
    shipElement.style.gridTemplateColumns = `repeat(${ship.length}, 1fr)`;
    shipElement.style.minWidth = `${gameBoardCellWidth * ship.length}px`;
    shipElement.style.minHeight = `${gameBoardCellHeight}px`;
  }

  for (let i = 0; i < ship.length; i++) {
    const div = document.createElement("div");

    shipElement.append(div);
  }

  shipElement.addEventListener("click", () => {
    shipElement.classList.contains("selected")
      ? shipElement.classList.remove("selected")
      : shipElement.classList.add("selected");
    clearAllPlacementId();
  });
  activeIdleArea.append(shipElement);
}

export class Render {
  static startButton() {
    Array.from(footer.childNodes).forEach((child) => child.remove());

    const button = createElement("button", ["start-button"]);
    button.textContent = "Start";
    button.addEventListener("click", () =>
      PubSub.publish("opponent selection prompted")
    );

    footer.append(button);
  }

  static idleAreas(playerOne, playerTwo) {
    const playerOneArea = idleAreas[0];
    const playerTwoArea = idleAreas[1];
    const playerOneShip = playerOne.player.idleShips[0];
    const playerTwoShip = playerOne.player.idleShips[1];

    //remove active class and clean the idle area of any elements so new ones can be rendered
    idleAreas.forEach((area) => {
      area.classList.remove("active");
      Array.from(area.childNodes).forEach((child) => child.remove());
    });

    if (playerOne.active) {
      playerOneArea.classList.add("active");
      createIdleArea(playerOneShip, playerOneArea);
    } else if (playerTwo.active) {
      playerTwoArea.classList.add("active");
      createIdleArea(playerTwoShip, playerTwoArea);
    }
  }

  static gameBoards(playerOne, playerTwo) {
    const playerOneDomBoard = gameBoardContainers[0];
    const playerTwoDomBoard = gameBoardContainers[1];
    const playerOneGameBoard = playerOne.player.gameBoard.board;
    const playerTwoGameBoard = playerTwo.player.gameBoard.board;

    //remove active class and clean gameboard so new cells can be rendered
    gameBoardContainers.forEach((container) => {
      container.classList.remove(".active");
      Array.from(container.childNodes).forEach((child) => child.remove());
    });

    //assign active class so that only active player can see thier own ships on board
    if (playerOne.active) playerOneDomBoard.classList.add("active");
    else if (playerTwo.active) playerTwoDomBoard.classList.add("active");

    createGameBoard(playerOneGameBoard, playerOneDomBoard);
    createGameBoard(playerTwoGameBoard, playerTwoDomBoard);
  }

  //display placement of selected ship when user hovers over gameboard
  static selectedShipPlacement(event) {
    if (event.target === event.currentTarget) return null;

    const selectedShip = document.querySelector(".selected");
    if (!selectedShip) return null;

    const alignment = selectedShip.dataset.alignment;
    const length = Number(selectedShip.dataset.length);
    const coordinates = event.target.dataset.coordinates
      .split(",")
      .map((coor) => Number(coor));
    const isPlacementValid = areValidCoordinates(
      coordinates,
      length,
      alignment
    );
    const possibleCoordinates = getPossibleCoordinates(
      coordinates,
      length,
      alignment
    );
    //clear all id so new ones can be applied to gameboard cells
    clearAllPlacementId();

    if (isPlacementValid) {
      possibleCoordinates.forEach((coordinates) => {
        document
          .querySelector(
            `div[data-coordinates = '${coordinates[0]},${coordinates[1]}'`
          )
          .setAttribute("id", "validPlacement");
      });
    } else if (!isPlacementValid) {
      possibleCoordinates.forEach((coordinates) => {
        document
          .querySelector(
            `div[data-coordinates = '${coordinates[0]},${coordinates[1]}'`
          )
          .setAttribute("id", "invalidPlacement");
      });
    }

    console.log(isPlacementValid);
    console.log(possibleCoordinates);
  }

  static opponentSelection() {
    const choicePara = createElement("p", ["choice-text"]);
    const buttonContainer = createElement("div", ["choice-button-container"]);
    const humanPlayerButton = createElement("button", ["human-player-button"]);
    const cpuPlayerButton = createElement("button", ["cpuPlayerButton"]);

    choicePara.textContent =
      "Which type of player do you want to face off aganist?";
    humanPlayerButton.textContent = "Human";
    cpuPlayerButton.textContent = "cpu";

    humanPlayerButton.addEventListener("click", (e) => {
      PubSub.publish("opponent selected", [
        { name: "player1", type: "human" },
        { name: "player2", type: "human" },
      ]);
      choicePara.remove();
      buttonContainer.remove();
      dialog.close();
    });

    cpuPlayerButton.addEventListener("click", (e) => {
      PubSub.publish("opponent selected", [
        { name: "player1", type: "human" },
        { name: "CPU", type: "cpu" },
      ]);
      choicePara.remove();
      buttonContainer.remove();
      dialog.close();
    });

    buttonContainer.append(humanPlayerButton, cpuPlayerButton);
    dialog.append(choicePara, buttonContainer);

    dialog.showModal();
  }
}
