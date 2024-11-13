import {
	ConnectionError,
	ConnectionTimedOutError,
	Sequelize,
	TimeoutError,
} from 'sequelize';
require('dotenv').config(); // LOAD CONFIG (.env)
import mysql from 'mysql2';

export class DBConnection {
	private static instance: DBConnection;
	private _sequelize: Sequelize;

	private constructor() {
		const connection = mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER!,
			password: process.env.DB_PASS,
			port: parseInt(process.env.DB_PORT!),
		});
		connection.query(`CREATE DATABASE IF NOT EXISTS elefseria`);
		connection.end();
		this._sequelize = new Sequelize(
			process.env.DB_NAME!,
			process.env.DB_USER!,
			process.env.DB_PASS,
			{
				dialect: 'mysql',
				host: process.env.DB_HOST,
				port: parseInt(process.env.DB_PORT!),
				retry: {
					max: 5,
					match: [
						ConnectionError,
						ConnectionTimedOutError,
						TimeoutError,
						/Deadlock/i,
						'SQLITE_BUSY',
					],
				},
				logging: false,
			},
		);
	}

	public static getInstance(): DBConnection {
		if (!DBConnection.instance) {
			DBConnection.instance = new DBConnection();
		}

		return DBConnection.instance;
	}

	public get sequelize(): Sequelize {
		return this._sequelize;
	}
}
