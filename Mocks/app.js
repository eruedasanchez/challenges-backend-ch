// import {faker} from '@faker-js/faker';
import {fakerES_MX as faker} from '@faker-js/faker';

// console.log(faker.airline.airport());
// console.log(faker.animal.bird());
let nombre = faker.person.firstName();
let apellido = faker.person.lastName();
let email = faker.internet.email({firstName:nombre, lastName:apellido});
console.log(nombre);
console.log(apellido);
console.log(email);