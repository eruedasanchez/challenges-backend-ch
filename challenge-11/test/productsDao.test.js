import mongoose from "mongoose";
// import Assert from 'assert';
import chai from 'chai';
import { ProductsMongoDAO } from "../src/dao/productsMongoDAO.js";
import { logger } from "../src/utilsWinston.js";
import { config } from "../src/config/config.js";
import { describe, it} from 'mocha';

// Se establece la conexion con la base de datos de MongoDB Atlas
try {
    await mongoose.connect(config.MONGO_URL, {dbName: config.DB_NAME});
    logger.info('MongoDB Atlas Conectada');
} catch (error) {
    logger.fatal(`Error al conectarse con MongoDB Atlas. Detalle: ${error.message}`);
}

// Inicializacion de Assert de forma estricta
// const assert = Assert.strict;

// Inicializacion de Chai 
const expect = chai.expect;

describe("Prueba al DAO de productos del proyecto Ecommerce", function(){
    this.timeout(5000); // porque estamos trabajando con DB en la nube

    // before ejecuta antes de TODOS los it's que tenga definido
    before(async function(){
        this.productsDao = new ProductsMongoDAO(); // instancio la clase ProductsMongoDAO
    })

    // beforeEach se ejecuta una vez antes de CADA it
    beforeEach(async function(){
        await mongoose.connection.collection('products').deleteMany({title:'Producto seis'});
    })

    // after se ejecuta luego de TODOS los it's para que potencialmente si hay otro describe no quede el producto registrado
    after(async function(){
        await mongoose.connection.collection('products').deleteMany({title:'Producto seis'});
    })

    it("El dao debe devolver un array de usuarios al ejecutar el método get", async function(){
        let resultado = await this.productsDao.get();
        // console.log("resultado",resultado);

        // assert.strictEqual(Array.isArray(resultado), true);
        expect(Array.isArray(resultado)).to.be.equal(true);
        expect(Array.isArray(resultado)).to.be.true;
    })

    it("El dao crea un producto nuevo con el método add", async function(){
        let productoPrueba = {
            title: "Producto seis",
            description: "Este es un producto prueba seis",
            code: "abc123p6",
            price: 206,
            status: true,
            stock: 36,
            category: "muebles",
            thumbnails: [
                "thumbnail-p6-1",
                "thumbnail-p6-2",
                "thumbnail-p6-3"
            ]
        };

        let resultado = await this.productsDao.add(productoPrueba);
        // console.log("resultado",resultado);

        // assert.ok(resultado._id);
        expect(resultado).to.have.property('_id');
        // assert.ok(resultado.title);
        expect(resultado.title).to.be.ok;
        expect(resultado._id).to.exist;
        // assert.equal(resultado.title, 'Producto seis');
        expect(resultado).to.have.property('title').and.is.equal('Producto seis');
        // assert.strictEqual(resultado.description, 'Este es un producto prueba seis');
        expect(resultado).to.have.property('description').and.is.equal('Este es un producto prueba seis');
        
    })

    // it("El dao debe devolver un array de usuarios al ejecutar el método GET", async function(){
        
    // })
})