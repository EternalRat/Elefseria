const BaseEvent = require("../../utils/structures/BaseEvent");
const { Client, GuildMember } = require("discord.js");
const User = require("../../class/UserClass");

module.exports = class GuildMemberAddEvent extends BaseEvent {
	constructor() {
		super("guildMemberAdd");
	}

	/**
	 *
	 * @param {Client} client
	 * @param {GuildMember} member
	 */
	async run(client, member) {
		const user = new User(client, member);
		let res = user.raidProtect();
		if (res === 1) return;
		await user.sendJoinMsg();
		await user.incrementCounter();
		await user.incrementInvite();
		await user.setWarnStatus(true);
	}
};
