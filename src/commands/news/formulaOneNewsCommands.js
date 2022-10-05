const BaseCommand = require('../../utils/structures/BaseCommand');
const { MessageEmbed, Client, Message } = require("discord.js");
const { Jikan4 } = require("node-myanimelist");
const EmbedList = require('../../utils/embedList');
const Parser = require('rss-parser')
const F1_FEED = "https://www.fia.com/rss/news"

module.exports = class formulaOneNewsCommand extends BaseCommand {

	constructor() {
		super('formulaOneNews', 'news', ["formulaOneNews", "newsFormulaOne", "f1n"], 1, false, "Get newest news about F1", null, null);
	}

	/**
		* 
		* @param {Client} client 
		* @param {Message} msg 
		* @param {Array} args 
		*/
	async run(client, msg, args) {
		this.getNewestFormulaOneNews()
	}

	async getNewestFormulaOneNews() {

		let parser = new Parser();
		let item;

		let news = await (async () => {

			let feed = await parser.parseURL(F1_FEED);
			console.log(feed.title);

			return feed.items
		  
		  })();
		news.forEach(e => {
			console.log(e.title, e.creator)
		})
	}
}