const BaseCommand = require('../../utils/structures/BaseCommand');
const {MessageEmbed, Client, Message} = require("discord.js");
const { Jikan4 } = require("node-myanimelist");
const EmbedList = require('../../utils/embedList');

module.exports = class searchMangaCommand extends BaseCommand {

  constructor() {
    super('searchManga', 'manga', ["mangaSearch", "searchManga", "sm"], 3, false, "Get informations about a manga name", null, null);
  }

    /**
     * 
     * @param {Client} client 
     * @param {Message} msg 
     * @param {Array} args 
     */
    async run(client, msg, args) {
		if (args.length != 1) {
			let msg2 = await msg.channel.send("Error in arguments. Must provide anime name");
			setTimeout(async () => {
				await msg2.delete().catch(err => console.log(err));
			}, 3000)
			return
		}
		var result = await Jikan4.mangaSearch({q: args[0], limit: 10, order_by:"popularity", sort:"desc", sfw: true})
		var list = new Array()

		if (result.data.length == 0) {
			msg.channel.send("No result found")
		} else {
			result.data.forEach((element, index) => {
				list.push((new MessageEmbed()
				.setTitle(`${element.title? element.title: "No english name"} | ${element.title_japanese ? element.title_japanese : "No japanese name"}`))
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
					value: `${element.serializations.length ? element.serializations.map(e => e.name).join(' ') : "No serializations found"}`,
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