const { render } = require("ejs");
const multer = require("multer");
const upload = multer({ dest: "Archivos/temp" });
const { Router } = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const PassportLocal = require("passport-local").Strategy;
const router = Router();
const cors = require('cors');
module.exports = router;
const moment = require("moment");
var xlsx = require("xlsx");
router.use(
  session({
    secret: "misecreto",
    resave: true,
    saveUninitialized: true,
  })
);
//Seteo server original
const mysql = require("mysql");
const { NULL } = require("mysql/lib/protocol/constants/types");
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Thinker95",
  database: "joval",
});
//check de conexion a la base de datos
connection.connect((error) => {
  if (error) console.log(error);
});
//Settings
//Fin de seteo de server original
//Rutas Get

router.get("/vencimientos", (req, res) => {
  // if(req.isAuthenticated()){
  var sql =
    "SELECT c.Nombre, c.NCarpeta, c.intTelefonica, c.intTelefonicaPedida, c.intTelefonicaObtenida, c.intAgua, c.intAguaPedida, c.intAguaObtenida, c.intCloaca,c.intCloacasPedida, c.intCloacasObtenida, c.intClaro, c.intClaroPedida, c.intClaroObtenida, c.intElectricidad, c.intElectricidadPedida, c.intElectricidadObtenida, c.intArnet ,  c.intArnetPedida, c.intArnetObtenida,c.intArsat, c.intArsatPedida, c.intArsatObtenida, c.intTelecomPedida, c.intTelecomObtenida, c.intTelecom FROM adminecogas_interferencias_y_permisos c";
  res.locals.moment = moment;
  connection.query(sql, (error, results) => {
    if (error) console.log(error);
    if (results.length > 0) {
      res.render("paginas/AdministracionEcogas/vencimientos.ejs", {
        results: results,
      });
    } else {
      res.send("Ningun resultado encontrado");
    }
  });

  // }
  // else{
  //     (req, res) => {
  //         res.redirect('/');
  //     }
  // }
});
router.get("/interferencias/info", (req, res) => {
  const sql =
    "SELECT c.id, c.Nombre, c.NCarpeta, a.Seguridad, a.Interferencias, a.Avisos , a.Permisos FROM obras c, obras_tareasgenerales a where a.Nombre= c.Nombre";
  res.locals.moment = moment;
  connection.query(sql, (error, results) => {
    if (error) console.log(error);

    if (results.length > 0) {
      res.send(results); //en {results:results} lo que hago es guardar los resultados que envia la bd, en la variable results
    } else {
      res.send("Ningun resultado encontrado");
    }
  });
});
//Administracion Ecogas
router.get("/adminecogas", (req, res) => {
  if (req.isAuthenticated()) {
    let sql;
    // INTERFERENCIAS
    var interferenciasypermisos;
    var usuariosregistrados;
    sql = "Select * from adminecogas_interferencias_y_permisos";
    connection.query(sql, (error, results) => {
      if (error) console.log(error);

      if (results.length > 0) {
        interferenciasypermisos = results;
      }
    });
    sql = "SELECT * FROM usuariosregistrados;";
    connection.query(sql, (error, respuesta) => {
      if (error) console.log(error);
      else {
        usuariosregistrados = respuesta;
      }
    })
    // FIN INTERFERENCIAS
    sql = "SELECT a.id, a.Nombre, a.NCarpeta,b.TareaRealizada, b.ProximaTarea, b.EtapaTarea, b.FechaLimite,c.*" +
      "FROM obras a INNER JOIN adminecogas_tareas_por_carpeta b ON a.id = b.id_obra " +
      "INNER JOIN adminecogas_interferencias_y_permisos c ON c.NCarpeta = b.NCarpeta ";

    res.locals.moment = moment;
    connection.query(sql, (error, results) => {
      if (error) console.log(error);
      if (results.length > 0) {
        res.render("paginas/AdministracionEcogas/adminecogas.ejs", {
          results: results,
          interferenciasypermisos: interferenciasypermisos, usuariosregistrados,
        }); //en {results:results} lo que hago es guardar los resultados que envia la bd, en la variable results
      } else {
        res.render("paginas/AdministracionEcogas/nuevocliente.ejs");
      }
    });
  } else {
    res.redirect("/");
  }
});
router.get("/adminecogas/TablaGeneral", (req, res) => {
  var sql =
    "SELECT a.NCarpeta,a.Estado,a.id,b.CodigoVigentes,b.CodigoFinalizadas, c.Nombre_sub,c.ResponsableDeTarea,c.Tarea_Realizada_sub, c.Proxima_Tarea_sub, c.Fecha_Proxima_Tarea_sub, c.EtapaTarea_sub, d.Interferencias, d.Permisos, e.intTelefonicaObtenida,e.intAguaObtenida, e.intCloacasObtenida, e.intElectricidadObtenida, e.intClaroObtenida, e.intArnetObtenida, e.intArsatObtenida, e.intTelecomObtenida, e.VencimientoFerrocarril, e.VencimientoHidraulica, e.VencimientoMunicipal, e.VencimientoDNV, e.VencimientoDPV, e.VencimientoIrrigacion, e.VencimientoPrivado, e.VencimientoOtrosPermisos, e.VencimientoAvisoObraIeric, e.VencimientoAvisoObraArt " +
    " FROM historialdecambios c" +
    " INNER JOIN obras a ON  c.Nombre_sub = a.Nombre" +
    " INNER JOIN codificacioncarpetas b ON c.Nombre_sub = b.Nombre" +
    " INNER JOIN obras_tareasgenerales d ON c.Nombre_sub = d.Nombre" +
    ' INNER JOIN adminecogas_interferencias_y_permisos e ON c.Nombre_sub = e.Nombre  WHERE c.Si_NO_TareaRealizada != "S"';
  res.locals.moment = moment;
  connection.query(sql, (error, results) => {
    if (error) console.log(error);
    if (results.length > 0) {
      res.send(results); //en {results:results} lo que hago es guardar los resultados que envia la bd, en la variable results
    } else {
      res.send("Ningun resultado encontrado");
    }
  });
});
router.get("/estadogeneral", (req, res) => {
  if (req.isAuthenticated()) {
    var Finalizadas;
    var sql = 'SELECT * FROM codificacioncarpetas WHERE CodigoEnUsoVigentes ="F" ORDER BY CodigoFinalizadas asc';
    async function cargarFinalizadas() {
      connection.query(sql, (error, result) => {
        if (error) console.log(error);
        else {
          Finalizadas = result;
        }
      })
    }
    async function actualizarEstadoGral() {
      console.log('actualizando el estado general...');
      var sql = 'SELECT * FROM adminecogas_tareas_por_carpeta;';
      var tareasgenerales;
      var tareadelacarpeta;
      var promise1 = new Promise((resolve, reject) => {
        connection.query(sql, (error, tareas) => {
          if (error) {
            console.log(error);
            reject(error);
          }
          else {
            resolve(tareas);
          }
        });
      });
      var promise2 = new Promise((resolve, reject) => {
        sql = 'SELECT * FROM obras_tareasgenerales';
        connection.query(sql, (error2, tareasgenerales2) => {
          if (error2) {
            console.log(error2);
            reject(error);
          }
          else {
            resolve(tareasgenerales2);
          }
        })
      });
      Promise.all([promise1, promise2]).then(([data1, data2]) => {
        tareadelacarpeta = data1;
        tareasgenerales = data2;
        tareasgenerales.forEach(tareageneral => {
          tareadelacarpeta.forEach(tareaporcarpeta => {
            if (tareaporcarpeta.id_obra == tareageneral.idObra) {
              //PRELIMINAR
              if (
                (tareaporcarpeta.Mensura == "Ok" || tareaporcarpeta.Mensura == "ok" || tareaporcarpeta.Mensura == "NC") &&
                (tareaporcarpeta.TituloDePropiedad == "Ok" ||
                  tareaporcarpeta.TituloDePropiedad == "ok" ||
                  tareaporcarpeta.TituloDePropiedad == "NC")
              ) {
                var tareageneralACargarDocumentacionTerreno = "ok";
              }
              if (tareaporcarpeta.Mensura == "EnGestion" || tareaporcarpeta.TituloDePropiedad == "EnGestion") {
                var tareageneralACargarDocumentacionTerreno = "EnGestion";
              }
              if (tareaporcarpeta.Mensura == "Sin presentar" || tareaporcarpeta.TituloDePropiedad == "Sin presentar") {
                var tareageneralACargarDocumentacionTerreno = "Sin presentar";
              }
              //Documentacion Sociedad
              if (
                (tareaporcarpeta.ActaConstitutiva == "Ok" ||
                  tareaporcarpeta.ActaConstitutiva == "ok" ||
                  tareaporcarpeta.ActaConstitutiva == "NC") &&
                (tareaporcarpeta.ActaCargoVigente == "ok" || tareaporcarpeta.ActaCargoVigente == "Ok" || tareaporcarpeta.ActaCargoVigente == "NC")
              ) {
                var tareageneralACargarDocumentacionSociedad = "ok";
              }
              if (tareaporcarpeta.ActaConstitutiva == "EnGestion" || tareaporcarpeta.ActaCargoVigente == "EnGestion") {
                var tareageneralACargarDocumentacionSociedad = "EnGestion";
              }
              if (
                tareaporcarpeta.ActaConstitutiva == "Sin presentar" ||
                tareaporcarpeta.ActaCargoVigente == "Sin presentar"
              ) {
                var tareageneralACargarDocumentacionSociedad = "Sin presentar";
              }
              //Documentacion Contractual
              if (
                (tareaporcarpeta.Cotizacion == "ok" || tareaporcarpeta.Cotizacion == "Ok" || tareaporcarpeta.Cotizacion == "NC") &&
                (tareaporcarpeta.Contrato == "Ok(Preliminar)" || tareaporcarpeta.Contrato == "ok(Preliminar)" ||
                  tareaporcarpeta.Contrato == "ok" || tareaporcarpeta.Contrato == "Ok" ||
                  tareaporcarpeta.Contrato == "NC(Preliminar)" ||
                  tareaporcarpeta.Contrato == "NC")
              ) {
                var tareageneralACargarDocumentacionContractual = "ok";
              }
              if (
                tareaporcarpeta.Cotizacion == "EnGestion" ||
                tareaporcarpeta.Contrato == "EnGestion" ||
                tareaporcarpeta.Contrato == "EnGestion(Preliminar)"
              ) {
                var tareageneralACargarDocumentacionContractual = "EnGestion";
              }
              if (
                tareaporcarpeta.Cotizacion == "Sin presentar" ||
                tareaporcarpeta.Contrato == "Sin presentar" ||
                tareaporcarpeta.Contrato == "Sin presentar(Preliminar)"
              ) {
                var tareageneralACargarDocumentacionContractual = "Sin presentar";
              }
              //PRIMERA PARTE
              //Documentacion del terreno
              if (
                (tareaporcarpeta.Mensura == "ok" || tareaporcarpeta.Mensura == "Ok" || tareaporcarpeta.Mensura == "NC") &&
                (tareaporcarpeta.TituloDePropiedad == "ok" || tareaporcarpeta.TituloDePropiedad == "Ok" || tareaporcarpeta.TituloDePropiedad == "NC")
              ) {
                var tareageneralACargarDocumentacionTerreno = "ok";
              }
              if (tareaporcarpeta.Mensura == "EnGestion" || tareaporcarpeta.TituloDePropiedad == "EnGestion") {
                var tareageneralACargarDocumentacionTerreno = "EnGestion";
              }
              if (tareaporcarpeta.Mensura == "Sin presentar" || tareaporcarpeta.TituloDePropiedad == "Sin presentar") {
                var tareageneralACargarDocumentacionTerreno = "Sin presentar";
              }
              // Comercial
              if (
                (tareaporcarpeta.Contrato == "ok" || tareaporcarpeta.Contrato == "Ok" || tareaporcarpeta.Contrato == "Ok(Preliminar)") &&
                (tareaporcarpeta.Presupuesto == "ok" || tareaporcarpeta.Presupuesto == "Ok") &&
                (tareaporcarpeta.Sucedaneo == "ok" || tareaporcarpeta.Sucedaneo == "Ok") &&
                (tareaporcarpeta.NotaDeExcepcion == "ok" || tareaporcarpeta.NotaDeExcepcion == "Ok" || tareaporcarpeta.NotaDeExcepcion == "NC")
              ) {
                var tareageneralACargarComercial = "ok";
              }
              if (
                tareaporcarpeta.Contrato == "Presentado" ||
                tareaporcarpeta.Presupuesto == "Presentado" ||
                tareaporcarpeta.Sucedaneo == "Presentado" ||
                tareaporcarpeta.NotaDeExcepcion == "Presentado"
              ) {
                var tareageneralACargarComercial = "Presentado";
              }
              if (
                tareaporcarpeta.Contrato == "EnGestion" ||
                tareaporcarpeta.Presupuesto == "EnGestion" ||
                tareaporcarpeta.Sucedaneo == "EnGestion" ||
                tareaporcarpeta.NotaDeExcepcion == "EnGestion"
              ) {
                var tareageneralACargarComercial = "EnGestion";
              }


              if (
                tareaporcarpeta.Contrato == "Observado" ||
                tareaporcarpeta.Presupuesto == "Observado" ||
                tareaporcarpeta.Sucedaneo == "Observado" ||
                tareaporcarpeta.NotaDeExcepcion == "Observado"
              ) {
                var tareageneralACargarComercial = "Observado";
              }
              //Tecnica
              if ((tareaporcarpeta.PCaprobado == "ok" || tareaporcarpeta.PCaprobado == "Ok") && (tareaporcarpeta.PlanoTipo == "ok" || tareaporcarpeta.PlanoTipo == "Ok" || tareaporcarpeta.PlanoTipo == "NC")) {
                var tareageneralACargarTecnica = "ok";
              }
              if (tareaporcarpeta.PCaprobado == "EnGestion" || tareaporcarpeta.PlanoTipo == "EnGestion") {
                var tareageneralACargarTecnica = "EnGestion";
              }
              if (tareaporcarpeta.PCaprobado == "Presentado" || tareaporcarpeta.PlanoTipo == "Presentado") {
                var tareageneralACargarTecnica = "Presentado";
              }
              if (tareaporcarpeta.PCaprobado == "Observado" || tareaporcarpeta.PlanoTipo == "Observado") {
                var tareageneralACargarTecnica = "Observado";
              }
              if (tareaporcarpeta.PCaprobado == "Sin presentar" || tareaporcarpeta.PlanoTipo == "Sin presentar") {
                var tareageneralACargarTecnica = "Sin presentar";
              }
              //Permisos Especiales
              if (
                (tareaporcarpeta.CartaOferta == "ok" || tareaporcarpeta.CartaOferta == "Ok" || tareaporcarpeta.CartaOferta == "NC" || tareaporcarpeta.CartaOferta == "") &&
                (tareaporcarpeta.PlanoAnexo == "ok" || tareaporcarpeta.PlanoAnexo == "Ok" || tareaporcarpeta.PlanoAnexo == "NC" || tareaporcarpeta.PlanoAnexo == "") &&
                (tareaporcarpeta.DNVVisacion == "Visado" || tareaporcarpeta.DNVVisacion == "No corresponde" || tareaporcarpeta.DNVVisacion == "NC" || tareaporcarpeta.DNVVisacion == "") &&
                (tareaporcarpeta.HidraulicaVisacion == "Visado" || tareaporcarpeta.HidraulicaVisacion == "No corresponde" ||
                  tareaporcarpeta.HidraulicaVisacion == "NC" ||
                  tareaporcarpeta.HidraulicaVisacion == "") &&
                (tareaporcarpeta.FerrocarrilesVisacion == "Visado" || tareaporcarpeta.FerrocarrilesVisacion == "No corresponde" ||
                  tareaporcarpeta.FerrocarrilesVisacion == "NC" ||
                  tareaporcarpeta.FerrocarrilesVisacion == "")
              ) {
                var tareageneralACargarPermisosEspeciales = "ok";
              }
              if (
                tareaporcarpeta.CartaOferta == "EnGestion" ||
                tareaporcarpeta.PlanoAnexo == "EnGestion" ||
                tareaporcarpeta.DNVVisacion == "EnGestion" ||
                tareaporcarpeta.HidraulicaVisacion == "EnGestion" ||
                tareaporcarpeta.FerrocarrilesVisacion == "EnGestion"
              ) {
                var tareageneralACargarPermisosEspeciales = "EnGestion";
              }
              if (
                tareaporcarpeta.CartaOferta == "Presentado" ||
                tareaporcarpeta.PlanoAnexo == "Presentado" ||
                tareaporcarpeta.DNVVisacion == "Presentado" ||
                tareaporcarpeta.HidraulicaVisacion == "Presentado" ||
                tareaporcarpeta.FerrocarrilesVisacion == "Presentado"
              ) {
                var tareageneralACargarPermisosEspeciales = "Presentado";
              }
              if (
                tareaporcarpeta.CartaOferta == "Observado" ||
                tareaporcarpeta.PlanoAnexo == "Observado" ||
                tareaporcarpeta.DNVVisacion == "Observado" ||
                tareaporcarpeta.HidraulicaVisacion == "Observado" ||
                tareaporcarpeta.FerrocarrilesVisacion == "Observado"
              ) {
                var tareageneralACargarPermisosEspeciales = "Observado";
              }
              if (
                (tareaporcarpeta.CartaOferta == "Sin presentar" || tareaporcarpeta.CartaOferta == "Pedir") ||
                (tareaporcarpeta.PlanoAnexo == "Sin presentar" || tareaporcarpeta.PlanoAnexo == "Pedir") ||
                (tareaporcarpeta.DNVVisacion == "Sin presentar" || tareaporcarpeta.DNVVisacion == "Pedir") ||
                (tareaporcarpeta.HidraulicaVisacion == "Sin presentar" || tareaporcarpeta.HidraulicaVisacion == "Pedir") ||
                (tareaporcarpeta.FerrocarrilesVisacion == "Sin presentar" || tareaporcarpeta.FerrocarrilesVisacion == "Pedir")
              ) {
                var tareageneralACargarPermisosEspeciales = "Sin presentar";
              }
              //Documentacion Ambiental
              if (
                (tareaporcarpeta.CuestionarioRelevamientoAmbiental == "ok" || tareaporcarpeta.CuestionarioRelevamientoAmbiental == "Ok") &&
                (tareaporcarpeta.EstudioImpactoAmbientalPrevio == "ok" || tareaporcarpeta.EstudioImpactoAmbientalPrevio == "Ok" ||
                  tareaporcarpeta.EstudioImpactoAmbientalPrevio == "NC" ||
                  tareaporcarpeta.EstudioImpactoAmbientalPrevio == "ok(Previo)" ||
                  tareaporcarpeta.EstudioImpactoAmbientalPrevio == "NC(Previo)" || tareaporcarpeta.EstudioImpactoAmbientalPrevio == "NC") &&
                (tareaporcarpeta.DDJJInicialAmbiental == "ok" || tareaporcarpeta.DDJJInicialAmbiental == "Ok") &&
                (tareaporcarpeta.ListaVerificacionAmbiental == "ok" || tareaporcarpeta.ListaVerificacionAmbiental == "Ok" || tareaporcarpeta.ListaVerificacionAmbiental == "NC")
              ) {
                var tareageneralACargarDocumentacionAmbiente = "ok";
              }

              if (
                tareaporcarpeta.CuestionarioRelevamientoAmbiental == "EnGestion" ||
                tareaporcarpeta.EstudioImpactoAmbientalPrevio == "EnGestion" ||
                tareaporcarpeta.DDJJInicialAmbiental == "EnGestion" ||
                tareaporcarpeta.ListaVerificacionAmbiental == "EnGestion"
              ) {
                var tareageneralACargarDocumentacionAmbiente = "EnGestion";
              }
              if (
                tareaporcarpeta.CuestionarioRelevamientoAmbiental == "Presentado" ||
                tareaporcarpeta.EstudioImpactoAmbientalPrevio == "Presentado" ||
                tareaporcarpeta.DDJJInicialAmbiental == "Presentado" ||
                tareaporcarpeta.ListaVerificacionAmbiental == "Presentado"
              ) {
                var tareageneralACargarDocumentacionAmbiente = "Presentado";
              }
              if (
                tareaporcarpeta.CuestionarioRelevamientoAmbiental == "Observado" ||
                tareaporcarpeta.EstudioImpactoAmbientalPrevio == "Observado" ||
                tareaporcarpeta.DDJJInicialAmbiental == "Observado" ||
                tareaporcarpeta.ListaVerificacionAmbiental == "Observado"
              ) {
                var tareageneralACargarDocumentacionAmbiente = "Observado";
              }
              //Segunda Parte
              //Documentación de obra
              if ((tareaporcarpeta.SolicitudInicioObras == "ok" || tareaporcarpeta.SolicitudInicioObras == "Ok") && (tareaporcarpeta.CertificadoRT == "ok" || tareaporcarpeta.CertificadoRT == "Ok")) {
                var tareageneralACargarDocumentacionObra = "ok";
              }
              if (tareaporcarpeta.SolicitudInicioObras == "Presentado" || tareaporcarpeta.CertificadoRT == "EnGestion") {
                var tareageneralACargarDocumentacionObra = "EnGestion";
              }
              if (
                tareaporcarpeta.SolicitudInicioObras == "Sin presentar" ||
                tareaporcarpeta.CertificadoRT == "Sin presentar"
              ) {
                var tareageneralACargarDocumentacionObra = "Sin presentar";
              }
              //Seguridad
              if (
                (tareaporcarpeta.Programadeseguridad == "ok" || tareaporcarpeta.Programadeseguridad == "Ok") &&
                (tareaporcarpeta.CronogramaSyH == "ok" || tareaporcarpeta.CronogramaSyH == "Ok") &&
                (tareaporcarpeta.SeguroRC == "ok" || tareaporcarpeta.SeguroRC == "Ok") &&
                (tareaporcarpeta.Monotributos == "ok" || tareaporcarpeta.Monotributos == "Ok" || tareaporcarpeta.Monotributos == "NC") &&
                (tareaporcarpeta.SeguroAccidentesPersonales == "ok" || tareaporcarpeta.SeguroAccidentesPersonales == "Ok" || tareaporcarpeta.SeguroAccidentesPersonales == "NC")
              ) {
                var tareageneralACargarSeguridad = "ok";
              }
              if (
                tareaporcarpeta.Programadeseguridad == "EnGestion" ||
                tareaporcarpeta.CronogramaSyH == "EnGestion" ||
                tareaporcarpeta.SeguroRC == "EnGestion" ||
                tareaporcarpeta.Monotributos == "EnGestion" ||
                tareaporcarpeta.SeguroAccidentesPersonales == "EnGestion"
              ) {
                var tareageneralACargarSeguridad = "EnGestion";
              }
              if (
                tareaporcarpeta.Programadeseguridad == "Sin presentar" ||
                tareaporcarpeta.CronogramaSyH == "Sin presentar" ||
                tareaporcarpeta.SeguroRC == "Sin presentar" ||
                tareaporcarpeta.Monotributos == "Sin presentar" ||
                tareaporcarpeta.SeguroAccidentesPersonales == "Sin presentar"
              ) {
                var tareageneralACargarSeguridad = "Sin presentar";
              }

              //Interferencias
              if (
                (tareaporcarpeta.intAgua == "ok" || tareaporcarpeta.intAgua == "Ok") ||
                (tareaporcarpeta.intAgua == "NC" && (tareaporcarpeta.intCloacas == "ok" || tareaporcarpeta.intCloacas == "Ok")) ||
                (tareaporcarpeta.intCloacas == "NC" && (tareaporcarpeta.intElectricidad == "ok" || tareaporcarpeta.intElectricidad == "Ok")) ||
                (tareaporcarpeta.intElectricidad == "NC" && (tareaporcarpeta.intArsat == "ok" || tareaporcarpeta.intArsat == "Ok")) ||
                (tareaporcarpeta.intArsat == "NC" && (tareaporcarpeta.intClaro == "ok" || tareaporcarpeta.intClaro == "Ok")) ||
                (tareaporcarpeta.intClaro == "NC" && (tareaporcarpeta.intTelefonica == "ok" || tareaporcarpeta.intTelefonica == "Ok")) ||
                (tareaporcarpeta.intTelefonica == "NC" && (tareaporcarpeta.intArnet == "ok" || tareaporcarpeta.intArnet == "Ok")) ||
                (tareaporcarpeta.intArnet == "NC" && (tareaporcarpeta.intTelecom == "ok" || tareaporcarpeta.intTelecom == "Ok")) ||
                tareaporcarpeta.intTelecom == "NC"
              ) {
                var tareageneralACargarInterferencias = "ok";
              }
              if (
                tareaporcarpeta.intAgua == "EnGestion" ||
                tareaporcarpeta.intCloacas == "EnGestion" ||
                tareaporcarpeta.intElectricidad == "EnGestion" ||
                tareaporcarpeta.intArsat == "EnGestion" ||
                tareaporcarpeta.intClaro == "EnGestion" ||
                tareaporcarpeta.intTelefonica == "EnGestion" ||
                tareaporcarpeta.intArnet == "EnGestion" ||
                tareaporcarpeta.intTelecom == "EnGestion" ||
                tareaporcarpeta.intAgua == "Pedida" ||
                tareaporcarpeta.intCloacas == "Pedida" ||
                tareaporcarpeta.intElectricidad == "Pedida" ||
                tareaporcarpeta.intArsat == "Pedida" ||
                tareaporcarpeta.intClaro == "Pedida" ||
                tareaporcarpeta.intTelefonica == "Pedida" ||
                tareaporcarpeta.intArnet == "Pedida" ||
                tareaporcarpeta.intTelecom == "Pedida"
              ) {
                var tareageneralACargarInterferencias = "EnGestion";
              }

              //Permisos
              if (
                tareaporcarpeta.PerMunicipal == "Pedir" ||
                tareaporcarpeta.Irrigacion == "Pedir" ||
                tareaporcarpeta.DPV == "Pedir" ||
                tareaporcarpeta.DNV == "Pedir" ||
                tareaporcarpeta.FERROCARRIL == "Pedir" ||
                tareaporcarpeta.HIDRAULICA == "Pedir" ||
                tareaporcarpeta.PerMunicipal == "pedir" ||
                tareaporcarpeta.Irrigacion == "pedir" ||
                tareaporcarpeta.DPV == "pedir" ||
                tareaporcarpeta.DNV == "pedir" ||
                tareaporcarpeta.FERROCARRIL == "pedir" ||
                tareaporcarpeta.HIDRAULICA == "pedir" ||
                tareaporcarpeta.PerMunicipal == "Sin presentar" ||
                tareaporcarpeta.Irrigacion == "Sin presentar" ||
                tareaporcarpeta.DPV == "Sin presentar" ||
                tareaporcarpeta.DNV == "Sin presentar" ||
                tareaporcarpeta.FERROCARRIL == "Sin presentar" ||
                tareaporcarpeta.HIDRAULICA == "Sin presentar"
              ) {
                var tareageneralACargarPermisos = "Pedir";
              }
              if (
                ((tareaporcarpeta.PerMunicipal == "ok" || tareaporcarpeta.PerMunicipal == "Ok") || tareaporcarpeta.PerMunicipal == "NC") &&
                ((tareaporcarpeta.Irrigacion == "ok" || tareaporcarpeta.Irrigacion == "Ok") || tareaporcarpeta.Irrigacion == "NC") &&
                ((tareaporcarpeta.DPV == "ok" || tareaporcarpeta.DPV == "Ok") || tareaporcarpeta.DPV == "NC") &&
                ((tareaporcarpeta.DNV == "ok" || tareaporcarpeta.DNV == "Ok") || tareaporcarpeta.DNV == "NC") &&
                ((tareaporcarpeta.FERROCARRIL == "ok" || tareaporcarpeta.FERROCARRIL == "Ok") || tareaporcarpeta.FERROCARRIL == "NC") &&
                ((tareaporcarpeta.HIDRAULICA == "ok" || tareaporcarpeta.HIDRAULICA == "Ok") || tareaporcarpeta.HIDRAULICA == "NC")
              ) {
                var tareageneralACargarPermisos = "ok";
              }
              if (
                tareaporcarpeta.PerMunicipal == "EnGestion" ||
                tareaporcarpeta.Irrigacion == "EnGestion" ||
                tareaporcarpeta.DPV == "EnGestion" ||
                tareaporcarpeta.DNV == "EnGestion" ||
                tareaporcarpeta.FERROCARRIL == "EnGestion" ||
                tareaporcarpeta.HIDRAULICA == "EnGestion"
              ) {
                var tareageneralACargarPermisos = "EnGestion";
              }
              if (tareaporcarpeta.DPV == "ok" && tareaporcarpeta.DNV == "ok" && tareaporcarpeta.FERROCARRIL == "ok" && tareaporcarpeta.HIDRAULICA == "ok") {
                var tareageneralACargarPermisosEspeciales = "ok";
              }
              if (
                (tareaporcarpeta.DPV == "Visado" || tareaporcarpeta.DPV == "NC") &&
                (tareaporcarpeta.DNV == "Visado" || tareaporcarpeta.DNV == "NC") &&
                (tareaporcarpeta.FERROCARRIL == "Visado" || tareaporcarpeta.FERROCARRIL == "NC") &&
                (tareaporcarpeta.HIDRAULICA == "Visado" || tareaporcarpeta.FERROCARRIL == "NC")
              ) {
                var tareageneralACargarPermisosEspeciales = "ok";
              }
              if (
                tareaporcarpeta.DPV == "EnGestion" ||
                tareaporcarpeta.DNV == "EnGestion" ||
                tareaporcarpeta.FERROCARRIL == "EnGestion" ||
                tareaporcarpeta.HIDRAULICA == "EnGestion"
              ) {
                var tareageneralACargarPermisosEspeciales = "EnGestion";
              }
              if (
                tareaporcarpeta.DPV == "Observado" ||
                tareaporcarpeta.DNV == "Observado" ||
                tareaporcarpeta.FERROCARRIL == "Observado" ||
                tareaporcarpeta.HIDRAULICA == "Observado"
              ) {
                var tareageneralACargarPermisosEspeciales = "Observado";
              }

              if (
                tareaporcarpeta.DPV == "Pedir" ||
                tareaporcarpeta.DNV == "Pedir" ||
                tareaporcarpeta.FERROCARRIL == "Pedir" ||
                tareaporcarpeta.HIDRAULICA == "Pedir"
              ) {
                var tareageneralACargarPermisosEspeciales = "Pedir";
              }
              // Matriculas
              if (
                (tareaporcarpeta.MatriculaFusionista == "ok" || tareaporcarpeta.MatriculaFusionista == "Ok" || tareaporcarpeta.MatriculaFusionista == "NC") &&
                (tareaporcarpeta.MatriculaSoldador == "ok" || tareaporcarpeta.MatriculaSoldador == "Ok" || tareaporcarpeta.MatriculaSoldador == "NC")
              ) {
                var tareageneralACargarMatriculas = "ok";
              }
              if (tareaporcarpeta.MatriculaFusionista == "EnGestion" || tareaporcarpeta.MatriculaSoldador == "EnGestion") {
                var tareageneralACargarMatriculas = "EnGestion";
              }
              if (tareaporcarpeta.MatriculaFusionista == "EnGestion" || tareaporcarpeta.MatriculaSoldador == "EnGestion") {
                var tareageneralACargarMatriculas = "EnGestion";
              }
              if (
                tareaporcarpeta.MatriculaFusionista == NULL ||
                tareaporcarpeta.MatriculaSoldador == NULL ||
                tareaporcarpeta.MatriculaFusionista == "" ||
                tareaporcarpeta.MatriculaSoldador == ""
              ) {
                var tareageneralACargarMatriculas = "Sin presentar";
              }
              //Ambiente
              if (
                (tareaporcarpeta.EstudioImpactoAmbiental == "ok" || tareaporcarpeta.EstudioImpactoAmbiental == "Ok" || tareaporcarpeta.EstudioImpactoAmbiental == "NC") &&
                (tareaporcarpeta.CronogramaAmbiente == "ok" || tareaporcarpeta.CronogramaAmbiente == "Ok" || tareaporcarpeta.CronogramaAmbiente == "NC")
              ) {
                var tareageneralACargarAmbiente = "ok";
              }
              if (
                tareaporcarpeta.EstudioImpactoAmbiental == "EnGestion" ||
                tareaporcarpeta.CronogramaAmbiente == "EnGestion"
              ) {
                var tareageneralACargarAmbiente = "EnGestion";
              }
              if (tareaporcarpeta.EstudioImpactoAmbiental == "pedir" || tareaporcarpeta.CronogramaAmbiente == "pedir") {
                var tareageneralACargarAmbiente = "Sin presentar";
              }
              // Avisos
              if (
                (tareaporcarpeta.AvisoInicioObraART == "ok" || tareaporcarpeta.AvisoInicioObraART == "Ok") &&
                (tareaporcarpeta.AvisoInicioObraIERIC == "ok" || tareaporcarpeta.AvisoInicioObraIERIC == "Ok") &&
                (tareaporcarpeta.ActaInicioEfectivo == "ok" || tareaporcarpeta.ActaInicioEfectivo == "Ok")
              ) {
                var tareageneralACargarAvisos = "ok";
              }
              if (
                tareaporcarpeta.AvisoInicioObraART == "EnGestion" ||
                tareaporcarpeta.AvisoInicioObraIERIC == "EnGestion" ||
                tareaporcarpeta.ActaInicioEfectivo == "EnGestion"
              ) {
                var tareageneralACargarAvisos = "EnGestion";
              }
              if (
                tareaporcarpeta.AvisoInicioObraART == "Sin presentar" ||
                tareaporcarpeta.AvisoInicioObraIERIC == "Sin presentar" ||
                tareaporcarpeta.ActaInicioEfectivo == "Sin presentar"
              ) {
                var tareageneralACargarAvisos = "Sin presentar";
              }
              //OBRAS
              // DocumentacionInspeccion
              if (
                (tareaporcarpeta.ActaDeInicio == "Presentado" || tareaporcarpeta.ActaDeInicio == "Ok") &&
                (tareaporcarpeta.Permisos == "Presentado" || tareaporcarpeta.Permisos == "Ok") &&
                (tareaporcarpeta.Interferencias == "Presentado" || tareaporcarpeta.Interferencias == "Ok") &&
                (tareaporcarpeta.LibroOrdenesServicio == "Presentado" || tareaporcarpeta.LibroOrdenesServicio == "Ok") &&
                (tareaporcarpeta.LibroNotasPedido == "Presentado" || tareaporcarpeta.LibroNotasPedido == "Ok") &&
                (tareaporcarpeta.PCEntregadoInspeccion == "Presentado" || tareaporcarpeta.PCEntregadoInspeccion == "Ok") &&
                (tareaporcarpeta.AvisosDeObra == "Presentado" || tareaporcarpeta.AvisosDeObra == "Ok") &&
                (tareaporcarpeta.CronogramaFirmadoComitente == "Presentado" ||
                  tareaporcarpeta.CronogramaFirmadoComitente == "Ok")
              ) {
                var tareageneralACargarDocumentacionInspeccion = "ok";
              }
              if (
                tareaporcarpeta.ActaDeInicio == "Sin presentar" ||
                tareaporcarpeta.Permisos == "Sin presentar" ||
                tareaporcarpeta.Interferencias == "Sin presentar" ||
                tareaporcarpeta.LibroOrdenesServicio == "Sin presentar" ||
                tareaporcarpeta.LibroNotasPedido == "Sin presentar" ||
                tareaporcarpeta.PCEntregadoInspeccion == "Sin presentar" ||
                tareaporcarpeta.AvisosDeObra == "Sin presentar" ||
                tareaporcarpeta.CronogramaFirmadoComitente == "Sin presentar"
              ) {
                var tareageneralACargarDocumentacionInspeccion = "Sin presentar";
              }
              // ComunicacionObras
              if (tareaporcarpeta.OrdenServicio == "No") {
                var tareageneralACargarComunicacionObras = "ok";
              }
              if (tareaporcarpeta.OrdenServicio == "Si") {
                var tareageneralACargarComunicacionObras = "Leer historial de carpeta";
              }
              //CAOS
              var tareageneralACargarActasFinales = tareaporcarpeta.ActasFinales;
              var tareageneralACargarPlanosyCroquis = tareaporcarpeta.PlanosyCroquis;
              var tareageneralACargarConformeDePermisos = tareaporcarpeta.ConformeDePermisos;
              var tareageneralACargarPruebaHermeticidad = tareaporcarpeta.PruebaHermeticidad;
              var tareageneralACargarInformesFinales = tareaporcarpeta.InformesFinales;
              //FinalCarpeta
              var tareageneralACargarPresentacionFinal = tareaporcarpeta.PresentacionFinal;
              var tareageneralACargarHabilitacionObra = tareaporcarpeta.HabilitacionObra;
              sql = "UPDATE obras_tareasgenerales SET ? WHERE idObra=" + tareageneral.idObra + ";";
              connection.query(sql, {
                DocumentacionTerreno: tareageneralACargarDocumentacionTerreno,
                DocumentacionSociedad: tareageneralACargarDocumentacionSociedad,
                DocumentacionContractual: tareageneralACargarDocumentacionContractual,
                DocumentacionObra: tareageneralACargarDocumentacionObra,
                Seguridad: tareageneralACargarSeguridad,
                Interferencias: tareageneralACargarInterferencias,
                Permisos: tareageneralACargarPermisos,
                PermisosEspeciales: tareageneralACargarPermisosEspeciales,
                Matriculas: tareageneralACargarMatriculas,
                Ambiente: tareageneralACargarAmbiente,
                Avisos: tareageneralACargarAvisos,
                DocumentacionInspeccion: tareageneralACargarDocumentacionInspeccion,
                ComunicacionObras: tareageneralACargarComunicacionObras,
                InformesFinales: tareageneralACargarActasFinales,
                PlanosyCroquis: tareageneralACargarPlanosyCroquis,
                ConformeEntidades: tareageneralACargarConformeDePermisos,
                PruebaHermeticidad: tareageneralACargarPruebaHermeticidad,
                InformesFinales: tareageneralACargarInformesFinales,
                PresentacionFinal: tareageneralACargarPresentacionFinal,
                HabilitacionObra: tareageneralACargarHabilitacionObra,
              }, (error3, responseCargaTareaGenerales) => {
                if (error3) console.log(error3);
                else {
                }
              })
            }


          });
        });
      })
        .catch(error => {
          console.log('Error:', error);
        })





    }
    cargarFinalizadas().then(function () {
      actualizarEstadoGral().then(function () {
        res.locals.moment = moment;
        sql = "SELECT e.CodigoVigentes,e.CodigoFinalizadas,c.id, c.Nombre,c.NCarpeta,c.Ubicacion ,c.Comitente ,c.Estado,d.* ,b.* FROM obras_tareasgenerales b , codificacioncarpetas e , obras c, adminecogas_tareas_por_carpeta d WHERE b.Nombre = c.Nombre AND b.Nombre = e.Nombre AND d.Nombre = e.Nombre ";
        connection.query(sql, (error, results) => {
          if (error) console.log(error);
          if (results.length > 0) {
            res.render("paginas/AdministracionEcogas/estadogeneral.ejs", {
              results: results, moment: moment, Finalizadas: Finalizadas
            }
            ); //en {results:results} lo que hago es guardar los resultados que envia la bd, en la variable results
            // res.send(results);
          } else {
            res.send("Ningun resultado encontrado");
          }
        });
      });

    })

  } else {
    res.redirect("/");
  }
});
//Editar Tareas
router.get("/editarContacto/:id", (req, res) => {
  if (req.isAuthenticated()) {
    res.locals.moment = moment;
    const id = req.params.id;
    const sql = "SELECT * FROM contactos where id =?";
    connection.query(sql, [id], (error, results) => {
      if (error) console.log(error);
      if (results.length > 0) {
        res.render("paginas/AdministracionEcogas/editarContacto", {
          user: results[0],
        });
      } else {
        res.render("/adminecogas");
      }
    });
  } else {
    res.redirect("/");
  }
});
router.get("/editarTareas/:id", (req, res) => {
  if (req.isAuthenticated()) {
    const id = req.params.id;
    var Nombre = "";
    let sql;
    var resultados;
    var CodigoEnUsoVigentes = "";
    var CodigoFinalizadas = 0;
    var CodigoVigentes = 0;
    var interferenciasypermisos, tareasporcarpeta, tareasgenerales;
    var usuariosregistrados;
    var albacaucion;
    sql = 'SELECT * FROM admingeneral_seguros_albacaucion WHERE id_obra=' + id;
    connection.query(sql, (error, resultado) => {
      if (error) console.log(error);
      albacaucion = resultado;
    })
    var promise1 = new Promise(function (resolve, reject) {
      sql = "SELECT * FROM usuariosregistrados;";
      connection.query(sql, (error, respuesta) => {
        if (error) console.log(error);
        else {
          usuariosregistrados = respuesta;
        }
      })
      sql = "Select Nombre from obras where id=?";
      connection.query(sql, [id], (error, results) => {
        if (error) console.log(error);
        if (results.length > 0) {
          var contador = 0;
          Nombre = JSON.parse(JSON.stringify(results), function (k, v) {
            if (contador == 0) {
              contador = contador + 1;
              Nombre = v;
            }
            return (Nombre);
          });
          resolve(Nombre);
        }
      });
    }).then(function (Nombre) {
      sql = "Select * from codificacioncarpetas Where Nombre=?";
      connection.query(sql, [Nombre], (error, results) => {
        if (error) console.log(error);
        var contador = 0;
        JSON.parse(JSON.stringify(results), function (k, v) {
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
      });
      sql =
        "Select * from adminecogas_interferencias_y_permisos Where id_obra=?";
      connection.query(sql, [id], (error, results) => {
        if (error) console.log(error);
        interferenciasypermisos = results[0];
        sql = "Select * from adminecogas_tareas_por_carpeta WHERE id_obra=?";
        connection.query(sql, [id], (error2, results2) => {
          if (error2) console.log(error2);
          tareasporcarpeta = results2[0];
          sql = "Select * from obras_tareasgenerales WHERE Nombre=?";
          connection.query(sql, [Nombre], (error3, results3) => {
            if (error3) console.log(error3);
            tareasgenerales = results3[0];
            sql = "Select * from obras where id=?";
            connection.query(sql, [id], (error, results) => {
              if (error) console.log(error);
              if (results.length > 0) {

                //Se procede a enviar al front, los resultados de las consultas sql, prestar atencion que para que ejs pueda resolver el contenido de las sentencias hay que tratar las mismas como un arreglo [0], sino no funciona.

                res.render("paginas/AdministracionEcogas/editarTareas", {
                  moment: moment,
                  albacaucion: albacaucion,
                  user: results[0],
                  interferenciasypermisos,
                  tareasporcarpeta,
                  tareasgenerales,
                  CodigoVigentes,
                  CodigoEnUsoVigentes,
                  CodigoFinalizadas,
                  moment: moment,
                  usuariosregistrados,
                });



              } else {
                res.redirect("/adminecogas");
              }
            });
          });


        });
      });
    })



  }
});

//
router.get("/edit/:id", (req, res) => {
  if (req.isAuthenticated()) {
    res.locals.moment = moment;
    const id = req.params.id;
    var Nombre;
    var interferenciasypermisos2;
    var sql = "Select Nombre from obras where id=?";
    connection.query(sql, [id], (error, results) => {
      if (error) console.log(error);
      if (results.length > 0) {
        var contador = 0;
        JSON.parse(JSON.stringify(results), function (k, v) {
          if (contador == 0) {
            contador = contador + 1;
            Nombre = v;
          }
          return Nombre;
        });
      }
      sql = "select CodigoVigentes from codificacioncarpetas where Nombre=?";
      connection.query(sql, [Nombre], (error, Codigo) => {
        if (error) console.log(error);
        var contador = 1;
        var CodigoBDLimpio;
        JSON.parse(JSON.stringify(Codigo), function (k, v) {
          if (contador == 1) {
            contador = contador + 1;
            CodigoBDLimpio = v;
          }
        });
        sql =
          "Select * from adminecogas_interferencias_y_permisos where Nombre=?";
        connection.query(sql, [Nombre], (error, interferenciasypermisos) => {
          if (error) console.log(error);

          interferenciasypermisos2 = interferenciasypermisos;

          sql =
            "Select TipoDeRed from adminecogas_tareas_por_carpeta where Nombre=?";
          connection.query(sql, [Nombre], (error, TipoDeRed) => {
            if (error) console.log(error);

            sql = "Select * from obras where id=?";
            connection.query(sql, [id], (error, results) => {
              if (error) console.log(error);
              if (results.length > 0) {
                res.render("paginas/AdministracionEcogas/edit", {
                  user: results[0],
                  TipoDeRed: TipoDeRed,
                  Codigo: CodigoBDLimpio,
                  interferenciasypermisos: interferenciasypermisos2,
                });
              } else {
                res.render("/adminecogas");
              }
            });
          });
        });
      });
    });
  } else {
    res.redirect("/");
  }
});
router.get("/historialcarpeta/:Nombre", (req, res) => {
  if (req.isAuthenticated()) {
    var rol = req.user.rol;
    var id, NCarpeta;
    const Nombre = req.params.Nombre;
    var usuariosregistrados;
    var sql = "SELECT id,NCarpeta FROM obras WHERE Nombre =?";
    connection.query(sql, [Nombre], (error, results) => {
      if (error) console.log(error);
      if (results.length > 0) {
        id = results[0].id;
        NCarpeta = results[0].NCarpeta;
      }
    });
    sql = "SELECT * FROM usuariosregistrados;";
    connection.query(sql, (error, respuesta) => {
      if (error) console.log(error);
      else {
        usuariosregistrados = respuesta;
      }
    })
    sql = "SELECT c.* FROM historialdecambios c WHERE Nombre_sub =? ORDER BY id DESC";
    res.locals.moment = moment;
    connection.query(sql, [Nombre], (error, results) => {
      if (error) console.log(error);
      if (results.length > 0) {
        res.render("paginas/AdministracionEcogas/historialcarpeta.ejs", {
          results: results,
          id: id,
          Nombre: Nombre,
          NCarpeta, rol, usuariosregistrados,
        }); //en {results:results} lo que hago es guardar los resultados que envia la bd, en la variable results
      } else {
        res.render("paginas/AdministracionEcogas/historialcarpeta.ejs", {
          results: results,
          id: id,
          rol, usuariosregistrados,
        });
      }
    });
  } else {
    res.redirect("/");
  }
});
router.post("/historialcarpeta/CambiarResponsableDeTarea", (req, res) => {
  // if (req.isAuthenticated()) {
  var idEntradaHistorial = req.body.idEntradaEnHistorial;
  var ResponsableDeTarea = req.body.ResponsableDeTarea;
  var sql = "UPDATE historialdecambios SET? WHERE id =?";
  connection.query(
    sql,
    [{ ResponsableDeTarea: ResponsableDeTarea }, idEntradaHistorial],
    (error, results) => {
      if (error) console.log(error);
      else {
      }
    }
  );
  sql = "SELECT Nombre_sub FROM  historialdecambios WHERE id=?";
  connection.query(sql, idEntradaHistorial, (error, results2) => {
    if (error) console.log(error);
    else {
      var NombreObra = results2[0].Nombre_sub;
      res.redirect("/historialcarpeta/" + NombreObra);
    }
  });

  // }
  // else {res.redirect('/'); }
});
router.get("/ComunicacionAlSistema", (req, res) => {
  if (req.isAuthenticated()) {
    res.locals.moment = moment;
    res.locals.moment = moment;
    const sql = "Select * from comunicacionsistema";

    connection.query(sql, (error, results) => {
      if (error) console.log(error);
      if (results.length > 0) {
        res.render("paginas/AdministracionEcogas/ComunicacionAlSistema.ejs", {
          results: results,
        });
      } else {
        res.render("paginas/AdministracionEcogas/ComunicacionAlSistema.ejs", {
          results: "",
        });
      }
    });
  } else {
    res.redirect("/");
  }
});
router.get("/CodigoCarpeta", (req, res) => {
  if (req.isAuthenticated()) {
    res.locals.moment = moment;
    var sql = "";

    sql = "Select * from codificacioncarpetas where CodigoVigentes is not null";
    connection.query(sql, (error, resultado) => {
      if (resultado.length > 0) {
        res.render(
          "paginas/AdministracionEcogas/partials/editartareas/CodigoCarpeta.ejs",
          { resultado: resultado }
        );
      } else {
        res.send("Ningun resultado encontrado");
      }
    });
  } else {
    res.redirect("/");
  }
});
router.get("/GuiaParaElNuevo", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("paginas/AdministracionEcogas/GuiaParaNuevo.ejs");
  } else {
    res.redirect("/");
  }
});
//Rutas Post
router.post("/actualizarcontacto/:id", (req, res) => {
  const id = req.body.id;
  const Nombre = req.body.Nombre;
  const entidad = req.body.Entidad;
  const area = req.body.Area;
  const Puesto = req.body.Puesto;
  const Telefono = req.body.Telefono;
  const Correo = req.body.Correo;
  const sql = "Update contactos Set ? where id =?";
  console.log("intentando actualizar contacto " + Nombre);
  connection.query(
    sql,
    [
      {
        Nombre: Nombre,
        Entidad: entidad,
        Area: area,
        Puesto: Puesto,
        Telefono: Telefono,
        Correo: Correo,
      },
      id,
    ],
    (error, results) => {
      if (error) console.log(error);

      if (results.length > 0) {
        res.redirect("/contactos");
      } else {
        res.redirect("/contactos");
      }
    }
  );
});
router.post("/TareaOk/:Nombre", (req, res) => {
  var Nombre = req.params.Nombre;
  const TareaOk = req.body.TareaOK;
  const id = req.body.id;

  var sql = "Update historialdecambios Set ? where Nombre_sub =? and id =?";
  connection.query(
    sql,
    [
      {
        Si_NO_TareaRealizada: TareaOk,
      },
      Nombre,
      id,
    ],
    (error, results) => {
      if (error) console.log(error);
      if (results.length > 0) {
        res.redirect(req.get("referer"));
      } else {
        res.redirect(req.get("referer"));
      }
    }
  );
});
router.post("/update/:id", (req, res) => {
  res.locals.moment = moment;
  var CodigoNuevo = req.body.Codigo;
  var Codigo = req.body.CodigoOriginal; //Dicho valor, es el codigo original que tiene la base de datos antes de querer actualizarlo, ver el get de edit, para poder identificar la variable usada acá.
  if (CodigoNuevo == null || CodigoNuevo == "") {
    CodigoNuevo = Codigo;
  }
  var NombreOriginal = req.body.Nombre;
  var id = req.body.id;
  var NombreCarpeta = req.body.NombreCarpeta;
  var NCarpeta = req.body.NCarpeta;
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
  var sql = "";
  const DNVVisacion = req.body.DNV;
  const HIDRAULICAVisacion = req.body.HIDRAULICA;
  const FERROCARRILVisacion = req.body.FERROCARRIL;
  const TipoDeRed = req.body.TipoDeRed;
  console.log("Intentando actualizar el contacto:" + NombreCarpeta);
  //La siguiente parte del codigo, sirve para que la codificacion de la carpeta siempre se mantenga actualizada, y vigente.
  //Tambien, cuando se cambie el nombre de la carpeta, lo va a cambiar en todas las areas de la BD, para que no desaparezcan las tareas ni tampoco el historial.
  sql = "Update codificacioncarpetas Set? where Nombre=?";
  connection.query(
    sql,
    [
      {
        CodigoVigentes: CodigoNuevo,
        CodigoEnUsoVigentes: "S",
        Nombre: NombreCarpeta,
      },
      NombreOriginal,
    ],
    (error, results) => {
      if (error) console.log(error);
    }
  );
  //Se procede a buscar en la codificacion de las carpetas, si el codigo nuevo es de una carpeta Eliminada, dichas carpetas tienen en "CodigoEnUsoVigentes" una letra "E"
  //El objetivo es eliminar por completo la carpeta.
  sql =
    "Delete from codificacioncarpetas where CodigoEnUsoVigentes='E' &&  CodigoVigentes=?";
  connection.query(sql, [CodigoNuevo], (error) => {
    if (error) console.log(error);
  });
  //En caso de que el codigo no provenga de la carpeta eliminada, sino de una finalizada, se procede
  //a dejar la carpeta finalizada sin "CodigoVigentes".
  //Esto es con motivo de que deje de figurar como que el codigo esta disponible.
  sql =
    "Update codificacioncarpetas SET? where CodigoEnUsoVigentes='F' && CodigoVigentes=?";
  connection.query(
    sql,
    [
      {
        CodigoVigentes: null,
      },
      CodigoNuevo,
    ],
    (error) => {
      if (error) console.log(error);
    }
  );
  sql = "Update codificacioncarpetas set? where Nombre=?";
  connection.query(
    sql,
    [
      {
        CodigoVigentes: CodigoNuevo,
        CodigoEnUsoVigentes: "S",
        Nombre: NombreCarpeta,
      },
      NombreOriginal,
    ],
    (error, results) => {
      if (error) console.log(error);
    }
  );
  sql = "Update obras_tareasgenerales Set? where Nombre=?";
  connection.query(
    sql,
    [
      {
        Nombre: NombreCarpeta,
      },
      NombreOriginal,
    ],
    (error, results) => {
      if (error) console.log(error);
    }
  );
  sql = "Update historialdecambios Set? where Nombre_sub=?";
  connection.query(
    sql,
    [
      {
        Nombre_sub: NombreCarpeta,
      },
      NombreOriginal,
    ],
    (error, results) => {
      if (error) console.log(error);
    }
  );
  sql = "Update adminecogas_interferencias_y_permisos set? where Nombre=?";
  connection.query(
    sql,
    [
      {
        Nombre: NombreCarpeta,
        NCarpeta: NCarpeta,
        DNV: DNV,
        DPV: DPV,
        Irrigacion: Irrigacion,
        Hidraulica: HIDRAULICA,
        Ferrocarriles: FERROCARRIL,
        PerMunicipal: PerMunicipal,
        Privado: Privado,
        Otrospermisos: OTROSPERMISOS,
      },
      NombreOriginal,
    ],
    (error, results) => {
      if (error) console.log(error);
    }
  );
  sql = "Update adminecogas_tareas_por_carpeta set? where Nombre=?";
  connection.query(
    sql,
    [
      {
        Nombre: NombreCarpeta,
        NCarpeta: NCarpeta,
        TipoDeRed: TipoDeRed,
      },
      NombreOriginal,
    ],
    (error, results) => {
      if (error) console.log(error);
    }
  );
  sql = "Update obras Set ? where id =?";
  connection.query(
    sql,
    [
      {
        Nombre: NombreCarpeta,
        NCarpeta: NCarpeta,
        Comitente: Comitente,
        Ubicacion: Departamento,
      },
      id,
    ],
    (error, results) => {
      if (error) console.log(error);
      res.redirect("/editarTareas/" + id);
    }
  );
});
router.post("/edit/delete/:id", (req, res) => {
  const id = req.body.id;
  const Nombre = req.body.Nombre;
  var sql = "";
  sql = "Update codificacioncarpetas set? where Nombre=?";
  connection.query(
    sql,
    [
      {
        CodigoEnUsoVigentes: "E",
      },
      Nombre,
    ],
    (error, results) => {
      if (error) {
        console.log(error);
      }
    }
  );
  sql = "Delete FROM adminecogas_interferencias_y_permisos WHERE Nombre =?";
  connection.query(sql, [id], (error, results) => {
    if (error) console.log(error);
    if (results.length > 0) {
    }
  });
  sql = "Delete FROM adminecogas_tareas_por_carpeta WHERE Nombre =?";
  connection.query(sql, [id], (error, results) => {
    if (error) console.log(error);
    if (results.length > 0) {
    }
  });
  sql = "Delete FROM obras_tareasgenerales WHERE Nombre =?";
  connection.query(sql, [Nombre], (error, results) => {
    if (error) console.log(error);
  });
  sql = "Update historialdecambios set? WHERE Nombre_sub =?";
  connection.query(
    sql,
    [
      {
        Si_NO_TareaRealizada: "S",
      },
      Nombre,
    ],
    (error, results) => {
      if (error) console.log(error);
    }
  );
  sql = "Update obras set? WHERE id =?";
  res.locals.moment = moment;
  connection.query(
    sql,
    [
      {
        Estado: "ELIMINADO",
      },
      id,
    ],
    (error, results) => {
      if (error) console.log(error);
      res.redirect("/adminecogas");
    }
  );
});
router.post("/actPrelCarpEcogas/:id", upload.none(), function (req, res) {
  var id = req.body.id;
  var Nombre = req.body.Nombre;
  var sql = "";
  var idObra = id;
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

  if (
    (Mensura == "Ok" || Mensura == "ok" || Mensura == "NC") &&
    (TituloDePropiedad == "Ok" ||
      TituloDePropiedad == "ok" ||
      TituloDePropiedad == "NC")
  ) {
    DocumentacionTerreno = "ok";
  }
  if (Mensura == "EnGestion" || TituloDePropiedad == "EnGestion") {
    DocumentacionTerreno = "EnGestion";
  }
  if (Mensura == "Sin presentar" || TituloDePropiedad == "Sin presentar") {
    DocumentacionTerreno = "Sin presentar";
  }
  //Documentacion Sociedad
  if (
    (ActaConstitutiva == "Ok" ||
      ActaConstitutiva == "ok" ||
      ActaConstitutiva == "NC") &&
    (ActaCargoVigente == "ok" || ActaCargoVigente == "Ok" || ActaCargoVigente == "NC")
  ) {
    DocumentacionSociedad = "ok";
  }
  if (ActaConstitutiva == "EnGestion" || ActaCargoVigente == "EnGestion") {
    DocumentacionSociedad = "EnGestion";
  }
  if (
    ActaConstitutiva == "Sin presentar" ||
    ActaCargoVigente == "Sin presentar"
  ) {
    DocumentacionSociedad = "Sin presentar";
  }
  //Documentacion Contractual
  if (
    (Cotizacion == "ok" || Cotizacion == "Ok" || Cotizacion == "NC") &&
    (Contrato == "Ok(Preliminar)" || Contrato == "ok(Preliminar)" ||
      Contrato == "ok" || Contrato == "Ok" ||
      Contrato == "NC(Preliminar)" ||
      Contrato == "NC")
  ) {
    DocumentacionContractual = "ok";
  }
  if (
    Cotizacion == "EnGestion" ||
    Contrato == "EnGestion" ||
    Contrato == "EnGestion(Preliminar)"
  ) {
    DocumentacionContractual = "EnGestion";
  }
  if (
    Cotizacion == "Sin presentar" ||
    Contrato == "Sin presentar" ||
    Contrato == "Sin presentar(Preliminar)"
  ) {
    DocumentacionContractual = "Sin presentar";
  }
  var PropuestaDeTraza="Sin presentar";
  if( req.body.AutorizacionPropuestaDeTraza=="Ok"||
    req.body.SolicitudDePedidoPropuestaDeTraza=="Ok"||
    req.body.KMLPropuestaDeTraza=="Ok"){
      PropuestaDeTraza="Ok";
    }
  if( req.body.AutorizacionPropuestaDeTraza=="Presentado"&&
    req.body.SolicitudDePedidoPropuestaDeTraza=="Presentado"&&
    req.body.KMLPropuestaDeTraza=="Presentado"){
      PropuestaDeTraza="Presentado";
    }
    if( req.body.AutorizacionPropuestaDeTraza=="Observado"||
    req.body.SolicitudDePedidoPropuestaDeTraza=="Observado"||
    req.body.KMLPropuestaDeTraza=="Observado"){
      PropuestaDeTraza="Observado";
    }
  if( req.body.AutorizacionPropuestaDeTraza=="Sin presentar"||
    req.body.SolicitudDePedidoPropuestaDeTraza=="Sin presentar"||
    req.body.KMLPropuestaDeTraza=="Sin presentar"){
      PropuestaDeTraza="Sin presentar";
    }
    
    if( req.body.AutorizacionPropuestaDeTraza=="EnGestion"||
    req.body.SolicitudDePedidoPropuestaDeTraza=="EnGestion"||
    req.body.KMLPropuestaDeTraza=="EnGestion"){
      PropuestaDeTraza="EnGestion";
    }
  sql = "UPDATE obras_tareasgenerales SET ? WHERE Nombre=?";
  connection.query(
    sql,
    [
      {

        DocumentacionTerreno: DocumentacionTerreno,
        DocumentacionSociedad: DocumentacionSociedad,
        DocumentacionContractual: DocumentacionContractual,
      },
      Nombre,
    ],
    (error, results) => {
      if (error) {
        console.log(error);
      }
    }
  );
  sql = "Update adminecogas_tareas_por_carpeta Set ? where Nombre=?";
  connection.query(
    sql,
    [
      {
        AutorizacionPropuestaDeTraza: req.body.AutorizacionPropuestaDeTraza,
        SolicitudDePedidoPropuestaDeTraza:req.body.SolicitudDePedidoPropuestaDeTraza,
        KMLPropuestaDeTraza:req.body.KMLPropuestaDeTraza,
        Mensura: Mensura,
        TituloDePropiedad: TituloDePropiedad,
        ActaCargoVigente: ActaCargoVigente,
        ActaConstitutiva: ActaConstitutiva,
        Cotizacion: Cotizacion,
        Contrato: Contrato,
      },
      Nombre,
    ],
    (error, results) => {
      if (error) console.log(error);
    }
  );

  //Seccion Actualizar Tareas

  let fecha = new Date();
  Nombre = req.body.Nombre;
  TareaRealizada = req.body.TareaRealizada;
  ProximaTarea = req.body.ProximaTarea;
  Fecha_limite = req.body.Fecha_limite;
  Fecha_Tarea_sub = fecha;
  ResponsableDeTarea = req.body.ResponsableDeTarea;
  var EtapaTarea = req.body.EtapaTarea;
  var tarea = req.body.Tarea;
  sql = "";
  res.locals.moment = moment;
  var arregloTareas = [];

  TareaRealizada.forEach((element, index) => {
    var tarearealizada = TareaRealizada[index];
    var proximatarea = ProximaTarea[index];
    var fechalimite = Fecha_limite[index];
    var fechatarea = Fecha_Tarea_sub;
    var responsabletarea = ResponsableDeTarea[index];
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

  arregloTareas.forEach((element) => {
    if (element.tarearealizada == "") {
      if (element.proximatarea == "") {
      } else {
        if (element.fechalimite) {
          if (TareaRealizada != null) {
            sql = "Update adminecogas_tareas_por_carpeta set? where id_obra=?";
            connection.query(
              sql,
              [
                {
                  EtapaTarea: EtapaTarea,
                  TareaRealizada: element.tarearealizada,
                  Fechalimite: element.fechalimite,
                },
                id,
              ],
              (error, results) => {
                if (error) console.log(error);
              }
            );
            sql = "Insert into historialdecambios set?";
            connection.query(
              sql,
              [
                {
                  EtapaTarea_sub: EtapaTarea,
                  Tarea: EtapaTarea,
                  id_obra: idObra,
                  ResponsableDeTarea: element.responsabletarea,
                  Si_NO_TareaRealizada: "N",
                  Nombre_sub: Nombre,
                  Tarea_Realizada_sub: element.tarearealizada,
                  Proxima_Tarea_sub: element.proximatarea,
                  Fecha_Proxima_Tarea_sub: element.fechalimite,
                  Fecha_Tarea_sub: element.fechatarea,
                },
              ],
              (error, results) => {
                if (error) console.log(error);
              }
            );
          }
        } else {
          if (TareaRealizada != null) {
            sql = "Update adminecogas_tareas_por_carpeta set? where id_obra=?";
            connection.query(
              sql,
              [
                {
                  EtapaTarea: EtapaTarea,
                  TareaRealizada: element.tarearealizada,
                },
                id,
              ],
              (error, results) => {
                if (error) console.log(error);
              }
            );
            sql = "Insert into historialdecambios set?";
            connection.query(
              sql,
              [
                {
                  EtapaTarea_sub: EtapaTarea,
                  Tarea: EtapaTarea,
                  id_obra: idObra,
                  ResponsableDeTarea: element.responsabletarea,
                  Si_NO_TareaRealizada: "N",
                  Nombre_sub: Nombre,
                  Tarea_Realizada_sub: element.tarearealizada,
                  Proxima_Tarea_sub: element.proximatarea,
                  Fecha_Tarea_sub: element.fechatarea,
                },
              ],
              (error, results) => {
                if (error) console.log(error);
              }
            );
          } else {
          }
        }
      }
    } else {
      if (element.fechalimite) {
        if (TareaRealizada != null) {
          sql = "Update adminecogas_tareas_por_carpeta set? where id_obra=?";
          connection.query(
            sql,
            [
              {
                Estado: EtapaTarea,
                EtapaTarea: element.etapatarea,
                TareaRealizada: element.tarearealizada,
                Fechalimite: element.fechalimite,
              },
              id,
            ],
            (error, results) => {
              if (error) console.log(error);
            }
          );
          sql = "Insert into historialdecambios set?";
          connection.query(
            sql,
            [
              {
                EtapaTarea_sub: EtapaTarea,
                Tarea: EtapaTarea,
                id_obra: idObra,
                ResponsableDeTarea: element.responsabletarea,
                Si_NO_TareaRealizada: "N",
                Nombre_sub: Nombre,
                Tarea_Realizada_sub: element.tarearealizada,
                Proxima_Tarea_sub: element.proximatarea,
                Fecha_Proxima_Tarea_sub: element.fechalimite,
                Fecha_Tarea_sub: element.fechatarea,
              },
            ],
            (error, results) => {
              if (error) console.log(error);
            }
          );
        }
      } else {
        if (TareaRealizada != null) {
          sql = "Update adminecogas_tareas_por_carpeta set? where id_obra=?";
          connection.query(
            sql,
            [{ EtapaTarea: EtapaTarea, TareaRealizada: TareaRealizada }, id],
            (error, results) => {
              if (error) console.log(error);
            }
          );
          sql = "Insert into historialdecambios set?";
          connection.query(
            sql,
            [
              {
                EtapaTarea_sub: EtapaTarea,
                Tarea: EtapaTarea,
                id_obra: idObra,
                ResponsableDeTarea: element.responsabletarea,
                Si_NO_TareaRealizada: "N",
                Nombre_sub: Nombre,
                Tarea_Realizada_sub: element.tarearealizada,
                Proxima_Tarea_sub: element.proximatarea,
                Fecha_Tarea_sub: element.fechatarea,
              },
            ],
            (error, results) => {
              if (error) console.log(error);
            }
          );
        } else {
        }
      }
    }
  });

  res.redirect("/historialcarpeta/" + Nombre);
});
router.post("/act1pCarpEcogas/:id", upload.none(), function (req, res) {
  var id = req.body.id;
  var Nombre = req.body.Nombre;
  var sql = "";
  var idObra = id;
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
  if (FechaFirmaContrato == "") {
    FechaFirmaContrato = null;
  }
  var CuestionarioRelevamientoAmbiental =
    req.body.CuestionarioRelevamientoAmbiental;
  var DDJJInicialAmbiental = req.body.DDJJInicialAmbiental;
  var ListaVerificacionAmbiental = req.body.ListaVerificacionAmbiental;
  var DocumentacionAmbiente = "Sin Presentar";
  var TituloDePropiedad = req.body.TituloDePropiedad;
  var Mensura = req.body.Mensura;
  var EstudioImpactoAmbientalPrevio = req.body.EstudioImpactoAmbientalPrevio;
  // Variables Generales
  var Comercial;
  var Tecnica, PermisosEspeciales;
  var DocumentacionTerreno;
  //Documentacion del terreno
  if (
    (Mensura == "ok" || Mensura == "Ok" || Mensura == "NC") &&
    (TituloDePropiedad == "ok" || TituloDePropiedad == "Ok" || TituloDePropiedad == "NC")
  ) {
    DocumentacionTerreno = "ok";
  }
  if (Mensura == "EnGestion" || TituloDePropiedad == "EnGestion") {
    DocumentacionTerreno = "EnGestion";
  }
  if (Mensura == "Sin presentar" || TituloDePropiedad == "Sin presentar") {
    DocumentacionTerreno = "Sin presentar";
  }
  // Comercial
  if (
    (Contrato == "ok" || Contrato == "Ok" || Contrato == "Ok(Preliminar)") &&
    (Presupuesto == "ok" || Presupuesto == "Ok") &&
    (Sucedaneo == "ok" || Sucedaneo == "Ok") &&
    (NotaDeExcepcion == "ok" || NotaDeExcepcion == "Ok" || NotaDeExcepcion == "NC")
  ) {
    Comercial = "ok";
  }
  if (
    Contrato == "Presentado" ||
    Presupuesto == "Presentado" ||
    Sucedaneo == "Presentado" ||
    NotaDeExcepcion == "Presentado"
  ) {
    Comercial = "Presentado";
  }
  if (
    Contrato == "EnGestion" ||
    Presupuesto == "EnGestion" ||
    Sucedaneo == "EnGestion" ||
    NotaDeExcepcion == "EnGestion"
  ) {
    Comercial = "EnGestion";
  }


  if (
    Contrato == "Observado" ||
    Presupuesto == "Observado" ||
    Sucedaneo == "Observado" ||
    NotaDeExcepcion == "Observado"
  ) {
    Comercial = "Observado";
  }
  //Tecnica
  if ((Pcaprobado == "ok" || Pcaprobado == "Ok") && (PlanoTipo == "ok" || PlanoTipo == "Ok" || PlanoTipo == "NC")) {
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
  if (
    (CartaOferta == "ok" || CartaOferta == "Ok" || CartaOferta == "NC" || CartaOferta == "") &&
    (PlanoAnexo == "ok" || PlanoAnexo == "Ok" || PlanoAnexo == "NC" || PlanoAnexo == "") &&
    (DNVVisacion == "Visado" || DNVVisacion == "No corresponde" || DNVVisacion == "NC" || DNVVisacion == "") &&
    (HidraulicaVisacion == "Visado" || HidraulicaVisacion == "No corresponde" ||
      HidraulicaVisacion == "NC" ||
      HidraulicaVisacion == "") &&
    (FerrocarrilesVisacion == "Visado" || FerrocarrilesVisacion == "No corresponde" ||
      FerrocarrilesVisacion == "NC" ||
      FerrocarrilesVisacion == "")
  ) {
    PermisosEspeciales = "ok";
  }
  if (
    CartaOferta == "EnGestion" ||
    PlanoAnexo == "EnGestion" ||
    DNVVisacion == "EnGestion" ||
    HidraulicaVisacion == "EnGestion" ||
    FerrocarrilesVisacion == "EnGestion"
  ) {
    PermisosEspeciales = "EnGestion";
  }
  if (
    CartaOferta == "Presentado" ||
    PlanoAnexo == "Presentado" ||
    DNVVisacion == "Presentado" ||
    HidraulicaVisacion == "Presentado" ||
    FerrocarrilesVisacion == "Presentado"
  ) {
    PermisosEspeciales = "Presentado";
  }
  if (
    CartaOferta == "Observado" ||
    PlanoAnexo == "Observado" ||
    DNVVisacion == "Observado" ||
    HidraulicaVisacion == "Observado" ||
    FerrocarrilesVisacion == "Observado"
  ) {
    PermisosEspeciales = "Observado";
  }
  if (
    (CartaOferta == "Sin presentar" || CartaOferta == "Pedir") ||
    (PlanoAnexo == "Sin presentar" || PlanoAnexo == "Pedir") ||
    (DNVVisacion == "Sin presentar" || DNVVisacion == "Pedir") ||
    (HidraulicaVisacion == "Sin presentar" || HidraulicaVisacion == "Pedir") ||
    (FerrocarrilesVisacion == "Sin presentar" || FerrocarrilesVisacion == "Pedir")
  ) {
    PermisosEspeciales = "Sin presentar";
  }
  //Documentacion Ambiental
  if (
    (CuestionarioRelevamientoAmbiental == "ok" || CuestionarioRelevamientoAmbiental == "Ok") &&
    (EstudioImpactoAmbientalPrevio == "ok" || EstudioImpactoAmbientalPrevio == "Ok" ||
      EstudioImpactoAmbientalPrevio == "NC" ||
      EstudioImpactoAmbientalPrevio == "ok(Previo)" ||
      EstudioImpactoAmbientalPrevio == "NC(Previo)" || EstudioImpactoAmbientalPrevio == "NC") &&
    (DDJJInicialAmbiental == "ok" || DDJJInicialAmbiental == "Ok") &&
    (ListaVerificacionAmbiental == "ok" || ListaVerificacionAmbiental == "Ok" || ListaVerificacionAmbiental == "NC")
  ) {
    DocumentacionAmbiente = "ok";
  }

  if (
    CuestionarioRelevamientoAmbiental == "EnGestion" ||
    EstudioImpactoAmbientalPrevio == "EnGestion" ||
    DDJJInicialAmbiental == "EnGestion" ||
    ListaVerificacionAmbiental == "EnGestion"
  ) {
    DocumentacionAmbiente = "EnGestion";
  }
  if (
    CuestionarioRelevamientoAmbiental == "Presentado" ||
    EstudioImpactoAmbientalPrevio == "Presentado" ||
    DDJJInicialAmbiental == "Presentado" ||
    ListaVerificacionAmbiental == "Presentado"
  ) {
    DocumentacionAmbiente = "Presentado";
  }
  if (
    CuestionarioRelevamientoAmbiental == "Observado" ||
    EstudioImpactoAmbientalPrevio == "Observado" ||
    DDJJInicialAmbiental == "Observado" ||
    ListaVerificacionAmbiental == "Observado"
  ) {
    DocumentacionAmbiente = "Observado";
  }
  sql = "Update obras_tareasgenerales Set ? where Nombre=?";
  connection.query(
    sql,
    [
      {
        DocumentacionTerreno: DocumentacionTerreno,
        Comercial: Comercial,
        Tecnica: Tecnica,
        PermisosEspeciales: PermisosEspeciales,
        DocumentacionAmbiental: DocumentacionAmbiente,
      },
      Nombre,
    ],
    (error, results) => {
      if (error) {
        console.log(error);
      }
    }
  );
  sql = "Update adminecogas_interferencias_y_permisos Set ? where Nombre=?";
  connection.query(
    sql,
    [
      {
        //Primera Parte
        HidraulicaVisacion: HidraulicaVisacion,
        DNVVisacion: DNVVisacion,
        FerrocarrilesVisacion: FerrocarrilesVisacion,
      },
      Nombre,
    ],
    (error, results) => {
      if (error) {
        console.log(error);
      }
    }
  );
  sql = "Update adminecogas_tareas_por_carpeta Set ? where Nombre=?";
  connection.query(
    sql,
    [
      {
        Mensura: Mensura,
        TituloDePropiedad: TituloDePropiedad,
        EstudioImpactoAmbiental: EstudioImpactoAmbientalPrevio,
        Contrato: Contrato,
        Presupuesto: Presupuesto,
        Sucedaneo: Sucedaneo,
        NotaDeExcepcion: NotaDeExcepcion,
        PCaprobado: Pcaprobado,
        FechaFirmaContrato: FechaFirmaContrato,
        PlanoTipo: PlanoTipo,
        CartaOferta: CartaOferta,
        PlanoAnexo: PlanoAnexo,
        CuestionarioRelevamientoAmbiental: CuestionarioRelevamientoAmbiental,
        DDJJInicialAmbiental: DDJJInicialAmbiental,
        ListaVerificacionAmbiental: ListaVerificacionAmbiental,
      },
      Nombre,
    ],
    (error, results) => {
      if (error) {
        console.log(error);
      }
    }
  );

  //Seccion Actualizar Tareas

  let fecha = new Date();
  Nombre = req.body.Nombre;
  TareaRealizada = req.body.TareaRealizada;
  ProximaTarea = req.body.ProximaTarea;
  Fecha_limite = req.body.Fecha_limite;
  Fecha_Tarea_sub = fecha;
  ResponsableDeTarea = req.body.ResponsableDeTarea;
  var EtapaTarea = req.body.EtapaTarea;
  var tarea = req.body.Tarea;
  sql = "";
  res.locals.moment = moment;
  var arregloTareas = [];

  TareaRealizada.forEach((element, index) => {
    var tarearealizada = TareaRealizada[index];
    var proximatarea = ProximaTarea[index];
    var fechalimite = Fecha_limite[index];
    var fechatarea = Fecha_Tarea_sub;
    var responsabletarea = ResponsableDeTarea[index];
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

  arregloTareas.forEach((element) => {
    if (element.tarearealizada == "") {
      if (element.proximatarea == "") {
      } else {
        if (element.fechalimite) {
          if (TareaRealizada != null) {
            sql = "Update adminecogas_tareas_por_carpeta set? where id_obra=?";
            connection.query(
              sql,
              [
                {
                  EtapaTarea: EtapaTarea,
                  TareaRealizada: element.tarearealizada,
                  Fechalimite: element.fechalimite,
                },
                id,
              ],
              (error, results) => {
                if (error) console.log(error);
              }
            );
            sql = "Insert into historialdecambios set?";
            connection.query(
              sql,
              [
                {
                  EtapaTarea_sub: EtapaTarea,
                  id_obra: idObra,
                  ResponsableDeTarea: element.responsabletarea,
                  Si_NO_TareaRealizada: "N",
                  Nombre_sub: Nombre,
                  Tarea_Realizada_sub: element.tarearealizada,
                  Proxima_Tarea_sub: element.proximatarea,
                  Fecha_Proxima_Tarea_sub: element.fechalimite,
                  Fecha_Tarea_sub: element.fechatarea,
                },
              ],
              (error, results) => {
                if (error) console.log(error);
              }
            );
          }
        } else {
          if (TareaRealizada != null) {
            sql = "Update adminecogas_tareas_por_carpeta set? where id_obra=?";
            connection.query(
              sql,
              [
                {
                  EtapaTarea: EtapaTarea,
                  TareaRealizada: element.tarearealizada,
                },
                id,
              ],
              (error, results) => {
                if (error) console.log(error);
              }
            );
            sql = "Insert into historialdecambios set?";
            connection.query(
              sql,
              [
                {
                  EtapaTarea_sub: EtapaTarea,
                  Tarea: EtapaTarea,
                  id_obra: idObra,
                  ResponsableDeTarea: element.responsabletarea,
                  Si_NO_TareaRealizada: "N",
                  Nombre_sub: Nombre,
                  Tarea_Realizada_sub: element.tarearealizada,
                  Proxima_Tarea_sub: element.proximatarea,
                  Fecha_Tarea_sub: element.fechatarea,
                },
              ],
              (error, results) => {
                if (error) console.log(error);
              }
            );
          } else {
          }
        }
      }
    } else {
      if (element.fechalimite) {
        if (TareaRealizada != null) {
          sql = "Update adminecogas_tareas_por_carpeta set? where id_obra=?";
          connection.query(
            sql,
            [
              {
                EtapaTarea: EtapaTarea,
                TareaRealizada: element.tarearealizada,
                Fechalimite: element.fechalimite,
              },
              id,
            ],
            (error, results) => {
              if (error) console.log(error);
            }
          );
          sql = "Insert into historialdecambios set?";
          connection.query(
            sql,
            [
              {
                EtapaTarea_sub: EtapaTarea,
                id_obra: idObra,
                Tarea: EtapaTarea,
                ResponsableDeTarea: element.responsabletarea,
                Si_NO_TareaRealizada: "N",
                Nombre_sub: Nombre,
                Tarea_Realizada_sub: element.tarearealizada,
                Proxima_Tarea_sub: element.proximatarea,
                Fecha_Proxima_Tarea_sub: element.fechalimite,
                Fecha_Tarea_sub: element.fechatarea,
              },
            ],
            (error, results) => {
              if (error) console.log(error);
            }
          );
        }
      } else {
        if (TareaRealizada != null) {
          sql = "Update adminecogas_tareas_por_carpeta set? where id_obra=?";
          connection.query(
            sql,
            [{ EtapaTarea: EtapaTarea, TareaRealizada: TareaRealizada }, id],
            (error, results) => {
              if (error) console.log(error);
            }
          );
          sql = "Insert into historialdecambios set?";
          connection.query(
            sql,
            [
              {
                EtapaTarea_sub: EtapaTarea,
                id_obra: idObra,
                Tarea: EtapaTarea,
                ResponsableDeTarea: element.responsabletarea,
                Si_NO_TareaRealizada: "N",
                Nombre_sub: Nombre,
                Tarea_Realizada_sub: element.tarearealizada,
                Proxima_Tarea_sub: element.proximatarea,
                Fecha_Tarea_sub: element.fechatarea,
              },
            ],
            (error, results) => {
              if (error) console.log(error);
            }
          );
        } else {
        }
      }
    }
  });
  res.redirect("/historialcarpeta/" + Nombre);
});
router.post("/act2pCarpEcogas/:id", upload.none(), function (req, res) {
  var id = req.body.id;
  var Nombre = req.body.Nombre;
  var sql = "";
  var FechaDiaActual = new Date();
  sql = "SELECT id FROM obras WHERE Nombre =?";
  var idObra = id;

  // Primera seccion
  var MailAutorizacion = req.body.MailAutorizacion;
  var PlanDeTrabajo = req.body.PlanDeTrabajo;
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
  var VencimientoFerrocarril,
    VencimientoHidraulica,
    VencimientoMunicipal,
    VencimientoDPV,
    VencimientoDNV,
    VencimientoIrrigacion,
    VencimientoPrivado,
    VencimientoOtrosPermisos,
    VencimientoAvisoObraIeric,
    VencimientoAvisoObraArt;
  VencimientoFerrocarril = req.body.VencimientoFerrocarril;
  VencimientoHidraulica = req.body.VencimientoHidraulica;
  VencimientoMunicipal = req.body.VencimientoMunicipal;
  VencimientoDPV = req.body.VencimientoDPV;
  VencimientoDNV = req.body.VencimientoDNV;
  VencimientoIrrigacion = req.body.VencimientoIrrigacion;
  VencimientoPrivado = req.body.VencimientoPrivado;
  VencimientoOtrosPermisos = req.body.VencimientoOtrosPermisos;
  VencimientoAvisoObraArt = req.body.VencimientoAvisoObraArt;
  VencimientoAvisoObraIeric = req.body.VencimientoAvisoObraIeric;
  if (VencimientoFerrocarril == "") VencimientoFerrocarril = "0000-00-00";
  if (VencimientoHidraulica == "") VencimientoHidraulica = "0000-00-00";
  if (VencimientoMunicipal == "") VencimientoMunicipal = "0000-00-00";
  if (VencimientoDPV == "") VencimientoDPV = "0000-00-00";
  if (VencimientoDNV == "") VencimientoDNV = "0000-00-00";
  if (VencimientoIrrigacion == "") VencimientoIrrigacion = "0000-00-00";
  if (VencimientoPrivado == "") VencimientoPrivado = "0000-00-00";
  if (VencimientoOtrosPermisos == "") VencimientoOtrosPermisos = "0000-00-00";
  if (VencimientoAvisoObraArt == "") VencimientoAvisoObraArt = "0000-00-00";
  if (VencimientoAvisoObraIeric == "") VencimientoAvisoObraIeric = "0000-00-00";
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

  if (intTelefonicaPedida == "") intTelefonicaPedida = "0000-00-00";
  if (intTelefonicaObtenida == "") intTelefonicaObtenida = "0000-00-00";

  if (intAguaPedida == "") intAguaPedida = "0000-00-00";
  if (intAguaObtenida == "") intAguaObtenida = "0000-00-00";

  if (intCloacasPedida == "") intCloacasPedida = "0000-00-00";
  if (intCloacasObtenida == "") intCloacasObtenida = "0000-00-00";

  if (intElectricidadPedida == "") intElectricidadPedida = "0000-00-00";
  if (intElectricidadObtenida == "") intElectricidadObtenida = "0000-00-00";

  if (intClaroPedida == "") intClaroPedida = "0000-00-00";
  if (intClaroObtenida == "") intClaroObtenida = "0000-00-00";

  if (intArnet == "") intArnet = "0000-00-00";
  if (intArnetPedida == "") intArnetPedida = "0000-00-00";
  if (intArnetObtenida == "") intArnetObtenida = "0000-00-00";

  if (intArsatPedida == "") intArsatPedida = "0000-00-00";
  if (intArsatObtenida == "") intArsatObtenida = "0000-00-00";

  if (intTelecomPedida == "") intTelecomPedida = "0000-00-00";
  if (intTelecomObtenida == "") intTelecomObtenida = "0000-00-00";

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
  var DocumentacionObra,
    Seguridad,
    Interferencias,
    Permisos,
    Matriculas,
    Ambiente,
    Avisos,
    PermisosEspeciales;

  //Documentación de obra
  if ((SolicitudInicioObras == "ok" || SolicitudInicioObras == "Ok") && (CertificadoRT == "ok" || CertificadoRT == "Ok")) {
    DocumentacionObra = "ok";
  }
  if (SolicitudInicioObras == "Presentado" || CertificadoRT == "EnGestion") {
    DocumentacionObra = "EnGestion";
  }
  if (
    SolicitudInicioObras == "Sin presentar" ||
    CertificadoRT == "Sin presentar"
  ) {
    DocumentacionObra = "Sin presentar";
  }
  //Seguridad
  if (
    (Programadeseguridad == "ok" || Programadeseguridad == "Ok") &&
    (CronogramaSyH == "ok" || CronogramaSyH == "Ok") &&
    (SeguroRC == "ok" || SeguroRC == "Ok") &&
    (Monotributos == "ok" || Monotributos == "Ok" || Monotributos == "NC") &&
    (SeguroAccidentesPersonales == "ok" || SeguroAccidentesPersonales == "Ok" || SeguroAccidentesPersonales == "NC")
  ) {
    Seguridad = "ok";
  }
  if (
    Programadeseguridad == "EnGestion" ||
    CronogramaSyH == "EnGestion" ||
    SeguroRC == "EnGestion" ||
    Monotributos == "EnGestion" ||
    SeguroAccidentesPersonales == "EnGestion"
  ) {
    Seguridad = "EnGestion";
  }
  if (
    Programadeseguridad == "Sin presentar" ||
    CronogramaSyH == "Sin presentar" ||
    SeguroRC == "Sin presentar" ||
    Monotributos == "Sin presentar" ||
    SeguroAccidentesPersonales == "Sin presentar"
  ) {
    Seguridad = "Sin presentar";
  }

  //Interferencias
  if (
    (intAgua == "ok" || intAgua == "Ok") ||
    (intAgua == "NC" && (intCloacas == "ok" || intCloacas == "Ok")) ||
    (intCloacas == "NC" && (intElectricidad == "ok" || intElectricidad == "Ok")) ||
    (intElectricidad == "NC" && (intArsat == "ok" || intArsat == "Ok")) ||
    (intArsat == "NC" && (intClaro == "ok" || intClaro == "Ok")) ||
    (intClaro == "NC" && (intTelefonica == "ok" || intTelefonica == "Ok")) ||
    (intTelefonica == "NC" && (intArnet == "ok" || intArnet == "Ok")) ||
    (intArnet == "NC" && (intTelecom == "ok" || intTelecom == "Ok")) ||
    intTelecom == "NC"
  ) {
    Interferencias = "ok";
  }
  if (
    intAgua == "EnGestion" ||
    intCloacas == "EnGestion" ||
    intElectricidad == "EnGestion" ||
    intArsat == "EnGestion" ||
    intClaro == "EnGestion" ||
    intTelefonica == "EnGestion" ||
    intArnet == "EnGestion" ||
    intTelecom == "EnGestion" ||
    intAgua == "Pedida" ||
    intCloacas == "Pedida" ||
    intElectricidad == "Pedida" ||
    intArsat == "Pedida" ||
    intClaro == "Pedida" ||
    intTelefonica == "Pedida" ||
    intArnet == "Pedida" ||
    intTelecom == "Pedida"
  ) {
    Interferencias = "EnGestion";
  }

  //Vencimientos de interferencias (Si se vencen, se pondran en modo "Pedir")
  if (
    new Date(intAguaObtenida) < FechaDiaActual ||
    new Date(intCloacasObtenida) < FechaDiaActual ||
    new Date(intTelefonicaObtenida) < FechaDiaActual ||
    new Date(intArnetObtenida) < FechaDiaActual ||
    new Date(intClaroObtenida) < FechaDiaActual ||
    new Date(intElectricidadObtenida) < FechaDiaActual ||
    new Date(intTelecomObtenida) < FechaDiaActual
  ) {
    Interferencias = "Pedir";
  }
  //Permisos
  if (
    PerMunicipal == "Pedir" ||
    Irrigacion == "Pedir" ||
    DPV == "Pedir" ||
    DNV == "Pedir" ||
    FERROCARRIL == "Pedir" ||
    HIDRAULICA == "Pedir" ||
    PerMunicipal == "pedir" ||
    Irrigacion == "pedir" ||
    DPV == "pedir" ||
    DNV == "pedir" ||
    FERROCARRIL == "pedir" ||
    HIDRAULICA == "pedir" ||
    PerMunicipal == "Sin presentar" ||
    Irrigacion == "Sin presentar" ||
    DPV == "Sin presentar" ||
    DNV == "Sin presentar" ||
    FERROCARRIL == "Sin presentar" ||
    HIDRAULICA == "Sin presentar"
  ) {
    Permisos = "Pedir";
  }
  if (
    ((PerMunicipal == "ok" || PerMunicipal == "Ok") || PerMunicipal == "NC") &&
    ((Irrigacion == "ok" || Irrigacion == "Ok") || Irrigacion == "NC") &&
    ((DPV == "ok" || DPV == "Ok") || DPV == "NC") &&
    ((DNV == "ok" || DNV == "Ok") || DNV == "NC") &&
    ((FERROCARRIL == "ok" || FERROCARRIL == "Ok") || FERROCARRIL == "NC") &&
    ((HIDRAULICA == "ok" || HIDRAULICA == "Ok") || HIDRAULICA == "NC")
  ) {
    Permisos = "ok";
  }
  if (
    PerMunicipal == "EnGestion" ||
    Irrigacion == "EnGestion" ||
    DPV == "EnGestion" ||
    DNV == "EnGestion" ||
    FERROCARRIL == "EnGestion" ||
    HIDRAULICA == "EnGestion"
  ) {
    Permisos = "EnGestion";
  }
  if (DPV == "ok" && DNV == "ok" && FERROCARRIL == "ok" && HIDRAULICA == "ok") {
    PermisosEspeciales = "ok";
  }
  if (
    (DPV == "Visado" || DPV == "NC") &&
    (DNV == "Visado" || DNV == "NC") &&
    (FERROCARRIL == "Visado" || FERROCARRIL == "NC") &&
    (HIDRAULICA == "Visado" || FERROCARRIL == "NC")
  ) {
    PermisosEspeciales = "ok";
  }
  if (
    DPV == "EnGestion" ||
    DNV == "EnGestion" ||
    FERROCARRIL == "EnGestion" ||
    HIDRAULICA == "EnGestion"
  ) {
    PermisosEspeciales = "EnGestion";
  }
  if (
    DPV == "Observado" ||
    DNV == "Observado" ||
    FERROCARRIL == "Observado" ||
    HIDRAULICA == "Observado"
  ) {
    PermisosEspeciales = "Observado";
  }

  if (
    DPV == "Pedir" ||
    DNV == "Pedir" ||
    FERROCARRIL == "Pedir" ||
    HIDRAULICA == "Pedir"
  ) {
    PermisosEspeciales = "Pedir";
  }
  // Matriculas
  if (
    (MatriculaFusionista == "ok" || MatriculaFusionista == "Ok" || MatriculaFusionista == "NC") &&
    (MatriculaSoldador == "ok" || MatriculaSoldador == "Ok" || MatriculaSoldador == "NC")
  ) {
    Matriculas = "ok";
  }
  if (MatriculaFusionista == "EnGestion" || MatriculaSoldador == "EnGestion") {
    Matriculas = "EnGestion";
  }
  if (MatriculaFusionista == "EnGestion" || MatriculaSoldador == "EnGestion") {
    Matriculas = "EnGestion";
  }
  if (
    MatriculaFusionista == NULL ||
    MatriculaSoldador == NULL ||
    MatriculaFusionista == "" ||
    MatriculaSoldador == ""
  ) {
    Matriculas = "Sin presentar";
  }
  //Ambiente
  if (
    (EstudioImpactoAmbiental == "ok" || EstudioImpactoAmbiental == "Ok" || EstudioImpactoAmbiental == "NC") &&
    (CronogramaAmbiente == "ok" || CronogramaAmbiente == "Ok" || CronogramaAmbiente == "NC")
  ) {
    Ambiente = "ok";
  }
  if (
    EstudioImpactoAmbiental == "EnGestion" ||
    CronogramaAmbiente == "EnGestion"
  ) {
    Ambiente = "EnGestion";
  }
  if (EstudioImpactoAmbiental == "pedir" || CronogramaAmbiente == "pedir") {
    Ambiente = "Sin presentar";
  }
  // Avisos
  if (
    (AvisoInicioObraART == "ok" || AvisoInicioObraART == "Ok") &&
    (AvisoInicioObraIERIC == "ok" || AvisoInicioObraIERIC == "Ok") &&
    (ActaInicioEfectivo == "ok" || ActaInicioEfectivo == "Ok")
  ) {
    Avisos = "ok";
  }
  if (
    AvisoInicioObraART == "EnGestion" ||
    AvisoInicioObraIERIC == "EnGestion" ||
    ActaInicioEfectivo == "EnGestion"
  ) {
    Avisos = "EnGestion";
  }
  if (
    AvisoInicioObraART == "Sin presentar" ||
    AvisoInicioObraIERIC == "Sin presentar" ||
    ActaInicioEfectivo == "Sin presentar"
  ) {
    Avisos = "Sin presentar";
  }
  //Vencimientos de avisos
  if (
    new Date(VencimientoAvisoObraArt) < FechaDiaActual ||
    new Date(VencimientoAvisoObraIeric) < FechaDiaActual
  ) {
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

  sql = "Update obras_tareasgenerales Set ? where Nombre=?";
  connection.query(
    sql,
    [
      {
        PlanDeTrabajo: PlanDeTrabajo,
        DocumentacionObra: DocumentacionObra,
        Seguridad: Seguridad,
        Interferencias: Interferencias,
        Permisos: Permisos,
        Matriculas: Matriculas,
        Ambiente: Ambiente,
        Avisos: Avisos,
        NotaCumplimentoNormativas: NotaCumplimentoNormativa,
        DDJJNAG153: DDJJNAG153,
        Avisos: Avisos,
        PermisosEspeciales: PermisosEspeciales,
      },
      Nombre,
    ],
    (error, results) => {
      if (error) {
        console.log(error);
      }
    }
  );
  sql = "Update adminecogas_interferencias_y_permisos Set ? where Nombre=?";
  connection.query(
    sql,
    [
      {
        Hidraulica: HIDRAULICA,
        Ferrocarriles: FERROCARRIL,
        PerMunicipal: PerMunicipal,
        DNV: DNV,
        DPV: DPV,
        Irrigacion: Irrigacion,
        Privado: PRIVADO,
        Otrospermisos: OTROSPERMISOS,
        intTelefonicaObtenida: intTelefonicaObtenida,
        intTelefonicaPedida: intTelefonicaPedida,
        intClaroPedida: intClaroPedida,
        intClaroObtenida: intClaroObtenida,
        intAguaObtenida: intAguaObtenida,
        intAguaPedida: intAguaPedida,
        intCloacasObtenida: intCloacasObtenida,
        intCloacasPedida: intCloacasPedida,
        intElectricidadObtenida: intElectricidadObtenida,
        intElectricidadPedida: intElectricidadPedida,
        intArsatPedida: intArsatPedida,
        intArsatObtenida: intArsatObtenida,
        intArnetObtenida: intArnetObtenida,
        intArnetPedida: intArnetPedida,
        intTelecomObtenida: intTelecomObtenida,
        intTelecomPedida: intTelecomPedida,
        //Estado de las interferencias
        intTelefonica: intTelefonica,
        intClaro: intClaro,
        intAgua: intAgua,
        intCloaca: intCloacas,
        intElectricidad: intElectricidad,
        intTelecom: intTelecom,
        intArnet: intArnet,
        intArsat: intArsat,

        VencimientoDNV: VencimientoDNV,
        VencimientoDPV: VencimientoDPV,
        VencimientoFerrocarril: VencimientoFerrocarril,
        VencimientoHidraulica: VencimientoHidraulica,
        VencimientoIrrigacion: VencimientoIrrigacion,
        VencimientoMunicipal: VencimientoMunicipal,
        VencimientoOtrosPermisos: VencimientoOtrosPermisos,
        VencimientoPrivado: VencimientoPrivado,
        VencimientoAvisoObraArt: VencimientoAvisoObraArt,
        VencimientoAvisoObraIeric: VencimientoAvisoObraIeric,
      },
      Nombre,
    ],
    (error, results) => {
      if (error) {
        console.log(error);
      }
    }
  );
  sql = "Update adminecogas_tareas_por_carpeta Set ? where Nombre=?";
  connection.query(
    sql,
    [
      {
        //Segunda Parte
        MailAutorizacion: MailAutorizacion,
        PlanDeTrabajo: PlanDeTrabajo,
        SolicitudInicioObras: SolicitudInicioObras,
        CertificadoRT: CertificadoRT,
        Programadeseguridad: Programadeseguridad,
        CronogramaSyH: CronogramaSyH,
        SeguroRC: SeguroRC,
        Monotributos: Monotributos,
        SeguroAccidentesPersonales: SeguroAccidentesPersonales,
        MatriculaFusionista: MatriculaFusionista,
        MatriculaSoldador: MatriculaSoldador,
        EstudioImpactoAmbiental: EstudioImpactoAmbiental,
        CronogramaAmbiente: CronogramaAmbiente,
        NotaCumplimentoNormativa: NotaCumplimentoNormativa,
        DDJJNAG153: DDJJNAG153,
        ActaInicioEfectivo: ActaInicioEfectivo,
        AvisoInicioObraIERIC: AvisoInicioObraIERIC,
        AvisoInicioObraART: AvisoInicioObraART,
      },
      Nombre,
    ],
    (error, results) => {
      if (error) {
        console.log(error);
      }
    }
  );

  //Seccion Actualizar Tareas

  let fecha = new Date();

  TareaRealizada = req.body.TareaRealizada;
  ProximaTarea = req.body.ProximaTarea;
  Fecha_limite = req.body.Fecha_limite;
  Fecha_Tarea_sub = fecha;
  ResponsableDeTarea = req.body.ResponsableDeTarea;
  var EtapaTarea = req.body.EtapaTarea;
  var tarea = req.body.Tarea;
  sql = "";
  res.locals.moment = moment;
  var arregloTareas = [];
  if (!Array.isArray(TareaRealizada)) {
    var tarearealizada = TareaRealizada;
    var proximatarea = ProximaTarea;
    var fechalimite = Fecha_limite;
    var fechatarea = Fecha_Tarea_sub;
    var responsabletarea = ResponsableDeTarea;
    if (tarearealizada == "") {
      if (proximatarea == "") {
      } else {
        if (fechalimite) {
          if (TareaRealizada != null) {
            sql = "Update adminecogas_tareas_por_carpeta set? where id_obra=?";
            connection.query(
              sql,
              [
                {
                  EtapaTarea: EtapaTarea,
                  TareaRealizada: tarearealizada,
                  Fechalimite: fechalimite,
                },
                id,
              ],
              (error, results) => {
                if (error) console.log(error);
              }
            );
            sql = "Insert into historialdecambios set?";
            connection.query(
              sql,
              [
                {
                  EtapaTarea_sub: EtapaTarea,
                  id_obra: idObra,
                  Tarea: EtapaTarea,
                  ResponsableDeTarea: responsabletarea,
                  Si_NO_TareaRealizada: "N",
                  Nombre_sub: Nombre,
                  Tarea_Realizada_sub: tarearealizada,
                  Proxima_Tarea_sub: proximatarea,
                  Fecha_Proxima_Tarea_sub: fechalimite,
                  Fecha_Tarea_sub: fechatarea,
                },
              ],
              (error, results) => {
                if (error) console.log(error);
              }
            );
          }
        } else {
          if (TareaRealizada != null) {
            sql = "Update adminecogas_tareas_por_carpeta set? where id_obra=?";
            connection.query(
              sql,
              [{ EtapaTarea: EtapaTarea, TareaRealizada: tarearealizada }, id],
              (error, results) => {
                if (error) console.log(error);
              }
            );
            sql = "Insert into historialdecambios set?";
            connection.query(
              sql,
              [
                {
                  EtapaTarea_sub: EtapaTarea,
                  id_obra: idObra,
                  Tarea: EtapaTarea,
                  ResponsableDeTarea: responsabletarea,
                  Si_NO_TareaRealizada: "N",
                  Nombre_sub: Nombre,
                  Tarea_Realizada_sub: tarearealizada,
                  Proxima_Tarea_sub: proximatarea,
                  Fecha_Tarea_sub: fechatarea,
                },
              ],
              (error, results) => {
                if (error) console.log(error);
              }
            );
          } else {
          }
        }
      }
    } else {
      if (Fecha_limite) {
        if (TareaRealizada != null) {
          sql = "Update adminecogas_tareas_por_carpeta set? where id_obra=?";
          connection.query(
            sql,
            [
              {
                EtapaTarea: EtapaTarea,
                TareaRealizada: tarearealizada,
                Fechalimite: fechalimite,
              },
              id,
            ],
            (error, results) => {
              if (error) console.log(error);
            }
          );
          sql = "Insert into historialdecambios set?";
          connection.query(
            sql,
            [
              {
                EtapaTarea_sub: EtapaTarea,
                id_obra: idObra,
                Tarea: EtapaTarea,
                ResponsableDeTarea: responsabletarea,
                Si_NO_TareaRealizada: "N",
                Nombre_sub: Nombre,
                Tarea_Realizada_sub: tarearealizada,
                Proxima_Tarea_sub: proximatarea,
                Fecha_Proxima_Tarea_sub: fechalimite,
                Fecha_Tarea_sub: fechatarea,
              },
            ],
            (error, results) => {
              if (error) console.log(error);
            }
          );
        }
      } else {
        if (TareaRealizada != null) {
          sql = "Update adminecogas_tareas_por_carpeta set? where id_obra=?";
          connection.query(
            sql,
            [{ EtapaTarea: EtapaTarea, TareaRealizada: TareaRealizada }, id],
            (error, results) => {
              if (error) console.log(error);
            }
          );
          sql = "Insert into historialdecambios set?";
          connection.query(
            sql,
            [
              {
                EtapaTarea_sub: EtapaTarea,
                id_obra: idObra,
                Tarea: EtapaTarea,
                ResponsableDeTarea: responsabletarea,
                Si_NO_TareaRealizada: "N",
                Nombre_sub: Nombre,
                Tarea_Realizada_sub: tarearealizada,
                Proxima_Tarea_sub: proximatarea,
                Fecha_Tarea_sub: fechatarea,
              },
            ],
            (error, results) => {
              if (error) console.log(error);
            }
          );
        } else {
        }
      }
    }
  } else {
    TareaRealizada.forEach((element, index) => {
      var tarearealizada = TareaRealizada[index];
      var proximatarea = ProximaTarea[index];
      var fechalimite = Fecha_limite[index];
      var fechatarea = Fecha_Tarea_sub;
      var responsabletarea = ResponsableDeTarea[index];
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

    arregloTareas.forEach((element) => {
      if (element.tarearealizada == "") {
        if (element.proximatarea == "") {
        } else {
          if (element.fechalimite) {
            if (TareaRealizada != null) {
              sql =
                "Update adminecogas_tareas_por_carpeta set? where id_obra=?";
              connection.query(
                sql,
                [
                  {
                    EtapaTarea: EtapaTarea,
                    TareaRealizada: element.tarearealizada,
                    Fechalimite: element.fechalimite,
                  },
                  id,
                ],
                (error, results) => {
                  if (error) console.log(error);
                }
              );
              sql = "Insert into historialdecambios set?";
              connection.query(
                sql,
                [
                  {
                    EtapaTarea_sub: EtapaTarea,
                    id_obra: idObra,
                    Tarea: EtapaTarea,
                    ResponsableDeTarea: element.responsabletarea,
                    Si_NO_TareaRealizada: "N",
                    Nombre_sub: Nombre,
                    Tarea_Realizada_sub: element.tarearealizada,
                    Proxima_Tarea_sub: element.proximatarea,
                    Fecha_Proxima_Tarea_sub: element.fechalimite,
                    Fecha_Tarea_sub: element.fechatarea,
                  },
                ],
                (error, results) => {
                  if (error) console.log(error);
                }
              );
            }
          } else {
            if (TareaRealizada != null) {
              sql =
                "Update adminecogas_tareas_por_carpeta set? where id_obra=?";
              connection.query(
                sql,
                [
                  {
                    EtapaTarea: EtapaTarea,
                    TareaRealizada: element.tarearealizada,
                  },
                  id,
                ],
                (error, results) => {
                  if (error) console.log(error);
                }
              );
              sql = "Insert into historialdecambios set?";
              connection.query(
                sql,
                [
                  {
                    EtapaTarea_sub: EtapaTarea,
                    id_obra: idObra,
                    Tarea: EtapaTarea,
                    ResponsableDeTarea: element.responsabletarea,
                    Si_NO_TareaRealizada: "N",
                    Nombre_sub: Nombre,
                    Tarea_Realizada_sub: element.tarearealizada,
                    Proxima_Tarea_sub: element.proximatarea,
                    Fecha_Tarea_sub: element.fechatarea,
                  },
                ],
                (error, results) => {
                  if (error) console.log(error);
                }
              );
            } else {
            }
          }
        }
      } else {
        if (element.fechalimite) {
          if (TareaRealizada != null) {
            sql = "Update adminecogas_tareas_por_carpeta set? where id_obra=?";
            connection.query(
              sql,
              [
                {
                  EtapaTarea: EtapaTarea,
                  TareaRealizada: element.tarearealizada,
                  Fechalimite: element.fechalimite,
                },
                id,
              ],
              (error, results) => {
                if (error) console.log(error);
              }
            );
            sql = "Insert into historialdecambios set?";
            connection.query(
              sql,
              [
                {
                  EtapaTarea_sub: EtapaTarea,
                  id_obra: idObra,
                  Tarea: EtapaTarea,
                  ResponsableDeTarea: element.responsabletarea,
                  Si_NO_TareaRealizada: "N",
                  Nombre_sub: Nombre,
                  Tarea_Realizada_sub: element.tarearealizada,
                  Proxima_Tarea_sub: element.proximatarea,
                  Fecha_Proxima_Tarea_sub: element.fechalimite,
                  Fecha_Tarea_sub: element.fechatarea,
                },
              ],
              (error, results) => {
                if (error) console.log(error);
              }
            );
          }
        } else {
          res.send(
            "Las proximas tareas deben de contener su fecha limite de realización"
          );
        }
      }
    });
  }
  res.redirect("/historialcarpeta/" + Nombre);
});
router.post("/actObrasCarpEcogas/:id", upload.none(), function (req, res) {
  var id = req.body.id;
  var Nombre = req.body.Nombre;
  var sql = "";
  var idObra = id;
  var InspectorAsignado = req.body.InspectorAsignado;
  var FechaInicioTrabajos = req.body.FechaComienzoObra;
  var FechaFinDeObra = req.body.FechaFinDeObra;
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
  var PCEntregadoInspeccion = req.body.PCEntregadoInspeccion;
  var AvisosDeObra = req.body.AvisosDeObra;

  // Variables generales
  var Permisos = req.body.Permisos;
  var Interferencias = req.body.Interferencias;
  var DocumentacionInspeccion;
  var ComunicacionObras;
  // DocumentacionInspeccion
  if (
    (ActaDeInicio == "Presentado" || ActaDeInicio == "Ok") &&
    (Permisos == "Presentado" || Permisos == "Ok") &&
    (Interferencias == "Presentado" || Interferencias == "Ok") &&
    (LibroOrdenesServicio == "Presentado" || LibroOrdenesServicio == "Ok") &&
    (LibroNotasPedido == "Presentado" || LibroNotasPedido == "Ok") &&
    (PCEntregadoInspeccion == "Presentado" || PCEntregadoInspeccion == "Ok") &&
    (AvisosDeObra == "Presentado" || AvisosDeObra == "Ok") &&
    (CronogramaFirmadoComitente == "Presentado" ||
      CronogramaFirmadoComitente == "Ok")
  ) {
    DocumentacionInspeccion = "ok";
  }
  if (
    ActaDeInicio == "Sin presentar" ||
    Permisos == "Sin presentar" ||
    Interferencias == "Sin presentar" ||
    LibroOrdenesServicio == "Sin presentar" ||
    LibroNotasPedido == "Sin presentar" ||
    PCEntregadoInspeccion == "Sin presentar" ||
    AvisosDeObra == "Sin presentar" ||
    CronogramaFirmadoComitente == "Sin presentar"
  ) {
    DocumentacionInspeccion = "Sin presentar";
  }
  // ComunicacionObras
  if (OrdenServicio == "No") {
    ComunicacionObras = "ok";
  }
  if (OrdenServicio == "Si") {
    ComunicacionObras = "Leer historial de carpeta";
  }
  sql = "Update obras_tareasgenerales Set ? where Nombre=?";
  connection.query(
    sql,
    [
      {
        DocumentacionInspeccion: DocumentacionInspeccion,
        ComunicacionObras: ComunicacionObras,
      },
      Nombre,
    ],
    (error, results) => {
      if (error) {
        console.log(error);
      }
    }
  );

  sql = "Update adminecogas_tareas_por_carpeta Set ? WHERE Nombre=?";



  if (FechaInicioTrabajos[1].length > 0) {
    connection.query(
      sql,
      [
        {
          FechaInicioTrabajos: FechaInicioTrabajos[1],
        },
        Nombre,
      ],
      (error, results) => {
        if (error) {
          console.log(error);
        }
      }
    );
  }

  if (FechaFinDeObra[1].length > 0) {
    connection.query(
      sql,
      [
        {
          FechaFinDeObra: FechaFinDeObra[1],
        },
        Nombre,
      ],
      (error, results) => {
        if (error) {
          console.log(error);
        }
      }
    );
  }
  connection.query(
    sql,
    [
      {
        ActaDeInicio: ActaDeInicio,
        Permisos: Permisos,
        Interferencias: Interferencias,
        LibroOrdenesServicio: LibroOrdenesServicio,
        LibroNotasPedido: LibroNotasPedido,
        PCEntregadoInspeccion: PCEntregadoInspeccion,
        AvisosDeObra: AvisosDeObra,
        CronogramaFirmadoComitente: CronogramaFirmadoComitente,
        OrdenServicio: OrdenServicio, InspectorAsignado: InspectorAsignado,
      },
      Nombre,
    ],
    (error, results) => {
      if (error) {
        console.log(error);
      }
    }
  );



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
  if (!Array.isArray(TareaRealizada)) {
    var tarearealizada = TareaRealizada;
    var proximatarea = ProximaTarea;
    var fechalimite = Fecha_limite;
    var fechatarea = Fecha_Tarea_sub;
    var responsabletarea = ResponsableDeTarea;
    if (tarearealizada == "") {
      if (proximatarea == "") {
      } else {
        if (fechalimite) {
          if (TareaRealizada != null) {
            sql = "Update adminecogas_tareas_por_carpeta set? where id_obra=?";
            connection.query(
              sql,
              [
                {
                  EtapaTarea: EtapaTarea,
                  TareaRealizada: tarearealizada,
                  Fechalimite: fechalimite,
                },
                id,
              ],
              (error, results) => {
                if (error) console.log(error);
              }
            );
            sql = "Insert into historialdecambios set?";
            connection.query(
              sql,
              [
                {
                  EtapaTarea_sub: EtapaTarea,
                  id_obra: idObra,
                  Tarea: EtapaTarea,
                  ResponsableDeTarea: responsabletarea,
                  Si_NO_TareaRealizada: "N",
                  Nombre_sub: Nombre,
                  Tarea_Realizada_sub: tarearealizada,
                  Proxima_Tarea_sub: proximatarea,
                  Fecha_Proxima_Tarea_sub: fechalimite,
                  Fecha_Tarea_sub: fechatarea,
                },
              ],
              (error, results) => {
                if (error) console.log(error);
              }
            );
          }
        } else {
          if (TareaRealizada != null) {
            sql = "Update adminecogas_tareas_por_carpeta set? where id_obra=?";
            connection.query(
              sql,
              [{ EtapaTarea: EtapaTarea, TareaRealizada: tarearealizada }, id],
              (error, results) => {
                if (error) console.log(error);
              }
            );
            sql = "Insert into historialdecambios set?";
            connection.query(
              sql,
              [
                {
                  EtapaTarea_sub: EtapaTarea,
                  id_obra: idObra,
                  Tarea: EtapaTarea,
                  ResponsableDeTarea: responsabletarea,
                  Si_NO_TareaRealizada: "N",
                  Nombre_sub: Nombre,
                  Tarea_Realizada_sub: tarearealizada,
                  Proxima_Tarea_sub: proximatarea,
                  Fecha_Tarea_sub: fechatarea,
                },
              ],
              (error, results) => {
                if (error) console.log(error);
              }
            );
          } else {
          }
        }
      }
    } else {
      if (Fecha_limite) {
        if (TareaRealizada != null) {
          sql = "Update adminecogas_tareas_por_carpeta set? where id_obra=?";
          connection.query(
            sql,
            [
              {
                EtapaTarea: EtapaTarea,
                TareaRealizada: tarearealizada,
                Fechalimite: fechalimite,
              },
              id,
            ],
            (error, results) => {
              if (error) console.log(error);
            }
          );
          sql = "Insert into historialdecambios set?";
          connection.query(
            sql,
            [
              {
                EtapaTarea_sub: EtapaTarea,
                id_obra: idObra,
                Tarea: EtapaTarea,
                ResponsableDeTarea: responsabletarea,
                Si_NO_TareaRealizada: "N",
                Nombre_sub: Nombre,
                Tarea_Realizada_sub: tarearealizada,
                Proxima_Tarea_sub: proximatarea,
                Fecha_Proxima_Tarea_sub: fechalimite,
                Fecha_Tarea_sub: fechatarea,
              },
            ],
            (error, results) => {
              if (error) console.log(error);
            }
          );
        }
      } else {
        if (TareaRealizada != null) {
          sql = "Update adminecogas_tareas_por_carpeta set? where id_obra=?";
          connection.query(
            sql,
            [{ EtapaTarea: EtapaTarea, TareaRealizada: TareaRealizada }, id],
            (error, results) => {
              if (error) console.log(error);
            }
          );
          sql = "Insert into historialdecambios set?";
          connection.query(
            sql,
            [
              {
                EtapaTarea_sub: EtapaTarea,
                id_obra: idObra,
                Tarea: EtapaTarea,
                ResponsableDeTarea: responsabletarea,
                Si_NO_TareaRealizada: "N",
                Nombre_sub: Nombre,
                Tarea_Realizada_sub: tarearealizada,
                Proxima_Tarea_sub: proximatarea,
                Fecha_Tarea_sub: fechatarea,
              },
            ],
            (error, results) => {
              if (error) console.log(error);
            }
          );
        } else {
        }
      }
    }
  } else {
    TareaRealizada.forEach((element, index) => {
      var tarearealizada = TareaRealizada[index];
      var proximatarea = ProximaTarea[index];
      var fechalimite = Fecha_limite[index];
      var fechatarea = Fecha_Tarea_sub;
      var responsabletarea = ResponsableDeTarea[index];
      var tarea = Tareas[index];

      arregloTareas.push({
        tarearealizada,
        proximatarea,
        fechalimite,
        fechatarea,
        responsabletarea,
        tarea,
      });
    });

    arregloTareas.forEach((element) => {
      if (element.tarearealizada == "") {
        if (element.proximatarea == "") {
        } else {
          if (element.fechalimite) {
            if (TareaRealizada != null) {
              sql =
                "Update adminecogas_tareas_por_carpeta set? where id_obra=?";
              connection.query(
                sql,
                [
                  {
                    Estado: EtapaTarea,
                    Estado: EtapaTarea,
                    EtapaTarea: element.tarea,
                    TareaRealizada: element.tarearealizada,
                    Fechalimite: element.fechalimite,
                  },
                  id,
                ],
                (error, results) => {
                  if (error) console.log(error);
                }
              );
              sql = "Insert into historialdecambios set?";
              connection.query(
                sql,
                [
                  {
                    EtapaTarea_sub: EtapaTarea,
                    id_obra: idObra,
                    Tarea: element.tarea,
                    ResponsableDeTarea: element.responsabletarea,
                    Si_NO_TareaRealizada: "N",
                    Nombre_sub: Nombre,
                    Tarea_Realizada_sub: element.tarearealizada,
                    Proxima_Tarea_sub: element.proximatarea,
                    Fecha_Proxima_Tarea_sub: element.fechalimite,
                    Fecha_Tarea_sub: element.fechatarea,
                  },
                ],
                (error, results) => {
                  if (error) console.log(error);
                }
              );
            }
          } else {
            if (TareaRealizada != null) {
              sql =
                "Update adminecogas_tareas_por_carpeta set? where id_obra=?";
              connection.query(
                sql,
                [
                  {
                    Estado: EtapaTarea,
                    EtapaTarea: element.etapatarea,
                    TareaRealizada: element.tarearealizada,
                  },
                  id,
                ],
                (error, results) => {
                  if (error) console.log(error);
                }
              );
              sql = "Insert into historialdecambios set?";
              connection.query(
                sql,
                [
                  {
                    EtapaTarea_sub: EtapaTarea,
                    id_obra: idObra,
                    Tarea: EtapaTarea,
                    ResponsableDeTarea: element.responsabletarea,
                    Si_NO_TareaRealizada: "N",
                    Nombre_sub: Nombre,
                    Tarea_Realizada_sub: element.tarearealizada,
                    Proxima_Tarea_sub: element.proximatarea,
                    Fecha_Tarea_sub: element.fechatarea,
                  },
                ],
                (error, results) => {
                  if (error) console.log(error);
                }
              );
            } else {
            }
          }
        }
      } else {
        if (element.fechalimite != "") {
          if (element.tarearealizada != null) {
            sql = "Update adminecogas_tareas_por_carpeta set? where id_obra=?";
            connection.query(
              sql,
              [
                {
                  Estado: EtapaTarea,
                  EtapaTarea: element.etapatarea,
                  TareaRealizada: element.tarearealizada,
                  Fechalimite: element.fechalimite,
                },
                id,
              ],
              (error, results) => {
                if (error) console.log(error);
              }
            );
            sql = "Insert into historialdecambios set?";
            connection.query(
              sql,
              [
                {
                  EtapaTarea_sub: EtapaTarea,
                  id_obra: idObra,
                  Tarea: EtapaTarea,
                  ResponsableDeTarea: element.responsabletarea,
                  Si_NO_TareaRealizada: "N",
                  Nombre_sub: Nombre,
                  Tarea_Realizada_sub: element.tarearealizada,
                  Proxima_Tarea_sub: element.proximatarea,
                  Fecha_Proxima_Tarea_sub: element.fechalimite,
                  Fecha_Tarea_sub: element.fechatarea,
                },
              ],
              (error, results) => {
                if (error) console.log(error);
              }
            );
          }
        } else {
          if (element.tarearealizada != null) {
            sql = "Update adminecogas_tareas_por_carpeta set? where id_obra=?";
            connection.query(
              sql,
              [
                {
                  Estado: EtapaTarea,
                  EtapaTarea: element.etapatarea,
                  TareaRealizada: element.tarearealizada,
                },
                id,
              ],
              (error, results) => {
                if (error) console.log(error);
              }
            );
            sql = "Insert into historialdecambios set?";
            connection.query(
              sql,
              [
                {
                  EtapaTarea_sub: EtapaTarea,
                  id_obra: idObra,
                  Tarea: EtapaTarea,
                  ResponsableDeTarea: element.responsabletarea,
                  Si_NO_TareaRealizada: "N",
                  Nombre_sub: Nombre,
                  Tarea_Realizada_sub: element.tarearealizada,
                  Proxima_Tarea_sub: element.proximatarea,
                  Fecha_Tarea_sub: element.fechatarea,
                },
              ],
              (error, results) => {
                if (error) console.log(error);
              }
            );
          } else {
          }
        }
      }
    });
  }
  res.redirect("/historialcarpeta/" + Nombre);
});
router.post("/actCaosCarpEcogas/:id", upload.none(), function (req, res) {
  var id = req.body.id;
  var Nombre = req.body.Nombre;
  var sql = "";
  var idObra = id;
  var ActasFinales = req.body.ActasFinales;
  if (ActasFinales == "Sin recibir") {
    ActasFinales = "Sin presentar";
  }
  var PlanosyCroquis = req.body.PlanosyCroquis;
  var ConformeDePermisos = req.body.ConformeDePermisos;
  var PruebaHermeticidad = req.body.PruebaHermeticidad;
  var InformesFinales = req.body.InformesFinales;
  sql = "Update obras_tareasgenerales Set ? where Nombre=?";
  connection.query(
    sql,
    [
      {
        ActasFinalesEcogas: ActasFinales,
        PlanosyCroquis: PlanosyCroquis,
        ConformeEntidades: ConformeDePermisos,
        PruebaHermeticidad: PruebaHermeticidad,
        InformesFinales: InformesFinales,
      },
      Nombre,
    ],
    (error, results) => {
      if (error) {
        console.log(error);
      }
    }
  );
  sql = "Update adminecogas_tareas_por_carpeta Set ? where Nombre=?";
  connection.query(
    sql,
    [
      {
        //Segunda Parte
        ActasFinales: ActasFinales,
        PlanosyCroquis: PlanosyCroquis,
        ConformeDePermisos: ConformeDePermisos,
        PruebaHermeticidad: PruebaHermeticidad,
        InformesFinales: InformesFinales,
      },
      Nombre,
    ],
    (error, results) => {
      if (error) {
        console.log(error);
      }
    }
  );
  var user = {
    id: id,
    Nombre: Nombre,
    etapa: "Caos",
  };
  //Seccion Actualizar Tareas

  let fecha = new Date();
  Nombre = req.body.Nombre;
  TareaRealizada = req.body.TareaRealizada;
  ProximaTarea = req.body.ProximaTarea;
  Fecha_limite = req.body.Fecha_limite;
  Fecha_Tarea_sub = fecha;
  ResponsableDeTarea = req.body.ResponsableDeTarea;
  var EtapaTarea = req.body.EtapaTarea;
  var tarea = req.body.Tarea;
  sql = "";
  res.locals.moment = moment;
  var arregloTareas = [];
  if (!Array.isArray(TareaRealizada)) {
    var tarearealizada = TareaRealizada;
    var proximatarea = ProximaTarea;
    var fechalimite = Fecha_limite;
    var fechatarea = Fecha_Tarea_sub;
    var responsabletarea = ResponsableDeTarea;
    if (tarearealizada == "") {
      if (proximatarea == "") {
      } else {
        if (fechalimite) {
          if (TareaRealizada != null) {
            sql = "Update adminecogas_tareas_por_carpeta set? where id_obra=?";
            connection.query(
              sql,
              [
                {
                  EtapaTarea: EtapaTarea,
                  TareaRealizada: tarearealizada,
                  Fechalimite: fechalimite,
                },
                id,
              ],
              (error, results) => {
                if (error) console.log(error);
              }
            );
            sql = "Insert into historialdecambios set?";
            connection.query(
              sql,
              [
                {
                  EtapaTarea_sub: EtapaTarea,
                  Tarea: EtapaTarea,
                  id_obra: idObra,
                  ResponsableDeTarea: responsabletarea,
                  Si_NO_TareaRealizada: "N",
                  Nombre_sub: Nombre,
                  Tarea_Realizada_sub: tarearealizada,
                  Proxima_Tarea_sub: proximatarea,
                  Fecha_Proxima_Tarea_sub: fechalimite,
                  Fecha_Tarea_sub: fechatarea,
                },
              ],
              (error, results) => {
                if (error) console.log(error);
              }
            );
          }
        } else {
          if (TareaRealizada != null) {
            sql = "Update adminecogas_tareas_por_carpeta set? where id_obra=?";
            connection.query(
              sql,
              [{ EtapaTarea: EtapaTarea, TareaRealizada: tarearealizada }, id],
              (error, results) => {
                if (error) console.log(error);
              }
            );
            sql = "Insert into historialdecambios set?";
            connection.query(
              sql,
              [
                {
                  EtapaTarea_sub: EtapaTarea,
                  id_obra: idObra,
                  Tarea: EtapaTarea,
                  ResponsableDeTarea: responsabletarea,
                  Si_NO_TareaRealizada: "N",
                  Nombre_sub: Nombre,
                  Tarea_Realizada_sub: tarearealizada,
                  Proxima_Tarea_sub: proximatarea,
                  Fecha_Tarea_sub: fechatarea,
                },
              ],
              (error, results) => {
                if (error) console.log(error);
              }
            );
          } else {
          }
        }
      }
    } else {
      if (fechalimite) {
        if (tarearealizada != null) {
          sql = "Update adminecogas_tareas_por_carpeta set? where id_obra=?";
          connection.query(
            sql,
            [
              {
                EtapaTarea: EtapaTarea,
                Tarea: tarea,
                TareaRealizada: tarearealizada,
                Fechalimite: fechalimite,
              },
              id,
            ],
            (error, results) => {
              if (error) console.log(error);
            }
          );
          sql = "Insert into historialdecambios set?";
          connection.query(
            sql,
            [
              {
                EtapaTarea_sub: EtapaTarea,
                Tarea: EtapaTarea,
                id_obra: idObra,
                ResponsableDeTarea: responsabletarea,
                Si_NO_TareaRealizada: "N",
                Nombre_sub: Nombre,
                Tarea_Realizada_sub: tarearealizada,
                Proxima_Tarea_sub: proximatarea,
                Fecha_Proxima_Tarea_sub: fechalimite,
                Fecha_Tarea_sub: fechatarea,
              },
            ],
            (error, results) => {
              if (error) console.log(error);
            }
          );
        }
      } else {
        if (TareaRealizada != null) {
          sql = "Update adminecogas_tareas_por_carpeta set? where id_obra=?";
          connection.query(
            sql,
            [{ EtapaTarea: EtapaTarea, TareaRealizada: TareaRealizada }, id],
            (error, results) => {
              if (error) console.log(error);
            }
          );
          sql = "Insert into historialdecambios set?";
          connection.query(
            sql,
            [
              {
                EtapaTarea_sub: EtapaTarea,
                Tarea: EtapaTarea,
                id_obra: idObra,
                ResponsableDeTarea: responsabletarea,
                Si_NO_TareaRealizada: "N",
                Nombre_sub: Nombre,
                Tarea_Realizada_sub: tarearealizada,
                Proxima_Tarea_sub: proximatarea,
                Fecha_Tarea_sub: fechatarea,
              },
            ],
            (error, results) => {
              if (error) console.log(error);
            }
          );
        } else {
        }
      }
    }
  } else {
    TareaRealizada.forEach((element, index) => {
      var tarearealizada = TareaRealizada[index];
      var proximatarea = ProximaTarea[index];
      var fechalimite = Fecha_limite[index];
      var fechatarea = Fecha_Tarea_sub;
      var responsabletarea = ResponsableDeTarea[index];

      arregloTareas.push({
        tarearealizada,
        proximatarea,
        fechalimite,
        fechatarea,
        responsabletarea,
      });
    });

    arregloTareas.forEach((element) => {
      if (element.tarearealizada == "") {
        if (element.proximatarea == "") {
        } else {
          if (element.fechalimite) {
            if (element.tarearealizada == "") {
              sql =
                "Update adminecogas_tareas_por_carpeta set? where id_obra=?";
              connection.query(
                sql,
                [
                  {
                    Estado: EtapaTarea,
                    EtapaTarea: element.etapatarea,
                    TareaRealizada: element.tarearealizada,
                    Fechalimite: element.fechalimite,
                  },
                  id,
                ],
                (error, results) => {
                  if (error) console.log(error);
                }
              );
              sql = "Insert into historialdecambios set?";
              connection.query(
                sql,
                [
                  {
                    EtapaTarea_sub: EtapaTarea,
                    id_obra: idObra,
                    Tarea: EtapaTarea,
                    ResponsableDeTarea: element.responsabletarea,
                    Si_NO_TareaRealizada: "N",
                    Nombre_sub: Nombre,
                    Tarea_Realizada_sub: element.tarearealizada,
                    Proxima_Tarea_sub: element.proximatarea,
                    Fecha_Proxima_Tarea_sub: element.fechalimite,
                    Fecha_Tarea_sub: element.fechatarea,
                  },
                ],
                (error, results) => {
                  if (error) console.log(error);
                }
              );
            }
          } else {
            if (element.tarearealizada == "") {
              sql =
                "Update adminecogas_tareas_por_carpeta set? where id_obra=?";
              connection.query(
                sql,
                [
                  {
                    Estado: EtapaTarea,
                    EtapaTarea: element.etapatarea,
                    TareaRealizada: element.tarearealizada,
                  },
                  id,
                ],
                (error, results) => {
                  if (error) console.log(error);
                }
              );
              sql = "Insert into historialdecambios set?";
              connection.query(
                sql,
                [
                  {
                    EtapaTarea_sub: EtapaTarea,
                    id_obra: idObra,
                    Tarea: EtapaTarea,
                    ResponsableDeTarea: element.responsabletarea,
                    Si_NO_TareaRealizada: "N",
                    Nombre_sub: Nombre,
                    Tarea_Realizada_sub: element.tarearealizada,
                    Proxima_Tarea_sub: element.proximatarea,
                    Fecha_Tarea_sub: element.fechatarea,
                  },
                ],
                (error, results) => {
                  if (error) console.log(error);
                }
              );
            } else {
            }
          }
        }
      } else {
        if (element.fechalimite) {
          sql = "Update adminecogas_tareas_por_carpeta set? where id_obra=?";
          connection.query(
            sql,
            [
              {
                Estado: EtapaTarea,
                EtapaTarea: element.etapatarea,
                TareaRealizada: element.tarearealizada,
                Fechalimite: element.fechalimite,
              },
              id,
            ],
            (error, results) => {
              if (error) console.log(error);
            }
          );
          sql = "Insert into historialdecambios set?";
          connection.query(
            sql,
            [
              {
                EtapaTarea_sub: EtapaTarea,
                id_obra: idObra,
                Tarea: EtapaTarea,
                ResponsableDeTarea: element.responsabletarea,
                Si_NO_TareaRealizada: "N",
                Nombre_sub: Nombre,
                Tarea_Realizada_sub: element.tarearealizada,
                Proxima_Tarea_sub: element.proximatarea,
                Fecha_Proxima_Tarea_sub: element.fechalimite,
                Fecha_Tarea_sub: element.fechatarea,
              },
            ],
            (error, results) => {
              if (error) console.log(error);
            }
          );
        } else {
          if (element.tarearealizada != "") {
            sql = "Update adminecogas_tareas_por_carpeta set? where id_obra=?";
            connection.query(
              sql,
              [
                {
                  EtapaTarea: EtapaTarea,
                  TareaRealizada: element.tarearealizada,
                },
                id,
              ],
              (error, results) => {
                if (error) console.log(error);
              }
            );
            sql = "Insert into historialdecambios set?";
            connection.query(
              sql,
              [
                {
                  EtapaTarea_sub: EtapaTarea,
                  id_obra: idObra,
                  Tarea: EtapaTarea,
                  ResponsableDeTarea: element.responsabletarea,
                  Si_NO_TareaRealizada: "N",
                  Nombre_sub: Nombre,
                  Tarea_Realizada_sub: element.tarearealizada,
                  Proxima_Tarea_sub: element.proximatarea,
                  Fecha_Tarea_sub: element.fechatarea,
                },
              ],
              (error, results) => {
                if (error) console.log(error);
              }
            );
          } else {
          }
        }
      }
    });
  }
  res.redirect("/historialcarpeta/" + Nombre);
});
router.post("/actFinalCarpEcogas/:id", upload.none(), function (req, res) {
  var id = req.body.id;
  var Nombre = req.body.Nombre;
  var sql = "";
  var idObra = id;

  var PresentacionFinal = req.body.PresentacionFinal;
  var HabilitacionObra = req.body.HabilitacionFinal;
  var HabilitacionFinal = req.body.HabilitacionFinal;

  sql = "Update obras_tareasgenerales Set ? where Nombre=?";
  connection.query(
    sql,
    [
      {
        PresentacionFinal: PresentacionFinal,
        HabilitacionObra: HabilitacionObra,
      },
      Nombre,
    ],
    (error, results) => {
      if (error) {
        console.log(error);
      }
    }
  );
  sql = "Update adminecogas_tareas_por_carpeta Set ? where Nombre=?";
  connection.query(
    sql,
    [
      {
        PresentacionFinal: PresentacionFinal,
        HabilitacionFinal: HabilitacionFinal,
      },
      Nombre,
    ],
    (error, results) => {
      if (error) {
        console.log(error);
      }
    }
  );
  var user = {
    id: id,
    Nombre: Nombre,
    etapa: "Finalizada",
  };
  //Seccion Actualizar Tareas

  let fecha = new Date();
  Nombre = req.body.Nombre;
  TareaRealizada = req.body.TareaRealizada;
  ProximaTarea = req.body.ProximaTarea;
  Fecha_limite = req.body.Fecha_limite;
  Fecha_Tarea_sub = fecha;
  ResponsableDeTarea = req.body.ResponsableDeTarea;
  var EtapaTarea = req.body.EtapaTarea;
  var tarea = req.body.Tarea;
  sql = "";
  res.locals.moment = moment;
  var arregloTareas = [];
  if (!Array.isArray(TareaRealizada)) {
    var tarearealizada = TareaRealizada;
    var proximatarea = ProximaTarea;
    var fechalimite = Fecha_limite;
    var fechatarea = Fecha_Tarea_sub;
    var responsabletarea = ResponsableDeTarea;

    if (tarearealizada == "") {
      if (proximatarea == "") {
      } else {
        if (fechalimite) {
          if (TareaRealizada != null) {
            sql = "Update adminecogas_tareas_por_carpeta set? where id_obra=?";
            connection.query(
              sql,
              [
                {
                  EtapaTarea: EtapaTarea,
                  TareaRealizada: tarearealizada,
                  Fechalimite: fechalimite,
                },
                id,
              ],
              (error, results) => {
                if (error) console.log(error);
              }
            );
            sql = "Insert into historialdecambios set?";
            connection.query(
              sql,
              [
                {
                  EtapaTarea_sub: EtapaTarea,
                  id_obra: idObra,
                  Tarea: tarea,
                  ResponsableDeTarea: responsabletarea,
                  Si_NO_TareaRealizada: "N",
                  Nombre_sub: Nombre,
                  Tarea_Realizada_sub: tarearealizada,
                  Proxima_Tarea_sub: proximatarea,
                  Fecha_Proxima_Tarea_sub: fechalimite,
                  Fecha_Tarea_sub: fechatarea,
                },
              ],
              (error, results) => {
                if (error) console.log(error);
              }
            );
          }
        } else {
          if (TareaRealizada != null) {
            sql = "Update adminecogas_tareas_por_carpeta set? where id_obra=?";
            connection.query(
              sql,
              [{ EtapaTarea: EtapaTarea, TareaRealizada: tarearealizada }, id],
              (error, results) => {
                if (error) console.log(error);
              }
            );
            sql = "Insert into historialdecambios set?";
            connection.query(
              sql,
              [
                {
                  EtapaTarea_sub: EtapaTarea,
                  id_obra: idObra,
                  Tarea: EtapaTarea,
                  ResponsableDeTarea: responsabletarea,
                  Si_NO_TareaRealizada: "N",
                  Nombre_sub: Nombre,
                  Tarea_Realizada_sub: tarearealizada,
                  Proxima_Tarea_sub: proximatarea,
                  Fecha_Tarea_sub: fechatarea,
                },
              ],
              (error, results) => {
                if (error) console.log(error);
              }
            );
          } else {
          }
        }
      }
    } else {
      if (Fecha_limite) {
        if (TareaRealizada != null) {
          sql = "Update adminecogas_tareas_por_carpeta set? where id_obra=?";
          connection.query(
            sql,
            [
              {
                EtapaTarea: EtapaTarea,
                TareaRealizada: tarearealizada,
                Fechalimite: fechalimite,
              },
              id,
            ],
            (error, results) => {
              if (error) console.log(error);
            }
          );
          sql = "Insert into historialdecambios set?";
          connection.query(
            sql,
            [
              {
                EtapaTarea_sub: EtapaTarea,
                id_obra: idObra,
                Tarea: EtapaTarea,
                ResponsableDeTarea: responsabletarea,
                Si_NO_TareaRealizada: "N",
                Nombre_sub: Nombre,
                Tarea_Realizada_sub: tarearealizada,
                Proxima_Tarea_sub: proximatarea,
                Fecha_Proxima_Tarea_sub: fechalimite,
                Fecha_Tarea_sub: fechatarea,
              },
            ],
            (error, results) => {
              if (error) console.log(error);
            }
          );
        }
      } else {
        if (TareaRealizada != null) {
          sql = "Update adminecogas_tareas_por_carpeta set? where id_obra=?";
          connection.query(
            sql,
            [{ EtapaTarea: EtapaTarea, TareaRealizada: TareaRealizada }, id],
            (error, results) => {
              if (error) console.log(error);
            }
          );
          sql = "Insert into historialdecambios set?";
          connection.query(
            sql,
            [
              {
                EtapaTarea_sub: EtapaTarea,
                id_obra: idObra,
                Tarea: EtapaTarea,
                ResponsableDeTarea: responsabletarea,
                Si_NO_TareaRealizada: "N",
                Nombre_sub: Nombre,
                Tarea_Realizada_sub: tarearealizada,
                Proxima_Tarea_sub: proximatarea,
                Fecha_Tarea_sub: fechatarea,
              },
            ],
            (error, results) => {
              if (error) console.log(error);
            }
          );
        } else {
        }
      }
    }
  } else {
    TareaRealizada.forEach((element, index) => {
      var tarearealizada = TareaRealizada[index];
      var proximatarea = ProximaTarea[index];
      var fechalimite = Fecha_limite[index];
      var fechatarea = Fecha_Tarea_sub;
      var responsabletarea = ResponsableDeTarea[index];
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

    arregloTareas.forEach((element) => {
      if (element.tarearealizada == "") {
        if (element.proximatarea == "") {
        } else {
          if (element.fechalimite) {
            if (TareaRealizada != null) {
              sql =
                "Update adminecogas_tareas_por_carpeta set? where id_obra=?";
              connection.query(
                sql,
                [
                  {
                    Estado: EtapaTarea,
                    EtapaTarea: element.etapatarea,
                    TareaRealizada: element.tarearealizada,
                    Fechalimite: element.fechalimite,
                  },
                  id,
                ],
                (error, results) => {
                  if (error) console.log(error);
                }
              );
              sql = "Insert into historialdecambios set?";
              connection.query(
                sql,
                [
                  {
                    EtapaTarea_sub: EtapaTarea,
                    id_obra: idObra,
                    Tarea: EtapaTarea,
                    ResponsableDeTarea: element.responsabletarea,
                    Si_NO_TareaRealizada: "N",
                    Nombre_sub: Nombre,
                    Tarea_Realizada_sub: element.tarearealizada,
                    Proxima_Tarea_sub: element.proximatarea,
                    Fecha_Proxima_Tarea_sub: element.fechalimite,
                    Fecha_Tarea_sub: element.fechatarea,
                  },
                ],
                (error, results) => {
                  if (error) console.log(error);
                }
              );
            }
          } else {
            if (element.tarearealizada != null) {
              sql =
                "Update adminecogas_tareas_por_carpeta set? where id_obra=?";
              connection.query(
                sql,
                [
                  {
                    Estado: EtapaTarea,
                    EtapaTarea: element.etapatarea,
                    TareaRealizada: element.tarearealizada,
                  },
                  id,
                ],
                (error, results) => {
                  if (error) console.log(error);
                }
              );
              sql = "Insert into historialdecambios set?";
              connection.query(
                sql,
                [
                  {
                    EtapaTarea_sub: EtapaTarea,
                    id_obra: idObra,
                    Tarea: EtapaTarea,
                    ResponsableDeTarea: element.responsabletarea,
                    Si_NO_TareaRealizada: "N",
                    Nombre_sub: Nombre,
                    Tarea_Realizada_sub: element.tarearealizada,
                    Proxima_Tarea_sub: element.proximatarea,
                    Fecha_Tarea_sub: element.fechatarea,
                  },
                ],
                (error, results) => {
                  if (error) console.log(error);
                }
              );
            } else {
            }
          }
        }
      } else {
        if (element.fechalimite) {
          if (element.tarearealizada != null) {
            sql = "Update adminecogas_tareas_por_carpeta set? where id_obra=?";
            connection.query(
              sql,
              [
                {
                  Estado: EtapaTarea,
                  EtapaTarea: element.etapatarea,
                  TareaRealizada: element.tarearealizada,
                  Fechalimite: element.fechalimite,
                },
                id,
              ],
              (error, results) => {
                if (error) console.log(error);
              }
            );
            sql = "Insert into historialdecambios set?";
            connection.query(
              sql,
              [
                {
                  EtapaTarea_sub: EtapaTarea,
                  id_obra: idObra,
                  Tarea: EtapaTarea,
                  ResponsableDeTarea: element.responsabletarea,
                  Si_NO_TareaRealizada: "N",
                  Nombre_sub: Nombre,
                  Tarea_Realizada_sub: element.tarearealizada,
                  Proxima_Tarea_sub: element.proximatarea,
                  Fecha_Proxima_Tarea_sub: element.fechalimite,
                  Fecha_Tarea_sub: element.fechatarea,
                },
              ],
              (error, results) => {
                if (error) console.log(error);
              }
            );
          }
        } else {
          if (element.tarearealizada != null) {
            sql = "Update adminecogas_tareas_por_carpeta set? where id_obra=?";
            connection.query(
              sql,
              [
                {
                  Estado: EtapaTarea,
                  EtapaTarea: element.etapatarea,
                  TareaRealizada: element.tarearealizada,
                },
                id,
              ],
              (error, results) => {
                if (error) console.log(error);
              }
            );
            sql = "Insert into historialdecambios set?";
            connection.query(
              sql,
              [
                {
                  EtapaTarea_sub: EtapaTarea,
                  id_obra: idObra,
                  Tarea: EtapaTarea,
                  ResponsableDeTarea: element.responsabletarea,
                  Si_NO_TareaRealizada: "N",
                  Nombre_sub: Nombre,
                  Tarea_Realizada_sub: element.tarearealizada,
                  Proxima_Tarea_sub: element.proximatarea,
                  Fecha_Tarea_sub: element.fechatarea,
                },
              ],
              (error, results) => {
                if (error) console.log(error);
              }
            );
          } else {
          }
        }
      }
    });
  }
  res.redirect("/historialcarpeta/" + Nombre);
});
//Carga rapida
router.post('/adminecogas/actualizarestadotarea/:idObra/:tarea/:subtarea/:estado', (req, res) => {
  var estadoTarea = req.params.estado;
  var tarea = req.params.tarea;
  var subtarea = req.params.subtarea;
  var id_obra = req.params.idObra;

  if (tarea == "Interferencias" || tarea == "Permisos") {
    var sql = 'SHOW COLUMNS FROM adminecogas_interferencias_y_permisos';
    connection.query(sql, (error, results) => {
      if (error) console.log(error);
      else {
        results.forEach(element => {
          if (element.Field == subtarea) {
            //HAY QUE ARMAR PARA CUANDO LLEGUE UNA INTERFERENCIA, DEBIDO A QUE ESO VA EN OTRA TABLA DE LA BD.
            //Tambien para PERMISOS.
            sql = 'UPDATE adminecogas_interferencias_y_permisos SET ' + subtarea + ' ="' + estadoTarea + '" WHERE id_obra=' + id_obra;
            connection.query(sql, (error, results) => {
              if (error) console.log(error);
            })
          }
        });
        res.send('ok');
      }

    })
  } else {
    var sql = 'SHOW COLUMNS FROM adminecogas_tareas_por_carpeta';
    connection.query(sql, (error, results) => {
      if (error) console.log(error);
      else {
        results.forEach(element => {
          if (element.Field == subtarea) {
            //HAY QUE ARMAR PARA CUANDO LLEGUE UNA INTERFERENCIA, DEBIDO A QUE ESO VA EN OTRA TABLA DE LA BD.
            //Tambien para PERMISOS.
            sql = 'UPDATE adminecogas_tareas_por_carpeta SET ' + subtarea + ' ="' + estadoTarea + '" WHERE id_obra=' + id_obra;
            connection.query(sql, (error, results) => {
              if (error) console.log(error);
            })
          }

        });
      }
      res.send('ok');
    })
  }

  //  sql='UPDATE adminecogas_tareas_por_carpeta SET?';
  // connection.query(sql,({}))
})
router.post("/ActualizarHistorialTareas", (req, res) => {
  var idObra;
  var NombreObra;
  var EtapaSeleccionada;
  var subtarea;
  var ResponsableTarea;
  var TareaRealizada;
  var ProximaTarea;
  var FechaLimiteTarea;
  idObra = req.body.Obra;
  EtapaSeleccionada = req.body.EtapaTarea;
  subtarea = req.body.Subtarea;
  ResponsableTarea = req.body.ResponsableDeTarea;
  TareaRealizada = req.body.TareaRealizada;
  ProximaTarea = req.body.ProximaTarea;
  FechaLimiteTarea = req.body.Fecha_limite;
  let fecha = new Date();
  let anio = fecha.getFullYear();
  let mes = fecha.getMonth() + 1;
  let dia = fecha.getDate();
  let fechaHoy = anio + '-' + mes + '-' + dia;
  var sql = 'SELECT Nombre FROM obras WHERE id=' + idObra + ';';
  var CantidadResponsables = req.body.CantidadResponsables;
  connection.query(sql, (error, results) => {
    if (error) console.log(error);
    else {
      NombreObra = results[0].Nombre;
      sql = 'INSERT INTO historialdecambios set?';
      if (CantidadResponsables > 1) {
        ResponsableTarea.forEach((responsable) => {
          connection.query(sql, [{ Nombre_sub: NombreObra, EtapaTarea_sub: EtapaSeleccionada, Tarea: subtarea, Fecha_Tarea_sub: fechaHoy, ResponsableDeTarea: responsable, Tarea_Realizada_sub: TareaRealizada, Fecha_Proxima_Tarea_sub: FechaLimiteTarea, Proxima_Tarea_sub: ProximaTarea, Si_NO_TareaRealizada: "N", id_obra: idObra }], (error, results) => {
            if (error) console.log(error);

          })
        })
        res.send('Tarea cargada con exito en el historial. Recuerde cargar los checks en la carpeta.', 200);
      } else {
        connection.query(sql, [{ Nombre_sub: NombreObra, EtapaTarea_sub: EtapaSeleccionada, Tarea: subtarea, Fecha_Tarea_sub: fechaHoy, ResponsableDeTarea: ResponsableTarea, Tarea_Realizada_sub: TareaRealizada, Fecha_Proxima_Tarea_sub: FechaLimiteTarea, Proxima_Tarea_sub: ProximaTarea, Si_NO_TareaRealizada: "N", id_obra: idObra }], (error, results) => {
          if (error) console.log(error);
          else {
            res.send('Tarea cargada con exito en el historial. Recuerde cargar los checks en la carpeta.');
          }
        })
      }
    }
  })

})
//Opciones de editar tareas POST
router.post("/ActualizarEstadoCarpeta/:id", (req, res) => {
  console.log("Actualizando estado de carpeta");
  var id = req.body.id;
  var Nombre = req.body.Nombre;
  var Estado = req.body.Estado;
  var sql;
  var CodigoFinalizada = 0;

  if (Estado == "Finalizada") {
    var CodigoEnUso = "F";
    sql = "Select max(CodigoFinalizadas) from codificacioncarpetas";
    connection.query(sql, (error, results) => {
      if (error) console.log(error);
      var result = 0;
      var contador = 0;
      JSON.parse(JSON.stringify(results), function (k, v) {
        if (contador == 0) {
          contador = contador + 1;
          result = v;
        }
      });
      CodigoFinalizada = result;
      CodigoFinalizada = CodigoFinalizada + 1;
      sql = "Update codificacioncarpetas Set ? where Nombre= ?";
      connection.query(
        sql,
        [
          {
            CodigoEnUsoVigentes: CodigoEnUso,
            CodigoFinalizadas: CodigoFinalizada,
          },
          Nombre,
        ],
        (error, results) => {
          if (error) console.log(error);
        }
      );
    });
  } else {
    var CodigoEnUso = "S";
  }
  sql = "Update codificacioncarpetas Set ? where Nombre= ?";
  connection.query(
    sql,
    [
      {
        CodigoEnUsoVigentes: CodigoEnUso,
      },
      Nombre,
    ],
    (error, results) => {
      if (error) console.log(error);
      console.log("codificacioncarpetas actualizado.");
    }
  );
  sql = "UPDATE obras SET ? WHERE id=?";
  connection.query(
    sql,
    [
      {
        Estado: Estado,
      },
      id,
    ],
    (error, results) => {
      if (error) console.log(error);
      console.log("obras actualizado.");
    }
  );
  sql = ' UPDATE adminecogas_tareas_por_carpeta SET? WHERE id_obra=?';
  connection.query(sql, [{ Estado: Estado }, id], (error, results) => {
    if (error) console.log(error);
    console.log("admiencogas_tareas por carpeta actualizado.");
  })
  setTimeout(() => {
    res.redirect(req.get("referer"));
  }, 2000);

});

router.post('/actualizarTareaRealizada/:id', (req, res) => {
  var id = req.params.id;
  var NombreCarpeta = req.body.NombreCarpeta;
  var TareaRealizada = req.body.TareaRealizada;
  sql = 'UPDATE historialdecambios set? WHERE id=?';
  connection.query(sql, [{ Tarea_Realizada_sub: TareaRealizada }, id], (error, result) => {
    if (error) console.log(error);
    else (
      res.redirect("/historialcarpeta/" + NombreCarpeta)
    )
  })
})
//AJAX
router.get("/BuscarEstadoFinanciero/:idObra", (req, res) => {

});
router.get("/Adminecogas/DatosObras", (req, res) => {
  let sql = 'SELECT * FROM obras WHERE (Estado !="Finalizada" AND Estado !="ELIMINADO") ORDER BY Nombre asc';
  connection.query(sql, (error, results) => {
    if (error) console.log(error);
    else {
      res.send(results);
    }
  })
})
router.get("/Adminecogas/DatosObras/all", (req, res) => {
  let sql = 'Select * FROM obras ORDER BY Nombre asc';
  connection.query(sql, (error, results) => {
    if (error) console.log(error);
    else {
      res.send(results);
    }
  })
})
router.post('/AdminEcogas/CargarDocumento', upload.single('CargaDocumento'), async (req, res) => {
  // SE DEBE DE TERMINAR LA GESTION DE LA CARGA DE LOS ARCHIVOS. ACTUALMENTE NO FUNCIONA.
  // DESDE EDITAR TAREAS, APARENTEMENTE SE ENVIA A TRAVES DEL Modal, EL ARCHIVO. PERO CUANDO LLEGA ACA AL BACKEND
  // EL MISMO NO PUEDE SER PROCESADO. DEBIDO A SOLICITUD DE MAURICIO EN HACER OTRA COSA SE DEJA EL CODIGO ADONDE ESTA Y SE CONTINUA CON OTRAS 
  // TAREAS.

  const codigoObra = req.body.nCodigoObra;
  const nombreDocumento = req.body.CargaDocumento;
  const ubicacion = req.body.nombreDocumento;
  try {
    const ArchivoTemporal = path.join(__dirname, '/Archivos/temp', 'archivo');
    const CarpetaDestino = path.join(__dirname, 'Archivos/1 Administracion Ecogas/02. Carpetas Vigentes/' + codigoObra, ubicacion);
    await fs.rename(tempFilePath, finalDestinationPath);
    res.send('Archivo cargado exitosamente');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al mover el archivo');
  }
})