import { TicketHandler } from '@src/class/ticket/TicketHandler.class';
import { BaseSlashCommand, DiscordClient } from '@src/structures';
import { ChatInputCommandInteraction, TextChannel } from 'discord.js';

/**
 * @description TicketOpen slash command
 * @class TicketOpen
 * @extends BaseSlashCommand
 */
export class TicketTranscriptSlashCommand extends BaseSlashCommand {
	constructor() {
		super(
			'transcript',
			'Create a transcript for the current ticket.',
			'Ticket',
		);
	}

	/**
	 * @description Executes the slash command
	 * @param {DiscordClient} client
	 * @param {ChatInputCommandInteraction} interaction
	 * @returns {Promise<void>}
	 */
	async execute(
		_client: DiscordClient,
		interaction: ChatInputCommandInteraction,
	): Promise<void> {
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
		if (!(await ticketInstance.isTicket(interaction.channelId))) {
			await interaction.reply({
				content: 'This channel is not a ticket',
				ephemeral: true,
			});
			return;
		}
		ticketInstance
			.transcriptTicket(
				interaction.channel! as TextChannel,
				interaction.guild!,
				interaction.user,
			)
			.then(() => {
				interaction.reply({
					content: 'Transcript created and sent to you !',
					ephemeral: true,
				});
			})
			.catch(() => {
				interaction.reply({
					content:
						'An error occured while creating the transcript, please try again later',
					ephemeral: true,
				});
			});
	}
}
