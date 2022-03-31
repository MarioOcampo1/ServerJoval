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
router.get('/admingral', (req, res) => {
    res.render('paginas/AdministracionGeneral/admingral.ejs');
})
router.get('/seguros',(req,res)=>{
    res.render('paginas/AdministracionGeneral/seguros.ejs');
})
router.get('/infoempresa',(req,res)=>{
    res.render('paginas/AdministracionGeneral/infoempresa.ejs');
})
router.get('/download/logoJoval',(req,res)=>{
    var filepath ='/LogoJoval.jpg';
    var filename= 'Logo Joval.jpeg';
   res.download(filepath, filename);
})