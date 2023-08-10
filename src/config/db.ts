import { DataSource } from "typeorm"
import dotenv = require('dotenv');
dotenv.config();

export const myDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME,
    entities: ["src/entity/*.ts"],
    // synchronize:true
})