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
router.get('/', (req, res) => {
    res.render('login.ejs');
})

router.get('/index', (req, res, next) => {
    if (req.isAuthenticated()) {
        var fecha = new Date();
        var sql='Select * from admingeneral_seguros_albacaucion where ProximaRefacturacion BETWEEN (NOW() - Interval 1 Month) AND (NOW() + Interval 6 Month)  AND Estado != "Dada de baja"';
        connection.query(sql, (error,results)=>{
            if(error)console.log(error);
            else{
                
                res.render('./paginas/Principal/index.ejs',{ albacaucion:results, moment: moment});
            }
            
        })
        
    }
    else {
        (req, res) => {
            res.redirect('/');
        }
    }
})
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
    const gasSeleccionado = req.body.GasSeleccionado;
    const finanzasSeleccionado = req.body.FinanzasSeleccionado;
    const fechaActual = new Date();
    const Codigo = req.body.Codigo;
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
    
    console.log("ATENCION: SE PROCEDE A GUARDAR NUEVO CLIENTE");
    console.log("DATOS DEL CLIENTE QUE SE GUARDA");
    console.log('NOMBRE:' + Nombre + ', NCarpeta:' + NCarpeta);
if(gasSeleccionado=="Seleccionado"){
    
}
    sql = 'Insert into obras set ?';
    connection.query(sql, {
        Nombre: Nombre, NCarpeta: NCarpeta, Comitente: Comitente, Ubicacion: Departamento,
    }, (error, results) => {
        if (error) console.log(error);
    })
    sql = 'Insert into adminecogas_tareas_por_carpeta set ?';
    connection.query(sql, {
        Nombre: Nombre, NCarpeta: NCarpeta, TipoDeRed: TipoDeRed
    }, (error, results) => {
        if (error) console.log(error);
    })
    var sql = 'Insert into adgastareas set ?';
    connection.query(sql, {
        Nombre: Nombre
    }, (error, results) => {
        if (error) console.log(error);
    })
    sql = 'Insert into historialdecambios set ?';
    connection.query(sql, {
        Nombre_sub: Nombre, Tarea_Realizada_sub: "Se crea nuevo cliente", Proxima_Tarea_sub: "Actualizar estado de carpeta", Si_NO_TareaRealizada: "N", Fecha_Tarea_sub: fechaActual
    }, (error, results) => {
        if (error) console.log(error);
    })
    sql = 'Insert into obras_tareasgenerales set ?';
    connection.query(sql, {
        Nombre: Nombre, PermisosEspeciales: PermisosEspeciales, Permisos: Permisos
    }, (error, results) => {
        if (error) console.log(error);
    })
    sql = 'Insert into codificacioncarpetas Set?';
    connection.query(sql, [{
        Nombre: Nombre, CodigoVigentes: Codigo, CodigoEnUsoVigentes: "S",
    },], (error, results) => {
        if (error) console.log(error);

    })
//La siguiente sentencia, elimina la carpeta de la BD donde el codigo de la carpeta se encuentre en "E" de "Eliminado". Tarea necesaria
// para que no figura el codigo como disponible.
    sql = "Delete from codificacioncarpetas where CodigoEnUsoVigentes= 'E' and CodigoVigentes=?"
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
        Nombre: Nombre,
        DNV: DNV, DPV: DPV, Irrigacion: IRRIGACION,
        Hidraulica: HIDRAULICA, PerMunicipal: PerMunicipal, Ferrocarriles: FERROCARRIL, Privado: Privado, OtrosPermisos: OTROSPERMISOS
    }], (error, results) => {
        if (error) console.log(error);
    })
    //nuevocliente 2da parte
    res.redirect('/index');
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