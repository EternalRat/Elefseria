const BaseModule = require('../utils/structures/BaseModule');
const { Client, Message } = require('discord.js');
const path = require('path');
const fs = require('fs').promises;
const BaseCommand = require('../utils/structures/BaseCommand');

module.exports = class ReactionRoleModule extends BaseModule {
	commands = new Map();

	constructor() {
		super("ReactionRole");
	}

	async loadCommands(dir) {
		const filePath = path.join(__dirname, dir);
		const files = await fs.readdir(filePath);
		for (const file of files) {
			const stat = await fs.lstat(path.join(filePath, file));
			if (stat.isDirectory()) this.loadCommands(path.join(dir, file));
			if (file.endsWith('.js')) {
				const Command = require(path.join(filePath, file));
				if (Command.prototype instanceof BaseCommand) {
					const cmd = new Command();
					this.commands.set(cmd.name, cmd);
					cmd.aliases.forEach((alias) => {
						this.aliases.set(alias, cmd);
					});
				}
			}
		}
	}

	/**
	 * @param {String} guildId the id of the guild where the command has been executed
	 * @returns {Boolean}
	 */
	isThisModuleEnabled(guildId) {
		return ModuleConfig.get({ moduleName: "ReactionRole", guildId: guildId });
	}

	/**
	 * 
	 * @param {String} guildId the id of the guild where the command has been executed 
	 */
	changeModuleState(guildId) {
		ModuleConfig.set({ moduleName: "ReactionRole", guildId: guildId, state: !ModuleConfig.get({ moduleName: "ReactionRole", guildId: guildId })});
	}

	/**
	 * @param {String} name Name of the command that should be executed
	 * @returns {Boolean} weither it's a command from this module or not 
	 */
	isAModuleCommand(name) {
		return this.commands.has(name);
	}

	/**
	 * 
	 * @param {String} name Name of the command that will be executed
	 * @param {Client} client Discord Client
	 * @param {Message} message Discord Message
	 * @param {Array<String>} args Args that the message contains
	 */
	runCommand(name, client, message, args) {
		this.commands.get(name).run(client, message, args);
	}
}