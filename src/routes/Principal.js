const { render } = require('ejs');
const { Router } = require('express');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport');
const PassportLocal = require('passport-local').Strategy;
const router = Router();
module.exports = router;
const moment = require('moment');
var xlsx = require('xlsx');
router.use(session({
    secret: 'misecreto',
    resave: true,
    saveUninitialized: true
}))

router.use(cookieParser('Mi ultra secreto'));
router.use(passport.initialize());
router.use(passport.session());
passport.use(new PassportLocal(function (username, password, done) {
connection.query('Select * from usuariosregistrados',(error,results)=>{
    if(error) console.log(error);
for (let index = 0; index < results.length; index++) {
    const element = results[index];
    if (username == element.Usuario && password == element.Password) {
        return done(null, { id: element.id, name: element.Usuario });
    }
}    
})

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
        return done(null,{id: 4, name: "Daiana"});
        }
        if(err){return done(err);}
console.log("Ningun usuario encontrado");
    done(null, false); // Esta linea define a traves del null, que no hubo ningun error, pero el al mismo tiempo, a traves del false, indica que el usuario no se ha encontrado.
    // Cuando el sistema, quiere guardar que el usuario 1 ingreso al sistema, a esa llamada se le llama Serialización.
}))
passport.serializeUser(function (user, done) {
    done(null, user.id);
})
passport.deserializeUser(function (id, done) {
   if (id == 1) {
        done(null, { id: 1 });
    }
    if (id == 2) {
        done(null, { id: 2 });
    }
    if (id == 3) {
        done(null, { id: 3 });
    }
    if (id == 4) {
        done(null, { id: 4 });
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
router.get('/', (req, res) => {
    res.render('login.ejs');
})

router.get('/index', (req, res, next) => {
    if (req.isAuthenticated()) {
        var fecha = new Date();
        var sql='Select * from admingeneral_seguros_albacaucion where ProximaRefacturacion BETWEEN (NOW() - Interval 1 Month) AND (NOW() + Interval 6 Month)  AND Estado != "Dada de baja"';
        connection.query(sql, (error,results)=>{
            if(error)console.log(error);
            else{
                
                res.render('index.ejs',{ albacaucion:results, moment: moment});
            }
            
        })
        
    }
    else {
        (req, res) => {
            res.redirect('/');
        }
    }
})