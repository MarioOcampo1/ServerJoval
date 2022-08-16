const { render } = require('ejs');
const { Router } = require('express');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport');
const PassportLocal = require('passport-local').Strategy;
const router = Router();
const moment = require('moment');
module.exports = router;
router.use(session({
    secret: 'mi secreto',
    resave: true,
    saveUninitialized: true
}))
router.use(cookieParser('Mi ultra secreto'));
router.use(passport.initialize());
router.use(passport.session());
passport.use(new PassportLocal(function (username, password, done) {
User
    if (username == "mocampo" && password == "asd") {
        return done(null, { id: 1, name: "Mario" });
    }
    if (username == "gmaceira" && password == "January2072") {
        return done(null, { id: 2, name: "Gustavo" });
    }
    if (username == "mpereyra" && password == "theboss") {
        return done(null, { id: 3, name: "Mauricio" });
    }
    if(username=="Daiana" && password == "Drodriguez"){
        return done(null,{id: 4 , name: "Daiana"});
        
        }

    done(null, false); // Esta linea define a traves del null, que no hubo ningun error, pero el al mismo tiempo, a traves del false, indica que el usuario no se ha encontrado.
    // Cuando el sistema, quiere guardar que el usuario 1 ingreso al sistema, a esa llamada se le llama Serialización.
    
}))
passport.serializeUser(function (user, done) {
    done(null, user.id);
})
passport.deserializeUser(function (id, done) {
    if (id == 1) {
        done(null, { id: 1, name: "Mario" });
    }
    if (id == 2) {
        done(null, { id: 2, name: "Gustavo" });
    }
    if (id == 3) {
        done(null, { id: 3, name: "Mauricio" });
    }
    if (id == 4) {
        done(null, { id: 4, name: "Daiana" });
    }
})
//Seteo server original
const mysql = require('mysql');
const { NULL } = require('mysql/lib/protocol/constants/types');
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Thinker95',
    database: 'joval'
});
//check de conexion a la base de datos
connection.connect(error => {
    if (error) console.log(error);
})
//Settings
//Rutas Get
router.get('/admingral', (req, res) => {
    res.render('paginas/AdministracionGeneral/admingral.ejs');
})
router.get('/seguros', (req, res) => {
    res.render('paginas/AdministracionGeneral/seguros.ejs');
})
router.get('/infoempresa', (req, res) => {
    res.render('paginas/AdministracionGeneral/infoempresa.ejs');
})
router.get('/download/logoJoval', (req, res) => {
    var filepath = '/LogoJoval.jpg';
    var filename = 'Logo Joval.jpeg';
    res.download(filepath, filename);
})
router.get('/seguros/Albacaucion',(req,res)=>{
    if (req.isAuthenticated()) {
        var sql= 'Select Nombre from obras';
connection.query(sql,(error,obras)=>{
    var sql= 'Select * from admingeneral_seguros_albacaucion'

        res.locals.moment = moment;
        connection.query(sql, (error, results) => {
            if (error) console.log(error);

           
                res.render('paginas/AdministracionGeneral/Albacaucion.ejs', { results: results, obras:obras }); //en {results:results} lo que hago es guardar los resultados que envia la bd, en la variable results
          
           
        })
    })
    }
    else {
        res.redirect('/');
    }
})