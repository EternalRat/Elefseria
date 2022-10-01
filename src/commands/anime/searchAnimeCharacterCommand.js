const BaseCommand = require('../../utils/structures/BaseCommand');
const EmbedList = require('../../utils/embedList');
const {MessageEmbed, Client, Message} = require("discord.js");
const { Jikan4 } = require("node-myanimelist");

module.exports = class searchAnimeCharacterCommand extends BaseCommand {

  constructor() {
    super('searchAnimeCharacter', 'anime', ["animeCharacterSearch", "searchAnimeCharacter", "sac"], 3, false, "Get informations about an anime character", null, null);
  }

    /**
     * 
     * @param {Client} client 
     * @param {Message} msg 
     * @param {Array} args 
     */
    async run(client, msg, args) {
		if (args.length != 1) {
			let msg2 = await msg.channel.send("Error in arguments. Must provide character name");
			setTimeout(async () => {
				await msg2.delete().catch(err => console.log(err));
			}, 3000)
			return
		}
		var result = await Jikan4.characterSearch({q: args[0], limit: 10, order_by:"favorites", sort:"desc", sfw: true})
		
		var list = new Array()

		if (result.data.length == 0) {
			msg.channel.send("No result found")
		} else {
			
			result.data.forEach((element, index) => {
				list.push((new MessageEmbed()
				.setTitle(`${element.name ? element.name : "No english name"} | ${element.name_kanji ? element.name_kanji : "No japanese name"}`))
				.addFields({
					name: "Description",
					value: `${element.about != "null" && element.about ? element.about : "No description found"}`,
				},
				{
					name: "Nicknames",
					value: `${element.nicknames.length ? element.nicknames.join(' ') : "No nicknames found"}`,
					inline: true,
				},
				{
					name: "Birthday",
					value: `${element.birthday ? element.birthday : "No birthday found"}`,
					inline: true,
				},
				{
					name: "Favorites",
					value: `${element.favorites ? element.favorites.toString() : "0"}`,
					inline: true,
				})
				.setURL(element.url)
				.setImage(element.images.jpg.image_url)
				.setFooter({ text: `${index + 1} / ${result.data.length}`, iconURL: `${element.images.jpg.image_url}` }))
			});
			
			EmbedList.sendList(msg.channel, list)
		}
	}
}