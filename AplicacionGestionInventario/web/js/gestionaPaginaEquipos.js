/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

/* global ultimoNumEquipo, tablaEquipos, cantidadEquipos, usuario, rol */

var id = localStorage.getItem('id');

$(document).keydown(function (event) {
    if (event.which === 27) { // Verificar si la tecla presionada es la tecla de escape (código 27)
        localStorage.removeItem('id');
    }
});

$(document).ready(function () {
    $.fn.DataTable.ext.classes.sPageButton = 'page-link'; // Change Pagination Button Class
    var indiceColumnaID = $("#tablaEquipos thead th#celdaEncabezadoIdEquipo").index();
    tablaEquipos = $("#tablaEquipos").DataTable({
        searching: true,
        select: false,
        responsive: true,
        dom: 'Blfrtip',
        buttons: {
            dom: {
                button: {
                    className: 'btn'
                }
            },
            buttons: [
                {
                    extend: 'excel',
                    title: '',
                    text: 'Exportar a Excel',
                    className: 'btn btn-outline-success',
                    excelStyles: (function () {
                        var styles = [];
                        var startColumn = 'A'.charCodeAt(0);
                        var endColumn = 'K'.charCodeAt(0);

                        // Estilos para la fila 0
                        for (var colCode = startColumn; colCode <= endColumn; colCode++) {
                            var cell = String.fromCharCode(colCode) + '0';
                            var styleConfig = {
                                cells: 's' + cell,
                                style: {
                                    font: {
                                        color: 'FFFFFF',
                                        b: true
                                    },
                                    fill: {
                                        pattern: {
                                            color: '2E8B57' // Código de color para "seagreen"
                                        }
                                    }
                                }
                            };

                            styles.push(styleConfig);
                        }

                        // Estilos para filas pares desde la fila 2 en adelante
                        for (var row = 2; row <= cantidadEquipos; row += 2) {
                            for (var colCode = startColumn; colCode <= endColumn; colCode++) {
                                var cell = String.fromCharCode(colCode) + row;
                                var styleConfig = {
                                    cells: 's' + cell,
                                    style: {
//                                        font: {
//                                            color: 'FFFFFF'
//                                        },
                                        fill: {
                                            pattern: {
                                                color: '3CB371' // Código de color para "mediumseagreen"
                                            }
                                        }
                                    }
                                };

                                styles.push(styleConfig);
                            }
                        }

                        return styles;
                    })(),
                    exportOptions: {
                        columns: ':eq(' + indiceColumnaID + '), :gt(' + indiceColumnaID + ')'
                    }
                }
            ]
        },
        language: {
            "url": "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
        },
        order: []
    });

    // Verificar si id no es nulo
    if (id !== null) {
        // Buscar la fila con el id correspondiente en la tabla
        var filaEditar = $("#tablaEquipos tbody tr[data-idequipo='" + id + "']");
        // Verificar si se encontró la fila
        if (filaEditar.length > 0) {
            // Configurar el modal para editar la fila encontrada
            configurarModal(filaEditar, 'Editar');
            // Mostrar el modal
            $("#modalEquipos").modal('show');
            $("[name='btnEditar'], [name='btnCancelar'], .btn-close, body, .container").on("click", function (event) {
                // Verificar si el clic proviene del botón izquierdo del ratón (event.which === 1)
                // o si es un clic en cualquiera de los elementos seleccionados
                if (event.which === 1 || $(event.target).is("[name='btnEditar'], [name='btnCancelar'], .btn-close, body, .container")) {
                    localStorage.removeItem('id');
                }
            });
        }
    }

    // Configurar el modal al hacer clic en el botón "Agregar"
    $("#btnAgregarEquipo").on("click", function () {
        var accion = 'Agregar';
        configurarModal(null, accion);
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
            $("#titulo").hide();
            $("#titulo").text("");

            $("#filasFormulario #columnaNumEquipo #txtNumEquipo").val(ultimoNumEquipo);
            $("#filasFormulario #columnaNumInventarioCEDEX #txtNumInventarioCEDEX").val("");
            $("#filasFormulario #columnaNombreEquipo #txtNombreEquipo").val("");
            $("#filasFormulario #columnaFechaCompraEquipo #txtFechaCompraEquipo").val("");
            $("#filasFormulario #columnaFabricanteEquipo #txtFabricanteEquipo").val("");
            $("#filasFormulario #columnaFechaUltimaCalibracion #txtFechaUltimaCalibracion").val("");
            $("#filasFormulario #columnaFechaProximaCalibracion #txtFechaProximaCalibracion").val("");
            $("#filasFormulario #columnaFechaUltimoMantenimiento #txtFechaUltimoMantenimiento").val("");
            $("#filasFormulario #columnaFechaProximoMantenimiento #txtFechaProximoMantenimiento").val("");
            $("#filasFormulario #columnaFungibles #selectFungibles").val("");
            $("#filasFormulario #columnaHerramientas #selectHerramientas").val("");
            $("#filasFormulario #columnaFotoEquipo #inputFotoEquipo").val("");

            $("#filasFormulario #columnaNumInventarioCEDEX #txtNumInventarioCEDEX").prop("readonly", false);
            $("#filasFormulario #columnaNombreEquipo #txtNombreEquipo").prop("readonly", false);
            $("#filasFormulario #columnaFechaCompraEquipo #txtFechaCompraEquipo").prop("readonly", false);
            $("#filasFormulario #columnaFabricanteEquipo #txtFabricanteEquipo").prop("readonly", false);
            $("#filasFormulario #columnaFechaUltimaCalibracion #txtFechaUltimaCalibracion").prop("readonly", false);
            $("#filasFormulario #columnaFechaProximaCalibracion #txtFechaProximaCalibracion").prop("readonly", false);
            $("#filasFormulario #columnaFechaUltimoMantenimiento #txtFechaUltimoMantenimiento").prop("readonly", false);
            $("#filasFormulario #columnaFechaProximoMantenimiento #txtFechaProximoMantenimiento").prop("readonly", false);
            $("#filasFormulario #columnaFungibles #selectFungibles").prop("disabled", false);
            $("#filasFormulario #columnaHerramientas #selectHerramientas").prop("disabled", false);
            $("#filasFormulario #columnaFotoEquipo #inputFotoEquipo").prop("disabled", false);

            // Poner visibles los campos
            $("#filasFormulario").show();

            $("[name='btnAgregar']").show();
            $("[name='btnAgregar']").prop("disabled", false);
            $("[name='btnEditar']").hide();
            $("[name='btnEditar']").prop("disabled", true);
            $("[name='btnEliminar']").hide();
            $("[name='btnEliminar']").prop("disabled", true);
        } else {
            $("#filasFormulario #columnaNumEquipo #txtNumEquipo").val(fila.data("idequipo"));
            $("#filasFormulario #columnaNumInventarioCEDEX #txtNumInventarioCEDEX").val(fila.data("numinventariocedex"));
            $("#filasFormulario #columnaNombreEquipo #txtNombreEquipo").val(fila.data("nombre"));
            $("#filasFormulario #columnaFechaCompraEquipo #txtFechaCompraEquipo").val(fila.data("fechacompraequipo"));
            $("#filasFormulario #columnaFabricanteEquipo #txtFabricanteEquipo").val(fila.data("fabricanteequipo"));
            $("#filasFormulario #columnaFechaUltimaCalibracion #txtFechaUltimaCalibracion").val(fila.data("fechaultimacalibracion"));
            $("#filasFormulario #columnaFechaProximaCalibracion #txtFechaProximaCalibracion").val(fila.data("fechaproximacalibracion"));
            $("#filasFormulario #columnaFechaUltimoMantenimiento #txtFechaUltimoMantenimiento").val(fila.data("fechaultimomantenimiento"));
            $("#filasFormulario #columnaFechaProximoMantenimiento #txtFechaProximoMantenimiento").val(fila.data("fechaproximomantenimiento"));
            $("#filasFormulario #columnaFungibles #selectFungibles").val(fila.data("numfungibles"));
            $("#filasFormulario #columnaHerramientas #selectHerramientas").val(fila.data("numherramientas"));
            $("#filasFormulario #columnaFotoEquipo #inputFotoEquipo").val(fila.data("foto"));

            if (accion === 'Consultar') {
                // Cambiar el texto del título del modal
                $(".modal-title").text("Información del equipo");
                $("#titulo").hide();
                $("#titulo").text("");

                $("#filasFormulario #columnaNumInventarioCEDEX #txtNumInventarioCEDEX").prop("readonly", true);
                $("#filasFormulario #columnaNombreEquipo #txtNombreEquipo").prop("readonly", true);
                $("#filasFormulario #columnaFechaCompraEquipo #txtFechaCompraEquipo").prop("readonly", true);
                $("#filasFormulario #columnaFabricanteEquipo #txtFabricanteEquipo").prop("readonly", true);
                $("#filasFormulario #columnaFechaUltimaCalibracion #txtFechaUltimaCalibracion").prop("readonly", true);
                $("#filasFormulario #columnaFechaProximaCalibracion #txtFechaProximaCalibracion").prop("readonly", true);
                $("#filasFormulario #columnaFechaUltimoMantenimiento #txtFechaUltimoMantenimiento").prop("readonly", true);
                $("#filasFormulario #columnaFechaProximoMantenimiento #txtFechaProximoMantenimiento").prop("readonly", true);
                $("#filasFormulario #columnaFungibles #selectFungibles").prop("disabled", true);
                $("#filasFormulario #columnaHerramientas #selectHerramientas").prop("disabled", true);
                $("#filasFormulario #columnaFotoEquipo #inputFotoEquipo").prop("disabled", true);

                // Poner visibles los campos
                $("#filasFormulario").show();

                $("[name='btnAgregar']").hide();
                $("[name='btnAgregar']").prop("disabled", true);
                $("[name='btnEditar']").hide();
                $("[name='btnEditar']").prop("disabled", true);
                $("[name='btnEliminar']").hide();
                $("[name='btnEliminar']").prop("disabled", true);
            } else if (accion === 'Editar') {
                // Cambiar el texto del título del modal
                $(".modal-title").text("Editar equipo");

                if (usuario !== null) {
                    if (rol === 1) {
                        $("#titulo").hide();
                        $("#titulo").text("");

                        $("#filasFormulario #columnaNumInventarioCEDEX #txtNumInventarioCEDEX").prop("readonly", false);
                        $("#filasFormulario #columnaNombreEquipo #txtNombreEquipo").prop("readonly", false);
                        $("#filasFormulario #columnaFechaCompraEquipo #txtFechaCompraEquipo").prop("readonly", false);
                        $("#filasFormulario #columnaFabricanteEquipo #txtFabricanteEquipo").prop("readonly", false);
                        $("#filasFormulario #columnaFechaUltimaCalibracion #txtFechaUltimaCalibracion").prop("readonly", false);
                        $("#filasFormulario #columnaFechaProximaCalibracion #txtFechaProximaCalibracion").prop("readonly", false);
                        $("#filasFormulario #columnaFechaUltimoMantenimiento #txtFechaUltimoMantenimiento").prop("readonly", false);
                        $("#filasFormulario #columnaFechaProximoMantenimiento #txtFechaProximoMantenimiento").prop("readonly", false);
                        $("#filasFormulario #columnaFungibles #selectFungibles").prop("disabled", false);
                        $("#filasFormulario #columnaHerramientas #selectHerramientas").prop("disabled", false);
                        $("#filasFormulario #columnaFotoEquipo #inputFotoEquipo").prop("disabled", false);

                        // Poner visibles los campos
                        $("#filasFormulario").show();

                        $("[name='btnAgregar']").hide();
                        $("[name='btnAgregar']").prop("disabled", true);
                        $("[name='btnEditar']").show();
                        $("[name='btnEditar']").prop("disabled", false);
                        $("[name='btnEliminar']").hide();
                        $("[name='btnEliminar']").prop("disabled", true);
                    } else {
                        $("#titulo").show();
                        $("#titulo").text("Para editar el equipo con id " + fila.data("idequipo") + " debes ser administrador.");

                        $("#filasFormulario #columnaNumInventarioCEDEX #txtNumInventarioCEDEX").prop("readonly", true);
                        $("#filasFormulario #columnaNombreEquipo #txtNombreEquipo").prop("readonly", true);
                        $("#filasFormulario #columnaFechaCompraEquipo #txtFechaCompraEquipo").prop("readonly", true);
                        $("#filasFormulario #columnaFabricanteEquipo #txtFabricanteEquipo").prop("readonly", true);
                        $("#filasFormulario #columnaFechaUltimaCalibracion #txtFechaUltimaCalibracion").prop("readonly", true);
                        $("#filasFormulario #columnaFechaProximaCalibracion #txtFechaProximaCalibracion").prop("readonly", true);
                        $("#filasFormulario #columnaFechaUltimoMantenimiento #txtFechaUltimoMantenimiento").prop("readonly", true);
                        $("#filasFormulario #columnaFechaProximoMantenimiento #txtFechaProximoMantenimiento").prop("readonly", true);
                        $("#filasFormulario #columnaFungibles #selectFungibles").prop("disabled", true);
                        $("#filasFormulario #columnaHerramientas #selectHerramientas").prop("disabled", true);
                        $("#filasFormulario #columnaFotoEquipo #inputFotoEquipo").prop("disabled", true);

                        // Poner visibles los campos
                        $("#filasFormulario").hide();

                        $("[name='btnAgregar']").hide();
                        $("[name='btnAgregar']").prop("disabled", true);
                        $("[name='btnEditar']").hide();
                        $("[name='btnEditar']").prop("disabled", true);
                        $("[name='btnEliminar']").hide();
                        $("[name='btnEliminar']").prop("disabled", true);
                    }
                }
            } else if (accion === 'Eliminar') {// Cambiar el texto del título del modal
                // Cambiar el texto del título del modal
                $(".modal-title").text("Confirmar acción");
                $("#titulo").show();
                $("#titulo").text("¿Seguro que deseas eliminar este equipo?");

                $("#filasFormulario #columnaNumInventarioCEDEX #txtNumInventarioCEDEX").prop("readonly", true);
                $("#filasFormulario #columnaNombreEquipo #txtNombreEquipo").prop("readonly", true);
                $("#filasFormulario #columnaFechaCompraEquipo #txtFechaCompraEquipo").prop("readonly", true);
                $("#filasFormulario #columnaFabricanteEquipo #txtFabricanteEquipo").prop("readonly", true);
                $("#filasFormulario #columnaFechaUltimaCalibracion #txtFechaUltimaCalibracion").prop("readonly", true);
                $("#filasFormulario #columnaFechaProximaCalibracion #txtFechaProximaCalibracion").prop("readonly", true);
                $("#filasFormulario #columnaFechaUltimoMantenimiento #txtFechaUltimoMantenimiento").prop("readonly", true);
                $("#filasFormulario #columnaFechaProximoMantenimiento #txtFechaProximoMantenimiento").prop("readonly", true);
                $("#filasFormulario #columnaFungibles #selectFungibles").prop("disabled", true);
                $("#filasFormulario #columnaHerramientas #selectHerramientas").prop("disabled", true);
                $("#filasFormulario #columnaFotoEquipo #inputFotoEquipo").prop("disabled", true);

                // Poner visibles los campos
                $("#filasFormulario").hide();

                $("[name='btnAgregar']").hide();
                $("[name='btnAgregar']").prop("disabled", true);
                $("[name='btnEditar']").hide();
                $("[name='btnEditar']").prop("disabled", true);
                $("[name='btnEliminar']").show();
                $("[name='btnEliminar']").prop("disabled", false);
            }
        }
    }
});
