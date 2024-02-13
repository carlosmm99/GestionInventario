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
            $("#filasFormulario #columnaNumIdentificacion #txtNumIdentificacion").prop("readonly", false);
            $("#filasFormulario #columnaNombreEquipo #txtNombreEquipo").prop("readonly", false);
            $("#filasFormulario #columnaFechaCompraEquipo #txtFechaCompraEquipo").prop("readonly", false);
            $("#filasFormulario #columnaFabricanteEquipo #txtFabricanteEquipo").prop("readonly", false);
            $("#filasFormulario #columnaFechaUltimaCalibracion #txtFechaUltimaCalibracion").prop("readonly", false);
            $("#filasFormulario #columnaFechaProximaCalibracion #txtFechaProximaCalibracion").prop("readonly", false);
            $("#filasFormulario #columnaFechaUltimoMantenimiento #txtFechaUltimoMantenimiento").prop("readonly", false);
            $("#filasFormulario #columnaFechaProximoMantenimiento #txtFechaProximoMantenimiento").prop("readonly", false);
            $("#filasFormulario #columnaNumEquipo").show();
            $("#filasFormulario #columnaNumIdentificacion").show();
            $("#filasFormulario #columnaNombreEquipo").show();
            $("#filasFormulario #columnaFechaCompraEquipo").show();
            $("#filasFormulario #columnaFabricanteEquipo").show();
            $("#filasFormulario #columnaFechaUltimaCalibracion").show();
            $("#filasFormulario #columnaFechaProximaCalibracion").show();
            $("#filasFormulario #columnaFechaUltimoMantenimiento").show();
            $("#filasFormulario #columnaFechaProximoMantenimiento").show();
            $("#filasFormulario #columnaFungibles #selectFungibles").val("");
            $("#filasFormulario #columnaFungibles").hide();
            $("#filasFormulario #columnaHerramientas #selectHerramientas").val("");
            $("#filasFormulario #columnaHerramientas").hide();

            // Poner visibles los campos
            $("#filasFormulario").show();

            $("[name='btnAgregar']").show();
            $("[name='btnAsignarFungiblesAEquipo']").hide();
            $("[name='btnAsignarHerramientasAEquipo']").hide();
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

            if (accion === 'AsignarFungiblesAEquipo') {
                // Cambiar el texto del título del modal
                $(".modal-title").text("Asignar fungibles");
                $("#tituloEliminar").hide();

                $("#filasFormulario #columnaNumIdentificacion #txtNumIdentificacion").prop("readonly", true);
                $("#filasFormulario #columnaNombreEquipo #txtNombreEquipo").prop("readonly", true);
                $("#filasFormulario #columnaFechaCompraEquipo #txtFechaCompraEquipo").prop("readonly", true);
                $("#filasFormulario #columnaFabricanteEquipo #txtFabricanteEquipo").prop("readonly", true);
                $("#filasFormulario #columnaFechaUltimaCalibracion #txtFechaUltimaCalibracion").prop("readonly", true);
                $("#filasFormulario #columnaFechaProximaCalibracion #txtFechaProximaCalibracion").prop("readonly", true);
                $("#filasFormulario #columnaFechaUltimoMantenimiento #txtFechaUltimoMantenimiento").prop("readonly", true);
                $("#filasFormulario #columnaFechaProximoMantenimiento #txtFechaProximoMantenimiento").prop("readonly", true);
                $("#filasFormulario #columnaNumEquipo").show();
                $("#filasFormulario #columnaNumIdentificacion").hide();
                $("#filasFormulario #columnaNombreEquipo").hide();
                $("#filasFormulario #columnaFechaCompraEquipo").hide();
                $("#filasFormulario #columnaFabricanteEquipo").hide();
                $("#filasFormulario #columnaFechaUltimaCalibracion").hide();
                $("#filasFormulario #columnaFechaProximaCalibracion").hide();
                $("#filasFormulario #columnaFechaUltimoMantenimiento").hide();
                $("#filasFormulario #columnaFechaProximoMantenimiento").hide();
                $("#filasFormulario #columnaFungibles #selectFungibles").prop("required", true);
                $("#filasFormulario #columnaFungibles #selectFungibles").val("");
                $("#filasFormulario #columnaFungibles").show();
                $("#filasFormulario #columnaHerramientas #selectHerramientas").prop("required", false);
                $("#filasFormulario #columnaHerramientas #selectHerramientas").val("");
                $("#filasFormulario #columnaHerramientas").hide();

                // Poner visibles los campos
                $("#filasFormulario").show();

                $("[name='btnAgregar']").hide();
                $("[name='btnAsignarFungiblesAEquipo']").show();
                $("[name='btnAsignarHerramientasAEquipo']").hide();
                $("[name='btnEditar']").hide();
                $("[name='btnEliminar']").hide();
            } else if (accion === 'AsignarHerramientasAEquipo') {
                // Cambiar el texto del título del modal
                $(".modal-title").text("Asignar herramientas");
                $("#tituloEliminar").hide();

                $("#filasFormulario #columnaNumIdentificacion #txtNumIdentificacion").prop("readonly", true);
                $("#filasFormulario #columnaNombreEquipo #txtNombreEquipo").prop("readonly", true);
                $("#filasFormulario #columnaFechaCompraEquipo #txtFechaCompraEquipo").prop("readonly", true);
                $("#filasFormulario #columnaFabricanteEquipo #txtFabricanteEquipo").prop("readonly", true);
                $("#filasFormulario #columnaFechaUltimaCalibracion #txtFechaUltimaCalibracion").prop("readonly", true);
                $("#filasFormulario #columnaFechaProximaCalibracion #txtFechaProximaCalibracion").prop("readonly", true);
                $("#filasFormulario #columnaFechaUltimoMantenimiento #txtFechaUltimoMantenimiento").prop("readonly", true);
                $("#filasFormulario #columnaFechaProximoMantenimiento #txtFechaProximoMantenimiento").prop("readonly", true);
                $("#filasFormulario #columnaNumEquipo").show();
                $("#filasFormulario #columnaNumIdentificacion").hide();
                $("#filasFormulario #columnaNombreEquipo").hide();
                $("#filasFormulario #columnaFechaCompraEquipo").hide();
                $("#filasFormulario #columnaFabricanteEquipo").hide();
                $("#filasFormulario #columnaFechaUltimaCalibracion").hide();
                $("#filasFormulario #columnaFechaProximaCalibracion").hide();
                $("#filasFormulario #columnaFechaUltimoMantenimiento").hide();
                $("#filasFormulario #columnaFechaProximoMantenimiento").hide();
                $("#filasFormulario #columnaFungibles #selectFungibles").prop("required", false);
                $("#filasFormulario #columnaFungibles #selectFungibles").val("");
                $("#filasFormulario #columnaFungibles").hide();
                $("#filasFormulario #columnaHerramientas #selectHerramientas").prop("required", true);
                $("#filasFormulario #columnaHerramientas #selectHerramientas").val("");
                $("#filasFormulario #columnaHerramientas").show();

                // Poner visibles los campos
                $("#filasFormulario").show();

                $("[name='btnAgregar']").hide();
                $("[name='btnAsignarFungiblesAEquipo']").hide();
                $("[name='btnAsignarHerramientasAEquipo']").show();
                $("[name='btnEditar']").hide();
                $("[name='btnEliminar']").hide();
            } else if (accion === 'Consultar') {
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
                $("#filasFormulario #columnaNumEquipo").show();
                $("#filasFormulario #columnaNumIdentificacion").show();
                $("#filasFormulario #columnaNombreEquipo").show();
                $("#filasFormulario #columnaFechaCompraEquipo").show();
                $("#filasFormulario #columnaFabricanteEquipo").show();
                $("#filasFormulario #columnaFechaUltimaCalibracion").show();
                $("#filasFormulario #columnaFechaProximaCalibracion").show();
                $("#filasFormulario #columnaFechaUltimoMantenimiento").show();
                $("#filasFormulario #columnaFechaProximoMantenimiento").show();
                $("#filasFormulario #columnaFungibles #selectFungibles").prop("required", false);
                $("#filasFormulario #columnaFungibles #selectFungibles").val("");
                $("#filasFormulario #columnaFungibles").hide();
                $("#filasFormulario #columnaHerramientas #selectHerramientas").prop("required", false);
                $("#filasFormulario #columnaHerramientas #selectHerramientas").val("");
                $("#filasFormulario #columnaHerramientas").hide();

                // Poner visibles los campos
                $("#filasFormulario").show();

                // Ocultar todos los botones
                $("[name='btnAgregar']").hide();
                $("[name='btnAsignarFungiblesAEquipo']").hide();
                $("[name='btnAsignarHerramientasAEquipo']").hide();
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
                $("#filasFormulario #columnaNumEquipo").show();
                $("#filasFormulario #columnaNumIdentificacion").show();
                $("#filasFormulario #columnaNombreEquipo").show();
                $("#filasFormulario #columnaFechaCompraEquipo").show();
                $("#filasFormulario #columnaFabricanteEquipo").show();
                $("#filasFormulario #columnaFechaUltimaCalibracion").show();
                $("#filasFormulario #columnaFechaProximaCalibracion").show();
                $("#filasFormulario #columnaFechaUltimoMantenimiento").show();
                $("#filasFormulario #columnaFechaProximoMantenimiento").show();
                $("#filasFormulario #columnaFungibles #selectFungibles").prop("required", false);
                $("#filasFormulario #columnaFungibles #selectFungibles").val("");
                $("#filasFormulario #columnaFungibles").hide();
                $("#filasFormulario #columnaHerramientas #selectHerramientas").prop("required", false);
                $("#filasFormulario #columnaHerramientas #selectHerramientas").val("");
                $("#filasFormulario #columnaHerramientas").hide();

                // Poner visibles los campos
                $("#filasFormulario").show();

                // Mostrar el botón de editar y ocultar los de agregar y eliminar
                $("[name='btnAgregar']").hide();
                $("[name='btnAsignarFungiblesAEquipo']").hide();
                $("[name='btnAsignarHerramientasAEquipo']").hide();
                $("[name='btnEditar']").show();
                $("[name='btnEliminar']").hide();
            } else if (accion === 'Eliminar') {// Cambiar el texto del título del modal
                $(".modal-title").text("Eliminar equipo");
                $("#tituloEliminar").show();

                $("#filasFormulario #columnaNumIdentificacion #txtNumIdentificacion").prop("readonly", true);
                $("#filasFormulario #columnaNombreEquipo #txtNombreEquipo").prop("readonly", true);
                $("#filasFormulario #columnaFechaCompraEquipo #txtFechaCompraEquipo").prop("readonly", true);
                $("#filasFormulario #columnaFabricanteEquipo #txtFabricanteEquipo").prop("readonly", true);
                $("#filasFormulario #columnaFechaUltimaCalibracion #txtFechaUltimaCalibracion").prop("readonly", true);
                $("#filasFormulario #columnaFechaProximaCalibracion #txtFechaProximaCalibracion").prop("readonly", true);
                $("#filasFormulario #columnaFechaUltimoMantenimiento #txtFechaUltimoMantenimiento").prop("readonly", true);
                $("#filasFormulario #columnaFechaProximoMantenimiento #txtFechaProximoMantenimiento").prop("readonly", true);
                $("#filasFormulario #columnaNumEquipo").hide();
                $("#filasFormulario #columnaNumIdentificacion").hide();
                $("#filasFormulario #columnaNombreEquipo").hide();
                $("#filasFormulario #columnaFechaCompraEquipo").hide();
                $("#filasFormulario #columnaFabricanteEquipo").hide();
                $("#filasFormulario #columnaFechaUltimaCalibracion").hide();
                $("#filasFormulario #columnaFechaProximaCalibracion").hide();
                $("#filasFormulario #columnaFechaUltimoMantenimiento").hide();
                $("#filasFormulario #columnaFechaProximoMantenimiento").hide();
                $("#filasFormulario #columnaFungibles #selectFungibles").prop("required", false);
                $("#filasFormulario #columnaFungibles #selectFungibles").val("");
                $("#filasFormulario #columnaFungibles").hide();
                $("#filasFormulario #columnaHerramientas #selectHerramientas").prop("required", false);
                $("#filasFormulario #columnaHerramientas #selectHerramientas").val("");
                $("#filasFormulario #columnaHerramientas").hide();

                // Poner visibles los campos
                $("#filasFormulario").show();

                // Mostrar el botón de eliminar y ocultar los de agregar y editar
                $("[name='btnAgregar']").hide();
                $("[name='btnAsignarFungiblesAEquipo']").hide();
                $("[name='btnAsignarHerramientasAEquipo']").hide();
                $("[name='btnEditar']").hide();
                $("[name='btnEliminar']").show();
            }
        }
    }
});
