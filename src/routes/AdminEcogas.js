const { render } = require('ejs');
const { Router } = require('express');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport');
const PassportLocal = require('passport-local').Strategy;
const router = Router();
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
router.use(passport.session());
passport.use(new PassportLocal(function (username, password, done) {
connection.query('Select * from usuariosregistrados',(error,results)=>{
    if(error) console.log(error);
for (let index = 0; index < results.length; index++) {
    const element = results[index];
    if (username == element.Usuario && password == element.Password) {
        return done(null, { id: element.id, name: element.Usuario });
    }
}    
})

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
        return done(null,{id: 4, name: "Daiana"});
        }
        if(err){return done(err);}
console.log("Ningun usuario encontrado");
    done(null, false); // Esta linea define a traves del null, que no hubo ningun error, pero el al mismo tiempo, a traves del false, indica que el usuario no se ha encontrado.
    // Cuando el sistema, quiere guardar que el usuario 1 ingreso al sistema, a esa llamada se le llama Serialización.
}))
passport.serializeUser(function (user, done) {
    done(null, user.id);
})
passport.deserializeUser(function (id, done) {
   if (id == 1) {
        done(null, { id: 1 });
    }
    if (id == 2) {
        done(null, { id: 2 });
    }
    if (id == 3) {
        done(null, { id: 3 });
    }
    if (id == 4) {
        done(null, { id: 4 });
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
//Fin de seteo de server original
//Rutas Get

router.post('/login', passport.authenticate('local', {
    successRedirect: "/index",
    failureRedirect: "/", failureMessage: true
})
)
router.get('/vencimientos', (req, res) => {
    // if(req.isAuthenticated()){
    const sql = 'SELECT c.Nombre, c.NCarpeta, c.intTelefonica, c.intTelefonicaPedida, c.intTelefonicaObtenida, c.intAgua, c.intAguaPedida, c.intAguaObtenida, c.intCloaca,c.intCloacasPedida, c.intCloacasObtenida, c.intClaro, c.intClaroPedida, c.intClaroObtenida, c.intElectricidad, c.intElectricidadPedida, c.intElectricidadObtenida, c.intArnet ,  c.intArnetPedida, c.intArnetObtenida,c.intArsat, c.intArsatPedida, c.intArsatObtenida, c.intTelecomPedida, c.intTelecomObtenida, c.intTelecom FROM adminecogas_interferencias_y_permisos c';
    res.locals.moment = moment;
    connection.query(sql, (error, results) => {
        if (error) console.log(error);
        if (results.length > 0) {
            res.render('paginas/AdministracionEcogas/vencimientos.ejs', { results: results });
        }
        else {
            res.send('Ningun resultado encontrado');
        }
    })

    // }
    // else{
    //     (req, res) => {
    //         res.redirect('/');
    //     }
    // }
})
router.get('/interferencias/info', (req, res) => {
    const sql = 'SELECT c.id, c.Nombre, c.NCarpeta, a.Seguridad, a.Interferencias, a.Avisos , a.Permisos FROM obras c, obras_tareasgenerales a where a.Nombre= c.Nombre';
    res.locals.moment = moment;
    connection.query(sql, (error, results) => {
        if (error) console.log(error);

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
    if (req.isAuthenticated()) {
        let sql;
        // INTERFERENCIAS
        var interferenciasypermisos;
sql= 'Select * from adminecogas_interferencias_y_permisos';
connection.query(sql, (error, results) => {
    if (error) console.log(error);

    if (results.length > 0) {
       interferenciasypermisos= results;
        }
    })
    setTimeout(() => {
        RevisarVencimientos();
    }, 2000);
    async function RevisarVencimientos(){
        var fechaActual = new Date().toUTCString();
        console.log(fechaActual);
        interferenciasypermisos.forEach(element => {
            if (element.intTelefonicaObtenida){}
        });
    }
   
        // FIN INTERFERENCIAS
        sql = 'SELECT c.id, c.Nombre, c.NCarpeta, b.TareaRealizada, b.ProximaTarea, b.EtapaTarea, b.FechaLimite FROM obras c , adminecogas_tareas_por_carpeta b  ';
        res.locals.moment = moment;
        connection.query(sql, (error, results) => {
            if (error) console.log(error);

            if (results.length > 0) {
                res.render('paginas/AdministracionEcogas/adminecogas.ejs', { results: results, interferenciasypermisos: interferenciasypermisos }); //en {results:results} lo que hago es guardar los resultados que envia la bd, en la variable results

            }
            else {
                res.render('paginas/AdministracionEcogas/nuevocliente.ejs');
            }
        })

    }
    else {
        res.redirect('/');
    }
})
router.get('/adminecogas/TablaGeneral', (req, res) => {
    // const sql = 'SELECT c.id, c.Nombre, c.NCarpeta,a.ResponsableDeTarea, c.TareaRealizada, c.ProximaTarea,c.EtapaTarea, c.FechaLimite, c.Estado FROM obras c, historialdecambios a where c.Nombre = a.Nombre_sub'; //SQL ORIGINAL
    var sql = 'Select a.NCarpeta,a.Estado,a.id, b.CodigoVigentes,b.CodigoEnUsoVigentes,b.CodigoFinalizadas, c.Nombre_sub,c.ResponsableDeTarea,c.Tarea_Realizada_sub, c.Proxima_Tarea_sub, c.Fecha_Proxima_Tarea_sub, c.EtapaTarea_sub, d.Interferencias, d.Permisos from obras a, codificacioncarpetas b, historialdecambios c, obras_tareasgenerales d  where a.Nombre = c.Nombre_sub AND a.Nombre = b.Nombre and d.Nombre = a.Nombre and c.Si_NO_TareaRealizada != "S"'; 
    res.locals.moment = moment;
    connection.query(sql, (error, results) => {
        if (error) console.log(error);

        if (results.length > 0) {


            res.send(results); //en {results:results} lo que hago es guardar los resultados que envia la bd, en la variable results

        }
        else {
            res.send('Ningun resultado encontrado');
        }
    })

})

router.get('/estadogeneral', (req, res) => {
    if (req.isAuthenticated()) {
        res.locals.moment = moment;
        const sql = 'SELECT e.CodigoVigentes, c.id, c.Nombre  ,c.NCarpeta,  c.Ubicacion ,c.Comitente ,c.Estado, c.Fechafirmacontrato  ,b.DocumentacionTerreno ,b.DocumentacionSociedad ,b.DocumentacionContractual  ,b.Comercial ,b.Tecnica ,b.PermisosEspeciales ,b.DocumentacionObra  ,b.Seguridad,b.Interferencias, b.Permisos, b.PlanDeTrabajo, b.Matriculas, b.Ambiente, b.NotaCumplimentoNormativas, b.DDJJNAG153, b.Avisos, b.DocumentacionInspeccion, b.ComunicacionObras, b.ActasFinalesEcogas, b.PlanosyCroquis, b.ConformeEntidades, b.PruebaHermeticidad, b.InformesFinales, b.PresentacionFinal, d.MailAutorizacion, b.HabilitacionObra, b.DocumentacionAmbiental  from obras_tareasgenerales b , codificacioncarpetas e, obras c, adminecogas_tareas_por_carpeta d where b.Nombre = c.Nombre AND b.Nombre = e.Nombre AND d.Nombre = e.Nombre';
        // const sql = 'SELECT c.id, c.Nombre  ,c.NCarpeta,  c.Ubicacion ,c.Comitente ,c.Estado, c.Fechafirmacontrato ,b.DocumentacionTerreno, b.DocumentacionSociedad,b.DocumentacionContractual  ,b.Comercial ,b.Tecnica,b.PermisosEspeciales ,b.DocumentacionObra  ,b.Seguridad,b.Interferencias, b.Permisos, b.PlanDeTrabajo, b.Matriculas, b.Ambiente, b.NotaCumplimentoNormativas, b.DDJJNAG153, b.Avisos, b.DocumentacionInspeccion, b.ComunicacionObras, b.ActasFinalesEcogas, b.PlanosyCroquis, b.ConformeEntidades, b.PruebaHermeticidad, b.InformesFinales,b.PresentacionFinal, b.HabilitacionObra  from obras c , obras_tareasgenerales b  ';
        // const sql='Select * from obras c';
        // const sql='Select * from obras_tareasgenerales b';

        connection.query(sql, (error, results) => {
            if (error) console.log(error);
            if (results.length > 0) {
                res.render('paginas/AdministracionEcogas/estadogeneral.ejs', { results: results }); //en {results:results} lo que hago es guardar los resultados que envia la bd, en la variable results
                // res.send(results);

            } else {
                res.send('Ningun resultado encontrado');


            }
        })

    }
    else {
        res.redirect('/');
    }
})

router.get('/contactos', (req, res) => {
    if (req.isAuthenticated()) {
        res.locals.moment = moment;
        const sql = 'SELECT * FROM contactos';
        connection.query(sql, (error, results) => {
            if (error) console.log(error);

            if (results.length > 0) {
                res.render('paginas/AdministracionEcogas/contactos.ejs', { results: results }); //en {results:results} lo que hago es guardar los resultados que envia la bd, en la variable results
                // res.send(results);
            }
            else {
                res.render('paginas/AdministracionEcogas/nuevocontacto.ejs');
            }
        })
    } else { res.redirect('/'); }
})
//Editar Tareas
router.get('/editarContacto/:id', (req, res) => {
    if (req.isAuthenticated()) {
        res.locals.moment = moment;
        const id = req.params.id;
        console.log("id es:" + id);
        const sql = 'SELECT * FROM contactos where id =?';
        connection.query(sql, [id], (error, results) => {
            if (error) console.log(error);
            if (results.length > 0) {
                res.render('paginas/AdministracionEcogas/editarContacto', { user: results[0] });
            }
            else {
                res.render('/adminecogas');

            }
        })
    } else { res.redirect('/'); }

})
router.get('/editarTareas/:id', (req, res) => {
    if (req.isAuthenticated()) {
        res.locals.moment = moment;
        const id = req.params.id;
        var Nombre = '';
        var sql = 'Select Nombre from obras where id=?';
        var resultados;
        connection.query(sql, [id], (error, results) => {

            if (error) console.log(error);
            if (results.length > 0) {
                var contador = 0;
                Nombre = JSON.parse((JSON.stringify(results)), function (k, v) {
                    if (contador == 0) {
                        contador = contador + 1;
                        Nombre = v;
                    }
                    return Nombre;
                });

            }
            console.log("Nombre al cual se esta ingresando:" + Nombre)
            sql = 'Select * from codificacioncarpetas Where Nombre=?';
            connection.query(sql, [Nombre], (error, results) => {
                if (error) console.log(error);
                var contador = 0;
                var CodigoVigentes = 0;
                var CodigoEnUsoVigentes = "";
                var CodigoFinalizadas = 0;

                JSON.parse((JSON.stringify(results)), function (k, v) {
                    if (contador == 1) {
                        CodigoVigentes = v;
                    }
                    if (contador == 2) {
                        CodigoEnUsoVigentes = v;
                    }
                    if (contador == 3) {
                        CodigoFinalizadas = v;
                    }
                    contador = contador + 1;
                });
                sql = 'Select * from adminecogas_interferencias_y_permisos Where Nombre=?';
                connection.query(sql, [Nombre], (error, interferenciasypermisos) => {
                    if (error) console.log(error);

                    sql = 'Select * from adminecogas_tareas_por_carpeta Where Nombre=?';
                    connection.query(sql, [Nombre], (error, tareasporcarpeta) => {
                        if (error) console.log(error);

                        sql = 'Select * from obras where id=?';

                        connection.query(sql, [id], (error, results) => {

                            if (error) console.log(error);
                            if (results.length > 0) {
                                //Se procede a enviar al front, los resultados de las consultas sql, prestar atencion que para que ejs pueda resolver el contenido de las sentencias hay que tratar las mismas como un arreglo [0], sino no funciona.
                                res.render('paginas/AdministracionEcogas/editarTareas', { user: results[0], interferenciasypermisos: interferenciasypermisos[0], tareasporcarpeta: tareasporcarpeta[0], CodigoVigentes: CodigoVigentes, CodigoEnUsoVigentes: CodigoEnUsoVigentes, CodigoFinalizadas: CodigoFinalizadas });
                           
                            }
                            else {
                                res.redirect('/adminecogas');
                            }
                        })
                    })
                })

            })
        })
    }
    else { res.redirect('/'); }
})
router.get('/EditarTareas2/:id', (req, res) => {
    res.locals.moment = moment;
    const id = req.params.id;
    var Nombre = '';
    var resultados;
    var NombreDeTarea; //Muestra el nombre de cada estado. Para poder mostrar en orden todos los datos de la carpeta.
    var InformacionDeLaCarpeta=[]; //Contiene la información de cada estado de la carpeta
    console.log(Nombre);

    var sql = 'Select Nombre from obras where id=?';
    connection.query(sql, [id], (error, results) => {

        if (error) console.log(error);
        if (results.length > 0) {
            var contador = 0;
            Nombre = JSON.parse((JSON.stringify(results)), function (k, v) {
                if (contador == 0) {
                    contador = contador + 1;
                    Nombre = v;
                }
                return Nombre;
            });

        }
        sql = 'Select * from adminecogas_distribucion_etapas_carpeta';
        connection.query(sql, [Nombre], (error, etapaTarea) => {
            if (error) console.log(error);
            var elementoJSON = JSON.parse((JSON.stringify(etapaTarea)), function (k, v) {
                var element = v;
                NombreDeTarea = etapaTarea;
                return "";
            });
        });

        sql = 'Select * from codificacioncarpetas Where Nombre=?';
        connection.query(sql, [Nombre], (error, results) => {
            if (error) console.log(error);
            var contador = 0;
            var CodigoVigentes = 0;
            var CodigoEnUsoVigentes = "";
            var CodigoFinalizadas = 0;

            JSON.parse((JSON.stringify(results)), function (k, v) {
                if (contador == 1) {
                    CodigoVigentes = v;
                }
                if (contador == 2) {
                    CodigoEnUsoVigentes = v;
                }
                if (contador == 3) {
                    CodigoFinalizadas = v;
                }
                contador = contador + 1;
            });
            sql = 'Select * from adminecogas_interferencias_y_permisos Where Nombre=?';
            connection.query(sql, [Nombre], (error, interferenciasypermisos) => {
                if (error) console.log(error);

                sql = 'Select * from adminecogas_tareas_por_carpeta Where Nombre=?';
                connection.query(sql, [Nombre], (error, InfoTareaPorCarpeta) => {
                    if (error) console.log(error);
                    JSON.parse((JSON.stringify(InfoTareaPorCarpeta)), function (k, v) {
                    InfoTareaPorCarpeta.forEach(element => {
                        InformacionDeLaCarpeta.push( k);
                        InformacionDeLaCarpeta.push(v);
                    })
                })
                    sql = 'Select * from obras where id=?';

                    connection.query(sql, [id], (error, results) => {

                        if (error) console.log(error);
                        if (results.length > 0) {


                            //Se procede a enviar al front, los resultados de las consultas sql, prestar atencion que para que ejs pueda resolver el contenido de las sentencias hay que tratar las mismas como un arreglo [0], sino no funciona.
                            res.render('paginas/AdministracionEcogas/editarTareas2.ejs', { user: results[0], NombreDeTarea: NombreDeTarea, tareasporcarpetaJSON: InformacionDeLaCarpeta, interferenciasypermisos: interferenciasypermisos[0], CodigoVigentes: CodigoVigentes, CodigoEnUsoVigentes: CodigoEnUsoVigentes, CodigoFinalizadas: CodigoFinalizadas });
                        }
                        else {
                            res.redirect('/adminecogas');
                        }
                    })
                })
            })

        })
    })
})
//
router.get('/edit/:id', (req, res) => {
    if (req.isAuthenticated()) {
        res.locals.moment = moment;
        const id = req.params.id;
        var Nombre;
        var interferenciasypermisos2;
        var sql = 'Select Nombre from obras where id=?'
        connection.query(sql, [id], (error, results) => {
            if (error) console.log(error);
            if (results.length > 0) {
                var contador = 0;
                JSON.parse((JSON.stringify(results)), function (k, v) {
                    if (contador == 0) {
                        contador = contador + 1;
                        Nombre = v;
                    }
                    return Nombre;
                });
            }
            sql = 'select CodigoVigentes from codificacioncarpetas where Nombre=?';
            connection.query(sql, [Nombre], (error, Codigo) => {
                if (error) console.log(error);
                var contador = 1;
                var CodigoBDLimpio;
                JSON.parse((JSON.stringify(Codigo)), function (k, v) {

                    if (contador == 1) {
                        contador = contador + 1;
                        CodigoBDLimpio = v;
                    }
                })
                sql = 'Select * from adminecogas_interferencias_y_permisos where Nombre=?';
                connection.query(sql, [Nombre], (error, interferenciasypermisos) => {
                    if (error) console.log(error);

                    interferenciasypermisos2 = interferenciasypermisos;
                
                    sql = 'Select TipoDeRed from adminecogas_tareas_por_carpeta where Nombre=?';
                    connection.query(sql, [Nombre], (error, TipoDeRed) => {
                        if (error) console.log(error);
    
                sql = 'Select * from obras where id=?';
                connection.query(sql, [id], (error, results) => {
                    if (error) console.log(error);
                    if (results.length > 0) {
                        console.log(interferenciasypermisos2);
                        res.render('paginas/AdministracionEcogas/edit', { user: results[0],TipoDeRed:TipoDeRed, Codigo: CodigoBDLimpio, interferenciasypermisos: interferenciasypermisos2 });
                    }
                    else {

                        res.render('/adminecogas');

                    }
                })
            })
            })
            })
        })

    } else { res.redirect('/'); }
})
router.get('/historialcarpeta/:Nombre', (req, res) => {
    if (req.isAuthenticated()) {
        var id;
        const Nombre = req.params.Nombre;
        var sql = 'SELECT id FROM obras WHERE Nombre =?';
        connection.query(sql, [Nombre], (error, results) => {
            if (error) console.log(error);
            if (results.length > 0) {

                id = Object.values(results[0]);
            }
        })

        sql = 'SELECT c.* FROM historialdecambios c WHERE Nombre_sub =?';
        res.locals.moment = moment;
        connection.query(sql, [Nombre], (error, results) => {
            if (error) console.log(error);
            if (results.length > 0) {
                res.render('paginas/AdministracionEcogas/historialcarpeta.ejs', { results: results, id: id, Nombre: Nombre }); //en {results:results} lo que hago es guardar los resultados que envia la bd, en la variable results

            }
            else {
                res.render('paginas/AdministracionEcogas/historialcarpeta.ejs', { results: results, id: id });
            }
        })

    } else { res.redirect('/'); }
})
router.get('/ComunicacionAlSistema', (req, res) => {
    if (req.isAuthenticated()) {
        res.locals.moment = moment;
        res.locals.moment = moment;
        const sql = 'Select * from comunicacionsistema';

        connection.query(sql, (error, results) => {
            if (error) console.log(error);
            if (results.length > 0) {
                res.render('paginas/AdministracionEcogas/ComunicacionAlSistema.ejs', { results: results });

            } else {
                res.render('paginas/AdministracionEcogas/ComunicacionAlSistema.ejs', { results: "" });


            }
        })

    } else { res.redirect('/'); }
})
router.get('/CodigoCarpeta', (req, res) => {
    if (req.isAuthenticated()) {
        res.locals.moment = moment;
        var sql = "";

        sql = 'Select * from codificacioncarpetas where CodigoVigentes is not null';
        connection.query(sql, (error, resultado) => {

            if (resultado.length > 0) {
                res.render('paginas/AdministracionEcogas/partials/editartareas/CodigoCarpeta.ejs', { resultado: resultado })
            } else {
                res.send("Ningun resultado encontrado");
            }
        })

    } else { res.redirect('/'); }
})
router.get('/GuiaParaElNuevo', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('paginas/AdministracionEcogas/GuiaParaNuevo.ejs');

    } else { res.redirect('/'); }
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
    console.log("intentando actualizar contacto " + Nombre);
    connection.query(sql, [{
        Nombre: Nombre, Entidad: entidad, Area: area, Puesto: Puesto, Telefono: Telefono, Correo: Correo
    }, id]
        , (error, results) => {
            if (error) console.log(error);

            if (results.length > 0) {
                res.redirect('/contactos');
            }
            else {
                res.redirect('/contactos');

            }

        })
})
router.post('/TareaOk/:Nombre', (req, res) => {
    const Nombre = req.params.Nombre;
    const TareaOk = req.body.TareaOK;
    const id = req.body.id;

    const sql = 'Update historialdecambios Set ? where Nombre_sub =? and id =?';
    connection.query(sql, [{
        Si_NO_TareaRealizada: TareaOk,
    }, Nombre, id]
        , (error, results) => {
            if (error) console.log(error);

            if (results.length > 0) {
                console.log("Intentando actualizar el estado de la tarea");
                console.log("La tarea realizada tendra el estado: " + TareaOk);
                console.log("El id de la tarea es: " + id);
                res.redirect(req.get('referer'));
            }
            else {
                console.log("Intentando actualizar el estado de la tarea");
                console.log("La tarea realizada tendra el estado: " + TareaOk);
                console.log("El id de la tarea es: " + id);
            } res.redirect(req.get('referer'));
        })
})
router.post('/update/:id', (req, res) => {
    res.locals.moment = moment;
    var CodigoNuevo = req.body.Codigo;
    var Codigo = req.body.CodigoOriginal; //Dicho valor, es el codigo original que tiene la base de datos antes de querer actualizarlo, ver el get de edit, para poder identificar la variable usada acá.
    if (CodigoNuevo == null || CodigoNuevo == "") {
        CodigoNuevo = Codigo;
    }
    var NombreOriginal = req.body.Nombre;
    var id = req.body.id;
    var NombreCarpeta = req.body.NombreCarpeta;
    var NCarpeta = req.body.NCarpeta
    var Comitente = req.body.Comitente;
    var Departamento = req.body.Ubicacion;
    var DNV = req.body.DNV;
    var DPV = req.body.DPV;
    var Irrigacion = req.body.Irrigacion;
    var HIDRAULICA = req.body.HIDRAULICA;
    var FERROCARRIL = req.body.FERROCARRIL;
    var OTROSPERMISOS = req.body.Otrospermisos;
    var Privado = req.body.Privado;
    var PerMunicipal = req.body.PerMunicipal;
    var sql = '';
    const DNVVisacion = req.body.DNV;
    const HIDRAULICAVisacion = req.body.HIDRAULICA;
    const FERROCARRILVisacion = req.body.FERROCARRIL;
    const TipoDeRed = req.body.TipoDeRed;
    console.log("Intentando actualizar el contacto:" + NombreCarpeta);
    //La siguiente parte del codigo, sirve para que la codificacion de la carpeta siempre se mantenga actualizada, y vigente.
    //Tambien, cuando se cambie el nombre de la carpeta, lo va a cambiar en todas las areas de la BD, para que no desaparezcan las tareas ni tampoco el historial.
    sql = 'Update codificacioncarpetas Set? where Nombre=?';
    connection.query(sql, [{
        CodigoVigentes: CodigoNuevo, CodigoEnUsoVigentes: "S", Nombre: NombreCarpeta
    }, NombreOriginal], (error, results) => {
        if (error) console.log(error);

    })
    //Se procede a buscar en la codificacion de las carpetas, si el codigo nuevo es de una carpeta Eliminada, dichas carpetas tienen en "CodigoEnUsoVigentes" una letra "E"
    //El objetivo es eliminar por completo la carpeta. 
    sql = "Delete from codificacioncarpetas where CodigoEnUsoVigentes='E' &&  CodigoVigentes=?"
    connection.query(sql, [CodigoNuevo], (error) => {
        if (error) console.log(error);
    })
    //En caso de que el codigo no provenga de la carpeta eliminada, sino de una finalizada, se procede
    //a dejar la carpeta finalizada sin "CodigoVigentes". 
    //Esto es con motivo de que deje de figurar como que el codigo esta disponible.
    sql = "Update codificacioncarpetas SET? where CodigoEnUsoVigentes='F' && CodigoVigentes=?";
    connection.query(sql, [{
        CodigoVigentes: null
    }, CodigoNuevo], (error) => {
        if (error) console.log(error);
    })
    sql = "Update codificacioncarpetas set? where Nombre=?";
    connection.query(sql, [{
        CodigoVigentes: CodigoNuevo, CodigoEnUsoVigentes: "S", Nombre: NombreCarpeta
    }, NombreOriginal], (error, results) => {
        if (error) console.log(error);

    })
    sql = 'Update obras_tareasgenerales Set? where Nombre=?';
    connection.query(sql, [{
        Nombre: NombreCarpeta
    }, NombreOriginal], (error, results) => {
        if (error) console.log(error);

    })
    sql = 'Update historialdecambios Set? where Nombre_sub=?';
    connection.query(sql, [{
        Nombre_sub: NombreCarpeta
    }, NombreOriginal], (error, results) => {
        if (error) console.log(error);

    })
    sql = 'Update adminecogas_interferencias_y_permisos set? where Nombre=?';
    connection.query(sql, [{
        Nombre: NombreCarpeta, NCarpeta: NCarpeta,
        DNV: DNV, DPV: DPV, Irrigacion: Irrigacion,
        Hidraulica: HIDRAULICA, Ferrocarriles: FERROCARRIL, PerMunicipal: PerMunicipal, Privado: Privado, Otrospermisos: OTROSPERMISOS

    }, NombreOriginal], (error, results) => {
        if (error) console.log(error);
    })
    sql = 'Update adminecogas_tareas_por_carpeta set? where Nombre=?';
    connection.query(sql, [{
        Nombre: NombreCarpeta, NCarpeta: NCarpeta, TipoDeRed:TipoDeRed

    }, NombreOriginal], (error, results) => {
        if (error) console.log(error);
    })
    sql = 'Update obras Set ? where id =?';
    connection.query(sql, [{
        Nombre: NombreCarpeta, NCarpeta: NCarpeta, Comitente: Comitente, Ubicacion: Departamento,
    }, id]
        , (error, results) => {
            if (error) console.log(error);
            res.redirect('/editarTareas/' + id);
        })
}
)
router.post('/edit/delete/:id', (req, res) => {
    const id = req.body.id;
    const Nombre = req.body.Nombre;
    var sql = ''
    sql = 'Update codificacioncarpetas set? where Nombre=?';
    connection.query(sql, [{
        CodigoEnUsoVigentes: "E"
    }, Nombre],
        (error, results) => {
            if (error) {
                console.log(error);
            }
        })
    sql = 'Delete FROM adminecogas_interferencias_y_permisos WHERE Nombre =?';
    connection.query(sql, [id], (error, results) => {
        if (error) console.log(error);
        if (results.length > 0) {

        }
    })
    sql = 'Delete FROM adminecogas_tareas_por_carpeta WHERE Nombre =?';
    connection.query(sql, [id], (error, results) => {
        if (error) console.log(error);
        if (results.length > 0) {

        }
    })
    sql = 'Delete FROM obras_tareasgenerales WHERE Nombre =?';
    connection.query(sql, [Nombre], (error, results) => {
        if (error) console.log(error);
    })
    sql = 'Update historialdecambios set? WHERE Nombre_sub =?';
    connection.query(sql, [{
        Si_NO_TareaRealizada: "S"
    }, Nombre], (error, results) => {
        if (error) console.log(error);
    })
    sql = 'Update obras set? WHERE id =?';
    res.locals.moment = moment;
    connection.query(sql, [{
        Estado: "ELIMINADO",
    }, id], (error, results) => {
        if (error) console.log(error);
        res.redirect('/adminecogas');
    })

})
router.post('/actPrelCarpEcogas/:id', (req, res) => {
    var id = req.body.id;
    var Nombre = req.body.Nombre;
    var sql = "";
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

    if ((Mensura == "ok" || Mensura == "NC") && (TituloDePropiedad == "ok" || TituloDePropiedad == "NC")) {
        DocumentacionTerreno = "ok";
    }
    if (Mensura == "EnGestion" || TituloDePropiedad == "EnGestion") {
        DocumentacionTerreno = "EnGestion";
    }
    if (Mensura == "Sin presentar" || TituloDePropiedad == "Sin presentar") {
        DocumentacionTerreno = "Sin presentar";
    }
    //Documentacion Sociedad
    if ((ActaConstitutiva == "ok" || ActaConstitutiva == "NC") && (ActaCargoVigente == "ok" || ActaCargoVigente == "NC")) {
        DocumentacionSociedad = "ok";
    }
    if (ActaConstitutiva == "EnGestion" || ActaCargoVigente == "EnGestion") {
        DocumentacionSociedad = "EnGestion";
    }
    if (ActaConstitutiva == "Sin presentar" || ActaCargoVigente == "Sin presentar") {
        DocumentacionSociedad = "Sin presentar";
    }
    //Documentacion Contractual
    if ((Cotizacion == "ok" || Cotizacion == "NC") && (Contrato == "Ok(Preliminar)" || Contrato == "ok" || Contrato == "NC(Preliminar)" || Contrato == "NC")) {
        DocumentacionContractual = "ok";
    }
    if (Cotizacion == "EnGestion" || (Contrato == "EnGestion" || Contrato == "EnGestion(Preliminar)")) {
        DocumentacionContractual = "EnGestion";
    }
    if (Cotizacion == "Sin presentar" || (Contrato == "Sin presentar" || Contrato == "Sin presentar(Preliminar)")) {
        DocumentacionContractual = "Sin presentar";
    }
    sql = 'Update obras_tareasgenerales Set ? where Nombre=?';
    connection.query(sql, [{
        DocumentacionTerreno: DocumentacionTerreno, DocumentacionSociedad: DocumentacionSociedad,
        DocumentacionContractual: DocumentacionContractual
    }, Nombre],
        (error, results) => {
            if (error) {
                console.log(error);
            }

        })
    sql = 'Update adminecogas_tareas_por_carpeta Set ? where Nombre=?';
    connection.query(sql, [{
        Mensura: Mensura, TituloDePropiedad: TituloDePropiedad, ActaCargoVigente: ActaCargoVigente, ActaConstitutiva: ActaConstitutiva,
        Cotizacion: Cotizacion, Contrato: Contrato
    }, Nombre],
        (error, results) => {
if (error)console.log(error);
            })

                //Seccion Actualizar Tareas
    
    let fecha = new Date();
    Nombre = req.body.Nombre;
    TareaRealizada = req.body.TareaRealizada;
    ProximaTarea = req.body.ProximaTarea;
    Fecha_limite = req.body.Fecha_limite;
    Fecha_Tarea_sub = fecha;
    ResponsableDeTarea = req.body.ResponsableDeTarea;
   var EtapaTarea = req.body.EtapaTarea;
   var tarea= req.body.Tarea;
   sql = "";
   res.locals.moment = moment;
   var arregloTareas = [];
   
   TareaRealizada.forEach((element,index) => {
    var tarearealizada = TareaRealizada[index];
    var proximatarea= ProximaTarea[index];
var fechalimite= Fecha_limite[index];
var fechatarea= Fecha_Tarea_sub;
var responsabletarea= ResponsableDeTarea[index];
var etapatarea= tarea[index];

    arregloTareas.push({
        tarearealizada,
        proximatarea,
        fechalimite,
        fechatarea,
        responsabletarea,
        etapatarea,
    });
   });
  
  arregloTareas.forEach(element => {
    if(element.tarearealizada==""){
        if(element.proximatarea==""){}
        else{
            if (element.fechalimite) {
                if(TareaRealizada!=null){
           sql='Update adminecogas_tareas_por_carpeta set? where id_obra=?';
           connection.query(sql, [{EtapaTarea: EtapaTarea, TareaRealizada:element.tarearealizada, Fechalimite: element.fechalimite}, id], (error,results)=>{
              if (error) console.log(error);
           } )
                  sql = 'Insert into historialdecambios set?';
                  connection.query(sql, [{ EtapaTarea_sub: EtapaTarea, Tarea: element.etapatarea, ResponsableDeTarea: element.responsabletarea, Si_NO_TareaRealizada: "N", Nombre_sub: Nombre, Tarea_Realizada_sub: element.tarearealizada, Proxima_Tarea_sub: element.proximatarea, Fecha_Proxima_Tarea_sub: element.fechalimite, Fecha_Tarea_sub: element.fechatarea }], (error, results) => {
                      if (error) console.log(error);
           
                     
                  })
                 
              }}
              else {
                if(TareaRealizada!=null){
                    sql='Update adminecogas_tareas_por_carpeta set? where id_obra=?';
                    connection.query(sql, [{EtapaTarea: EtapaTarea, TareaRealizada:element.tarearealizada,}, id], (error,results)=>{
                        if (error) console.log(error);
                    } )
                            sql = 'Insert into historialdecambios set?';
                            connection.query(sql, [{ EtapaTarea_sub: EtapaTarea, Tarea: element.etapatarea, ResponsableDeTarea: element.responsabletarea, Si_NO_TareaRealizada: "N", Nombre_sub: Nombre, Tarea_Realizada_sub: element.tarearealizada, Proxima_Tarea_sub: element.proximatarea, Fecha_Tarea_sub: element.fechatarea }], (error, results) => {
                                if (error) console.log(error);
                    
                                
                            })
                            
                        }else{
                
            }
            }
        }
    }
    else{
        if (element.fechalimite) {
            if(TareaRealizada!=null){
       sql='Update adminecogas_tareas_por_carpeta set? where id_obra=?';
       connection.query(sql, [{EtapaTarea: element.etapatarea, TareaRealizada:element.tarearealizada, Fechalimite: element.fechalimite}, id], (error,results)=>{
          if (error) console.log(error);
       } )
              sql = 'Insert into historialdecambios set?';
              connection.query(sql, [{ EtapaTarea_sub: EtapaTarea, Tarea: element.etapatarea, ResponsableDeTarea: element.responsabletarea, Si_NO_TareaRealizada: "N", Nombre_sub: Nombre, Tarea_Realizada_sub: element.tarearealizada, Proxima_Tarea_sub: element.proximatarea, Fecha_Proxima_Tarea_sub: element.fechalimite, Fecha_Tarea_sub: element.fechatarea }], (error, results) => {
                  if (error) console.log(error);
       
                 
              })
             
          }}
          else {
            if(TareaRealizada!=null){
                sql='Update adminecogas_tareas_por_carpeta set? where id_obra=?';
                connection.query(sql, [{EtapaTarea: EtapaTarea, TareaRealizada:TareaRealizada,}, id], (error,results)=>{
                    if (error) console.log(error);
                } )
                        sql = 'Insert into historialdecambios set?';
                        connection.query(sql, [{ EtapaTarea_sub: EtapaTarea, Tarea: element.etapatarea, ResponsableDeTarea: element.responsabletarea, Si_NO_TareaRealizada: "N", Nombre_sub: Nombre, Tarea_Realizada_sub: element.tarearealizada, Proxima_Tarea_sub: element.proximatarea, Fecha_Tarea_sub: element.fechatarea  }], (error, results) => {
                            if (error) console.log(error);
                
                            
                        })
                        
                    }else{
        }
        }
    }
  });
  
  res.redirect('/historialcarpeta/' + Nombre);
           
 

})
router.post('/act1pCarpEcogas/:id', (req, res) => {
    var id = req.body.id;
    var Nombre = req.body.Nombre;
    var sql = "";
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
    var FechaFirmaContrato = req.body.FechaFirmaContrato;
    var CuestionarioRelevamientoAmbiental = req.body.CuestionarioRelevamientoAmbiental;
    var DDJJInicialAmbiental = req.body.DDJJInicialAmbiental;
    var ListaVerificacionAmbiental = req.body.ListaVerificacionAmbiental;
    var DocumentacionAmbiente = "Sin Presentar";
    var TituloDePropiedad = req.body.TituloDePropiedad;
    var Mensura = req.body.Mensura;
    // Variables Generales
    var Comercial;
    var Tecnica, PermisosEspeciales;
      var DocumentacionTerreno;
    //Documentacion del terreno
    if ((Mensura == "ok" || Mensura == "NC") && (TituloDePropiedad == "ok" || TituloDePropiedad == "NC")) {
        DocumentacionTerreno = "ok";
    }
    if (Mensura == "EnGestion" || TituloDePropiedad == "EnGestion") {
        DocumentacionTerreno = "EnGestion";
    }
    if (Mensura == "Sin presentar" || TituloDePropiedad == "Sin presentar") {
        DocumentacionTerreno = "Sin presentar";
    }
    // Comercial
    if ((Contrato == "ok" || Contrato == "Ok(Preliminar)") && Presupuesto == "ok" && Sucedaneo == "ok" && (NotaDeExcepcion == "ok" || NotaDeExcepcion == "NC")) {
        Comercial = "ok";
    }
    if (Contrato == "EnGestion" || Presupuesto == "EnGestion" || (Sucedaneo == "EnGestion" || Sucedaneo == "Presentado") || (NotaDeExcepcion == "EnGestion" || NotaDeExcepcion == "Presentado")) {
        Comercial = "EnGestion";
    }
    if (Contrato == "Observado" || Presupuesto == "Observado" || Sucedaneo == "Observado" || NotaDeExcepcion == "Observado") {
        Comercial = "Observado";
    }
    if (Contrato == "Presentado" || Presupuesto == "Presentado" || Sucedaneo == "Presentado" || NotaDeExcepcion == "Presentado") {
        Comercial = "Presentado";
    }
    //Tecnica
    if ((Pcaprobado == "ok") && (PlanoTipo == "ok" || PlanoTipo == "NC")) {
        Tecnica = "ok";
        console.log("1La variable Tecnica va tener el valor: " + Tecnica);
    }
    if (Pcaprobado == "EnGestion" || PlanoTipo == "EnGestion") {
        Tecnica = "EnGestion";
        console.log("2La variable Tecnica va tener el valor: " + Tecnica);
    }
    if (Pcaprobado == "Presentado" || PlanoTipo == "Presentado") {
        Tecnica = "Presentado";
        console.log("3La variable Tecnica va tener el valor: " + Tecnica);
    }
    if (Pcaprobado == "Observado" || PlanoTipo == "Observado") {
        Tecnica = "Observado";
        console.log("4La variable Tecnica va tener el valor: " + Tecnica);
    }
    if (Pcaprobado == "Sin presentar" || PlanoTipo == "Sin presentar") {
        Tecnica = "Sin presentar";
        console.log("5La variable Tecnica va tener el valor: " + Tecnica);
    }
    //Permisos Especiales
    if ((CartaOferta == "ok" || CartaOferta == "NC" || CartaOferta == "") && (PlanoAnexo == "ok" || PlanoAnexo == "NC" || PlanoAnexo == "") && (DNVVisacion == "Visado" || DNVVisacion == "NC" || DNVVisacion == "") && (HidraulicaVisacion == "Visado" || HidraulicaVisacion == "NC" || HidraulicaVisacion == "") && (FerrocarrilesVisacion == "Visado" || FerrocarrilesVisacion == "NC" || FerrocarrilesVisacion == "")) {
        console.log("Permisos especiales sera cambiado a ok...");
        PermisosEspeciales = "ok";
    }
    if (CartaOferta == "EnGestion" || PlanoAnexo == "EnGestion" || DNVVisacion == "EnGestion"  || HidraulicaVisacion == "EnGestion"  || FerrocarrilesVisacion == "EnGestion" ) {
        PermisosEspeciales = "EnGestion";
    }
    if (CartaOferta == "Presentado"|| PlanoAnexo == "Presentado" || DNVVisacion == "Presentado"|| HidraulicaVisacion == "Presentado"|| FerrocarrilesVisacion == "Presentado"){

PermisosEspeciales="Presentado";
    }
    if (CartaOferta == "Observado" || PlanoAnexo == "Observado" || DNVVisacion == "Observado" || HidraulicaVisacion == "Observado" || FerrocarrilesVisacion == "Observado") {
        PermisosEspeciales = "Observado";
    }
    if (CartaOferta == "Sin presentar" || PlanoAnexo == "Sin presentar" || DNVVisacion == "Sin presentar" || HidraulicaVisacion == "Sin presentar" || FerrocarrilesVisacion == "Sin presentar" || CartaOferta == "Pedir" || PlanoAnexo == "Pedir" || DNVVisacion == "Pedir" || HidraulicaVisacion == "Pedir" || FerrocarrilesVisacion == "Pedir") {
        PermisosEspeciales = "Sin presentar";
    }
    //Documentacion Ambiental
    if (CuestionarioRelevamientoAmbiental == "ok" && DDJJInicialAmbiental == "ok" && (ListaVerificacionAmbiental == "ok" || ListaVerificacionAmbiental == "NC")) {
        DocumentacionAmbiente = "ok";
    }
    if (CuestionarioRelevamientoAmbiental == "EnGestion" || DDJJInicialAmbiental == "EnGestion" || ListaVerificacionAmbiental == "EnGestion") { DocumentacionAmbiente = "EnGestion" ; }
    if (CuestionarioRelevamientoAmbiental == "Presentado" || DDJJInicialAmbiental == "Presentado" || ListaVerificacionAmbiental == "Presentado") { DocumentacionAmbiente = "Presentado" ; }
    if (CuestionarioRelevamientoAmbiental == "Observado" || DDJJInicialAmbiental == "Observado" || ListaVerificacionAmbiental == "Observado") { DocumentacionAmbiente = "Observado" ; }
    sql = 'Update obras_tareasgenerales Set ? where Nombre=?';
    connection.query(sql, [{ DocumentacionTerreno:DocumentacionTerreno, Comercial: Comercial, Tecnica: Tecnica, PermisosEspeciales: PermisosEspeciales, DocumentacionAmbiental: DocumentacionAmbiente }, Nombre],
        (error, results) => {

            if (error) {
                console.log(error);
            }
        })
    sql = 'Update adminecogas_interferencias_y_permisos Set ? where Nombre=?';
    connection.query(sql, [{
        //Primera Parte
        HidraulicaVisacion: HidraulicaVisacion, DNVVisacion: DNVVisacion, FerrocarrilesVisacion: FerrocarrilesVisacion
    }, Nombre],
        (error, results) => {

            if (error) {
                console.log(error);
            }

        })
    sql = 'Update adminecogas_tareas_por_carpeta Set ? where Nombre=?';
    connection.query(sql, [{
        Mensura:Mensura,TituloDePropiedad:TituloDePropiedad,
        Contrato: Contrato, Presupuesto: Presupuesto, Sucedaneo: Sucedaneo, NotaDeExcepcion: NotaDeExcepcion, PCaprobado: Pcaprobado,
        PlanoTipo: PlanoTipo, CartaOferta: CartaOferta, PlanoAnexo: PlanoAnexo, CuestionarioRelevamientoAmbiental: CuestionarioRelevamientoAmbiental, DDJJInicialAmbiental: DDJJInicialAmbiental, ListaVerificacionAmbiental: ListaVerificacionAmbiental
    }, Nombre],
        (error, results) => {

            if (error) {
                console.log(error);
            }

        })

       //Seccion Actualizar Tareas
    
       let fecha = new Date();
       Nombre = req.body.Nombre;
       TareaRealizada = req.body.TareaRealizada;
       ProximaTarea = req.body.ProximaTarea;
       Fecha_limite = req.body.Fecha_limite;
       Fecha_Tarea_sub = fecha;
       ResponsableDeTarea = req.body.ResponsableDeTarea;
      var EtapaTarea = req.body.EtapaTarea;
      var tarea= req.body.Tarea;
      sql = "";
      res.locals.moment = moment;
      var arregloTareas = [];
      
      TareaRealizada.forEach((element,index) => {
       var tarearealizada = TareaRealizada[index];
       var proximatarea= ProximaTarea[index];
   var fechalimite= Fecha_limite[index];
   var fechatarea= Fecha_Tarea_sub;
   var responsabletarea= ResponsableDeTarea[index];
   var etapatarea = tarea[index];
   
   
       arregloTareas.push({
           tarearealizada,
           proximatarea,
           fechalimite,
           fechatarea,
           responsabletarea,
           etapatarea,
       });
      });
     
     arregloTareas.forEach(element => {
       if(element.tarearealizada==""){
           if(element.proximatarea==""){}
           else{
               if (element.fechalimite) {
                   if(TareaRealizada!=null){
              sql='Update adminecogas_tareas_por_carpeta set? where id_obra=?';
              connection.query(sql, [{EtapaTarea: EtapaTarea, TareaRealizada:element.tarearealizada, Fechalimite: element.fechalimite}, id], (error,results)=>{
                 if (error) console.log(error);
              } )
                     sql = 'Insert into historialdecambios set?';
                     connection.query(sql, [{ EtapaTarea_sub: element.etapatarea, ResponsableDeTarea: element.responsabletarea, Si_NO_TareaRealizada: "N", Nombre_sub: Nombre, Tarea_Realizada_sub: element.tarearealizada, Proxima_Tarea_sub: element.proximatarea, Fecha_Proxima_Tarea_sub: element.fechalimite, Fecha_Tarea_sub: element.fechatarea }], (error, results) => {
                         if (error) console.log(error);
              
                        
                     })
                    
                 }}
                 else {
                   if(TareaRealizada!=null){
                       sql='Update adminecogas_tareas_por_carpeta set? where id_obra=?';
                       connection.query(sql, [{EtapaTarea: EtapaTarea, TareaRealizada:element.tarearealizada,}, id], (error,results)=>{
                           if (error) console.log(error);
                       } )
                               sql = 'Insert into historialdecambios set?';
                               connection.query(sql, [{ EtapaTarea_sub:EtapaTarea, Tarea: element.etapatarea, ResponsableDeTarea: element.responsabletarea, Si_NO_TareaRealizada: "N", Nombre_sub: Nombre, Tarea_Realizada_sub: element.tarearealizada, Proxima_Tarea_sub: element.proximatarea, Fecha_Tarea_sub: element.fechatarea }], (error, results) => {
                                   if (error) console.log(error);
                       
                                   
                               })
                               
                           }else{
                   
               }
               }
           }
       }
       else{
           if (element.fechalimite) {
               if(TareaRealizada!=null){
          sql='Update adminecogas_tareas_por_carpeta set? where id_obra=?';
          connection.query(sql, [{EtapaTarea: EtapaTarea, TareaRealizada:element.tarearealizada, Fechalimite: element.fechalimite}, id], (error,results)=>{
             if (error) console.log(error);
          } )
                 sql = 'Insert into historialdecambios set?';
                 connection.query(sql, [{ EtapaTarea_sub: EtapaTarea, Tarea: element.etapatarea, ResponsableDeTarea: element.responsabletarea, Si_NO_TareaRealizada: "N", Nombre_sub: Nombre, Tarea_Realizada_sub: element.tarearealizada, Proxima_Tarea_sub: element.proximatarea, Fecha_Proxima_Tarea_sub: element.fechalimite, Fecha_Tarea_sub: element.fechatarea }], (error, results) => {
                     if (error) console.log(error);
          
                    
                 })
                
             }}
             else {
               if(TareaRealizada!=null){
                   sql='Update adminecogas_tareas_por_carpeta set? where id_obra=?';
                   connection.query(sql, [{EtapaTarea: EtapaTarea, TareaRealizada:TareaRealizada,}, id], (error,results)=>{
                       if (error) console.log(error);
                   } )
                           sql = 'Insert into historialdecambios set?';
                           connection.query(sql, [{ EtapaTarea_sub: EtapaTarea, Tarea: element.etapatarea, ResponsableDeTarea: element.responsabletarea, Si_NO_TareaRealizada: "N", Nombre_sub: Nombre, Tarea_Realizada_sub: element.tarearealizada, Proxima_Tarea_sub: element.proximatarea, Fecha_Tarea_sub: element.fechatarea  }], (error, results) => {
                               if (error) console.log(error);
                   
                               
                           })
                           
                       }else{
           }
           }
       }
     });
     res.redirect('/historialcarpeta/' + Nombre);
}
)
router.post('/act2pCarpEcogas/:id', (req, res) => {
    var id = req.body.id;
    var Nombre = req.body.Nombre;
    var sql = "";
    var FechaDiaActual = new Date()
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
    //Vencimientos de permisos, ART y Ieric
    var VencimientoFerrocarril, VencimientoHidraulica, VencimientoMunicipal, VencimientoDPV, VencimientoDNV, VencimientoIrrigacion, VencimientoPrivado, VencimientoOtrosPermisos, VencimientoAvisoObraIeric, VencimientoAvisoObraArt;
    VencimientoFerrocarril = req.body.VencimientoFerrocarril;
    VencimientoHidraulica = req.body.VencimientoHidraulica
    VencimientoMunicipal = req.body.VencimientoMunicipal;
    VencimientoDPV = req.body.VencimientoDPV;
    VencimientoDNV = req.body.VencimientoDNV;
    VencimientoIrrigacion = req.body.VencimientoIrrigacion;
    VencimientoPrivado = req.body.VencimientoPrivado;
    VencimientoOtrosPermisos = req.body.VencimientoOtrosPermisos;
    VencimientoAvisoObraArt = req.body.VencimientoAvisoObraArt;
    VencimientoAvisoObraIeric = req.body.VencimientoAvisoObraIeric;
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
    var EstudioImpactoAmbiental = req.body.EstudioImpactoAmbiental;
    var CronogramaAmbiente = req.body.CronogramaAmbiente;
    var NotaCumplimentoNormativa = req.body.NotaCumplimentoNormativa;
    var DDJJNAG153 = req.body.DDJJNAG153;
    var AvisoInicioObraART = req.body.AvisoInicioObraART;
    var AvisoInicioObraIERIC = req.body.AvisoInicioObraIERIC;
    var ActaInicioEfectivo = req.body.ActaInicioEfectivo;
    //Variables generales
    var DocumentacionObra, Seguridad, Interferencias, Permisos, Matriculas, Ambiente, Avisos, PermisosEspeciales;

    //Documentación de obra
    if (SolicitudInicioObras == "ok" && CertificadoRT == "ok") {
        DocumentacionObra = "ok";
    }
    if (SolicitudInicioObras == "Presentado" || CertificadoRT == "EnGestion") {
        DocumentacionObra = "EnGestion";
    }
    if (SolicitudInicioObras == "Sin presentar" || CertificadoRT == "Sin presentar") {
        DocumentacionObra = "Sin presentar";
    }
    //Seguridad
    if (Programadeseguridad == "ok" && CronogramaSyH == "ok" && SeguroRC == "ok" && (Monotributos == "ok" || Monotributos == "NC") && (SeguroAccidentesPersonales == "ok" || SeguroAccidentesPersonales == "NC")) {
        Seguridad = "ok";
    }
    if (Programadeseguridad == "EnGestion" || CronogramaSyH == "EnGestion" || SeguroRC == "EnGestion" || Monotributos == "EnGestion" || SeguroAccidentesPersonales == "EnGestion") {
        Seguridad = "EnGestion";
    }
    if (Programadeseguridad == "Sin presentar" || CronogramaSyH == "Sin presentar" || SeguroRC == "Sin presentar" || Monotributos == "Sin presentar" || SeguroAccidentesPersonales == "Sin presentar") {
        Seguridad = "Sin presentar";
    }

    //Interferencias
    if (intAgua == "ok" || (intAgua == "NC") && intCloacas == "ok" || (intCloacas == "NC") && intElectricidad == "ok" || (intElectricidad == "NC") && intArsat == "ok" || (intArsat == "NC") && intClaro == "ok" || (intClaro == "NC") && intTelefonica == "ok" || (intTelefonica == "NC") && intArnet == "ok" || (intArnet == "NC") && intTelecom == "ok" || (intTelecom == "NC")) {
        Interferencias = "ok";
    }
    if (intAgua == "EnGestion" || intCloacas == "EnGestion" || intElectricidad == "EnGestion" || intArsat == "EnGestion" || intClaro == "EnGestion" || intTelefonica == "EnGestion" || intArnet == "EnGestion" || intTelecom == "EnGestion"
        || intAgua == "Pedida" || intCloacas == "Pedida" || intElectricidad == "Pedida" || intArsat == "Pedida" || intClaro == "Pedida" || intTelefonica == "Pedida" || intArnet == "Pedida" || intTelecom == "Pedida"
    ) {
        Interferencias = "EnGestion";
    }

    //Vencimientos de interferencias (Si se vencen, se pondran en modo "Pedir")
    if (new Date(intAguaObtenida) < FechaDiaActual || new Date(intCloacasObtenida) < FechaDiaActual || new Date(intTelefonicaObtenida) < FechaDiaActual || new Date(intArnetObtenida) < FechaDiaActual || new Date(intClaroObtenida) < FechaDiaActual || new Date(intElectricidadObtenida) < FechaDiaActual || new Date(intTelecomObtenida) < FechaDiaActual) {
        Interferencias = "Pedir";
    }
    //Permisos
    if ((PerMunicipal == "Pedir" || Irrigacion == "Pedir" || DPV == "Pedir" || DNV == "Pedir" || FERROCARRIL == "Pedir" || HIDRAULICA == "Pedir") || (PerMunicipal == "pedir" || Irrigacion == "pedir" || DPV == "pedir" || DNV == "pedir" || FERROCARRIL == "pedir" || HIDRAULICA == "pedir") || (PerMunicipal == "Sin presentar" || Irrigacion == "Sin presentar" || DPV == "Sin presentar" || DNV == "Sin presentar" || FERROCARRIL == "Sin presentar" || HIDRAULICA == "Sin presentar")) {
        Permisos = "Pedir";
    }
    if ((PerMunicipal == "ok" || PerMunicipal == "NC") && (Irrigacion == "ok" || Irrigacion == "NC") && (DPV == "ok" || DPV == "NC") && (DNV == "ok" || DNV == "NC") && (FERROCARRIL == "ok" || FERROCARRIL == "NC") && (HIDRAULICA == "ok" || HIDRAULICA == "NC")) {
        Permisos = "ok";
    }
    if (PerMunicipal == "EnGestion" || Irrigacion == "EnGestion" || DPV == "EnGestion" || DNV == "EnGestion" || FERROCARRIL == "EnGestion" || HIDRAULICA == "EnGestion") {
        Permisos = "EnGestion";
    }
    if (DPV == "ok" && DNV == "ok" && FERROCARRIL == "ok" && HIDRAULICA == "ok") {
        PermisosEspeciales = "ok";
    }
    if ((DPV == "Visado" || DPV == "NC") && (DNV == "Visado" || DNV == "NC") && (FERROCARRIL == "Visado" || FERROCARRIL == "NC") && (HIDRAULICA == "Visado" || FERROCARRIL == "NC")) {
        PermisosEspeciales = "ok";
    }
    if (DPV == "EnGestion" || DNV == "EnGestion" || FERROCARRIL == "EnGestion" || HIDRAULICA == "EnGestion") {
        PermisosEspeciales = "EnGestion";
    }
    if (DPV == "Observado" || DNV == "Observado" || FERROCARRIL == "Observado" || HIDRAULICA == "Observado") {
        PermisosEspeciales = "Observado";
    }

    if (DPV == "Pedir" || DNV == "Pedir" || FERROCARRIL == "Pedir" || HIDRAULICA == "Pedir") {
        PermisosEspeciales = "Pedir";
    }
    // Matriculas
    if ((MatriculaFusionista == "ok" || MatriculaFusionista == "NC") && (MatriculaSoldador == "ok" || MatriculaSoldador == "NC")) {
        Matriculas = "ok";
    }
    if (MatriculaFusionista == "EnGestion" || MatriculaSoldador == "EnGestion") {
        Matriculas = "EnGestion";
    }
    if (MatriculaFusionista == "EnGestion" || MatriculaSoldador == "EnGestion") {
        Matriculas = "EnGestion";
    }
    if (MatriculaFusionista == NULL || MatriculaSoldador == NULL || MatriculaFusionista == "" || MatriculaSoldador == "") {
        Matriculas = "Sin presentar";
    }
    //Ambiente
    if ((EstudioImpactoAmbiental == "ok" || EstudioImpactoAmbiental == "NC") && (CronogramaAmbiente == "ok" || CronogramaAmbiente == "NC")) {
        Ambiente = "ok";
    }
    if (EstudioImpactoAmbiental == "EnGestion" || CronogramaAmbiente == "EnGestion") {
        Ambiente = "EnGestion";
    }
    if (EstudioImpactoAmbiental == "pedir" || CronogramaAmbiente == "pedir") {
        Ambiente = "Sin presentar";
    }
    // Avisos
    if (AvisoInicioObraART == "ok" && AvisoInicioObraIERIC == "ok" && ActaInicioEfectivo == "ok") {
        Avisos = "ok";
    }
    if (AvisoInicioObraART == "EnGestion" || AvisoInicioObraIERIC == "EnGestion" || ActaInicioEfectivo == "EnGestion") {
        Avisos = "EnGestion";
    }
    if (AvisoInicioObraART == "Sin presentar" || AvisoInicioObraIERIC == "Sin presentar" || ActaInicioEfectivo == "Sin presentar") {
        Avisos = "Sin presentar";
    }
    //Vencimientos de avisos
    if (new Date(VencimientoAvisoObraArt) < FechaDiaActual || new Date(VencimientoAvisoObraIeric) < FechaDiaActual) {
        Avisos = "Renovar";
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //Automatización de estados.
    //Esta seccion trabajara en base a las opciones elegidas por el usuario, permitiendo que se escriba texto en historial de la carpeta seleccionada, o cambiar otros estados de la misma.
    // if(MailAutorizacion=="Recibido"){
    //     var TextoenHistorial= "Se ha recibido el mail de autorización.";
    //     var TextoenHistorial2 ="Presentar Segunda parte."
    //     Comercial="Ok(S)";
    //     Tecnica="Ok(S)";
    //     sql = 'Insert into historialdecambios set ? where Nombre_sub =?';
    //     connection.query(sql,[{Nombre_sub:Nombre, Tarea_Realizada_sub: TextoenHistorial , Proxima_Tarea_sub: TextoenHistorial2 , Fecha_Tarea_sub: FechaDiaActual , Fecha_Proxima_Tarea_sub:(FechaDiaActual+5),EtapaTarea_sub:"2da parte"
    //     },Nombre], (error, results) => {
    //         if (error) {
    //             console.log(error);
    //         }
    //     })
    // }

    sql = 'Update obras_tareasgenerales Set ? where Nombre=?';
    connection.query(sql, [{
        PlanDeTrabajo: PlanDeTrabajo, DocumentacionObra: DocumentacionObra, Seguridad: Seguridad, Interferencias: Interferencias, Permisos: Permisos, Matriculas: Matriculas, Ambiente: Ambiente, Avisos: Avisos, NotaCumplimentoNormativas: NotaCumplimentoNormativa, DDJJNAG153: DDJJNAG153, Avisos: Avisos, PermisosEspeciales: PermisosEspeciales
    }, Nombre],
        (error, results) => {

            if (error) {
                console.log(error);
            }
        })
    sql = 'Update adminecogas_interferencias_y_permisos Set ? where Nombre=?';
    connection.query(sql, [{
        Hidraulica: HIDRAULICA, Ferrocarriles: FERROCARRIL, PerMunicipal: PerMunicipal, DNV: DNV, DPV: DPV, Irrigacion: Irrigacion, Privado: PRIVADO, Otrospermisos: OTROSPERMISOS,
        intTelefonicaObtenida: intTelefonicaObtenida, intTelefonicaPedida: intTelefonicaPedida, intClaroPedida: intClaroPedida, intClaroObtenida: intClaroObtenida,
        intAguaObtenida: intAguaObtenida, intAguaPedida: intAguaPedida, intCloacasObtenida: intCloacasObtenida, intCloacasPedida: intCloacasPedida, intElectricidadObtenida: intElectricidadObtenida,
        intElectricidadPedida: intElectricidadPedida, intArsatPedida: intArsatPedida, intArsatObtenida: intArsatObtenida, intArnetObtenida: intArnetObtenida, intArnetPedida: intArnetPedida,
        intTelecomObtenida: intTelecomObtenida, intTelecomPedida: intTelecomPedida,
        //Estado de las interferencias
        intTelefonica: intTelefonica, intClaro: intClaro, intAgua: intAgua,
        intCloaca: intCloacas, intElectricidad: intElectricidad, intTelecom: intTelecom, intArnet: intArnet, intArsat: intArsat,

        VencimientoDNV: VencimientoDNV, VencimientoDPV: VencimientoDPV, VencimientoFerrocarril: VencimientoFerrocarril, VencimientoHidraulica: VencimientoHidraulica, VencimientoIrrigacion: VencimientoIrrigacion, VencimientoMunicipal: VencimientoMunicipal, VencimientoOtrosPermisos: VencimientoOtrosPermisos, VencimientoPrivado: VencimientoPrivado, VencimientoAvisoObraArt: VencimientoAvisoObraArt, VencimientoAvisoObraIeric: VencimientoAvisoObraIeric
    }, Nombre],
        (error, results) => {

            if (error) {
                console.log(error);
            }
        })
    sql = 'Update adminecogas_tareas_por_carpeta Set ? where Nombre=?';
    connection.query(sql, [{
        //Segunda Parte
        MailAutorizacion: MailAutorizacion, PlanDeTrabajo: PlanDeTrabajo, SolicitudInicioObras: SolicitudInicioObras, CertificadoRT: CertificadoRT, Programadeseguridad: Programadeseguridad,
        CronogramaSyH: CronogramaSyH, SeguroRC: SeguroRC, Monotributos: Monotributos, SeguroAccidentesPersonales: SeguroAccidentesPersonales,
        MatriculaFusionista: MatriculaFusionista, MatriculaSoldador: MatriculaSoldador, EstudioImpactoAmbiental: EstudioImpactoAmbiental, CronogramaAmbiente: CronogramaAmbiente, NotaCumplimentoNormativa: NotaCumplimentoNormativa, DDJJNAG153: DDJJNAG153,
        ActaInicioEfectivo: ActaInicioEfectivo, AvisoInicioObraIERIC: AvisoInicioObraIERIC, AvisoInicioObraART: AvisoInicioObraART
    }, Nombre],
        (error, results) => {

            if (error) {
                console.log(error);
            }

        })

        //Seccion Actualizar Tareas
    
        let fecha = new Date();
        Nombre = req.body.Nombre;
        TareaRealizada = req.body.TareaRealizada;
        ProximaTarea = req.body.ProximaTarea;
        Fecha_limite = req.body.Fecha_limite;
        Fecha_Tarea_sub = fecha;
        ResponsableDeTarea = req.body.ResponsableDeTarea;
       var EtapaTarea = req.body.EtapaTarea;
       var tarea= req.body.Tarea;
       sql = "";
       res.locals.moment = moment;
       var arregloTareas = [];
       if(!Array.isArray(TareaRealizada)){
        var tarearealizada = TareaRealizada;
        var proximatarea= ProximaTarea;
    var fechalimite= Fecha_limite;
    var fechatarea= Fecha_Tarea_sub;
    var responsabletarea= ResponsableDeTarea;
    if(tarearealizada==""){
        if(proximatarea==""){}
        else{
            if (fechalimite) {
                if(TareaRealizada!=null){
           sql='Update adminecogas_tareas_por_carpeta set? where id_obra=?';
           connection.query(sql, [{EtapaTarea: EtapaTarea, TareaRealizada:tarearealizada, Fechalimite: fechalimite}, id], (error,results)=>{
              if (error) console.log(error);
           } )
                  sql = 'Insert into historialdecambios set?';
                  connection.query(sql, [{ EtapaTarea_sub: EtapaTarea, Tarea: tarea, ResponsableDeTarea: responsabletarea, Si_NO_TareaRealizada: "N", Nombre_sub: Nombre, Tarea_Realizada_sub: tarearealizada, Proxima_Tarea_sub: proximatarea, Fecha_Proxima_Tarea_sub: fechalimite, Fecha_Tarea_sub: fechatarea }], (error, results) => {
                      if (error) console.log(error);
           
                     
                  })
                 
              }}
              else {
                if(TareaRealizada!=null){
                    sql='Update adminecogas_tareas_por_carpeta set? where id_obra=?';
                    connection.query(sql, [{EtapaTarea: EtapaTarea, TareaRealizada:tarearealizada,}, id], (error,results)=>{
                        if (error) console.log(error);
                    } )
                            sql = 'Insert into historialdecambios set?';
                            connection.query(sql, [{ EtapaTarea_sub: EtapaTarea, ResponsableDeTarea: responsabletarea, Si_NO_TareaRealizada: "N", Nombre_sub: Nombre, Tarea_Realizada_sub: tarearealizada, Proxima_Tarea_sub: proximatarea, Fecha_Tarea_sub: fechatarea }], (error, results) => {
                                if (error) console.log(error);
                    
                                
                            })
                            
                        }else{
                
            }
            }
        }
    }


    else{
        if (Fecha_limite) {
            if(TareaRealizada!=null){
       sql='Update adminecogas_tareas_por_carpeta set? where id_obra=?';
       connection.query(sql, [{EtapaTarea: EtapaTarea, TareaRealizada:tarearealizada, Fechalimite: fechalimite}, id], (error,results)=>{
          if (error) console.log(error);
       } )
              sql = 'Insert into historialdecambios set?';
              connection.query(sql, [{ EtapaTarea_sub: EtapaTarea, ResponsableDeTarea: responsabletarea, Si_NO_TareaRealizada: "N", Nombre_sub: Nombre, Tarea_Realizada_sub: tarearealizada, Proxima_Tarea_sub: proximatarea, Fecha_Proxima_Tarea_sub: fechalimite, Fecha_Tarea_sub: fechatarea }], (error, results) => {
                  if (error) console.log(error);
       
                 
              })
             
          }}
          else {
            if(TareaRealizada!=null){
                sql='Update adminecogas_tareas_por_carpeta set? where id_obra=?';
                connection.query(sql, [{EtapaTarea: EtapaTarea, TareaRealizada:TareaRealizada,}, id], (error,results)=>{
                    if (error) console.log(error);
                } )
                        sql = 'Insert into historialdecambios set?';
                        connection.query(sql, [{ EtapaTarea_sub: EtapaTarea, ResponsableDeTarea: responsabletarea, Si_NO_TareaRealizada: "N", Nombre_sub: Nombre, Tarea_Realizada_sub: tarearealizada, Proxima_Tarea_sub: proximatarea, Fecha_Tarea_sub: fechatarea  }], (error, results) => {
                            if (error) console.log(error);
                
                            
                        })
                        
                    }else{
        }
        }
    }
  }
       else{

       TareaRealizada.forEach((element,index) => {
        var tarearealizada = TareaRealizada[index];
        var proximatarea= ProximaTarea[index];
    var fechalimite= Fecha_limite[index];
    var fechatarea= Fecha_Tarea_sub;
    var responsabletarea= ResponsableDeTarea[index];
    var etapatarea= tarea[index];
    
        arregloTareas.push({
            tarearealizada,
            proximatarea,
            fechalimite,
            fechatarea,
            responsabletarea,
            etapatarea,
        });
       });
     
      arregloTareas.forEach(element => {
        if(element.tarearealizada==""){
            if(element.proximatarea==""){}
            else{
                if (element.fechalimite) {
                    if(TareaRealizada!=null){
               sql='Update adminecogas_tareas_por_carpeta set? where id_obra=?';
               connection.query(sql, [{EtapaTarea: EtapaTarea, TareaRealizada:element.tarearealizada, Fechalimite: element.fechalimite}, id], (error,results)=>{
                  if (error) console.log(error);
               } )
                      sql = 'Insert into historialdecambios set?';
                      connection.query(sql, [{ EtapaTarea_sub: EtapaTarea,Tarea: element.etapatarea, ResponsableDeTarea: element.responsabletarea, Si_NO_TareaRealizada: "N", Nombre_sub: Nombre, Tarea_Realizada_sub: element.tarearealizada, Proxima_Tarea_sub: element.proximatarea, Fecha_Proxima_Tarea_sub: element.fechalimite, Fecha_Tarea_sub: element.fechatarea }], (error, results) => {
                          if (error) console.log(error);
               
                         
                      })
                     
                  }}
                  else {
                    if(TareaRealizada!=null){
                        sql='Update adminecogas_tareas_por_carpeta set? where id_obra=?';
                        connection.query(sql, [{EtapaTarea: EtapaTarea, TareaRealizada:element.tarearealizada,}, id], (error,results)=>{
                            if (error) console.log(error);
                        } )
                                sql = 'Insert into historialdecambios set?';
                                connection.query(sql, [{ EtapaTarea_sub: EtapaTarea, Tarea: element.etapatarea, ResponsableDeTarea: element.responsabletarea, Si_NO_TareaRealizada: "N", Nombre_sub: Nombre, Tarea_Realizada_sub: element.tarearealizada, Proxima_Tarea_sub: element.proximatarea, Fecha_Tarea_sub: element.fechatarea }], (error, results) => {
                                    if (error) console.log(error);
                        
                                    
                                })
                                
                            }else{
                    
                }
                }
            }
        }
        else{
            if (element.fechalimite) {
                if(TareaRealizada!=null){
           sql='Update adminecogas_tareas_por_carpeta set? where id_obra=?';
           connection.query(sql, [{EtapaTarea: EtapaTarea, TareaRealizada:element.tarearealizada, Fechalimite: element.fechalimite}, id], (error,results)=>{
              if (error) console.log(error);
           } )
                  sql = 'Insert into historialdecambios set?';
                  connection.query(sql, [{ EtapaTarea_sub: EtapaTarea, Tarea: element.etapatarea, ResponsableDeTarea: element.responsabletarea, Si_NO_TareaRealizada: "N", Nombre_sub: Nombre, Tarea_Realizada_sub: element.tarearealizada, Proxima_Tarea_sub: element.proximatarea, Fecha_Proxima_Tarea_sub: element.fechalimite, Fecha_Tarea_sub: element.fechatarea }], (error, results) => {
                      if (error) console.log(error);
           
                     
                  })
                 
              }}
              else {
               res.send("Las proximas tareas deben de contener su fecha limite de realización");
            }
        }
      });
    }
      res.redirect('/historialcarpeta/' + Nombre);
})
router.post('/actObrasCarpEcogas/:id', (req, res) => {
    var id = req.body.id;
    var Nombre = req.body.Nombre;
    var sql = "";
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
    var FechaInicioTrabajos = req.body.FechaInicioTrabajos;
    var FechaFindeobra = req.body.FechaFindeobra;
    // Variables externas a Caos
    var PCEntregadoInspeccion = req.body.PCEntregadoInspeccion;
    var AvisosDeObra = req.body.AvisosDeObra;

    // Variables generales 
    var Permisos = req.body.Permisos;
    var Interferencias = req.body.Interferencias;

    var DocumentacionInspeccion, ComunicacionObras;
    // DocumentacionInspeccion
    if (ActaDeInicio == "Presentado" && Permisos == "Presentados" && Interferencias == "Presentado" && LibroOrdenesServicio == "Presentado" && LibroNotasPedido == "Presentado" && PCEntregadoInspeccion == "Presentado" && AvisosDeObra == "Presentado" && CronogramaFirmadoComitente == "Presentado") {
        DocumentacionInspeccion = "ok";
    }
    if (ActaDeInicio == "Sin presentar" || Permisos == "Sin presentar" || Interferencias == "Sin presentar" || LibroOrdenesServicio == "Sin presentar" || LibroNotasPedido == "Sin presentar" || PCEntregadoInspeccion == "Sin presentar" || AvisosDeObra == "Sin presentar" || CronogramaFirmadoComitente == "Sin presentar") {
        DocumentacionInspeccion = "Sin presentar";
    }
    // ComunicacionObras
    if (OrdenServicio == "No") {
        ComunicacionObras = "ok";
    }
    if (OrdenServicio == "Si") {
        ComunicacionObras = "Leer historial de carpeta";
    }
    sql = 'Update obras_tareasgenerales Set ? where Nombre=?';
    connection.query(sql, [{ DocumentacionInspeccion: DocumentacionInspeccion, ComunicacionObras: ComunicacionObras }, Nombre],
        (error, results) => {

            if (error) {
                console.log(error);
            }
        })

    sql = 'Update adminecogas_tareas_por_carpeta Set ? where Nombre=?';
    if (FechaInicioTrabajos) {
        if (FechaFindeobra) {
            connection.query(sql, [{

                ActaDeInicio: ActaDeInicio, Permisos: Permisos, Interferencias: Interferencias, LibroOrdenesServicio: LibroOrdenesServicio, LibroNotasPedido: LibroNotasPedido, PCEntregadoInspeccion: PCEntregadoInspeccion, AvisosDeObra: AvisosDeObra, CronogramaFirmadoComitente: CronogramaFirmadoComitente,
                OrdenServicio: OrdenServicio, FechaInicioTrabajos: FechaInicioTrabajos, FechaFindeobra: FechaFindeobra
            }, Nombre],
                (error, results) => {

                    if (error) {
                        console.log(error);
                    }

                })
        }
        else {
            connection.query(sql, [{

                ActaDeInicio: ActaDeInicio, Permisos: Permisos, Interferencias: Interferencias, LibroOrdenesServicio: LibroOrdenesServicio, LibroNotasPedido: LibroNotasPedido, PCEntregadoInspeccion: PCEntregadoInspeccion, AvisosDeObra: AvisosDeObra, CronogramaFirmadoComitente: CronogramaFirmadoComitente,
                OrdenServicio: OrdenServicio, FechaInicioTrabajos: FechaInicioTrabajos
            }, Nombre],
                (error, results) => {

                    if (error) {
                        console.log(error);
                    }

                })
        }

    }
    else {
        connection.query(sql, [{

            ActaDeInicio: ActaDeInicio, Permisos: Permisos, Interferencias: Interferencias, LibroOrdenesServicio: LibroOrdenesServicio, LibroNotasPedido: LibroNotasPedido, PCEntregadoInspeccion: PCEntregadoInspeccion, AvisosDeObra: AvisosDeObra, CronogramaFirmadoComitente: CronogramaFirmadoComitente,
            OrdenServicio: OrdenServicio,
        }, Nombre],
            (error, results) => {

                if (error) {
                    console.log(error);
                }

            })
    }


      //Seccion Actualizar Tareas
    
      let fecha = new Date();
      Nombre = req.body.Nombre;
      TareaRealizada = req.body.TareaRealizada;
      ProximaTarea = req.body.ProximaTarea;
      Fecha_limite = req.body.Fecha_limite;
      Fecha_Tarea_sub = fecha;
      ResponsableDeTarea = req.body.ResponsableDeTarea;
     var EtapaTarea = req.body.EtapaTarea;
     var Tareas = req.body.Tarea;
     sql = "";
     res.locals.moment = moment;
     var arregloTareas = [];
     if(!Array.isArray(TareaRealizada)){
        var tarearealizada = TareaRealizada;
        var proximatarea= ProximaTarea;
    var fechalimite= Fecha_limite;
    var fechatarea= Fecha_Tarea_sub;
    var responsabletarea= ResponsableDeTarea;
    if(tarearealizada==""){
        if(proximatarea==""){}
        else{
            if (fechalimite) {
                if(TareaRealizada!=null){
           sql='Update adminecogas_tareas_por_carpeta set? where id_obra=?';
           connection.query(sql, [{EtapaTarea: EtapaTarea, TareaRealizada:tarearealizada, Fechalimite: fechalimite}, id], (error,results)=>{
              if (error) console.log(error);
           } )
                  sql = 'Insert into historialdecambios set?';
                  connection.query(sql, [{ EtapaTarea_sub: EtapaTarea, ResponsableDeTarea: responsabletarea, Si_NO_TareaRealizada: "N", Nombre_sub: Nombre, Tarea_Realizada_sub: tarearealizada, Proxima_Tarea_sub: proximatarea, Fecha_Proxima_Tarea_sub: fechalimite, Fecha_Tarea_sub: fechatarea }], (error, results) => {
                      if (error) console.log(error);
           
                     
                  })
                 
              }}
              else {
                if(TareaRealizada!=null){
                    sql='Update adminecogas_tareas_por_carpeta set? where id_obra=?';
                    connection.query(sql, [{EtapaTarea: EtapaTarea, TareaRealizada:tarearealizada,}, id], (error,results)=>{
                        if (error) console.log(error);
                    } )
                            sql = 'Insert into historialdecambios set?';
                            connection.query(sql, [{ EtapaTarea_sub: EtapaTarea, ResponsableDeTarea: responsabletarea, Si_NO_TareaRealizada: "N", Nombre_sub: Nombre, Tarea_Realizada_sub: tarearealizada, Proxima_Tarea_sub: proximatarea, Fecha_Tarea_sub: fechatarea }], (error, results) => {
                                if (error) console.log(error);
                    
                                
                            })
                            
                        }else{
                
            }
            }
        }
    }


    else{
        if (Fecha_limite) {
            if(TareaRealizada!=null){
       sql='Update adminecogas_tareas_por_carpeta set? where id_obra=?';
       connection.query(sql, [{EtapaTarea: EtapaTarea, TareaRealizada:tarearealizada, Fechalimite: fechalimite}, id], (error,results)=>{
          if (error) console.log(error);
       } )
              sql = 'Insert into historialdecambios set?';
              connection.query(sql, [{ EtapaTarea_sub: EtapaTarea, ResponsableDeTarea: responsabletarea, Si_NO_TareaRealizada: "N", Nombre_sub: Nombre, Tarea_Realizada_sub: tarearealizada, Proxima_Tarea_sub: proximatarea, Fecha_Proxima_Tarea_sub: fechalimite, Fecha_Tarea_sub: fechatarea }], (error, results) => {
                  if (error) console.log(error);
       
                 
              })
             
          }}
          else {
            if(TareaRealizada!=null){
                sql='Update adminecogas_tareas_por_carpeta set? where id_obra=?';
                connection.query(sql, [{EtapaTarea: EtapaTarea, TareaRealizada:TareaRealizada,}, id], (error,results)=>{
                    if (error) console.log(error);
                } )
                        sql = 'Insert into historialdecambios set?';
                        connection.query(sql, [{ EtapaTarea_sub: EtapaTarea, ResponsableDeTarea: responsabletarea, Si_NO_TareaRealizada: "N", Nombre_sub: Nombre, Tarea_Realizada_sub: tarearealizada, Proxima_Tarea_sub: proximatarea, Fecha_Tarea_sub: fechatarea  }], (error, results) => {
                            if (error) console.log(error);
                
                            
                        })
                        
                    }else{
        }
        }
    }
  }
  else{
     TareaRealizada.forEach((element,index) => {
      var tarearealizada = TareaRealizada[index];
      var proximatarea= ProximaTarea[index];
  var fechalimite= Fecha_limite[index];
  var fechatarea= Fecha_Tarea_sub;
  var responsabletarea= ResponsableDeTarea[index];
  var etapatarea = Tareas[index];
  
      arregloTareas.push({
          tarearealizada,
          proximatarea,
          fechalimite,
          fechatarea,
          responsabletarea,
          etapatarea,
      });
     });
    
    arregloTareas.forEach(element => {
      if(element.tarearealizada==""){
          if(element.proximatarea==""){}
          else{
              if (element.fechalimite) {
                  if(TareaRealizada!=null){
             sql='Update adminecogas_tareas_por_carpeta set? where id_obra=?';
             connection.query(sql, [{EtapaTarea: element.etapatarea, TareaRealizada:element.tarearealizada, Fechalimite: element.fechalimite}, id], (error,results)=>{
                if (error) console.log(error);
             } )
                    sql = 'Insert into historialdecambios set?';
                    connection.query(sql, [{ EtapaTarea_sub: element.etapatarea, ResponsableDeTarea: element.responsabletarea, Si_NO_TareaRealizada: "N", Nombre_sub: Nombre, Tarea_Realizada_sub: element.tarearealizada, Proxima_Tarea_sub: element.proximatarea, Fecha_Proxima_Tarea_sub: element.fechalimite, Fecha_Tarea_sub: element.fechatarea }], (error, results) => {
                        if (error) console.log(error);
             
                       
                    })
                   
                }}
                else {
                  if(TareaRealizada!=null){
                      sql='Update adminecogas_tareas_por_carpeta set? where id_obra=?';
                      connection.query(sql, [{EtapaTarea: element.etapatarea, TareaRealizada:element.tarearealizada,}, id], (error,results)=>{
                          if (error) console.log(error);
                      } )
                              sql = 'Insert into historialdecambios set?';
                              connection.query(sql, [{ EtapaTarea_sub: element.etapatarea, ResponsableDeTarea: element.responsabletarea, Si_NO_TareaRealizada: "N", Nombre_sub: Nombre, Tarea_Realizada_sub: element.tarearealizada, Proxima_Tarea_sub: element.proximatarea, Fecha_Tarea_sub: element.fechatarea }], (error, results) => {
                                  if (error) console.log(error);
                      
                                  
                              })
                              
                          }else{
                  
              }
              }
          }
      }
      else{
          if (element.fechalimite!="") {
              if(element.tarearealizada!=null){
         sql='Update adminecogas_tareas_por_carpeta set? where id_obra=?';
         connection.query(sql, [{EtapaTarea: element.etapatarea, TareaRealizada:element.tarearealizada, Fechalimite: element.fechalimite}, id], (error,results)=>{
            if (error) console.log(error);
         } )
                sql = 'Insert into historialdecambios set?';
                connection.query(sql, [{ EtapaTarea_sub: element.etapatarea, ResponsableDeTarea: element.responsabletarea, Si_NO_TareaRealizada: "N", Nombre_sub: Nombre, Tarea_Realizada_sub: element.tarearealizada, Proxima_Tarea_sub: element.proximatarea, Fecha_Proxima_Tarea_sub: element.fechalimite, Fecha_Tarea_sub: element.fechatarea }], (error, results) => {
                    if (error) console.log(error);
         
                   
                })
               
            }}
            else {
              if(element.tarearealizada!=null){
                  sql='Update adminecogas_tareas_por_carpeta set? where id_obra=?';
                  connection.query(sql, [{EtapaTarea: element.etapatarea, TareaRealizada: element.tarearealizada,}, id], (error,results)=>{
                      if (error) console.log(error);
                  } )
                          sql = 'Insert into historialdecambios set?';
                          connection.query(sql, [{ EtapaTarea_sub: element.etapatarea, ResponsableDeTarea: element.responsabletarea, Si_NO_TareaRealizada: "N", Nombre_sub: Nombre, Tarea_Realizada_sub: element.tarearealizada, Proxima_Tarea_sub: element.proximatarea, Fecha_Tarea_sub: element.fechatarea  }], (error, results) => {
                              if (error) console.log(error);
                  
                              
                          })
                          
                      }else{
          }
          }
      }
    });
}
    res.redirect('/historialcarpeta/' + Nombre);
})
router.post('/actCaosCarpEcogas/:id', (req, res) => {
    var id = req.body.id;
    var Nombre = req.body.Nombre;
    var sql = "";
    var ActasFinales = req.body.ActasFinales;
    var PlanosyCroquis = req.body.PlanosyCroquis;
    var ConformeDePermisos = req.body.ConformeDePermisos;
    var PruebaHermeticidad = req.body.PruebaHermeticidad;
    var InformesFinales = req.body.InformesFinales;
    sql = 'Update obras_tareasgenerales Set ? where Nombre=?';
    connection.query(sql, [{ ActasFinalesEcogas: ActasFinales, PlanosyCroquis: PlanosyCroquis, ConformeEntidades: ConformeDePermisos, PruebaHermeticidad: PruebaHermeticidad, InformesFinales: InformesFinales }, Nombre],
        (error, results) => {
            if (error) {
                console.log(error);
            }
        })
    sql = 'Update adminecogas_tareas_por_carpeta Set ? where Nombre=?';
    connection.query(sql, [{
        //Segunda Parte
        ActasFinales: ActasFinales, PlanosyCroquis: PlanosyCroquis, ConformeDePermisos: ConformeDePermisos, PruebaHermeticidad: PruebaHermeticidad, InformesFinales: InformesFinales
    }, Nombre],
        (error, results) => {

            if (error) {
                console.log(error);
            }
        })
        var user = {id:id, Nombre:Nombre, etapa:"Caos",
    }
        //Seccion Actualizar Tareas
    
        let fecha = new Date();
        Nombre = req.body.Nombre;
        TareaRealizada = req.body.TareaRealizada;
        ProximaTarea = req.body.ProximaTarea;
        Fecha_limite = req.body.Fecha_limite;
        Fecha_Tarea_sub = fecha;
        ResponsableDeTarea = req.body.ResponsableDeTarea;
       var EtapaTarea = req.body.EtapaTarea;
       var tarea= req.body.Tarea;
       sql = "";
       res.locals.moment = moment;
       var arregloTareas = [];
       if(!(Array.isArray(TareaRealizada))){
        var tarearealizada = TareaRealizada;
        var proximatarea= ProximaTarea;
    var fechalimite= Fecha_limite;
    var fechatarea= Fecha_Tarea_sub;
    var responsabletarea= ResponsableDeTarea;
        if(tarearealizada==""){
            if(proximatarea==""){}
            else{
                if (fechalimite) {
                    if(TareaRealizada!=null){
               sql='Update adminecogas_tareas_por_carpeta set? where id_obra=?';
               connection.query(sql, [{EtapaTarea: EtapaTarea, TareaRealizada:tarearealizada, Fechalimite: fechalimite}, id], (error,results)=>{
                  if (error) console.log(error);
               } )
                      sql = 'Insert into historialdecambios set?';
                      connection.query(sql, [{ EtapaTarea_sub: EtapaTarea,Tarea: EtapaTarea, ResponsableDeTarea: responsabletarea, Si_NO_TareaRealizada: "N", Nombre_sub: Nombre, Tarea_Realizada_sub: tarearealizada, Proxima_Tarea_sub: proximatarea, Fecha_Proxima_Tarea_sub: fechalimite, Fecha_Tarea_sub: fechatarea }], (error, results) => {
                          if (error) console.log(error);
               
                         
                      })
                     
                  }}
                  else {
                    if(TareaRealizada!=null){
                        sql='Update adminecogas_tareas_por_carpeta set? where id_obra=?';
                        connection.query(sql, [{EtapaTarea: EtapaTarea, TareaRealizada:tarearealizada,}, id], (error,results)=>{
                            if (error) console.log(error);
                        } )
                                sql = 'Insert into historialdecambios set?';
                                connection.query(sql, [{ EtapaTarea_sub: EtapaTarea,Tarea: EtapaTarea, ResponsableDeTarea: responsabletarea, Si_NO_TareaRealizada: "N", Nombre_sub: Nombre, Tarea_Realizada_sub: tarearealizada, Proxima_Tarea_sub: proximatarea, Fecha_Tarea_sub: fechatarea }], (error, results) => {
                                    if (error) console.log(error);
                        
                                    
                                })
                                
                            }else{
                    
                }
                }
            }
        }
        else{
            if (fechalimite) {
                if(tarearealizada!=null){
           sql='Update adminecogas_tareas_por_carpeta set? where id_obra=?';
           connection.query(sql, [{EtapaTarea: EtapaTarea, Tarea: tarea, TareaRealizada:tarearealizada, Fechalimite: fechalimite}, id], (error,results)=>{
              if (error) console.log(error);
           } )
                  sql = 'Insert into historialdecambios set?';
                  connection.query(sql, [{ EtapaTarea_sub: EtapaTarea,Tarea: EtapaTarea, ResponsableDeTarea: responsabletarea, Si_NO_TareaRealizada: "N", Nombre_sub: Nombre, Tarea_Realizada_sub: tarearealizada, Proxima_Tarea_sub: proximatarea, Fecha_Proxima_Tarea_sub: fechalimite, Fecha_Tarea_sub: fechatarea }], (error, results) => {
                      if (error) console.log(error);
           
                     
                  })
                 
              }}
              else {
                if(TareaRealizada!=null){
                    sql='Update adminecogas_tareas_por_carpeta set? where id_obra=?';
                    connection.query(sql, [{EtapaTarea: EtapaTarea, TareaRealizada:TareaRealizada,}, id], (error,results)=>{
                        if (error) console.log(error);
                    } )
                            sql = 'Insert into historialdecambios set?';
                            connection.query(sql, [{ EtapaTarea_sub: EtapaTarea,Tarea: EtapaTarea, ResponsableDeTarea: responsabletarea, Si_NO_TareaRealizada: "N", Nombre_sub: Nombre, Tarea_Realizada_sub: tarearealizada, Proxima_Tarea_sub: proximatarea, Fecha_Tarea_sub: fechatarea  }], (error, results) => {
                                if (error) console.log(error);
                    
                                
                            })
                            
                        }else{
            }
            }
        }
      } else{
       TareaRealizada.forEach((element,index) => {
        var tarearealizada = TareaRealizada[index];
        var proximatarea= ProximaTarea[index];
    var fechalimite= Fecha_limite[index];
    var fechatarea= Fecha_Tarea_sub;
    var responsabletarea= ResponsableDeTarea[index];
    
    
        arregloTareas.push({
            tarearealizada,
            proximatarea,
            fechalimite,
            fechatarea,
            responsabletarea,
        });
       });
      
      arregloTareas.forEach(element => {
        if(element.tarearealizada==""){
            if(element.proximatarea==""){}
            else{
                if (element.fechalimite) {
                    if(element.tarearealizada==""){
               sql='Update adminecogas_tareas_por_carpeta set? where id_obra=?';
               connection.query(sql, [{EtapaTarea: element.etapatarea, TareaRealizada:element.tarearealizada, Fechalimite: element.fechalimite}, id], (error,results)=>{
                  if (error) console.log(error);
               } )
                      sql = 'Insert into historialdecambios set?';
                      connection.query(sql, [{ EtapaTarea_sub: EtapaTarea,Tarea: element.etapatarea, ResponsableDeTarea: element.responsabletarea, Si_NO_TareaRealizada: "N", Nombre_sub: Nombre, Tarea_Realizada_sub: element.tarearealizada, Proxima_Tarea_sub: element.proximatarea, Fecha_Proxima_Tarea_sub: element.fechalimite, Fecha_Tarea_sub: element.fechatarea }], (error, results) => {
                          if (error) console.log(error);
               
                         
                      })
                     
                  }}
                  else {
                    if(element.tarearealizada==""){
                        sql='Update adminecogas_tareas_por_carpeta set? where id_obra=?';
                        connection.query(sql, [{EtapaTarea: element.etapatarea, TareaRealizada:element.tarearealizada,}, id], (error,results)=>{
                            if (error) console.log(error);
                        } )
                                sql = 'Insert into historialdecambios set?';
                                connection.query(sql, [{ EtapaTarea_sub: element.etapatarea, ResponsableDeTarea: element.responsabletarea, Si_NO_TareaRealizada: "N", Nombre_sub: Nombre, Tarea_Realizada_sub: element.tarearealizada, Proxima_Tarea_sub: element.proximatarea, Fecha_Tarea_sub: element.fechatarea }], (error, results) => {
                                    if (error) console.log(error);
                        
                                    
                                })
                                
                            }else{
                    
                }
                }
            }
        }
        else{
            if (element.fechalimite) {
              
           sql='Update adminecogas_tareas_por_carpeta set? where id_obra=?';
           connection.query(sql, [{EtapaTarea: element.etapatarea, TareaRealizada:element.tarearealizada, Fechalimite: element.fechalimite}, id], (error,results)=>{
              if (error) console.log(error);
           } )
                  sql = 'Insert into historialdecambios set?';
                  connection.query(sql, [{ EtapaTarea_sub: element.etapatarea, ResponsableDeTarea: element.responsabletarea, Si_NO_TareaRealizada: "N", Nombre_sub: Nombre, Tarea_Realizada_sub: element.tarearealizada, Proxima_Tarea_sub: element.proximatarea, Fecha_Proxima_Tarea_sub: element.fechalimite, Fecha_Tarea_sub: element.fechatarea }], (error, results) => {
                      if (error) console.log(error);
           
                     
                  })
                 
              }
              else {
                if(element.tarearealizada!=""){
                    sql='Update adminecogas_tareas_por_carpeta set? where id_obra=?';
                    connection.query(sql, [{EtapaTarea: EtapaTarea, TareaRealizada:element.tarearealizada,}, id], (error,results)=>{
                        if (error) console.log(error);
                    } )
                            sql = 'Insert into historialdecambios set?';
                            connection.query(sql, [{ EtapaTarea_sub: element.etapatarea, ResponsableDeTarea: element.responsabletarea, Si_NO_TareaRealizada: "N", Nombre_sub: Nombre, Tarea_Realizada_sub: element.tarearealizada, Proxima_Tarea_sub: element.proximatarea, Fecha_Tarea_sub: element.fechatarea  }], (error, results) => {
                                if (error) console.log(error);
                    
                                
                            })
                            
                        }else{
            }
            }
        }
      });
    }
      res.redirect('/historialcarpeta/' + Nombre);
})
router.post('/actFinalCarpEcogas/:id', (req, res) => {
    var id = req.body.id;
    var Nombre = req.body.Nombre;
    var sql = "";
    var PresentacionFinal = req.body.PresentacionFinal;
    var HabilitacionObra = req.body.HabilitacionFinal;
    var HabilitacionFinal = req.body.HabilitacionFinal;

    sql = 'Update obras_tareasgenerales Set ? where Nombre=?';
    connection.query(sql, [{ PresentacionFinal: PresentacionFinal, HabilitacionObra: HabilitacionObra }, Nombre],
        (error, results) => {

            if (error) {
                console.log(error);
            }

        })
    sql = 'Update adminecogas_tareas_por_carpeta Set ? where Nombre=?';
    connection.query(sql, [{ PresentacionFinal: PresentacionFinal, HabilitacionFinal: HabilitacionFinal }, Nombre],
        (error, results) => {

            if (error) {
                console.log(error);
            }
        })
        var user = {id:id, Nombre:Nombre, etapa:"Finalizada",
    }
       //Seccion Actualizar Tareas
    
       let fecha = new Date();
       Nombre = req.body.Nombre;
       TareaRealizada = req.body.TareaRealizada;
       ProximaTarea = req.body.ProximaTarea;
       Fecha_limite = req.body.Fecha_limite;
       Fecha_Tarea_sub = fecha;
       ResponsableDeTarea = req.body.ResponsableDeTarea;
      var EtapaTarea = req.body.EtapaTarea;
      var tarea= req.body.Tarea;
      sql = "";
      res.locals.moment = moment;
      var arregloTareas = [];
      if(!(Array.isArray(TareaRealizada))){
        var tarearealizada = TareaRealizada;
        var proximatarea= ProximaTarea;
    var fechalimite= Fecha_limite;
    var fechatarea= Fecha_Tarea_sub;
    var responsabletarea= ResponsableDeTarea;
    
        if(tarearealizada==""){
            if(proximatarea==""){}
            else{
                if (fechalimite) {
                    if(TareaRealizada!=null){
               sql='Update adminecogas_tareas_por_carpeta set? where id_obra=?';
               connection.query(sql, [{EtapaTarea: EtapaTarea, TareaRealizada:tarearealizada, Fechalimite: fechalimite}, id], (error,results)=>{
                  if (error) console.log(error);
               } )
                      sql = 'Insert into historialdecambios set?';
                      connection.query(sql, [{ EtapaTarea_sub: EtapaTarea,Tarea: tarea, ResponsableDeTarea: responsabletarea, Si_NO_TareaRealizada: "N", Nombre_sub: Nombre, Tarea_Realizada_sub: tarearealizada, Proxima_Tarea_sub: proximatarea, Fecha_Proxima_Tarea_sub: fechalimite, Fecha_Tarea_sub: fechatarea }], (error, results) => {
                          if (error) console.log(error);
               
                         
                      })
                     
                  }}
                  else {
                    if(TareaRealizada!=null){
                        sql='Update adminecogas_tareas_por_carpeta set? where id_obra=?';
                        connection.query(sql, [{EtapaTarea: EtapaTarea, TareaRealizada:tarearealizada,}, id], (error,results)=>{
                            if (error) console.log(error);
                        } )
                                sql = 'Insert into historialdecambios set?';
                                connection.query(sql, [{ EtapaTarea_sub: EtapaTarea, ResponsableDeTarea: responsabletarea, Si_NO_TareaRealizada: "N", Nombre_sub: Nombre, Tarea_Realizada_sub: tarearealizada, Proxima_Tarea_sub: proximatarea, Fecha_Tarea_sub: fechatarea }], (error, results) => {
                                    if (error) console.log(error);
                        
                                    
                                })
                                
                            }else{
                    
                }
                }
            }
        }
        else{
            if (Fecha_limite) {
                if(TareaRealizada!=null){
           sql='Update adminecogas_tareas_por_carpeta set? where id_obra=?';
           connection.query(sql, [{EtapaTarea: EtapaTarea, TareaRealizada:tarearealizada, Fechalimite: fechalimite}, id], (error,results)=>{
              if (error) console.log(error);
           } )
                  sql = 'Insert into historialdecambios set?';
                  connection.query(sql, [{ EtapaTarea_sub: EtapaTarea, ResponsableDeTarea: responsabletarea, Si_NO_TareaRealizada: "N", Nombre_sub: Nombre, Tarea_Realizada_sub: tarearealizada, Proxima_Tarea_sub: proximatarea, Fecha_Proxima_Tarea_sub: fechalimite, Fecha_Tarea_sub: fechatarea }], (error, results) => {
                      if (error) console.log(error);
           
                     
                  })
                 
              }}
              else {
                if(TareaRealizada!=null){
                    sql='Update adminecogas_tareas_por_carpeta set? where id_obra=?';
                    connection.query(sql, [{EtapaTarea: EtapaTarea, TareaRealizada:TareaRealizada,}, id], (error,results)=>{
                        if (error) console.log(error);
                    } )
                            sql = 'Insert into historialdecambios set?';
                            connection.query(sql, [{ EtapaTarea_sub: EtapaTarea, ResponsableDeTarea: responsabletarea, Si_NO_TareaRealizada: "N", Nombre_sub: Nombre, Tarea_Realizada_sub: tarearealizada, Proxima_Tarea_sub: proximatarea, Fecha_Tarea_sub: fechatarea  }], (error, results) => {
                                if (error) console.log(error);
                    
                                
                            })
                            
                        }else{
            }
            }
        }
      }
      
  
      else{
      TareaRealizada.forEach((element,index) => {
       var tarearealizada = TareaRealizada[index];
       var proximatarea= ProximaTarea[index];
   var fechalimite= Fecha_limite[index];
   var fechatarea= Fecha_Tarea_sub;
   var responsabletarea= ResponsableDeTarea[index];
   var etapatarea = EtapaTarea[index];
   
       arregloTareas.push({
           tarearealizada,
           proximatarea,
           fechalimite,
           fechatarea,
           responsabletarea,
           etapatarea,
       });
      });
     
     arregloTareas.forEach(element => {
       if(element.tarearealizada==""){
           if(element.proximatarea==""){}
           else{
               if (element.fechalimite) {
                   if(TareaRealizada!=null){
              sql='Update adminecogas_tareas_por_carpeta set? where id_obra=?';
              connection.query(sql, [{EtapaTarea: element.etapatarea, TareaRealizada:element.tarearealizada, Fechalimite: element.fechalimite}, id], (error,results)=>{
                 if (error) console.log(error);
              } )
                     sql = 'Insert into historialdecambios set?';
                     connection.query(sql, [{ EtapaTarea_sub: EtapaTarea, Tarea: element.etapatarea, ResponsableDeTarea: element.responsabletarea, Si_NO_TareaRealizada: "N", Nombre_sub: Nombre, Tarea_Realizada_sub: element.tarearealizada, Proxima_Tarea_sub: element.proximatarea, Fecha_Proxima_Tarea_sub: element.fechalimite, Fecha_Tarea_sub: element.fechatarea }], (error, results) => {
                         if (error) console.log(error);
              
                        
                     })
                    
                 }}
                 else {
                   if(element.tarearealizada!=null){
                       sql='Update adminecogas_tareas_por_carpeta set? where id_obra=?';
                       connection.query(sql, [{EtapaTarea: element.etapatarea, TareaRealizada:element.tarearealizada,}, id], (error,results)=>{
                           if (error) console.log(error);
                       } )
                               sql = 'Insert into historialdecambios set?';
                               connection.query(sql, [{ EtapaTarea_sub: EtapaTarea, Tarea: element.etapatarea, ResponsableDeTarea: element.responsabletarea, Si_NO_TareaRealizada: "N", Nombre_sub: Nombre, Tarea_Realizada_sub: element.tarearealizada, Proxima_Tarea_sub: element.proximatarea, Fecha_Tarea_sub: element.fechatarea }], (error, results) => {
                                   if (error) console.log(error);
                       
                                   
                               })
                               
                           }else{
                   
               }
               }
           }
       }
       else{
           if (element.fechalimite) {
               if(element.tarearealizada!=null){
          sql='Update adminecogas_tareas_por_carpeta set? where id_obra=?';
          connection.query(sql, [{EtapaTarea: element.etapatarea, TareaRealizada:element.tarearealizada, Fechalimite: element.fechalimite}, id], (error,results)=>{
             if (error) console.log(error);
          } )
                 sql = 'Insert into historialdecambios set?';
                 connection.query(sql, [{ EtapaTarea_sub: EtapaTarea, Tarea: element.etapatarea, ResponsableDeTarea: element.responsabletarea, Si_NO_TareaRealizada: "N", Nombre_sub: Nombre, Tarea_Realizada_sub: element.tarearealizada, Proxima_Tarea_sub: element.proximatarea, Fecha_Proxima_Tarea_sub: element.fechalimite, Fecha_Tarea_sub: element.fechatarea }], (error, results) => {
                     if (error) console.log(error);
          
                    
                 })
                
             }}
             else {
               if(element.tarearealizada!=null){
                   sql='Update adminecogas_tareas_por_carpeta set? where id_obra=?';
                   connection.query(sql, [{EtapaTarea: element.etapatarea, TareaRealizada:element.tarearealizada,}, id], (error,results)=>{
                       if (error) console.log(error);
                   } )
                           sql = 'Insert into historialdecambios set?';
                           connection.query(sql, [{ EtapaTarea_sub: EtapaTarea, Tarea: element.etapatarea, ResponsableDeTarea: element.responsabletarea, Si_NO_TareaRealizada: "N", Nombre_sub: Nombre, Tarea_Realizada_sub: element.tarearealizada, Proxima_Tarea_sub: element.proximatarea, Fecha_Tarea_sub: element.fechatarea  }], (error, results) => {
                               if (error) console.log(error);
                   
                               
                           })
                           
                       }else{
           }
           }
       }
     });
    }
    res.redirect('/historialcarpeta/' + Nombre);
})
//Opciones de editar tareas POST
router.post('/ActualizarEstadoCarpeta/:id', (req, res) => {
    console.log("Actualizando estado de carpeta");

    var id = req.body.id;
    var Nombre = req.body.Nombre;
    var Estado = req.body.Estado;
    var sql;
    var CodigoFinalizada = 0;
    if (Estado == "Finalizada") {
        var CodigoEnUso = "F";
        sql = 'Select max(CodigoFinalizadas) from codificacioncarpetas'
        connection.query(sql, (error, results) => {
            if (error) console.log(error);
            var result = 0;
            var contador = 0;
            JSON.parse((JSON.stringify(results)), function (k, v) {
                if (contador == 0) {
                    contador = contador + 1;
                    result = v;
                }
            });
            CodigoFinalizada = result;
            CodigoFinalizada = CodigoFinalizada + 1;
            sql = 'Update codificacioncarpetas Set ? where Nombre= ?';
            connection.query(sql, [{
                CodigoEnUsoVigentes: CodigoEnUso, CodigoFinalizadas: CodigoFinalizada
            }, Nombre], (error, results) => {
                if (error) console.log(error);

            })
        }
        )
    }
    else {
        var CodigoEnUso = "S";
    }
    sql = 'Update codificacioncarpetas Set ? where Nombre= ?';
    connection.query(sql, [{
        CodigoEnUsoVigentes: CodigoEnUso
    }, Nombre], (error, results) => {
        if (error) console.log(error);
    })
    var sql = 'Update obras Set ? where id=?';
    connection.query(sql, [{
        Estado: Estado,
    }, id], (error, results) => {
        if (error) console.log(error);

    })
    res.redirect(req.get('referer'));


})
//Informes para Marcelo
router.get('ObtenerInformesObras',(req,res)=>{
var sql='';
var obras,tareasgenerales, historialdetareas;
sql='Select * from obras'
connection.query(sql,(error,results)=>{
    if(error) console.log(error);
    else{obras=results};
})
sql='Select * from obras_tareasgenerales '
connection.query(sql,(error,results)=>{
    if(error) console.log(error);
    else{tareasgenerales=results};
})
sql='Select * from historialdecambios '
connection.query(sql,(error,results)=>{
    if(error) console.log(error);
    else{historialdetareas=results};
})
setTimeout(() => {
    
}, 2000);
})

