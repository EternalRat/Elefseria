const BaseCommand = require('../../utils/structures/BaseCommand');
const {MessageEmbed, Client, Message} = require("discord.js");
const { Jikan4 } = require("node-myanimelist");

module.exports = class searchAnimeCommand extends BaseCommand {

  constructor() {
    super('randomAnime', 'anime', ["animeRandom", "randomAnime", "ra"], 1, false, "Get informations about a random anime", null, null);
  }

    /**
     * 
     * @param {Client} client 
     * @param {Message} msg 
     * @param {Array} args 
     */
    async run(client, msg, args) {
		var result = await Jikan4.randomAnime({})
		var list = new Array()
		if (result.data) {
			var element = result.data
			const embed = new MessageEmbed()
			.setTitle(`${element.title_english ? element.title_english : "No english name"} | ${element.title_japanese ? element.title_japanese : "No japanese name"}`)
			.addFields({
				name: "Description",
				value: `${element.synopsis ? element.synopsis.slice(0, 1021) : "No synopsis found"}`,
			},
			{
				name: "Genres",
				value: `${element.genres.length ? element.genres.map(e => e.name).join(' ') : "No genre found"}`,
				inline: true,
			},
			{
				name: "Status",
				value: `${element.status ? element.status : "No status found"}`,
				inline: true,
			},
			{
				name: "Studio",
				value: `${element.studios.length ? element.studios.map(e => e.name).join(' ') : "No studio found"}`,
				inline: true,
			})
			.setURL(element.url)
			.setImage(element.images.jpg.large_image_url)
			.setFooter({ text: `Random Anime`, iconURL: `${element.images.jpg.small_image_url}` })
			
			msg.channel.send({embeds: [embed]});
		} else {
			const embed = new MessageEmbed().setTitle("Jikan don't like you '-'")
			.addFields({
				name: "Bot Author Speaking",
				value: `In all seriousness, try this in URL in your browser : [Click Here](https://api.jikan.moe/v4/anime?q=Lycoris%20Recoil&sfw)\n
				if you get something, contact me if not don't.`,
			})
			.setURL("https://jikan.moe/")
			.setFooter({ text: `Askou UWU Satella#1329` })
			msg.channel.send({embeds: [embed]});
		}
	}
}