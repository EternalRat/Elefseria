import { BaseEvent, BaseSlashCommand, DiscordClient } from '@src/structures';
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
        if (!interaction.isCommand()) return;
        console.log(interaction);
        for (const module of client.getModules().values()) {
            if (module.getSlashCommands().size == 0) continue;
            if (!module.getSlashCommands().has(interaction.commandName))
                continue;
            const command: BaseSlashCommand = module
                .getSlashCommands()
                .get(interaction.commandName)! as BaseSlashCommand;
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
