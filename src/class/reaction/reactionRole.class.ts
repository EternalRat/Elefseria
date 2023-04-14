import { MessageReaction, User } from 'discord.js';

export class ReactionRole {
    private static instance: ReactionRole;
    private static roleMatch: Map<string, string> = new Map<string, string>();

    private constructor() {}

    public static getInstance(): ReactionRole {
        if (!ReactionRole.instance) {
            ReactionRole.instance = new ReactionRole();
            this.roleMatch.set('👍', 'Test');
        }
        return ReactionRole.instance;
    }

    async addRole(reaction: MessageReaction, user: User) {
        if (reaction.message.partial) {
            await reaction.message.fetch();
        }
        try {
            if (!reaction.emoji.name) return;
            if (ReactionRole.roleMatch.has(reaction.emoji.name)) {
                ReactionRole.addMemberRole(reaction, user);
            }
        } catch (error) {
            console.error('Something went wrong when adding a role: ', error);
        }
    }

    private static async addMemberRole(reaction: MessageReaction, user: User) {
        const member = reaction.message.guild?.members.cache.get(user.id);
        if (member) {
            const role = reaction.message.guild?.roles.cache.find(
                (role) =>
                    role.name === this.roleMatch.get(reaction.emoji.name!),
            );
            if (role && !member.roles.cache.has(role.id)) {
                await member.roles.add(role);
            }
        }
    }

    async removeRole(reaction: MessageReaction, user: User) {
        if (reaction.message.partial) {
            await reaction.message.fetch();
        }
        try {
            if (!reaction.emoji.name) return;
            if (ReactionRole.roleMatch.has(reaction.emoji.name)) {
                ReactionRole.removeMemberRole(reaction, user);
            }
        } catch (error) {
            console.error('Something went wrong when adding a role: ', error);
        }
    }

    private static async removeMemberRole(
        reaction: MessageReaction,
        user: User,
    ) {
        const member = reaction.message.guild?.members.cache.get(user.id);
        if (member) {
            const role = reaction.message.guild?.roles.cache.find(
                (role) =>
                    role.name === this.roleMatch.get(reaction.emoji.name!),
            );
            if (role && member.roles.cache.has(role.id)) {
                await member.roles.remove(role);
            }
        }
    }
}
