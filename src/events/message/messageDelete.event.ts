import { BaseEvent, DiscordClient } from '@src/structures';
import { Events, Message } from 'discord.js';

/**
 * @description MessageDeleted event
 * @class MessageDeletedEvent
 * @extends BaseEvent
 * @method execute - Executes the event
 */
export class MessageDeletedEvent extends BaseEvent {
    constructor() {
        super(Events.MessageDelete, false);
    }

    /**
     * @description Executes the event
     * @param {DiscordClient} client
     * @param {Message} message
     * @param {string[]} args
     */
    async execute(
        _client: DiscordClient,
        message: Message,
        ..._args: string[]
    ): Promise<void> {
        if (message.author && message.author.bot) return;

        if (!message.author) {
            console.info(`Message deleted: ${message.content}`);
        } else
            console.info(
                `Message deleted: ${message.content} by ${message.author.tag}`,
            );
    }
}
