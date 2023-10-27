# Challenge-05. Login

This project was generated with the following dependencies: 

- [Express JS](https://github.com/expressjs/express): Version 4.18.2
- [Express Handlebars](https://github.com/express-handlebars/express-handlebars): Version 7.1.2
- [Mongoose](https://github.com/Automattic/mongoose): Version 7.5.2
- [Mongoose-Paginate-v2](https://github.com/aravindnc/mongoose-paginate-v2): Version 1.7.4  
- [Socket.io](https://github.com/socketio/socket.io): Version 4.7.2
- [Connect Mongo](https://github.com/mongodb-js/connect-mongodb-session): Version 5.0.0
- [Express session](https://github.com/expressjs/session): Version 1.17.3 

## Installation

This is a [Node JS](https://github.com/nodejs/node) module available through the npm registry.

Before installing, download and install Node.js. Node.js 0.10 or higher is required.

## Description

1. The main server is adjusted to work with a **login** system.

2. The `login.handlebars` and `signUp.handlebars` views are added to handle registration and login processes.

3. After completing the registration, the user is redirected directly to the product view.

4. A welcome message with user data is added to the product view.

5. A role system is implemented, so if the user's email is `adminCoder@coder.com` and the password is `adminCod3r123`, they have the `admin` role, otherwise, the role is `user`.

6. A **logout** button is implemented to destroy the session and redirect to the login view.

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

Open challenge-05 folder and install dependencies:

```bash
$ cd challenge-05
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