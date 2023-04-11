import {
    Message,
    EmbedBuilder,
    TextChannel,
    ChannelType,
    ColorResolvable,
    Colors,
    CategoryChannelResolvable,
    MessageCreateOptions,
    GuildChannel,
    Channel,
    Interaction,
    Collection,
    OverwriteResolvable,
} from 'discord.js';
import { DiscordClient } from '@src/structures';
import { ChatInputCommandInteraction } from 'discord.js';
import { Ticket } from './ticket.class';
import { TicketHandler } from '@src/class/database/handler/ticket.handler.class';

interface EmbebError {
    title: string;
    description: string;
    color: ColorResolvable;
}

/**
 * @description Ticket Manager
 * @class TicketManager
 */
export class TicketManager {
    private static instance: TicketManager = new TicketManager();
    private tickets: Map<string, Ticket> = new Map();

    constructor() {
        if (TicketManager.instance) {
            throw new Error(
                'Error: Instantiation failed: Use TicketManager.getInstance() instead of new.',
            );
        }
        TicketManager.instance = this;
    }

    /**
     * @description Instance of TicketManager
     * @returns {TicketManager} TicketManager instance
     */
    public static getInstance(): TicketManager {
        return TicketManager.instance;
    }

    /**
     * @description Get tickets of a guild
     * @param guildId
     * @returns
     */
    public getTicket(channelId: string): Ticket | undefined {
        return this.tickets.get(channelId);
    }

    public async setNewTicketFromMessage(message: Message) {
        let ticket = await TicketHandler.getTicketById(message.channelId!);
        if (!this.tickets.get(message.channelId!) && ticket) {
            this.tickets.set(
                message.channelId!,
                new Ticket(
                    message.channel as TextChannel,
                    ticket?.owner,
                    ticket.permissions,
                ),
            );
        }
        if (!ticket) {
            this.tickets.set(
                message.channelId!,
                new Ticket(
                    message.channel as TextChannel,
                    message.author.id,
                    [],
                ),
            );
        }
    }

    /**
     * @description Create a ticket
     * @param {Message} message
     * @param {DiscordClient} client
     * @returns {Promise<void>}
     */
    async createTicket(message: Message, client: DiscordClient): Promise<void> {
        const channel = message.channel as TextChannel;
        const guild = message.guild;
        const member = message.member;

        if (!guild || !guild.id) {
            const embedError = this.buildEmbedError(message, client, {
                title: 'Error',
                description: 'The guild does not exist',
                color: Colors.Red,
            });
            message.channel.send({ embeds: [embedError] });
            return;
        }
        const ticketCategory = guild?.channels.cache.find(
            (channel) => channel.name === 'Tickets',
        ) as CategoryChannelResolvable;
        if (!ticketCategory) {
            const embedError = this.buildEmbedError(message, client, {
                title: 'Error',
                description: 'The category `Tickets` does not exist',
                color: Colors.Red,
            });
            message.channel.send({ embeds: [embedError] });
            return;
        }

        const setPermissions = new Array<OverwriteResolvable>();
        setPermissions.push({
            id: guild?.id,
            deny: ['ViewChannel'],
        });
        setPermissions.push({
            id: member!.user.id,
            allow: ['ViewChannel'],
        });

        const ticketChannel = await guild?.channels.create({
            name: `ticket-${member?.user.username}`,
            type: ChannelType.GuildText,
            parent: ticketCategory,
            permissionOverwrites: setPermissions,
        });

        this.tickets.set(
            ticketChannel?.id!,
            new Ticket(ticketChannel, message.author.id, setPermissions),
        );
    }

    async deleteTicket(
        interaction: ChatInputCommandInteraction,
        client: DiscordClient,
    ) {
        if (!interaction.channel) return;
        if (!this.getTicket(interaction.channelId!)) {
            const embedError = this.buildEmbedError(interaction, client, {
                title: 'Error',
                description: "Can't be deleted because it is not a ticket",
                color: Colors.Red,
            });
            interaction.channel!.send({ embeds: [embedError] });
            return;
        }
        this.tickets
            .get(interaction.channelId!)
            ?.deleteTicket(interaction, client);
    }

    async cancelDeleteTicket(channelId: string) {
        this.tickets.get(channelId)?.setIsBeingDeleted(false);
    }

    async createTicketFromDB(
        channel: TextChannel,
        owner: string,
        permissions: OverwriteResolvable[],
    ) {
        this.tickets.set(channel.id, new Ticket(channel, owner, permissions));
    }

    /**
     * @description Build embed error
     * @param {Message} message
     * @param {DiscordClient} client
     * @param {EmbebError} options
     * @returns {EmbedBuilder}
     */
    private buildEmbedError(
        message: Message | ChatInputCommandInteraction,
        client: DiscordClient,
        options: EmbebError,
    ): EmbedBuilder {
        let username = '';
        if (message instanceof ChatInputCommandInteraction)
            username = message.user.username;
        if (message instanceof Message) username = message.author.username;

        const embedError = new EmbedBuilder()
            .setTitle(options.title)
            .setDescription(options.description)
            .setColor(options.color)
            .setFooter({
                text: `Requested by ${username}`,
            });
        return embedError;
    }
}
