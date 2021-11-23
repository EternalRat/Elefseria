const BaseCommand = require('../../utils/structures/BaseCommand');
const ms = require("ms")
const { MessageEmbed } = require("discord.js")
const moment = require("moment")
const { saveGiveaway, scheduleGiveaways } = require("../../utils/structures/giveaway");
const PermissionGuard = require('../../utils/PermissionGuard');

const prompts = [
  "What are you giving ?",
  "How long do you want the giveaway to last?",
  "How many winners?"
]

module.exports = class CreateCommand extends BaseCommand {
  constructor() {
    super('create', 'giveaway', ["creategiveaway"], 3, true, "Organize a giveaway", "<channel>", new PermissionGuard(["MANAGE_CHANNELS"]));
  }

  run(client, msg, args) {
    if (!args.length) return
    create_giveaway(client, args, msg)
  }
}


async function create_giveaway(client, args, message) {
  if (args.length !== 1) return message.channel.send("Enter a channel please")
  let channel = message.mentions.channels.first()
  if (!channel) return message.channel.send("Tag a valid channel please")
  try {
      const response = await getResponses(message)
      const embed = new MessageEmbed()
          .setTitle(response.prize)
          .setDescription(`Number of winners: ${response.winners}\nDuration: ${response.duration}`)
      const msg = await message.channel.send('Confirm', embed);
      await msg.react("👍");
      await msg.react("👎");
      const filter = (reaction, user) => ["👍", "👎"].includes(reaction.emoji.name) && !user.bot && user.id === message.author.id
      const reactions = await msg.awaitReactions(filter, {max: 1, time: 60000, errors: ['time']})
      const choice = reactions.get('👍') || reactions.get('👎')
      if (choice.emoji.name === '👍') {
          response.endsOn = new Date(Date.now() + ms(response.duration))
          response.HostId = message.author.id
          const giveawayEmbed = new MessageEmbed()
              .setTitle(response.prize)
              .setDescription(
                  `React with 🎉 to enter!
                  Winners: ${response.winners}
                  Hosted by: ${message.guild.members.cache.get(response.HostId)}`
              )
              .setFooter(`Ends at • ${moment.parseZone(new Date(Date.now() + ms(response.duration) + ms("1h"))).format("dddd Do MMMM in YYYY, HH:mm:ss")}`)
          const giveawayMsg = await message.guild.channels.cache.get(channel.id).send("<@&818143833308266536>\n🎉 **GIVEAWAY** 🎉", giveawayEmbed)
          await giveawayMsg.react('🎉');
          response.messageId = giveawayMsg.id;
          response.guildId = giveawayMsg.guild.id;
          response.channelId = channel.id;
          await saveGiveaway(response);
          await scheduleGiveaways(client, [response]);
      } else if (choice.emoji.name === '👎') {
          message.channel.send("Giveaway cancel");
      }
  } catch(err) {
      console.log(err)
  }
}

async function getResponses(message) {
  const validTime = /^\d+(s|m|h|d|S|M|H|D)$/;
  const validNumber = /\d+/;
  const responses = { };

  for (let i = 0; i < prompts.length; i++) {
      await message.channel.send(prompts[i]);
      const response = await message.channel.awaitMessages(m => m.author.id === message.author.id,
          {max: 1, time: 30000, errors: ['time'] });
      const { content } = response.first();
      if (i === 0)
          responses.prize = content;
      if (i === 1)
          if (validTime.test(content))
              responses.duration = content;
          else
              throw new Error("Invalid format output")
      if (i === 2)
          if (validNumber.test(content))
              responses.winners = content;
          else
              throw new Error("Invalid entry for winners")
  }
  return responses;
}