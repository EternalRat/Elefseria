const BaseCommand = require('../../utils/structures/BaseCommand');
const { MessageEmbed, Client, Message } = require("discord.js");
const { Jikan4 } = require("node-myanimelist");
const EmbedList = require('../../utils/embedList');
const Parser = require('rss-parser')
const https = require('node:https');
const fs = require('fs')


const RSS_VALORANT_FEED = "https://antosik-lol-rss.s3.eu-central-1.amazonaws.com/v4/valorant/fr-FR/news.xml"

module.exports = class valorantNewsCommand extends BaseCommand {

	constructor() {
		super('valorantNews', 'news', ["valorantNews", "newsValorant", "vn"], 1, false, "Get newest news about Valorant", null, null);
	}

	/**
		* 
		* @param {Client} client 
		* @param {Message} msg 
		* @param {Array} args 
		*/
	async run(client, msg, args) {
		getNewestValorantNews()
	}

	getNewestValorantNews() {
		
	}
}