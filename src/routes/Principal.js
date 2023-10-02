const { render } = require('ejs');
const { Router } = require('express');
const cookieParser = require('cookie-parser')
const files = require('express-fileupload');
const session = require('express-session')
const passport = require('passport');
const PassportLocal = require('passport-local').Strategy;
const router = Router();
const fs = require('fs');
const path = require('path');
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
router.use(passport.session({
    secret: 'Mi ultra secreto',
    resave: true,
    saveUninitialized: true,
}
));

//Seteo server original
const mysql = require('mysql');
const { NULL } = require('mysql/lib/protocol/constants/types');
const { error } = require('console');
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Thinker95',
    database: 'joval'
});
//check de conexion a la base de datos
try {
    connection.connect(error => {
        while (error) {
            if (error) console.log(error);
            setTimeout(() => {
                connection.connect(error => {
                    if (error) console.log(error);
                    else { error = false; }
                })
            }, 3000);
        }
    })
} catch (error) {
    while (error) {
        connection.connect(error => {
            if (error) console.log(error);
            setTimeout(() => {
                connection.connect(error => {
                    if (error) console.log(error);
                    else { error = false; }
                })
            }, 3000);
        })
    }
}

passport.use(new PassportLocal(function (username, password, done) {
    let user = username;
    let pass = password;
    var sql = 'SELECT * FROM usuariosregistrados WHERE usuario = "' + user + '" AND password = "' + pass + '" ;';
    try {
        connection.query(sql, (error, results) => {
            if (error) {
                console.log(error);
                return done('Error de sistema, reintente más tarde', false);

            }
            if (results.length > 0) {
                return done(null, { id: results[0].id, rol: results[0].rol, username: results[0].usuario });
            }
            else {
                return done('No se ha encontrado el usuario y/o contraseña indicado', false);
            }
        });

    } catch (error) {
        return done('No se ha encontrado el usuario y/o contraseña indicado', false);
    }

    // done(null, false); // Esta linea define a traves del null, que no hubo ningun error, pero el al mismo tiempo, a traves del false, indica que el usuario no se ha encontrado.
    // Continuamos en serializacion

}));
passport.serializeUser(function (user, done) {

    done(null, user.id);
})
passport.deserializeUser(function (id, done) {
    var sql = 'Select rol from usuariosregistrados where id =' + id + ' ;';
    connection.query(sql, (error, results) => {
        done(null, { rol: results[0].rol });
    })
})
router.get('/', (req, res) => {

    res.render('login.ejs');
})

router.get('/index', (req, res, next) => {

    if (req.isAuthenticated()) {
        var fecha = new Date();
        var sql = 'Select * from admingeneral_seguros_albacaucion WHERE ProximaRefacturacion BETWEEN (NOW() - Interval 1 Month) AND (NOW() + Interval 2 Month)  AND Estado != "Dada de baja" AND Riesgo!= "Fondo de reparo" AND Riesgo!= "Mantenimiento de oferta"';
        connection.query(sql, (error, results) => {
            if (error) console.log(error);
            else {
                res.render('./paginas/Principal/index.ejs', { albacaucion: results, moment: moment, rol: req.user.rol, fecha });
            }
        })
    }
    else {
        (req, res) => {

            res.redirect('/');
        }
    }
})
router.post('/login', passport.authenticate('local', {
    successRedirect: "/index",
    failureRedirect: "/", failureMessage: true
}))
router.get('/nuevocontacto', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('paginas/Principal/nuevocontacto.ejs');
    } else { res.redirect('/'); }
})
router.get('/nuevaObra', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('paginas/Principal/nuevocliente.ejs');
    }
    else {
        res.redirect('/');
    }
})
router.get('/editarEmpleado', (req, res) => {
    var sql = 'Select * from usuariosregistrados ';
    connection.query(sql, (error, results) => {
        if (error) console.log(error);
        else { res.send(results); };
    })
})
router.post('/editarContacto/delete/Contacto/:id', (req, res) => {
    const id = req.params.id;
    var sql = 'Delete FROM contactos WHERE id =?';
    connection.query(sql, [id], (error, results) => {
        if (error) console.log(error);
        if (results.length > 0) {
            res.redirect('/contactos');
        }
        else {
            res.redirect('/contactos');
        }
    })
})
router.post('/guardarNuevoCliente', (req, res) => {
    var sql = "";
    var CarpetaProvisoria = req.body.CarpetaProvisoria;
    CarpetaProvisoria="N";
    const gasSeleccionado = req.body.GasSeleccionado;
    const finanzasSeleccionado = req.body.FinanzasSeleccionado;
    const fechaActual = new Date();
    const Nombre = req.body.NombreCarpeta;
    const NCarpeta = req.body.NCarpeta;
    const Comitente = req.body.Comitente;
    const Departamento = req.body.Departamento;
    const Codigo = req.body.Codigo;
    var DNV = req.body.DNV;
    var DPV = req.body.DPV;
    var IRRIGACION = req.body.IRRIGACION;
    var HIDRAULICA = req.body.HIDRAULICA;
    var FERROCARRIL = req.body.FERROCARRIL;
    var OTROSPERMISOS = req.body.OTROSPERMISOS;
    var TipoDeRed = req.body.TipoDeRed
    var PerMunicipal = req.body.PerMunicipal;
    var Privado = req.body.PRIVADO;
    var ServicioIncluido = req.body.ServicioIncluido
    var MontoServicio = req.body.ServicioDomiciliario;
    console.log("ATENCION: SE PROCEDE A GUARDAR NUEVO CLIENTE");
    console.log("DATOS DEL CLIENTE QUE SE GUARDA");
    console.log('NOMBRE:' + Nombre + ', NCarpeta:' + NCarpeta);
    //Variables de las promesas
    // const TipoRed =req.body.Tipos-de-red;
    if (DNV == null) { DNV = "NC"; }
    if (PerMunicipal == null) { PerMunicipal = "NC"; }
    if (Privado == null) { Privado = "NC"; }
    if (DPV == null) { DPV = "NC"; }
    if (IRRIGACION == null) { IRRIGACION = "NC"; }
    if (HIDRAULICA == null) { HIDRAULICA = "NC"; }
    if (FERROCARRIL == null) { FERROCARRIL = "NC"; }
    if (OTROSPERMISOS == null) { OTROSPERMISOS = "NC"; }
    if (DNV == "NC" && DPV == "NC" && HIDRAULICA == "NC" && FERROCARRIL == "NC") {
        var PermisosEspeciales = "NC"
        if (PerMunicipal == "NC") {
            var Permisos = "NC";
        } else {
            var Permisos = "Sin presentar";
        }
    }
    var idObra;
    function insertObra(){
        return new Promise((resolve, reject) => {
            sql = 'Insert into obras set ?';
            connection.query(sql, {
                Nombre: Nombre, NCarpeta: NCarpeta, Comitente: Comitente, Ubicacion: Departamento, nuevaObra: "S"
            }, (error, results) => {
                if (error) console.log(error);
                else {
                    console.log('Comienzo de carga de nueva obra.');
                    sql = 'SELECT MAX(id) as id FROM obras ';
                    connection.query(sql, (error, results2) => {
                        idObra = results2[0].id;
                        resolve(idObra);
                    })
                }
              
            })
        })
    }
    insertObra().then((idObra) => {
            sql = 'INSERT INTO adminecogas_tareas_por_carpeta set ?';
            connection.query(sql, {
                id_obra: idObra, Nombre: Nombre, NCarpeta: NCarpeta, TipoDeRed: TipoDeRed
            }, (error, results) => {
                if (error) console.log(error);
            })
            sql = 'INSERT INTO adgastareas set ?';
            connection.query(sql, {
                Nombre: Nombre
            }, (error, results) => {
                if (error) console.log(error);
            })
                if (CarpetaProvisoria == 'S') {
                    sql = 'INSERT INTO obras_tareasgenerales set ?';
                    connection.query(sql, {
                        idObra: idObra,
                        Nombre: Nombre, PermisosEspeciales: 'Sin presentar', Permisos: 'Sin presentar'
                    }, (error, results) => {
                        if (error) console.log(error);
                    })
                    sql = 'INSERT INTO codificacioncarpetas Set?';
                    connection.query(sql, [{
                        Nombre: Nombre, CodigoVigentes: idObra, CodigoEnUsoVigentes: "P",
                    },], (error, results) => {
                        if (error) console.log(error);

                    })
                }
                else {
                    sql = 'INSERT INTO obras_tareasgenerales set ?';
                    connection.query(sql, {
                        idObra: idObra,
                        Nombre: Nombre, PermisosEspeciales: PermisosEspeciales, Permisos: Permisos
                    }, (error, results) => {
                        if (error) console.log(error);
                    })
                    sql = 'INSERT INTO codificacioncarpetas Set?';
                    connection.query(sql, [{
                        Nombre: Nombre, CodigoVigentes: Codigo, CodigoEnUsoVigentes: "S",
                    },], (error, results) => {
                        if (error) console.log(error);
                    })
                    //La siguiente sentencia, elimina la carpeta de la BD donde el codigo de la carpeta se encuentre en "E" de "Eliminado". Tarea necesaria
                    // para que no figura el codigo como disponible.
                    sql = "DELETE from codificacioncarpetas WHERE CodigoEnUsoVigentes= 'E' and CodigoVigentes=?"
                    connection.query(sql, [Codigo], (error) => {
                        if (error) console.log(error);
                    })
                    //En caso de que el codigo no provenga de la carpeta eliminada, sino de una finalizada, se procede
                    //a dejar la carpeta finalizada sin "CodigoVigentes". 
                    //Esto es con motivo de que deje de figurar como que el codigo esta disponible.
                    sql = 'Update codificacioncarpetas set? where CodigoEnUsoVigentes="F" and CodigoVigentes=?';
                    connection.query(sql, [{
                        CodigoVigentes: null
                    }, Codigo], (error) => {
                        if (error) console.log(error);
                    })
                    sql = 'Insert into adminecogas_interferencias_y_permisos Set?';
                    connection.query(sql, [{
                        id_obra:idObra, Nombre: Nombre,
                        DNV: DNV, DPV: DPV, Irrigacion: IRRIGACION,
                        Hidraulica: HIDRAULICA, PerMunicipal: PerMunicipal, Ferrocarriles: FERROCARRIL, Privado: Privado, OtrosPermisos: OTROSPERMISOS
                    }], (error, results) => {
                        if (error) console.log(error);
                    })
                }
                sql = 'INSERT INTO historialdecambios set ?';
                connection.query(sql, {
                    id_obra: idObra, Nombre_sub: Nombre, Tarea_Realizada_sub: "Se crea nuevo cliente", Proxima_Tarea_sub: "Actualizar estado de carpeta", Si_NO_TareaRealizada: "N", Fecha_Tarea_sub: fechaActual
                }, (error, results) => {
                    if (error) console.log(error);
                })
                function cargarenFinanzas(){
                    return new Promise((resolve, reject) => {
                        const cantidadVecinos = req.body.cantidadVecinos;
                        const MontoContrato = req.body.MontoContrato;
                        const PrecioDeCuota = req.body.PrecioDeCuota;
                        const AnticipoFinanciero = req.body.AnticipoFinanciero;
                        const CantidadCuotas = req.body.CantidadCuotas;
                        var ArregloVecinos = [];
                        var NombreVecino = req.body.NombreVecino;
                        var DniVecino = req.body.DniVecino;
                        var TelefonoVecino = req.body.TelefonoVecino;
                        var CorreoVecino = req.body.CorreoVecino;
                        var LoteVecino = req.body.LoteVecino;
                        if (cantidadVecinos > 1 || cantidadVecinos != null || cantidadVecinos != undefined) {
                            for (let index = 0; index < cantidadVecinos; index++) {
                                sql = 'Insert into finanzas_clientes_por_obra set?';
                                var NombreVecino = req.body.NombreVecino;
                                connection.query(sql, {
                                    id_Obra: idObra, NombreObra: Nombre, NombreCliente: NombreVecino[index], DniCliente: DniVecino[index], LocacionObra: Departamento, Telefono: TelefonoVecino[index], Correo: CorreoVecino[index], Direccion: LoteVecino[index],
                                }, (error, results) => {
                                    if (error) console.log(error);
                                    else {
                                        sql = 'Select id_cliente from finanzas_clientes_por_obra where NombreCliente =? and id_Obra =?';
                                        connection.query(sql, [NombreVecino[index], idObra], (error, results) => {
                                            if (error) console.log(error);
                                            else {
                                                var id_cliente = results[0].id_cliente;
                                                sql = 'Insert into finanzas_clientes_predeterminados set?';
                                                connection.query(sql, {
                                                    id_obra: idObra, id_cliente: id_cliente,CantidadCuotas:CantidadCuotas, NombreCliente: NombreVecino[index], AnticipoFinanciero: AnticipoFinanciero
                                                }, (error, results) => {
                                                    if (error) console.log(error);
                                                    for (let j = 1; j < CantidadCuotas; j++) {
                                                        var cuota = "Cuota" + j;
                                                        sql = 'UPDATE finanzas_clientes_predeterminados SET ' + cuota + ' = ' + PrecioDeCuota + ' WHERE id_cliente=?';
                                                        connection.query(sql, id_cliente, (error, results) => {
                                                            if (error) console.log(error.sqlMessage);
                                                        })
                                                    }
                                                })
                                                sql = 'INSERT into finanzas_clientes_por_obra_cobros set?';
                                                connection.query(sql, {
                                                    id_obra: idObra, ID_cliente: id_cliente, NombreCliente: NombreVecino[index], ServicioIncluidoCuotas: ServicioIncluido[index],
                                                }, (error, results) => {
                                                    if (error) console.log(error);
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                            resolve();
                        }
                        else {
                            sql = 'Insert into finanzas_clientes_por_obra set?';
                            var NombreVecino = req.body.NombreVecino;
                            connection.query(sql, {
                                id_Obra: idObra, NombreObra: Nombre, NombreCliente: NombreVecino, DniCliente: DniVecino, LocacionObra: Departamento, Telefono: TelefonoVecino, Correo: CorreoVecino, Direccion: LoteVecino,
                            }, (error, results) => {
                                if (error) console.log(error);
                                resolve();
                            }
                            )
                        }
                    })
                }
                cargarenFinanzas().then(function () {

                    res.redirect('/editarTareas/' + idObra);

                })


            
        

    })



}
)
router.post('/guardarNuevoContacto', (req, res) => {
    const Nombre = req.body.Nombre;
    const Entidad = req.body.Entidad;
    const Area = req.body.Area;
    const Puesto = req.body.Puesto;
    const Telefono = req.body.Telefono;
    const Correo = req.body.Correo;
    var sql = 'Insert into contactos set ?';
    connection.query(sql, {
        Nombre: Nombre, Entidad: Entidad, Area: Area, Puesto: Puesto, Telefono: Telefono, Correo: Correo
    }, (error, results) => {
        if (error) console.log(error);
    })
    res.redirect('/contactos');
})
router.post('/NuevaComunicacionSistema', (req, res) => {
    var Descripcion = req.body.Descripcion;
    var Responsable = req.body.Responsable;
    var Terminada = "N";
    var sql = 'Insert into comunicacionsistema Set ?';
    connection.query(sql, [{
        Descripcion: Descripcion, Responsable: Responsable, Terminada: Terminada
    }], (error, results) => {
        if (error) console.log(error);
    })
    res.redirect(req.get('referer'));
})
router.get('/contactos', (req, res) => {
    if (req.isAuthenticated()) {
        res.locals.moment = moment;
        const sql = 'SELECT * FROM contactos';
        connection.query(sql, (error, results) => {
            if (error) console.log(error);

            if (results.length > 0) {
                res.render('paginas/Principal/contactos.ejs', { results: results }); //en {results:results} lo que hago es guardar los resultados que envia la bd, en la variable results
                // res.send(results);
            }
            else {
                res.render('paginas/Principal/nuevocontacto.ejs');
            }
        })
    } else { res.redirect('/'); }
})
router.get('/data/Empleados',(req,res)=>{
    if (req.isAuthenticated()){
var sql= 'SELECT Nombre,id FROM usuariosregistrados';
connection.query(sql,(error,results)=>{
    if (error)console.log(error);
    else{
        res.send(results);
    }
})
    } else{
        res.redirect('/');
    }
})
router.get('/Principal/historialtareas',(req,res)=>{
    res.render('./paginas/Principal/historialtareas.ejs');
})
router.post('/Principal/obtenerHistorialTareasEmpleados',(req,res)=>{
    fechaInicio=new Date(req.body.fechaInicio);
    fechaInicio= fechaInicio.toLocaleDateString('en-US',{ year: 'numeric', month: '2-digit', day: '2-digit' });
    fechaFinal=new Date(req.body.fechaFinal);
    fechaFinal= fechaFinal.toLocaleDateString('en-US',{ year: 'numeric', month: '2-digit', day: '2-digit' });

    var sql='SELECT * FROM historialdecambios WHERE Fecha_Tarea_sub BETWEEN "'+req.body.fechaInicio+'" AND "'+req.body.fechaFinal+'";';
    connection.query(sql,(error,results)=>{
        console.log(sql);
        if(error) console.log(error);
        else{
            res.send(results);
        }
    })
})
//Logo
router.get('/logo', (req, res) => {
    res.sendFile('logo.png', { root: 'src/public/images' });
})
router.post('/NuevoEmpleado', (req, res) => {
    var sql = 'INSERT INTO usuariosregistrados set?';
    connection.query(sql, { Nombre: req.body.Nombre, usuario: req.body.Usuario, password: req.body.Contraseña, rol: req.body.rol }, (error, results) => {
        if (error) console.log(error);
        else {
            res.redirect('/index');
        }
    })
})

router.post('/editarEmpleado', (req, res) => {
    var sql = 'UPDATE usuariosregistrados set? WHERE id =?';
    connection.query(sql, [{
        Nombre: req.body.Nombre, usuario: req.body.Usuario, password: req.body.Contraseña, rol: req.body.rol
    }, req.body.id], (error, results) => {
        if (error) console.log(error);
        else {
            res.redirect('/index');
        }
    })
})
router.post('/eliminarEmpleado/:id', (req, res) => {
    var id = req.params.id;
    var sql = 'DELETE from usuariosregistrados WHERE ID=?';
    connection.query(sql, id, (error, results) => {
        if (error) console.log(error);
        else {
            res.send("Empleado eliminado");
        }
    })
})
//Manejo de archivos en servidor
function CrearCarpetaEcogas(NombreObra, nPDT, CodigoVigente) {
    if (NombreObra) {
        const ubicacion = 'Archivos/1 Administracion Ecogas/02. Carpetas Vigentes/' + CodigoVigente + '-' + nPDT + '-' + NombreObra + ''
        fs.mkdirSync(ubicacion, { recursive: true });
    }


}