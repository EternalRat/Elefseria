module.exports = class BaseCommand {
  constructor(name = String, category = String, aliases = String, cooldown = Number, guildOnly = Boolean, description = String, usage = String, permissions) {
    this.name = name;
    this.category = category;
    this.aliases = aliases;
    this.cooldown = cooldown;
    this.guildOnly = guildOnly;
    this.description = description;
    this.usage = usage;
    this.permissions = permissions;
  }
}