require('dotenv').config();
const BaseCommand = require('../../utils/structures/BaseCommand');
const PermissionGuard = require("../../utils/PermissionGuard")
const {MessageEmbed, Client, Message} = require("discord.js")
const {parseZone} = require("moment")

module.exports = class HelpCommand extends BaseCommand {
	constructor() {
		super('help', 'moderation', ["help"], 1, true, "Give info about a modules.", "<ModuleName>", null);
	}

	/**
	 * 
	 * @param {Client} client 
	 * @param {Message} msg 
	 * @param {Array} args 
	 */
	async run(client, msg, args) {
		const entries = client.modules.entries()
		const modulesName = new Array();

		for (var module of client.modules) {
			modulesName.push(module.name)
		};

		const globalHelpEmbed = new MessageEmbed()
			.setTitle(`Help`)
			.addFields({
				name: "Modules",
				value: `${modulesName.join('\n')}`
			})


		if (args.length < 1 || !modulesName.find(e => e.toLowerCase() == args[0].toLowerCase())) {
			msg.channel.send({embeds: [globalHelpEmbed]});
		} else {
			let moduleFound = undefined;
			for (var module of client.modules) {
				if (module.name.toLowerCase() == args[0].toLowerCase()) {
					moduleFound = module;
					break;
				}
			};
			
			const fieldValues = new Array()
			for (var moduleCommand of moduleFound.commands) {
				const moduleName = moduleCommand[0]
				const command = moduleCommand[1]
				fieldValues.push({
					name: `Name`,
					value: `${moduleName}`,
					inline: true,
				})
				fieldValues.push({
					name: `Description`,
					value: `${command.description ? command.description : "No description"}`,
					inline: true,
				})
				fieldValues.push({
					name: `Aliases`,
					value: `${command.aliases.length != 0 ? command.aliases.join(', ') : "No aliases"}`,
					inline: true,
				})
			}

			const specificEmbed = new MessageEmbed()
			.setTitle(`${moduleFound.name} Commands`)
			.addFields(fieldValues)
			msg.channel.send({embeds: [specificEmbed]});
		}
	}
}