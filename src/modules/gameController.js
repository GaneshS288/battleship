import { CpuPlayer, HumanPlayer } from "./player.js";

export class GameController {
    constructor() {
        this.playerOne = null;
        this.playerTwo = null;
    }

    initializePlayers(playerOneData = {name : "player", type : "human"}, playerTwoData = {name : "CPU", type: "cpu"}) {
        const players = [];

        [playerOneData, playerTwoData].forEach((playerData) => {
            switch(playerData.type) {
                case "human":
                    players.push(new HumanPlayer(playerData.name));
                case "cpu":
                    players.push(new CpuPlayer());
            }
        })

        this.playerOne = players[0];
        this.playerTwo = players[1];
    }
}