import { Message, Events } from 'discord.js';
import { BaseEvent, DiscordClient } from '@src/structures';

/**
 * @description MessageEdited event
 * @class MessageEditedEvent
 * @extends BaseEvent
 * @method execute - Executes the event
 */
export class MessageEditedEvent extends BaseEvent {
    constructor() {
        super(Events.MessageUpdate, false);
    }

    /**
     * @description Executes the event
     * @param {DiscordClient} client
     * @param {Message} message
     * @param {string[]} args
     * @returns {Promise<void>}
     */
    async execute(
        client: DiscordClient,
        message: Message,
        ...args: string[]
    ): Promise<void> {
        if (message.author && message.author.bot) return;

        if (!message.author) {
            console.info(
                `Message edited: ${message.content}, new content: ${args[0]}`,
            );
        } else
            console.info(
                `Message edited: ${message.content}, new content: ${args[0]} by ${message.author.tag}`,
            );
    }
}
