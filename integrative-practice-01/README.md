# Integrative Practice 01

This project was generated with the following dependencies: 

- [Express JS](https://github.com/expressjs/express): Version 4.18.2
- [Express Handlebars](https://github.com/express-handlebars/express-handlebars): Version 7.1.2
- [Mongoose](https://github.com/Automattic/mongoose): Version 7.5.2  
- [Socket.io](https://github.com/socketio/socket.io): Version 4.7.2 

## Installation

This is a [Node JS](https://github.com/nodejs/node) module available through the npm registry.

Before installing, download and install Node.js. Node.js 0.10 or higher is required.

## Description

1. The **Mongo** and **Mongoose** persistence model is added to the project.

2. A database named **ecommerce** is created within **Mongo Atlas** with the collections `carts`, `messages` and `products`. For each of these collections, their respective schemas are created.

3. A new Handlebars view called `chat.handlebars` is implemented, which allows for the implementation of a chat where messages are stored in a collection called `messages`. Each message will have the format: 

* `{user: user's email, message: user's message}`

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

Open integrative-practice-01 folder and install dependencies:

```bash
$ cd integrative-practice-01
$ npm install
```

Start the server and nodemon:

```bash
$ npm run dev 
```

View the website at: http://localhost:8080/chat for chat application and perform the flow by [Postman](https://www.postman.com/) for Products and Carts collections