# Challenge-04. Websockets

This project was generated with [Express JS](https://github.com/expressjs/express).

## Installation

This is a [Node JS](https://github.com/nodejs/node) module available through the npm registry.

Before installing, download and install Node.js. Node.js 0.10 or higher is required.

## Description

The project is configured to integrate the **Handlebars** template engine into the **preentrega-01** and to install a **socket.io** server alongside it.

1. `home.handlebars` view contains all the products added so far.

2. `realTimeProducts.handlebars` view resides at the `/realtimeproducts` endpoint in the views router and contains the same list of products, except that it works with **websockets**. When working with websockets, each time a product is added or removed, the list on that view is automatically updated.

## Quick Start

The quickest way to run this project with express is run the commands to generate an application as shown below:

Create a folder in your desktop directory with the name you want (E.g: challenge-04-backend-ch):

```bash
$ mkdir challenge-04-backend-ch
```

Open the contents of that folder:

```bash
$ cd challenge-04-backend-ch
```

Clone the repository in that folder:

```bash
$ git clone https://github.com/eruedasanchez/challenges-backend-ch.git
```

Open challenge-04 folder and install dependencies:

```bash
$ cd challenge-04
$ npm install
```

Start the server and nodemon:

```bash
$ npm run dev 
```

View the website at: http://localhost:8080 or perform the flow by [Postman](https://www.postman.com/)