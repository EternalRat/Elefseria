import { TicketHandler } from '@src/class/ticket/TicketHandler.class';
import { DiscordClient } from '@src/structures';
import { BaseButtonInteraction } from '@src/structures/base/BaseButtonInteraction.class';
import { Page, buildButtons, buildButtonsModal } from '@src/util/ticket';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    RoleSelectMenuBuilder,
    TextInputStyle,
} from 'discord.js';

const pagesBuilder: Page[] = [
    {
        name: 'Name',
        embed: {
            title: 'Setup 1/6 - Panel Name',
            description: 'Register the name of the panel',
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
        ],
        modals: {
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
    },
    {
        name: 'Roles',
        embed: {
            title: 'Setup 2/6 - Allowed Roles',
            description:
                'Register the roles that will be able to see the tickets corresponding to this panel',
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
                type: 'role',
                components: [
                    {
                        style: TextInputStyle.Short,
                        label: 'Role name',
                        customId: 'rolename',
                    },
                ],
            },
        ],
    },
    {
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
        name: 'Message',
        embed: {
            title: 'Setup 5/6 - Custom Message',
            description:
                'Register the message that will be sent when a ticket is created',
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
        ],
        modals: {
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
    },
    {
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

export class AddPanelButtonInteraction extends BaseButtonInteraction {
    constructor() {
        super('addpanel', 'Add a panel', 'Ticket', 0);
    }

    async execute(
        _client: DiscordClient,
        interaction: ButtonInteraction,
    ): Promise<void> {
        const lastPanel = await TicketHandler.getInstance().getLastPanelCreated(
            interaction.guild!.id,
        );
        const title = interaction.message.embeds[0].title;
        const page =
            title && title.startsWith('Setup ')
                ? parseInt(
                      title.slice(
                          title.indexOf('Setup ') + 'Setup '.length,
                          title.indexOf('/'),
                      ),
                  )
                : 0;
        if (page === 6) {
            await interaction.editReply({
                content: 'This command is currently under development',
                embeds: [],
                components: [],
            });
            return;
        } else if (pagesBuilder[page].modals) {
            const btns = buildButtonsModal(
                lastPanel,
                pagesBuilder[page].name,
                pagesBuilder[page].modals!.components,
            );
            await interaction.deferReply({ ephemeral: true });
            await interaction.editReply({
                embeds: [pagesBuilder[page].embed],
                components: [
                    new ActionRowBuilder<ButtonBuilder>().addComponents(
                        ...btns,
                    ),
                ],
            });
        } else {
            const btns = buildButtons(pagesBuilder[page].components);
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
            await interaction.deferReply({ ephemeral: true });
            await interaction.editReply({
                embeds: [pagesBuilder[page].embed],
                components: [...components],
            });
        }
    }
}
