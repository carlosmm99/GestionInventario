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
    $("#btnAgregarEquipo").on("click", function () {
        var accion = 'Agregar';
        configurarModal(null, accion);
    });

    $("#tablaEquipos tbody").on("click", "tr td .btnFungiblesAEquipo", function (e) {
        e.stopPropagation(); // Detener la propagación para evitar que se active el evento de clic en la fila
        fila = obtenerFilaSeleccionada($(this).closest('tr'));
        var accion = 'AsignarFungiblesAEquipo';
        configurarModal(fila, accion);
        $('#modalEquipos').modal('show');
    });

    $("#tablaEquipos tbody").on("click", "tr td .btnHerramientasAEquipo", function (e) {
        e.stopPropagation(); // Detener la propagación para evitar que se active el evento de clic en la fila
        fila = obtenerFilaSeleccionada($(this).closest('tr'));
        var accion = 'AsignarHerramientasAEquipo';
        configurarModal(fila, accion);
        $('#modalEquipos').modal('show');
    });

    $("#tablaEquipos tbody").on("click", "tr td:not(:first-child)", function () {
        fila = obtenerFilaSeleccionada($(this).closest('tr'));
        var accion = 'Consultar';
        configurarModal(fila, accion);
        $('#modalEquipos').modal('show');
    });

    $("#tablaEquipos tbody").on("click", "tr td .btnEditar", function (e) {
        e.stopPropagation(); // Detener la propagación para evitar que se active el evento de clic en la fila
        fila = obtenerFilaSeleccionada($(this).closest('tr'));
        var accion = 'Editar';
        configurarModal(fila, accion);
        $('#modalEquipos').modal('show');
    });

    $("#tablaEquipos tbody").on("click", "tr td .btnEliminar", function (e) {
        e.stopPropagation(); // Detener la propagación para evitar que se active el evento de clic en la fila
        fila = obtenerFilaSeleccionada($(this).closest('tr'));
        var accion = 'Eliminar';
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
            $("#tituloEliminar").hide();

            $("#filasFormulario #columnaNumEquipo #txtNumEquipo").val(ultimoNumEquipo);
            $("#filasFormulario #columnaNumIdentificacion #txtNumIdentificacion").val("");
            $("#filasFormulario #columnaNombreEquipo #txtNombreEquipo").val("");
            $("#filasFormulario #columnaFechaCompraEquipo #txtFechaCompraEquipo").val("");
            $("#filasFormulario #columnaFabricanteEquipo #txtFabricanteEquipo").val("");
            $("#filasFormulario #columnaFechaUltimaCalibracion #txtFechaUltimaCalibracion").val("");
            $("#filasFormulario #columnaFechaProximaCalibracion #txtFechaProximaCalibracion").val("");
            $("#filasFormulario #columnaFechaUltimoMantenimiento #txtFechaUltimoMantenimiento").val("");
            $("#filasFormulario #columnaFechaProximoMantenimiento #txtFechaProximoMantenimiento").val("");
            $("#filasFormulario #columnaFungibles #selectFungibles").val("");
            $("#filasFormulario #columnaHerramientas #selectHerramientas").val("");

            $("#filasFormulario #columnaNumIdentificacion #txtNumIdentificacion").prop("readonly", false);
            $("#filasFormulario #columnaNombreEquipo #txtNombreEquipo").prop("readonly", false);
            $("#filasFormulario #columnaFechaCompraEquipo #txtFechaCompraEquipo").prop("readonly", false);
            $("#filasFormulario #columnaFabricanteEquipo #txtFabricanteEquipo").prop("readonly", false);
            $("#filasFormulario #columnaFechaUltimaCalibracion #txtFechaUltimaCalibracion").prop("readonly", false);
            $("#filasFormulario #columnaFechaProximaCalibracion #txtFechaProximaCalibracion").prop("readonly", false);
            $("#filasFormulario #columnaFechaUltimoMantenimiento #txtFechaUltimoMantenimiento").prop("readonly", false);
            $("#filasFormulario #columnaFechaProximoMantenimiento #txtFechaProximoMantenimiento").prop("readonly", false);
            $("#filasFormulario #columnaFungibles #selectFungibles").prop("disabled", false);
            $("#filasFormulario #columnaHerramientas #selectHerramientas").prop("disabled", false);

            // Poner visibles los campos
            $("#filasFormulario").show();

            $("[name='btnAgregar']").show();
            $("[name='btnEditar']").hide();
            $("[name='btnEliminar']").hide();
        } else {
            $("#filasFormulario #columnaNumEquipo #txtNumEquipo").val(fila.data("idequipo"));
            $("#filasFormulario #columnaNumIdentificacion #txtNumIdentificacion").val(fila.data("numidentificacion"));
            $("#filasFormulario #columnaNombreEquipo #txtNombreEquipo").val(fila.data("nombre"));
            $("#filasFormulario #columnaFechaCompraEquipo #txtFechaCompraEquipo").val(fila.data("fechacompraequipo"));
            $("#filasFormulario #columnaFabricanteEquipo #txtFabricanteEquipo").val(fila.data("fabricanteequipo"));
            $("#filasFormulario #columnaFechaUltimaCalibracion #txtFechaUltimaCalibracion").val(fila.data("fechaultimacalibracion"));
            $("#filasFormulario #columnaFechaProximaCalibracion #txtFechaProximaCalibracion").val(fila.data("fechaproximacalibracion"));
            $("#filasFormulario #columnaFechaUltimoMantenimiento #txtFechaUltimoMantenimiento").val(fila.data("fechaultimomantenimiento"));
            $("#filasFormulario #columnaFechaProximoMantenimiento #txtFechaProximoMantenimiento").val(fila.data("fechaproximomantenimiento"));
            $("#filasFormulario #columnaFungibles #selectFungibles").val(fila.data("numfungibles"));

            if (accion === 'Consultar') {
                // Cambiar el texto del título del modal
                $(".modal-title").text("Información del equipo");
                $("#tituloEliminar").hide();

                $("#filasFormulario #columnaNumIdentificacion #txtNumIdentificacion").prop("readonly", true);
                $("#filasFormulario #columnaNombreEquipo #txtNombreEquipo").prop("readonly", true);
                $("#filasFormulario #columnaFechaCompraEquipo #txtFechaCompraEquipo").prop("readonly", true);
                $("#filasFormulario #columnaFabricanteEquipo #txtFabricanteEquipo").prop("readonly", true);
                $("#filasFormulario #columnaFechaUltimaCalibracion #txtFechaUltimaCalibracion").prop("readonly", true);
                $("#filasFormulario #columnaFechaProximaCalibracion #txtFechaProximaCalibracion").prop("readonly", true);
                $("#filasFormulario #columnaFechaUltimoMantenimiento #txtFechaUltimoMantenimiento").prop("readonly", true);
                $("#filasFormulario #columnaFechaProximoMantenimiento #txtFechaProximoMantenimiento").prop("readonly", true);
                $("#filasFormulario #columnaFungibles #selectFungibles").prop("disabled", true);
                $("#filasFormulario #columnaHerramientas #selectHerramientas").prop("disabled", true);

                // Poner visibles los campos
                $("#filasFormulario").show();

                $("[name='btnAgregar']").hide();
                $("[name='btnEditar']").hide();
                $("[name='btnEliminar']").hide();
            } else if (accion === 'Editar') {
                // Cambiar el texto del título del modal
                $(".modal-title").text("Editar equipo");
                $("#tituloEliminar").hide();

                $("#filasFormulario #columnaNumIdentificacion #txtNumIdentificacion").prop("readonly", false);
                $("#filasFormulario #columnaNombreEquipo #txtNombreEquipo").prop("readonly", false);
                $("#filasFormulario #columnaFechaCompraEquipo #txtFechaCompraEquipo").prop("readonly", false);
                $("#filasFormulario #columnaFabricanteEquipo #txtFabricanteEquipo").prop("readonly", false);
                $("#filasFormulario #columnaFechaUltimaCalibracion #txtFechaUltimaCalibracion").prop("readonly", false);
                $("#filasFormulario #columnaFechaProximaCalibracion #txtFechaProximaCalibracion").prop("readonly", false);
                $("#filasFormulario #columnaFechaUltimoMantenimiento #txtFechaUltimoMantenimiento").prop("readonly", false);
                $("#filasFormulario #columnaFechaProximoMantenimiento #txtFechaProximoMantenimiento").prop("readonly", false);
                $("#filasFormulario #columnaFungibles #selectFungibles").prop("disabled", false);
                $("#filasFormulario #columnaHerramientas #selectHerramientas").prop("disabled", false);

                // Poner visibles los campos
                $("#filasFormulario").show();

                $("[name='btnAgregar']").hide();
                $("[name='btnEditar']").show();
                $("[name='btnEliminar']").hide();
            } else if (accion === 'Eliminar') {// Cambiar el texto del título del modal
                // Cambiar el texto del título del modal
                $(".modal-title").text("Confirmar acción");
                $("#tituloEliminar").show();

                $("#filasFormulario #columnaNumIdentificacion #txtNumIdentificacion").prop("readonly", true);
                $("#filasFormulario #columnaNombreEquipo #txtNombreEquipo").prop("readonly", true);
                $("#filasFormulario #columnaFechaCompraEquipo #txtFechaCompraEquipo").prop("readonly", true);
                $("#filasFormulario #columnaFabricanteEquipo #txtFabricanteEquipo").prop("readonly", true);
                $("#filasFormulario #columnaFechaUltimaCalibracion #txtFechaUltimaCalibracion").prop("readonly", true);
                $("#filasFormulario #columnaFechaProximaCalibracion #txtFechaProximaCalibracion").prop("readonly", true);
                $("#filasFormulario #columnaFechaUltimoMantenimiento #txtFechaUltimoMantenimiento").prop("readonly", true);
                $("#filasFormulario #columnaFechaProximoMantenimiento #txtFechaProximoMantenimiento").prop("readonly", true);
                $("#filasFormulario #columnaFungibles #selectFungibles").prop("disabled", true);
                $("#filasFormulario #columnaHerramientas #selectHerramientas").prop("disabled", true);

                // Poner visibles los campos
                $("#filasFormulario").show();

                $("[name='btnAgregar']").hide();
                $("[name='btnEditar']").hide();
                $("[name='btnEliminar']").show();
            }
        }
    }
});
