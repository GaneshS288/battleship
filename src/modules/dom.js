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

      if(node.ship) cell.setAttribute("data-ship-type", `${node.ship.type}`)
      domGameBoard.append(cell);
    });
  });
}
