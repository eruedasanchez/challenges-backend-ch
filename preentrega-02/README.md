# Preentrega-02. Professionalizing DB

This project was generated with the following dependencies: 

- [Express JS](https://github.com/expressjs/express): Version 4.18.2
- [Express Handlebars](https://github.com/express-handlebars/express-handlebars): Version 7.1.2
- [Mongoose](https://github.com/Automattic/mongoose): Version 7.5.2
- [Mongoose-Paginate-v2](https://github.com/aravindnc/mongoose-paginate-v2): Version 1.7.4  
- [Socket.io](https://github.com/socketio/socket.io): Version 4.7.2 

## Installation

This is a [Node JS](https://github.com/nodejs/node) module available through the npm registry.

Before installing, download and install Node.js. Node.js 0.10 or higher is required.

## Description


1. **Mongo** is kept as the primary persistence system.

2. **Product** queries are professionalized with filters, pagination, and sorting.

3. **Cart** management is professionalized.

Based on the current product implementation, `GET /` method is modified to meet the following criteria:

Now, it allows receiving the following query parameters: `limit` (optional), `page` (optional), and `query` (optional).

* limit: Allows returning only the requested number of items at the time of the request. If limit is not provided, it defaults to 10.

* page: Allows specifying the page to be retrieved. If page is not provided, it defaults to 1.

* query: Used to filter the type of element to search for. If query is not provided, a general search is performed.

* sort (asc/desc): Used for ascending or descending price sorting. If sort is not provided, no sorting is performed.

The `GET` method returns an **object** in the following format:

```bash
{
    status: success/error,
    payload: result of the requested products,
    totalPages: total pages,
    prevPage: previous page,
    nextPage: next page,
    page: current page,
    hasPrevPage: indicator to check if the previous page exists,
    hasNextPage: indicator to check if the next page exists,
    prevLink: direct link to previous page (null if hasPrevPage = false),
    nextLink: direct link to next page (null if hasNextPage = false)
}
```

4. A view is created in the views router at `/products` to display all products with their respective pagination. Each displayed product has an **Add to Cart** button directly without the need to open an additional page with product details.

5. A view is added at `/carts/:cid` to display a specific cart, listing **only** the products that belong to that cart.

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

Open preentrega-02 folder and install dependencies:

```bash
$ cd integrative-practice-01
$ npm install
```

Start the server and nodemon:

```bash
$ npm run dev 
```

View the website at: http://localhost:8080/chat for chat application.
<br>
<br>
Visit the website at: http://localhost:8080/products to view all the products with their respective pagination. 
<br>
<br>
Visit the website at: http://localhost:8080/carts/:cid to view the cart with the specific cid 
<br>
<br>
Perform the flow by [Postman](https://www.postman.com/) for Products, Carts and Messages collections