import { TicketHandler } from '@src/class/ticket/TicketHandler.class';
import { DiscordClient } from '@src/structures';
import { BaseSelectInteraction } from '@src/structures/base/BaseSelectInteraction.class';
import { Page } from '@src/util/ticket';
import { ButtonStyle, ChannelSelectMenuInteraction, TextInputStyle } from 'discord.js';

interface ChannelPage extends Page {
    index: number
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
        super('channel', 'Select a channel to send the ticket to', 'Ticket');
    }

    async execute(
        _client: DiscordClient,
        interaction: ChannelSelectMenuInteraction,
    ) {
        const val = interaction.values[0];
        console.log(interaction.values);
        const title = interaction.message.embeds[0].title;
        const isCategoryTicket =
            title?.includes('Category');
        const isChannelTicket =
            title?.includes('Channel');
        const lastPanel = await TicketHandler.getInstance().getLastPanelCreated(
            interaction.guild!.id,
        );
        const page =
            title && title.startsWith('Setup ')
                ? parseInt(
                      title.slice(
                          title.indexOf('Setup ') + 'Setup '.length,
                          title.indexOf('/'),
                      ),
                  )
                : 1;

        if (isCategoryTicket) {
            lastPanel!.set('categoryId', val);
            await interaction.update({
                content: `You have selected the category \`${
                    interaction.guild!.channels.cache.get(val)!.name
                }\``,
                embeds: [],
                components: [],
            });
            await interaction.deferUpdate();
            return;
        }
        if (isChannelTicket && page === 4) {
            await interaction.update({
                content: `You have selected the channel \`${interaction.guild!.channels.cache.get(val)!.name}\``,
                embeds: [],
                components: [],
            });
            await interaction.deferUpdate();
            lastPanel!.set('channelId', val);
            return;
        } else if (isChannelTicket && page === 6) {
            await interaction.update({
                content: `You have selected the channel \`${interaction.guild!.channels.cache.get(val)!.name}\``,
                embeds: [],
                components: [],
            });
            await interaction.deferUpdate();
            return;
        }
    }
}
