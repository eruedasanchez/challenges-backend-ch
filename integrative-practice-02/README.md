# Integrative Practice 02

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

1. The project continues to be worked on, configuring new elements and including the following aspects.

2. A **User Model** is created, which will have the following fields:

* first_name: String
* last_name: String
* email: String (unique)
* age: Number
* password: String (Hash)
* cart: Id with reference to Carts
* role: String (default: 'user')

When a user decides to register, a unique **ObjectId** is assigned to the user's cart field, referencing the `Carts` collection. Then, once the user logs in, they are redirected to the Products view, which stores data in the Products collection. Every time the user clicks `Add to Cart` button, the product is added to the cart assigned to them at the time of registration.

3. **Passport** strategies are developed to work with this user model.

4. The user **login** system is modified to work with **JWT** (JSON Web Token).

5. A `current` strategy is developed to extract the cookie containing the token to obtain the user associated with that token. If the token is present, the associated user is returned. Otherwise, a passport error is returned, and a cookie extractor is used.

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