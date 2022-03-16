const { render } = require('ejs');
const { Router } = require('express');
const router = Router();
const moment = require('moment');
module.exports = router;
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
//Fin de seteo de server original
//Rutas Get
router.get('/', (req, res) => {
    res.render('index.ejs');
})
router.get('/interferencias', (req, res) => {
    const sql = 'SELECT c.id, c.Nombre, c.NCarpeta, c.intTelefonica, c.intTelefonicaPedida, c.intTelefonicaObtenida, c.intAgua, c.intAguaPedida, c.intAguaObtenida, c.intCloaca,c.intCloacasPedida, c.intCloacasObtenida, c.intClaro, c.intClaroPedida, c.intClaroObtenida, c.intElectricidad, c.intElectricidadPedida, c.intElectricidadObtenida, c.intArnet ,  c.intArnetPedida, c.intArnetObtenida,c.intArsat, c.intArsatPedida, c.intArsatObtenida, c.intTelecomPedida, c.intTelecomObtenida, c.intTelecom FROM clientes c';
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
    const sql = 'SELECT c.id, c.Nombre, c.NCarpeta, c.intTelefonica, c.intTelefonicaPedida, c.intTelefonicaObtenida, c.intAgua, c.intAguaPedida, c.intAguaObtenida, c.intCloaca,c.intCloacasPedida, c.intCloacasObtenida, c.intClaro, c.intClaroPedida, c.intClaroObtenida, c.intElectricidad, c.intElectricidadPedida, c.intElectricidadObtenida, c.intArnet ,  c.intArnetPedida, c.intArnetObtenida,c.intArsat, c.intArsatPedida, c.intArsatObtenida, c.intTelecomPedida, c.intTelecomObtenida, c.intTelecom FROM clientes c';
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

//Administracion Ecogas
router.get('/adminecogas', (req, res) => {
    const sql = 'SELECT c.id, c.Nombre, c.NCarpeta, c.TareaRealizada, c.ProximaTarea, c.EtapaTarea, c.FechaLimite FROM clientes c  ';
    res.locals.moment = moment;
    connection.query(sql, (error, results) => {
        if (error) console.log( error);

        if (results.length > 0) {
            res.render('paginas/AdministracionEcogas/adminecogas.ejs', { results: results }); //en {results:results} lo que hago es guardar los resultados que envia la bd, en la variable results

        }
        else {
            res.render('paginas/AdministracionEcogas/nuevocliente.ejs');
        }
    })

})
router.get('/adminecogas/TablaGeneral', (req, res) => {
    // const sql = 'SELECT c.id, c.Nombre, c.NCarpeta,a.ResponsableDeTarea, c.TareaRealizada, c.ProximaTarea,c.EtapaTarea, c.FechaLimite, c.Estado FROM clientes c, historialdecambios a where c.Nombre = a.Nombre_sub'; //SQL ORIGINAL
    var sql = 'Select c.Nombre_sub, a.NCarpeta, a.Estado, a.id, c.ResponsableDeTarea,c.Tarea_Realizada_sub, c.Proxima_Tarea_sub, c.Fecha_Proxima_Tarea_sub, c.EtapaTarea_sub from historialdecambios c , clientes a where a.Nombre = c.Nombre_sub AND c.Si_NO_TareaRealizada != "S"  '; //AND (DATE_SUB(CURDATE(), interval 7 day)) <= c.Fecha_Proxima_Tarea_sub  Permite mostrar las fechas proximas a vencerse. ';
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
    const sql = 'SELECT c.id, c.Nombre  ,c.NCarpeta,  c.Ubicacion ,c.Comitente ,c.Estado, c.Fechafirmacontrato  ,b.DocumentacionTerreno ,b.DocumentacionSociedad ,b.DocumentacionContractual  ,b.Comercial ,b.Tecnica ,b.PermisosEspeciales ,b.DocumentacionObra  ,b.Seguridad,b.Interferencias, b.Permisos, b.PlanDeTrabajo, b.Matriculas, b.Ambiente, b.NotaCumplimentoNormativas, b.DDJJNAG153, b.Avisos, b.DocumentacionInspeccion, b.ComunicacionObras, b.ActasFinalesEcogas, b.PlanosyCroquis, b.ConformeEntidades, b.PruebaHermeticidad, b.InformesFinales, b.PresentacionFinal, b.HabilitacionObra  from clientes_tareasgenerales b , clientes c where b.Nombre = c.Nombre';
    // const sql = 'SELECT c.id, c.Nombre  ,c.NCarpeta,  c.Ubicacion ,c.Comitente ,c.Estado, c.Fechafirmacontrato ,b.DocumentacionTerreno, b.DocumentacionSociedad,b.DocumentacionContractual  ,b.Comercial ,b.Tecnica,b.PermisosEspeciales ,b.DocumentacionObra  ,b.Seguridad,b.Interferencias, b.Permisos, b.PlanDeTrabajo, b.Matriculas, b.Ambiente, b.NotaCumplimentoNormativas, b.DDJJNAG153, b.Avisos, b.DocumentacionInspeccion, b.ComunicacionObras, b.ActasFinalesEcogas, b.PlanosyCroquis, b.ConformeEntidades, b.PruebaHermeticidad, b.InformesFinales,b.PresentacionFinal, b.HabilitacionObra  from clientes c , clientes_tareasgenerales b  ';
    // const sql='Select * from clientes c';
    // const sql='Select * from clientes_tareasgenerales b';

    connection.query(sql, (error, results) => {
        if (error) console.log( error);
        if (results.length > 0) {
            res.render('paginas/AdministracionEcogas/estadogeneral.ejs', { results: results }); //en {results:results} lo que hago es guardar los resultados que envia la bd, en la variable results
            // res.send(results);

        }else {
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
            res.render('paginas/AdministracionEcogas/nuevocontacto.ejs');
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
   var id;
    const Nombre = req.params.Nombre;
    var sql = 'SELECT id FROM clientes WHERE Nombre =?';
    connection.query(sql, [Nombre], (error, results) => {
        if (error) console.log( error);
        if (results.length > 0) {
          
        id= Object.values(results[0]);
        }
    })

    sql = 'SELECT c.* FROM historialdecambios c WHERE Nombre_sub =?';
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
    console.log("intentando actualizar contacto " +Nombre);
    connection.query(sql, [{
        Nombre: Nombre, Entidad: entidad, Area: area, Puesto: Puesto, Telefono: Telefono, Correo: Correo
    }, id]
        , (error, results) => {
            if (error) console.log( error);

            if (results.length > 0) {
                res.redirect('/contactos');
            }
            else {
                res.redirect('/contactos');

            }

        })
})
router.post('/TareaOk/:Nombre', (req, res) => {
    const Nombre= req.params.Nombre;
    const TareaOk = req.body.TareaOK;
   const id=req.body.id;

    const sql = 'Update historialdecambios Set ? where Nombre_sub =? and id =?';
    connection.query(sql, [{
        Si_NO_TareaRealizada: TareaOk , 
    }, Nombre, id]
        , (error, results) => {
            if (error) console.log( error);

            if (results.length > 0) {
                console.log("Intentando actualizar el estado de la tarea");
                console.log("La tarea realizada tendra el estado: "+ TareaOk);
                console.log("El id de la tarea es: "+ id);
                res.redirect(req.get('referer'));
            }
            else {
                console.log("Intentando actualizar el estado de la tarea");
                console.log("La tarea realizada tendra el estado: "+ TareaOk);
                console.log("El id de la tarea es: "+ id);
}res.redirect(req.get('referer'));
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
    const Irrigacion = req.body.Irrigacion;
    const HIDRAULICA = req.body.HIDRAULICA;
    const FERROCARRIL = req.body.FERROCARRIL;
    const OTROSPERMISOS = req.body.Otrospermisos;
    const Privado = req.body.Privado;
    var PerMunicipal = req.body.PerMunicipal;

    const DNVVisacion = req.body.DNV;
    const HIDRAULICAVisacion = req.body.HIDRAULICA;
    const FERROCARRILVisacion = req.body.FERROCARRIL;

    const TipoDeRed = req.body.TipoDeRed;
    console.log("Intentando actualizar el contacto:" + NombreCarpeta);
    console.log("PRIVADO:" + OTROSPERMISOS);
    //const TareaRealizada =req.body.TareaRealizada;
    //const ProximaTarea = req.body.ProximaTarea;
    const Fecha_limite = req.body.Fecha_limite;
    if (Fecha_limite) {
        console.log('fecha limite a actualizar es: ' + Fecha_limite);
        console.log('fecha limite a actualizar es: ' + req.body.Fecha_limite);
        //console.log(Tarea_Realizada: TareaRealizada, ProximaTarea: ProximaTarea);
        var sql = 'Update clientes Set ? where id =?';
        connection.query(sql, [{
            Nombre: NombreCarpeta, NCarpeta: NCarpeta, DNVVisacion:DNVVisacion, HIDRAULICAVisacion:HIDRAULICAVisacion, FERROCARRILVisacion:FERROCARRILVisacion,Comitente: Comitente, Ubicacion: Departamento, DNV: DNV, DPV: DPV, Irrigacion: Irrigacion,
            Hidraulica: HIDRAULICA, Privado: Privado, Ferrocarriles: FERROCARRIL, TipoDeRed: TipoDeRed, Fecha_limite: Fecha_limite, 
            PerMunicipal:PerMunicipal, OtrosPermisos: OTROSPERMISOS
        }, id]
            , (error, results) => {
                if (error) console.log( error);

                if (results.length > 0) {
                    res.redirect('/editarTareas/'+id);

                }
                else {
                    res.redirect('/editarTareas/'+id);

                }

            })
    }
    else {
        if (NombreCarpeta != null) {
            const sql = 'Update clientes Set ? where id =?';
            connection.query(sql, [{
                Nombre: NombreCarpeta, NCarpeta: NCarpeta, Comitente: Comitente, Ubicacion: Departamento, DNV: DNV, DPV: DPV, Irrigacion: Irrigacion,
                Hidraulica: HIDRAULICA, Ferrocarriles: FERROCARRIL, TipoDeRed: TipoDeRed,OtrosPermisos: OTROSPERMISOS,Privado: Privado,PerMunicipal:PerMunicipal
            }, id]
                , (error, results) => {
                    if (error) console.log( error);

                    if (results.length > 0) {
                        res.redirect('/editarTareas/'+id);

                    }
                    else {
                        res.redirect('/editarTareas/'+id);


                    }

                })

        }
        else {
            const sql = 'Update clientes Set ? where id =?';
            connection.query(sql, [{
                NCarpeta: NCarpeta, Comitente: Comitente, Ubicacion: Departamento, DNV: DNV, DPV: DPV, Irrigacion: IRRIGACION,
                Hidraulica: HIDRAULICA, Ferrocarriles: FERROCARRIL, TipoDeRed: TipoDeRed,PerMunicipal:PerMunicipal,Privado: Privado 
            }, id]
                , (error, results) => {
                    if (error) console.log( error);

                    if (results.length > 0) {
                        res.redirect('/editarTareas/'+id);

                    }
                    else {
                        res.redirect('/editarTareas/'+id);


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
    const Fecha_Tarea_sub = fecha;
    const ResponsableDeTarea = req.body.ResponsableDeTarea;
    var EtapaTarea = req.body.EtapaTarea;
    var sql = "";
   
    if (Fecha_limite) {
        sql = 'Update  clientes set ? where id=?';
        connection.query(sql, [{ EtapaTarea: EtapaTarea, TareaRealizada: TareaRealizada, ProximaTarea: ProximaTarea, Fechalimite: Fecha_limite }, id], (error, results) => {
            if (error) console.log( error);
        })

        sql = 'Insert into historialdecambios set?';
        connection.query(sql, [{ EtapaTarea_sub: EtapaTarea, ResponsableDeTarea:ResponsableDeTarea,Si_NO_TareaRealizada: "N", Nombre_sub: Nombre, Tarea_Realizada_sub: TareaRealizada, Proxima_Tarea_sub: ProximaTarea, Fecha_Proxima_Tarea_sub: Fecha_limite, Fecha_Tarea_sub: Fecha_Tarea_sub }], (error, results) => {
            if (error) console.log( error);

            if (results.length > 0) {
                res.redirect('/adminecogas');
            }
        })
        res.redirect('/historialcarpeta/' + Nombre);
    }
    else {
        res.redirect(req.get('referer'));
    }
})
router.post('/edit/delete/:id', (req, res) => {
    const id = req.body.id;
    const Nombre = req.body.Nombre;
    var sql = 'Delete FROM clientes WHERE id =?';
    res.locals.moment = moment;
    connection.query(sql, [id], (error, results) => {
        if (error) console.log( error);
        if (results.length > 0) {
            
        }})
        sql = 'Delete FROM clientes_tareasgenerales WHERE Nombre =?';
        connection.query(sql, [Nombre], (error, results) => {
            if (error) console.log( error);
            if (results.length > 0) {
                res.redirect('/adminecogas');
            }
            else{ res.redirect('/adminecogas');}
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
    const fechaActual= new Date();
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
    var Privado = req.body.PRIVADO;
    // const TipoRed =req.body.Tipos-de-red;
    if (DNV == null) { DNV = "NC"; }
    if (PerMunicipal == null) { PerMunicipal = "NC"; }

    if (DPV == null) { DPV = "NC"; }
    if (IRRIGACION == null) { IRRIGACION = "NC"; }
    if (HIDRAULICA == null) { HIDRAULICA = "NC"; }
    if (FERROCARRIL == null) { FERROCARRIL = "NC"; }
    if (OTROSPERMISOS == null) { OTROSPERMISOS = "NC"; }
    var sql = 'Insert into adgastareas set ?';
    connection.query(sql, {
        Nombre: Nombre
    }, (error, results) => {
        if (error) console.log( error);
    })
    sql='Insert into historialdecambios set ?';
    connection.query(sql, {
        Nombre_sub: Nombre, Tarea_Realizada_sub: "Se crea nuevo cliente", Proxima_Tarea_sub: "Actualizar estado de carpeta", Si_NO_TareaRealizada:"N", Fecha_Tarea_sub: fechaActual
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
        Hidraulica: HIDRAULICA,PerMunicipal:PerMunicipal, Ferrocarriles: FERROCARRIL,Privado:Privado, OtrosPermisos: OTROSPERMISOS, TipoDeRed: TipoDeRed
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
    const Telefono = req.body.Telefono;
    const Correo = req.body.Correo;
    var sql = 'Insert into contactos set ?';
    connection.query(sql, {
        Nombre: Nombre, Entidad: Entidad, Area: Area, Puesto: Puesto, Telefono: Telefono, Correo: Correo
    }, (error, results) => {
        if (error) console.log( error);
    })
    res.redirect('/contactos');


})
router.post('/actPrelCarpEcogas/:id', (req,res)=>{
    var id = req.body.id;
    var Nombre = req.body.Nombre;   
    var sql="";
//Tareas generales
var DocumentacionTerreno;

    //    Preliminar
        var Mensura = req.body.Mensura;
    var FechaFirmaContrato = req.body.FechaFirmaContrato;
    var TituloDePropiedad = req.body.TituloDePropiedad;
    var ActaCargoVigente = req.body.ActaCargoVigente;
    var ActaConstitutiva = req.body.ActaConstitutiva;
    var DniComitente = req.body.DniComitente;
    var Cotizacion = req.body.Cotizacion;
    var Contrato = req.body.ContratoPreliminar;

    // Variables generales
    var DocumentacionSociedad;
    var DocumentacionContractual;

    if(Mensura == "ok" && TituloDePropiedad == "ok" ){
        DocumentacionTerreno = "ok";
    }
    if(Mensura == "EnGestion" || TituloDePropiedad == "EnGestion" ){
        DocumentacionTerreno = "EnGestion";
    }
    if(Mensura == "Sin presentar" || TituloDePropiedad == "Sin presentar" ){
        DocumentacionTerreno = "Sin presentar";
    }
     //Documentacion Sociedad
    if(ActaConstitutiva == "ok" && ActaCargoVigente == "ok" ){
        DocumentacionSociedad = "ok";
    }
    if(ActaConstitutiva == "EnGestion" || ActaCargoVigente == "EnGestion" ){
        DocumentacionSociedad = "EnGestion";
    }
    if(ActaConstitutiva == "Sin presentar" || ActaCargoVigente == "Sin presentar" ){
        DocumentacionSociedad = "Sin presentar";
    }
     //Documentacion Contractual
    if(Cotizacion == "ok" && (Contrato=="Ok(Preliminar)" || Contrato=="ok") ){
        DocumentacionContractual = "ok";
    }
    if(Cotizacion == "EnGestion" || (Contrato == "EnGestion"|| Contrato == "EnGestion(Preliminar)") ){
        DocumentacionContractual = "EnGestion";
    }
    if(Cotizacion == "Sin presentar" || (Contrato == "Sin presentar" ||  Contrato == "Sin presentar(Preliminar)") ){
        DocumentacionContractual = "Sin presentar";
    }
    console.log("documentacion terreno:" + DocumentacionTerreno);
    sql= 'Update clientes_tareasgenerales Set ? where Nombre=?';
    connection.query(sql,[{ DocumentacionTerreno:DocumentacionTerreno,DocumentacionSociedad:DocumentacionSociedad,
        DocumentacionContractual:DocumentacionContractual }, Nombre],
        (error, results) => {

            if (error) {
                console.log(error);
               }

            })

            sql = 'Update clientes Set ? where id=?';
            connection.query(sql, [{
                //Prelimnar 
                Mensura: Mensura, TituloDePropiedad: TituloDePropiedad, ActaCargoVigente: ActaCargoVigente, ActaConstitutiva: ActaConstitutiva, 
                 DniComitente:DniComitente, Cotizacion: Cotizacion, Contrato:Contrato}, id],
                (error, results) => {
        
                    if (error) {
                        console.log(error);
                       }
                       res.redirect(req.get('referer'));
        
                    })
                   
})
router.post('/act1pCarpEcogas/:id', (req,res)=>{
    var id = req.body.id;
    var Nombre = req.body.Nombre;   
    var sql="";

    var Contrato = req.body.Contrato;
    var Presupuesto = req.body.Presupuesto;
    var Sucedaneo = req.body.Sucedaneo;
    var NotaDeExcepcion = req.body.NotaDeExcepcion;
    var Pcaprobado = req.body.PCaprobado;
    var PlanoTipo = req.body.PlanoTipo;
    var CartaOferta = req.body.CartaOferta;
    var PlanoAnexo = req.body.PlanoAnexo;
    var HidraulicaVisacion = req.body.HIDRAULICA1;
    var DNVVisacion = req.body.DNV1;
    var FerrocarrilesVisacion = req.body.FERROCARRIL1;
    // Variables Generales
    var Comercial;
    var Tecnica, PermisosEspeciales;
    // Comercial
    if((Contrato == "ok" ||Contrato == "Ok(Preliminar)")  && Presupuesto =="ok" && Sucedaneo =="ok" && (NotaDeExcepcion =="ok" || NotaDeExcepcion =="NC") ){
        Comercial = "ok";
    }
    if(Contrato == "EnGestion" || Presupuesto =="EnGestion" || Sucedaneo =="EnGestion" || NotaDeExcepcion =="EnGestion" ){
        Comercial = "EnGestion";
    }
    if(Contrato == "Observado" || Presupuesto =="Observado" || Sucedaneo =="Observado" || NotaDeExcepcion =="Observado" ){
        Comercial = "Sin presentar";
    }
    //Tecnica
    if(Pcaprobado == "ok" && (PlanoTipo=="ok" || PlanoTipo=="NC") ){
        Tecnica = "ok";
    }
    if(Pcaprobado == "EnGestion" || (PlanoTipo=="EnGestion" || PlanoTipo=="NC") ){
        Tecnica = "EnGestion";
    }
     //Permisos Especiales
     if((CartaOferta == "ok" || CartaOferta == "NC" || CartaOferta == "") && (PlanoAnexo=="ok" || PlanoAnexo=="NC" || PlanoAnexo=="") && (DNVVisacion=="Visado" || DNVVisacion=="NC" || DNVVisacion=="") && (HidraulicaVisacion=="Visado" || HidraulicaVisacion=="NC" || HidraulicaVisacion=="") && (FerrocarrilesVisacion=="Visado" || FerrocarrilesVisacion=="NC" || FerrocarrilesVisacion=="")  ){
       console.log("Permisos especiales sera cambiado a ok...");
        PermisosEspeciales = "ok";
    }
    if(CartaOferta == "EnGestion" || PlanoAnexo=="EnGestion" || DNVVisacion=="EnGestion" ||HidraulicaVisacion=="EnGestion" || FerrocarrilesVisacion=="EnGestion" ){
       console.log("Permisos especiales sera cambiado a EnGestion...");
       PermisosEspeciales = "EnGestion";
    }
    if(CartaOferta == "Observado" || PlanoAnexo=="Observado" || DNVVisacion=="Observado" ||HidraulicaVisacion=="Observado" || FerrocarrilesVisacion=="Observado" ){
       console.log("Permisos especiales sera cambiado a Observado...");
       PermisosEspeciales = "Observado";
    }
    console.log("id:"+ id + ","+Contrato, "", Comercial, "",Presupuesto, "",Sucedaneo, "",)
    sql= 'Update clientes_tareasgenerales Set ? where Nombre=?';
    connection.query(sql,[{ Comercial:Comercial,Tecnica:Tecnica,PermisosEspeciales:PermisosEspeciales}, Nombre],
        (error, results) => {

            if (error) {
                console.log(error);
               }
            })
            sql = 'Update clientes Set ? where id=?';
            connection.query(sql, [{
                //Primera Parte
                Contrato: Contrato, Presupuesto: Presupuesto, Sucedaneo: Sucedaneo, NotaDeExcepcion: NotaDeExcepcion,PCaprobado: Pcaprobado,
                PlanoTipo: PlanoTipo, CartaOferta: CartaOferta, PlanoAnexo: PlanoAnexo, HidraulicaVisacion:HidraulicaVisacion, DNVVisacion: DNVVisacion, FerrocarrilesVisacion: FerrocarrilesVisacion}, id],
                (error, results) => {
        
                    if (error) {
                        console.log(error);
                       }
        
                    })
                   
                    res.redirect(req.get('referer'));
})  
router.post('/act2pCarpEcogas/:id', (req,res)=>{
    var id = req.body.id;
    var Nombre = req.body.Nombre;   
    var sql="";
    // Primera seccion 
    var MailAutorizacion = req.body.MailAutorizacion;
    var PlanDeTrabajo = req.body.PlanDeTrabajo
    var SolicitudInicioObras = req.body.SolicitudInicioObras;
    var CertificadoRT = req.body.CertificadoRT;
    var Programadeseguridad = req.body.Programadeseguridad;
    var CronogramaSyH = req.body.CronogramaSyH;
    var SeguroRC = req.body.SeguroRC;
    var Monotributos = req.body.Monotributos;
    var SeguroAccidentesPersonales = req.body.SeguroAccidentesPersonales;
     //Permisos
     var HIDRAULICA = req.body.HIDRAULICA;
    var FERROCARRIL = req.body.FERROCARRIL;
    var PerMunicipal = req.body.PerMunicipal;
    var DNV = req.body.DNV;
    var DPV = req.body.DPV;
    var Irrigacion = req.body.Irrigacion;
    var PRIVADO = req.body.PRIVADO;
    var OTROSPERMISOS = req.body.Otrospermisos;
   //Interferencias
   var intTelefonicaPedida = req.body.intTelefonicaPedida;
    var intTelefonicaObtenida = req.body.intTelefonicaObtenida; 
    var intTelefonica = req.body.intTelefonica;
   
    var intAguaPedida = req.body.intAguaPedida;
    var intAguaObtenida = req.body.intAguaObtenida;
    var intAgua = req.body.intAgua;
   
    var intCloacasPedida = req.body.intCloacasPedida;
    var intCloacasObtenida = req.body.intCloacasObtenida;
    var intCloacas = req.body.intCloacas;
  
    var intElectricidadPedida = req.body.intElectricidadPedida;
    var intElectricidadObtenida = req.body.intElectricidadObtenida;
    var intElectricidad = req.body.intElectricidad;
  
   
    var intClaroPedida = req.body.intClaroPedida;
    var intClaroObtenida = req.body.intClaroObtenida;
    var intClaro = req.body.intClaro;
   
    var intArnet = req.body.intArnet;
    var intArnetPedida = req.body.intArnetPedida;
    var intArnetObtenida = req.body.intArnetObtenida;

    var intArsat = req.body.intArsat;
 var intArsatPedida = req.body.intArsatPedida;
    var intArsatObtenida = req.body.intArsatObtenida;

    var intTelecomPedida = req.body.intTelecomPedida;
    var intTelecomObtenida = req.body.intTelecomObtenida;
    var intTelecom = req.body.intTelecom;
   //Seccion Final
    var MatriculaFusionista = req.body.MatriculaFusionista;
    var MatriculaSoldador = req.body.MatriculaSoldador;
    var EstudioImpactoAmbiental= req.body.EstudioImpactoAmbiental;
    var CronogramaAmbiente = req.body.CronogramaAmbiente;
    var NotaCumplimentoNormativa = req.body.NotaCumplimentoNormativa;
    var DDJJNAG153 = req.body.DDJJNAG153;
    var AvisoInicioObraART = req.body.AvisoInicioObraART;
    var AvisoInicioObraIERIC = req.body.AvisoInicioObraIERIC;
    var ActaInicioEfectivo = req.body.ActaInicioEfectivo;
console.log("Mostrando opciones seleccionadas de las interferencias: Cloacas " + req.body.intCloacas +". Telefonica:" + req.body.intTelefonica + ".Claro: " + req.body.intClaro + ". Arnet:" + req.body.intArnet + ". Arsat:" + req.body.intArsat + ". Telecom: " + req.body.intTelecom);
    //Variables generales
    var DocumentacionObra,Seguridad,Interferencias,Permisos,Matriculas,Ambiente,Avisos, PermisosEspeciales;
    
 //Documentación de obra
 if(SolicitudInicioObras == "ok" && CertificadoRT=="ok" ){
    DocumentacionObra = "ok";
}
if(SolicitudInicioObras == "EnGestion" ||CertificadoRT=="EnGestion" ){
    DocumentacionObra = "EnGestion";
}
if(SolicitudInicioObras == "Sin presentar" ||CertificadoRT=="Sin presentar" ){
    DocumentacionObra = "Sin presentar";
}
 //Seguridad
 if(Programadeseguridad=="ok"&&CronogramaSyH=="ok" && SeguroRC=="ok" && Monotributos =="ok" && SeguroAccidentesPersonales=="ok"){
    Seguridad="ok";
}
if(Programadeseguridad=="EnGestion"||CronogramaSyH=="EnGestion" || SeguroRC=="EnGestion" || Monotributos =="EnGestion" || SeguroAccidentesPersonales=="EnGestion"){
    Seguridad="EnGestion";
}
if(Programadeseguridad=="Sin presentar"||CronogramaSyH=="Sin presentar" || SeguroRC=="Sin presentar" || Monotributos =="Sin presentar" || SeguroAccidentesPersonales=="Sin presentar"){
    Seguridad="Sin presentar";
}

    //Interferencias
    if(intAgua=="ok"|| (intAgua=="NC") &&intCloacas=="ok"|| (intCloacas=="NC")  && intElectricidad=="ok"|| (intElectricidad=="NC")  && intArsat =="ok"|| (intArsat=="NC")  && intClaro=="ok"|| (intClaro=="NC") && intTelefonica=="ok"|| (intTelefonica=="NC") && intArnet=="ok"|| (intArnet=="NC") && intTelecom=="ok"|| (intTelecom=="NC") ){
        Interferencias="ok";
    }
    if(intAgua=="EnGestion"|| intCloacas=="EnGestion" || intElectricidad=="EnGestion"|| intArsat =="EnGestion" || intClaro=="EnGestion" || intTelefonica=="EnGestion" || intArnet=="EnGestion"|| intTelecom=="EnGestion"
   || intAgua=="Pedida"|| intCloacas=="Pedida" || intElectricidad=="Pedida"|| intArsat =="Pedida" || intClaro=="Pedida" || intTelefonica=="Pedida" || intArnet=="Pedida"|| intTelecom=="Pedida"
    ){
        Interferencias="EnGestion";
    }
       //Permisos
       if((PerMunicipal=="ok" || PerMunicipal=="NC")  && (Irrigacion=="ok"|| Irrigacion=="NC") && (DPV=="ok"|| DPV=="NC")&& (DNV=="ok"|| DNV=="NC")&& (FERROCARRIL=="ok"|| FERROCARRIL=="NC") && (HIDRAULICA=="ok"|| HIDRAULICA=="NC") ){
        Permisos="ok";
         }
         if(PerMunicipal=="EnGestion" || Irrigacion=="EnGestion" || DPV=="EnGestion" || DNV=="EnGestion" || FERROCARRIL=="EnGestion" || HIDRAULICA=="EnGestion"){
            Permisos="EnGestion";
             }
            if (DPV=="ok"&&DNV=="ok"&&FERROCARRIL=="ok"&&HIDRAULICA=="ok") {
                PermisosEspeciales="ok";
            }
            if (DPV=="Visado"&&DNV=="Visado"&&FERROCARRIL=="Visado"&&HIDRAULICA=="Visado") {
                PermisosEspeciales="ok";
            }
            if (DPV=="EnGestion"||DNV=="EnGestion"||FERROCARRIL=="EnGestion"||HIDRAULICA=="EnGestion") {
                PermisosEspeciales="EnGestion";
            }
            if (DPV=="Observado"||DNV=="Observado"||FERROCARRIL=="Observado"||HIDRAULICA=="Observado") {
                PermisosEspeciales="Observado";
            }
            if (DPV=="EnGestion"||DNV=="EnGestion"||FERROCARRIL=="EnGestion"||HIDRAULICA=="EnGestion") {
                PermisosEspeciales="EnGestion";
            }
            if (DPV=="Pedir"||DNV=="Pedir"||FERROCARRIL=="Pedir"||HIDRAULICA=="Pedir") {
                PermisosEspeciales="Pedir";
            }
// Matriculas
if((MatriculaFusionista=="ok" || MatriculaFusionista=="NC") && (MatriculaSoldador=="ok" || MatriculaSoldador=="NC")){
    Matriculas="ok";
}
if(MatriculaFusionista=="EnGestion" || MatriculaSoldador=="EnGestion" ){
    Matriculas="EnGestion";
}
if(MatriculaFusionista=="EnGestion" || MatriculaSoldador=="EnGestion" ){
    Matriculas="EnGestion";
}
if(MatriculaFusionista==NULL || MatriculaSoldador==NULL || MatriculaFusionista=="" || MatriculaSoldador=="" ){
    Matriculas="Sin presentar";
}
//Ambiente
if((EstudioImpactoAmbiental=="ok" || EstudioImpactoAmbiental=="NC")&&(CronogramaAmbiente=="ok"|| CronogramaAmbiente=="NC")){
    Ambiente="ok";
    }
    if(EstudioImpactoAmbiental=="EnGestion" ||CronogramaAmbiente=="EnGestion"){
        Ambiente="EnGestion";
        }
        if(EstudioImpactoAmbiental=="pedir" ||CronogramaAmbiente=="pedir"){
            Ambiente="Sin presentar";
            }      
        // Avisos
if(AvisoInicioObraART=="ok"&&AvisoInicioObraIERIC=="ok" && ActaInicioEfectivo=="ok"){
    Avisos="ok";
}
if(AvisoInicioObraART=="EnGestion"||AvisoInicioObraIERIC=="EnGestion" || ActaInicioEfectivo=="EnGestion"){
    Avisos="EnGestion";
}
if(AvisoInicioObraART=="Sin presentar"||AvisoInicioObraIERIC=="Sin presentar"|| ActaInicioEfectivo=="Sin presentar"){
    Avisos="Sin presentar";
}

sql= 'Update clientes_tareasgenerales Set ? where Nombre=?';
connection.query(sql,[{ PlanDeTrabajo:PlanDeTrabajo,DocumentacionObra:DocumentacionObra,Seguridad:Seguridad,Interferencias:Interferencias,Permisos:Permisos,Matriculas:Matriculas,Ambiente:Ambiente,Avisos:Avisos,NotaCumplimentoNormativas:NotaCumplimentoNormativa,DDJJNAG153:DDJJNAG153, Avisos: Avisos, PermisosEspeciales: PermisosEspeciales}, Nombre],
    (error, results) => {

        if (error) {
            console.log(error);
           }
        })
        sql = 'Update clientes Set ? where id=?';
        connection.query(sql, [{
            //Segunda Parte
            MailAutorizacion: MailAutorizacion, PlanDeTrabajo:PlanDeTrabajo,SolicitudInicioObras:SolicitudInicioObras,CertificadoRT:CertificadoRT,Programadeseguridad:Programadeseguridad,
            CronogramaSyH:CronogramaSyH,SeguroRC:SeguroRC, Monotributos: Monotributos, SeguroAccidentesPersonales: SeguroAccidentesPersonales,
            Hidraulica: HIDRAULICA,Ferrocarriles: FERROCARRIL, PerMunicipal: PerMunicipal,DNV: DNV, DPV: DPV, Irrigacion: Irrigacion, Privado: PRIVADO,  Otrospermisos: OTROSPERMISOS,
            intTelefonicaObtenida: intTelefonicaObtenida, intTelefonicaPedida: intTelefonicaPedida, intClaroPedida: intClaroPedida, intClaroObtenida: intClaroObtenida,
        intAguaObtenida: intAguaObtenida, intAguaPedida: intAguaPedida, intCloacasObtenida: intCloacasObtenida, intCloacasPedida: intCloacasPedida, intElectricidadObtenida: intElectricidadObtenida,
        intElectricidadPedida: intElectricidadPedida, intArsatPedida:intArsatPedida, intArsatObtenida:intArsatObtenida, intArnetObtenida:intArnetObtenida,  intArnetPedida: intArnetPedida,
         intTelecomObtenida: intTelecomObtenida, intTelecomPedida: intTelecomPedida,
         //Estado de las interferencias
         intTelefonica: intTelefonica, intClaro: intClaro, intAgua: intAgua,
        intCloaca: intCloacas, intElectricidad: intElectricidad, intTelecom: intTelecom, intArnet: intArnet, intArsat: intArsat,
        
        MatriculaFusionista:MatriculaFusionista,MatriculaSoldador:MatriculaSoldador, EstudioImpactoAmbiental:EstudioImpactoAmbiental, CronogramaAmbiente: CronogramaAmbiente, NotaCumplimentoNormativa: NotaCumplimentoNormativa,  DDJJNAG153: DDJJNAG153,
        AvisoInicioObraIERIC: AvisoInicioObraIERIC,  AvisoInicioObraART: AvisoInicioObraART, ActaInicioEfectivo: ActaInicioEfectivo,
    }, id],
            (error, results) => {
    
                if (error) {
                    console.log(error);
                   }
    
                })
               
                res.redirect(req.get('referer'));
    
})
router.post('/actObrasCarpEcogas/:id', (req,res)=>{
    var id = req.body.id;
    var Nombre = req.body.Nombre;   
    var sql="";
var ActaDeInicio = req.body.ActasDeInicio;
var LibroOrdenesServicio = req.body.LibroOrdenesServicio;
var LibroNotasPedido = req.body.LibroNotasPedido;
var PCEntregadoInspeccion = req.body.PCEntregadoInspeccion;
var CronogramaFirmadoComitente = req.body.CronogramaFirmadoComitente;
var OrdenServicio = req.body.OrdenServicio;
var ActasFinales = req.body.ActasFinales;
var PlanosyCroquis = req.body.PlanosyCroquis;
var ConformeDePermisos = req.body.ConformeDePermisos;
var PruebaHermeticidad = req.body.PruebaHermeticidad;
var InformesFinales = req.body.InformesFinales;

// Variables externas a Caos
var PCEntregadoInspeccion= req.body.PCEntregadoInspeccion;
var AvisosDeObra= req.body.AvisosDeObra;

// Variables generales 
var Permisos = req.body.Permisos;
var Interferencias = req.body.Interferencias;

var DocumentacionInspeccion, ComunicacionObras;
// DocumentacionInspeccion
if(ActaDeInicio=="Presentado"&&Permisos=="Presentados"&&Interferencias=="Presentado"&&LibroOrdenesServicio=="Presentado"&&LibroNotasPedido=="Presentado"&&PCEntregadoInspeccion=="Presentado"&&AvisosDeObra=="Presentado"&&CronogramaFirmadoComitente=="Presentado"){
    DocumentacionInspeccion="ok";
}
if(ActaDeInicio=="Sin presentar"||Permisos=="Sin presentar"||Interferencias=="Sin presentar"||LibroOrdenesServicio=="Sin presentar"||LibroNotasPedido=="Sin presentar"||PCEntregadoInspeccion=="Sin presentar"||AvisosDeObra=="Sin presentar"||CronogramaFirmadoComitente=="Sin presentar"){
    DocumentacionInspeccion="Sin presentar";
}
// ComunicacionObras
if(OrdenServicio=="No" ){
    ComunicacionObras="ok";
}
if(OrdenServicio=="Si"){
    ComunicacionObras="Leer historial de carpeta";
}
sql= 'Update clientes_tareasgenerales Set ? where Nombre=?';
connection.query(sql,[{ DocumentacionInspeccion:DocumentacionInspeccion,ComunicacionObras:ComunicacionObras}, Nombre],
    (error, results) => {

        if (error) {
            console.log(error);
           }
        })
        sql = 'Update clientes Set ? where id=?';
        connection.query(sql, [{
           
           ActaDeInicio: ActaDeInicio , Permisos: Permisos, Interferencias: Interferencias, LibroOrdenesServicio: LibroOrdenesServicio, LibroNotasPedido: LibroNotasPedido, PCEntregadoInspeccion: PCEntregadoInspeccion, AvisosDeObra:AvisosDeObra, CronogramaFirmadoComitente:CronogramaFirmadoComitente,
           OrdenServicio:OrdenServicio
        }, id],
            (error, results) => {
    
                if (error) {
                    console.log(error);
                   }
    
                })
               
                res.redirect(req.get('referer'));
    
})
router.post('/actCaosCarpEcogas/:id',(req,res)=>{
    var id = req.body.id;
    var Nombre = req.body.Nombre;   
    var sql="";
    var ActasFinales= req.body.ActasFinales;
    var PlanosyCroquis = req.body.PlanosyCroquis;
    var ConformeDePermisos = req.body.ConformeDePermisos;
    var PruebaHermeticidad = req.body.PruebaHermeticidad;
    var InformesFinales = req.body.InformesFinales;
    sql= 'Update clientes_tareasgenerales Set ? where Nombre=?';
connection.query(sql,[{ ActasFinalesEcogas: ActasFinales, PlanosyCroquis: PlanosyCroquis, ConformeEntidades: ConformeDePermisos, PruebaHermeticidad: PruebaHermeticidad, InformesFinales: InformesFinales}, Nombre],
    (error, results) => {
        if (error) {
            console.log(error);
           }
        })
    sql = 'Update clientes Set ? where id=?';
        connection.query(sql, [{
            //Segunda Parte
         ActasFinales: ActasFinales, PlanosyCroquis: PlanosyCroquis, ConformeDePermisos: ConformeDePermisos, PruebaHermeticidad: PruebaHermeticidad, InformesFinales: InformesFinales
    }, id],
            (error, results) => {
    
                if (error) {
                    console.log(error);
                   }
                })
                res.redirect(req.get('referer'));

            })
router.post('/actFinalCarpEcogas/:id', (req, res) => {
    var id = req.body.id;
    var Nombre = req.body.Nombre;   
    var sql="";
    var PresentacionFinal = req.body.PresentacionFinal;
    var HabilitacionObra = req.body.HabilitacionFinal;
    var HabilitacionFinal = req.body.HabilitacionFinal;

    sql= 'Update clientes_tareasgenerales Set ? where Nombre=?';
connection.query(sql,[{ PresentacionFinal:PresentacionFinal,HabilitacionObra:HabilitacionObra}, Nombre],
    (error, results) => {

        if (error) {
            console.log(error);
           }
         
        })
        sql='Update clientes Set ? where id=?';
        connection.query(sql, [{ PresentacionFinal: PresentacionFinal, HabilitacionFinal: HabilitacionFinal}, id],
            (error, results) => {
    
                if (error) {
                    console.log(error);
                   }
                })
                res.redirect(req.get('referer'));
})
//Opciones de editar tareas POST
router.post('/ActualizarEstadoCarpeta/:id', (req, res) => {
    var id = req.body.id;
    var Estado= req.body.Estado; 
    var sql = 'Update clientes Set ? where id=?';
    connection.query(sql, [{
        Estado: Estado
    }, id], (error, results) => {
        if (error) console.log( error);
        
    })
    res.redirect(req.get('referer'));


})