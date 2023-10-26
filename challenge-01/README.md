# Challenge-01

This project was generated with [Node JS](https://github.com/nodejs)

## Description

1.  A class **ProductManager** is created to manage a set of products. 

2. Each product managed by the **ProductManager** class has the following fields:  

* Title: Product name
* Description: Product description
* Price: Product price
* Thumbnail: Image path
* Code: Product identifier code
* Stock: Number of available pieces

3. The **ProductManager** class has an [addProduct]() method that allows adding products to the array of products defined in the constructor. 

* This method is responsible for validating that all fields are entered.
* It also ensures that the **Code** field is not duplicated.
* This method is responsible for creating an auto-incrementing **id** when adding a product to the cart.

4. The **ProductManager** class has a [getProducts]() method that returns all the products created so far.

5. The **ProductManager** class has a [getProductById]() method that allows obtaining information about the product that matches the **id** passed as a parameter. In case the passed **id** does not match any product's id, an error message **"Not found"** will be displayed in the console.

## Quick Start

The quickest way to run this project is run the commands as shown below:

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

Open challenge-01 folder and run the project:

```bash
$ cd challenge-01
```

Run the project:

```bash
$ node ./challenge-01.js 
```

### Contact

If you want to contact with me you can reach me at [LinkedIn](https://www.linkedin.com/in/e-ruedasanchez/).

### License

This project is **free to use** and does not contains any license.



