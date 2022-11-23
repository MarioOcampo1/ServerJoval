const { render } = require('ejs');
const { Router } = require('express');
const files = require('express-fileupload');
const cookieParser = require('cookie-parser')
const session = require('express-session')
var xlsx = require('xlsx');
const passport = require('passport');
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
router.use(files());
router.use(passport.initialize());
router.use(passport.session());
passport.use(new PassportLocal(function (username, password, done) {

    if (username == "mocampo" && password == "asd") {
        return done(null, { id: 1, name: "Mario" });
    }
    if (username == "gmaceira" && password == "January2072") {
        return done(null, { id: 2, name: "Gustavo" });
    }
    if (username == "mpereyra" && password == "theboss") {
        return done(null, { id: 3, name: "Mauricio" });
    }
    if (username == "Daiana" && password == "Drodriguez") {
        return done(null, { id: 4, name: "Daiana" });
    }

    done(null, false); // Esta linea define a traves del null, que no hubo ningun error, pero el al mismo tiempo, a traves del false, indica que el usuario no se ha encontrado.
    // Cuando el sistema, quiere guardar que el usuario 1 ingreso al sistema, a esa llamada se le llama Serialización.
}))
passport.serializeUser(function (user, done) {
    done(null, user.id);
})
passport.deserializeUser(function (id, done) {
    if (id == 1) {
        done(null, { id: 1, name: "Mario" });
    }
    if (id == 2) {
        done(null, { id: 2, name: "Gustavo" });
    }
    if (id == 3) {
        done(null, { id: 3, name: "Mauricio" });
    }
    if (id == 4) {
        done(null, { id: 4, name: "Daiana" });
    }
})
//Seteo server original
const mysql = require('mysql');
const { NULL } = require('mysql/lib/protocol/constants/types');
const { routes, set } = require('../app');
const path = require('path');
const { log, Console } = require('console');
const { Dir } = require('fs');
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
router.get('/Finanzas', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('paginas/Finanzas/Home.ejs');
    }
})
router.get('/Finanzas_CajaChica',(req,res)=>{
    var sql= 'SELECT * FROM finanzas_caja_chica ' ;
    connection.query(sql,(error,results)=>{
        if (error) console.log(error);
        else{
            res.render('./paginas/Finanzas/Cajachica.ejs', {finanzas:results, moment:moment});
        }
    })
})
router.post('/Finanzas/IngresoCajaChica',(req,res)=>{

    var sql = 'INSERT INTO finanzas_caja_chica set?';
    connection.query(sql,{
    IngresoDescripcion:req.body.IngresoDescripcion ,IngresoFecha:req.body.IngresoFecha , IngresoMonto: req.body.IngresoMonto
    },(error,results)=>{
    if (error) console.log(error);
    res.redirect('/Finanzas_CajaChica');
    })
    })
router.post('/Finanzas/EgresoCajaChica',(req,res)=>{

var sql = 'INSERT INTO finanzas_caja_chica set?';
connection.query(sql,{
EgresoDescripcion:req.body.EgresoDescripcion, EgresoFecha:req.body.EgresoFecha,EgresoMonto:req.body.EgresoMonto,
},(error,results)=>{
if (error) console.log(error);
res.redirect('/Finanzas_CajaChica');
})
})
router.post('/Finanzas/EditarRegistro',(req,res)=>{

    var sql = 'UPDATE finanzas_caja_chica set? where id=?';
    if(req.body.IngresoEgreso=="Ingreso"){
        connection.query(sql,[{
            IngresoDescripcion:req.body.EdicionDescripcion, IngresoFecha:req.body.EdicionFecha,IngresoMonto:req.body.EdicionMonto,
            },req.body.id],(error,results)=>{
            if (error) console.log(error);
            res.redirect('/Finanzas_CajaChica');
            })
    }
    if(req.body.IngresoEgreso=="Egreso"){
        connection.query(sql,{
            EgresoDescripcion:req.body.EdicionDescripcion, EgresoFecha:req.body.EdicionFecha,EgresoMonto:req.body.EdicionMonto,
            },req.body.id,(error,results)=>{
            if (error) console.log(error);
            res.redirect('/Finanzas_CajaChica');
            })
    }

   
    })

router.get('/Finanzas_Cobros', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('paginas/Finanzas/Cobros.ejs');
    }
})
router.get('/Finanzas/NuevoCliente', (req, res) => {
    var sql = 'Select Nombre from obras';
    connection.query(sql, (error, results) => {
        if (error) console.log(error);
        else {
            res.render('paginas/Finanzas/Cobrodeobras/Clientes/nuevocliente.ejs', { nombreObra: results });

        }
    })
})
router.get('/Finanzas/NuevoCliente/cargarLote', (req, res) => {
    var sql = 'Select Nombre from obras';
    connection.query(sql, (error, results) => {
        if (error) console.log(error);   
res.render('paginas/Finanzas/Cobrodeobras/Clientes/nuevoclienteLOTE.ejs',  { nombreObra: results })
})
    });
router.post('/Finanzas/NuevoCliente/DescargarPlantilla',(req,res)=>{
    let url = path.join(__dirname, '../', '/views/paginas/Finanzas/archivos/NuevoCliente.xlsx')
    res.download(url, function (error) {
        console.log(error);
})

});
// Carga de clientes por lote, archivo EXCEL
router.post('/Finanzas/NuevoCliente/cargarLote', (req,res)=>{
// tutorial: https://www.youtube.com/watch?v=SJwWMdIJLmM&t=301s
        var file= req.files.file
        var obra= req.body.Obra;
        var id_Obra;
        var id_cliente;
        file.mv('./src/views/paginas/Finanzas/archivos/upload/Clientesporlotes.xlsx',err=>{
            if (err) console.log(err);
    })
    var sql='Select id from obras where Nombre=? '
    connection.query(sql,obra,(error,r)=>{
if(error)console.log(error);
id_Obra= r[0].id;
    })
    setTimeout(() => {
        sql='Insert into finanzas_clientes_por_obra set?'
        var workbook = xlsx.readFile('./src/views/paginas/Finanzas/archivos/upload/Clientesporlotes.xlsx');
        const workbookSheets= workbook.SheetNames;
        const sheet = workbookSheets[0];
        const dataExcel = xlsx.utils.sheet_to_json(workbook.Sheets[sheet]);
        dataExcel.forEach(
            element => {
                function cargarenBD1(){
                    return new Promise((resolve,reject)=>{
                        connection.query(sql,[{
                            NombreCliente: element.Nombre,id_Obra:id_Obra, NombreObra:obra ,DNICliente:element.DNI ,Telefono:element.Telefono , Correo:element.Correo , Direccion:element.MznaYLote , Facturar:element.Facturar
                        }],(error,results)=>{
                if(error){
                    reject(
                    console.log(error)
                    );
                }
else{
    resolve(true);
}
                        });
                    })
                        
                    }
                    cargarenBD1(true).then(()=>{
                      
                            function CargarenBD2(){
                                return new Promise((resolve,reject)=>{
                                sql='Select ID_cliente from finanzas_clientes_por_obra where NombreCliente=?';
                                connection.query(sql,[element.Nombre],(error,results)=>{
                                    if(error) console.log(error);
                                    else{
                            id_cliente=results[0].ID_cliente;
                            resolve(true);
                        }
                                }); 
                        });
                    }
                    CargarenBD2(true).then(()=>{
                        sql='Insert into finanzas_clientes_por_obra_cobros set?'
                        connection.query(sql,[{
                            ID_cliente: id_cliente, id_Obra:id_Obra
                        }],(error,results)=>{
                            if(error) console.log(error);
                        });
                        sql='Insert into finanzas_clientes_predeterminados set?'
                        connection.query(sql,[{
                         id_cliente: id_cliente,id_obra:id_Obra, AnticipoFinanciero:element.AnticipoFinanciero, ServicioDomiciliario: element.ServicioDomiciliario,Cuota1:element.MontoCuota,Cuota2:element.MontoCuota,Cuota3:element.MontoCuota,Cuota4:element.MontoCuota,Cuota5:element.MontoCuota,Cuota6:element.MontoCuota,Cuota7:element.MontoCuota,Cuota8:element.MontoCuota,Cuota9:element.MontoCuota,Cuota10:element.MontoCuota,Cuota11:element.MontoCuota,Cuota12:element.MontoCuota,ServicioDomiciliario:element.ServicioDomiciliario
                        }],(error,results)=>{
                         if(error) console.log(error);
                        })
                    });
                });
                        })
        },2000); 
        res.redirect("/cobroDeObras");   
});
router.get('/cobroDeObras', (req, res) => {
    var sql = 'Select * FROM FINANZAS_clientes_por_obra_cobros '
    var cobroObras;
    connection.query(sql, (error, resultados) => {
        cobroObras = resultados;
    })
    var obras;
    sql = 'Select * From obras';
    connection.query(sql, (error, resultado) => {
        obras = resultado;
    })
    sql = 'Select * from finanzas_clientes_por_obra INNER JOIN obras ON id_Obra = id';
    connection.query(sql, (error, clientes) => {
        if (error) console.log(error);

        if (clientes.length > 0) {
            res.render('paginas/Finanzas/CobroObras.ejs', { clientes: clientes, cobroObras: cobroObras, NombreObras: obras });
            // res.send(clientes) ;
        }
        else {
            res.send('Ningun resultado encontrado');
        }
    })
})
router.get('/cobrodeobras/clientes/LocalizarClientes/:NombreObra', (req, res) => {
    var sql
    var NombreObra = req.params.NombreObra;
    sql = 'Select id from obras where Nombre=?'
    var idObra = "";
    connection.query(sql, [NombreObra], (error, results) => {
        idObra = results[0].id;
    })
    sql = 'SELECT * FROM finanzas_clientes_por_obra where id_Obra=?';
    setTimeout(() => {
        connection.query(sql, [idObra], (error, results) => {
            if (error) console.log(error);
            if (results) {
                res.send(results);
            }
        })
    }, 1000);

})
router.get('/cobrodeobras/clientes/:Nombre', (req, res) => {
    var Nombre = req.params.Nombre;

    var sql = 'Select * from finanzas_clientes_por_obra WHERE NombreObra=?';
    connection.query(sql, [Nombre], (error, results) => {
        if (error) console.log(error);
        else {
            console.log("Se procede a cargar la pagina clientes por cobro de obras");
            res.render('paginas/Finanzas/cobrodeobras/Clientes/clientes.ejs', { Clientes: results });
        }

    })
})

router.get('/cobrodeobras/clientes/:Nombre/VerClientes', (req, res) => {
    var Nombre = req.params.Nombre;
    var sql = 'Select NombreCliente from finanzas_clientes_por_obra WHERE NombreObra=?';
    connection.query(sql, [Nombre], (error, clientes) => {
        if (error) console.log(error);
        var contador = 0;
        var json = JSON.parse(JSON.stringify(clientes));
        for (let i = 0; i < clientes.length; i++) {
            const element = JSON.parse(JSON.stringify(clientes[i]));
            if (element.NombreCliente != null);
            contador++;
        }
        if (contador > 0) {
            res.send(clientes);
        }
        else {
            res.send("No se han encontrado clientes");

        }

    })
})

router.post('/cobrodeobras/clientes/cargarArchivoConClientes', (req, res) => {
    console.log("Intentando guardar archivo en servidor");

    var Nombre = req.body.NombreCarpeta;
    var archivoExcel = req.files.ClientesACargar; //Documento Excel que ingresa el usuario. Deberia de tener los datos cargados y no ser erroneo.
    console.log(archivoExcel);

    let url = path.join(__dirname, '../', '/views/paginas/Finanzas/archivos/upload/clientesAcargar.xlsx');

    archivoExcel.mv(url, error => { //Se guarda el documento en el servidor
        if (error) console.log(error);
        else {
            console.log("archivo cargado");
        }
    });

    archivoExcel = xlsx.readFile(url);
    const nombreHoja = archivoExcel.SheetNames;
    var datos = xlsx.utils.sheet_to_json(archivoExcel.Sheets[nombreHoja[0]]);
    console.log("nombre hoja es:" + nombreHoja);
    var nombres = JSON.stringify(datos);
    nombres = JSON.parse(nombres);
    console.log(datos);
    // console.log(JSON.stringify(datos)); 
    console.log("Intentando mostrar los nombres solamente");
    console.log(nombres[0].Nombre);

    res.send(datos);
})
router.post('/Finanzas/guardarCliente', (req, res) => {
    var Nombre = req.body.Nombre;
    var DNI = req.body.DNI;
    var Teléfono = req.body.Teléfono;
    var Correo = req.body.Correo;
    var Domicilio = req.body.Domicilio;
    var Obra = req.body.Obra;
    sql = 'Select id FROM obras where Nombre=?'
    connection.query(sql, Obra, (error, results) => {
        var id_Obra = results[0];
    })
    setTimeout(() => {
        sql = 'insert into finanzas_clientes_por_obra set?';
        connection.query(sql, {
            NombreCliente: Nombre, id_Obra: id_Obra, DNICliente: DNI, Telefono: Teléfono, Correo: Correo, Direccion: Domicilio
        }, (error, results) => {
            if (error) console.log(error);
            else (res.send("Cliente cargado satisfactoriamente"))
        })
    }, 2000);

})
router.post('/ImprimirComprobante', (req, res) => {
    let sql = '';
    var ID = req.body.IDCliente;
    var Nombre = req.body.NombreCompleto;
    var Domicilio = req.body.Domicilio;
    var ValorIngresado = req.body.ValorIngresado;
    var Concepto = req.body.Concepto;
    var FechaPago = req.body.FechaPago;
    var ObservacionesDelPago = req.body.ObservacionesDelPago;
    var Obra = req.body.Obra;
    var id_Obra;
    console.log("El Valor ingresado es:" + ValorIngresado);
    sql = 'Select id from obras where Nombre =?';
    connection.query(sql, [Obra], (error, results) => {
        if (error) console.log(error);

        else {
            id_Obra = results[0].id;
        }
    })
    
    sql = 'Select ' + Concepto + ' FROM finanzas_clientes_por_obra_cobros WHERE ID_cliente =?'
    connection.query(sql, [ID], (error, results) => {
        if (error) console.log(error);
        if (results.length > 0) {
            var a = '';
            JSON.parse((JSON.stringify(results)), function (k, v) {
                if (k == Concepto) {
                    a = v
                }

            });
            console.log("El cliente seleccionado tiene pagos existentes. Actualizando pagos.")
            if (a == null) {
            } else {
                ValorIngresado = ValorIngresado + parseFloat(a)
            }
            sql = 'UPDATE finanzas_clientes_por_obra_cobros set ' + Concepto + ' = ' + ValorIngresado + ' where ID_cliente = ' + ID + ' and id_Obra = ' + id_Obra + '';
            connection.query(sql, (error, results) => {
                if (error) console.log(error);
            })
            sql='Select MAX(id_cobro) from finanzas_clientes_por_obra_cobros where id_Obra='+id_Obra+'';
            var id_Cobro;
            connection.query(sql,(error,results)=>{
                if (error) console.log(error);
id_Cobro=results[0].id_Cobro
            })
            if(ObservacionesDelPago==null){
                sql='Insert into finanzas_clientes_por_obra_cobros_observaciones set?'
                connection.query(sql,{id_cobro:id_Cobro, Observacion:"Sin observaciones"},(error,results)=>{
                    if (error) console.log(error);
                    res.send("Cliente cargado exitosamente");
                })
            }
    else{
        sql='Insert into finanzas_clientes_por_obra_cobros_observaciones set?'
        connection.query(sql,{id_cobro:id_Cobro, Observacion:ObservacionesDelPago},(error,results)=>{
            if (error) console.log(error);
            res.send("Cliente cargado exitosamente");
        })
    }
        }
        if (results.length == null || results.length == 0) {
            console.log("No existen pagos ingresados de el cliente seleccionado")
            console.log("Intentando cargar nuevo pago");
            sql = 'Insert into finanzas_clientes_por_obra_cobros set?'
            connection.query(sql, {
                ID_cliente: ID, id_Obra: id_Obra,
            }, (error, results) => {
                if (error) console.log(error);
            })

            console.log("El cliente se ha cargado en el sistema, cargando el concepto de pago junto con su valor....");

            sql = 'Update finanzas_clientes_por_obra_cobros set ' + Concepto + '=' + ValorIngresado + 'where ID_cliente =' + ID + ' and id_Obra=' + id_Obra + '';
            connection.query(sql, (error, results) => {
                if (error) console.log(error);
            })
            sql='Select MAX(id_cobro) from finanzas_clientes_por_obra_cobros where id_Obra='+id_Obra+'';
            var id_Cobro;
            connection.query(sql,(error,results)=>{
                if (error) console.log(error);
id_Cobro=results[0].id_Cobro
            })
            if(ObservacionesDelPago==null){
                sql='Insert into finanzas_clientes_por_obra_cobros_observaciones set?'
                connection.query(sql,{id_cobro:id_Cobro, Observacion:"Sin observaciones"},(error,results)=>{
                    if (error) console.log(error);
                    res.send("Cliente cargado exitosamente");
                })
            }
    else{
        sql='Insert into finanzas_clientes_por_obra_cobros_observaciones set?'
        connection.query(sql,{id_cobro:id_Cobro, Observacion:ObservacionesDelPago},(error,results)=>{
            if (error) console.log(error);
            res.send("Cliente cargado exitosamente");
        })
    }
        }
    })



})
// EDITAR CLIENTE
router.get('/Finanzas/CobroDeObras/EditarCliente/:id', (req, res) => {
    var id = req.params.id;
    var pagos;
    const promise1 = new Promise((success,reject)=>{
        var sql = 'Select * from obras';
        connection.query(sql, (error, results) => {
            if (error){
                 console.log(error);
            reject(error);
            }
            else {        
success(results);
            }
        })
    })
    promise1.then(obras=>{
        const promise2 = new Promise((success,reject)=>{
            sql= 'SELECT * from finanzas_clientes_predeterminados WHERE id_cliente =?';
            connection.query(sql,[id], (error, predeterminados) => {
                if (error) {console.log(error);
                reject(error);
                }
                else {
                    var resultados = [predeterminados,obras]
                    success(resultados);
                }
            })
        })
        promise2.then(resultados=>{
            sql = 'SELECT * FROM finanzas_clientes_por_obra WHERE ID_cliente =?';
            connection.query(sql, [id], (error, results) => {
                if (error) console.log(error);
                else {
                     res.render("paginas/Finanzas/Cobrodeobras/Clientes/editarCliente.ejs", { results: results, obras: resultados[1], pagosPredeterminados:resultados[0] }) }
            })
        })
    }).catch(error=>{
res.redirect(req.get('referer'));
    })
    
})
router.post('/Finanzas/CobroDeObras/EditarCliente/:id', (req, res) => {
    var id = req.params.id;
    var sql = 'Update finanzas_clientes_por_obra set ? where ID_cliente =?';
    var Nombre = req.body.Nombre;
    var DNI = req.body.DNI;
    var Teléfono = req.body.Teléfono;
    var Correo = req.body.Correo;
    var Direccion = req.body.Direccion;
    console.log(Direccion);
    var Obra = req.body.Obra;

    connection.query(sql, [{
        NombreCliente: Nombre, NombreObra: Obra, DNICliente: DNI, Telefono: Teléfono, Correo: Correo, Direccion: Direccion
    }, id], (error, results) => {
        if (error) console.log(error)
        else {
            res.redirect("/cobroDeObras");
        }
    })

})
router.post('/Finanzas/CobroDeObras/EditarCliente/ActualizarPagoPredeterminado/:id/:keyACambiar', (req,res)=>{
var id = req.params.id;
var keySQL= req.params.keyACambiar;
var valor= req.body.valor
var sql = 'SELECT * FROM finanzas_clientes_predeterminados WHERE id_cliente =? ';
connection.query(sql,id,(error,results)=>{
    if (error) console.log(error)
    else{
        if(results.length!=0){
            sql = 'UPDATE finanzas_clientes_predeterminados SET '+ keySQL+'='+valor+' WHERE id_cliente=?';

            connection.query(sql, id, (error, results) => {
                if (error) console.log(error)
                else {
                    res.redirect('/Finanzas/CobroDeObras/EditarCliente/'+id);
                }
            })
        }
        else{
            sql='SELECT id_Obra, NombreCliente from finanzas_clientes_por_obra WHERE ID_cliente =? ';
            connection.query(sql,id,(error,finanzas_clientes_por_obra)=>{
sql= 'Insert into finanzas_clientes_predeterminados set ?';
connection.query(sql,{
    id_obra: finanzas_clientes_por_obra[0].id_Obra, id_cliente: id, NombreCliente: finanzas_clientes_por_obra[0].NombreCliente,
},(error,resultado)=>{
if(error) console.log(error);
else{
    res.redirect('/Finanzas/CobroDeObras/EditarCliente/'+id);
}
})
            })
        }
    }
})
 
})
//Vista general de la obra
router.get('/Finanzas/cobrodeobras/VerObra/:NombreObra', (req, res) => {
    var NombreObra = req.params.NombreObra;
    var id;
    var cobrosXobra;
    var clientesObra;
    var tiposDeCobros;
   const promise1 = new Promise((resolve,reject)=>{
    var sql = 'SELECT id FROM obras WHERE Nombre =?';
    connection.query(sql, [NombreObra], (error, results) => {
        if (error){ console.log(error);
            reject(error);
        }
        else{
        id = results[0].id;
        resolve(id);
    }
    })

   })
   promise1.then(resultado=>{  
    sql = 'SELECT c.NombreCliente, c.AnticipoFinanciero as PredeterminadoAnticipoFinanciero, c.Cuota1 as PredeterminadoCuota1, c.Cuota2 as PredeterminadoCuota2, c.Cuota3 as PredeterminadoCuota3, c.Cuota4 as PredeterminadoCuota4, c.Cuota5 as PredeterminadoCuota5, c.Cuota6 as PredeterminadoCuota6, c.Cuota7 as PredeterminadoCuota7, c.Cuota8 as PredeterminadoCuota8, c.Cuota9 as PredeterminadoCuota9, c.Cuota10 as PredeterminadoCuota10, c.Cuota11 as PredeterminadoCuota11, c.Cuota12 as PredeterminadoCuota12, c.Irrigacion as PredeterminadoIrrigacion, c.DNV as PredeterminadoDNV, c.DPV as PredeterminadoDPV, c.Hidraulica as PredeterminadoHidraulica, c.FFCC as PredeterminadoFFCC, c.Privado as PredeterminadoPrivado, c.ServicioDomiciliario as PredeterminadoServicioDomiciliario,c.Municipal as PredeterminadoMunicipal, c.IngresoDocumentacion as PredeterminadoIngresoDocumentacion FROM finanzas_clientes_predeterminados c WHERE c.id_obra =?';       
    const promise2 = new Promise((resolve,reject)=>{
        connection.query(sql, resultado, (error, Predeterminados) => {
            if (error){ 
                console.log(error);
                reject(error);
            }
            if (Predeterminados.length > 0) {
resolve(Predeterminados)
            }
            else {
                reject(error);
            }
        })
    })
    promise2.then(resolvePromise=>{
        sql = 'SELECT * from finanzas_clientes_por_obra_cobros WHERE id_Obra =?'
        connection.query(sql, id, (error, Cobros) => {
            if (error){ console.log(error);
                reject(error);
            }

            else{
              res.render('paginas/Finanzas/Cobrodeobras/Obras/Vistaobras.ejs', { Predeterminado: resolvePromise, Cobros: Cobros, NombreObra: NombreObra }); 
            }
        })
    }).catch( err=>{
        res.redirect(res.get("referer"));
    }

       )
   }).catch( err=>{
    res.redirect(res.get("referer"));
   }

   )
  
        
     
        
  
})
//Actualizar configuracion de la obra
router.post('/Finanzas/actualizarPredeterminadosObraEntera/:id/:keyACambiar/:NombreObra',(req,res)=>{
    var idObra= req.params.id;
    var keyACambiar= req.params.keyACambiar;
    var ValorIngresado= req.body.valor;
    var NombreObra = req.params.NombreObra;
   if(keyACambiar==null|| keyACambiar==undefined){
    res.redirect('/Finanzas/cobrodeobras/VerObra/'+NombreObra+'');
   }
   else{
var sql='UPDATE finanzas_clientes_predeterminados set '+keyACambiar+' ='+ValorIngresado+' WHERE id_obra = '+idObra+' ;';
connection.query(sql,(error,results)=>{
    if(error) console.log(error);
    else{
        res.redirect('/Finanzas/cobrodeobras/VerObra/'+NombreObra+'');
    }

})  
}   
})
router.post('/Finanzas/cobrodeobras/VerObra/tiposDeCobros', (req, res) => {
    var NombreObra = req.body.NombreObra;
    var sql = 'Select id from obras where Nombre =?';
    connection.query(sql, NombreObra, (error, results) => {
        id_obra = results[0].Nombre;
    })

    sql = 'Update finanzas_obras set? WHERE id_obra =? and id_tipo_de_cobro =?';

    console.log("guardando dato");
    connection.query(sql, [{}, id_obra], (error, results) => {

    })
})
