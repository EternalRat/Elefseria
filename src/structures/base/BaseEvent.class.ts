import { DiscordClient } from '@src/structures';

/**
 * @description Base class for events
 * @category BaseClass
 */
export abstract class BaseEvent {
	name: string;
	once: boolean;

	constructor(name: string, once: boolean = false) {
		this.name = name;
		this.once = once;
	}

	/**
	 * @description Executes the event
	 * @param {DiscordClient} client
	 * @param {...args} args
	 * @returns {Promise<void>}
	 */
	async execute(_client: DiscordClient, ..._args: any): Promise<void> {
		throw new Error(
			`The execute method has not been implemented in ${this.name}`,
		);
	}
}
