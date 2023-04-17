import { ModalSubmitInteraction } from "discord.js";
import { BaseInteraction } from "./BaseInteraction.class";
import { DiscordClient } from "./BaseSlashCommand.class";

export class BaseModalInteraction extends BaseInteraction {
    constructor(name: string, description: string, moduleName: string) {
        super(name, description, moduleName);
    }

    /**
     * @description Executes the interaction
     * @param {DiscordClient} client
     * @param {ModalSubmitInteraction} interaction
     * @returns {Promise<void>}
     */
    async execute(
        _client: DiscordClient,
        _interaction: ModalSubmitInteraction,
    ): Promise<void> {
        throw new Error("Method not implemented.");
    }
}