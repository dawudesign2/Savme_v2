import { DataSourceOptions } from 'typeorm';
import { User } from './users/entity/users.entity';
import * as dotenv from 'dotenv';
dotenv.config();

export const databaseConfig: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User],
  synchronize: false,
};
