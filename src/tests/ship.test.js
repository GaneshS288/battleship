import { describe, test, expect} from '@jest/globals'
import { Ship } from "../modules/ship";

const submarine = new Ship(1, 'submarine');
submarine.hit();

describe("ship", () => {
  test("sunk", () => {
    expect(submarine.isSunk()).toBe(true);
  });
});
