import { TicketHandler } from '@src/class/ticket/TicketHandler.class';
import { DiscordClient } from '@src/structures';
import { BaseButtonInteraction } from '@src/structures/base/BaseButtonInteraction.class';
import { buildButtons, buildButtonsModal, Page } from '@src/util/ticket';
import {
    ActionRowBuilder,
    APIEmbed,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    EmbedBuilder,
    RoleSelectMenuBuilder,
    TextInputStyle,
} from 'discord.js';
import { Model } from 'sequelize';

export class AddPanelButtonInteraction extends BaseButtonInteraction {
    constructor() {
        super('addPanel', 'Add a panel', 'Ticket', 0);
    }

    async execute(
        _client: DiscordClient,
        interaction: ButtonInteraction,
    ): Promise<void> {
        const ticketHandler = TicketHandler.getInstance();
        const lastPanel = await ticketHandler.createIfLastPanelActive(
            interaction.guildId!,
            await ticketHandler.getLastPanelCreated(interaction.guild!.id),
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
        await interaction.deferUpdate({
            fetchReply: true,
        });
        if (page === 6) {
            const saveBtn = new ButtonBuilder()
                .setCustomId('savePanel')
                .setLabel('Validate')
                .setStyle(ButtonStyle.Primary);
            const backBtn = new ButtonBuilder()
                .setCustomId('backPanel')
                .setLabel('Back')
                .setStyle(ButtonStyle.Secondary);
            const cancelBtn = new ButtonBuilder()
                .setCustomId('cancelPanel')
                .setLabel('Cancel')
                .setStyle(ButtonStyle.Danger);
            const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
                saveBtn,
                backBtn,
                cancelBtn,
            ]);
            const embed = new EmbedBuilder()
                .setTitle('Do you want to save this panel ?')
                .setDescription(
                    'If you click on validate, the panel will be saved and you will be redirected to the panel list',
                )
                .setColor('Random');
            await interaction.editReply({
                embeds: [embed],
                components: [row],
            });
        } else {
            const replyComponents = await AddPanelButtonInteraction.buildReply(
                lastPanel,
                page,
            );

            await interaction.editReply({
                embeds: [...replyComponents.embeds],
                components: [...replyComponents.components],
            });
        }
    }

    public static async buildReply(
        lastPanel: Model<any, any>,
        page: number,
        data?: {
            name?: string;
            message?: string;
            channelId?: string;
            transcriptChannelId?: string;
            categoryId?: string;
            rolesId?: string[];
        },
    ) {
        const embeds: APIEmbed[] = [
            AddPanelButtonInteraction.pagesBuilder[page].embed,
        ];
        const components = [];
        if (data) {
            if (data.rolesId) {
                lastPanel.set('rolesId', data.rolesId.join(','));
            } else {
                lastPanel.set(data);
            }
            await lastPanel.save();
        }
        if (AddPanelButtonInteraction.pagesBuilder[page].modals) {
            const btns = buildButtonsModal(
                lastPanel,
                AddPanelButtonInteraction.pagesBuilder[page].name,
                AddPanelButtonInteraction.pagesBuilder[page].modals!.components,
            );
            if ((lastPanel.get('name') as string).length > 0 && page === 0) {
                const embedBuilder = new EmbedBuilder()
                    .setTitle('Panel Name')
                    .setDescription(lastPanel.get('name') as string);
                embeds.push(embedBuilder.toJSON());
            }
            if ((lastPanel.get('message') as string).length > 0 && page === 4) {
                const embedBuilder = new EmbedBuilder()
                    .setTitle('Panel Message')
                    .setDescription(lastPanel.get('message') as string);
                embeds.push(embedBuilder.toJSON());
            }
            const newComponentRows = [];
            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                ...btns.always,
            );
            newComponentRows.push(row);
            if (btns.optional.length > 0) {
                const rowOptional =
                    new ActionRowBuilder<ButtonBuilder>().addComponents(
                        ...btns.optional,
                    );
                newComponentRows.push(rowOptional);
            }
            components.push(...newComponentRows.reverse());
        } else {
            const btns = buildButtons(
                AddPanelButtonInteraction.pagesBuilder[page].components!,
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
            const newComponents = [];
            if (rowRole.components.length > 0) newComponents.push(rowRole);
            if (rowChannel.components.length > 0)
                newComponents.push(rowChannel);
            if (rowCategory.components.length > 0)
                newComponents.push(rowCategory);
            newComponents.push(rowBtn);
            components.push(...newComponents);
            if (
                (lastPanel.get('transcriptChannelId') as string).length > 0 &&
                page === 3
            ) {
                const embedBuilder = new EmbedBuilder()
                    .setTitle('Transcript Channel')
                    .setDescription(
                        `<#${lastPanel.get('transcriptChannelId')}>`,
                    );
                embeds.push(embedBuilder.toJSON());
            }
            if (
                (lastPanel.get('channelId') as string).length > 0 &&
                page === 5
            ) {
                const embedBuilder = new EmbedBuilder()
                    .setTitle('Channel where the panel will be sent')
                    .setDescription(`<#${lastPanel.get('channelId')}>`);
                embeds.push(embedBuilder.toJSON());
            }
            if (
                (lastPanel.get('categoryId') as string).length > 0 &&
                page === 1
            ) {
                const embedBuilder = new EmbedBuilder()
                    .setTitle('Category where the ticket will be sent')
                    .setDescription(`<#${lastPanel.get('categoryId')}>`);
                embeds.push(embedBuilder.toJSON());
            }

            if ((lastPanel.get('rolesId') as string).length > 0 && page === 2) {
                const embedBuilder = new EmbedBuilder()
                    .setTitle('Allowed Roles')
                    .setDescription(
                        `<@&${(lastPanel.get('rolesId') as string)
                            .split(',')
                            .join('> <@&')}>`,
                    );
                embeds.push(embedBuilder.toJSON());
            }
        }
        return {
            embeds,
            components,
        };
    }

    static pagesBuilder: Page[] = [
        {
            name: 'Name',
            embed: {
                title: 'Setup 1/6 - Panel Name',
                description: 'Register the name of the panel',
            },
            modals: {
                components: [
                    {
                        style: ButtonStyle.Primary,
                        label: 'Save and next',
                        customId: 'addPanel',
                    },
                    {
                        style: ButtonStyle.Danger,
                        label: 'Cancel',
                        customId: 'cancelPanel',
                    },
                    {
                        style: ButtonStyle.Secondary,
                        label: 'Back',
                        customId: 'backPanel',
                    },
                ],
            },
        },
        {
            name: 'Category',
            embed: {
                title: 'Setup 2/6 - Category',
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
                            customId: 'addPanel',
                        },
                        {
                            style: ButtonStyle.Danger,
                            label: 'Cancel',
                            customId: 'cancelPanel',
                        },
                        {
                            style: ButtonStyle.Secondary,
                            label: 'Back',
                            customId: 'backPanel',
                        },
                    ],
                },
                {
                    type: 'category',
                    components: [
                        {
                            style: TextInputStyle.Short,
                            label: 'Category name',
                            customId: 'categoryName',
                        },
                    ],
                },
            ],
        },
        {
            name: 'Roles',
            embed: {
                title: 'Setup 3/6 - Allowed Roles',
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
                            customId: 'addPanel',
                        },
                        {
                            style: ButtonStyle.Danger,
                            label: 'Cancel',
                            customId: 'cancelPanel',
                        },
                        {
                            style: ButtonStyle.Secondary,
                            label: 'Back',
                            customId: 'backPanel',
                        },
                    ],
                },
                {
                    type: 'role',
                    components: [
                        {
                            style: TextInputStyle.Short,
                            label: 'Role name',
                            customId: 'roleTicket',
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
                            customId: 'addPanel',
                        },
                        {
                            style: ButtonStyle.Danger,
                            label: 'Cancel',
                            customId: 'cancelPanel',
                        },
                        {
                            style: ButtonStyle.Secondary,
                            label: 'Back',
                            customId: 'backPanel',
                        },
                    ],
                },
                {
                    type: 'channel',
                    components: [
                        {
                            style: TextInputStyle.Short,
                            label: 'Channel name',
                            customId: 'channelName',
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
            modals: {
                components: [
                    {
                        style: ButtonStyle.Primary,
                        label: 'Save and next',
                        customId: 'addPanel',
                    },
                    {
                        style: ButtonStyle.Danger,
                        label: 'Cancel',
                        customId: 'cancelPanel',
                    },
                    {
                        style: ButtonStyle.Secondary,
                        label: 'Back',
                        customId: 'backPanel',
                    },
                ],
            },
        },
        {
            name: 'Channel',
            embed: {
                title: 'Setup 6/6 - Channel To Send',
                description:
                    'Register the channel where the panel will be sent',
            },
            components: [
                {
                    type: 'button',
                    components: [
                        {
                            style: ButtonStyle.Primary,
                            label: 'Save and send',
                            customId: 'addPanel',
                        },
                        {
                            style: ButtonStyle.Danger,
                            label: 'Cancel',
                            customId: 'cancelPanel',
                        },
                        {
                            style: ButtonStyle.Secondary,
                            label: 'Back',
                            customId: 'backPanel',
                        },
                    ],
                },
                {
                    type: 'channel',
                    components: [
                        {
                            style: TextInputStyle.Short,
                            label: 'Channel name',
                            customId: 'channelName',
                        },
                    ],
                },
            ],
        },
    ];
}
