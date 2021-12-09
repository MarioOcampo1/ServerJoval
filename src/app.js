const express = require('express');
const app = express();
const nodemon = require('nodemon');
const { dirname } = require('path');
const path = require('path'); //El modulo path nos permite concatenar directorios y hacerlos multiplataforma.
const morgan = require('morgan');






//Settings
app.set('port', 3000); //configura port, con el valor 3000, en app
app.set('views', path.join(__dirname,'views' )); //path concatena dirname con la carpeta llamada views.
app.set('view engine','ejs'); //Ejs es un lenguaje que nos permite ser utilizado dentro de un html, permitiendo tener condicionales, bucles, dentro del html. 
//Ejs es usado por defecto por express. Asique no es necesario que lo requiera. directamente se usa.

//Middlewares //Son funciones que se van ejecutando antes de que llegue a las rutas.
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false }));
app.use(express.json());

//Routes
app.use(require('./routes/index')); //Usa el enrutador

//Static
app.use (express.static(path.join(__dirname, 'public'))); //Esta linea de codigo le dice a express que la carpeta public esta adentro de src

//404 Handler
app.use((req,res,next)=>{
res.status(404).send('404 NOT FOUND');

});

module.exports =app;