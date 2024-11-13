import { TicketHandler } from '@src/class/ticket/TicketHandler.class';
import {
	BaseSlashCommand,
	DiscordClient,
	SlashCommandOptionType,
} from '@src/structures';
import { ChatInputCommandInteraction } from 'discord.js';

/**
 * @description TicketOpen slash command
 * @class TicketOpen
 * @extends BaseSlashCommand
 */
export class TicketRemoveUserSlashCommand extends BaseSlashCommand {
	constructor() {
		super('removeuser', 'Remove an user from this ticket', 'Ticket', [
			{
				name: 'user',
				description: 'The user to remove from the ticket',
				type: SlashCommandOptionType.USER,
			},
			{
				name: 'reason',
				description: 'The reason for removing the user',
				type: SlashCommandOptionType.STRING,
			},
		]);
	}

	/**
	 * @description Executes the slash command
	 * @param {DiscordClient} client
	 * @param {ChatInputCommandInteraction} interaction
	 * @returns {Promise<void>}
	 */
	async execute(
		client: DiscordClient,
		interaction: ChatInputCommandInteraction,
	): Promise<void> {
		const user = interaction.options.getUser('user');
		const reason = interaction.options.getString('reason');
		const ticketInstance = TicketHandler.getInstance();
		if (!interaction.guildId) {
			await interaction.reply({
				content: 'This command can only be used in a server',
				ephemeral: true,
			});
			return;
		}
		if (!interaction.channelId) {
			await interaction.reply({
				content:
					'This command can only be used in a channel, if you are in a ticket, try again discord may have not updated the channel id yet',
				ephemeral: true,
			});
			return;
		}
		if (!user) {
			await interaction.reply({
				content: 'You must provide a user to add to the ticket',
				ephemeral: true,
			});
			return;
		}
		if (!reason) {
			await interaction.reply({
				content: 'You must provide a reason for adding the user',
				ephemeral: true,
			});
			return;
		}
		if (!(await ticketInstance.isTicket(interaction.channelId))) {
			await interaction.reply({
				content: 'This channel is not a ticket',
				ephemeral: true,
			});
			return;
		}
		ticketInstance
			.removeUserFromTicket(interaction.channel!, [user])
			.then(() => {
				interaction.reply({
					content: `The user ${user} has been removed from this ticket for the reason \`${reason}\``,
				});
			})
			.catch((err) => {
				interaction.reply({
					content: `An error occurred while removing the user from this ticket: \`${err}\``,
					ephemeral: true,
				});
				return;
			});
	}
}
