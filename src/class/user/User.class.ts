import { UserModel } from '@src/structures/database/models';
import { Model, ModelStatic } from 'sequelize';

export class User {
	private static _user: ModelStatic<Model<any, any>> = UserModel;
	private static instance: User;

	private constructor() {}

	public static getInstance(): User {
		if (User.instance) {
			return User.instance;
		}
		User.instance = new User();
		return User.instance;
	}

	public async getUserById(id: string): Promise<Model<any, any> | null> {
		return await User._user.findOne({ where: { id } });
	}

	public async createUser(
		id: string,
		username: string,
	): Promise<Model<any, any>> {
		return await User._user.create({ id, username });
	}

	public async deleteUser(id: string): Promise<void> {
		await User._user.destroy({ where: { id } });
	}

	public async updateUser(
		id: string,
		username: string,
	): Promise<Model<any, any> | null> {
		const user = await User._user.findOne({ where: { id } });
		if (user) {
			user.set('username', username);
			await user.save();
		}
		return user;
	}
}
