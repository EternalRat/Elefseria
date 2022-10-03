const BaseCommand = require('../../utils/structures/BaseCommand');
const {MessageEmbed, Client, Message} = require("discord.js");
const EmbedList = require('../../utils/embedList');
const { Jikan4 } = require("node-myanimelist");

module.exports = class seasonUpcomingCommand extends BaseCommand {

  constructor() {
    super('schedules', 'anime', ["schedules","schdls", "schdl"], 1, false, "Get informations about current season schedule", null, null);
  }

    /**
     * 
     * @param {Client} client 
     * @param {Message} msg 
     * @param {Array} args 
     */
    async run(client, msg, args) {
		const weekday = ["monday","tuesday","wednesday","thursday","friday","other"]
		if (args.length != 1) {
			if (!weekday.contains(args[0].toLowerCase())) {
				let msg2 = await msg.channel.send("Error in arguments. You must provide weekday in english or \"other\"");
				setTimeout(async () => {
					await msg2.delete().catch(err => console.log(err));
				}, 3000)
				return
			}
		}

		var result = await Jikan4.schedules({filter: args[0]})
		var list = new Array()
		
		if (result.data.length == 0) {
			msg.channel.send("No result found")
		} else {
			const sortAnime = (a, b) => b.favorites - a.favorites
			var data = result.data.sort(sortAnime)
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