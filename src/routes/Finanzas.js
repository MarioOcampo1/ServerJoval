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

    if (username == "mocampo" && password == "asd") {
        return done(null, { id: 1, name: "Mario" });
    }
    if (username == "gmaceira" && password == "January2072") {
        return done(null, { id: 2, name: "Gustavo" });
    }
    if (username == "mpereyra" && password == "theboss") {
        return done(null, { id: 3, name: "Mauricio" });
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
        done(null, { id: 1, name: "Gustavo" });
    }
    if (id == 3) {
        done(null, { id: 1, name: "Mauricio" });
    }
})
//Seteo server original
const mysql = require('mysql');
const { NULL } = require('mysql/lib/protocol/constants/types');
const { routes } = require('../app');
const path = require('path');
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
router.get('/Finanzas', (req, res) => {
    //     if(req.isAuthenticated()){
    res.render('paginas/Finanzas/Home.ejs');
})
router.get('/PagoDeObras', (req, res) => {
    var sql = 'Select * from finanzas_pago_de_obras';
    connection.query(sql, (error, results) => {
        if (error) console.log(error);

        if (results.length > 0) {
            console.log("Se procede a cargar la pagina pago de obras");
            res.render('paginas/Finanzas/Pagodeobras.ejs', { results: results });

        }
        else {
            res.send('Ningun resultado encontrado');
        }
    })
})

router.get('/Pagodeobras/clientes/FormularioCliente', (req, res) => {
    console.log("Descargando archivo Excel");
    console.log("Dirname tiene:" + __dirname);
    let url = path.join(__dirname, '../', '/views/paginas/Finanzas/archivos/NuevoCliente.xlsx')
    console.log("url contiene:" + url);
    res.download(url, function (error) {
        console.log(error);

    });
})

router.get('/Pagodeobras/clientes/:Nombre', (req, res) => {
    var Nombre = req.params.Nombre;
    var sql = 'Select * from finanzas_clientes_por_obra WHERE NombreObra=?';
    connection.query(sql, [Nombre], (error, results) => {
        if (error) console.log(error);
        var contador=0;
        var json = JSON.parse(JSON.stringify(results));
        for (let i = 0; i < results.length; i++) {
            const element = JSON.parse(JSON.stringify(results[i]));
            if( element.NombreCliente!=null);
            contador++;
        }
        if(contador>0){
            res.render('paginas/Finanzas/Pagodeobras/clientes.ejs', { Clientes: results });
        }
        console.log("Se procede a cargar la pagina clientes por pago de obras");
       
    })
})
router.get('/Pagodeobras/clientes/:Nombre/VerClientes', (req, res) => {
    var Nombre = req.params.Nombre;
    var sql = 'Select NombreCliente from finanzas_clientes_por_obra WHERE NombreObra=?';
    connection.query(sql, [Nombre], (error, clientes) => {
        if (error) console.log(error);
        var contador=0;
        var json = JSON.parse(JSON.stringify(clientes));
        for (let i = 0; i < clientes.length; i++) {
            const element = JSON.parse(JSON.stringify(clientes[i]));
            if( element.NombreCliente!=null);
            contador++;
        }
        if(contador>0){
            res.send(clientes);
        }
        else{
           res.send("No se han encontrado clientes");

        }
       
    })
})

