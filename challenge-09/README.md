# Challenge-08. Mocking and Error Handling

This project was generated with the following dependencies: 

- [BCrypt](https://github.com/pyca/bcrypt): Version 5.1.1 
- [Commander.js](https://github.com/tj/commander.js?): Version 11.1.0
- [Cookie Parser](https://github.com/expressjs/cookie-parser): Version 1.4.6
- [Connect Mongo](https://github.com/mongodb-js/connect-mongodb-session): Version 5.0.0
- [Dotenv](https://github.com/motdotla/dotenv): Version 16.3.1
- [Express Handlebars](https://github.com/express-handlebars/express-handlebars): Version 7.1.2
- [Express JS](https://github.com/expressjs/express): Version 4.18.2
- [Express session](https://github.com/expressjs/session): Version 1.17.3
- [Faker-JS](https://github.com/faker-js/faker): Version 8.3.1 
- [Jsonwebtoken](https://github.com/auth0/node-jsonwebtoken): Version 9.0.2
- [Mongoose](https://github.com/Automattic/mongoose): Version 7.5.2
- [Mongoose-Paginate-v2](https://github.com/aravindnc/mongoose-paginate-v2): Version 1.7.4  
- [Passport](https://github.com/jaredhanson/passport): Version 0.6.0
- [Passport Github2](https://github.com/passport/todos-express-password): Version 0.6.0
- [Passport Jwt](https://github.com/mikenicholson/passport-jwt): Version 4.0.1
- [Passport Local](https://github.com/jaredhanson/passport-local): Version 0.6.0
- [Socket.io](https://github.com/socketio/socket.io): Version 4.7.2
- [Uuid](https://github.com/uuidjs/uuid): Version 9.0.1

## Installation

This is a [Node JS](https://github.com/nodejs/node) module available through the npm registry.

Before installing, download and install Node.js. Node.js 0.10 or higher is required.

## Description

1. A **Mocking Module** and **Error Handler** will be applied to the current server.

2. A Mocking module is generated so that the server can generate and deliver 100 products with the same format that a Mongo request would deliver. This only happens on `/mockingproducts` endpoint.

3. In addition, an **error customizer** is generated for the most common errors when creating or adding a product to the cart

## Quick Start

The quickest way to run this project with express is run the commands to generate an application as shown below:

Create a folder in your desktop directory with the name you want (E.g: challenges-backend-ch):

```bash
$ mkdir challenges-backend-ch
```

Open the contents of that folder:

```bash
$ cd challenges-backend-ch
```

Clone the repository in that folder:

```bash
$ git clone https://github.com/eruedasanchez/challenges-backend-ch.git
```

Open preentrega-03 folder and install dependencies: 

```bash
$ cd preentrega-03
$ npm install
```

Start nodemon and server with MongoDB persistence:

```bash
$ npm run dev -p mongodb
```

or start nodemon and server with FS persistence:

```bash
$ npm run dev -p fs
```

View the website at: http://localhost:8080/chat for chat application.
<br>
<br>
Visit the website at: http://localhost:8080/ to register as a user, log in and be redirected to the products view.
<br>
<br>
Visit the website at: http://localhost:8080/carts/:cid to view the cart with the specific cid 
<br>
<br>
Perform the flow by [Postman](https://www.postman.com/) for Products, Carts and Messages collections