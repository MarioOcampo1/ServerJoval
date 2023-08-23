const { render } = require('ejs');
const { Router } = require('express');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport');
const react = require('react');
const fs= require('fs');
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
//Seteo server original
const mysql = require('mysql');
const { NULL, DATE } = require('mysql/lib/protocol/constants/types');
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
router.get('/vencimientosDocGral', (req, res) => {

    let sql = 'SELECT * FROM vencimientos;'
    connection.query(sql, (error, results) => {
        if (error) console.log(error);
        else {
            res.render('./paginas/AdministracionGeneral/vencimientos.ejs', { vencimientos: results, moment })
        }
    })
})
router.get('/vencimientosDocGral/obtenerinfo', (req, res) => {

    let sql = 'SELECT * FROM vencimientos;'
    connection.query(sql, (error, results) => {
        if (error) console.log(error);
        else {
            res.send(results);
        }
    })
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
            if (error) console.log(error);
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
                    if (element.VigenciaPoliza == "anual" && element.Riesgo != "Mantenimiento de oferta") {
                        var añoPoliza = new Date(element.ProximaRefacturacion).getFullYear();
                        var mesPoliza = new Date(element.ProximaRefacturacion).getMonth();
                        var diaPoliza = new Date(element.ProximaRefacturacion).getDate();
                        añoPoliza = añoPoliza + 1; //Se adiciona el año que requiere el if
                        fechaProximaRefacturacion = new Date(añoPoliza, mesPoliza, diaPoliza);
                        connection.query(sql, [{ ProximaRefacturacion: fechaProximaRefacturacion, Endoso: Endoso, EndosoPagado: "N" }, element.ID_poliza], (error) => {
                            if (error) console.log(error);
                        })
                    }
                    if (element.VigenciaPoliza == "semestral" && element.Riesgo != "Mantenimiento de oferta") {
                        var añoPoliza = new Date(element.ProximaRefacturacion).getFullYear();
                        var mesPoliza = new Date(element.ProximaRefacturacion).getMonth();
                        var diaPoliza = new Date(element.ProximaRefacturacion).getDate();
                        mesPoliza = mesPoliza + 6; //Se adiciona el año que requiere el if
                        fechaProximaRefacturacion = new Date(añoPoliza, mesPoliza, diaPoliza);
                        connection.query(sql, [{ ProximaRefacturacion: fechaProximaRefacturacion, Endoso: Endoso, EndosoPagado: "N" }, element.ID_poliza], (error) => {
                            if (error) console.log(error);
                        })
                    }
                    if (element.VigenciaPoliza == "trimestral" && element.Riesgo != "Mantenimiento de oferta") {
                        var añoPoliza = new Date(element.ProximaRefacturacion).getFullYear();
                        var mesPoliza = new Date(element.ProximaRefacturacion).getMonth();
                        var diaPoliza = new Date(element.ProximaRefacturacion).getDate();
                        mesPoliza = mesPoliza + 3; //Se adiciona el año que requiere el if
                        fechaProximaRefacturacion = new Date(añoPoliza, mesPoliza, diaPoliza);
                        connection.query(sql, [{ ProximaRefacturacion: fechaProximaRefacturacion, Endoso: Endoso, EndosoPagado: "N" }, element.ID_poliza], (error) => {
                            if (error) console.log(error);
                        })
                    }
                    if (element.Riesgo == "Mantenimiento de oferta") {
                        var añoPoliza = new Date(element.FechaEmisionPoliza).getFullYear();
                        var mesPoliza = new Date(element.FechaEmisionPoliza).getMonth();
                        var diaPoliza = new Date(element.FechaEmisionPoliza).getDate();
                        mesPoliza = mesPoliza + 1;
                        var fechaVencimientoPoliza = new Date(añoPoliza, mesPoliza, diaPoliza);
                        if (fechaVencimientoPoliza < fechaActual) {
                            connection.query(sql, [{ Estado: "Dada de baja" }, element.ID_poliza], (error) => {
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
            sql = 'Select * from admingeneral_seguros_albacaucion where Estado !="Dada de baja"';
            connection.query(sql, (error, polizasvigentes) => {
                cantidadPolizasVigentes = polizasvigentes.length;
            })
            console.log(cantidadPolizasVigentes);
            sql = 'Select Nombre from obras';
            connection.query(sql, (error, obras) => {
                sql = 'Select * from admingeneral_seguros_albacaucion ORDER BY NumeroPoliza';
                connection.query(sql, (error, results) => {

                    if (error) console.log(error);
                    // res.send(results);
                    var fechaActual = new Date();
                    var anio = fechaActual.getFullYear();
                    var mes = fechaActual.getMonth();
                    var dia = fechaActual.getDate();
                    mes = mes + 3;
                    var fechaAComparar = new Date(anio, mes, dia);

                    res.render('paginas/AdministracionGeneral/Seguros/Albacaucion.ejs', { results: results, moment: moment, obras: obras, fechaAComparar, cantidadPolizasVigentes }); //en {results:results} lo que hago es guardar los resultados que envia la bd, en la variable results
                })
            })
        }
        else {
            res.redirect('/');
        }
    })


})
router.get('/admingral/informacionlegal',(req,res)=>{
    const archivos =fs.readdirSync('Archivos/2 Administracion General/01.INFORMACION LEGAL-COMERCIAL/01.LEGAL');
    var sql= 'SELECT * FROM informacionlegal;'
    res.render('./paginas/AdministracionGeneral/informacionlegal.ejs',{archivos})
})
router.post('/NuevoItemVencimiento', (req, res) => {
    let sql = 'INSERT INTO vencimientos set?';
    var fechaActual = new Date();
    connection.query(sql, {
        Item: req.body.Item, FechaActualizacion: fechaActual, FechaVencimiento: req.body.FechaVencimiento, DiasPreviosAviso: req.body.AvisoSistema
    }, (error, results) => {
        if (error) console.log(error);
        else {
            res.redirect('/vencimientosDocGral');
        }
    })
})
router.post('/ActualizarVencimiento', (req, res) => {
    let sql = 'UPDATE vencimientos set? WHERE id=?';
    var id = req.body.VencimientoID;
    var fechaActual = new Date();
    connection.query(sql, [{
        Item: req.body.Item, FechaActualizacion: fechaActual, FechaVencimiento: req.body.FechaVencimiento, DiasPreviosAviso: req.body.AvisoSistema
    }, id], (error, results) => {
        if (error) console.log(error);
        else {
            res.redirect('/vencimientosDocGral');
        }
    })
})
router.post('/GuardarPolizaAlbacaucion', (req, res) => {
    let Aseguradora = req.body.Aseguradora;
    let NombreObra = req.body.NombreObra;
    let NPoliza = req.body.NPoliza;
    let EstadoPoliza = req.body.Estado;
    var FechaEmisionPoliza = new Date(req.body.FechaEmisionPoliza);
    let VigenciaPoliza = req.body.VigenciaPoliza;
    var EndosoPagado = req.body.EndosoPagado;
    var day = FechaEmisionPoliza.getDate();
    var mes = FechaEmisionPoliza.getMonth();
    var anio = FechaEmisionPoliza.getFullYear();
    var ProximaRefacturacion;
    if (VigenciaPoliza == "Trimestral") {
        switch (mes) {
            case 10:
                mes = 1;
                anio = anio + 1;
                break;
            case 11:
                mes = 2;
                anio = anio + 1;
                break;
            case 12:
                mes = 3;
                anio = anio + 1;
                break;
            default:
                mes = mes + 3;
                break;
        }
        if (day > 28) {
            if (mes == 2) {
                day = 28;
            }
        }
    }
    if (VigenciaPoliza == "Semestral") {
        switch (mes) {
            case 7:
                mes = 1;
                anio = anio + 1;
                break;
            case 8:
                mes = 2;
                anio = anio + 1;
                break;
            case 9:
                mes = 3;
                anio = anio + 1;
                break;
            case 10:
                mes = 4;
                anio = anio + 1;
                break;
            case 11:
                mes = 5;
                anio = anio + 1;
                break;
            case 12:
                mes = 6;
                anio = anio + 1;
                break;
            default:
                mes = mes + 6;
                break;
        }
        if (day > 28) {
            if (mes == 2) {
                day = 28;
            }
        }
    }

    if (VigenciaPoliza == "Anual") {
        anio = anio + 1;

        if (day > 28) {
            if (mes == 2) {
                day = 28;
            }
        }
    }
    ProximaRefacturacion = new Date(anio, mes, day);
    let TipoRiesgo = req.body.TipoRiesgo;
    if (TipoRiesgo == "Mantenimiento de oferta") {
        ProximaRefacturacion = "";
    }
    let ValorAPagar = req.body.Valor;
    let montoAsegurado = req.body.MontoAsegurado;
    let Asegurado = req.body.Asegurado;
    let Descripcion = req.body.Descripcion;
    if (NombreObra == '') { }
    else {
        var sql = 'SELECT id FROM obras WHERE Nombre = "' + NombreObra + '";';
        var idObra;
        connection.query(sql, (error, results) => {
            if (error) {
                console.log(error);
            }
            else {
                idObra = results[0].id;
                if(TipoRiesgo==="Mantenimiento de oferta"){
                    sql = 'Insert into admingeneral_seguros_albacaucion set?'
                    connection.query(sql, {
                        Aseguradora: Aseguradora, Obra: NombreObra, NumeroPoliza: NPoliza,
                        FechaEmisionPoliza: FechaEmisionPoliza, Descripcion: Descripcion, Endoso: 0, EndosoPagado: EndosoPagado, Estado: EstadoPoliza,
                        VigenciaPoliza: VigenciaPoliza, Riesgo: TipoRiesgo, Valor: ValorAPagar, MontoAsegurado: montoAsegurado, NombreAsegurado: Asegurado
                    }, (error, results) => {
                        if (error) console.log(error);
                        else {
                            res.redirect('/seguros/Albacaucion');
                        }
                    })
                }
                sql = 'Insert into admingeneral_seguros_albacaucion set?'
                connection.query(sql, {
                    Aseguradora: Aseguradora, ProximaRefacturacion: ProximaRefacturacion, Obra: NombreObra, NumeroPoliza: NPoliza,
                    FechaEmisionPoliza: FechaEmisionPoliza, Descripcion: Descripcion, Endoso: 0, EndosoPagado: EndosoPagado, Estado: EstadoPoliza,
                    VigenciaPoliza: VigenciaPoliza, Riesgo: TipoRiesgo, Valor: ValorAPagar, MontoAsegurado: montoAsegurado, NombreAsegurado: Asegurado
                }, (error, results) => {
                    if (error) console.log(error);
                    else {
                        res.redirect('/seguros/Albacaucion');
                    }
                })
            }
        })

    }


})
router.post('/DeleteItemVencimiento', (req, res) => {
    let sql = 'DELETE FROM vencimientos WHERE id =? ';
    connection.query(sql, req.body.IdItemABorrar, (error, results) => {
        if (error) console.log(error);
        else {
            res.redirect('/vencimientosDocGral');
        }
    })
})
router.get('/seguros/ActualizarPolizaAlbacaucion/:id', (req, res) => {
    if (req.isAuthenticated()) {
        var id = req.params.id;
        var listadoObras;
        var sql = 'Select id, Nombre from obras;';
        connection.query(sql, (error, results) => {
            listadoObras = results;
        })
        sql = 'Select * from admingeneral_seguros_albacaucion WHERE ID_poliza = ? ';
        connection.query(sql, id, (error, results) => {
            if (error) console.log(error);
            else {
                // res.send(results);
                res.render('paginas/AdministracionGeneral/partials/albacaucion/ActualizarPolizaAlbacaucion.ejs', { obras: results, listadoObras, moment: moment });
            }
        })

    }
})
router.post('/ActualizarPolizaAlbacaucion/:id', (req, res) => {
    if (req.isAuthenticated()) {
        let id = req.params.id;
        let Aseguradora = req.body.Aseguradora;
        let Obra = req.body.Obra;
        let EstadoPoliza = req.body.Estado;
        let NPoliza = req.body.NPoliza;
        let FechaEmisionPoliza = req.body.FechaEmisionPoliza;
        let VigenciaPoliza = req.body.VigenciaPoliza;
        let DescripcionRiesgo = req.body.DescripcionRiesgo;
        let ValorAPagar = req.body.Valor;
        let montoAsegurado = req.body.MontoAsegurado;
        let Asegurado = req.body.Asegurado;
        let Endoso = req.body.Endoso;
        var ProximaRefacturacion = req.body.ProximaRefacturacion;
        let Descripcion = req.body.Descripcion
        var EndosoPagado = req.body.EndosoPagado;
        var BajaSolicitada = req.body.BajaSolicitada;
        var sql = 'UPDATE admingeneral_seguros_albacaucion set? WHERE ID_poliza = ?'
        if (FechaEmisionPoliza == "" || FechaEmisionPoliza == null || FechaEmisionPoliza == undefined) {
            if (ProximaRefacturacion == null || ProximaRefacturacion == undefined || ProximaRefacturacion == "") {
                connection.query(sql, [{
                    Aseguradora: Aseguradora, NumeroPoliza: NPoliza, Obra: Obra,
                    VigenciaPoliza: VigenciaPoliza, Riesgo: DescripcionRiesgo, Valor: ValorAPagar, MontoAsegurado: montoAsegurado,
                    NombreAsegurado: Asegurado, Endoso: Endoso, EndosoPagado: EndosoPagado, EnvioParaBajaAAlbacaucion: BajaSolicitada, Estado: EstadoPoliza, Descripcion: Descripcion,
                }, id], (error, results) => {
                    if (error) console.log(error);
                    else {
                        res.redirect('/seguros/Albacaucion');
                    }
                })
            }
            else {
                connection.query(sql, [{
                    Aseguradora: Aseguradora, NumeroPoliza: NPoliza, Obra: Obra,
                    VigenciaPoliza: VigenciaPoliza, Riesgo: DescripcionRiesgo, Valor: ValorAPagar, MontoAsegurado: montoAsegurado,
                    NombreAsegurado: Asegurado, Endoso: Endoso, EndosoPagado: EndosoPagado, EnvioParaBajaAAlbacaucion: BajaSolicitada, Estado: EstadoPoliza, ProximaRefacturacion: ProximaRefacturacion
                }, id], (error, results) => {
                    if (error) console.log(error);
                    else {
                        res.redirect('/seguros/Albacaucion');
                    }
                })
            }

        } else {
            if (ProximaRefacturacion == null || ProximaRefacturacion == undefined || ProximaRefacturacion == "") {
                connection.query(sql, [{
                    Aseguradora: Aseguradora, NumeroPoliza: NPoliza, FechaEmisionPoliza: FechaEmisionPoliza, Obra: Obra,
                    VigenciaPoliza: VigenciaPoliza, Riesgo: DescripcionRiesgo, Valor: ValorAPagar, MontoAsegurado: montoAsegurado, NombreAsegurado: Asegurado, Endoso: Endoso,
                    EndosoPagado: EndosoPagado, Estado: EstadoPoliza, EnvioParaBajaAAlbacaucion: BajaSolicitada,

                }, id], (error, results) => {
                    if (error) console.log(error);
                    else {
                        res.redirect('/seguros/Albacaucion');
                    }
                })
            } else {
                connection.query(sql, [{
                    Aseguradora: Aseguradora, NumeroPoliza: NPoliza, FechaEmisionPoliza: FechaEmisionPoliza, Obra: Obra,
                    VigenciaPoliza: VigenciaPoliza, Riesgo: DescripcionRiesgo, Valor: ValorAPagar, MontoAsegurado: montoAsegurado, NombreAsegurado: Asegurado, Endoso: Endoso,
                    ProximaRefacturacion: ProximaRefacturacion, EndosoPagado: EndosoPagado, Estado: EstadoPoliza, EnvioParaBajaAAlbacaucion: BajaSolicitada,
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
