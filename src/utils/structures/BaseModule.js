const ModuleConfig = require("../database/models/moduleconfig");
const BaseCommand = require('../structures/BaseCommand');
const path = require('path');
const fs = require('fs').promises;

module.exports = class BaseModule {
	commands = new Map();
	aliases = new Map();

	constructor(name) {
		this.name = name;
	}

	/**
	 * @param {String} guildId the id of the guild where the command has been executed
	 * @returns {Boolean}
	 */
	 async isThisModuleEnabled(guildId) {
		const moduleSettings = await ModuleConfig.findOne({ guildId: guildId });
		return moduleSettings.get('reactionRoleState');
	}


	/**
	 * @param {String} name Name of the command that should be executed
	 * @returns {Boolean} weither it's a command from this module or not 
	 */
	isAModuleCommand(name) {
		return this.commands.has(name) || this.aliases.has(name);
	}

	/**
	 *
	 * @param {String} dir Dir of the commands to load
	 */
	async loadCommands(dir) {


		let filePath = path.join(__dirname, dir);
		if (filePath.includes('src/src/')) filePath = filePath.replace('src/src/', 'src/')
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
	 * 
	 * @param {String} guildId the id of the guild where the command has been executed 
	 */
	async changeModuleState(guildId) {
		let moduleConfig= await ModuleConfig.findOne({ moduleName: this.name, guildId: guildId });
		if (!moduleConfig) {
			moduleConfig.set(this.name.toLowerCase() + 'State', true)
		} else {
			moduleConfig.set(this.name.toLowerCase() + 'State', !moduleConfig.get(this.name.toLowerCase() + 'State'))
		}
		moduleConfig.save()
	}

	/**
	 * 
	 * @param {String} name Name of the command that will be executed
	 * @param {Client} client Discord Client
	 * @param {Message} message Discord Message
	 * @param {Array<String>} args Args that the message contains
	 */
	 runCommand(name, client, message, args) {
		const command = this.commands.get(name) || this.aliases.get(name);
		if (!command) return;
		if (command.guildOnly && message.channel.type !== "GUILD_TEXT") return message.channel.send("This is a guildOnly command!")
		if (command && command.permissions) {
			if (command.cooldown && this.still_cooldown(client, message.author, command, message.channel)) return;
			if (command.permissions.check(message.member.permissions.toArray())) {
				command.run(client, message, args);
			} else
				message.channel.send(`You're missing of permissions for ${command.name} : ${command.permissions.getPerm()}`)
		} else if (command && !command.permissions) {
			if (command.cooldown && this.still_cooldown(client, message.author, command, message.channel)) return;
				command.run(client, message, args);
		}
	}

	still_cooldown(client = Client, user = User, command = BaseCommand, channel = Channel) {
		const timeNow = Date.now();
		const cdAmount = (command.cooldown || 5) * 1000;

		if (!client.cooldown.has(user.id)) {
			client.cooldown.set(user.id, timeNow)
			setTimeout(() => {
				client.cooldown.delete(user.id)
			}, cdAmount);
			return false;
		}
		if (client.cooldown.has(user.id)) {
			const cdExpirationTime = client.cooldown.get(user.id) + cdAmount;
			if (timeNow < cdExpirationTime) {
				const timeLeft = (cdExpirationTime - timeNow) / 1000;
				channel.send(`Please, wait ${timeLeft.toFixed(0)}s before using again ${command.name}.`);
			}
		}
		return true;
	}
}