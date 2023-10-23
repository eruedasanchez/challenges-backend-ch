import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const generateHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const validateHash = (user, password) => bcrypt.compareSync(password, user.password);

// bcrypt.genSaltSync(10) o saltos son serie de caracteres aleatorios que 
// se le agregan a la password para evitar los ataques de fuerza bruta
// 10 son los ciclos o saltos que se van agregando

// compareSync(password, user.password) compara la data 
// sin codificar (password) con la data encryptada (user.password)