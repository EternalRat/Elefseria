const BaseCommand = require("../../utils/structures/BaseCommand");
const PermissionGuard = require("../../utils/PermissionGuard");
const { MessageEmbed, Message, Client } = require("discord.js");
const fs = require("fs");
require("dotenv").config();

module.exports = class UnmuteCommand extends BaseCommand {
  constructor() {
	super(
	  "unmute",
	  "moderation",
	  [],
	  5,
	  true,
	  "Unmute an user",
	  "<userId/user>",
	  new PermissionGuard(["MANAGE_MESSAGES"])
	);
  }

  /**
   *
   * @param {Client} client
   * @param {Message} msg
   * @param {Array} args
   */
  async run(client, msg, args) {
	var embedColor = "#ffffff";
	var missingArgsEmbed = new MessageEmbed() // Creates the embed thats sent if the command isnt run right
	  .setColor(embedColor)
	  .setAuthor({
		name: msg.author.username,
		iconURL: msg.author.avatarURL(),
	  })
	  .setTitle("Missing arguments")
	  .setDescription(
		`Usage: \`${process.env.DISCORD_BOT_PREFIX}${this.name} ${this.usage}\``
	  )
	  .setTimestamp();
	try {
		var toMute = await msg.guild.members.fetch(
			msg.mentions.users.first() || args[0]
		);
	} catch (err) {}
	var embedColor = "#ffffff";
	if (!toMute) return msg.channel.send({ embeds: [missingArgsEmbed] });
	msg.delete().catch();
	let role = msg.guild.roles.cache.find((r) => r.name === "Muted");
	if (!role || !toMute.roles.cache.has(role.id))
	  return msg.channel.send("Done!");
	if (msg.author === toMute.user) return;
	await toMute.roles.remove(role);
	delete client.mutes[toMute.id];
	fs.writeFile(
	  "./src/utils/json/mute.json",
	  JSON.stringify(client.mutes),
	  (err) => {
		if (err) throw err;
		console.log(`I have unmuted ${toMute}.`);
	  }
	);
  }
};
