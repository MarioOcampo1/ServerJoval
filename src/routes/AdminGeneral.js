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
// res.send(results);
                res.render('paginas/AdministracionGeneral/Seguros/Albacaucion.ejs', { results: results, moment:moment, obras:obras }); //en {results:results} lo que hago es guardar los resultados que envia la bd, en la variable results
        })
    })
    }
    else {
        res.redirect('/');
    }
})
router.post('/GuardarPolizaAlbacaucion',(req,res)=>{
    if (req.isAuthenticated()) {
        let Aseguradora= req.body.Aseguradora;
        let NombreObra = req.body.NombreObra;
        let NPoliza= req.body.NPoliza;
        let FechaEmisionPoliza = req.body.FechaEmisionPoliza;
         let VigenciaPoliza = req.body.VigenciaPoliza;
         let DescripcionRiesgo= req.body.DescripcionRiesgo;
         let ValorAPagar = req.body.Valor;
         let montoAsegurado = req.body.MontoAsegurado;
         let Asegurado = req.body.Asegurado;
        var sql= 'Insert into admingeneral_seguros_albacaucion set?'
        connection.query(sql,{
Aseguradora:Aseguradora, Obra:NombreObra, NumeroPoliza:NPoliza, FechaEmisionPoliza:FechaEmisionPoliza,
VigenciaPoliza:VigenciaPoliza,Riesgo:DescripcionRiesgo, Valor:ValorAPagar, MontoAsegurado: montoAsegurado, NombreAsegurado: Asegurado
        },(error,results)=>{
            if (error) console.log(error);  
            else{
                res.redirect('/seguros/Albacaucion');   
            }
        })
    }

})
router.get('/seguros/ActualizarPolizaAlbacaucion/:id', (req,res)=>{
    if (req.isAuthenticated()) {
        var id= req.params.id;
        console.log("El id seleccionado es:"+ id);
        var sql= 'Select * from admingeneral_seguros_albacaucion WHERE ID_poliza = ?';
        connection.query(sql,id,(error,results)=>{
            if (error) console.log(error);  
            else{
                // res.send(results);
                res.render('paginas/AdministracionGeneral/partials/albacaucion/ActualizarPolizaAlbacaucion.ejs', {obras:results, moment:moment});  
            }
        })

    }
})
router.post('/ActualizarPolizaAlbacaucion/:id', (req,res)=>{
    if (req.isAuthenticated()) {
        let id= req.params.id;
        let Aseguradora= req.body.Aseguradora;
        let Obra = req.body.Obra;
        let NPoliza= req.body.NPoliza;
        let FechaEmisionPoliza = req.body.FechaEmisionPoliza;
         let VigenciaPoliza = req.body.VigenciaPoliza;
         let DescripcionRiesgo= req.body.DescripcionRiesgo;
         let ValorAPagar = req.body.Valor;
         let montoAsegurado = req.body.MontoAsegurado;
         let Asegurado = req.body.Asegurado;
         let Endoso = req.body.Endoso;
        var sql= 'UPDATE admingeneral_seguros_albacaucion set? WHERE ID_poliza = ?'
        if(FechaEmisionPoliza==""){
            connection.query(sql,[{
                Aseguradora:Aseguradora, NumeroPoliza:NPoliza, Obra:Obra,
                VigenciaPoliza:VigenciaPoliza,Riesgo:DescripcionRiesgo, Valor:ValorAPagar, MontoAsegurado: montoAsegurado, NombreAsegurado:Asegurado, Endoso:Endoso
                        }, id],(error,results)=>{
                            if (error) console.log(error);  
                            else{
                                res.redirect('/seguros/Albacaucion');   
                            }
                        })
        }else{
            connection.query(sql,[{
                Aseguradora:Aseguradora, NumeroPoliza:NPoliza, FechaEmisionPoliza:FechaEmisionPoliza, Obra:Obra,
                VigenciaPoliza:VigenciaPoliza,Riesgo:DescripcionRiesgo, Valor:ValorAPagar, MontoAsegurado: montoAsegurado, NombreAsegurado:Asegurado, Endoso:Endoso
                        }, id],(error,results)=>{
                            if (error) console.log(error);  
                            else{
                                res.redirect('/seguros/Albacaucion');   
                            }
                        })
        }
     
    }
})
router.post('/BorrarPoliza/:id', (req,res)=>{
    if (req.isAuthenticated()) {
        var id= req.params.id;
      var sql= 'DELETE FROM admingeneral_seguros_albacaucion WHERE ID_poliza = ?'
        connection.query(sql,[id],(error,results)=>{
            if (error) console.log(error);  
            else{
                res.redirect('/seguros/Albacaucion');   
            }
        })
    }
})