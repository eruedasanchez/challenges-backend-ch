# Challenge-02. File Management

This project was generated with [Node JS](https://github.com/nodejs).

## Description

1. Two more methods are added to the existing ones in **ProductManager** class as outlined in the previous challenge.

* The `updateProduct(id, field, content)`  method allows updating the `field` with the `content` of the product with id `id`. In case the id passed as a parameter is not found in the array of products, an error is thrown.

* The `deleteProduct(id)` method is responsible for removing from the array of products the one that matches the `id` passed as a parameter. Just like in the case of updating a product, an error is thrown when the id is not defined in the array of products.

2. Additionally, file persistence in **Filesystem (FS)** is added. In this case, it is applied to the array of products, and for this purpose, a `path` is defined in the constructor of the **ProductManager** class to indicate the location where the array is to be stored as products are added, fields are updated, or products are deleted.

## Quick Start

The quickest way to run the project is run the commands as shown below:

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

Open challenge-02 folder and run the project:

```bash
$ cd challenge-02
```

Run the project:

```bash
$ node ./challenge-02.js 
```

### Contact

If you want to contact with me you can reach me at [LinkedIn](https://www.linkedin.com/in/e-ruedasanchez/).

### License

This project is **free to use** and does not contains any license.



