# Challenge-07. Server restructuring

This project was generated with the following dependencies: 

- [Express JS](https://github.com/expressjs/express): Version 4.18.2
- [Express Handlebars](https://github.com/express-handlebars/express-handlebars): Version 7.1.2
- [Mongoose](https://github.com/Automattic/mongoose): Version 7.5.2
- [Mongoose-Paginate-v2](https://github.com/aravindnc/mongoose-paginate-v2): Version 1.7.4  
- [Socket.io](https://github.com/socketio/socket.io): Version 4.7.2
- [Connect Mongo](https://github.com/mongodb-js/connect-mongodb-session): Version 5.0.0
- [Express session](https://github.com/expressjs/session): Version 1.17.3 
- [BCrypt](https://github.com/pyca/bcrypt): Version 5.1.1 
- [Passport](https://github.com/jaredhanson/passport): Version 0.6.0
- [Passport Local](https://github.com/jaredhanson/passport-local): Version 0.6.0
- [Passport Github2](https://github.com/passport/todos-express-password): Version 0.6.0
- [Cookie Parser](https://github.com/expressjs/cookie-parser): Version 1.4.6
- [Dotenv](https://github.com/motdotla/dotenv): Version 16.3.1
- [Jsonwebtoken](https://github.com/auth0/node-jsonwebtoken): Version 9.0.2
- [Passport Jwt](https://github.com/mikenicholson/passport-jwt): Version 4.0.1

## Installation

This is a [Node JS](https://github.com/nodejs/node) module available through the npm registry.

Before installing, download and install Node.js. Node.js 0.10 or higher is required.

## Description

1. The necessary changes are made so that the project is now based on a **layered model**. 

2. The layered model is applied to the products, carts, and messages models.

3. ach model has its respective **schema**, a `MongoDAO.js` file, a **service layer** that uses the previous file, a **controllers layer** that contains the logic and functions, and a **routing layer** to which the controllers layer connects to handle the various endpoints of the model. 

4. In addition, all the important and sensitive parts of the project are moved to `.sample.env` file in order to read them as environment variables in `config.js` file.

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

Open challenge-06 folder and install dependencies: 

```bash
$ cd challenge-06
$ npm install
```

Start the server and nodemon:

```bash
$ npm run dev 
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