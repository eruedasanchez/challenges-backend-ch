# Challenge-06. Login Refactor

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

## Installation

This is a [Node JS](https://github.com/nodejs/node) module available through the npm registry.

Before installing, download and install Node.js. Node.js 0.10 or higher is required.

## Description

Based on the login challenge you previously described, here's a refactored version with the requested modifications:

1. Password hashing is added using **bcrypt**.

2. The implementation of **Passport** is included for both registration and login.

3. **GitHub authentication** is implemented for the login view.

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