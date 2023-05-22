import { BaseCommand, DiscordClient } from '@src/structures';
import { Message } from 'discord.js';

/**
 * @description TicketCreate command
 * @class TicketCreate
 * @extends BaseCommand
 */
export class WhoisCommand extends BaseCommand {
    constructor() {
        super(
            'whois',
            ['userinfo', 'user-info'],
            'Moderation',
            'Get information about a user',
            '<user>',
            0,
            true,
            [],
        );
    }

    /**
     * @description Executes the command
     * @param {DiscordClient} _client
     * @param {Message} message
     * @param {string[]} args
     * @returns {Promise<void>}
     */
    async execute(
        _client: DiscordClient,
        message: Message,
        args: string[],
    ): Promise<void> {
        if (args.length == 0) {
            message.reply('Please specify a user');
            return;
        }
        const user =
            message.mentions.users.first() ||
            message.guild?.members.cache.get(args[0])?.user;
        if (!user) {
            message.reply('Please specify a valid user');
            return;
        }
        const member = message.guild?.members.cache.get(user.id);
        const embed = {
            color: 0x00ff00,
            title: `Information about ${user.tag}`,
            thumbnail: {
                url: user.displayAvatarURL({ extension: 'png', size: 64 }),
            },
            fields: [
                {
                    name: 'ID',
                    value: user.id,
                    inline: true,
                },
                {
                    name: 'Username',
                    value: user.username,
                    inline: true,
                },
                {
                    name: 'Discriminator',
                    value: user.discriminator,
                    inline: true,
                },
                {
                    name: 'Bot',
                    value: user.bot ? 'Yes' : 'No',
                    inline: true,
                },
                {
                    name: 'Created At',
                    value: user.createdAt.toUTCString(),
                    inline: true,
                },
                {
                    name: 'Joined At',
                    value: member?.joinedAt?.toUTCString() || 'Unknown',
                    inline: true,
                },
                {
                    name: 'Roles',
                    value:
                        member && member.roles.cache.size > 0
                            ? member.roles.cache
                                  .filter((role) => role.name !== '@everyone')
                                  .map((role) => role.toString())
                                  .join(' ')
                            : 'Unknown or no roles found',
                    inline: true,
                },
            ],
        };
        message.channel.send({ embeds: [embed] });
    }
}
