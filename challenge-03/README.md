# Challenge-03

This project was generated with [Express JS](https://github.com/expressjs/express)

## Installation

This is a [Node JS](https://github.com/nodejs/node) module available through the npm registry.

Before installing, download and install Node.js. Node.js 0.10 or higher is required.

## Description

1. **ProductManager** class developed in the previous two challenges is maintained with file persistence in Filesystem (FS).

2. An **Express Server** is developed where queries to the products file can be made.

3. An **Express Server** is developed that imports the **ProductManager** class and defines the following endpoints:

* `/`: Reads the file and returns all the products stored in the array of products.

* `/products`: Reads the products file and returns them as an object. It also allows receiving a query parameter `limit` to return a limited number of results. In case of not receiving a query parameter, it returns all the products stored in the array.

* `/products/:pid`: Reads the products file and only returns the one where the **id** matches the one passed in `req.params` (`:pid`). In case a pid is passed that does not exist in the array of products, an error is thrown indicating that the product doesn't exist.

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

Open challenge-03 folder and install dependencies:

```bash
$ cd challenge-03
$ npm install
```

Start the server and nodemon:

```bash
$ npm run dev 
```

View the website at: http://localhost:8080 or perform the flow by [Postman](https://www.postman.com/)