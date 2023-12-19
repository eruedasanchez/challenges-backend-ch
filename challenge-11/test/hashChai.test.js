// import mongoose from "mongoose";
// import Assert from 'assert';
import chai from 'chai';
import { ProductsMongoDAO } from "../src/dao/productsMongoDAO.js";
import { logger } from "../src/utilsWinston.js";
import { config } from "../src/config/config.js";
import { describe, it} from 'mocha';
import { generateHash, validateHash } from '../src/utils.js';

// Inicializacion de Assert de forma estricta
// const assert = Assert.strict;

// Inicializacion de Chai 
const expect = chai.expect;

describe("Pruebas funciones hash", async () => {
    it("Si ejecuto generateHash enviando una password como argumento, genera su hash con algoritmo bcrypt", async () => {
        let password = 'codercoder';
        let resultado = await generateHash(password);
        
        expect(resultado).not.to.be.equal(password);
        expect(resultado.length).to.be.greaterThan(10);
        expect(resultado.substring(0,4)).to.be.equal('$2b$');
    })

    it("La función validateHash recibiendo usuario y password, verifica coincidencia", async () => {
        let password = "123";
        let usuario = {
            password: await generateHash(password)
        }

        // let resultado = await validateHash(usuario, password);
        let resultado = await validateHash(usuario, "456");

        expect(resultado).is.false;
        expect(resultado).to.be.eq(false);

    })
})

