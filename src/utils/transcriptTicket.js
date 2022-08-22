const { MessageManager, GuildChannel, TextChannel, Guild } = require("discord.js");
const fs = require("fs");
const Winrar = require("winrarjs");
const { parseZone } = require("moment");

module.exports = class TranscriptTicket {
	/**
	 * 
	 * @param {Guild} guild 
	 * @param {String} channelName 
	 * @param {String} seller 
	 * @param {String} customer 
	 * @param {String} subject 
	 */
	constructor(guild, channelName, seller, customer, subject) {
		this.guild = guild;
		this.channelName = channelName;
		this.seller = seller;
		this.customer = customer;
		this.subject = subject;
		this.title = `Ticket for ${this.customer} about ${this.subject}`;
		this.content = "";
	}

	/**
	 * Realize the transcription of all the messages in an html format
	 * 
	 * @param {MessageManager} messages 
	 */
	async doTranscript(messages) {
		await messages.fetch({}, {cache: true}).then(message => {
			message.forEach(msg => {
				this.content += `<div class="chatlog__message-group">
				<div class="chatlog__author-avatar-container">
					<img class="chatlog__author-avatar" src=${msg.author.displayAvatarURL({dynamic: true, format: "png" || "gif"})}>
				</div>`;
				this.content += `<div class="chatlog__messages">
					<p id="conv"><span id="username" title="${msg.author.tag}">${msg.author.username}</span> <span id="timestamp">${parseZone(msg.createdTimestamp).format("dddd Do MMMM in YYYY, HH:mm:ss")}</span></br>${msg.content}</p>
				</div>
			</div>`;
			})
		});
		
	}

	/**
	 * Create the html file
	 */
	createFile() {
		var html_content = `<!DOCTYPE html>
		<html>
			<head>
				<meta charset="UTF-8">
				<title>${this.title}</title>
				<style>
				body {
					height: 100%;
					background-color: #2C313C;
					margin: 0;
					padding: 0;
				}

				.ticket {
					width: 100%;
					height: 100%;
					display: flex;
					flex-direction: column;
					flex-wrap: nowrap;
					align-items: center;
					justify-content: center;
				}

				.info {
					display: flex;
					justify-content: center;
					align-items: center;
					max-width: 300px;
				}

				.info__guild-icon-container {
					flex: 0;
				}

				.info__guild-icon {
					max-width: 200px;
					max-height: 200px;
				}

				.info__metadata {
					color: #DCDDDE;
					flex: 1;
					margin-left: 10px;
				}

				.info__guild-name {
					font-size: 40px;
				}

				#chat {
					width: 35%;
					height: 100%;
					justify-content: center;
					align-items: center;
					overflow-x: hidden;
					overflow-y: auto;
					border-radius: 20px;
					border: 7px solid;
					border-color: rgba(0, 0, 0, 0.2);
					box-shadow: 0 0 2em #aaa;
					background-color: #36393E;
				}

				#conv {
					margin: 0 0;
					white-space: pre-wrap;
					white-space: -moz-pre-wrap !important;
					white-space: -pre-wrap;
					white-space: -o-pre-wrap;
					word-wrap: break-word;
					margin-bottom: 10px;
					margin-left: 2%;
					font-size: 16px;
					color: #DCDDDE;
				}

				#username {
					font-weight: bold;
					font-size: 20px;
				}

				#timestamp {
					color: #707070;
					text-shadow: 0px 0px 0.8px rgb(255, 255, 255);
					margin-left: 5px;
					font-size: 16px;
				}

				::-webkit-scrollbar {
					width: 9px;
					height: 9px;
				}

				::-webkit-scrollbar-thumb {
					background: #999999;
					border-radius: 50px;
				}

				::-webkit-scrollbar-track-piece {
					background-color: #36393E;
				}

				.chatlog__author-avatar {
					border-radius: 50%;
					height: 40px;
					width: 40px;
				}

				.chatlog__message-group {
					display: flex;
					margin: 0 10px;
					padding: 15px 0;
					border-top: 1px solid;
				}

				.chatlog__message-group {
					border-color: rgba(255, 255, 255, 0.1);
				}

				.chatlog__author-avatar-container {
					flex: 0;
					width: 40px;
					height: 40px;
				}

				.chatlog__messages {
					flex: 1;
					min-width: 50%;
				}
				</style>
			</head>
			<body>
				<div class="ticket">
					<div class="info">
						<div class="info__guild-icon-container">
							<img class=info__guild-icon
								src=${this.guild.iconURL()}>
						</div>
						<div class="info__metadata">
							<div class="info__guild-name">${this.guild.name}</div>
							<div class="info__channel-name">${this.channelName}</div>
						</div>
					</div>
					<div id="chat">
						${this.content}
					</div>
				</div>
			</body>
		</html>`;

		fs.appendFile(`../tickets/ticket_${this.subject}_${this.customer}.html`, html_content, function (err) {
			if (err) throw err;
		});
	}
}