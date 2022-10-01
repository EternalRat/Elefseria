const BaseModule = require('../utils/structures/BaseModule');
const { Client, Message } = require('discord.js');
const path = require('path');
const fs = require('fs').promises;
const BaseCommand = require('../utils/structures/BaseCommand');
const ModuleConfig = require("../utils/database/models/moduleconfig");

module.exports = class AnimeModule extends BaseModule {
	commands = new Map();
	aliases = new Map();
	
	constructor() {
		super("Anime");
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
	async isThisModuleEnabled(guildId) {
		const moduleSettings = await ModuleConfig.findOne({ guildId: guildId });
		return moduleSettings.get('animeState');
	}

	/**
	 * 
	 * @param {String} guildId the id of the guild where the command has been executed 
	 */
	/* changeModuleState(guildId) {
		ModuleConfig.set({ moduleName: "Fun", guildId: guildId, state: !(await ModuleConfig.findOne({ moduleName: "Fun", guildId: guildId }).get())});
	} */
}