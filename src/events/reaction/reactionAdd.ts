import { ReactionRole } from '@src/class/reaction/reactionRole.class';
import { BaseEvent, DiscordClient } from '@src/structures';
import { Events, MessageReaction, User } from 'discord.js';

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
