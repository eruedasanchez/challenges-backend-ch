import dotenv from 'dotenv';
import __dirname from '../utils.js';

dotenv.config({
    override:true, 
    path:__dirname + '/.env.sample'
})

export const config = {
    PORT: process.env.PORT,
    SECRET: process.env.SECRET,
    MONGO_URL: process.env.MONGO_URL,
    DB_NAME: process.env.DB_NAME
}