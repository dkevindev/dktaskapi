import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';


dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD, {
    dialect: 'postgres',
    port: parseInt(process.env.DB_PORT)
  }
);