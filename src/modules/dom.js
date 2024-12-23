const gameBoardContainers = document.querySelectorAll(".gameBoard");
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

export function createGameBoard(playerInfo, domGameBoard) {
  playerInfo.gameBoard.forEach((row, rowIndex) => {
    row.forEach((node, columnIndex) => {
      let classesArray = [];
      node.ship ? classesArray.push("ship") : classesArray.push("empty");
      node.targeted
        ? classesArray.push("targeted")
        : classesArray.push("untargeted");
      playerInfo.active ? classesArray.push("active") : null;

      const cell = createElement("div", classesArray);
      cell.setAttribute("data-coordinates", `${rowIndex},${columnIndex}`);

      if (node.ship) cell.setAttribute("data-ship-type", `${node.ship.type}`);
      domGameBoard.append(cell);
    });
  });
}

export class Render {
  static idleArea(ship, activeIdleArea) {
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

  //
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
}
