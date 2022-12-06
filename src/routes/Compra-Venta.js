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
    resave:true,
    saveUninitialized: true
}))
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
    if (error) console.log( error);
})
//Settings
//Rutas Get
router.get('/compraventa', (req, res) => {
//     if(req.isAuthenticated()){
    res.render('paginas/Compra-Venta/Principal.ejs');
//     }
//     else{
//         (req, res) => {
//             res.redirect('/');
//     }
// }
})
router.get('/compra',(req,res)=>{
    if(req.isAuthenticated()){
        res.render('paginas/Compra-Venta/compra.ejs');

    }else{
        (req, res) => {
            res.redirect('/');
    }
    }
})
router.get('/solicitudCotizacion',(req,res)=>{
    if(req.isAuthenticated()){
    var filename= './public/plantillas/SolicitudDeCotizacion(Plantilla).xlsx';
    res.download(filename);
  
    }else{
        (req, res) => {
            res.redirect('/');
    }
    }
})
router.post('/nuevasolicitudcotizacion',(req,res)=>{
    
})
