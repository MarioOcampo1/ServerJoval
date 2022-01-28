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
    const sql = 'SELECT c.id, c.Nombre, c.NCarpeta, c.TareaRealizada, c.ProximaTarea, c.FechaLimite FROM clientes c  ';
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
    const sql = 'SELECT c.id, c.Nombre, c.NCarpeta, c.TareaRealizada, c.ProximaTarea, c.FechaLimite, c.Estado FROM clientes c';
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
    const id = req.params.id;
    const Nombre = req.params.Nombre;
    const sql = 'SELECT * FROM historialdecambios WHERE Nombre_sub =?';
    res.locals.moment = moment;
    connection.query(sql, [Nombre], (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.render('paginas/AdministracionEcogas/historialcarpeta.ejs', { results: results, id:id }); //en {results:results} lo que hago es guardar los resultados que envia la bd, en la variable results

        }
        else {
            res.render('paginas/AdministracionEcogas/historialcarpeta.ejs', { results: results, id:id });
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
    const TipoDeRed = req.body.TipoDeRed;
    console.log("id es:" + id);
    console.log("nombre carpeta:" + NombreCarpeta)
    console.log("el valor de hidraulica es:" + req.body.HIDRAULICA);
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
            Hidraulica: HIDRAULICA,Privado: PRIVADO, Ferrocarriles: FERROCARRIL, TipoDeRed: TipoDeRed, Fecha_limite: Fecha_limite
        }, id]
            , (error, results) => {
                if (error) throw error;

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
                    if (error) throw error;

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
                Hidraulica: HIDRAULICA, Ferrocarriles: FERROCARRIL, TipoDeRed: TipoDeRed
            }, id]
                , (error, results) => {
                    if (error) throw error;

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
    const Nombre = req.body.Nombre;
    const id = req.body.id;
    const TareaRealizada = req.body.TareaRealizada;
    const ProximaTarea = req.body.ProximaTarea;
    const Fecha_limite = req.body.Fecha_limite;
    const EstadoCarpeta = req.body.Estado;
    let fecha = new Date();
    const Fecha_Tarea_sub = fecha;
    
    var sql = "";
    
    if (Fecha_limite) {
        sql = 'Update  clientes set ? where id=?';
        connection.query(sql, [{ Estado: EstadoCarpeta, TareaRealizada: TareaRealizada, ProximaTarea: ProximaTarea, Fechalimite: Fecha_limite  }, id], (error, results) => {
            if (error) throw error;
            console.log("se cargo el estado en tabla clientes");

        })

        sql = 'Insert into historialdecambios set?';
        connection.query(sql, [{ Nombre_sub: Nombre, Tarea_Realizada_sub: TareaRealizada, Proxima_Tarea_sub: ProximaTarea, Fecha_Proxima_Tarea_sub: Fecha_limite, Fecha_Tarea_sub: Fecha_Tarea_sub }], (error, results) => {
            if (error) throw error;

            if (results.length > 0) {
                res.redirect('/adminecogas');
            }
        })
         res.redirect(req.get('referer'));
    }
    else {
        if(TareaRealizada){
            sql = 'Update  clientes set ? where id =?';
            connection.query(sql, [{ Estado: EstadoCarpeta, TareaRealizada: TareaRealizada, ProximaTarea: ProximaTarea}, id], (error, results) => {
                if (error) throw error;
                console.log("se cargo el estado en tabla clientes");
    
            })
            sql = 'Insert into historialdecambios set?';
            connection.query(sql, [{ Nombre_sub: Nombre, Tarea_Realizada_sub: TareaRealizada, Proxima_Tarea_sub: ProximaTarea, Fecha_Tarea_sub: Fecha_Tarea_sub }], (error, results) => {
                if (error) {
                    throw error;
                    setTimeout(function () {
                        res.redirect('/historialcarpeta/'+Nombre);
                      }, 3000);
    
                }
    
                if (results.length > 0) {
                    setTimeout(function () {
                        res.redirect('/historialcarpeta/'+Nombre);
                      }, 3000);
                }
            })
        }
        else{sql = 'Update  clientes set ? where id =?';
        connection.query(sql, [{ Estado: EstadoCarpeta, TareaRealizada: TareaRealizada, ProximaTarea: ProximaTarea}, id], (error, results) => {
            if (error) throw error;
            if (results.length > 0) {
                setTimeout(function () {
                    res.redirect('/historialcarpeta/'+Nombre);
                  }, 3000);
        }
        setTimeout(function () {
            res.redirect('/historialcarpeta/'+Nombre);
          }, 3000);
    }

)}}})
router.post('/edit/delete/:id', (req, res) => {
    const id = req.params.id;
    var sql = 'Delete FROM clientes WHERE id =?';
    sql = 'Delete FROM clientes WHERE id =?'
    res.locals.moment = moment;
    connection.query(sql, [id], (error, results) => {
        if (error) throw error;
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
        if (error) throw error;
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
    // const TipoRed =req.body.Tipos-de-red;
    if (DNV == null) {DNV="";}
    if (DPV == null) {DPV="";}
    if (IRRIGACION == null) {IRRIGACION="";}
    if (HIDRAULICA == null) {HIDRAULICA="";}
    if (FERROCARRIL == null) {FERROCARRIL="";}
    if (OTROSPERMISOS == null) {OTROSPERMISOS="";}
    var sql ='Insert into adgastareas set ?';
    connection.query(sql,{
        Nombre:Nombre},(error,results)=>{
            if(error) throw error;
        })
     sql = 'Insert into clientes set ?';
    connection.query(sql, {
        Nombre: Nombre, NCarpeta: NCarpeta, Comitente: Comitente, Ubicacion: Departamento, DNV: DNV, DPV: DPV, Irrigacion: IRRIGACION,
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
router.post('/guardarNuevoContacto', (req, res) => {
    const Nombre = req.body.Nombre;
    const Entidad = req.body.Entidad;
    const Area = req.body.Area;
    const Puesto = req.body.Puesto;
    const Telefono = req.body.Teléfono;
    const Correo = req.body.Correo;
    var sql ='Insert into contactos set ?';
    connection.query(sql,{
        Nombre:Nombre, Entidad: Entidad, Area: Area, Puesto: Puesto, Telefono: Telefono, Correo: Correo},(error,results)=>{
            if(error) throw error;
        })
            res.redirect('/contactos');
 

})
//Opciones de editar tareas POST
router.post('/actualizarEtapas/:id',(req,res)=>{
    const id = req.body.id;
    const Mensura = req.body.Mensura;
    const FechaFirmaContrato = req.body.FechaFirmaContrato;
    const Contrato = req.body.Contrato;
    const NotaDeExcepcion = req.body.NotaDeExcepcion;
    const PlanoTipo = req.body.PlanoTipo;
    const Sucedaneo = req.body.Sucedaneo;
    const DDJJNAG153 = req.body.DDJJNAG153;
    const SolicitudInicioObras = req.body.SolicitudInicioObras;
    const FechaInicioTrabajos = req.body.FechaInicioTrabajos;
    const FechaActividadActual = req.body.FechaActividadActual;
    const DocumentacionSociedad = req.body.DocumentacionSociedad;
    const ActaCargoVigente = req.body.ActaCargoVigente;
    const Cotizacion = req.body.Cotizacion;
    const LibroOrdenesServicio = req.body.LibroOrdenesServicio;
    const LibroNotasPedido = req.body.LibroNotasPedido;
    const AvisosDeObra = req.body.AvisosDeObra;
    const OrdenServicio = req.body.OrdenServicio;
    const CronogramaFirmadoComitente = req.body.CronogramaFirmadoComitente;
    const CronogramaSyH = req.body.CronogramaSyH;
    const AvisoInicioObraART = req.body.AvisoInicioObraART;
    const AvisoInicioObraIERIC = req.body.AvisoInicioObraIERIC;
    const SeguroRC = req.body.SeguroRC;
    const SeguroAccidentesPersonales = req.body.SeguroAccidentesPersonales;
    const PlanosyCroquis = req.body.PlanosyCroquis;
    const ActasFinales = req.body.ActasFinales;
    const ActaInicioEfectivo = req.body.ActaInicioEfectivo;
    const InformesFinales = req.body.InformesFinales;
    const ConformeDePermisos = req.body.ConformeDePermisos;
    const PresentacionFinal = req.body.PresentacionFinal;
    const PCrevisado = req.body.PCrevisado;
    const intArsat = req.body.intArsat;
    const PerMunicipal = req.body.PerMunicipal;
    const Monotributos = req.body.Monotributos;
    const CronogramaAmbiente = req.body.CronogramaAmbiente;
    const ActaDeInicio = req.body.ActaDeInicio;
    const PruebaHermeticidad = req.body.PruebaHermeticidad;
    const NotaCumplimentoNormativa= req.body.NotaCumplimentoNormativa;

    const TituloDePropiedad = req.body.TituloDePropiedad;
    const DocSociedad = req.body.DocumentaciónSociedad;
    const Comercial = req.body.Comercial;
    const Pcaprobado = req.body.PCaprobado;
    const CartaOferta = req.body.CartaOferta;
    const MailAutorizacion = req.body.MailAutorizacion;
    const CertificadoRT = req.body.CertificadoRT;
    var ActaConstitutiva = req.body.ActaConstitutiva;
    var DniComitente = req.body.DniComitente;
    var Interferencias = req.body.Interferencias;
    var Permisos = req.body.Permisos;
    const Programadeseguridad = req.body.Programadeseguridad;
    const intTelefonica = req.body.intTelefonica;
    const intClaro = req.body.intClaro;
    const intAgua = req.body.intAgua;
    const intCloacas = req.body.intCloaca;
    const intElectricidad = req.body.intElectricidad;
    const intTelecom = req.body.intTelecom;
    const intArnet = req.body.intArnet;
    const PlanoAnexo = req.body.PlanoAnexo;
    console.log("esta llegando desde el cliente, para la variable DNV lo siguiente:" + req.body.DNV);
    console.log("esta llegando desde el cliente, para la variable DNV1 lo siguiente:" + req.body.DNV1);
    if(req.body.DNV1 == req.body.DNV){
       
            var DNV = req.body.DNV;
        }
             
    else{
        if(req.body.DNV1==""){
            var DNV = req.body.DNV;
        }else{var DNV = req.body.DNV1;}   
       }
    if(req.body.IRRIGACION1 == req.body.IRRIGACION){
        var IRRIGACION = req.body.IRRIGACION1;
    }else{
        if(req.body.IRRIGACION1==""){
            var IRRIGACION = req.body.IRRIGACION;
        }else{var IRRIGACION = req.body.IRRIGACION1;}   
       }
    
    if(req.body.HIDRAULICA1 == req.body.HIDRAULICA){
        var HIDRAULICA = req.body.HIDRAULICA1;
    }else{
        if(req.body.HIDRAULICA1==""){
            var HIDRAULICA = req.body.HIDRAULICA;
        }else{var HIDRAULICA = req.body.HIDRAULICA1;}   
       }
    
    if(req.body.FERROCARRIL1 == req.body.FERROCARRIL){
        var FERROCARRIL = req.body.FERROCARRIL1;
    }else{
        if(req.body.FERROCARRIL1==""){
            var FERROCARRIL = req.body.FERROCARRIL;
        }else{var FERROCARRIL = req.body.FERROCARRIL1;} 
    }
    const DPV = req.body.DPV;
    const PRIVADO = req.body.PRIVADO;
    const OTROSPERMISOS = req.body.OTROSPERMISOS;
    const PermisoMunicipal = req.body.PerMunicipal;
    if ((DNV == "ok" || DNV == "NC") && (PermisoMunicipal== "ok" || PermisoMunicipal == "NC")&&(DPV == "ok"|| DPV == "NC") && (IRRIGACION == "ok"|| IRRIGACION == "NC") && (HIDRAULICA == "ok"|| HIDRAULICA == "NC") && (FERROCARRIL == "ok" || FERROCARRIL == "NC")&& (PRIVADO == "ok"|| PRIVADO == "NC") && (OTROSPERMISOS == "ok" || OTROSPERMISOS == "NC")){
        Permisos= "ok";
    }else{ Permisos="Ok"};
    
    const sql = 'Update clientes Set ? where id=?';
    console.log("int agua es: "+intAgua);
    if(intTelefonica == "EnGestion" || intClaro== "EnGestion" || intAgua== "EnGestion" || intCloacas== "EnGestion" || intElectricidad== "EnGestion" || intTelecom== "EnGestion" || intArnet== "EnGestion" || intArsat== "EnGestion" ){
        Interferencias="EnGestion";
        console.log("Actualizaretapas/// Ingreso al if de interferencias 'en gestion'");
    }
    if(intTelefonica == "ok" && intClaro== "ok" && intAgua== "ok" && intCloacas== "ok" && intElectricidad== "ok" && intOtros== "ok" && intArnet== "ok" ){
Interferencias="ok";
console.log("Actualizaretapas/// Ingreso al if de interferencias 'ok'");
    }
    connection.query(sql, [{
        Mensura: Mensura,FechaFirmaContrato:FechaFirmaContrato,Contrato:Contrato,NotaDeExcepcion:NotaDeExcepcion,
        PlanoTipo:PlanoTipo,Sucedaneo:Sucedaneo,DDJJNAG153:DDJJNAG153,SolicitudInicioObras:SolicitudInicioObras,
        FechaInicioTrabajos:FechaInicioTrabajos,FechaActividadActual:FechaActividadActual,
        DocumentacionSociedad:DocumentacionSociedad,ActaCargoVigente:ActaCargoVigente,Cotizacion:Cotizacion,
        LibroOrdenesServicio:LibroOrdenesServicio,LibroNotasPedido:LibroNotasPedido,AvisosDeObra:AvisosDeObra,OrdenServicio:OrdenServicio,
        CronogramaFirmadoComitente:CronogramaFirmadoComitente,CronogramaSyH:CronogramaSyH,AvisoInicioObraART:AvisoInicioObraART,
        AvisoInicioObraIERIC:AvisoInicioObraIERIC,SeguroRC:SeguroRC,SeguroAccidentesPersonales:SeguroAccidentesPersonales,
        PlanosyCroquis:PlanosyCroquis,PlanoAnexo:PlanoAnexo,ActasFinales:ActasFinales,ActaInicioEfectivo:ActaInicioEfectivo,InformesFinales:InformesFinales,
        ConformeDePermisos:ConformeDePermisos,PresentacionFinal:PresentacionFinal,PCrevisado:PCrevisado,intArsat:intArsat,
        PerMunicipal:PerMunicipal,Monotributos:Monotributos,CronogramaAmbiente:CronogramaAmbiente,ActaDeInicio:ActaDeInicio,
        PruebaHermeticidad:PruebaHermeticidad,DniComitente: DniComitente,NotaCumplimentoNormativa:NotaCumplimentoNormativa,
         TituloDePropiedad: TituloDePropiedad, 
        DocumentacionSociedad: DocSociedad, Comercial: Comercial, 
        PCaprobado: Pcaprobado, intTelefonica: intTelefonica, intClaro: intClaro, intAgua:intAgua,
        intCloaca:intCloacas, intElectricidad:intElectricidad, intTelecom:intTelecom,intArnet:intArnet, intArsat:intArsat,
         CartaOferta: CartaOferta,ActaConstitutiva: ActaConstitutiva,PerMunicipal:PermisoMunicipal, MailAutorizacion:MailAutorizacion, 
         CertificadoRT: CertificadoRT, DNV: DNV, DPV: DPV, Irrigacion: IRRIGACION,
         Hidraulica: HIDRAULICA,Privado:PRIVADO, Ferrocarriles: FERROCARRIL, Otrospermisos:OTROSPERMISOS,
         Interferencias: Interferencias, Permisos: Permisos, Programadeseguridad: Programadeseguridad,}, id],
           (error, results) => {
               
            if (error) throw error;
            
            
            res.redirect(req.get('referer'));
           
        })
})