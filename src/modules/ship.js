export class Ship {
  #length;
  #type;
  #hitCount = 0;

  constructor(length, type) {
    this.#length = length;
    this.#type = type;
  }

  hit() {
    this.#hitCount += 1;
  }

  isSunk() {
    return this.#hitCount === this.#length ? true : false;
  }
}
