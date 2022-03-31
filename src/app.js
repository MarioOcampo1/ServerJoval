const express = require('express');
const passport = require('passport');
const PassportLocal = require('passport-local').Strategy;
const cookieParser = require('cookie-parser')
const session = require('express-session')

const app = express();
const nodemon = require('nodemon');
const { dirname } = require('path');
const path = require('path'); //El modulo path nos permite concatenar directorios y hacerlos multiplataforma.
const morgan = require('morgan');
const { MACROMAN_BIN } = require('mysql/lib/protocol/constants/charsets');
//Settings
app.set('port', 3000); //configura port, con el valor 3000, en app
app.set('views', path.join(__dirname,'views' )); //path concatena dirname con la carpeta llamada views.
app.set('view engine','ejs'); //Ejs es un lenguaje que nos permite ser utilizado dentro de un html, permitiendo tener condicionales, bucles, dentro del html. 
//Ejs es usado por defecto por express. Asique no es necesario que lo requiera. directamente se usa.

//Middlewares //Son funciones que se van ejecutando antes de que llegue a las rutas.
app.use(morgan('dev'));
app.use(express.urlencoded({extended: true }));
app.use(express.json());
app.use(cookieParser('secreto'));
app.use(session({
    secret: 'mi secreto',
    resave:true,
    saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new PassportLocal(function(username,password, done){
    if(username=="Mario" && password == "asd"){
return    done(null,{id: 1 , name: "Mario"});
}
done(null, false);
// Cuando el sistema, quiere guardar que el usuario 1 ingreso al sistema, a esa llamada se le llama Serialización.
}))
passport.serializeUser(function(user,done){
    done(null,user.id);
})
passport.deserializeUser(function(id,done){
done(null,)
})
//Routes
app.use(require('./routes/AdminEcogas')); //Usa el enrutador
app.use(require('./routes/AdminGeneral'));
//Static
app.use (express.static(path.join(__dirname, 'public')));
app.use (express.static(path.join(__dirname, 'views'))); //Esta linea de codigo le dice a express que la carpeta public esta adentro de src
app.use(express.static('public'));
//404 Handler
app.use((req,res,next)=>{
res.status(404).render('404.ejs');

});

module.exports =app;