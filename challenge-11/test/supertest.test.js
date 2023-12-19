import supertest from 'supertest';
import chai from 'chai';
import mongoose from 'mongoose';
import { describe, it } from 'mocha';
import { logger } from '../src/utilsWinston.js';
import { config } from '../src/config/config.js';

// Se establece la conexion con la base de datos de MongoDB Atlas
try {
    await mongoose.connect(config.MONGO_URL, {dbName: config.DB_NAME});
    logger.info('MongoDB Atlas Conectada');
} catch (error) {
    logger.fatal(`Error al conectarse con MongoDB Atlas. Detalle: ${error.message}`);
}

// Inicialización de chai
const expect = chai.expect;

// Inicialización de supertest
const requester = supertest("http://localhost:8080");

describe("Pruebas al proyecto Ecommerce", function(){
    this.timeout(6000); // porque utilizo DB

    describe("Pruebas al modulo Products", function(){

        after(async function(){
            await mongoose.connection.collection('products').deleteMany({category:'mesas'});
        })

        it("El endpoint /api/products con metodo POST permite generar un producto nuevo en la DB", async function(){
            let productoPrueba = {
                title: "Producto siete",
                description: "Este es un producto prueba siete",
                code: "abc123p7",
                price: 207,
                status: true,
                stock: 37,
                category: "mesas",
                thumbnails: [
                    "thumbnail-p7-1",
                    "thumbnail-p7-2",
                    "thumbnail-p7-3"
                ]
            }
            
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY1NmRmZjU4YWVhMmE4YTQ1ZTRjNDcxNiIsImZpcnN0X25hbWUiOiJKdWxpYW4iLCJsYXN0X25hbWUiOiJMb3BleiIsImVtYWlsIjoiamxvcGV6QGdtYWlsLmNvbSIsImFnZSI6MjgsInBhc3N3b3JkIjoiJDJiJDEwJGRaYnJHRHJWZENid2lTajZSQ3dUWWVrckgvZGNwWktOTzB5cnV5cXlsaVhDWDYycXZTMGVxIiwiY2FydCI6IjY1NmRmZjU3YWVhMmE4YTQ1ZTRjNDcxNCIsInJvbGUiOiJwcmVtaXVtIiwiX192IjowfSwiaWF0IjoxNzAyOTQ0MjAwLCJleHAiOjE3MDI5NDc4MDB9.l6AavFj_jEgDEyrHlY4uDtaneBMaOGQ1PcWoGYxlwm4';
            
            let resultado = await requester.post("/api/products")
                .set('Cookie', `coderCookie=${token}`)
                .send(productoPrueba);
            
            
            let {body, ok, statusCode} = await requester.post("/api/products").set('Cookie', `coderCookie=${token}`).send(productoPrueba);
            
            console.log("body es igual a", body);
            console.log("statusCode es igual a", statusCode);
            console.log("ok es igual a", ok);

            expect(body.status).is.eq('success');
            expect(statusCode).is.eq(201);
            expect(ok).to.be.true;
            expect(body.newProduct).to.has.property('_id');


        })

    })
})




