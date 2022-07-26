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
router.use(cookieParser('Mi ultra secreto'));
router.use(passport.initialize());
router.use(passport.session());
passport.use(new PassportLocal(function(username,password, done){
 
    if(username=="mocampo" && password == "asd"){
return done(null,{id: 1 , name: "Mario"});
    }
if(username=="gmaceira" && password == "January2072"){
    return    done(null,{id: 2 , name: "Gustavo"});
}
if(username=="mpereyra" && password == "theboss"){
    return    done(null,{id: 3 , name: "Mauricio"});
}
if(username=="sebas" && password == "4321"){
    return done(null,{id: 4 , name: "Sebas"});
    
    }

done(null, false); // Esta linea define a traves del null, que no hubo ningun error, pero el al mismo tiempo, a traves del false, indica que el usuario no se ha encontrado.
// Cuando el sistema, quiere guardar que el usuario 1 ingreso al sistema, a esa llamada se le llama Serialización.
}))
passport.serializeUser(function(user,done){
    done(null,user.id);
})
passport.deserializeUser(function(id,done){
    if( id==1){
done(null,{id:1, name: "Mario"});
    }
    if( id==2){
        done(null,{id:2, name: "Gustavo"});
            }
            if( id==3){
                done(null,{id:3, name: "Mauricio"});
                    }
                    if( id==3){
                        done(null,{id:4, name: "Sebas"});
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
