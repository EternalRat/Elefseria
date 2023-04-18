import { DiscordClient } from '@src/structures';
import { BaseModalInteraction } from '@src/structures/base/BaseModalInteraction.class';
import { ModalSubmitInteraction } from 'discord.js';

export class CreatePanelModalInteraction extends BaseModalInteraction {
    constructor() {
        super('createpanel', 'Create a panel', 'Ticket');
    }

    async execute(
        _client: DiscordClient,
        interaction: ModalSubmitInteraction,
    ): Promise<void> {
        const _name = interaction.fields.getTextInputValue('name');
    }
}
