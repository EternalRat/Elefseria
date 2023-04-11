import { DiscordClient, BaseEvent } from '@src/structures';
import { MessageReaction, User, Events } from 'discord.js';
import { ReactionRole } from '@src/class/reaction/reactionRole.class';

export class MessageReactionAddEvent extends BaseEvent {
    constructor() {
        super(Events.MessageReactionAdd);
    }

    public async execute(
        client: DiscordClient,
        reaction: MessageReaction,
        user: User,
    ) {
        if (user.bot || user.id === client.user?.id) return;
        await ReactionRole.getInstance().addRole(reaction, user);
    }
}
