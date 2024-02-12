/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

/* global ultimoNumEquipo, tablaEquipos */

$(document).ready(function () {
    tablaEquipos = $("#tablaEquipos").DataTable({
        language: {
            "url": "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
        },
        order: []
    });

    // Configurar el modal al hacer clic en el botón "Agregar"
    $("#btnAgregarEquipo").on('click', function () {
        var accion = 'Agregar';
        configurarModal(null, accion);
    });

    $("#tablaEquipos tbody").on("click", "tr td .btnEditar", function (e) {
        e.stopPropagation(); // Detener la propagación para evitar que se active el evento de clic en la fila
        fila = obtenerFilaSeleccionada($(this).closest('tr'));
        var accion = 'Editar';
        configurarModal(fila, accion);
        $('#modalEquipos').modal('show');
    });

    // Función para obtener la fila seleccionada
    function obtenerFilaSeleccionada(elemento) {
        return $(elemento).closest('tr');
    }

    function configurarModal(fila, accion) {
        if (accion === 'Agregar') {
            // Cambiar el texto del título del modal
            $(".modal-title").text("Agregar equipo");

            $("#filasFormulario #columnaNumEquipo #txtNumEquipo").val(ultimoNumEquipo);
            $("#filasFormulario #columnaNumIdentificacion #txtNumIdentificacion").val("");
            $("#filasFormulario #columnaNombre #txtNombre").val("");
            $("#filasFormulario #columnaFechaCompraEquipo #txtFechaCompraEquipo").val("");
            $("#filasFormulario #columnaFabricanteEquipo #txtFabricanteEquipo").val("");
            $("#filasFormulario #columnaFechaUltimaCalibracion #txtFechaUltimaCalibracion").val("");
            $("#filasFormulario #columnaFechaProximaCalibracion #txtFechaProximaCalibracion").val("");

            // Poner visibles los campos
            $("#filasFormulario").show();

            // Mostrar el botón de guardar y ocultar los de editar y eliminar
            $("[name='btnAgregar']").show();
            $("[name='btnEditar']").hide();
        } else {
            $("#filasFormulario #columnaNumEquipo #txtNumEquipo").val(fila.data("idequipo"));
            $("#filasFormulario #columnaNumIdentificacion #txtNumIdentificacion").val(fila.data("numidentificacion"));
            $("#filasFormulario #columnaNombre #txtNombre").val(fila.data("nombre"));
            $("#filasFormulario #columnaFechaCompraEquipo #txtFechaCompraEquipo").val(fila.data("fechacompraequipo"));
            $("#filasFormulario #columnaFabricanteEquipo #txtFabricanteEquipo").val(fila.data("fabricanteequipo"));
            $("#filasFormulario #columnaFechaUltimaCalibracion #txtFechaUltimaCalibracion").val(fila.data("fechaultimacalibracion"));
            $("#filasFormulario #columnaFechaProximaCalibracion #txtFechaProximaCalibracion").val(fila.data("fechaproximacalibracion"));

            if (accion === 'Editar') {
                // Cambiar el texto del título del modal
                $(".modal-title").text("Editar equipo");

                // Poner visibles los campos
                $("#filasFormulario").show();

                // Mostrar el botón de guardar y ocultar los de editar y eliminar
                $("[name='btnAgregar']").hide();
                $("[name='btnEditar']").show();
            }
        }
    }
});
