require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const FinalFantasyModule = require('./modules/FinalFantasyModule');
const FunModule = require('./modules/FunModule');
const GiveawayModule = require('./modules/GiveawayModule');
const LevelingModule = require('./modules/LevelingModule');
const ModerationModule = require('./modules/ModerationModule');
const ReactionRoleModule = require('./modules/ReactionRoleModule');
const SecurityModule = require('./modules/SecurityModule');
const SettingsModule = require('./modules/SettingsModule');
const TicketModule = require('./modules/TicketModule');
const VoiceModule = require('./modules/VoiceModule');
const { registerEvents } = require('./utils/registry');
const client = new Client({
	intents: [
		GatewayIntentBits.FLAGS.GUILDS,
		GatewayIntentBits.FLAGS.GUILD_MESSAGES,
		GatewayIntentBits.FLAGS.GUILD_MESSAGE_REACTIONS,
		GatewayIntentBits.FLAGS.GUILD_MEMBERS,
		GatewayIntentBits.FLAGS.GUILD_VOICE_STATES,
		GatewayIntentBits.FLAGS.GUILD_BANS,
		GatewayIntentBits.FLAGS.GUILD_INVITES
	], partials: [
		"GUILD_MEMBER",
		"USER",
		"MESSAGE",
		"REACTION",
		"CHANNEL"
	],
	allowedMentions: {
		parse: [
			'users',
			'roles',
			'everyone'
		],
		repliedUser: true
	}
});

(async () => {
	const paths = new Array("finalfantasy", "fun", "giveaway", "moderation", "reactionrole", "security", "settings", "ticket", "voice", "leveling");
	client.modules = new Set([
		new FinalFantasyModule(),
		new FunModule(),
		new GiveawayModule(),
		new ModerationModule(),
		new ReactionRoleModule(),
		new SecurityModule(),
		new SettingsModule(),
		new TicketModule(),
		new VoiceModule(),
		new LevelingModule()
	]);
	client.mutes = require("./utils/json/mute.json");
	client.cachedMessageReactions = new Map();
	client.events = new Map();
	client.cooldown = new Map();
	client.events = new Map();
	client.voiceChannel = new Map();
	client.premiumChannel = new Map();
	client.prefix = process.env.DISCORD_BOT_PREFIX;
	var i = 0;
	for (var module of client.modules) {
		await module.loadCommands("../commands/" + paths[i]);
		i++;
	};
	await registerEvents(client, '../events');
	await client.login(process.env.DISCORD_BOT_TOKEN);
})();

