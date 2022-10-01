const BaseModule = require('../utils/structures/BaseModule');
const { Client, Message } = require('discord.js');
const path = require('path');
const fs = require('fs').promises;
const BaseCommand = require('../utils/structures/BaseCommand');
const ModuleConfig = require("../utils/database/models/moduleconfig");

module.exports = class ModerationModule extends BaseModule {
	constructor() {
		super("Moderation");
	}
}