const { Message, Client } = require('discord.js');
const BaseCommand = require('../../utils/structures/BaseCommand');
const PermissionGuard = require('../../utils/PermissionGuard');
const Ticket = require("./Ticket")

module.exports = class TranscriptCommand extends BaseCommand {
  constructor() {
    super('ticket', 'ticket', [], 3, false, "Command ticket manager", null, new PermissionGuard(["ADMINISTRATOR"]));
  }

  /**
   * 
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array} args 
   */
  run(client, message, args) {
    if (args.length !== 1 && args.length !== 2) return;
    let [cmd, ...arg] = args.join(' ').trim().split(/\s+/)
    let ticket = new Ticket();
    if (cmd === "transcript") {
      ticket.transcriptTicket(message);
    } else if (cmd === "close") {
      ticket.closeTicket(message);
    } else if (cmd === "add") {
      ticket.addPersonTicket(message, arg)
    } else if (cmd === "create") {
      ticket.createTicket(msg)
    }
  }
}