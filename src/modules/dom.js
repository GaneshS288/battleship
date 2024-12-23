function createElement(elementType, classArray) {
  const element = document.createElement(elementType);
  element.classList.add(...classArray);

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
      cell.setAttribute("data-index", `${rowIndex},${columnIndex}`);

      if (node.ship) cell.setAttribute("data-ship-type", `${node.ship.type}`);
      domGameBoard.append(cell);
    });
  });
}

export class Render {
  static idleArea(ship, activeIdleArea) {
    if(ship === null) {
      return activeIdleArea.firstChild.remove();
    } 

    const shipElement = createElement("div", ["ship"]);
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
    });
    activeIdleArea.append(shipElement);
  }
}
