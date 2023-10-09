const { render } = require('ejs');
const { Router } = require('express');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport');
const react = require('react');
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
router.get('/Galpon',(req,res)=>{
    res.render('./paginas/Galpon/Galpon.ejs');
})
//Vehiculos
router.get('/Vehiculos', (req, res) => {
    if (req.isAuthenticated()) {
        var sql = 'SELECT * FROM vehiculos';
        var vehiculos;
        var conductores;

        connection.query(sql, (error, resultado) => {
            vehiculos = resultado;
            sql = 'SELECT * FROM conductores';
            connection.query(sql, (error, result) => {
                console.log(error);
                conductores = result;
            })
            sql = 'SELECT * FROM vehiculos_registrokms ORDER BY Fecha DESC';
            connection.query(sql, (error, results) => {
                res.render('./paginas/Galpon/Vehiculos.ejs', { registrokms: results, vehiculos, conductores, moment: moment })
            })
        })

    }
    else {
        res.redirect('/');
    }
})
router.post('/Vehiculos/registrokmsyhoras/:FechaInicio/:FechaFinal', (req, res) => {
    if (req.isAuthenticated()) {
        var sql = 'SELECT * FROM vehiculos';
        var vehiculos;
        var conductores;
        connection.query(sql, (error, resultado) => {
            vehiculos = resultado;
            sql = 'SELECT * FROM conductores';
            connection.query(sql, (error, result) => {
                console.log(error);
                conductores = result;
            })
            sql = "SELECT * FROM vehiculos_registrokms WHERE Fecha BETWEEN CAST('"+req.params.FechaInicio+"' AS DATE) AND CAST('"+req.params.FechaFinal+"' AS DATE) ORDER BY Fecha DESC ;";
            connection.query(sql, (error, results) => {
                res.send({registrokms: results}, vehiculos, conductores)
            })
        })

    }else {
        res.redirect('/');
    }
})
router.get('/Vehiculos/datos/:datoBusqueda/:idregistro', (req, res) => {
    var idregistro = req.params.idregistro;
    var datoBusqueda = req.params.datoBusqueda;
    var sql = 'SELECT * FROM ' + datoBusqueda + ' WHERE id_registro =' + idregistro;
    connection.query(sql, (error, resultado) => {
        if (error) console.log(error);
        else {
            res.send(resultado);
        }
    })
})
router.get('/Vehiculos/AnalisisCombustible/:FechaInicio/:FechaFinal', (req, res) => {
    var ListavehiculosDB;
    var registrokms;
    var FechaInicio=req.params.FechaInicio
var FechaFinal=req.params.FechaFinal
    var registroActual = [];
    var fechaHoy = new Date();
    var cargasConCombustible = [];
    var AnalisisCombustible = [];
    var sql = 'SELECT * FROM vehiculos';
    new Promise((resolve, reject) => {
        connection.query(sql, (error, resultado) => {
            ListavehiculosDB = resultado;
            // ListavehiculosDB.forEach(element => {
            //     vehiculosSemana.push(element.Patente);
            // });
            // for (let index = 0; index < vehiculosSemana.length; index++) {
            //   vehiculosSemana[index] = { Patente:vehiculosSemana[index]};
            // }
            sql = 'SELECT * FROM vehiculos_registrokms WHERE Fecha BETWEEN CAST("'+FechaInicio+'" AS DATE) AND CAST("'+FechaFinal+'" AS DATE) ORDER BY Kms DESC';
            connection.query(sql, (error, results) => {
                if (error){ reject();
                }
                else{
                registrokms = results;
                for (let index = 0; index < registrokms.length; index++) {
                    const registrokm = registrokms[index];
                    ListavehiculosDB.forEach(vehiculos => {
                        if (registrokm.idVehiculo == vehiculos.idVehiculo) {
                            registrokms[index].Tipo = vehiculos.Tipo;
                        }
                    });
                }
                resolve();
            }
            })
        })
    }
    ).then(function () {
        var kmsAcumulados = 0;
        registrokms.forEach(registro => {

            var fechaRegistro = new Date(registro.Fecha);
            var diferenciaFechas = Math.abs(fechaHoy - fechaRegistro); //Se realiza la resta entre el día de hoy, y la que indica el registro
            diferenciaFechas = diferenciaFechas / (1000 * 3600 * 24); //Se pasa a días
            if (diferenciaFechas < 30) { //Compara con 7 días hacia atras, los registros mayores no serán tenidos en cuenta.
                registroActual.push(registro); //De esta forma, quedan cargados solo los registros de los últimos 7 días.
            }

        });
        registroActual.forEach((registro) => {
            if (registro.LitrosCargadosEnTanque > 0 && (registro.LitrosCargadosEnTanque != undefined || registro.LitrosCargadosEnTanque != null)) {
                cargasConCombustible.push(registro);
            }
        }
        )
        ListavehiculosDB.forEach((vehiculo) => {
            var fechaAnterior = undefined;
            var fechaActual = undefined;
            var kmsAnterior = undefined;
            var kmsActual = undefined;
            var horasAnterior = undefined;
            var horasActual = undefined;
            var CombustibleCargadoAnterior;
            var CombustibleCargadoActual;
            cargasConCombustible.forEach((registroDeCargaCombustible) => {
                if (vehiculo.Patente == registroDeCargaCombustible.Patente) {
                        if (fechaAnterior == undefined) {
                            fechaAnterior = new Date(registroDeCargaCombustible.Fecha);
                            kmsAnterior = registroDeCargaCombustible.Kms;
                            CombustibleCargadoAnterior = registroDeCargaCombustible.LitrosCargadosEnTanque;
                        }
                        else {
                            fechaActual = new Date(registroDeCargaCombustible.Fecha);
                            kmsActual = registroDeCargaCombustible.Kms;
                            var diferenciaKMS = kmsActual - kmsAnterior;
                            var consumoCombustible = 0;
                            if (diferenciaKMS < 0) {//Trozo de codigo realizado, por las dudas de que haya que invertir la cuenta.
                                diferenciaKMS = kmsAnterior - kmsActual;
                            }
                            CombustibleCargadoActual = registroDeCargaCombustible.LitrosCargadosEnTanque;
                            var diferenciaFechas = Math.abs(fechaActual - fechaAnterior); //Se realiza la resta entre el día de hoy, y la que indica el registro
                            diferenciaFechas = diferenciaFechas / (1000 * 3600 * 24); //Se pasa a días
                            diferenciaFechas = parseInt(diferenciaFechas);
                            if (consumoCombustible <= 0) {
                                consumoCombustible = CombustibleCargadoAnterior;
                            } else {
                                consumoCombustible = consumoCombustible + CombustibleCargadoActual;
                            }
                            if(vehiculo.Tipo=="Maquina"){
                                var promedioConsumo = consumoCombustible / diferenciaKMS;
                            }
                            else{
                                var promedioConsumo = (100 * consumoCombustible) / diferenciaKMS; //Fórmula para calcular el consumo estimado en camioneta
                            }
                            
                            // (diferenciaKMS/consumoCombustible);
                            promedioConsumo = Number(promedioConsumo.toFixed(2));
                            AnalisisCombustible.push({ MarcaModelo: vehiculo.MarcaModelo, Patente: vehiculo.Patente, consumoCombustible, promedioConsumo, KmsRecorridos: diferenciaKMS, kmsAnterior, kmsActual, DiasTranscurridos: diferenciaFechas, Fecha: fechaActual, Tipo: vehiculo.Tipo })
                            fechaAnterior = fechaActual;
                            kmsAnterior = kmsActual;
                            CombustibleCargadoAnterior = CombustibleCargadoActual;
                        }
                    

                }
            })

        })

        res.send(AnalisisCombustible);
    }).catch(()=>{
    res.send('Algo Falló');
})

})
router.post('/Vehiculos/GuardarNuevoVehiculo', (req, res) => {
    var MarcaModelo = req.body.MarcaModelo;
    var TipoVehiculo = req.body.TipoVehiculo;
    var Kilometros = req.body.Kilometros;
    var Patente = req.body.Patente;
    var sql = 'INSERT INTO vehiculos SET?';
    connection.query(sql, { Patente: Patente, MarcaModelo: MarcaModelo, Kms: Kilometros, Tipo: TipoVehiculo }, (error, results) => {
        if (error) {
            console.log(error);
            res.send('Hubo un error, no se pudo guardar el vehículo en el sistema.')
        }
        else {
            sql = 'INSERT INTO vehiculos_registrokms SET?';
            var FechaHoy = new Date().toLocaleDateString('en-CA');
            FechaHoy = FechaHoy.replace('/', '-');
            FechaHoy = FechaHoy.replace('/', '-');
            connection.query(sql, { Patente: Patente, Kms: Kilometros, MarcaModelo: MarcaModelo, Fecha: FechaHoy }, (error, results) => {
                if (error) {
                    console.log(error);
                    res.send('Error 2: No se pudo terminar de guardar el vehículo en el sistema.')
                }
                else {
                    res.send('Vehículo cargado con exito en el sistema');

                }
            })
        }
    })
})
router.post('/Vehiculos/NuevoRegistro', (req, res) => {

    var texto = req.body.Patente;
    var partes = texto.split("|");
    var conductores = req.body.Conductor;
    var Patente = partes[0];
    Patente = Patente.trim();
    var MarcaModelo = partes[1];
    MarcaModelo = MarcaModelo.trim();
    var Sobrenommbre;
    var idVehiculo;
    var sql = 'SELECT idVehiculo FROM vehiculos WHERE Patente ="' + Patente + '" AND MarcaModelo ="' + MarcaModelo + '" ;';
    var Kilometros = Math.trunc(Number(req.body.Kilometros)); //Se debe de redondear los numeros ingresados por el usuario, debido a que la base de datos trabaja con enteros.
    var LitrosCargadosEnTanque = Math.trunc(Number(req.body.LitrosCargadosEnTanque));//Se debe de redondear los numeros ingresados por el usuario, debido a que la base de datos trabaja con enteros.
    var FechaIngreso = req.body.FechaIngreso;

    new Promise((resolve, reject) => {
        connection.query(sql, (error, results) => {
            if (error) console.log(error);
            else {
                idVehiculo = results[0].idVehiculo;
                resolve();
            }
        })
    }).then(function () {
        sql = 'INSERT INTO vehiculos_registrokms SET?;';
        if (FechaIngreso.length > 0) {
            FechaIngreso = new Date(FechaIngreso).toLocaleDateString('en-CA');
        }
        else {
            FechaIngreso = new Date().toLocaleDateString('en-CA');
        }
        FechaIngreso = FechaIngreso.replace('/', '-');
        FechaIngreso = FechaIngreso.replace('/', '-');
        connection.query(sql, { Patente: Patente, Conductor: conductores, idVehiculo: idVehiculo, Kms: Kilometros, MarcaModelo: MarcaModelo, LitrosCargadosEnTanque: LitrosCargadosEnTanque, Fecha: FechaIngreso }, (error, results) => {
            if (error) {
                console.log(error);
                res.send('Error: No se pudo guardar el registro sistema.')
            }
            else {
                res.send('Registro cargado con exito en el sistema');

            }
        })
    });

})
router.post('/Vehiculos/EditarRegistroKms', (req, res) => {
    var idRegistro = req.body.idRegistro;
    var RegistroKms = req.body.EditarRegistroKms;
    var RegistroFecha = req.body.EditarRegistroFecha;
    var RegistroLitrosCargados = req.body.EditarRegistroLitrosCargados;
    var RegistroObservaciones = req.body.EditarRegistroObservaciones;
    var sql = 'UPDATE vehiculos_registrokms set? WHERE id_registro ="' + idRegistro + '"';
    connection.query(sql, { Kms: RegistroKms, Fecha: RegistroFecha, LitrosCargadosEnTanque: RegistroLitrosCargados, Observaciones: RegistroObservaciones }, (error, result) => {
        if (error) {
            console.log(error);
            res.send('No se pudo actualizar los datos.')
        }
        else {
            res.send('Datos actualizados correctamente');
        }
    })
})
router.post('/Vehiculos/registrokms/eliminarRegistro/:idregistro',(req,res)=>{
    var idRegistro= req.params.idregistro;
    var sql= 'DELETE FROM vehiculos_registrokms WHERE id_registro =?';
connection.query(sql,idRegistro,(error,results)=>{
    if(error){console.log(error);
        res.send('Ha ocurrido un error, no se elimino el registro.');
    }
    else{
res.send('El registro ha sido eliminado.');
    }
})
})
//Combustible
router.get('/Combustible/datos', (req, res) => {
    var sql = 'SELECT * FROM combustible';
    connection.query(sql, (error, results) => {
        if (error) console.error(error);

        else {
            res.send(results)
        };
    })
})
router.post('/Combustible/NuevoTicketCombustible', (req, res) => {
    var Fecha = req.body.Fecha;
    var TipoCombustible = req.body.TipoCombustible;
    var PrecioLitro = req.body.PrecioLitro;
    var CantidadLitros = req.body.CantidadLitros;
    var Observaciones = req.body.Observaciones;
    var sql = 'INSERT INTO combustible set?';
    connection.query(sql, { Fecha: Fecha, TipoCombustible: TipoCombustible, PrecioLitro: PrecioLitro, CantidadLitros: CantidadLitros, Total: (CantidadLitros * PrecioLitro), Observaciones: Observaciones, }, (error, results) => {
        if (error) console.log(error);
        else { res.send("Se ha realizado la carga con exito.") }
    })
})
//Conductores
router.get('/Conductores/datos', (req, res) => {
    var sql = 'SELECT * FROM conductores';
    connection.query(sql, (error, results) => {
        if (error) console.log(error);
        else {
            res.send(results);
        }
    })
})