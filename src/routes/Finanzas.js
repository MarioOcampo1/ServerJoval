const { render } = require('ejs');
const { Router } = require('express');
const files = require('express-fileupload');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const xlsx = require('xlsx');
const XlsxPopulate = require('xlsx-populate');
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
router.get('/Finanzas_CajaChica', (req, res) => {
    var sql = 'SELECT * FROM finanzas_caja_chica ';
    connection.query(sql, (error, results) => {
        if (error) console.log(error);
        else {
            res.render('./paginas/Finanzas/Cajachica.ejs', { finanzas: results, moment: moment });
        }
    })
})
router.post('/Finanzas/IngresoCajaChica', (req, res) => {

    var sql = 'INSERT INTO finanzas_caja_chica set?';
    connection.query(sql, {
        IngresoDescripcion: req.body.IngresoDescripcion, IngresoFecha: req.body.IngresoFecha, IngresoMonto: req.body.IngresoMonto
    }, (error, results) => {
        if (error) console.log(error);
        res.redirect('/Finanzas_CajaChica');
    })
})
router.post('/Finanzas/EgresoCajaChica', (req, res) => {

    var sql = 'INSERT INTO finanzas_caja_chica set?';
    connection.query(sql, {
        EgresoDescripcion: req.body.EgresoDescripcion, EgresoFecha: req.body.EgresoFecha, EgresoMonto: req.body.EgresoMonto,
    }, (error, results) => {
        if (error) console.log(error);
        res.redirect('/Finanzas_CajaChica');
    })
})
router.post('/Finanzas/EditarRegistro', (req, res) => {

    var sql = 'UPDATE finanzas_caja_chica set? where id=?';
    if (req.body.IngresoEgreso == "Ingreso") {
        connection.query(sql, [{
            IngresoDescripcion: req.body.EdicionDescripcion, IngresoFecha: req.body.EdicionFecha, IngresoMonto: req.body.EdicionMonto,
        }, req.body.id], (error, results) => {
            if (error) console.log(error);
            res.redirect('/Finanzas_CajaChica');
        })
    }
    if (req.body.IngresoEgreso == "Egreso") {
        connection.query(sql, {
            EgresoDescripcion: req.body.EdicionDescripcion, EgresoFecha: req.body.EdicionFecha, EgresoMonto: req.body.EdicionMonto,
        }, req.body.id, (error, results) => {
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
router.get('/Finanzas/NuevoCliente/:NombreObra', (req, res) => {
    var sql = 'Select Nombre from obras';
    var NombreObra= req.params.NombreObra;
    console.log(NombreObra);
    connection.query(sql, (error, results) => {
        if (error) console.log(error);
        else {
            res.render('paginas/Finanzas/Cobrodeobras/Clientes/nuevocliente.ejs', { NombreObra,ListadoObras: results });

        }
    })
})
router.get('/Finanzas/NuevoCliente/cargarLote', (req, res) => {
    var sql = 'Select Nombre from obras';
    connection.query(sql, (error, results) => {
        if (error) console.log(error);
        res.render('paginas/Finanzas/Cobrodeobras/Clientes/nuevoclienteLOTE.ejs', { nombreObra: results })
    })
});
router.post('/Finanzas/NuevoCliente/DescargarPlantilla', (req, res) => {
    let url = path.join(__dirname, '../', '/views/paginas/Finanzas/archivos/NuevoCliente.xlsx')
    res.download(url, function (error) {
        console.log(error);
    })
});
// Carga de clientes por lote, archivo EXCEL
router.post('/Finanzas/NuevoCliente/cargarLote', (req, res) => {
    // tutorial: https://www.youtube.com/watch?v=SJwWMdIJLmM&t=301s
    var file = req.files.file
    var obra = req.body.Obra;
    var id_Obra;
    var id_cliente;
    file.mv('./src/views/paginas/Finanzas/archivos/upload/Clientesporlotes.xlsx', err => {
        if (err) console.log(err);
    })
    var sql = 'Select id from obras where Nombre=? '
    connection.query(sql, obra, (error, r) => {
        if (error) console.log(error);
        id_Obra = r[0].id;
    })
    setTimeout(() => {
        sql = 'Insert into finanzas_clientes_por_obra set?'
        var workbook = xlsx.readFile('./src/views/paginas/Finanzas/archivos/upload/Clientesporlotes.xlsx');
        const workbookSheets = workbook.SheetNames;
        const sheet = workbookSheets[0];
        const dataExcel = xlsx.utils.sheet_to_json(workbook.Sheets[sheet]);
        dataExcel.forEach(
            element => {
                function cargarenBD1() {
                    return new Promise((resolve, reject) => {
                        connection.query(sql, [{
                            NombreCliente: element.Nombre, id_Obra: id_Obra, NombreObra: obra, DNICliente: element.DNI, Telefono: element.Telefono, Correo: element.Correo, Direccion: element.MznaYLote, Facturar: element.Facturar
                        }], (error, results) => {
                            if (error) {
                                reject(
                                    console.log(error)
                                );
                            }
                            else {
                                resolve(true);
                            }
                        });
                    })

                }
                cargarenBD1(true).then(() => {

                    function CargarenBD2() {
                        return new Promise((resolve, reject) => {
                            sql = 'Select ID_cliente from finanzas_clientes_por_obra where NombreCliente=?';
                            connection.query(sql, [element.Nombre], (error, results) => {
                                if (error) console.log(error);
                                else {
                                    id_cliente = results[0].ID_cliente;
                                    resolve(true);
                                }
                            });
                        });
                    }
                    CargarenBD2(true).then(() => {
                        sql = 'Insert into finanzas_clientes_por_obra_cobros set?'
                        connection.query(sql, [{
                            ID_cliente: id_cliente, id_Obra: id_Obra
                        }], (error, results) => {
                            if (error) console.log(error);
                        });
                        sql = 'Insert into finanzas_clientes_predeterminados set?'
                        connection.query(sql, [{
                            id_cliente: id_cliente, id_obra: id_Obra, AnticipoFinanciero: element.AnticipoFinanciero, ServicioDomiciliario: element.ServicioDomiciliario, Cuota1: element.MontoCuota, Cuota2: element.MontoCuota, Cuota3: element.MontoCuota, Cuota4: element.MontoCuota, Cuota5: element.MontoCuota, Cuota6: element.MontoCuota, Cuota7: element.MontoCuota, Cuota8: element.MontoCuota, Cuota9: element.MontoCuota, Cuota10: element.MontoCuota, Cuota11: element.MontoCuota, Cuota12: element.MontoCuota, ServicioDomiciliario: element.ServicioDomiciliario
                        }], (error, results) => {
                            if (error) console.log(error);
                        })
                    });
                });
            })
    }, 2000);
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
            res.render('paginas/Finanzas/ListadoObras.ejs', { clientes: clientes, cobroObras: cobroObras, NombreObras: obras });
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
router.post('/Finanzas/NuevoCliente/guardarCliente', (req, res) => {
    var Nombre = req.body.Nombre;
    var DNI = req.body.DNI;
    var Teléfono = req.body.Teléfono;
    var Correo = req.body.Correo;
    var Domicilio = req.body.Domicilio;
    var Obra = req.body.Obra;
    var id_Obra;
    var sql = 'Select id FROM obras where Nombre=?'
    var idCliente;
    var cuotasQuePaga = req.body.CuotasQuePaga;
    var NombreObra;
    var promise1 = new Promise(function(resolve,reject){
        connection.query(sql, Obra, (error, results) => {
            if(error)console.log(error);
            else{
                id_Obra = results[0].id;
                sql='SELECT Nombre from obras WHERE id =?';
                connection.query(sql,id_Obra,(error,results)=>{
                    if(error)console.log(error);
                    else{
                        NombreObra=results[0].Nombre;
             
                sql = 'INSERT into finanzas_clientes_por_obra set?';
                connection.query(sql, {
                    NombreCliente: Nombre, NombreObra:NombreObra, id_Obra: id_Obra, DNICliente: DNI, Telefono: Teléfono, Correo: Correo, Direccion: Domicilio
                }, (error, results) => {
                    if (error) console.log(error);
                  else{
                    sql='Select ID_cliente from finanzas_clientes_por_obra WHERE DNICliente =? ;';
                    connection.query(sql,DNI,(error,results)=>{
                        if(error) console.log(error);
                        else{
                            idCliente=results[0].ID_cliente;
                            sql='INSERT INTO finanzas_clientes_predeterminados set?;'
                            switch (cuotasQuePaga) {
                                case'1':
                                    connection.query(sql,{
                                        id_obra:id_Obra,id_cliente:idCliente,NombreCliente:Nombre,AnticipoFinanciero: req.body.ImporteAnticipoFinanciero,Cuota1:req.body.ImporteCuota
                                    },(error,results)=>{
                                        if(error) console.log(error);
                                    })     
                                    break;
                                    case'2':
                                        connection.query(sql,{
                                            id_obra:id_Obra,id_cliente:idCliente,NombreCliente:Nombre,AnticipoFinanciero: req.body.ImporteAnticipoFinanciero,Cuota1:req.body.ImporteCuota,Cuota2:req.body.ImporteCuota
                                        },(error,results)=>{
                                            if(error) console.log(error);
                                        })     
                                    break;
                                    case'3':
                                        connection.query(sql,{
                                            id_obra:id_Obra,id_cliente:idCliente,NombreCliente:Nombre,AnticipoFinanciero: req.body.ImporteAnticipoFinanciero,Cuota1:req.body.ImporteCuota,Cuota2:req.body.ImporteCuota,Cuota3:req.body.ImporteCuota
                                        },(error,results)=>{
                                            if(error) console.log(error);
                                        })     
                                    
                                    break;
                                    case'4':
                                        connection.query(sql,{
                                            id_obra:id_Obra,id_cliente:idCliente,NombreCliente:Nombre,AnticipoFinanciero: req.body.ImporteAnticipoFinanciero,Cuota1:req.body.ImporteCuota,Cuota2:req.body.ImporteCuota,Cuota3:req.body.ImporteCuota, Cuota4:req.body.ImporteCuota,
                                        },(error,results)=>{
                                            if(error) console.log(error);
                                        })     
                                    break;
                                    case'5':
                                        connection.query(sql,{
                                            id_obra:id_Obra,id_cliente:idCliente,NombreCliente:Nombre,AnticipoFinanciero: req.body.ImporteAnticipoFinanciero,Cuota1:req.body.ImporteCuota,Cuota2:req.body.ImporteCuota,Cuota3:req.body.ImporteCuota, Cuota4:req.body.ImporteCuota,Cuota5:req.body.ImporteCuota
                                        },(error,results)=>{
                                            if(error) console.log(error);
                                        })     
                                    break;
                                    case'6':
                                        connection.query(sql,{
                                            id_obra:id_Obra,id_cliente:idCliente,NombreCliente:Nombre,AnticipoFinanciero: req.body.ImporteAnticipoFinanciero,Cuota1:req.body.ImporteCuota,Cuota2:req.body.ImporteCuota,Cuota3:req.body.ImporteCuota, Cuota4:req.body.ImporteCuota,Cuota5:req.body.ImporteCuota,Cuota6:req.body.ImporteCuota,
                                        },(error,results)=>{
                                            if(error) console.log(error);
                                        })     
                                    break;
                                    case'7':
                                        connection.query(sql,{
                                            id_obra:id_Obra,id_cliente:idCliente,NombreCliente:Nombre,AnticipoFinanciero: req.body.ImporteAnticipoFinanciero,Cuota1:req.body.ImporteCuota,Cuota2:req.body.ImporteCuota,Cuota3:req.body.ImporteCuota, Cuota4:req.body.ImporteCuota,Cuota5:req.body.ImporteCuota,Cuota6:req.body.ImporteCuota,Cuota7:req.body.ImporteCuota,Cuota8:req.body.ImporteCuota,
                                        },(error,results)=>{
                                            if(error) console.log(error);
                                        })     
                                    break;
                                    case'8':
                                        connection.query(sql,{
                                            id_obra:id_Obra,id_cliente:idCliente,NombreCliente:Nombre,AnticipoFinanciero: req.body.ImporteAnticipoFinanciero,Cuota1:req.body.ImporteCuota,Cuota2:req.body.ImporteCuota,Cuota3:req.body.ImporteCuota, Cuota4:req.body.ImporteCuota,Cuota5:req.body.ImporteCuota,Cuota6:req.body.ImporteCuota,Cuota7:req.body.ImporteCuota,Cuota8:req.body.ImporteCuota,
                                        },(error,results)=>{
                                            if(error) console.log(error);
                                        })     
                                    break;
                                    case'9':
                                        connection.query(sql,{
                                            id_obra:id_Obra,id_cliente:idCliente,NombreCliente:Nombre,AnticipoFinanciero: req.body.ImporteAnticipoFinanciero,Cuota1:req.body.ImporteCuota,Cuota2:req.body.ImporteCuota,Cuota3:req.body.ImporteCuota, Cuota4:req.body.ImporteCuota,Cuota5:req.body.ImporteCuota,Cuota6:req.body.ImporteCuota,Cuota7:req.body.ImporteCuota,Cuota8:req.body.ImporteCuota,Cuota9:req.body.ImporteCuota
                                        },(error,results)=>{
                                            if(error) console.log(error);
                                        })     
                                    break;
                                    case '10':
                                        connection.query(sql,{
                                            id_obra:id_Obra,id_cliente:idCliente,NombreCliente:Nombre,AnticipoFinanciero: req.body.ImporteAnticipoFinanciero,Cuota1:req.body.ImporteCuota,Cuota2:req.body.ImporteCuota,Cuota3:req.body.ImporteCuota, Cuota4:req.body.ImporteCuota,Cuota5:req.body.ImporteCuota,Cuota6:req.body.ImporteCuota,Cuota7:req.body.ImporteCuota,Cuota8:req.body.ImporteCuota,Cuota9:req.body.ImporteCuota,Cuota10:req.body.ImporteCuota
                                        },(error,results)=>{
                                            if(error) console.log(error);
                                        })     
                                    break;
                                    case '11':
                                        connection.query(sql,{
                                            id_obra:id_Obra,id_cliente:idCliente,NombreCliente:Nombre,AnticipoFinanciero: req.body.ImporteAnticipoFinanciero,Cuota1:req.body.ImporteCuota,Cuota2:req.body.ImporteCuota,Cuota3:req.body.ImporteCuota, Cuota4:req.body.ImporteCuota,Cuota5:req.body.ImporteCuota,Cuota6:req.body.ImporteCuota,Cuota7:req.body.ImporteCuota,Cuota8:req.body.ImporteCuota,Cuota9:req.body.ImporteCuota,Cuota10:req.body.ImporteCuota,Cuota11:req.body.ImporteCuota
                                        },(error,results)=>{
                                            if(error) console.log(error);
                                        })     
                                    break;
                                    case '12':
                                        connection.query(sql,{
                                            id_obra:id_Obra,id_cliente:idCliente,NombreCliente:Nombre,AnticipoFinanciero: req.body.ImporteAnticipoFinanciero,Cuota1:req.body.ImporteCuota,Cuota2:req.body.ImporteCuota,Cuota3:req.body.ImporteCuota, Cuota4:req.body.ImporteCuota,Cuota5:req.body.ImporteCuota,Cuota6:req.body.ImporteCuota,Cuota7:req.body.ImporteCuota,Cuota8:req.body.ImporteCuota,Cuota9:req.body.ImporteCuota,Cuota10:req.body.ImporteCuota,Cuota11:req.body.ImporteCuota,Cuota12:req.body.ImporteCuota
                                        },(error,results)=>{
                                            if(error) console.log(error);
                                        })     
                                    break;
                            
                                default:
                                    break;
                            }
                            sql='INSERT INTO finanzas_clientes_por_obra_cobros set?;'
                            connection.query(sql,{
                            id_Obra:id_Obra,ID_cliente:idCliente,NombreCliente:Nombre,AnticipoFinanciero:0,Cuota1:0,Cuota2:0,Cuota3:0,Cuota4:0,Cuota5:0,Cuota6:0,Cuota7:0,Cuota8:0,Cuota9:0,Cuota10:0,Cuota11:0,Cuota12:0,IngresoDocumentacion:0,Municipal:0,Irrigacion:0,DNV:0,DPV:0,Hidraulica:0,FFCC:0,Privado:0,ServicioDomiciliario:0,
                            },(error,results)=>{
                                if(error)console.log(error);
                                else{
                                    resolve();
                                }
                            })
                        }
                       
                   
                    })
        
                  }
                })
            }
        })
    }
    
})
        
       
    })
  promise1.then(function(success,reject){
    res.redirect('/Finanzas/cobrodeobras/VerObra/'+Obra);  
  }) 

})
router.post('/GenerarComprobante', (req, res,next) => {
    let sql = '';
    var ID = req.body.IDCliente;
    var Nombre = req.body.NombreCompleto;
    var Domicilio = req.body.Domicilio;
    var ValorIngresado = parseInt(req.body.ValorIngresado);
    var sumaDeTotalesPorConcepto;
    var Concepto = req.body.Concepto;
    var FechaPago = req.body.FechaPago;
    var ObservacionesDelPago = req.body.ObservacionesDelPago;
    var Obra = req.body.Obra;
    var id_Obra;
    var FormaDePago = req.body.FormaDePago;
    var id_Cobro;
    sql = 'Select id from obras where Nombre =?';
    connection.query(sql, [Obra], (error, results) => {
        if (error) console.log(error);

        else {
            id_Obra = results[0].id;
        }
    })
    sql = 'SELECT ' + Concepto + ' FROM finanzas_clientes_por_obra_cobros WHERE ID_cliente =?'
    var promise1 = new Promise(function(resolve,reject){
    connection.query(sql, [ID], (error, results) => {
        if (error){ console.log(error);
        reject();
        }
        if (results.length > 0) {
            
                var a ;
                JSON.parse((JSON.stringify(results)), function (k, v) {
                    if (k == Concepto) {
                        a = parseInt(v);
                    }
    
                });
                console.log("El cliente seleccionado tiene pagos existentes. Actualizando pagos.")
                if (a == null) {
                } else {
                  
                    sumaDeTotalesPorConcepto =ValorIngresado + a;
                }
                sql = 'UPDATE finanzas_clientes_por_obra_cobros set ' + Concepto + ' = ' + sumaDeTotalesPorConcepto + ' WHERE ID_cliente = ' + ID + ' and id_Obra = ' + id_Obra + '';
                connection.query(sql, (error, results) => {
                    if (error) console.log(error);
                })
                sql = 'Select MAX(id_cobro) as id_Cobro from finanzas_clientes_por_obra_cobros WHERE id_Obra=' + id_Obra + '';
               
                connection.query(sql, (error, results) => {
                    if (error) console.log(error);
                    id_Cobro = results[0].id_Cobro
                })         
                    if (ObservacionesDelPago == null || ObservacionesDelPago == '') {
                        sql = 'Insert into finanzas_clientes_por_obra_cobros_observaciones set?'
                        connection.query(sql, { id_cobro: id_Cobro, Observacion: "Sin observaciones" }, (error, results) => {
                            if (error) console.log(error);
                        })
                    }
                    else {
                        sql = 'Insert into finanzas_clientes_por_obra_cobros_observaciones set?'
                        connection.query(sql, { id_cobro: id_Cobro, Observacion: ObservacionesDelPago }, (error, results) => {
                            if (error) console.log(error);
                        })
                    }
                    resolve();
                
               
            }
        
        if (results.length == null || results.length == 0) {
            
                console.log("No existen pagos ingresados de el cliente seleccionado")
                console.log("Intentando cargar nuevo pago");
                sql = 'INSERT INTO finanzas_clientes_por_obra_cobros SET?'
                connection.query(sql, {
                    ID_cliente: ID, id_Obra: id_Obra,
                }, (error, results) => {
                    if (error) console.log(error);
                })
                console.log("El cliente se ha cargado en el sistema, cargando el concepto de pago junto con su valor....");
                sql = 'Update finanzas_clientes_por_obra_cobros set ' + Concepto + '= ' + sumaDeTotalesPorConcepto + ' WHERE ID_cliente =' + ID + ' and id_Obra=' + id_Obra + '';
                connection.query(sql, (error, results) => {
                    if (error) console.log(error);
                })
                sql = 'Select MAX(id_cobro) from finanzas_clientes_por_obra_cobros where id_Obra=' + id_Obra + '';
                var id_Cobro;
                connection.query(sql, (error, results) => {
                    if (error) console.log(error);
                    id_Cobro = results[0].id_Cobro
                })
                if (ObservacionesDelPago == null) {
                    sql = 'Insert into finanzas_clientes_por_obra_cobros_observaciones set?'
                    connection.query(sql, { id_cobro: id_Cobro, Observacion: "Sin observaciones" }, (error, results) => {
                        if (error) console.log(error);
    
                    })
                }
                else {
                    sql = 'Insert into finanzas_clientes_por_obra_cobros_observaciones set?'
                    connection.query(sql, { id_cobro: id_Cobro, Observacion: ObservacionesDelPago }, (error, results) => {
                        if (error) console.log(error);
    
                    })
                }
                resolve();
        }
    })
    })
        promise1.then((resolve)=>{
 //Generación del comprobante en archivo Excel
//  Se utiliza como herramienta el xlsx-populate: https://www.npmjs.com/package/xlsx-populate#serving-from-express
// La plantilla del comprobante es: src\public\plantillas\ReciboDePago.xlsx
// Datos que se cargan en la misma: Nombre, Domicilio, ValorIngresado, Concepto, FechaPago, ObservacionesDelPago, Obra.
sql= 'INSERT INTO finanzas_recibos_de_pago_obras set?';
var nDeComprobante;
connection.query(sql,{idObra:id_Obra,idCliente:ID,Concepto:Concepto,ValorIngresado:ValorIngresado,ObservacionesDelPago,ObservacionesDelPago},(error,results)=>{
if(error) console.log(error);
else{
    sql='SELECT MAX(NRecibo) as Nrecibo FROM finanzas_recibos_de_pago_obras';
connection.query(sql,(error,results)=>{
    nDeComprobante= results[0].Nrecibo;
})
}
})
XlsxPopulate.fromFileAsync("src/public/plantillas/ReciboDePago.xlsx").then(workbook=>{
function Unidades(num){

    switch(num)
    {
        case 1: return 'UN';
        case 2: return 'DOS';
        case 3: return 'TRES';
        case 4: return 'CUATRO';
        case 5: return 'CINCO';
        case 6: return 'SEIS';
        case 7: return 'SIETE';
        case 8: return 'OCHO';
        case 9: return 'NUEVE';
    }

    return '';
}//Unidades()

function Decenas(num){

    decena = Math.floor(num/10);
    unidad = num - (decena * 10);

    switch(decena)
    {
        case 1:
            switch(unidad)
            {
                case 0: return 'DIEZ';
                case 1: return 'ONCE';
                case 2: return 'DOCE';
                case 3: return 'TRECE';
                case 4: return 'CATORCE';
                case 5: return 'QUINCE';
                default: return 'DIECI' + Unidades(unidad);
            }
        case 2:
            switch(unidad)
            {
                case 0: return 'VEINTE';
                default: return 'VEINTI' + Unidades(unidad);
            }
        case 3: return DecenasY('TREINTA', unidad);
        case 4: return DecenasY('CUARENTA', unidad);
        case 5: return DecenasY('CINCUENTA', unidad);
        case 6: return DecenasY('SESENTA', unidad);
        case 7: return DecenasY('SETENTA', unidad);
        case 8: return DecenasY('OCHENTA', unidad);
        case 9: return DecenasY('NOVENTA', unidad);
        case 0: return Unidades(unidad);
    }
}//Unidades()

function DecenasY(strSin, numUnidades) {
    if (numUnidades > 0)
    return strSin + ' Y ' + Unidades(numUnidades)

    return strSin;
}//DecenasY()

function Centenas(num) {
    centenas = Math.floor(num / 100);
    decenas = num - (centenas * 100);

    switch(centenas)
    {
        case 1:
            if (decenas > 0)
                return 'CIENTO ' + Decenas(decenas);
            return 'CIEN';
        case 2: return 'DOSCIENTOS ' + Decenas(decenas);
        case 3: return 'TRESCIENTOS ' + Decenas(decenas);
        case 4: return 'CUATROCIENTOS ' + Decenas(decenas);
        case 5: return 'QUINIENTOS ' + Decenas(decenas);
        case 6: return 'SEISCIENTOS ' + Decenas(decenas);
        case 7: return 'SETECIENTOS ' + Decenas(decenas);
        case 8: return 'OCHOCIENTOS ' + Decenas(decenas);
        case 9: return 'NOVECIENTOS ' + Decenas(decenas);
    }

    return Decenas(decenas);
}//Centenas()

function Seccion(num, divisor, strSingular, strPlural) {
    cientos = Math.floor(num / divisor)
    resto = num - (cientos * divisor)

    letras = '';

    if (cientos > 0)
        if (cientos > 1)
            letras = Centenas(cientos) + ' ' + strPlural;
        else
            letras = strSingular;

    if (resto > 0)
        letras += '';

    return letras;
}//Seccion()

function Miles(num) {
    divisor = 1000;
    cientos = Math.floor(num / divisor)
    resto = num - (cientos * divisor)

    strMiles = Seccion(num, divisor, 'UN MIL', 'MIL');
    strCentenas = Centenas(resto);

    if(strMiles == '')
        return strCentenas;

    return strMiles + ' ' + strCentenas;
}//Miles()

function Millones(num) {
    divisor = 1000000;
    cientos = Math.floor(num / divisor)
    resto = num - (cientos * divisor)

    strMillones = Seccion(num, divisor, 'UN MILLON ', 'MILLONES ');
    strMiles = Miles(resto);

    if(strMillones == '')
        return strMiles;

    return strMillones + ' ' + strMiles;
}//Millones()

function NumeroALetras(num) {
    var data = {
        numero: num,
        enteros: Math.floor(num),
        centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
        letrasCentavos: '',
        letrasMonedaPlural: 'PESOS',//'PESOS', 'Dólares', 'Bolívares', 'etcs'
        letrasMonedaSingular: 'PESO', //'PESO', 'Dólar', 'Bolivar', 'etc'

        letrasMonedaCentavoPlural: 'CENTAVOS',
        letrasMonedaCentavoSingular: 'CENTAVO'
    };

    if (data.centavos > 0) {
        data.letrasCentavos = 'CON ' + (function (){
            if (data.centavos == 1)
                return Millones(data.centavos) + ' ' + data.letrasMonedaCentavoSingular;
            else
                return Millones(data.centavos) + ' ' + data.letrasMonedaCentavoPlural;
            })();
    };

    if(data.enteros == 0)
        return 'CERO ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
    if (data.enteros == 1)
        return Millones(data.enteros) + ' ' + data.letrasMonedaSingular + ' ' + data.letrasCentavos;
    else
        return Millones(data.enteros) + ' ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
}
var numeroEnLetras= NumeroALetras(ValorIngresado); //Se pasa el numero a LETRAS
//Se comienza a modificar las celdas del Excel
 workbook.sheet("Hoja1").cell("Q3").value(nDeComprobante);
 workbook.sheet("Hoja1").cell("L7").value(Nombre);
 workbook.sheet("Hoja1").cell("L9").value(Domicilio);
 workbook.sheet("Hoja1").cell("C8").value(Concepto);
workbook.sheet("Hoja1").cell("I13").value( "En concepto de pago en efectivo por "+ Concepto);
workbook.sheet("Hoja1").cell("P15").value( ValorIngresado);
 workbook.sheet("Hoja1").cell("E8").value(ValorIngresado);
workbook.sheet("Hoja1").cell("K18").value( ObservacionesDelPago);
workbook.sheet("Hoja1").cell("J11").value( numeroEnLetras);
return workbook.outputAsync();
}).then(data=>{
    let nombreDelArchivo= nDeComprobante+'-'+Obra+'-'+Concepto+'-'+ Nombre + '.xlsx'; 
res.attachment(nombreDelArchivo);
res.send(data);
res.redirect('/Finanzas/cobrodeobras/VerObra/'+Obra);
})
.catch(function(){
    res.send("No se ha podido generar el comprobante de pago");
res.redirect('/Finanzas/cobrodeobras/VerObra/'+Obra);
})
        });
   })
// EDITAR CLIENTE
router.get('/Finanzas/CobroDeObras/EditarCliente/:id', (req, res) => {
    var id = req.params.id;
    var pagos;
    const promise1 = new Promise((success, reject) => {
        var sql = 'Select * from obras';
        connection.query(sql, (error, results) => {
            if (error) {
                console.log(error);
                reject(error);
            }
            else {
                success(results);
            }
        })
    })
    promise1.then(obras => {
        const promise2 = new Promise((success, reject) => {
            sql = 'SELECT * from finanzas_clientes_predeterminados WHERE id_cliente =?';
            connection.query(sql, [id], (error, predeterminados) => {
                if (error) {
                    console.log(error);
                    reject(error);
                }
                else {
                    var resultados = [predeterminados, obras]
                    success(resultados);
                }
            })
        })
        promise2.then(resultados => {
            sql = 'SELECT * FROM finanzas_clientes_por_obra WHERE ID_cliente =?';
            connection.query(sql, [id], (error, results) => {
                if (error) console.log(error);
                else {
                    res.render("paginas/Finanzas/Cobrodeobras/Clientes/editarCliente.ejs", { results: results, obras: resultados[1], pagosPredeterminados: resultados[0] })
                }
            })
        })
    }).catch(error => {
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
router.post('/Finanzas/CobroDeObras/EditarCliente/ActualizarPagoPredeterminado/:id/:keyACambiar', (req, res) => {
    var id = req.params.id;
    var keySQL = req.params.keyACambiar;
    var valor = req.body.valor
    var sql = 'SELECT * FROM finanzas_clientes_predeterminados WHERE id_cliente =? ';
    connection.query(sql, id, (error, results) => {
        if (error) console.log(error)
        else {
            if (results.length != 0) {
                sql = 'UPDATE finanzas_clientes_predeterminados SET ' + keySQL + '=' + valor + ' WHERE id_cliente=?';

                connection.query(sql, id, (error, results) => {
                    if (error) console.log(error)
                    else {
                        res.redirect('/Finanzas/CobroDeObras/EditarCliente/' + id);
                    }
                })
            }
            else {
                sql = 'SELECT id_Obra, NombreCliente from finanzas_clientes_por_obra WHERE ID_cliente =? ';
                connection.query(sql, id, (error, finanzas_clientes_por_obra) => {
                    sql = 'Insert into finanzas_clientes_predeterminados set ?';
                    connection.query(sql, {
                        id_obra: finanzas_clientes_por_obra[0].id_Obra, id_cliente: id, NombreCliente: finanzas_clientes_por_obra[0].NombreCliente,
                    }, (error, resultado) => {
                        if (error) console.log(error);
                        else {
                            res.redirect('/Finanzas/CobroDeObras/EditarCliente/' + id);
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
    var obras;
    const promise1 = new Promise((resolve, reject) => {
        var sql = 'SELECT id FROM obras WHERE Nombre =?';
        connection.query(sql, [NombreObra], (error, results) => {
            if (error) {
                console.log(error);
                reject(error);
            }
            else {
                sql = 'SELECT Nombre from obras '
                connection.query(sql, (error, nombreobras) => {
                    if (error) { console.log(error); }
                    else {
                        obras = nombreobras;
                    }
                })
                id = results[0].id;
                resolve(id);
            }
        })
    }).then(idObra => {
        const promise2 = new Promise((resolve, reject) => {
            sql = 'SELECT b.*,a.*, c.AnticipoFinanciero as PredeterminadoAnticipoFinanciero, c.Cuota1 as PredeterminadoCuota1, c.Cuota2 as PredeterminadoCuota2, c.Cuota3 as PredeterminadoCuota3, c.Cuota4 as PredeterminadoCuota4, c.Cuota5 as PredeterminadoCuota5, c.Cuota6 as PredeterminadoCuota6, c.Cuota7 as PredeterminadoCuota7, c.Cuota8 as PredeterminadoCuota8, c.Cuota9 as PredeterminadoCuota9, c.Cuota10 as PredeterminadoCuota10, c.Cuota11 as PredeterminadoCuota11, c.Cuota12 as PredeterminadoCuota12, c.Irrigacion as PredeterminadoIrrigacion, c.DNV as PredeterminadoDNV, c.DPV as PredeterminadoDPV, c.Hidraulica as PredeterminadoHidraulica, c.FFCC as PredeterminadoFFCC, c.Privado as PredeterminadoPrivado, c.ServicioDomiciliario as PredeterminadoServicioDomiciliario,c.Municipal as PredeterminadoMunicipal, c.IngresoDocumentacion as PredeterminadoIngresoDocumentacion FROM finanzas_clientes_por_obra b LEFT JOIN finanzas_clientes_predeterminados c ON b.ID_cliente=c.id_cliente LEFT JOIN finanzas_clientes_por_obra_cobros a ON b.ID_cliente=a.id_cliente WHERE b.id_Obra =?';
            connection.query(sql, idObra, (error, PredeterminadosyCobros) => {
                if (error) {
                    console.log(error);
                    reject(error);
                }
                if(PredeterminadosyCobros.length>0){
                    resolve(PredeterminadosyCobros);
                }
              else {
              PredeterminadosyCobros=null;
              resolve(PredeterminadosyCobros);
                }
            })
        }).then(PredeterminadosyCobros => {

            res.render('paginas/Finanzas/VistaDeLaObra.ejs', { PredeterminadosyCobros: PredeterminadosyCobros, id_Obra: id, NombreObra: NombreObra, obras });
        })
    }).catch(function (err) {
        res.redirect("/cobroDeObras");
    }
    )
})
//Cargar comprobante de pago con los datos del cliente
router.get('/BuscarDatosClienteQuePaga/:idCliente', (req, res) => {
    var idCliente = req.params.idCliente;
    var sql;
    sql = 'Select * from finanzas_clientes_por_obra WHERE ID_cliente = ? ';
    var promise1=new Promise(function(resolve,reject){
        connection.query(sql, idCliente, (error, results) => {
            if (error) console.log(error);
            else {
            }
            resolve(results);
    })
   
    })
    promise1.then(function(results){
        sql='SELECT AnticipoFinanciero,Cuota1,Cuota2,Cuota3,Cuota4,Cuota5,Cuota6,Cuota7,Cuota8,Cuota9,Cuota10,Cuota11,Cuota12,Municipal,Irrigacion,DNV,DPV,Hidraulica,FFCC,Privado,ServicioDomiciliario FROM finanzas_clientes_predeterminados WHERE id_cliente = ? ';
        connection.query(sql, idCliente, (error,montosCuota)=>{
           if (error) console.log(error);
           else{
            res.send({results,montosCuota});
           }
        })
   })
})
router.get('/BuscarDatosClienteQuePaga2',(req,res)=>{
    var sql = 'SELECT a.* , b.* FROM finanzas_clientes_predeterminados a INNER JOIN finanzas_clientes_por_obra b ON a.id_cliente = b.ID_cliente ; ';
    var clientes;
    connection.query(sql, (error, resultados) => {
        clientes = resultados;
        var obras;
    sql = 'SELECT * FROM obras ORDER BY Nombre';
    connection.query(sql, (error, resultado) => {
        if (error) console.log(error);
        obras = resultado;
res.send({clientes,obras});
    })
    })  
})
//Actualizar configuracion de la obra
router.post('/Finanzas/actualizarPredeterminadosObraEntera/:id/:keyACambiar/:NombreObra', (req, res) => {
    var idObra = req.params.id;
    var keyACambiar = req.params.keyACambiar;
    var ValorIngresado = req.body.valor;
    var NombreObra = req.params.NombreObra;
    if (keyACambiar == null || keyACambiar == undefined) {
        res.redirect('/Finanzas/cobrodeobras/VerObra/' + NombreObra + '');
    }
    else {
        var sql = 'UPDATE finanzas_clientes_predeterminados set ' + keyACambiar + ' =' + ValorIngresado + ' WHERE id_obra = ' + idObra + ' ;';
        connection.query(sql, (error, results) => {
            if (error) console.log(error);
            else {
                res.redirect('/Finanzas/cobrodeobras/VerObra/' + NombreObra + '');
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
//Llamados React
router.get('/Finanzas/ReactHome',(req,res)=>{
    var sql= 'SELECT * FROM obras '
})
