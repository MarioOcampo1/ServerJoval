const express = require('express');
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
passport.use(new PassportLocal(function (username, password, done) {

    if (username == "mocampo" && password == "asd") {
        return done(null, { id: 1, name: "Mario" });
    }
    if (username == "gmaceira" && password == "January2072") {
        return done(null, { id: 2, name: "Gustavo" });
    }
    if (username == "mpereyra" && password == "theboss") {
        return done(null, { id: 3, name: "Mauricio" });
    }
    if(username=="sebas" && password == "4321"){
        return done(null,{id: 4, name: "Sebas"});
        }
        if(err){return done(err);}
console.log("Ningun usuario encontrado");
    done(null, false); 
    
}))
passport.serializeUser(function(user,done){
    done(null,user.id);
})
passport.deserializeUser(function(id,done){
done(null,)
})
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
app.use(require('./routes/AdminEcogas')); //Usa el enrutador
app.use(require('./routes/AdminGeneral'));
app.use(require('./routes/Compra-Venta'));
app.use(require('./routes/Finanzas'));
//404 Handler
app.use((req,res,next)=>{
res.status(404).render('404.ejs');

});

module.exports =app;