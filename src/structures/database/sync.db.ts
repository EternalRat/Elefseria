import { GuildModel, GuildUserModel } from './models/guild/guild.model';
import {
    GuildTicketModel,
    TicketMessageModel,
    TicketModel,
} from './models/ticket/ticket.model';
import { UserModel } from './models/user/user.model';

export default async function databaseSynchronisation(): Promise<void> {
    await UserModel.sync({
        logging: false,
    });
    await GuildModel.sync({
        logging: false,
    });
    await GuildUserModel.sync({
        logging: false,
    });
    await TicketModel.sync({
        logging: false,
    });
    await GuildTicketModel.sync({
        logging: false,
    });
    await TicketMessageModel.sync({
        logging: false,
    });
}
