const BaseCommand = require('../../utils/structures/BaseCommand');
const {MessageEmbed, Client, Message} = require("discord.js");
const {parseZone} = require("moment")

const FFCOllECTMOUNT = "https://ffxivcollect.com/api/mounts"




module.exports = class searchMountCommand extends BaseCommand {

  constructor() {
    super('searchMount', 'ffutils', ["ffmount", "searchMount", "ffm"], 3, false, "Get informations about an FF14 mount", null, null);
  }

    /**
     * 
     * @param {Client} client 
     * @param {Message} msg 
     * @param {Array} args 
     */
    async run(client, msg, args) {
		if (args.length != 2) {
			let msg2 = await msg.channel.send("Error in arguments. Must provide mount name and language (fr, en, jp, de)");
			setTimeout(async () => {
				await msg2.delete().catch(err => console.log(err));
			}, 3000)
			return
		}

		

		var result = await this.getMountInfo(args[0], args[1]);
		result = JSON.parse(result)
		let list = new Array()
		if (result.results.length == 0) {
			msg.channel.send("No result found")
		} else {
			result.results.forEach((element, index) => {
				list.push((new MessageEmbed()
				.setTitle(`${element.name}`))
				.addFields({
					name: "Description",
					value: `${element.description}`,
				},
				{
					name: "Type d'obtention",
					value: `${element.sources[0].type}`,
				},
				{
					name: "Obtention",
					value: `${element.sources[0].text}`,
					inline: true,
				})
				.setImage(element.image)
				.setFooter({ text: `${index + 1}`, iconURL: `${element.icon}` }))
			});
			//msg.channel.send('```\n' + mountOne.name + '\n' + mountOne.sources[0].text + '```' + mountOne.image)
			//msg.channel.send((await this.getMountInfo(args[0], args[1])).slice(1, 1000))
			//msg.channel.send({embeds: [embed]})
			
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