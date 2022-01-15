module.exports = class BaseModule {
	commands = new Map();
	aliases = new Map();

	constructor(name) {
		this.name = name;
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
			if (command.permissions.check(message.member.permissions.toArray()))
				command.run(client, message, args);
			else
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