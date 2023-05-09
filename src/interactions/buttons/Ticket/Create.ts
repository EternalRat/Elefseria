import { TicketHandler } from '@src/class/ticket/TicketHandler.class';
import { DiscordClient } from '@src/structures';
import { BaseButtonInteraction } from '@src/structures/base/BaseButtonInteraction.class';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    EmbedBuilder,
} from 'discord.js';

export class CreateTicketInteraction extends BaseButtonInteraction {
    constructor() {
        super('createTicket', 'Create a ticket', 'Ticket', 0);
    }

    async execute(
        _client: DiscordClient,
        interaction: ButtonInteraction,
    ): Promise<void> {
        if (!interaction.guild || !interaction.channel) return;
        const guildId = interaction.guildId!;
        const channelId = interaction.channelId;
        const ticketHandler = TicketHandler.getInstance();
        const panel = await ticketHandler.getPanelByGuildAndChannelId(
            guildId,
            channelId,
        );

        if (!panel) return;
        const categoryId = panel.get('categoryId') as string;
        const { ticket, channel } = await ticketHandler.createTicket(
            panel.get('id') as string,
            interaction.guild,
            interaction.user,
            (panel.get('rolesId') as string).split(','),
            categoryId,
        );
        const embed = new EmbedBuilder()
            .setTitle('Ticket n°' + ticket.get('id'))
            .setDescription(panel.get('message') as string)
            .setColor('Green')
            .setTimestamp();
        const btn = new ButtonBuilder()
            .setCustomId('closeTicket')
            .setLabel('Close ticket')
            .setStyle(ButtonStyle.Danger);
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(btn);
        await channel.send({
            content:
                '<@' +
                interaction.user.id +
                '> Please wait until you get a response from our staff team.\n' +
                panel.get('message'),
            embeds: [embed],
            components: [row],
        });
        await interaction.reply({
            content: 'Ticket created! <#' + channel.id + '>',
            ephemeral: true,
        });
    }
}
