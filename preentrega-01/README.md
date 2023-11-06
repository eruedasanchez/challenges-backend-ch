# Preentrega-01. Server based on Node.JS and Express

This project was generated with [Express JS](https://github.com/expressjs/express)

## Installation

This is a [Node JS](https://github.com/nodejs/node) module available through the npm registry.

Before installing, download and install Node.js. Node.js 0.10 or higher is required.

## Description

A **Express Server** is developed that contains all the necessary endpoints and services to manage products and shopping carts in the e-commerce.

1. A **NodeJS** and **Express Server** based is developed, listening on PORT 8080, and it has two groups of routes: `products` and `/carts`. Both endpoints are implemented with the Express router.

Managing products will have its router at `/api/products` and configures the following routes:

* Root route `GET /` lists all products stored in the array. It also includes the `limit` limitation as outlined in the previous challenge.   

* The root route `GET /:pid` retrieves only the product with the id provided in `req.params` (`:pid`).

* The root route `POST /` adds a product with the required fields for the first challenge (title, description, price, thumbnail, code and stock) but it also include `status` (boolean) and `category` (string) fields. Remember that all fields are mandatory except for the thumbnail, and product codes shouldn't be duplicated.

* The route `PUT /:pid` takes the product that matches the id provided in `req.params` (`:pid`) and updates it with the fields passed from the request `body`. The product id should never be updated or deleted.

* The route `DELETE /:pid` deletes the product that matches the provided pid.

Cart will have its router at `/api/carts` and configures the following routes:

* The route `POST /` creates a new cart with the following structure: 

-Id or Cid: Cart identifier that is auto-generated and never duplicated.

-Products: An array containing objects that represent each product.

* The route `GET /:cid` lists all the products belonging to the cart with the provided cid parameter.

* The route `POST /:cid/product/:pid` adds the product to the products array of the selected cart with cid :cid as an object in the following format:

-Product: Should only contain the id of the product.

-Quantity: Should contain the number of copies of that product. Copies are added or updated one by one in case they are already defined in the array

2. Data persistence is implemented using the FS module, where the files `products.json` and `cart.json` back up the information.

## Quick Start

The quickest way to run this project with express is run the commands to generate an application as shown below:

Create a folder in your desktop directory with the name you want (E.g: preentrega-01-backend-ch):

```bash
$ mkdir preentrega-01-backend-ch
```

Open the contents of that folder:

```bash
$ cd preentrega-01-backend-ch
```

Clone the repository in that folder:

```bash
$ git clone https://github.com/eruedasanchez/challenges-backend-ch.git
```

Open preentrega-01 folder and install dependencies:

```bash
$ cd preentrega-01
$ npm install
```

Start the server and nodemon:

```bash
$ npm run dev 
```

View the website at: http://localhost:8080 or perform the flow by [Postman](https://www.postman.com/)
