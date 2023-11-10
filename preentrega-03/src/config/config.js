import path from 'path';
import dotenv from 'dotenv';
import {Command, Option} from 'commander';
import __dirname from '../utils.js';

let program = new Command();

program
    .addOption(new Option("-p, --persistence <persistence>", "Modo para la persistencia de archivos").choices(["fs","mongodb"]).default("mongodb"))
    .parse()

let persitenceChoosen = program.opts().persistence;

dotenv.config({
    override:true, 
    path: persitenceChoosen === "mongodb" ? path.join(__dirname, '.env.mongodb') : path.join(__dirname, '.env.fs')
})

export const config = {
    PORT: process.env.PORT,
    SECRET: process.env.SECRET,
    MONGO_URL: process.env.MONGO_URL,
    DB_NAME: process.env.DB_NAME,
    PERSISTENCE: process.env.PERSISTENCE
}