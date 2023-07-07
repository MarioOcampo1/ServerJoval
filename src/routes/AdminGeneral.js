const { render } = require('ejs');
const { Router } = require('express');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport');
const react= require('react');
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
router.get('/vencimientosDocGral',(req,res)=>{

    let sql='SELECT * FROM admingeneral_vencimientos;'
    connection.query(sql,(error,results)=>{
        if(error)console.log(error);
        else{
            res.render('./paginas/AdministracionGeneral/vencimientos.ejs',{vencimientos:results, moment})
        }
    })
})
router.get('/vencimientosDocGral/obtenerinfo',(req,res)=>{
    
    let sql='SELECT * FROM admingeneral_vencimientos;'
    connection.query(sql,(error,results)=>{
        if(error)console.log(error);
        else{
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
                        connection.query(sql, [{ ProximaRefacturacion: fechaProximaRefacturacion, Endoso:Endoso, EndosoPagado:"N" }, element.ID_poliza], (error) => {
                            if (error) console.log(error);
                        })
                    }
                    if (element.VigenciaPoliza == "semestral" && element.Riesgo!="Mantenimiento de oferta") {
                        var añoPoliza = new Date(element.ProximaRefacturacion).getFullYear();
                        var mesPoliza = new Date(element.ProximaRefacturacion).getMonth();
                        var diaPoliza = new Date(element.ProximaRefacturacion).getDate();
                        mesPoliza = mesPoliza + 6; //Se adiciona el año que requiere el if
                        fechaProximaRefacturacion = new Date(añoPoliza, mesPoliza, diaPoliza);
                        connection.query(sql, [{ ProximaRefacturacion: fechaProximaRefacturacion, Endoso:Endoso, EndosoPagado:"N" }, element.ID_poliza], (error) => {
                            if (error) console.log(error);
                        })
                    }
                    if (element.VigenciaPoliza == "trimestral" && element.Riesgo!="Mantenimiento de oferta") {
                        var añoPoliza = new Date(element.ProximaRefacturacion).getFullYear();
                        var mesPoliza = new Date(element.ProximaRefacturacion).getMonth();
                        var diaPoliza = new Date(element.ProximaRefacturacion).getDate();
                        mesPoliza = mesPoliza + 3; //Se adiciona el año que requiere el if
                        fechaProximaRefacturacion = new Date(añoPoliza, mesPoliza, diaPoliza);
                        connection.query(sql, [{ ProximaRefacturacion: fechaProximaRefacturacion, Endoso:Endoso, EndosoPagado:"N" }, element.ID_poliza], (error) => {
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
    connection.query(sql, [{Estado:"Dada de baja"}, element.ID_poliza], (error) => {
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
                 sql = 'Select * from admingeneral_seguros_albacaucion ORDER BY NumeroPoliza';
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

router.post('/NuevoItemVencimiento',(req,res)=>{
    let sql='INSERT INTO admingeneral_vencimientos set?';
    var fechaActual= new Date();
connection.query(sql,{
    Item: req.body.Item,FechaActualizacion:fechaActual,FechaVencimiento:req.body.FechaVencimiento,DiasPreviosAviso:req.body.AvisoSistema
},(error,results)=>{
if(error)console.log(error);
else{
    res.redirect('/vencimientosDocGral');
}
})    
})
router.post('/ActualizarVencimiento',(req,res)=>{
    let sql='UPDATE admingeneral_vencimientos set? WHERE id=?';
    var id= req.body.VencimientoID;
    var fechaActual= new Date();
connection.query(sql,[{
    Item: req.body.Item,FechaActualizacion:fechaActual,FechaVencimiento:req.body.FechaVencimiento,DiasPreviosAviso:req.body.AvisoSistema
},id],(error,results)=>{
if(error)console.log(error);
else{
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
        var EndosoPagado= req.body.EndosoPagado;
        var day= FechaEmisionPoliza.getDate();
        var mes = FechaEmisionPoliza.getMonth();
        var anio = FechaEmisionPoliza.getFullYear();
        var ProximaRefacturacion;
        if(VigenciaPoliza=="Trimestral"){
            switch (mes) {
                case 10:
                    mes=1;
                    anio=anio+1;
                    break;
                    case 11:
                        mes=2;
                        anio=anio+1;
                        break;
                        case 12:
                    mes=3;
                    anio=anio+1;
                    break;
                default:
                    mes= mes+3;
                    break;
            }
        if(day>28){
            if(mes==2){
                day=28;
            }
        }
        }
        if(VigenciaPoliza=="Semestral"){
            switch (mes) {
                case 7:
                    mes=1;
                    anio=anio+1;
                    break;
                case 8:
                    mes=2;
                    anio=anio+1;
                    break;
                case 9:
                    mes=3;
                    anio=anio+1;
                    break;
                case 10:
                    mes=4;
                    anio=anio+1;
                    break;
                case 11:
                        mes=5;
                        anio=anio+1;
                        break;
                case 12:
                    mes=6;
                    anio=anio+1;
                    break;
                default:
                    mes= mes+6;
                    break;
            }
            if(day>28){
                if(mes==2){
                    day=28;
                }
            }
        }
        
        if(VigenciaPoliza=="Anual"){
            anio=anio+1;

            if(day>28){
                if(mes==2){
                    day=28;
                }
            }
        }
        ProximaRefacturacion = new Date(anio,mes,day);
        let TipoRiesgo = req.body.TipoRiesgo;
        if(TipoRiesgo=="Mantenimiento de oferta"){
            ProximaRefacturacion="";
        }
        let ValorAPagar = req.body.Valor;
        let montoAsegurado = req.body.MontoAsegurado;
        let Asegurado = req.body.Asegurado;
        let Descripcion = req.body.Descripcion;
        if (NombreObra == '') { }
        else {
            var sql = 'SELECT id FROM obras WHERE Nombre = "'+NombreObra+'";';
            var idObra;
                connection.query(sql,(error,results)=>{
                    if(error){
                        console.log(error);
                    } 
                    else{
                        idObra=results[0].id;
                        sql = 'Insert into admingeneral_seguros_albacaucion set?'
                        connection.query(sql, {
                            Aseguradora: Aseguradora, ProximaRefacturacion:ProximaRefacturacion, Obra: NombreObra, NumeroPoliza: NPoliza,
                             FechaEmisionPoliza: FechaEmisionPoliza, Descripcion:Descripcion, Endoso:0,EndosoPagado:EndosoPagado, Estado:EstadoPoliza,
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
router.post('/DeleteItemVencimiento',(req,res)=>{
    let sql= 'DELETE FROM admingeneral_vencimientos WHERE id =? ';
    connection.query(sql,req.body.IdItemABorrar,(error,results)=>{
        if(error)console.log(error);
        else{
            res.redirect('/vencimientosDocGral');
        }
    })
})
router.get('/seguros/ActualizarPolizaAlbacaucion/:id', (req, res) => {
    if (req.isAuthenticated()) {
        var id = req.params.id;
        var listadoObras;
        var sql= 'Select id, Nombre from obras;';
        connection.query(sql,(error,results)=>{
listadoObras = results;
        })
         sql = 'Select * from admingeneral_seguros_albacaucion WHERE ID_poliza = ? ';
        connection.query(sql, id, (error, results) => {
            if (error) console.log(error);
            else {
                // res.send(results);
                res.render('paginas/AdministracionGeneral/partials/albacaucion/ActualizarPolizaAlbacaucion.ejs', { obras: results,listadoObras, moment: moment });
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
        var BajaSolicitada= req.body.BajaSolicitada;
        var sql = 'UPDATE admingeneral_seguros_albacaucion set? WHERE ID_poliza = ?'
        if (FechaEmisionPoliza == "" || FechaEmisionPoliza == null ||FechaEmisionPoliza == undefined ) {
            if(ProximaRefacturacion == null || ProximaRefacturacion == undefined || ProximaRefacturacion == ""){
                connection.query(sql, [{
                    Aseguradora: Aseguradora, NumeroPoliza: NPoliza, Obra: Obra,
                    VigenciaPoliza: VigenciaPoliza, Riesgo: DescripcionRiesgo, Valor: ValorAPagar, MontoAsegurado: montoAsegurado,
                     NombreAsegurado: Asegurado, Endoso: Endoso,EndosoPagado:EndosoPagado,EnvioParaBajaAAlbacaucion:BajaSolicitada, Estado:EstadoPoliza, Descripcion: Descripcion,
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
                     NombreAsegurado: Asegurado, Endoso: Endoso,EndosoPagado:EndosoPagado,EnvioParaBajaAAlbacaucion:BajaSolicitada, Estado:EstadoPoliza, ProximaRefacturacion:ProximaRefacturacion
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
                EndosoPagado:EndosoPagado, Estado:EstadoPoliza, EnvioParaBajaAAlbacaucion:BajaSolicitada,
                
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
                ProximaRefacturacion:ProximaRefacturacion, EndosoPagado:EndosoPagado, Estado:EstadoPoliza,EnvioParaBajaAAlbacaucion:BajaSolicitada,
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
//Vehiculos
router.get('/Vehiculos',(req,res)=>{
var sql='SELECT * FROM vehiculos';
var vehiculos;
    connection.query(sql,(error,resultado)=>{
        vehiculos=resultado;
        sql= 'SELECT * FROM vehiculos_registrokms ORDER BY Fecha DESC';
        connection.query(sql,(error,results)=>{
            res.render('./paginas/AdministracionGeneral/Vehiculos.ejs',{registrokms:results, vehiculos, moment:moment})
        })
        })

    
})
router.get('/Vehiculos/datos/:datoBusqueda/:idregistro',(req,res)=>{
    var idregistro=req.params.idregistro;
    var datoBusqueda=req.params.datoBusqueda;
    var sql='SELECT * FROM '+datoBusqueda+' WHERE id_registro ='+idregistro;
    connection.query(sql,(error,resultado)=>{
        if(error)console.log(error);
        else{
            res.send(resultado);
    }
})
 })
router.get('/Vehiculos/AnalisisCombustible',(req,res)=>{
    var ListavehiculosDB;
    var registrokms;
    var registroActual=[];
    var fechaHoy= new Date();
    var cargasConCombustible=[];
    var AnalisisCombustible=[];
    var sql='SELECT * FROM vehiculos';
    new Promise((resolve, reject) => {
        connection.query(sql,(error,resultado)=>{
            ListavehiculosDB=resultado;
            // ListavehiculosDB.forEach(element => {
            //     vehiculosSemana.push(element.Patente);
            // });
            // for (let index = 0; index < vehiculosSemana.length; index++) {
            //   vehiculosSemana[index] = { Patente:vehiculosSemana[index]};
            // }
            sql= 'SELECT * FROM vehiculos_registrokms ORDER BY Kms DESC';
            connection.query(sql,(error,results)=>{
                if(error)reject();
                registrokms=results;
                resolve();
            })
            })
    }
    ).finally(function(){
            var kmsAcumulados=0;
            registrokms.forEach(registro=> {
var fechaRegistro = new Date(registro.Fecha);
var diferenciaFechas=Math.abs(fechaHoy-fechaRegistro); //Se realiza la resta entre el día de hoy, y la que indica el registro
diferenciaFechas= diferenciaFechas/(1000 * 3600 * 24); //Se pasa a días
if(diferenciaFechas<30){ //Compara con 7 días hacia atras, los registros mayores no serán tenidos en cuenta.
registroActual.push(registro); //De esta forma, quedan cargados solo los registros de los últimos 7 días.
}

});
registroActual.forEach((registro)=>{
    if(registro.LitrosCargadosEnTanque>0){
        cargasConCombustible.push(registro);
    }
}
)
ListavehiculosDB.forEach((vehiculo)=>{
    var fechaAnterior=undefined;
    var fechaActual=undefined;
    var kmsAnterior=undefined;
    var kmsActual=undefined;
var CombustibleCargadoAnterior;
var CombustibleCargadoActual;
cargasConCombustible.forEach((registroDeCargaCombustible)=>{
   if(vehiculo.Patente==registroDeCargaCombustible.Patente){
if(fechaAnterior==undefined){
    fechaAnterior=new Date(registroDeCargaCombustible.Fecha);
    kmsAnterior= registroDeCargaCombustible.Kms;
    CombustibleCargadoAnterior = registroDeCargaCombustible.LitrosCargadosEnTanque;
}
else{
    fechaActual=new Date(registroDeCargaCombustible.Fecha);
    kmsActual= registroDeCargaCombustible.Kms;
    var diferenciaKMS=kmsActual-kmsAnterior;
    var consumoCombustible=0;
if(diferenciaKMS<0){
    diferenciaKMS=kmsAnterior-kmsActual;
}
    CombustibleCargadoActual = registroDeCargaCombustible.LitrosCargadosEnTanque;
    var diferenciaFechas=Math.abs(fechaActual-fechaAnterior); //Se realiza la resta entre el día de hoy, y la que indica el registro
diferenciaFechas= diferenciaFechas/(1000 * 3600 * 24); //Se pasa a días
diferenciaFechas= parseInt(diferenciaFechas); 
if(consumoCombustible<=0){
    consumoCombustible=  CombustibleCargadoAnterior;

}else{
consumoCombustible=  consumoCombustible + CombustibleCargadoActual;

} 
var promedioConsumo= (100*consumoCombustible)/diferenciaKMS; //Fórmula para calcular el consumo estimado en 100 kms
// (diferenciaKMS/consumoCombustible);
promedioConsumo= Number(promedioConsumo.toFixed(2));
AnalisisCombustible.push({MarcaModelo:vehiculo.MarcaModelo,Patente:vehiculo.Patente, consumoCombustible,promedioConsumo, KmsRecorridos:diferenciaKMS, kmsAnterior,kmsActual,DiasTranscurridos:diferenciaFechas, Fecha:fechaActual})
fechaAnterior=fechaActual;
kmsAnterior=kmsActual;
CombustibleCargadoAnterior=CombustibleCargadoActual;}

}

  
})
})

    res.send(AnalisisCombustible);
})
         
        
    })
router.post('/Vehiculos/GuardarNuevoVehiculo',(req,res)=>{
var MarcaModelo=req.body.MarcaModelo;
var TipoVehiculo=req.body.TipoVehiculo;
var Kilometros=req.body.Kilometros;
var Patente=req.body.Patente;
var sql='INSERT INTO vehiculos SET?';
connection.query(sql,{Patente:Patente,MarcaModelo:MarcaModelo,Kms:Kilometros, Tipo:TipoVehiculo},(error,results)=>{
if(error){
    console.log(error);
    res.send('Hubo un error, no se pudo guardar el vehículo en el sistema.')
} 
else{
    sql='INSERT INTO vehiculos_registrokms SET?';
    var FechaHoy = new Date().toLocaleDateString('en-CA');
    FechaHoy = FechaHoy.replace('/','-');
    FechaHoy = FechaHoy.replace('/','-');
    connection.query(sql,{Patente:Patente,Kms:Kilometros,MarcaModelo:MarcaModelo, Fecha:FechaHoy},(error,results)=>{
        if(error){
            console.log(error);
    res.send('Error 2: No se pudo terminar de guardar el vehículo en el sistema.')
        }
        else{
            res.send('Vehículo cargado con exito en el sistema');

        }
    })
}
})
})
router.post('/Vehiculos/NuevoRegistro',(req,res)=>{
   
    var texto = req.body.Patente;
var partes = texto.split("|");

var Patente=partes[0];
Patente=Patente.trim();
var MarcaModelo = partes[1];
MarcaModelo = MarcaModelo.trim();
var Sobrenommbre;
var idVehiculo;
    var sql='SELECT idVehiculo FROM vehiculos WHERE Patente ="'+Patente+'" AND MarcaModelo ="'+MarcaModelo+'" ;';
var Kilometros=req.body.Kilometros;
var LitrosCargadosEnTanque=req.body.LitrosCargadosEnTanque;
var FechaIngreso= req.body.FechaIngreso;

    new Promise((resolve, reject) => {
        connection.query(sql,(error,results)=>{
            if(error)console.log(error);
            else{
                idVehiculo=results[0].idVehiculo;
                resolve();
            }
        }) 
    }).then(function(){
        sql= 'INSERT INTO vehiculos_registrokms SET?;';
        if(FechaIngreso.length>0){
         FechaIngreso = new Date(FechaIngreso).toLocaleDateString('en-CA');
        }
        else{
            FechaIngreso = new Date().toLocaleDateString('en-CA');
        }
        FechaIngreso = FechaIngreso.replace('/','-');
        FechaIngreso = FechaIngreso.replace('/','-');
        connection.query(sql,{Patente:Patente,idVehiculo:idVehiculo,Kms:Kilometros,MarcaModelo:MarcaModelo,LitrosCargadosEnTanque:LitrosCargadosEnTanque, Fecha:FechaIngreso},(error,results)=>{
            if(error){
                console.log(error);
        res.send('Error: No se pudo guardar el registro sistema.')
            }
            else{
                res.send('Registro cargado con exito en el sistema');
        
            }
        })
    });
  
})
router.post('/Vehiculos/EditarRegistroKms',(req,res)=>{
var idRegistro=req.body.idRegistro;
var RegistroKms=req.body.EditarRegistroKms;
var RegistroFecha=req.body.EditarRegistroFecha;
var RegistroLitrosCargados=req.body.EditarRegistroLitrosCargados;
var RegistroObservaciones=req.body.EditarRegistroObservaciones;
var sql='UPDATE vehiculos_registrokms set? WHERE id_registro ="'+idRegistro+'"';
connection.query(sql,{Kms:RegistroKms,Fecha:RegistroFecha,LitrosCargadosEnTanque:RegistroLitrosCargados,Observaciones:RegistroObservaciones},(error,result)=>{
    if(error){console.log(error);
    res.send('No se pudo actualizar los datos.')
    }
    else{
        res.send('Datos actualizados correctamente');
    }
})
})
//Combustible
router.get('/Combustible/datos',(req,res)=>{
    var sql = 'SELECT * FROM combustible';
    connection.query(sql,(error,results)=>{
        if(error)console.error(error);
        
else {
    res.send(results)};
    })
})
router.post('/Combustible/NuevoTicketCombustible',(req,res)=>{
    var Fecha=req.body.Fecha;
var TipoCombustible=req.body.TipoCombustible;
var PrecioLitro=req.body.PrecioLitro;
var CantidadLitros=req.body.CantidadLitros;
var Observaciones=req.body.Observaciones;
var sql='INSERT INTO combustible set?';
connection.query(sql,{Fecha:Fecha,TipoCombustible:TipoCombustible,PrecioLitro:PrecioLitro,CantidadLitros:CantidadLitros,Total:(CantidadLitros*PrecioLitro),Observaciones:Observaciones,},(error,results)=>{
if(error)console.log(error);
else{ res.send("Se ha realizado la carga con exito.")}
})
})
//Conductores
router.get('/Conductores/datos',(req,res)=>{
    var sql= 'SELECT * FROM conductores';
    connection.query(sql,(error,results)=>{
        if(error)console.log(error);
        else{
            res.send(results);
        }
    })
})