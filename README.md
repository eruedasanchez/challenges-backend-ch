<div align="center">
  
  ![GitHub repo size](https://img.shields.io/github/repo-size/eruedasanchez/challenges-backend-ch)
  ![GitHub stars](https://img.shields.io/github/stars/eruedasanchez/challenges-backend-ch?style=social)
  ![GitHub forks](https://img.shields.io/github/forks/eruedasanchez/challenges-backend-ch?style=social)
  [![Twitter Follow](https://img.shields.io/twitter/follow/RSanchez_Eze?style=social)](https://twitter.com/intent/follow?screen_name=RSanchez_Eze)
  <br/>
  <br/>

  <h1 align="center">Challenges Backend</h1>
  
  Challenges Backend
</div>
<br/>

# Índice

1. [Resumen del proyecto](#resumen-del-proyecto)
<!-- 2. [Capítulo 1](#capítulo-1)
3. [Revisando código](#revisando-código) -->

### Resumen del proyecto

Este proyecto consiste en una serie de desafíos diseñados para crear y poner en funcionamiento un servidor básico. A continuación, se describen los desafíos propuestos:

- *challenge-01*: Se realizó una clase **ProductManager** que gestiona un conjunto de productos.

- *challenge-02*: A la clase **ProductManager** creada en el desafio pasaddo se le permite agregar, consultar, modificar y eliminar un producto y manejarlo en persistencia de archivos (FS).

-  *challenge-03*: Se desarrolla un servidor basado en [Express JS](https://github.com/expressjs/express) donde podemos hacer consultas a nuestro archivo de productos.

- *preentrega-01*: Se desarrolla un servidor basado en [Node.JS](https://github.com/nodejs) y [Express JS](https://github.com/expressjs/express) que escucha en el puerto 8080 y contiene los endpoints y servicios necesarios para  gestionar los productos y carritos de compra en el e-commerce

- *challenge-04*: Se integran vistas y sockets al servidor actual configurandolo de modo que trabaje con [Handlebars](https://github.com/handlebars-lang/handlebars.js/) y [WebSocket](https://github.com/websockets).

- *integrative-practice-01*: Se agrega el modelo de persistencia de [Mongo](https://github.com/mongodb/mongo) y [mongoose](https://github.com/Automattic/mongoose) al proyecto. Ademas, se crea una base de datos llamada **ecommerce** dentro de Mongo Atlas y las colecciones **carts**, **messages** y **products** con sus respectivos *schemas*. 

- *preentrega-02*: Se definen todos los endpoints para poder trabajar con productos y carritos contando con [Mongo](https://github.com/mongodb/mongo) como sistema de persistencia principal. Además, se profesionalizan las consultas de productos con filtros, paginación y ordenamientos como asi tambien la gestión del carrito.

- *challenge-05*: Se ajusta el servidor para trabajar con un sistema de login. Se incluyen todas las vistas necesarias, así también como las rutas de router para procesar el registro y el login. Una vez completado el login, se realiza la redirección directamente a la vista de productos.

- *challenge-06*:  Con base en el login del desafio anterior, se refactoriza incluyendo un hasheo de contraseña utilizando [bcrypt](https://github.com/pyca/bcrypt). Además, se realiza una implementación de [passport](https://github.com/jaredhanson/passport), tanto para register como para login y se implementa el método de autenticación de GitHub a la vista de login.

- *integrative-practice-02*: Se crea un modelo **User** y se desarrollan las estrategias de [Passport](https://github.com/jaredhanson/passport) para que funcionen con este modelo de usuario. Además, se modifica el sistema de login del usuario para poder trabajar con *session* o *jwt*.

- *challenge-07*: Se realizan los cambios necesarios en el proyecto para que se base en un modelo de capas. Ahora, el proyecto cuenta con capas de **routing**, **controlador**, **dao**, vistas bien separadas y con las responsabilidades correctamente delegadas Además, se mueven todas las partes importantes y comprometedoras del proyecto en un archivo `.env` para poder leerlo bajo variables de entorno.


- *preentrega-03*: Se aplica una arquitectura profesional para el servidor con prácticas como patrones de diseño, mailing, variables de entorno. etc. Además, se modifica la capa de persistencia para aplicar los conceptos de **Factory**, **DAO** y **DTO**.

- *challenge-08*: Se aplica un módulo de *mocking* y un manejador de errores al servidor.

- *challenge-09*: Se implementa un **logger** definiendo un sistema de niveles que tiene la siguiente prioridad (de menor a mayor): *debug*, *http*, *info*, *warning*, *error* y *fatal*. Además, se implementa un logger para desarrollo y un logger para producción.

- *integrative-practice-03*: Se realiza un sistema de **recuperación de contraseña** que envía por medio de un correo un botón que redireccione a una página para restablecer la contraseña Además, se establecer un nuevo rol para el schema del usuario llamado **premium** el cual estará habilitado también para crear productos y se modifican los permisos de modificación y eliminación de productos.

- *challenge-10*: Se realizar la configuración necesaria para tener documentado el proyecto final a partir de **Swagger**.

- *challenge-11*: Se realizan módulos de testing para el proyecto utilizando los módulos de [Mocha](https://github.com/mochajs/mocha) + [Chai](https://github.com/chaijs/chai) + [Supertest](https://github.com/ladjs/supertest) e incluyendo tests desarrollados para **Router de products**, **Router de carts** y **Router de sessions**.

- *integrative-practice-04*: Se crea un endpoint en el router de usuarios que permite subir uno o múltiples archivos. Se utiliza el middleware de [Multer](https://github.com/expressjs/multer) para poder recibir los documentos que se cargan y actualizar en el usuario su status para hacer saber que ya subió algún documento en particular.

- *final-project*: Se crea una vista para poder visualizar, modificar el rol y eliminar un usuario. Esta vista únicamente será accesible para el administrador del ecommerce. Se modifica el endpoint que elimina productos, para que, en caso de que el producto pertenezca a un usuario premium, le envíe un correo indicándole que el producto fue eliminado. Ademas, se finaliza las vistas pendientes para la realización de flujo completo de compra. 

</div>
<br/>


