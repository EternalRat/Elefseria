const BaseEvent = require('../../utils/structures/BaseEvent');
const { User, Channel, Client, Message } = require('discord.js');
const BaseCommand = require('../../utils/structures/BaseCommand');
const blacklist = require('../../utils/database/model/blacklist');

module.exports = class MessageEvent extends BaseEvent {
  constructor() {
    super('message');
  }
  
  /**
   * 
   * @param {Client} client 
   * @param {Message} message 
   */
  async run(client, message) {
    if (message.author.bot) return;
    if (message.content.startsWith(client.prefix)) {
      const [cmdName, ...cmdArgs] = message.content.slice(client.prefix.length).trim().split(/\s+/);
      const command = client.commands.get(cmdName) || client.aliases.get(cmdName);
      if (!command) return;
      if (command.guildOnly && message.channel.type !== "text") return message.channel.send("This is a guildOnly command!")
      if (command && command.permissions) {
        if (command.cooldown && still_cooldown(client, message.author, command, message.channel)) return;
        if (command.permissions.check(message.member.permissions.toArray()))
          command.run(client, message, cmdArgs);
        else
          message.channel.send(`You're missing of permissions for ${command.name} : ${command.permissions.getPerm()}`)
      } else if (command && !command.permissions) {
        if (command.cooldown && still_cooldown(client, message.author, command, message.channel)) return;
        command.run(client, message, cmdArgs);
      }
    } else {
      checkMessage(message);
    }
  }
}

/**
 * 
 * @param {Message} message 
 */
async function checkMessage(message)
{
  const blacklistedWords = await blacklist.find();

  blacklistedWords.forEach(blacklistedWord => {
    if (message.content.includes(blacklistedWord.get('word'))) {
      message.delete();
      message.guild.member(message.author).ban({days: 7, reason: "Tentative de phishing"});
      return;
    }
  });
}

function still_cooldown(client = Client, user = User, command = BaseCommand, channel = Channel)
{
  const timeNow = Date.now();
  const cdAmount = (command.cooldown || 5) * 1000;

  if (!client.cooldown.has(user.id)) {
    client.cooldown.set(user.id, timeNow)
    setTimeout(() => {
      client.cooldown.delete(user.id)
    }, cdAmount);
    return false;
  }
  if (client.cooldown.has(user.id)) {
    const cdExpirationTime = client.cooldown.get(user.id) + cdAmount;
    if (timeNow < cdExpirationTime) {
      timeLeft = (cdExpirationTime - timeNow) / 1000;
      channel.send(`Please, wait ${timeLeft.toFixed(0)}s before using again ${command.name}.`);
    }
  }
  return true;
}