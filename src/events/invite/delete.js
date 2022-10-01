const BaseEvent = require('../../utils/structures/BaseEvent');
const { Client, Invite } = require('discord.js');
const guildInvites = require('../../utils/database/models/guildInvites');

module.exports = class InviteCreateEvent extends BaseEvent {
	constructor() {
		super('inviteDelete');
	}

	/**
	 * 
	 * @param {Client} client 
     * @param {Invite} inv
	 */
	async run (client, inv) {
        let invMap = new Map();
        const guildInvite = await guildInvites.findOne({
            guildId: inv.guild.id
        });
        invMap = guildInvite.get("invites");
        invMap.delete(inv.code);
        guildInvite.set("invites", invMap);
        guildInvite.save();
	}
}