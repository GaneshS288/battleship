import { PubSub } from "./pubsub.js";

const gameBoardContainers = document.querySelectorAll(".gameBoard");
const idleAreas = document.querySelectorAll(".idle-area");
const dialog = document.querySelector("dialog");
const footer = document.querySelector("footer");

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
  const possibleCoordinates = getPossibleCoordinates(
    coordinates,
    length,
    alignment
  );
  let areValid = true;

  if (possibleCoordinates.length < length) return (areValid = false);
  else {
    possibleCoordinates.forEach((coor) => {
      const cell = document.querySelector(
        `.active > div[data-coordinates = '${coor[0]},${coor[1]}'`
      );
      if (cell.classList.contains("ship")) areValid = false;
    });
  }

  return areValid;
}

function getSelectedShipInfo(event) {
  const selectedShip = document.querySelector(".selected");
  if (!selectedShip) return null;

  const alignment = selectedShip.dataset.alignment;
  const length = Number(selectedShip.dataset.length);

  return { alignment, length };
}

//clear all gameboard cells with id so we can assign new ids to render them
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

function removeGameboardEventListners(gameBoardArray) {
  gameBoardArray.forEach((gameBoard) => {
    gameBoard.removeEventListener("click", placeShipHandler);
    gameBoard.removeEventListener("mouseover", displayShipPlacementHandler);
    gameBoard.removeEventListener("dblclick", removeShipHandler);
  });
}

function createIdleArea(ship, activeIdleArea) {
  if (ship === null || ship === undefined) {
    return null;
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

function createAlignmentButtonsAndInstructions(areShipsDeployed) {
  const continueButton = createElement("button", ["continue-button"]);
  const alignmentButtonContainer = createElement("button", [
    "alignment-button-container",
  ]);
  const horizontalButton = createElement("button", ["horizontal-button"]);
  const verticalButton = createElement("button", ["vertical-button"]);
  const instructionsPara = createElement("p", ["instructions"]);

  continueButton.textContent = "Continue";
  horizontalButton.textContent = "horizontal";
  verticalButton.textContent = "Vertical";
  instructionsPara.innerText =
    "Click on a ship in idle area to select it. Click again to unselect. \r\n While A ship is selected clicked on a square in your gamebaord to place it. \r\n Double click on a placed ship to remove it from gameboard and send it to idle area.";

  continueButton.addEventListener("click", () => {
    PubSub.publish("change player");
  });

  horizontalButton.addEventListener("click", () => {
    PubSub.publish("alignment changed", ["horizontal"]);
  });

  verticalButton.addEventListener("click", () => {
    PubSub.publish("alignment changed", ["vertical"]);
  });

  alignmentButtonContainer.append(horizontalButton, verticalButton);

  if (areShipsDeployed)
    footer.append(continueButton, alignmentButtonContainer, instructionsPara);
  else footer.append(alignmentButtonContainer, instructionsPara);
}

//display placement of selected ship when user hovers over gameboard
function displayShipPlacementHandler(event) {
  if (event.target === event.currentTarget) return null;

  const selectedShip = getSelectedShipInfo(event);
  if (!selectedShip) return null;

  const { alignment, length } = selectedShip;
  const coordinates = event.target.dataset.coordinates
    .split(",")
    .map((coor) => Number(coor));
  const isPlacementValid = areValidCoordinates(coordinates, length, alignment);
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
          `.active > div[data-coordinates = '${coordinates[0]},${coordinates[1]}'`
        )
        .setAttribute("id", "validPlacement");
    });
  } else if (!isPlacementValid) {
    possibleCoordinates.forEach((coordinates) => {
      document
        .querySelector(
          `.active > div[data-coordinates = '${coordinates[0]},${coordinates[1]}'`
        )
        .setAttribute("id", "invalidPlacement");
    });
  }

  console.log(isPlacementValid);
  console.log(possibleCoordinates);
}

//when clicked on gameboard place the selected ship
function placeShipHandler(event) {
  if (event.target === event.currentTarget) return null;

  const selectedShip = getSelectedShipInfo(event);
  if (!selectedShip) return null;

  const { alignment, length } = selectedShip;
  const coordinates = event.target.dataset.coordinates
    .split(",")
    .map((coor) => Number(coor));
  const isPlacementValid = areValidCoordinates(coordinates, length, alignment);

  if (isPlacementValid) PubSub.publish("ship placed", [coordinates]);
  else return null;
}

//double click to remove ship from gameboard
function removeShipHandler(event) {
  if (event.target === event.currentTarget) return null;
  else if (event.target.classList.contains("ship")) {
    const coordinates = event.target.dataset.coordinates
      .split(",")
      .map((coor) => Number(coor));

    PubSub.publish("ship removed", [coordinates]);
  }
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
    const playerTwoShip = playerTwo.player.idleShips[0];

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
    const activeGameBoard = playerOne.active
      ? playerOneDomBoard
      : playerTwoDomBoard;
    const activePlayer = playerOne.active ? playerOne : playerTwo;

    //remove active class and clean gameboard so new cells can be rendered
    gameBoardContainers.forEach((container) => {
      container.classList.remove("active");
      Array.from(container.childNodes).forEach((child) => child.remove());
    });

    removeGameboardEventListners([playerOneDomBoard, playerTwoDomBoard]);
    //assign event lisnters for placing ships
    if (activePlayer.ready === false) {
      activeGameBoard.classList.add("active");
      activeGameBoard.addEventListener(
        "mouseover",
        displayShipPlacementHandler
      );
      activeGameBoard.addEventListener("click", placeShipHandler);
      activeGameBoard.addEventListener("dblclick", removeShipHandler);
    } else if (
      activePlayer.allShipsDeployed === true &&
      activePlayer.ready === true
    ) {
      activeGameBoard.classList.add("active");
    }

    createGameBoard(playerOneGameBoard, playerOneDomBoard);
    createGameBoard(playerTwoGameBoard, playerTwoDomBoard);
  }

  static footer(playerOne, playerTwo) {
    Array.from(footer.childNodes).forEach((child) => child.remove());
    const activePlayer = playerOne.active ? playerOne : playerTwo;

    if (activePlayer.ready === false) {
      createAlignmentButtonsAndInstructions(activePlayer.allShipsDeployed);
    }
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
