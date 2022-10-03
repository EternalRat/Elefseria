require('dotenv').config();
const BaseCommand = require('../../utils/structures/BaseCommand');
const PermissionGuard = require("../../utils/PermissionGuard")
const {MessageEmbed, Client, Message} = require("discord.js")
const {parseZone} = require("moment")

module.exports = class ModuleSwitchCommand extends BaseCommand {
	constructor() {
		super('moduleSwitch', 'moderation', ["moduleSwitch", "switch"], 1, true, "Switch module state", "<ModuleName>", new PermissionGuard(["ADMINISTRATOR"]));
	}

	/**
	 * 
	 * @param {Client} client 
	 * @param {Message} msg 
	 * @param {Array} args 
	 */
	async run(client, msg, args) {
		const modulesName = new Array();

		for (var module of client.modules) {
			modulesName.push(module.name)
		};

		if (args.length < 1 || !modulesName.find(e => e.toLowerCase() == args[0].toLowerCase())) {
			let msg2 = await message.channel.send("You need to provide a moduleName");
			await msg2.delete({ timeout: 3500 }).catch(err => console.log(err));
		} else {
			let moduleFound = undefined;
			for (var module of client.modules) {
				if (args[0].toLowerCase() == "moderation") {
					msg.channel.send("You can't switch Moderation")
					return;
				}
				if (module.name.toLowerCase() == args[0].toLowerCase()) {
					moduleFound = module;
					break;
				}
			};
			moduleFound.changeModuleState(msg.guild.id);
		}
	}
}