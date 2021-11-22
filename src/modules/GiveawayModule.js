const BaseModule = require('../utils/structures/BaseModule');

module.exports = class GiveawayModule extends BaseModule {
	commands = new Map();

	constructor() {
		super("Giveaway");
	}

	async loadCommands() {

	}

	/**
	 * @param {String} guildId the id of the guild where the command has been executed
	 * @returns {Boolean}
	 */
	isThisModuleEnabled(guildId) {
		return ModuleConfig.get({ moduleName: "Giveaway", guildId: guildId });
	}

	/**
	 * 
	 * @param {String} guildId the id of the guild where the command has been executed 
	 */
	changeModuleState(guildId) {
		ModuleConfig.set({ moduleName: "Giveaway", guildId: guildId, state: !ModuleConfig.get({ moduleName: "Giveaway", guildId: guildId })});
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