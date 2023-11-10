const express = require('express');
const bodyParser = require('body-parser');
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
var Archivos = "";
const path = require('path'); //El modulo path nos permite concatenar directorios, para poder usar todos y hacerlos multiplataforma.
const morgan = require('morgan');
const { Router } = require('express');
const { log } = require('console');
const router = Router();
const cors= require('cors');
const funciones = require('./funciones');

//Middlewares //Son funciones que se van ejecutando antes de que llegue a las rutas.
app.use(morgan('dev'));
app.use(express.urlencoded({extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookieParser('secreto'));
app.use(session({
    secret: 'misecreto',
    resave:true,
    saveUninitialized: true
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//Settings

app.set('port', 3000); //configura port, con el valor 3000, en app
app.set('views', path.join(__dirname,'views' )); //path concatena dirname con la carpeta llamada views.
app.set('view engine','ejs'); //Ejs es un lenguaje que nos permite ser utilizado dentro de un html, permitiendo tener condicionales, bucles, dentro del html. 
//Ejs es usado por defecto por express. Asique no es necesario que lo requiera. directamente se usa.
//Static
app.use (express.static(path.join(__dirname, 'public')));//Esta linea de codigo le dice a express que la carpeta public esta adentro de src
app.use(express.static('public'));
path.dirname(Archivos,'Archivos');//Esta linea de codigo le dice a express que la carpeta public esta adentro de src
//Routes
app.use(require('./routes/Principal'));
app.use(require('./routes/AdminEcogas')); //Usa el enrutador
app.use(require('./routes/AdminGeneral'));
app.use(require('./routes/Compra-Venta'));
app.use(require('./routes/Finanzas'));
app.use(require('./routes/Galpon'));

//404 Handler
app.use((req,res,next)=>{
res.status(404).render('404.ejs');

});

module.exports =app;