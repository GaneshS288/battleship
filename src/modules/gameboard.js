class BoardNode {
  constructor() {
    this.value = null;
    this.targeted = false;
  }
}

export class GameBoard {
  constructor() {
    this.board = this.#createGameboard();
  }

  #createGameboard() {
    const board = [];

    for (let i = 0; i < 8; i++) {
      board.push([]);

      for (let j = 0; j < 8; j++) {
        board[i].push(new BoardNode());
      }
    }

    return board;
  }

  recieveAttack(x, y) {
    const node = this.board[x][y];
    if (node.value !== null && !node.targeted) node.hit();
  }
}
