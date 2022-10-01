const BaseCommand = require('../../utils/structures/BaseCommand');
const {MessageEmbed, Client, Message} = require("discord.js");
const { Jikan4 } = require("node-myanimelist");

module.exports = class seasonUpcomingCommand extends BaseCommand {

  constructor() {
    super('seasonUpcoming', 'anime', ["seasonUpcoming","su"], 1, false, "Get informations about an season upcoming", null, null);
  }

    /**
     * 
     * @param {Client} client 
     * @param {Message} msg 
     * @param {Array} args 
     */
    async run(client, msg, args) {
		var result = await Jikan4.seasonUpcoming({limit: 20, sfw: true})
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
			
			
			this.sendList(msg.channel, list)
		}
	}
	
	sendList(channel, list) {

		const emojiNext = '➡'; // unicode emoji are identified by the emoji itself
		const emojiPrevious = '⬅';
		const reactionArrow = [emojiPrevious, emojiNext];
		const time = 60000; // time limit: 1 min
	
		function getList(i, list) {
			return list[i]; // i+1 because we start at 0
		}
	
		function filter(reaction, user){
			return (!user.bot) && (reactionArrow.includes(reaction.emoji.name)); // check if the emoji is inside the list of emojis, and if the user is not a bot
		}
	
		function onCollect(r, message, i, list, u) {
			if (u.bot == true)
				return i
			if ((r.emoji.name === emojiPrevious)) {
				i = ((i - 1) < 0) ? list.length - 1 : (i - 1)
				message.edit({embeds: [getList(i, list)]});
			} else if ((r.emoji.name === emojiNext)) {
				i = ((i + 1) > list.length - 1) ? 0 : (i + 1)
				message.edit({embeds: [getList(i, list)]});
			}
			r.users.remove(u.id)
			return i;
		}
	
		function createCollectorMessage(message, list) {
			let i = 0;
			const collector = message.createReactionCollector(filter, { time });
			collector.on('collect', (r, u) => {
			i = onCollect(r, message, i, list, u);
			});
			collector.on('end', collected => message.clearReactions());
		}
		
		channel.send({embeds: [getList(0, list)]})
		  .then(msg => msg.react(emojiPrevious))
		  .then(msgReaction => msgReaction.message.react(emojiNext))
		  .then(msgReaction => createCollectorMessage(msgReaction.message, list));
	}

	getMountInfo(mountName, lang, account="") {
		var XMLHttpRequest = require('xhr2');
		return new Promise(async (resolve, reject) => {
			var x = new XMLHttpRequest();
		
			var url= FFCOllECTMOUNT + "?name_" + lang.toLowerCase() + "_start=" + mountName + "&language=" + lang.toLowerCase();
			x.open('GET', url, true);
			x.onreadystatechange = async function() {
				if (x.readyState == 4 && x.status == 200) {
					resolve(x.responseText);
				}
				if (x.readyState == 4 && x.status == 400) {
					reject(x.responseText)
				}
			}
			x.send()
		})
	}

}