const BaseCommand = require('../../utils/structures/BaseCommand');
const {MessageEmbed, Client, Message} = require("discord.js");
const {parseZone} = require("moment")
const EmbedList = require('../../utils/embedList');

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
			
			EmbedList.sendList(msg.channel, list)
		}
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