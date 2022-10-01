const {MessageEmbed} = require("discord.js");

/**
 * Send a embed which can swap with reactions
 * @param {Channel} channel where is the embed gonna be send
 * @param {[MessageEmbed]} list of embeds
 */
async function sendList(channel, list) {

	const emojiNext = '➡'; // unicode emoji are identified by the emoji itself
	const emojiPrevious = '⬅';
	const reactionArrow = [emojiPrevious, emojiNext];
	const time = 60000; // time limit: 1 min

	function getList(i, list) {
		return list[i]; // i+1 because we start at 0
	}

	function filter(reaction, user){
		return (!user.bot) && (reactionArrow.includes(reaction.emoji.name)); // check if the emoji is inside the list of emojis, and if the user is not a bot
	}

	function onCollect(r, message, i, list, u) {
		if (u.bot == true)
			return i
		if ((r.emoji.name === emojiPrevious)) {
			i = ((i - 1) < 0) ? list.length - 1 : (i - 1)
			message.edit({embeds: [getList(i, list)]});
		} else if ((r.emoji.name === emojiNext)) {
			i = ((i + 1) > list.length - 1) ? 0 : (i + 1)
			message.edit({embeds: [getList(i, list)]});
		}
		r.users.remove(u.id)
		return i;
	}

	function createCollectorMessage(message, list) {
		let i = 0;
		const collector = message.createReactionCollector(filter, { time });
		collector.on('collect', (r, u) => {
		i = onCollect(r, message, i, list, u);
		});
		collector.on('end', collected => message.clearReactions());
	}
	
	channel.send({embeds: [getList(0, list)]})
	  .then(msg => msg.react(emojiPrevious))
	  .then(msgReaction => msgReaction.message.react(emojiNext))
	  .then(msgReaction => createCollectorMessage(msgReaction.message, list));
}

module.exports = {
    sendList
}