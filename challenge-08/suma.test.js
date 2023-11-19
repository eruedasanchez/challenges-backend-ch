import suma from "./suma.js";
import colors from 'colors';

let tests = 0, testsOK = 0;
let esperado, resultado;

console.time("Tiempo de ejecución de la prueba:");
tests++;
console.log(`Test ${tests}: si se reciben 2 argumentos numericos, la fn debe retornar la suma`);

resultado = suma(5,5);
esperado = 10;

if(resultado === esperado){
    console.log(`Test ${tests} correcto!!!`.green);
    testsOK++;
} else {
    console.log(`Test ${tests} incorrecto`.red);
}

console.log('***********')
console.log(`Pruebas realizadas: ${tests}.`+` Pruebas válidas: ${testsOK}`.green+`. Pruebas incorrectas: ${tests-testsOK}`.red)
console.timeEnd("Tiempo de ejecución de la prueba:")
console.log('\x1b[34m\x1b[1mTest Finalizados\x1b[0m');
console.log('***********')
