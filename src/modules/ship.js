export class Ship {
  #hitCount = 0;

  constructor(length, type, alignment = 'horizontal') {
    this.length = length;
    this.type = type;
    this.alignment = alignment;
  }

  hit() {
    this.#hitCount += 1;
  }

  isSunk() {
    return this.#hitCount === this.length ? true : false;
  }
}
