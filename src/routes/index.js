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
    if (error) throw error;
})

//Settings
//Fin de seteo de server original
//Rutas Get
router.get('/', (req, res) => {
    res.render('index.ejs');
})
router.get('/interferencias', (req, res) => {
    const sql = 'SELECT c.id, c.Nombre, c.NCarpeta, c.intTelefonica, c.intAgua, c.intCloaca, c.intClaro, c.intElectricidad, c.intArnet, c.intOtros FROM clientes c';
    res.locals.moment = moment;
    connection.query(sql, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
    res.render('paginas/AdministracionEcogas/interferencias.ejs', { results: results });
        }
        else {
            res.send('Ningun resultado encontrado');
        }
    })
    
})
router.get('/interferencias/info',(req,res)=>{
    const sql = 'SELECT c.id, c.Nombre, c.NCarpeta, c.intTelefonica, c.intAgua, c.intCloaca, c.intClaro, c.intElectricidad, c.intArnet, c.intOtros FROM clientes c';
    res.locals.moment = moment;
    connection.query(sql, (error, results) => {
        if (error) throw error;

        if (results.length > 0) {
            res.send(results); //en {results:results} lo que hago es guardar los resultados que envia la bd, en la variable results

        }
        else {
            res.send('Ningun resultado encontrado');
        }
    })
})
router.get('/adminecogas', (req, res) => {
    const sql = 'SELECT c.id, c.Nombre, c.NCarpeta, t.TareaRealizada, t.ProximaTarea, t.FechaLimite FROM clientes c, adgastareas t where c.Nombre = t.Nombre  ';
    res.locals.moment = moment;
    connection.query(sql, (error, results) => {
        if (error) throw error;

        if (results.length > 0) {
            res.render('paginas/AdministracionEcogas/adminecogas.ejs', { results: results }); //en {results:results} lo que hago es guardar los resultados que envia la bd, en la variable results

        }
        else {
            res.send('Ningun resultado encontrado');
        }
    })

})
router.get('/adminecogas/info', (req, res) => {
    const sql = 'SELECT c.id, c.Nombre, c.NCarpeta, t.TareaRealizada, t.ProximaTarea, t.FechaLimite, c.Estado FROM clientes c, adgastareas t where c.Nombre = t.Nombre  ';
    res.locals.moment = moment;
    connection.query(sql, (error, results) => {
        if (error) throw error;

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
    const sql = 'SELECT * FROM clientes';
    connection.query(sql, (error, results) => {
        if (error) throw error;

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
        if (error) throw error;

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
        if (error) throw error;
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
        if (error) throw error;
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
        if (error) throw error;
        if (results.length > 0) {

            res.render('paginas/AdministracionEcogas/edit', { user: results[0] });
        }
        else {

            res.render('/adminecogas');

        }
    })
})
router.get('/historialcarpeta/:Nombre', (req, res) => {
    const Nombre = req.params.Nombre;
    const sql = 'SELECT * FROM historialdecambios WHERE Nombre_sub =?';
    res.locals.moment = moment;
    connection.query(sql, [Nombre], (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.render('paginas/AdministracionEcogas/historialcarpeta.ejs', { results: results }); //en {results:results} lo que hago es guardar los resultados que envia la bd, en la variable results

        }
        else {
            res.render('paginas/AdministracionEcogas/historialcarpeta.ejs', { results: results });
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
            if (error) throw error;

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
    console.log("id es:" + id);
    const NombreCarpeta = req.body.NombreCarpeta;
    const NCarpeta = req.body.NCarpeta
    const Comitente = req.body.Comitente;
    const Departamento = req.body.Departamento;
    const DNV = req.body.DNV;
    const DPV = req.body.DPV;
    const IRRIGACION = req.body.IRRIGACION;
    const HIDRAULICA = req.body.HIDRAULICA;
    const FERROCARRIL = req.body.FERROCARRIL;
    const OTROSPERMISOS = req.body.OTROSPERMISOS;
    const TipoDeRed = req.body.TipoDeRed;
    //const TareaRealizada =req.body.TareaRealizada;
    //const ProximaTarea = req.body.ProximaTarea;
    const Fecha_limite = req.body.Fecha_limite;
    if (Fecha_limite) {
        console.log('fecha limite a actualizar es: ' + Fecha_limite);
        console.log('fecha limite a actualizar es: ' + req.body.Fecha_limite);
        //console.log(Tarea_Realizada: TareaRealizada, ProximaTarea: ProximaTarea);
        const sql = 'Update clientes Set ? where id =?';
        connection.query(sql, [{
            Nombre: NombreCarpeta, NCarpeta: NCarpeta, Comitente: Comitente, Ubicacion: Departamento, DNV: DNV, DPV: DPV, Irrigacion: IRRIGACION,
            Hidraulica: HIDRAULICA, Ferrocarriles: FERROCARRIL, TipoDeRed: TipoDeRed, Fecha_limite: Fecha_limite
        }, id]
            , (error, results) => {
                if (error) throw error;

                if (results.length > 0) {
                    res.redirect('paginas/AdministracionEcogas/adminecogas');
                }
                else {
                    res.redirect('paginas/AdministracionEcogas/adminecogas');

                }

            })
    }
    else {
        if (NombreCarpeta != null) {

            console.log('fecha limite a actualizar es: ' + Fecha_limite);
            console.log('fecha limite a actualizar es: ' + req.body.Fecha_limite);

            const sql = 'Update clientes Set ? where id =?';
            connection.query(sql, [{
                Nombre: NombreCarpeta, NCarpeta: NCarpeta, Comitente: Comitente, Ubicacion: Departamento, DNV: DNV, DPV: DPV, Irrigacion: IRRIGACION,
                Hidraulica: HIDRAULICA, Ferrocarriles: FERROCARRIL, TipoDeRed: TipoDeRed
            }, id]
                , (error, results) => {
                    if (error) throw error;

                    if (results.length > 0) {
                        res.redirect('paginas/AdministracionEcogas/adminecogas');
                    }
                    else {
                        res.redirect('paginas/AdministracionEcogas//adminecogas');

                    }

                })

        }
        else {
            const sql = 'Update clientes Set ? where id =?';
            connection.query(sql, [{
                NCarpeta: NCarpeta, Comitente: Comitente, Ubicación: Departamento, DNV: DNV, DPV: DPV, Irrigacion: IRRIGACION,
                Hidraulica: HIDRAULICA, Ferrocarriles: FERROCARRIL, TipoDeRed: TipoDeRed
            }, id]
                , (error, results) => {
                    if (error) throw error;

                    if (results.length > 0) {
                        res.redirect('paginas/AdministracionEcogas//adminecogas');
                    }
                    else {
                        res.redirect('paginas/AdministracionEcogas//adminecogas');

                    }

                })
        }
    }
}
)
router.post('/updatetareas/:id', (req, res) => {
    res.locals.moment = moment;
    const Nombre = req.body.Nombre;
    const id = req.body.id;
    console.log("id es: "+ id);
    const TareaRealizada = req.body.TareaRealizada;
    const ProximaTarea = req.body.ProximaTarea;
    const Fecha_limite = req.body.Fecha_limite;
    const EstadoCarpeta = req.body.Estado;
    let fecha = new Date();
    const Fecha_Tarea_sub = fecha;
    const Fecha_Proxima_Tarea_sub = req.body.Fecha_limite;
    var sql = "";
    if (Fecha_limite) {
        sql = 'Update  clientes set ? where id=?';
        connection.query(sql, [{ Estado: EstadoCarpeta }, id], (error, results) => {
            if (error) throw error;
            console.log("se cargo el estado en tabla clientes");

        })

        sql = 'Insert into historialdecambios set?';
        connection.query(sql, [{ Nombre_sub: Nombre, Tarea_Realizada_sub: TareaRealizada, Proxima_Tarea_sub: ProximaTarea, Fecha_Proxima_Tarea_sub: Fecha_Proxima_Tarea_sub, Fecha_Tarea_sub: Fecha_Tarea_sub }], (error, results) => {
            if (error) throw error;

            if (results.length > 0) {
                res.redirect('/adminecogas');
            }
        })

        sql = 'Update adgastareas Set ? where Nombre =?';
        connection.query(sql, [{
            TareaRealizada: TareaRealizada, ProximaTarea: ProximaTarea, FechaLimite: Fecha_limite
        }, Nombre], (error, results) => {
            if (error) throw error;

            if (results.length > 0) {
                res.redirect('/adminecogas');
            }
            else {
                res.redirect('/adminecogas');

            }

        })
    }
    else {
        sql = 'Update  clientes set ? where id =?';
        connection.query(sql, [{ Estado: EstadoCarpeta }, id], (error, results) => {
            if (error) throw error;
            console.log("se cargo el estado en tabla clientes");

        })
        sql = 'Insert into historialdecambios set?';
        connection.query(sql, [{ Nombre_sub: Nombre, Tarea_Realizada_sub: TareaRealizada, Proxima_Tarea_sub: ProximaTarea }], (error, results) => {
            if (error) throw error;

            if (results.length > 0) {
                res.redirect('/adminecogas');
            }
        })
        sql = 'Update adgastareas Set ? where Nombre =?';
        connection.query(sql, [{ TareaRealizada: TareaRealizada, ProximaTarea: ProximaTarea }, Nombre], (error, results) => {
            if (error) throw error;

            if (results.length > 0) {
                res.redirect('/adminecogas');
            }
            else {
                res.redirect('/adminecogas');

            }

        })

    }
}
)
router.post('/edit/delete/:id', (req, res) => {
    const id = req.params.id;
    var sql = 'Delete FROM clientes WHERE id =?';
    sql = 'Delete FROM clientes WHERE id =?'
    res.locals.moment = moment;
    connection.query(sql, [id], (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.render('adminecogas.ejs');
        }
        else {
            res.render('adminecogas.ejs');
        }
    })
})
router.post('/guardar', (req, res) => {
    const Nombre = req.body.NombreCarpeta;
    const NCarpeta = req.body.NCarpeta;
    const Comitente = req.body.Comitente;
    const Departamento = req.body.Departamento;
    const DNV = req.body.DNV;
    const DPV = req.body.DPV;
    const IRRIGACION = req.body.IRRIGACION;
    const HIDRAULICA = req.body.HIDRAULICA;
    const FERROCARRIL = req.body.FERROCARRIL;
    const OTROSPERMISOS = req.body.OTROSPERMISOS;
    const TipoDeRed = req.body.TipoDeRed
    // const TipoRed =req.body.Tipos-de-red;
    const sql = 'Insert into clientes set ?';
    connection.query(sql, {
        Nombre: Nombre, NCarpeta: NCarpeta, Comitente: Comitente, Ubicación: Departamento, DNV: DNV, DPV: DPV, Irrigacion: IRRIGACION,
        Hidraulica: HIDRAULICA, Ferrocarriles: FERROCARRIL, OtrosPermisos: OTROSPERMISOS, TipoDeRed: TipoDeRed
    }, (error, results) => {
        if (error) throw error;

        if (results.length > 0) {
            res.redirect('/adminecogas');
        }
        else {
            res.redirect('/adminecogas');

        }
    })

})
//Opciones de editar tareas POST
router.post('/actualizarEtapas/:id',(req,res)=>{
    const id = req.body.id;
    const Mensura = req.body.Mensura;
    const TituloDePropiedad = req.body.TituloDePropiedad;
    const DocSociedad = req.body.DocumentaciónSociedad;
    const Comercial = req.body.Comercial;
    const Pcaprobado = req.body.PCaprobado;
    const CartaOferta = req.body.CartaOferta;
    const MailAutorizacion = req.body.MailAutorizacion;
    const CertificadoRT = req.body.CertificadoRT;
    var Interferencias = req.body.Interferencias;
    const Permisos = req.body.Permisos;
    const Programadeseguridad = req.body.Programadeseguridad;
    const intTelefonica = req.body.intTelefonica;
    const intClaro = req.body.intClaro;
    const intAgua = req.body.intAgua;
    const intCloacas = req.body.intCloaca;
    const intElectricidad = req.body.intElectricidad;
    const intOtros = req.body.intOtros;
    const intArnet = req.body.intArnet;
    const sql = 'Update clientes Set ? where id=?';
    console.log("int agua es: "+intAgua);
    if(intTelefonica == "EnGestion" || intClaro== "EnGestion" || intAgua== "EnGestion" || intCloacas== "EnGestion" || intElectricidad== "EnGestion" || intOtros== "EnGestion" || intArnet== "EnGestion" ){
        Interferencias="EnGestion";
    }
    if(intTelefonica == "ok" && intClaro== "ok" && intAgua== "ok" && intCloacas== "ok" && intElectricidad== "ok" && intOtros== "ok" && intArnet== "ok" ){
Interferencias="ok";
    }
    console.log("interferencias es:" + Interferencias);
    connection.query(sql, [{
        Mensura: Mensura, TituloDePropiedad: TituloDePropiedad, DocumentaciónSociedad: DocSociedad, Comercial: Comercial, 
        PCaprobado: Pcaprobado, intTelefonica: intTelefonica, intClaro: intClaro, intAgua:intAgua,
        intCloaca:intCloacas, intElectricidad:intElectricidad, intOtros:intOtros,intArnet:intArnet,
         CartaOferta: CartaOferta, MailAutorizacion:MailAutorizacion, CertificadoRT: CertificadoRT,
          Interferencias: Interferencias, Permisos: Permisos, Programadeseguridad: Programadeseguridad,}, id],
           (error, results) => {
               
            if (error) throw error;
            
            
            res.redirect(req.get('referer'));
           
        })
})