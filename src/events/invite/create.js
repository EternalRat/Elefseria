const BaseEvent = require('../../utils/structures/BaseEvent');
const { Client, Invite } = require('discord.js');
const guildInvites = require('../../utils/database/models/guildInvites');

module.exports = class InviteCreateEvent extends BaseEvent {
	constructor() {
		super('inviteCreate');
	}

	/**
	 * 
	 * @param {Client} client 
     * @param {Invite} inv
	 */
	async run (client, inv) {
        const invMap = new Map();
        const guildInvite = await guildInvites.findOne({
            guildId: inv.guild.id
        });
        invMap = guildInvite.get("invites");
        invMap.set(inv.code, {
            userId: inv.inviter.id,
            uses: inv.uses,
            temp: inv.temporary,
            expires: inv.temporary ? inv.expiresTimestamp : -1
        });
        guildInvite.set("invites", invMap);
        guildInvite.save();
	}
}