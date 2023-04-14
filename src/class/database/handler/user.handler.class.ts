import { UserModel } from '../../../structures/database/models/user/user.model';

export class UserHandler {
    private _id: string = '';
    private _username: string = '';

    public get id(): string {
        return this._id;
    }

    public get username(): string {
        return this._username;
    }

    public static async getUserById(id: string): Promise<UserHandler | null> {
        const user = new UserHandler();
        const userDB = await UserModel.findOne({ where: { id: id } });
        if (!userDB) {
            return null;
        }
        user._id = userDB.get('id') as string;
        user._username = userDB.get('username') as string;
        return user;
    }

    public static async getUserByUsername(
        username: string,
    ): Promise<UserHandler | null> {
        const user = new UserHandler();
        const userDB = await UserModel.findOne({
            where: { username: username },
        });
        if (!userDB) {
            return null;
        }
        user._id = userDB.get('id') as string;
        user._username = userDB.get('username') as string;
        return user;
    }

    public static async createUser(
        id: string,
        username: string,
    ): Promise<UserHandler | null> {
        const user = new UserHandler();
        const userDB = await UserModel.create({ id: id, username: username });
        if (!userDB) {
            return null;
        }
        user._id = userDB.get('id') as string;
        user._username = userDB.get('username') as string;
        return user;
    }

    public static async deleteUser(id: string): Promise<boolean> {
        const userDB = await UserModel.destroy({ where: { id: id } });
        if (!userDB) {
            return false;
        }
        return true;
    }
}
