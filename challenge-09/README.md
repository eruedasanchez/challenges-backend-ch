# Challenge-09. Logger implementation

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
- [Winston](https://github.com/winstonjs/winston): Version 3.11.0

## Installation

This is a [Node JS](https://github.com/nodejs/node) module available through the npm registry.

Before installing, download and install Node.js. Node.js 0.10 or higher is required.

## Description

1. A system of levels is defined with the following parity from low to high: **debug, http, info, warning, error, fatal**.

2. A development and production logger is implemented. The development logger logs from the debug level only through the console. The production logger logs only from info level.

3. The logger sends in a file transport starting with the error level in a `errors.log` file. In addition, the usual `console.log` is modified so that all of them are shown starting with **winston**.

4. Finally, an endpoint `/loggerTest` is created to test all the logs

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
Visit the website at: http://localhost:8080/loggerTest to test all the logs
<br>
<br>
Perform the flow by [Postman](https://www.postman.com/) for Products, Carts and Messages collections