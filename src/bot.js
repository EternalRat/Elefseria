require('dotenv').config();
const { Client } = require('discord.js');
const FunModule = require('./modules/FunModule');
const GiveawayModule = require('./modules/GiveawayModule');
const ModerationModule = require('./modules/ModerationModule.Js');
const ReactionRoleModule = require('./modules/ReactionRoleModule');
const SecurityModule = require('./modules/SecurityModule.Js');
const SettingsModule = require('./modules/SettingsModule');
const TicketModule = require('./modules/TicketModule.Js');
const { registerCommands, registerEvents } = require('./utils/registry');
const BaseModule = require('./utils/structures/BaseModule');
const client = new Client();

(async () => {
  client.modules = new Set([
    new FunModule(),
    new GiveawayModule(),
    new ModerationModule(),
    new ReactionRoleModule(),
    new SecurityModule(),
    new SettingsModule(),
    new TicketModule()
  ]);
  client.events = new Map();
  client.prefix = process.env.DISCORD_BOT_PREFIX;
  client.modules.forEach(moduleToLoad => {
    await moduleToLoad.loadCommands();
  });
  await registerEvents(client, '../events');
  await client.login(process.env.DISCORD_BOT_TOKEN);
})();

