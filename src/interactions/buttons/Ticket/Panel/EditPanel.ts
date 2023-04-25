import { TicketHandler } from '@src/class/ticket/TicketHandler.class';
import { DiscordClient } from '@src/structures';
import { BaseButtonInteraction } from '@src/structures/base/BaseButtonInteraction.class';
import {
    ButtonInteraction,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    EmbedBuilder,
} from 'discord.js';

export class EditPanelInteraction extends BaseButtonInteraction {
    constructor() {
        super('editPanel', 'Edit the selected panel', 'Ticket', 0);
    }

    async execute(_client: DiscordClient, interaction: ButtonInteraction) {
        const ticketHandler = TicketHandler.getInstance();
        const allPanels = await ticketHandler.getGuildTicketByGuildId(
            interaction.guildId!,
        );
        if (allPanels.find((panel) => panel.get('status') === 2)) {
            await interaction.deferUpdate({
                fetchReply: true,
            });
            await interaction.editReply({
                content: 'There is a panel that is currently being edited/created, please finish it first.',
            });
            return;
        }
        const stringOptionInput = new StringSelectMenuBuilder()
            .setCustomId('editPanelId')
            .setMinValues(1)
            .addOptions(
                allPanels.map((panel) => {
                    return new StringSelectMenuOptionBuilder()
                        .setLabel(
                            (panel.get('name') as string).length > 0
                                ? (panel.get('name') as string)
                                : 'Unknown name',
                        )
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
        const btn = new ButtonBuilder()
            .setCustomId('backPanel')
            .setLabel('Go back to Setup Panel')
            .setStyle(ButtonStyle.Success);
        const row =
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                stringOptionInput,
            );
        const btnRow = new ActionRowBuilder<ButtonBuilder>().addComponents(btn);
        const embed = new EmbedBuilder()
            .setTitle('Edit Panel')
            .setDescription(
                'Select the panel you want to edit.',
            )
            .setColor('Red');
        const noPanels = new EmbedBuilder().setDescription(
            "There's no panel to edit",
        );
        await interaction.deferUpdate({
            fetchReply: true,
        });
        await interaction.editReply({
            content: '',
            embeds: allPanels.length > 0 ? [embed] : [embed, noPanels],
            components: allPanels.length > 0 ? [row, btnRow] : [btnRow],
        });
    }
}
