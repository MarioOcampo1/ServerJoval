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
    if (username == "Daiana" && password == "Drodriguez") {
        return done(null, { id: 4, name: "Daiana" });

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
const { now } = require('moment');
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
router.get('/seguros/Albacaucion', (req, res) => {
    new Promise((resolve, reject) => {
        var sql = 'Select * from admingeneral_seguros_albacaucion WHERE  Estado !="Dada de baja" ';
        res.locals.moment = moment;
        
        
        connection.query(sql, (error, results) => {
            if(error)console.log(error);
            var fechaActual = new Date();
            var fechaProximaRefacturacion;
            
            results.forEach(element => {
                if (element.ProximaRefacturacion < fechaActual) {
                    sql = 'Update admingeneral_seguros_albacaucion set? WHERE ID_poliza=?';
                    var Endoso = element.Endoso;
                    if (Endoso == null || Endoso == undefined) {
                        Endoso = 0;
                    }
                    Endoso = Endoso + 1; //Si endoso esta cargado, continuo con lo que quiero que haga el codigo, que aumente el endoso en 1 si la fecha esta vencida.                    
                    if (element.VigenciaPoliza == "anual" && element.Riesgo!="Mantenimiento de oferta") {
                        var añoPoliza = new Date(element.ProximaRefacturacion).getFullYear();
                        var mesPoliza = new Date(element.ProximaRefacturacion).getMonth();
                        var diaPoliza = new Date(element.ProximaRefacturacion).getDate();
                        añoPoliza = añoPoliza + 1; //Se adiciona el año que requiere el if
                        fechaProximaRefacturacion = new Date(añoPoliza, mesPoliza, diaPoliza);
                        connection.query(sql, [{ ProximaRefacturacion: fechaProximaRefacturacion, Endoso }, element.ID_poliza], (error) => {
                            if (error) console.log(error);
                        })
                    }
                    if (element.VigenciaPoliza == "semestral" && element.Riesgo!="Mantenimiento de oferta") {
                        var añoPoliza = new Date(element.ProximaRefacturacion).getFullYear();
                        var mesPoliza = new Date(element.ProximaRefacturacion).getMonth();
                        var diaPoliza = new Date(element.ProximaRefacturacion).getDate();
                        mesPoliza = mesPoliza + 6; //Se adiciona el año que requiere el if
                        fechaProximaRefacturacion = new Date(añoPoliza, mesPoliza, diaPoliza);
                        connection.query(sql, [{ ProximaRefacturacion: fechaProximaRefacturacion, Endoso }, element.ID_poliza], (error) => {
                            if (error) console.log(error);
                        })
                    }
                    if (element.VigenciaPoliza == "trimestral" && element.Riesgo!="Mantenimiento de oferta") {
                        var añoPoliza = new Date(element.ProximaRefacturacion).getFullYear();
                        var mesPoliza = new Date(element.ProximaRefacturacion).getMonth();
                        var diaPoliza = new Date(element.ProximaRefacturacion).getDate();
                        mesPoliza = mesPoliza + 3; //Se adiciona el año que requiere el if
                        fechaProximaRefacturacion = new Date(añoPoliza, mesPoliza, diaPoliza);
                        connection.query(sql, [{ ProximaRefacturacion: fechaProximaRefacturacion, Endoso }, element.ID_poliza], (error) => {
                            if (error) console.log(error);
                        })
                    }
                    if(element.Riesgo=="Mantenimiento de oferta"){
                        var añoPoliza = new Date(element.FechaEmisionPoliza).getFullYear();
                        var mesPoliza = new Date(element.FechaEmisionPoliza).getMonth();
                        var diaPoliza = new Date(element.FechaEmisionPoliza).getDate();
                        mesPoliza = mesPoliza + 1;
 var fechaVencimientoPoliza  = new Date(añoPoliza, mesPoliza, diaPoliza);
 if(fechaVencimientoPoliza< fechaActual){
    connection.query(sql, [{Estado:"Dada de baja"  }, element.ID_poliza], (error) => {
        if (error) console.log(error);
    })
 }
                    }
                
            };
        });
    })
resolve();
    }).then(function () {
        if (req.isAuthenticated()) {
            var cantidadPolizasVigentes;
            sql='Select * from admingeneral_seguros_albacaucion where Estado !="Dada de baja"';
            connection.query(sql, (error, polizasvigentes) => {
            cantidadPolizasVigentes = polizasvigentes.length;
            })
            console.log(cantidadPolizasVigentes);
             sql = 'Select Nombre from obras';
            connection.query(sql, (error, obras) => {
                 sql = 'Select * from admingeneral_seguros_albacaucion ';
                connection.query(sql, (error, results) => {
                    if (error) console.log(error);
                    // res.send(results);
                    var fechaActual = new Date();
                    var anio = fechaActual.getFullYear();
                    var mes= fechaActual.getMonth();
                    var dia = fechaActual.getDate();
mes= mes+3;
                    var fechaAComparar = new Date(anio,mes,dia);
                    
                    res.render('paginas/AdministracionGeneral/Seguros/Albacaucion.ejs', { results: results, moment: moment, obras: obras, fechaAComparar, cantidadPolizasVigentes }); //en {results:results} lo que hago es guardar los resultados que envia la bd, en la variable results
                })
            })
        }
        else {
            res.redirect('/');
        }
    })


})
router.post('/GuardarPolizaAlbacaucion', (req, res) => {
    if (req.isAuthenticated()) {
        let Aseguradora = req.body.Aseguradora;
        let NombreObra = req.body.NombreObra;
        let NPoliza = req.body.NPoliza;
        let FechaEmisionPoliza = req.body.FechaEmisionPoliza;
        let VigenciaPoliza = req.body.VigenciaPoliza;
        let DescripcionRiesgo = req.body.DescripcionRiesgo;
        let ValorAPagar = req.body.Valor;
        let montoAsegurado = req.body.MontoAsegurado;
        let Asegurado = req.body.Asegurado;
        if (NombreObra = "") { }
        else {
            var sql = 'Insert into admingeneral_seguros_albacaucion set?'
            connection.query(sql, {
                Aseguradora: Aseguradora, Obra: NombreObra, NumeroPoliza: NPoliza, FechaEmisionPoliza: FechaEmisionPoliza,
                VigenciaPoliza: VigenciaPoliza, Riesgo: DescripcionRiesgo, Valor: ValorAPagar, MontoAsegurado: montoAsegurado, NombreAsegurado: Asegurado
            }, (error, results) => {
                if (error) console.log(error);
                else {
                    res.redirect('/seguros/Albacaucion');
                }
            })
        }
    }

})
router.get('/seguros/ActualizarPolizaAlbacaucion/:id', (req, res) => {
    if (req.isAuthenticated()) {
        var id = req.params.id;
        console.log("El id seleccionado es:" + id);
        var sql = 'Select * from admingeneral_seguros_albacaucion WHERE ID_poliza = ? ';
        connection.query(sql, id, (error, results) => {
            if (error) console.log(error);
            else {
                // res.send(results);
                res.render('paginas/AdministracionGeneral/partials/albacaucion/ActualizarPolizaAlbacaucion.ejs', { obras: results, moment: moment });
            }
        })

    }
})
router.post('/ActualizarPolizaAlbacaucion/:id', (req, res) => {
    if (req.isAuthenticated()) {
        let id = req.params.id;
        let Aseguradora = req.body.Aseguradora;
        let Obra = req.body.Obra;
        let NPoliza = req.body.NPoliza;
        let FechaEmisionPoliza = req.body.FechaEmisionPoliza;
        let VigenciaPoliza = req.body.VigenciaPoliza;
        let DescripcionRiesgo = req.body.DescripcionRiesgo;
        let ValorAPagar = req.body.Valor;
        let montoAsegurado = req.body.MontoAsegurado;
        let Asegurado = req.body.Asegurado;
        let Endoso = req.body.Endoso;
        var ProximaRefacturacion = req.body.ProximaRefacturacion;
        var sql = 'UPDATE admingeneral_seguros_albacaucion set? WHERE ID_poliza = ?'
        if (FechaEmisionPoliza == "" || FechaEmisionPoliza == null ||FechaEmisionPoliza == undefined ) {
            if(ProximaRefacturacion == null || ProximaRefacturacion == undefined || ProximaRefacturacion == ""){
                connection.query(sql, [{
                    Aseguradora: Aseguradora, NumeroPoliza: NPoliza, Obra: Obra,
                    VigenciaPoliza: VigenciaPoliza, Riesgo: DescripcionRiesgo, Valor: ValorAPagar, MontoAsegurado: montoAsegurado,
                     NombreAsegurado: Asegurado, Endoso: Endoso
                }, id], (error, results) => {
                    if (error) console.log(error);
                    else {
                        res.redirect('/seguros/Albacaucion');
                    }
                })
            }
            else{
                connection.query(sql, [{
                    Aseguradora: Aseguradora, NumeroPoliza: NPoliza, Obra: Obra,
                    VigenciaPoliza: VigenciaPoliza, Riesgo: DescripcionRiesgo, Valor: ValorAPagar, MontoAsegurado: montoAsegurado,
                     NombreAsegurado: Asegurado, Endoso: Endoso, ProximaRefacturacion:ProximaRefacturacion
                }, id], (error, results) => {
                    if (error) console.log(error);
                    else {
                        res.redirect('/seguros/Albacaucion');
                    }
                }) 
            }
           
        } else {
            if(ProximaRefacturacion == null || ProximaRefacturacion == undefined || ProximaRefacturacion == ""){
            connection.query(sql, [{
                Aseguradora: Aseguradora, NumeroPoliza: NPoliza, FechaEmisionPoliza: FechaEmisionPoliza, Obra: Obra,
                VigenciaPoliza: VigenciaPoliza, Riesgo: DescripcionRiesgo, Valor: ValorAPagar, MontoAsegurado: montoAsegurado, NombreAsegurado: Asegurado, Endoso: Endoso,
                
            }, id], (error, results) => {
                if (error) console.log(error);
                else {
                    res.redirect('/seguros/Albacaucion');
                }
            })
        }else{
            connection.query(sql, [{
                Aseguradora: Aseguradora, NumeroPoliza: NPoliza, FechaEmisionPoliza: FechaEmisionPoliza, Obra: Obra,
                VigenciaPoliza: VigenciaPoliza, Riesgo: DescripcionRiesgo, Valor: ValorAPagar, MontoAsegurado: montoAsegurado, NombreAsegurado: Asegurado, Endoso: Endoso,
                ProximaRefacturacion:ProximaRefacturacion,
            }, id], (error, results) => {
                if (error) console.log(error);
                else {
                    res.redirect('/seguros/Albacaucion');
                }
            })
        }
        }

    }
})
router.post('/DarBajaPolizaAlbacaucion/:id', (req, res) => {
    if (req.isAuthenticated()) {
        var id = req.params.id;
        var sql = 'UPDATE admingeneral_seguros_albacaucion set Estado="Dada de baja" WHERE ID_poliza = ?'
        connection.query(sql, [id], (error, results) => {
            if (error) console.log(error);
            else {
                res.redirect('/seguros/Albacaucion');
            }
        })
    }
})