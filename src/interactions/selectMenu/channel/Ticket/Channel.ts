import { TicketHandler } from '@src/class/ticket/TicketHandler.class';
import { AddPanelButtonInteraction } from '@src/interactions/buttons/Ticket/AddPanel';
import { DiscordClient } from '@src/structures';
import { BaseSelectInteraction } from '@src/structures/base/BaseSelectInteraction.class';
import { Page, buildButtons, buildButtonsModal } from '@src/util/ticket';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    ChannelSelectMenuInteraction,
    RoleSelectMenuBuilder,
    TextInputStyle,
} from 'discord.js';

interface ChannelPage extends Page {
    index: number;
}

const pagesBuilder: ChannelPage[] = [
    {
        index: 3,
        name: 'Category',
        embed: {
            title: 'Setup 3/6 - Category',
            description:
                'Register the category where the tickets corresponding to this panel will be created',
        },
        components: [
            {
                type: 'button',
                components: [
                    {
                        style: ButtonStyle.Primary,
                        label: 'Save and next',
                        customId: 'addpanel',
                    },
                    {
                        style: ButtonStyle.Danger,
                        label: 'Cancel',
                        customId: 'addpanelcancel',
                    },
                ],
            },
            {
                type: 'category',
                components: [
                    {
                        style: TextInputStyle.Short,
                        label: 'Channel name',
                        customId: 'channelname',
                    },
                ],
            },
        ],
    },
    {
        index: 4,
        name: 'Transcript',
        embed: {
            title: 'Setup 4/6 - Transcript Channel',
            description:
                'Register the channel where the transcripts of the tickets corresponding to this panel will be sent',
        },
        components: [
            {
                type: 'button',
                components: [
                    {
                        style: ButtonStyle.Primary,
                        label: 'Save and next',
                        customId: 'addpanel',
                    },
                    {
                        style: ButtonStyle.Danger,
                        label: 'Cancel',
                        customId: 'addpanelcancel',
                    },
                ],
            },
            {
                type: 'channel',
                components: [
                    {
                        style: TextInputStyle.Short,
                        label: 'Channel name',
                        customId: 'channelname',
                    },
                ],
            },
        ],
    },
    {
        index: 6,
        name: 'Channel',
        embed: {
            title: 'Setup 6/6 - Channel To Send',
            description: 'Register the channel where the panel will be sent',
        },
        components: [
            {
                type: 'button',
                components: [
                    {
                        style: ButtonStyle.Primary,
                        label: 'Save and send',
                        customId: 'addpanel',
                    },
                    {
                        style: ButtonStyle.Danger,
                        label: 'Cancel',
                        customId: 'addpanelcancel',
                    },
                ],
            },
            {
                type: 'channel',
                components: [
                    {
                        style: TextInputStyle.Short,
                        label: 'Channel name',
                        customId: 'channelname',
                    },
                ],
            },
        ],
    },
];

export class ChannelSelect extends BaseSelectInteraction {
    constructor() {
        super(
            'channelname',
            'Select a channel to send the ticket to',
            'Ticket',
        );
    }

    async execute(
        _client: DiscordClient,
        interaction: ChannelSelectMenuInteraction,
    ) {
        const val = interaction.values[0];
        const title = interaction.message.embeds[0].title;
        const isCategoryTicket = title?.includes('Category');
        const isChannelTicket = title?.includes('Channel');
        const lastPanel = await TicketHandler.getInstance().getLastPanelCreated(
            interaction.guild!.id,
        );
        let page =
            title && title.startsWith('Setup ')
                ? parseInt(
                      title.slice(
                          title.indexOf('Setup ') + 'Setup '.length,
                          title.indexOf('/'),
                      ),
                  )
                : 0;
        await interaction.deferUpdate({
            fetchReply: true,
        });
        if (val.length === 0) page--;
        if (isCategoryTicket && val.length > 0) {
            lastPanel!.set('categoryId', val);
        }
        if (isChannelTicket && page === 4 && val.length > 0) {
            lastPanel!.set('transcriptChannelId', val);
        } else if (isChannelTicket && page === 6 && val.length > 0) {
            lastPanel!.set('channelId', val);
        }
        if (AddPanelButtonInteraction.pagesBuilder[page].modals) {
            const btns = buildButtonsModal(
                lastPanel,
                AddPanelButtonInteraction.pagesBuilder[page].name,
                AddPanelButtonInteraction.pagesBuilder[page].modals!.components,
            );
            await interaction.editReply({
                embeds: [AddPanelButtonInteraction.pagesBuilder[page].embed],
                components: [
                    new ActionRowBuilder<ButtonBuilder>().addComponents(
                        ...btns,
                    ),
                ],
            });
        } else {
            const btns = buildButtons(
                AddPanelButtonInteraction.pagesBuilder[page].components,
            );
            const rowRole =
                new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
                    btns.role as RoleSelectMenuBuilder[],
                );
            const rowChannel =
                new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
                    btns.channel as ChannelSelectMenuBuilder[],
                );
            const rowCategory =
                new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
                    btns.category as ChannelSelectMenuBuilder[],
                );
            const rowBtn = new ActionRowBuilder<ButtonBuilder>().addComponents(
                btns.button as ButtonBuilder[],
            );
            const components = [];
            if (rowRole.components.length > 0) components.push(rowRole);
            if (rowChannel.components.length > 0) components.push(rowChannel);
            if (rowCategory.components.length > 0) components.push(rowCategory);
            components.push(rowBtn);
            await interaction.editReply({
                embeds: [AddPanelButtonInteraction.pagesBuilder[page].embed],
                components,
            });
        }
    }
}
