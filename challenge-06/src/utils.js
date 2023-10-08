import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const generaHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const validaHash = (user, password) => bcrypt.compareSync(password, user.password);

// bcrypt.genSaltSync(10) son los salts (serie de caracteres aleatorios que se le
// generan a la password para evitar los ataques de fuerza bruta)

// compareSync(password, user.password) compara la data 
// sin codificar (password) con la data encryptada (user.password)