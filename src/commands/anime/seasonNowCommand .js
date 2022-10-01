const BaseCommand = require('../../utils/structures/BaseCommand');
const {MessageEmbed, Client, Message} = require("discord.js");
const { Jikan4 } = require("node-myanimelist");
const EmbedList = require('../../utils/embedList');

module.exports = class seasonNowCommand extends BaseCommand {

  constructor() {
    super('seasonNow', 'anime', ["seasonNow", "sn"], 1, false, "Get informations about animes in the current season", null, null);
  }

    /**
     * 
     * @param {Client} client 
     * @param {Message} msg 
     * @param {Array} args 
     */
    async run(client, msg, args) {
		var result = await Jikan4.seasonNow({limit: 20, sfw: true})
		var list = new Array()

		if (result.data.length == 0) {
			msg.channel.send("No result found")
		} else {
			result.data.forEach((element, index) => {
				list.push((new MessageEmbed()
				.setTitle(`${element.title_english ? element.title_english : "No english name"} | ${element.title_japanese ? element.title_japanese : "No japanese name"}`))
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
				.setFooter({ text: `${index + 1} / ${result.data.length}`, iconURL: `${element.images.jpg.small_image_url}` }))
			});
			
			
			EmbedList.sendList(msg.channel, list)
		}
	}
}