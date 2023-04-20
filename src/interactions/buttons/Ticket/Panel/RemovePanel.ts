import { TicketHandler } from '@src/class/ticket/TicketHandler.class';
import { DiscordClient } from '@src/structures';
import { BaseButtonInteraction } from '@src/structures/base/BaseButtonInteraction.class';
import {
    ActionRowBuilder,
    ButtonInteraction,
    EmbedBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
} from 'discord.js';

export class RemovePanelInteraction extends BaseButtonInteraction {
    constructor() {
        super('removePanel', 'Remove a ticket panel', 'Ticket', 0);
    }

    async execute(_client: DiscordClient, interaction: ButtonInteraction) {
        const ticketHandler = TicketHandler.getInstance();
        const allPanels = await ticketHandler.getGuildTicketByGuildId(
            interaction.guildId!,
        );
        const stringOptionInput = new StringSelectMenuBuilder()
            .setCustomId('removePanelIds')
            .setMinValues(1)
            .setMaxValues(allPanels.length)
            .addOptions(
                allPanels.map((panel) => {
                    return new StringSelectMenuOptionBuilder()
                        .setLabel(panel.get('name') as string)
                        .setValue((panel.get('id') as number).toString())
                        .setDescription(
                            `Panel ID: ${
                                panel.get('id') as string
                            }\nIs Active: ${
                                panel.get('status') === 1 ? 'Yes' : 'No'
                            }`,
                        );
                }),
            );
        const row =
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                stringOptionInput,
            );
        const embed = new EmbedBuilder()
            .setTitle('Remove Panel')
            .setDescription(
                'Select the panels you want to remove. You can select multiple panels at once.',
            )
            .setColor('Red');

        await interaction.deferUpdate({
            fetchReply: true,
        });
        await interaction.editReply({
            embeds: [embed],
            components: [row],
        });
    }
}
