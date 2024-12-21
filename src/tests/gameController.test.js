import { jest, describe, expect, test} from "@jest/globals";
import { GameController } from "../modules/gameController.js";
import { CpuPlayer, HumanPlayer } from "../modules/player.js";

describe("game controller", () => {
    test("initialize players", () => {
        const gameController = new GameController();
        gameController.initializePlayers({name : "Ganesh", type : "human"}, {name : "CPU", type : "cpu"});

        expect(gameController.playerOne instanceof HumanPlayer).toBe(true);
        expect(gameController.playerTwo instanceof CpuPlayer).toBe(true);
    })
})