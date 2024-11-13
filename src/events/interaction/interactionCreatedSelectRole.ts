import { BaseEvent, DiscordClient } from '@src/structures';
import { BaseSelectInteraction } from '@src/structures/base/BaseSelectInteraction.class';
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
		if (!interaction.isRoleSelectMenu()) return;
		for (const module of client.getModules().values()) {
			if (module.getSelectRoleInteractions().size == 0) continue;
			if (!module.getSelectRoleInteractions().has(interaction.customId))
				continue;
			const command: BaseSelectInteraction = module
				.getSelectRoleInteractions()
				.get(interaction.customId)! as BaseSelectInteraction;
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
