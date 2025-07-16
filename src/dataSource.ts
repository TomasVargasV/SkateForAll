// Enables support for TypeScript decorators, required by TypeORM
import "reflect-metadata";
// Imports the main class used to configure and initialize the database connection
import { DataSource } from "typeorm";
// Loads environment variables from a .env file into process.env
import dotenv from "dotenv";
dotenv.config();
// Creates and exports a configured DataSource instance for MySQL using environment variables
export const AppDataSource = new DataSource({
  type: "mysql", // Specifies the database type
  host: process.env.DB_HOST,  // Database host 
  port: Number(process.env.DB_PORT), // Converts the port to a number
  username: process.env.DB_USER,  // Database username
  password: process.env.DB_PASSWORD, // Database password
  database: process.env.DB_NAME, // Database name
  entities: ["src/models/*.ts"], // Path to entity files (TypeORM models)
  synchronize: true, // Automatically sync database schema with entity definitions 
  logging: false, // Disables SQL query logging
});
