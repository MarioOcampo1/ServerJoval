const { render } = require('ejs');
const { Router } = require('express');
const files= require('express-fileupload');
const cookieParser = require('cookie-parser')
const session = require('express-session')
var xlsx= require('xlsx');
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
    if(username=="Daiana" && password == "Drodriguez"){
        return done(null,{id: 4 , name: "Daiana"});
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
const { routes } = require('../app');
const path = require('path');
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
router.get('Finanzas/NuevoCliente',(req,res)=>{
    res.render('paginas/Finanzas/nuevocliente.ejs');
})
//Rutas Get
router.get('/Finanzas', (req, res) => {
        if(req.isAuthenticated()){
    res.render('paginas/Finanzas/Home.ejs');
        }
})
router.get('/Finanzas_Cobros', (req, res) => {
    if(req.isAuthenticated()){
res.render('paginas/Finanzas/Cobros.ejs');
    }
})
router.get('/Finanzas/NuevoCliente',(req,res)=>{
    var sql= 'Select Nombre from obras';
    connection.query(sql,(error,results)=>{
        if (error) console.log(error);
else{
    res.render('paginas/Finanzas/nuevocliente.ejs',{nombreObra:results});

}    })
})
router.get('/cobroDeObras', (req, res) => {
    var sql = 'Select * FROM FINANZAS_clientes_por_obra_cobros '
    var cobroObras;
connection.query(sql,(error,resultados)=>{
cobroObras= resultados;
})
var obras;
sql='Select Nombre From obras';
connection.query(sql,(error,resultado)=>{
    obras=resultado;
})
     sql = 'Select * from finanzas_clientes_por_obra';
    connection.query(sql, (error, clientes) => {
        
        
        if (error) console.log(error);

        if (clientes.length > 0) {
            res.render('paginas/Finanzas/cobrodeobras.ejs', { clientes: clientes, cobroObras: cobroObras, NombreObras: obras });
// res.send(obras) ;
        }
        else {
            res.send('Ningun resultado encontrado');
        }
    })
})
router.get('/cobrodeobras/clientes/LocalizarClientes/:NombreObra',(req,res)=>{
var sql
var NombreObra = req.params.NombreObra;
console.log("Nombre"+ NombreObra);
sql= 'SELECT * FROM finanzas_clientes_por_obra where NombreObra=?'
connection.query(sql,[NombreObra],(error,results)=>{
    if (error) console.log(error);
    if(results){
        res.send(results);
    }
})
})

router.get('/cobrodeobras/clientes/FormularioCliente', (req, res) => {
    console.log("Descargando archivo Excel");
    console.log("Dirname tiene:" + __dirname);
    let url = path.join(__dirname, '../', '/views/paginas/Finanzas/archivos/NuevoCliente.xlsx')
    console.log("url contiene:" + url);
    res.download(url, function (error) {
        console.log(error);

    });
})

router.get('/cobrodeobras/clientes/:Nombre', (req, res) => {
    var Nombre = req.params.Nombre;
    
    var sql = 'Select * from finanzas_clientes_por_obra WHERE NombreObra=?';
    connection.query(sql, [Nombre], (error, results) => {
        if (error) console.log(error);
        var contador=0;
        var json = JSON.parse(JSON.stringify(results));
        for (let i = 0; i < results.length; i++) {
            const element = JSON.parse(JSON.stringify(results[i]));
            if( element.NombreCliente!=null);
            contador++;
        }
        if(contador>0){
            res.render('paginas/Finanzas/cobrodeobras/clientes.ejs', { Clientes: results });
        }
        console.log("Se procede a cargar la pagina clientes por cobro de obras");
       
    })
})

router.get('/cobrodeobras/clientes/:Nombre/VerClientes', (req, res) => {
    var Nombre = req.params.Nombre;
    var sql = 'Select NombreCliente from finanzas_clientes_por_obra WHERE NombreObra=?';
    connection.query(sql, [Nombre], (error, clientes) => {
        if (error) console.log(error);
        var contador=0;
        var json = JSON.parse(JSON.stringify(clientes));
        for (let i = 0; i < clientes.length; i++) {
            const element = JSON.parse(JSON.stringify(clientes[i]));
            if( element.NombreCliente!=null);
            contador++;
        }
        if(contador>0){
            res.send(clientes);
        }
        else{
           res.send("No se han encontrado clientes");

        }
       
    })
})

router.post('/cobrodeobras/clientes/cargarArchivoConClientes', (req, res) => {
    console.log("Intentando guardar archivo en servidor");

    var Nombre = req.body.NombreCarpeta;
    var archivoExcel= req.files.ClientesACargar; //Documento Excel que ingresa el usuario. Deberia de tener los datos cargados y no ser erroneo.
    console.log(archivoExcel);
   
    let url= path.join(__dirname,'../','/views/paginas/Finanzas/archivos/upload/clientesAcargar.xlsx'); 

      archivoExcel.mv(url,error=>{ //Se guarda el documento en el servidor
            if(error) console.log(error);
    else{console.log("archivo cargado");
      }
    });
    
 archivoExcel = xlsx.readFile(url);
    const nombreHoja = archivoExcel.SheetNames;
             var datos = xlsx.utils.sheet_to_json(archivoExcel.Sheets[nombreHoja[0]]);
            console.log("nombre hoja es:"+nombreHoja);
            var nombres= JSON.stringify(datos);
            nombres= JSON.parse(nombres);
console.log(datos);
// console.log(JSON.stringify(datos)); 
console.log("Intentando mostrar los nombres solamente");
console.log(nombres[0].Nombre);

res.send(datos);
})
router.post('/Finanzas/guardarCliente', (req,res)=>{
var Nombre = req.body.Nombre;
var Apellido = req.body.Apellido;
var DNI = req.body.DNI;
var Teléfono = req.body.Teléfono;
var Correo = req.body.Correo;
var Domicilio = req.body.Domicilio;
var Obra = req.body.Obra;
sql='insert into finanzas_clientes_por_obra set?';
connection.query(sql,{
    NombreCliente:Nombre, NombreObra:Obra, DNICliente: DNI, Telefono:Teléfono, Correo:Correo, Direccion:Domicilio
},(error, results)=>{
    if (error) console.log(error);
else(res.send("Cliente cargado satisfactoriamente"))
})
})
router.post('/ImprimirComprobante',(req,res)=>{
   var Nombre= req.body.NombreCompleto;
var Domicilio= req.body.Domicilio;
var ValorIngresado= req.body.ValorIngresado;
var Concepto= req.body.Concepto;
var FechaPago= req.body.FechaPago;
var ObservacionesDelPago= req.body.ObservacionesDelPago;
var ComprobantePago = req.body.ComprobantePago;

    var sql= 'Insert into finanzas_clientes_por_obra_cobros set?';
   
})