import { ButtonInteraction } from 'discord.js';

import { BaseInteraction } from './BaseInteraction.class';
import { DiscordClient } from './BaseSlashCommand.class';

export class BaseButtonInteraction extends BaseInteraction {
	private _cooldown: number;

	constructor(
		name: string,
		description: string,
		moduleName: string,
		cooldown: number,
		isEnabled?: boolean,
		permissions?: bigint[],
	) {
		super(name, description, moduleName, isEnabled, permissions);
		this._cooldown = cooldown;
	}

	/**
	 * @description Returns the cooldown of the command
	 * @returns {number}
	 * @example
	 * // returns 1000
	 * command.getCooldown();
	 * @category Getter
	 */
	public get cooldown(): number {
		return this._cooldown;
	}

	public async execute(
		_client: DiscordClient,
		interaction: ButtonInteraction,
	): Promise<void> {
		interaction.reply({
			content: 'This command is not yet implemented',
			ephemeral: true,
		});
	}
}
