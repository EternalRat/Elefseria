const BaseCommand = require('../../utils/structures/BaseCommand');
const {MessageEmbed, Client, Message} = require("discord.js");
const {parseZone} = require("moment")

const tEnum = { "x": ":heavy_multiplication_x:", "o": ":o:", "e":"      "}
let gameTable = [[tEnum["e"], tEnum["e"], tEnum["e"]], [tEnum["e"],tEnum["e"], tEnum["e"]], [tEnum["e"], tEnum["e"], tEnum["e"]]]
let isFstPlTrn = true; 

function isWinPossible()
{
	align = 0;
	tmp = "tmp";
	for (let i = 0; i < gameTable.length; i++) {
		const element = array[i];
		
	}

}

module.exports = class TicTacToeCommand extends BaseCommand {
	constructor() {
		super('tictactoe', 'testing', ['tic', 'tac', 'toe', 'ttt']);
	}

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {Array} args
	 */

	async run(client, message, args) {
		message.channel.send("\
| "+gameTable[0][0]+" | "+gameTable[0][1]+" | "+gameTable[0][2]+" |\n\
| "+gameTable[1][0]+" | "+gameTable[1][1]+" | "+gameTable[1][2]+" |   <--- Player " + (isFstPlTrn ? "1" : "2") + "\n\
| "+gameTable[2][0]+" | "+gameTable[2][1]+" | "+gameTable[2][2]+" |")
	}
}