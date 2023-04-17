import { DiscordClient } from '@src/structures';
import { BaseButtonInteraction } from '@src/structures/base/BaseButtonInteraction.class';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    ChannelType,
    RoleSelectMenuBuilder,
    TextInputBuilder,
    TextInputStyle,
} from 'discord.js';

interface Page {
    embed: {
        title: string;
        description: string;
    };
    components: {
        type: 'button' | 'role' | 'channel';
        components: {
            style: ButtonStyle | TextInputStyle;
            label: string;
            customId: string;
        }[];
    }[];
    modals?: {
        components: {
            style: TextInputStyle;
            label: string;
            customId: string;
        }[];
    };
}

const pagesBuilder: Page[] = [
    {
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
                    style: TextInputStyle.Short,
                    label: 'Panel name',
                    customId: 'panelname',
                },
            ],
        },
    },
    {
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
                    style: TextInputStyle.Short,
                    label: 'Message',
                    customId: 'message',
                },
            ],
        },
    },
    {
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
        const title = interaction.message.embeds[0].title;
        const page =
            title && title.startsWith('Setup ')
                ? parseInt(
                      title.slice(
                          title.indexOf('Setup ') + 'Setup '.length,
                          title.indexOf('/'),
                      ),
                  )
                : 1;
        if (page === 6) {
            await interaction.deferUpdate();
            await interaction.editReply({
                content: 'This command is currently under development',
                embeds: [],
                components: [],
            });
            return;
        } else {
            const btns = pagesBuilder[page].components.reduce(
                (btns, btn) => {
                    if (btn.type === 'button') {
                        btns.button.push(
                            ...btn.components.map((btn) => {
                                return new ButtonBuilder()
                                    .setCustomId(btn.customId)
                                    .setLabel(btn.label)
                                    .setStyle(btn.style as ButtonStyle);
                            }),
                        );
                    } else if (btn.type === 'role') {
                        btns.role.push(
                            ...btn.components.map((btn) => {
                                return new RoleSelectMenuBuilder()
                                    .setCustomId(btn.customId)
                                    .setPlaceholder(btn.label);
                            }),
                        );
                    } else if (btn.type === 'channel') {
                        btns.channel.push(
                            ...btn.components.map((btn) => {
                                return new ChannelSelectMenuBuilder()
                                    .setCustomId(btn.customId)
                                    .setPlaceholder(btn.label)
                                    .setChannelTypes([ChannelType.GuildText]);
                            }),
                        );
                    } else if (btn.type === 'category') {
                        btns.category.push(
                            ...btn.components.map((btn) => {
                                return new ChannelSelectMenuBuilder()
                                    .setCustomId(btn.customId)
                                    .setPlaceholder(btn.label)
                                    .setChannelTypes([
                                        ChannelType.GuildCategory,
                                    ]);
                            }),
                        );
                    }
                    return btns;
                },
                {
                    button: [],
                    role: [],
                    channel: [],
                    category: [],
                } as Record<
                    'button' | 'role' | 'channel' | 'category',
                    (
                        | ButtonBuilder
                        | RoleSelectMenuBuilder
                        | TextInputBuilder
                        | ChannelSelectMenuBuilder
                    )[]
                >,
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
            await interaction.deferUpdate();
            await interaction.editReply({
                embeds: [pagesBuilder[page].embed],
                components: [rowRole, rowChannel, rowCategory, rowBtn],
            });
        }
    }
}
