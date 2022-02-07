const { render } = require('ejs');
const { Router } = require('express');
const router = Router();
const moment = require('moment');
module.exports = router;
//Seteo server original
const mysql = require('mysql');
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
//Fin de seteo de server original
//Rutas Get
router.get('/', (req, res) => {
    res.render('index.ejs');
})
router.get('/interferencias', (req, res) => {
    const sql = 'SELECT c.id, c.Nombre, c.NCarpeta, c.intTelefonica, c.intAgua, c.intCloaca, c.intClaro, c.intElectricidad, c.intClaro, c.intArnet, c.intArsat, c.intTelecom FROM clientes c';
    res.locals.moment = moment;
    connection.query(sql, (error, results) => {
        if (error) console.log(error);
        if (results.length > 0) {
            res.render('paginas/AdministracionEcogas/interferencias.ejs', { results: results });
        }
        else {
            res.send('Ningun resultado encontrado');
        }
    })

})
router.get('/interferencias/info', (req, res) => {
    const sql = 'SELECT c.id, c.Nombre, c.NCarpeta, c.intTelefonica, c.intAgua, c.intCloaca, c.intClaro, c.intElectricidad, c.intClaro, c.intArnet,c.intArsat, c.intTelecom FROM clientes c';
    res.locals.moment = moment;
    connection.query(sql, (error, results) => {
        if (error) console.log( error);

        if (results.length > 0) {
            res.send(results); //en {results:results} lo que hago es guardar los resultados que envia la bd, en la variable results

        }
        else {
            res.send('Ningun resultado encontrado');
        }
    })
})
router.get('/adminecogas', (req, res) => {
    const sql = 'SELECT c.id, c.Nombre, c.NCarpeta, c.TareaRealizada, c.ProximaTarea, c.FechaLimite FROM clientes c  ';
    res.locals.moment = moment;
    connection.query(sql, (error, results) => {
        if (error) console.log( error);

        if (results.length > 0) {
            res.render('paginas/AdministracionEcogas/adminecogas.ejs', { results: results }); //en {results:results} lo que hago es guardar los resultados que envia la bd, en la variable results

        }
        else {
            res.send('Ningun resultado encontrado');
        }
    })

})
router.get('/adminecogas/info', (req, res) => {
    const sql = 'SELECT c.id, c.Nombre, c.NCarpeta, c.TareaRealizada, c.ProximaTarea, c.FechaLimite, c.Estado FROM clientes c';
    res.locals.moment = moment;
    connection.query(sql, (error, results) => {
        if (error) console.log( error);

        if (results.length > 0) {
            res.send(results); //en {results:results} lo que hago es guardar los resultados que envia la bd, en la variable results

        }
        else {
            res.send('Ningun resultado encontrado');
        }
    })

})
router.get('/estadogeneral', (req, res) => {
    res.locals.moment = moment;
    // const sql = 'SELECT c.id, c.Nombre  ,c.NCarpeta,  c.Ubicacion ,c.Comitente ,c.Estado, c.Fechafirmacontrato  ,b.DocumentacionTerreno ,b.DocumentacionSociedad ,b.DocumentacionContractual  ,b.Comercial ,b.Tecnica ,b.PermisosEspeciales ,b.DocumentacionObra  ,b.Seguridad,b.Interferencias, b.Permisos, b.PlanDeTrabajo, b.Matriculas, b.Ambiente, b.NotaCumplimentoNormativas, b.DDJJNAG153, b.Avisos, b.DocumentacionInspeccion, b.ComunicacionObras, b.ActasFinalesEcogas, b.PlanosyCroquis, b.ConformeEntidades, b.PruebaHermeticidad, b.InformesFinales, b.PresentacionFinal, b.HabilitacionObra  from clientes_tareasgenerales b ,clientes c';
    // const sql = 'SELECT c.id, c.Nombre  ,c.NCarpeta,  c.Ubicacion ,c.Comitente ,c.Estado, c.Fechafirmacontrato ,b.DocumentacionTerreno, b.DocumentacionSociedad,b.DocumentacionContractual  ,b.Comercial ,b.Tecnica,b.PermisosEspeciales ,b.DocumentacionObra  ,b.Seguridad,b.Interferencias, b.Permisos, b.PlanDeTrabajo, b.Matriculas, b.Ambiente, b.NotaCumplimentoNormativas, b.DDJJNAG153, b.Avisos, b.DocumentacionInspeccion, b.ComunicacionObras, b.ActasFinalesEcogas, b.PlanosyCroquis, b.ConformeEntidades, b.PruebaHermeticidad, b.InformesFinales,b.PresentacionFinal, b.HabilitacionObra  from clientes c, clientes_tareasgenerales b  ';
    // const sql='Select * from clientes c';
    const sql='Select * from clientes_tareasgenerales b';

    connection.query(sql, (error, results) => {
        if (error) console.log( error);
        if (results.length > 0) {
            res.render('paginas/AdministracionEcogas/estadogeneral.ejs', { results: results }); //en {results:results} lo que hago es guardar los resultados que envia la bd, en la variable results
            // res.send(results);
        }
        else {
            res.send('Ningun resultado encontrado');


        }
    })

})
router.get('/nuevocliente', (req, res) => {
    res.render('paginas/AdministracionEcogas/nuevocliente.ejs');
})

router.get('/contactos', (req, res) => {
    res.locals.moment = moment;
    const sql = 'SELECT * FROM contactos';
    connection.query(sql, (error, results) => {
        if (error) console.log( error);

        if (results.length > 0) {
            res.render('paginas/AdministracionEcogas/contactos.ejs', { results: results }); //en {results:results} lo que hago es guardar los resultados que envia la bd, en la variable results
            // res.send(results);
        }
        else {
            res.send('Ningun resultado encontrado');


        }
    })

})
router.get('/editarContacto/:id', (req, res) => {
    res.locals.moment = moment;
    const id = req.params.id;
    console.log("id es:" + id);
    const sql = 'SELECT * FROM contactos where id =?';
    connection.query(sql, [id], (error, results) => {
        if (error) console.log( error);
        if (results.length > 0) {
            res.render('paginas/AdministracionEcogas/editarContacto', { user: results[0] });
        }
        else {
            res.render('/adminecogas');

        }
    })

})

router.get('/editarTareas/:id', (req, res) => {
    res.locals.moment = moment;
    const id = req.params.id;
    const sql = 'Select * from clientes where id=?';
    connection.query(sql, [id], (error, results) => {
        if (error) console.log( error);
        if (results.length > 0) {
            res.render('paginas/AdministracionEcogas/editarTareas', { user: results[0] });
        }
        else {
            res.redirect('/adminecogas');

        }
    })
})
router.get('/edit/:id', (req, res) => {
    res.locals.moment = moment;
    const id = req.params.id;
    const sql = 'Select * from clientes where id=?';
    connection.query(sql, [id], (error, results) => {
        if (error) console.log( error);
        if (results.length > 0) {

            res.render('paginas/AdministracionEcogas/edit', { user: results[0] });
        }
        else {

            res.render('/adminecogas');

        }
    })
})
router.get('/historialcarpeta/:Nombre', (req, res) => {
    const id = req.params.id;
    const Nombre = req.params.Nombre;
    const sql = 'SELECT c.* FROM historialdecambios c WHERE Nombre_sub =?';
    res.locals.moment = moment;
    connection.query(sql, [Nombre], (error, results) => {
        if (error) console.log( error);
        if (results.length > 0) {
            res.render('paginas/AdministracionEcogas/historialcarpeta.ejs', { results: results, id:id }); //en {results:results} lo que hago es guardar los resultados que envia la bd, en la variable results

        }
        else {
            res.render('paginas/AdministracionEcogas/historialcarpeta.ejs', { results: results, id: id });
        }
    })

})
router.get('/nuevocontacto', (req, res) => {
    res.render('paginas/AdministracionEcogas/nuevocontacto.ejs');
})



//Rutas Post
router.post('/actualizarcontacto/:id', (req, res) => {
    const id = req.body.id;
    const Nombre = req.body.Nombre;
    const entidad = req.body.Entidad;
    const area = req.body.Area;
    const Puesto = req.body.Puesto;
    const Telefono = req.body.Telefono;
    const Correo = req.body.Correo;
    const sql = 'Update contactos Set ? where id =?';
    connection.query(sql, [{
        Nombre: Nombre, Entidad: entidad, Area: area, Puesto: Puesto, Telefono: Telefono, Correo: Correo
    }, id]
        , (error, results) => {
            if (error) console.log( error);

            if (results.length > 0) {
                res.redirect('paginas/AdministracionEcogas/contactos');
            }
            else {
                res.redirect('paginas/AdministracionEcogas/adminecogas');

            }

        })
})
router.post('/update/:id', (req, res) => {
    res.locals.moment = moment;
    const id = req.body.id;
    const NombreCarpeta = req.body.NombreCarpeta;
    const NCarpeta = req.body.NCarpeta
    const Comitente = req.body.Comitente;
    const Departamento = req.body.Ubicacion;
    const DNV = req.body.DNV;
    const DPV = req.body.DPV;
    const IRRIGACION = req.body.IRRIGACION;
    const HIDRAULICA = req.body.HIDRAULICA;
    const FERROCARRIL = req.body.FERROCARRIL;
    const OTROSPERMISOS = req.body.OTROSPERMISOS;
    const Privado = req.body.PRIVADO;
    var PerMunicipal = req.body.PerMunicipal;

    const TipoDeRed = req.body.TipoDeRed;
    console.log("Intentando actualizar el contacto:" + NombreCarpeta);
    
    //const TareaRealizada =req.body.TareaRealizada;
    //const ProximaTarea = req.body.ProximaTarea;
    const Fecha_limite = req.body.Fecha_limite;
    if (Fecha_limite) {
        console.log('fecha limite a actualizar es: ' + Fecha_limite);
        console.log('fecha limite a actualizar es: ' + req.body.Fecha_limite);
        //console.log(Tarea_Realizada: TareaRealizada, ProximaTarea: ProximaTarea);
        var sql = 'Update clientes Set ? where id =?';
        connection.query(sql, [{
            Nombre: NombreCarpeta, NCarpeta: NCarpeta, Comitente: Comitente, Ubicacion: Departamento, DNV: DNV, DPV: DPV, Irrigacion: IRRIGACION,
            Hidraulica: HIDRAULICA, Privado: PRIVADO, Ferrocarriles: FERROCARRIL, TipoDeRed: TipoDeRed, Fecha_limite: Fecha_limite, PerMunicipal:PerMunicipal
        }, id]
            , (error, results) => {
                if (error) console.log( error);

                if (results.length > 0) {
                    res.redirect(req.get('referer'));
                }
                else {
                    res.redirect(req.get('referer'));

                }

            })
    }
    else {
        if (NombreCarpeta != null) {
            const sql = 'Update clientes Set ? where id =?';
            connection.query(sql, [{
                Nombre: NombreCarpeta, NCarpeta: NCarpeta, Comitente: Comitente, Ubicacion: Departamento, DNV: DNV, DPV: DPV, Irrigacion: IRRIGACION,
                Hidraulica: HIDRAULICA, Ferrocarriles: FERROCARRIL, TipoDeRed: TipoDeRed
            }, id]
                , (error, results) => {
                    if (error) console.log( error);

                    if (results.length > 0) {
                        res.redirect(req.get('referer'));
                    }
                    else {
                        res.redirect(req.get('referer'));

                    }

                })

        }
        else {
            const sql = 'Update clientes Set ? where id =?';
            connection.query(sql, [{
                NCarpeta: NCarpeta, Comitente: Comitente, Ubicacion: Departamento, DNV: DNV, DPV: DPV, Irrigacion: IRRIGACION,
                Hidraulica: HIDRAULICA, Ferrocarriles: FERROCARRIL, TipoDeRed: TipoDeRed,PerMunicipal:PerMunicipal
            }, id]
                , (error, results) => {
                    if (error) console.log( error);

                    if (results.length > 0) {
                        res.redirect(req.get('referer'));
                    }
                    else {
                        res.redirect(req.get('referer'));;

                    }

                })
        }
    }
}
)
router.post('/ActualizarProximasTareas/:id', (req, res) => {
    res.locals.moment = moment;
    let fecha = new Date();
    const Nombre = req.body.Nombre;
    const id = req.body.id;
    const TareaRealizada = req.body.TareaRealizada;
    const ProximaTarea = req.body.ProximaTarea;
    const Fecha_limite = req.body.Fecha_limite;
    const EstadoCarpeta = req.body.Estado;
    const Fecha_Tarea_sub = fecha;
    var EtapaTarea = req.body.EtapaTarea;
    var sql = "";
    if (EtapaTarea == "") {

    }

    console.log("Etapa tarea contiene:" + EtapaTarea);

    if (Fecha_limite) {
        sql = 'Update  clientes set ? where id=?';
        connection.query(sql, [{ Estado: EstadoCarpeta, EtapaTarea: EtapaTarea, TareaRealizada: TareaRealizada, ProximaTarea: ProximaTarea, Fechalimite: Fecha_limite }, id], (error, results) => {
            if (error) console.log( error);
            console.log("se cargo el estado en tabla clientes");

        })

        sql = 'Insert into historialdecambios set?';
        connection.query(sql, [{ EtapaTarea_sub: EtapaTarea, Nombre_sub: Nombre, Tarea_Realizada_sub: TareaRealizada, Proxima_Tarea_sub: ProximaTarea, Fecha_Proxima_Tarea_sub: Fecha_limite, Fecha_Tarea_sub: Fecha_Tarea_sub }], (error, results) => {
            if (error) console.log( error);

            if (results.length > 0) {
                res.redirect('/adminecogas');
            }
        })
        res.redirect('/historialcarpeta/' + Nombre);
    }
    else {
        if (TareaRealizada) {
            sql = 'Update  clientes set ? where id =?';
            connection.query(sql, [{ Estado: EstadoCarpeta, TareaRealizada: TareaRealizada, ProximaTarea: ProximaTarea }, id], (error, results) => {
                if (error) console.log( error);
                console.log("se cargo el estado en tabla clientes");

            })
            sql = 'Insert into historialdecambios set?';
            connection.query(sql, [{ Nombre_sub: Nombre, Tarea_Realizada_sub: TareaRealizada, Proxima_Tarea_sub: ProximaTarea, Fecha_Tarea_sub: Fecha_Tarea_sub }], (error, results) => {
                if (error) {
                    console.log( error);
                    setTimeout(function () {
                        res.redirect('/historialcarpeta/' + Nombre);
                    }, 3000);

                }

                if (results.length > 0) {
                    setTimeout(function () {
                        res.redirect('/historialcarpeta/' + Nombre);
                    }, 3000);
                }
            })
        }
        else {
            sql = 'Update  clientes set ? where id =?';
            connection.query(sql, [{ Estado: EstadoCarpeta, TareaRealizada: TareaRealizada, ProximaTarea: ProximaTarea }, id], (error, results) => {
                if (error) console.log( error);
                if (results.length > 0) {
                    setTimeout(function () {
                        res.redirect('/historialcarpeta/' + Nombre);
                    }, 3000);
                }
                setTimeout(function () {
                    res.redirect('/historialcarpeta/' + Nombre);
                }, 3000);
            }

            )
        }
    }
})
router.post('/edit/delete/:id', (req, res) => {
    const id = req.params.id;
    var sql = 'Delete FROM clientes WHERE id =?';
    sql = 'Delete FROM clientes WHERE id =?'
    res.locals.moment = moment;
    connection.query(sql, [id], (error, results) => {
        if (error) console.log( error);
        if (results.length > 0) {
            res.redirect('/adminecogas');
        }
        else {
            res.redirect('/adminecogas');
        }
    })
})
router.post('/editarContacto/delete/Contacto/:id', (req, res) => {
    const id = req.params.id;
    var sql = 'Delete FROM contactos WHERE id =?';
    connection.query(sql, [id], (error, results) => {
        if (error) console.log( error);
        if (results.length > 0) {
            res.redirect('/contactos');
        }
        else {
            res.redirect('/contactos');
        }
    })
})
router.post('/guardarNuevoCliente', (req, res) => {
    const Nombre = req.body.NombreCarpeta;
    const NCarpeta = req.body.NCarpeta;
    const Comitente = req.body.Comitente;
    const Departamento = req.body.Departamento;
    var DNV = req.body.DNV;
    var DPV = req.body.DPV;
    var IRRIGACION = req.body.IRRIGACION;
    var HIDRAULICA = req.body.HIDRAULICA;
    var FERROCARRIL = req.body.FERROCARRIL;
    var OTROSPERMISOS = req.body.OTROSPERMISOS;
    var TipoDeRed = req.body.TipoDeRed
    var PerMunicipal = req.body.PerMunicipal;
    // const TipoRed =req.body.Tipos-de-red;
    if (DNV == null) { DNV = ""; }
    if (PerMunicipal == null) { PerMunicipal = ""; }

    if (DPV == null) { DPV = ""; }
    if (IRRIGACION == null) { IRRIGACION = ""; }
    if (HIDRAULICA == null) { HIDRAULICA = ""; }
    if (FERROCARRIL == null) { FERROCARRIL = ""; }
    if (OTROSPERMISOS == null) { OTROSPERMISOS = ""; }
    var sql = 'Insert into adgastareas set ?';
    connection.query(sql, {
        Nombre: Nombre
    }, (error, results) => {
        if (error) console.log( error);
    })
    sql = 'Insert into clientes_tareasgenerales set ?';
    connection.query(sql,{
        Nombre:Nombre
    }, (error, results) => {
        if (error) console.log( error);
    })
    sql = 'Insert into clientes set ?';
    connection.query(sql, {
        Nombre: Nombre, NCarpeta: NCarpeta, Comitente: Comitente, Ubicacion: Departamento, DNV: DNV, DPV: DPV, Irrigacion: IRRIGACION,
        Hidraulica: HIDRAULICA,PerMunicipal:PerMunicipal, Ferrocarriles: FERROCARRIL, OtrosPermisos: OTROSPERMISOS, TipoDeRed: TipoDeRed
    }, (error, results) => {
        if (error) console.log( error);

        if (results.length > 0) {
            res.redirect('/adminecogas');
        }
        else {
            res.redirect('/adminecogas');

        }
    })

})
router.post('/guardarNuevoContacto', (req, res) => {
    const Nombre = req.body.Nombre;
    const Entidad = req.body.Entidad;
    const Area = req.body.Area;
    const Puesto = req.body.Puesto;
    const Telefono = req.body.Teléfono;
    const Correo = req.body.Correo;
    var sql = 'Insert into contactos set ?';
    connection.query(sql, {
        Nombre: Nombre, Entidad: Entidad, Area: Area, Puesto: Puesto, Telefono: Telefono, Correo: Correo
    }, (error, results) => {
        if (error) console.log( error);
    })
    res.redirect('/contactos');


})
//Opciones de editar tareas POST
router.post('/actualizarEtapas/:id', (req, res) => {
    var id = req.body.id;
    var sql="";
    console.log("id es: " + id);
    //    Premiliminar
    var Mensura = req.body.Mensura;
    var FechaFirmaContrato = req.body.FechaFirmaContrato;
    // PrimeraParte
    var Contrato = req.body.Contrato;
    var Presupuesto = req.body.Presupuesto;
    var NotaDeExcepcion = req.body.NotaDeExcepcion;
    var PlanoTipo = req.body.PlanoTipo;
    var Sucedaneo = req.body.Sucedaneo;
    var SolicitudInicioObras = req.body.SolicitudInicioObras;
    var FechaInicioTrabajos = req.body.FechaInicioTrabajos;
    var FechaActividadActual = req.body.FechaActividadActual;
    var DocumentacionSociedad = req.body.DocumentacionSociedad;
    var ActaCargoVigente = req.body.ActaCargoVigente;
    var Cotizacion = req.body.Cotizacion;
    var LibroOrdenesServicio = req.body.LibroOrdenesServicio;
    var LibroNotasPedido = req.body.LibroNotasPedido;
    var AvisosDeObra = req.body.AvisosDeObra;
    var OrdenServicio = req.body.OrdenServicio;
    var CronogramaFirmadoComitente = req.body.CronogramaFirmadoComitente;
    var CronogramaSyH = req.body.CronogramaSyH;
    var AvisoInicioObraART = req.body.AvisoInicioObraART;
    var AvisoInicioObraIERIC = req.body.AvisoInicioObraIERIC;
    var SeguroRC = req.body.SeguroRC;
    var SeguroAccidentesPersonales = req.body.SeguroAccidentesPersonales;
    var ActasFinales = req.body.ActasFinales;
    var ActaInicioEfectivo = req.body.ActaInicioEfectivo;
    //Segunda Parte

    var MailAutorizacion = req.body.MailAutorizacion;
    var CertificadoRT = req.body.CertificadoRT;
    var ActaConstitutiva = req.body.ActaConstitutiva;
    var DniComitente = req.body.DniComitente;
   
    var Programadeseguridad = req.body.Programadeseguridad;
    var intTelefonicaPedida = req.body.intTelefonicaPedida;
    var intTelefonicaObtenida = req.body.intTelefonicaObtenida;
    var intClaroPedida = req.body.intClaroPedida;
    var intClaroObtenida = req.body.intClaroObtenida;
    var intAguaPedida = req.body.intAguaPedida;
    var intAguaObtenida = req.body.intAguaObtenida;
    var intCloacasPedida = req.body.intCloacasPedida;
    var intCloacasObtenida = req.body.intCloacasObtenida;
    var intElectricidadPedida = req.body.intElectricidadPedida;
    var intElectricidadObtenida = req.body.intElectricidadObtenida;
    var intTelecomPedida = req.body.intTelecomPedida;
    var intTelecomObtenida = req.body.intTelecomObtenida;

    var intTelefonica = req.body.intTelefonica;
    var intClaro = req.body.intClaro;
    var intAgua = req.body.intAgua;
    var intCloacas = req.body.intCloaca;
    var intElectricidad = req.body.intElectricidad;
    var intTelecom = req.body.intTelecom;
    var intArnet = req.body.intArnet;
    var PlanoAnexo = req.body.PlanoAnexo;

    var MatriculaFusionista = req.body.MatriculaFusionista;
    var MatriculaSoldador = req.body.MatriculaSoldador;
    var EstudioImpactoAmbiental= req.body.EstudioImpactoAmbiental;
    //Permisos
    var DPV = req.body.DPV;
    var PRIVADO = req.body.PRIVADO;
    var OTROSPERMISOS = req.body.OTROSPERMISOS;
    var PerMunicipal = req.body.PerMunicipal;
    // Caos
    var ConformeDePermisos = req.body.ConformeDePermisos;
    var PCrevisado = req.body.PCrevisado;
    var intArsat = req.body.intArsat;
    var Monotributos = req.body.Monotributos;
    var CronogramaAmbiente = req.body.CronogramaAmbiente;
    var ActaDeInicio = req.body.ActaDeInicio;

    var TituloDePropiedad = req.body.TituloDePropiedad;
    
    var Pcaprobado = req.body.PCaprobado;
    var CartaOferta = req.body.CartaOferta;

    //Generales
var DocumentacionTerreno, DocumentacionContractual, Tecnica,PermisosEspeciales,DocumentacionObra,Seguridad,PlanDeTrabajo,Matriculas,Ambiente,Avisos,DocumentacionInspeccion,ComunicacionObras,ActasFinalesEcogas,ConformesEntidades;    
    var DocSociedad = req.body.DocumentaciónSociedad;
    var Comercial = req.body.Comercial;
    var Interferencias = req.body.Interferencias;
    var Permisos = req.body.Permisos;
    var NotaCumplimentoNormativa = req.body.NotaCumplimentoNormativa;
    var DDJJNAG153 = req.body.DDJJNAG153;
    var PlanosyCroquis = req.body.PlanosyCroquis;
    var PruebaHermeticidad = req.body.PruebaHermeticidad;
    var PresentacionFinal = req.body.PresentacionFinal;
    var InformesFinales = req.body.InformesFinales;
    var HabilitacionFinal = req.body.HabilitacionFinal;
    //Documentacion Terreno
    if(Mensura == "ok" && TituloDePropiedad == "ok" ){
        DocumentacionTerreno = "ok";
    }
    if(Mensura =="EnGestion" || TituloDePropiedad == "EnGestion"){
        DocumentacionTerreno = "En Gestion";
    }
    //Documentacion Sociedad
    if(ActaConstitutiva == "ok" && ActaCargoVigente == "ok" ){
        DocumentacionSociedad = "ok";
    }
    if(ActaConstitutiva == "EnGestion" && ActaCargoVigente == "EnGestion" ){
        DocumentacionSociedad = "EnGestion";
    }
    //Documentacion Contractual
    if(Cotizacion == "ok" ){
        DocumentacionContractual = "ok";
    }
    if(Cotizacion == "EnGestion" ){
        DocumentacionContractual = "EnGestion";
    }
    // Comercial
    if(Contrato == "ok" && Presupuesto =="ok" && Sucedaneo =="ok" && (NotaDeExcepcion =="ok" || NotaDeExcepcion =="NC") ){
        Comercial = "ok";
    }
    if(Contrato == "EnGestion" || Presupuesto =="EnGestion" || Sucedaneo =="EnGestion" || (NotaDeExcepcion =="EnGestion" || NotaDeExcepcion =="NC") ){
        Comercial = "EnGestion";
    }
    //Tecnica
    if(Pcaprobado == "ok" && (PlanoTipo=="ok" || PlanoTipo=="NC") ){
        Tecnica = "ok";
    }
    if(Pcaprobado == "EnGestion" || (PlanoTipo=="EnGestion" || PlanoTipo=="NC") ){
        Tecnica = "EnGestion";
    }
    //Permisos Especiales
    if((CartaOferta == "ok" || CartaOferta == "NC") && (PlanoAnexo=="ok" || PlanoAnexo=="NC") && (DNV=="ok" || DNV=="NC") && (HIDRAULICA=="ok" || HIDRAULICA=="NC") && (FERROCARRIL=="ok" || FERROCARRIL=="NC")  ){
        PermisosEspeciales = "ok";
    }
    if((CartaOferta == "EnGestion" || CartaOferta == "NC") ||( PlanoAnexo=="EnGestion" || PlanoAnexo=="NC") ||( DNV=="EnGestion" || DNV=="NC")||(HIDRAULICA=="EnGestion" || HIDRAULICA=="NC")|| (FERROCARRIL=="EnGestion" || FERROCARRIL=="NC")){
        PermisosEspeciales = "EnGestion";
    }
    //Documentación de obra
    if(SolicitudInicioObras == "ok" && (CertificadoRT=="ok") ){
        DocumentacionObra = "ok";
    }
    if(SolicitudInicioObras == "EnGestion" || (CertificadoRT=="EnGestion") ){
        DocumentacionObra = "EnGestion";
    }
    //Seguridad
    if(Programadeseguridad=="ok"&&CronogramaSyH=="ok" && SeguroRC=="ok" && Monotributos =="ok" && SeguroAccidentesPersonales=="ok"){
        Seguridad="ok"
    }
    if(Programadeseguridad=="EnGestion"||CronogramaSyH=="EnGestion" || SeguroRC=="EnGestion" || Monotributos =="EnGestion" || SeguroAccidentesPersonales=="EnGestion"){
        Seguridad="EnGestion"
    }
    //Interferencias
    if(intAgua=="ok"|| (intAgua=="NC") &&intCloacas=="ok"|| (intCloacas=="NC")  && intElectricidad=="ok"|| (intElectricidad=="NC")  && intArsat =="ok"|| (intArsat=="NC")  && intClaro=="ok"|| (intClaro=="NC") && intTelefonica=="ok"|| (intTelefonica=="NC") && intArnet=="ok"|| (intArnet=="NC") && intTelecom=="ok"|| (intTelecom=="NC") ){
        Interferencias="ok";
    }
    if((intAgua=="EnGestion"|| intAgua=="NC") ||(intCloacas=="EnGestion"|| intCloacas=="NC")  || (intElectricidad=="EnGestion"|| intElectricidad=="NC")  || (intArsat =="EnGestion"|| intArsat=="NC")  || (intClaro=="EnGestion"|| intClaro=="NC") || (intTelefonica=="EnGestion"|| intTelefonica=="NC") || (intArnet=="EnGestion"|| intArnet=="NC") || (intTelecom=="EnGestion"|| intTelecom=="NC") ){
        Interferencias="EnGestion";
    }
    //Permisos
    if(PerMunicipal=="ok" && (IRRIGACION=="ok"|| IRRIGACION=="NC") && (DPV=="ok"|| DPV=="NC")){
        Permisos="ok";
         }
         if(PerMunicipal=="EnGestion" || (IRRIGACION=="EnGestion"|| IRRIGACION=="NC") || (DPV=="EnGestion"|| DPV=="NC")){
            Permisos="EnGestion";
             }
    //Plan de trabajo
//PlanDeTrabajo=PlanDeTrabajo;
// Matriculas
if((MatriculaFusionista=="ok" || MatriculaFusionista=="NC") && (MatriculaSoldador=="ok" || MatriculaSoldador=="NC")){
    Matriculas="ok";
}
if((MatriculaFusionista=="EnGestion" || MatriculaFusionista=="NC") && (MatriculaSoldador=="EnGestion" || MatriculaSoldador=="NC")){
    Matriculas="EnGestion";
}
//Ambiente
if((EstudioImpactoAmbiental=="ok" || EstudioImpactoAmbiental=="NC")&&(CronogramaAmbiente=="ok"|| CronogramaAmbiente=="NC")){
Ambiente="ok";
}
if((EstudioImpactoAmbiental=="EnGestion" || EstudioImpactoAmbiental=="NC")&&(CronogramaAmbiente=="EnGestion"|| CronogramaAmbiente=="NC")){
    Ambiente="EnGestion";
    }
    //Nota Cumplimento Normativas Vigentes
    // NotaCumplimentoNormativa=NotaCumplimentoNormativa;
// DDJJNAG153
// DDJJNAG153=DDJJNAG153;
// Avisos
if(AvisoInicioObraART=="ok"&&AvisoInicioObraIERIC=="ok"&&AvisosDeObra=="ok"){
    Avisos="ok";
}
if(AvisoInicioObraART=="EnGestion"&&AvisoInicioObraIERIC=="EnGestion"&&AvisosDeObra=="EnGestion"){
    Avisos="EnGestion";
}
//Obras
// DocumentacionInspeccion
if(ActaDeInicio=="ok"&&Permisos=="ok"&&Interferencias=="ok"&&LibroOrdenesServicio=="ok"&&LibroNotasPedido=="ok"&&Pcaprobado=="ok"&&Avisos=="ok"&&CronogramaFirmadoComitente=="ok"){
    DocumentacionInspeccion="ok";
}
if(ActaDeInicio=="EnGestion"||Permisos=="EnGestion"||Interferencias=="EnGestion"||LibroOrdenesServicio=="EnGestion"||LibroNotasPedido=="EnGestion"||Pcaprobado=="EnGestion"||Avisos=="EnGestion"||CronogramaFirmadoComitente=="EnGestion"){
    DocumentacionInspeccion="EnGestion";
}
// ComunicacionObras
if(OrdenServicio=="ok" ){
    ComunicacionObras="ok";
}
if(OrdenServicio=="EnGestion"){
    ComunicacionObras="EnGestion";
}

console.log("Documentacion terreno: " +DocumentacionTerreno);

   

    if (req.body.DNV1 == req.body.DNV) {
        var DNV = req.body.DNV;
    }
    else {
        if (req.body.DNV1 == "") {
            var DNV = req.body.DNV;
        } else { var DNV = req.body.DNV1; }
    }
    if (req.body.IRRIGACION1 == req.body.IRRIGACION) {
        var IRRIGACION = req.body.IRRIGACION1;
    } else {
        if (req.body.IRRIGACION1 == "") {
            var IRRIGACION = req.body.IRRIGACION;
        } else { var IRRIGACION = req.body.IRRIGACION1; }
    }

    if (req.body.HIDRAULICA1 == req.body.HIDRAULICA) {
        var HIDRAULICA = req.body.HIDRAULICA1;
    } else {
        if (req.body.HIDRAULICA1 == "") {
            var HIDRAULICA = req.body.HIDRAULICA;
        } else { var HIDRAULICA = req.body.HIDRAULICA1; }
    }

    if (req.body.PerMunicipal1 == req.body.PerMunicipal) {
        var PermisoMunicipal = req.body.PermisoMunicipal1;
    } else {
        if (req.body.PerMunicipal1 == "") {
            var PerMunicipal = req.body.PerMunicipal;
        } else { var PerMunicipal = req.body.PerMunicipal1; }
    }
    if (req.body.FERROCARRIL1 == req.body.FERROCARRIL) {
        var FERROCARRIL = req.body.FERROCARRIL1;
    } else {
        if (req.body.FERROCARRIL1 == "") {
            var FERROCARRIL = req.body.FERROCARRIL;
        } else { var FERROCARRIL = req.body.FERROCARRIL1; }
    }
    
    if ((DNV == "ok" || DNV == "NC") && (PerMunicipal == "ok" || PerMunicipal == "NC") && (DPV == "ok" || DPV == "NC") && (IRRIGACION == "ok" || IRRIGACION == "NC") && (HIDRAULICA == "ok" || HIDRAULICA == "NC") && (FERROCARRIL == "ok" || FERROCARRIL == "NC") && (PRIVADO == "ok" || PRIVADO == "NC") && (OTROSPERMISOS == "ok" || OTROSPERMISOS == "NC")) {
        Permisos = "ok";
    } else { Permisos = "EnGestioncls" };

    if (intTelefonica == "EnGestion" || intClaro == "EnGestion" || intAgua == "EnGestion" || intCloacas == "EnGestion" || intElectricidad == "EnGestion" || intTelecom == "EnGestion" || intArnet == "EnGestion" || intArsat == "EnGestion") {
        Interferencias = "EnGestion";
        console.log("Actualizaretapas/// Ingreso al if de interferencias 'en gestion'");
    }
    if (intTelefonica == "ok" && intClaro == "ok" && intAgua == "ok" && intCloacas == "ok" && intElectricidad == "ok" && intArnet == "ok") {
        Interferencias = "ok";
        console.log("Actualizaretapas/// Ingreso al if de interferencias 'ok'");
    }
    sql= 'Update clientes_tareasgenerales Set ? where Nombre=?';
    connection.query(sql,[{ DocumentacionTerreno:DocumentacionTerreno,DocumentacionSociedad:DocumentacionSociedad,DocumentacionContractual:DocumentacionContractual,Comercial:Comercial,Tecnica:Tecnica,PermisosEspeciales:PermisosEspeciales,DocumentacionObra:DocumentacionObra,Seguridad:Seguridad,Interferencias:Interferencias,Permisos:Permisos,PlanDeTrabajo:PlanDeTrabajo,Matriculas:Matriculas,Ambiente:Ambiente,NotaCumplimentoNormativas:NotaCumplimentoNormativa,DDJJNAG153:DDJJNAG153,Avisos:Avisos,
        DocumentacionInspeccion:DocumentacionInspeccion,ComunicacionObras:ComunicacionObras
    }, id],
        (error, results) => {

            if (error) {
                console.log(error);
               }

            })
     sql = 'Update clientes Set ? where id=?';
    connection.query(sql, [{
        //Prelimnar
        Mensura: Mensura, TituloDePropiedad: TituloDePropiedad, ActaConstitutiva: ActaConstitutiva, ActaCargoVigente: ActaCargoVigente, Cotizacion: Cotizacion,
        //Primera Parte
        FechaFirmaContrato: FechaFirmaContrato, Contrato: Contrato, Presupuesto: Presupuesto, NotaDeExcepcion: NotaDeExcepcion,
        PlanoTipo: PlanoTipo, Sucedaneo: Sucedaneo, DDJJNAG153: DDJJNAG153, SolicitudInicioObras: SolicitudInicioObras,
        FechaInicioTrabajos: FechaInicioTrabajos, FechaActividadActual: FechaActividadActual, Comercial: Comercial,
        PCaprobado: Pcaprobado,
        CartaOferta: CartaOferta,
        //Obras
        LibroOrdenesServicio: LibroOrdenesServicio, LibroNotasPedido: LibroNotasPedido, AvisosDeObra: AvisosDeObra, OrdenServicio: OrdenServicio,
        CronogramaFirmadoComitente: CronogramaFirmadoComitente, CronogramaSyH: CronogramaSyH, AvisoInicioObraART: AvisoInicioObraART,
        AvisoInicioObraIERIC: AvisoInicioObraIERIC,
        //Segunda Parte
        SeguroRC: SeguroRC, SeguroAccidentesPersonales: SeguroAccidentesPersonales,
        PlanosyCroquis: PlanosyCroquis, PlanoAnexo: PlanoAnexo, ActasFinales: ActasFinales, ActaInicioEfectivo: ActaInicioEfectivo, InformesFinales: InformesFinales,
        PCrevisado: PCrevisado, EstudioImpactoAmbiental:EstudioImpactoAmbiental,
         Monotributos: Monotributos, CronogramaAmbiente: CronogramaAmbiente, ActaDeInicio: ActaDeInicio,
        PruebaHermeticidad: PruebaHermeticidad, DniComitente: DniComitente, NotaCumplimentoNormativa: NotaCumplimentoNormativa, MailAutorizacion: MailAutorizacion,
        CertificadoRT: CertificadoRT, MatriculaSoldador:MatriculaSoldador, MatriculaFusionista:MatriculaFusionista,
        //Interferencias
        intTelefonicaObtenida: intTelefonicaObtenida, intTelefonicaPedida: intTelefonicaPedida, intClaroPedida: intClaroPedida, intClaroObtenida: intClaroObtenida,
        intAguaObtenida: intAguaObtenida, intAguaPedida: intAguaPedida, intCloacasObtenida: intCloacasObtenida, intCloacasPedida: intCloacasPedida, intElectricidadObtenida: intElectricidadObtenida,
        intElectricidadPedida: intElectricidadPedida, intTelecomObtenida: intTelecomObtenida, intTelecomPedida: intTelecomPedida, intTelefonica: intTelefonica, intClaro: intClaro, intAgua: intAgua,
        intCloaca: intCloacas, intElectricidad: intElectricidad, intTelecom: intTelecom, intArnet: intArnet, intArsat: intArsat,
        //Permisos
        DNV: DNV, DPV: DPV, Irrigacion: IRRIGACION,
        Hidraulica: HIDRAULICA, Privado: PRIVADO, Ferrocarriles: FERROCARRIL, Otrospermisos: OTROSPERMISOS,
        Interferencias: Interferencias, Permisos: Permisos, Programadeseguridad: Programadeseguridad,PerMunicipal: PerMunicipal,
        //Finalizacion
        ConformeDePermisos: ConformeDePermisos, PresentacionFinal: PresentacionFinal, HabilitacionFinal: HabilitacionFinal,

    }, id],
        (error, results) => {

            if (error) {
                console.log(error);
               }

            })
           
            res.redirect(req.get('referer'));

        
})
router.post('/ActualizarEstadoCarpeta/:id', (req, res) => {
    var id = req.body.id;
    var Estado= req.body.Estado; 
    var sql = 'Update clientes Set ? where id=?';
    connection.query(sql, [{
        Estado: Estado
    }, id], (error, results) => {
        if (error) console.log( error);
    })


})