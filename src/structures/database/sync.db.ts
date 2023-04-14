import { DBConnection } from '../../class/database/dbConnection.db.class';
import { GuildModel, GuildUserModel } from './models/guild/guild.model';
import {
    GuildTicketModel,
    TicketModel,
    UserTicketModel,
} from './models/ticket/ticket.model';
import { UserModel } from './models/user/user.model';

export default async function databaseSynchronisation(): Promise<void> {
    const sequelize = DBConnection.getInstance().sequelize;
    await GuildModel.sync({
        logging: false,
    });
    await UserModel.sync({
        logging: false,
    });
    await GuildUserModel.sync({
        logging: false,
    });
    await TicketModel.sync({
        logging: false,
    });
    await UserTicketModel.sync({
        logging: false,
    });
    await GuildTicketModel.sync({
        logging: false,
    });
    await sequelize.sync({
        logging: false,
    });
}
