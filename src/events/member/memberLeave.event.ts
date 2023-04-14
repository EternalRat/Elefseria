import { GuildHandler } from '@src/class/database/handler/guild.handler.class';
import { UserHandler } from '@src/class/database/handler/user.handler.class';
import { BaseEvent, DiscordClient } from '@src/structures';
import { Events, GuildMember } from 'discord.js';

/**
 * @description Event for when a member leave a guild
 * @category Events
 * @extends BaseEvent
 */
export class MemberLeaveEvent extends BaseEvent {
    constructor() {
        super(Events.GuildMemberRemove);
    }

    public async execute(_client: DiscordClient, member: GuildMember) {
        console.info(
            `Member ${member.user.tag} has leaved the guild ${member.guild.name}`,
        );

        if (member.user.bot) {
            return;
        }
        if (!member.id || !member.user.tag) {
            return;
        }

        const user = await UserHandler.getUserById(member.id);
        if (user) {
            await UserHandler.deleteUser(member.id);
        }

        if (!member.guild) {
            return;
        }
        let guild = await GuildHandler.getGuildById(member.guild.id);
        if (guild) {
            await guild.removeUserFromGuild(member.id);
        }
    }
}
