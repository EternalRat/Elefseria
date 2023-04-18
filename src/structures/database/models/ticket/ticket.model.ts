import Sequelize, { DataTypes } from 'sequelize';

import { DBConnection } from '../../../../class/database/dbConnection.db.class';
import { GuildModel } from '../guild/guild.model';
import { UserModel } from '../user/user.model';
const sequelize = DBConnection.getInstance().sequelize;

export const GuildTicketModel = sequelize.define('guildTickets', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    guildId: {
        type: Sequelize.STRING,
        references: {
            model: GuildModel,
            key: 'id',
        },
    },
    rolesId: {
        type: Sequelize.STRING,
        defaultValue: '',
    },
    categoryId: {
        type: Sequelize.STRING,
    },
    message: {
        type: Sequelize.STRING,
        defaultValue: '',
    },
    channelId: {
        type: Sequelize.STRING,
    },
    status: {
        type: Sequelize.INTEGER,
    },
});

export const TicketModel = sequelize.define('tickets', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    owner: {
        type: Sequelize.STRING,
        references: {
            model: UserModel,
            key: 'id',
        },
    },
    creatorId: {
        type: Sequelize.STRING,
    },
    users: {
        type: Sequelize.STRING,
    },
    guildId: {
        type: Sequelize.STRING,
        references: {
            model: GuildModel,
            key: 'id',
        },
    },
    channelId: {
        type: Sequelize.STRING,
    },
    status: {
        type: Sequelize.INTEGER,
    },
});

export const TicketMessageModel = sequelize.define('ticketMessages', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    ticketId: {
        type: Sequelize.STRING,
        references: {
            model: TicketModel,
            key: 'id',
        },
    },
    message: {
        type: Sequelize.STRING,
        defaultValue: '',
    },
    messageId: {
        type: Sequelize.STRING, // Only used to get the message if it's an image, embed, ...
        defaultValue: '',
    },
});
