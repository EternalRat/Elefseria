import { TicketHandler } from '@src/class/ticket/TicketHandler.class';
import {
	BaseSlashCommand,
	DiscordClient,
	SlashCommandOptionType,
} from '@src/structures';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

/**
 * @description TicketOpen slash command
 * @class TicketOpen
 * @extends BaseSlashCommand
 */
export class TicketCreateSlashCommand extends BaseSlashCommand {
	constructor() {
		super('create', 'Create a new ticket', 'Ticket', [
			{
				name: 'reason',
				description: 'The reason for creating the ticket',
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
		_client: DiscordClient,
		interaction: ChatInputCommandInteraction,
	): Promise<void> {
		const ticketInstance = TicketHandler.getInstance();
		const reason = interaction.options.getString('reason');
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
		let ticket = await ticketInstance.createTicket(
			'',
			interaction.guild!,
			interaction.user,
			[],
			undefined,
		);
		if (ticket) {
			await interaction.reply({
				content: `Ticket created: <#${ticket.channel}>`,
				ephemeral: true,
			});
			let embed = new EmbedBuilder()
				.setTitle('Ticket Created')
				.setDescription(
					`Ticket created by ${interaction.user} for : ${
						reason ? reason : 'No reason provided'
					}`,
				)
				.setColor('Random')
				.setTimestamp();
			ticket.channel.send({
				embeds: [embed],
			});
		}
	}
}
