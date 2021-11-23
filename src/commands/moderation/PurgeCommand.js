const BaseCommand = require('../../utils/structures/BaseCommand');
const {MessageEmbed, Client, Message} = require("discord.js");
const PermissionGuard = require('../../utils/PermissionGuard');

module.exports = class PurgeCommand extends BaseCommand {
  constructor() {
    super('purge', 'moderation', [], 3, true, "Clear message from an user", "<userId/amount> [amount]", new PermissionGuard(["MANAGE_MESSAGES"]));
  }

  /**
   * 
   * @param {Client} client 
   * @param {Message} msg 
   * @param {Array} args 
   */
  async run(client, msg, args) {
    const user = msg.mentions.users.first() || msg.guild.member(args[0]);
    let amount = !!parseInt(args[0]) ? parseInt(args[0]) + 1 : parseInt(args[1]) + 1
    if (!amount) return amount = 20
    msg.channel.messages.fetch({
    limit: amount,
    }).then((messages) => {
        if (user) {
            const filterBy = user ? user.id : client.user.id;
            messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
        }
        msg.channel.bulkDelete(messages).catch(error => console.log(error.stack));
    });
  }
}