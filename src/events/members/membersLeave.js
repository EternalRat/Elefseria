const BaseEvent = require('../../utils/structures/BaseEvent');
const {GuildMember, Client} = require("discord.js")
const User = require("../../class/UserClass");

module.exports = class GuildMemberRemoveEvent extends BaseEvent {
	constructor() {
		super('guildMemberRemove');
	}
	
	/**
	 * 
	 * @param {Client} client 
	 * @param {GuildMember} member 
	 */
	async run(client, member) {
		const user = new User(client, member);
		await user.sendLeftMsg();
		await user.decrementCounter();
		await user.decrementInvite();
		await user.setWarnStatus(false);
	}
}