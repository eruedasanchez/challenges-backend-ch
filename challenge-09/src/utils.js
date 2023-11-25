import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';

export const PRIVATE_KEY = 'secretPass';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const generateHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const validateHash = (user, password) => bcrypt.compareSync(password, user.password);




