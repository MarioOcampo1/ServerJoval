$(document).ready(function() {   
    var url = "http://localhost:3000/estadogeneral";
    $('#TablaClientes').DataTable({
        language: {
            url: '//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json'
          },
        "ajax": {
            "url": url,
            "dataSrc": ""
        },
        "columns": [
            { "data": "Nombre" },
            { "data": "N° Carpeta" },
            { "data": "Ubicación" },
            { "data": "Comitente" },
            { "data": "Estado" },
            { "data": "Fecha firma contrato" },
            {"defaultContent": "<button>editar</button>"}
        ]    });
})