import { BaseEvent, DiscordClient } from '@src/structures';
import { BaseModalInteraction } from '@src/structures/base/BaseModalInteraction.class';
import { Events, Interaction } from 'discord.js';

/**
 * @description InteractionCreated event
 * @category Events
 * @extends BaseEvent
 */
export class InteractionCreatedEvent extends BaseEvent {
    constructor() {
        super(Events.InteractionCreate, false);
    }

    /**
     * @description Executes the event
     * @param {DiscordClient} client
     * @param {Interaction} interaction
     * @returns {Promise<void>}
     * @override
     */
    async execute(
        client: DiscordClient,
        interaction: Interaction,
    ): Promise<void> {
        if (!interaction.isModalSubmit()) return;
        for (const module of client.getModules().values()) {
            if (module.getModalInteractions().size == 0) continue;
            if (!module.getModalInteractions().has(interaction.customId))
                continue;
            const command: BaseModalInteraction = module
                .getModalInteractions()
                .get(interaction.customId)! as BaseModalInteraction;
            if (!command) continue;
            try {
                await command.execute(client, interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: 'There was an error while executing this command!',
                    ephemeral: true,
                });
            }
        }
    }
}
