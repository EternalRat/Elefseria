const PermissionGuard = require('../PermissionGuard')
module.exports = class BaseCommand {
  /**
   * 
   * @param {String} name 
   * @param {String} category 
   * @param {Array<String>} aliases 
   * @param {Number} cooldown 
   * @param {Boolean} guildOnly 
   * @param {String} description 
   * @param {String} usage 
   * @param {PermissionGuard} permissions 
   */
  constructor(name, category, aliases, cooldown, guildOnly, description, usage, permissions) {
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