import { TicketHandler } from '@src/class/ticket/TicketHandler.class';
import { DiscordClient } from '@src/structures';
import { BaseButtonInteraction } from '@src/structures/base/BaseButtonInteraction.class';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    EmbedBuilder,
    TextChannel,
} from 'discord.js';

export class SendPanelInteraction extends BaseButtonInteraction {
    constructor() {
        super('sendPanels', 'Send every panels', 'Ticket', 0);
    }

    public async execute(
        _client: DiscordClient,
        interaction: ButtonInteraction,
    ): Promise<void> {
        const ticketHandler = TicketHandler.getInstance();
        const allPanels = await ticketHandler.getGuildTicketByGuildId(
            interaction.guildId!,
        );

        for (const panel of allPanels) {
            try {
                const textChannel = (await interaction.guild?.channels.fetch(
                    panel.get('channelId') as string,
                    {
                        cache: true,
                    },
                )) as TextChannel | null;
                if (!textChannel) {
                    interaction.reply({
                        content: `The panel ${
                            panel.get('name') as string
                        } couldn't be send, the channel with the id ${
                            panel.get('id') as string
                        } could not be found`,
                        ephemeral: true,
                    });
                    continue;
                }
                const embed = new EmbedBuilder()
                    .setTitle(panel.get('name') as string)
                    .setDescription(
                        'If you want to open a ticket related to this panel, click on the button below.',
                    )
                    .setFooter({
                        text: 'Powered by Elefseria - Manage your ticket easily than before',
                    });
                const btn = new ButtonBuilder()
                    .setCustomId('createTicket')
                    .setLabel('Create Ticket')
                    .setEmoji('📩')
                    .setStyle(ButtonStyle.Primary);
                const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                    btn,
                );
                textChannel.send({
                    embeds: [embed],
                    components: [row],
                });
            } catch {
                interaction.reply({
                    content: `The panel ${
                        panel.get('name') as string
                    } couldn't be send, the channel with the id ${
                        panel.get('id') as string
                    } could not be found`,
                    ephemeral: true,
                });
            }
        }
    }
}
