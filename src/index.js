const app= require('./app');

async function main() {
await app.listen(app.get('port')); //obtiene el valor de la variable port, en la configuracion de app
// await app.listen(8124, "127.0.0.1");
console.log('Servidor corriendo en puerto', app.get('port')); //127.0.0.1:8124', app.get('port'));
}
main();