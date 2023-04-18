import Sequelize from 'sequelize';

import { DBConnection } from '../../../../class/database/dbConnection.db.class';
import { GuildModel } from '../guild/guild.model';
import { UserModel } from '../user/user.model';
const sequelize = DBConnection.getInstance().sequelize;

export const GuildTicketModel = sequelize.define('guildTickets', {
    guildId: {
        type: Sequelize.STRING,
        references: {
            model: GuildModel,
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
    transcriptChannelId: {
        type: Sequelize.STRING,
    },
    channelId: {
        type: Sequelize.STRING,
    },
    status: {
        type: Sequelize.INTEGER,
        defaultValue: 2
    },
});

export const TicketModel = sequelize.define('tickets', {
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
    ticketId: {
        type: Sequelize.STRING,
        references: {
            model: TicketModel,
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
