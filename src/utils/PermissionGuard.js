  
const { Permissions } = require("discord.js");

class PermissionGuard {
    constructor(permissions) {
        this.permissions = permissions;
    }

    check(memberPermissions = Permissions) {
        return this.permissions.every(
            (permission) => memberPermissions.includes(permission)
        );
    }
    getPerm() {
        let perm = this.permissions.join(", ")
        return perm;
    }
}

module.exports = PermissionGuard;