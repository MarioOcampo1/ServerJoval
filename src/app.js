const express = require('express');
const multer = require('multer');
const upload = multer({dest: 'src/uploads'});
const passport = require('passport');
const excel= require('xlsx');
const PassportLocal = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();
const nodemon = require('nodemon');
const { dirname } = require('path');
const path = require('path'); //El modulo path nos permite concatenar directorios, para poder usar todos y hacerlos multiplataforma.
const morgan = require('morgan');
const { Router } = require('express');
const router = Router();
module.exports = router;
//Middlewares //Son funciones que se van ejecutando antes de que llegue a las rutas.
app.use(morgan('dev'));
app.use(express.urlencoded({extended: true }));
app.use(express.json());
app.use(cookieParser('secreto'));
app.use(session({
    secret: 'misecreto',
    resave:true,
    saveUninitialized: true
}))
//Settings
app.set('port', 3000); //configura port, con el valor 3000, en app
app.set('public', path.join(__dirname,'public' ));

app.set('views', path.join(__dirname,'views' )); //path concatena dirname con la carpeta llamada views.

app.set('view engine','ejs'); //Ejs es un lenguaje que nos permite ser utilizado dentro de un html, permitiendo tener condicionales, bucles, dentro del html. 
//Ejs es usado por defecto por express. Asique no es necesario que lo requiera. directamente se usa.
//Static
app.use (express.static(path.join(__dirname, 'public')));//Esta linea de codigo le dice a express que la carpeta public esta adentro de src

app.use(express.static('public'));
//Routes
app.use(require('./routes/Principal'));
app.use(require('./routes/AdminEcogas')); //Usa el enrutador
app.use(require('./routes/AdminGeneral'));
app.use(require('./routes/Compra-Venta'));
app.use(require('./routes/Finanzas'));
//404 Handler
app.use((req,res,next)=>{
res.status(404).render('404.ejs');

});

module.exports =app;