/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

/* global ultimoNumFungible, tablaFungibles, cantidadFungibles, usuario, rol */

$(document).ready(function () {
    $.fn.DataTable.ext.classes.sPageButton = 'page-link'; // Change Pagination Button Class
    var indiceColumnaMarca = $("#tablaFungibles thead th#celdaEncabezadoMarcaFungible").index();
    tablaFungibles = $("#tablaFungibles").DataTable({
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
                        var endColumn = 'D'.charCodeAt(0);

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
                        for (var row = 2; row <= cantidadFungibles; row += 2) {
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
                        columns: ':eq(' + indiceColumnaMarca + '), :gt(' + indiceColumnaMarca + ')'
                    }
                }
            ]
        },
        language: {
            "url": "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
        },
        order: []
    });

    $("#btnAgregarFungible").on("click", function () {
        var accion = 'Agregar';
        configurarModal(null, accion);
    });

    $("#tablaFungibles tbody").on("click", "tr td:not(:first-child)", function () {
        fila = obtenerFilaSeleccionada($(this).closest('tr'));
        var accion = 'Consultar';
        configurarModal(fila, accion);
        $('#modalFungibles').modal('show');
    });

    $("#tablaFungibles tbody").on("click", "tr td .btnEditar", function (e) {
        e.stopPropagation(); // Detener la propagación para evitar que se active el evento de clic en la fila
        fila = obtenerFilaSeleccionada($(this).closest('tr'));
        var accion = 'Editar';
        configurarModal(fila, accion);
        $('#modalFungibles').modal('show');
    });

    $("#tablaFungibles tbody").on("click", "tr td .btnEliminar", function (e) {
        e.stopPropagation(); // Detener la propagación para evitar que se active el evento de clic en la fila
        fila = obtenerFilaSeleccionada($(this).closest('tr'));
        var accion = 'Eliminar';
        configurarModal(fila, accion);
        $('#modalFungibles').modal('show');
    });

    $("[type='number']").keypress(function (evt) {
        evt.preventDefault();
    });

    // Asociar la función al evento resize de la ventana
    $(window).on('resize', function () {
        ajustarTabla();
    });

    // Ajustar la tabla al cargar la página
    $(document).ready(function () {
        ajustarTabla();
    });

    // Función para ajustar la tabla al cambiar el tamaño de la ventana
    function ajustarTabla() {
        tablaFungibles.columns.adjust().responsive.recalc();
    }

    // Función para obtener la fila seleccionada
    function obtenerFilaSeleccionada(elemento) {
        return $(elemento).closest('tr');
    }

    function configurarModal(fila, accion) {
        if (accion === 'Agregar') {
            // Cambiar el texto del título del modal
            $(".modal-title").text("Agregar fungible");
            $("#tituloEliminar").hide();

            $("#filasFormulario #columnaNumFungible #txtNumFungible").val(ultimoNumFungible);
            $("#filasFormulario #columnaMarcaFungible #txtMarcaFungible").val("");
            $("#filasFormulario #columnaModeloFungible #txtModeloFungible").val("");
            $("#filasFormulario #columnaTamanyo #txtTamanyo").val("");
            $("#filasFormulario .minus, #filasFormulario .plus").prop("disabled", false);
            $("#filasFormulario #columnaCantidad #txtCantidad").val(0);
            $("#filasFormulario #columnaEquipos #selectEquipos").val("");
            $("#filasFormulario #columnaHerramientas #selectHerramientas").val("");
            $("#filasFormulario #columnaMarcaFungible #txtMarcaFungible").prop("readonly", false);
            $("#filasFormulario #columnaModeloFungible #txtModeloFungible").prop("readonly", false);
            $("#filasFormulario #columnaTamanyo #txtTamanyo").prop("readonly", false);
            $("#filasFormulario #columnaCantidad #txtCantidad").prop("disabled", false);
            $("#filasFormulario #columnaEquipos #selectEquipos").prop("disabled", false);
            $("#filasFormulario #columnaHerramientas #selectHerramientas").prop("disabled", false);

            // Poner visibles los campos
            $("#filasFormulario").show();

            $("[name='btnAgregar']").show();
            $("[name='btnAgregar']").prop("disabled", false);
            $("[name='btnEditar']").hide();
            $("[name='btnEditar']").prop("disabled", true);
            $("[name='btnEliminar']").hide();
            $("[name='btnEliminar']").prop("disabled", true);
        } else {
            $("#filasFormulario #columnaNumFungible #txtNumFungible").val(fila.data("idfungible"));
            $("#filasFormulario #columnaMarcaFungible #txtMarcaFungible").val(fila.data("marcafungible"));
            $("#filasFormulario #columnaModeloFungible #txtModeloFungible").val(fila.data("modelofungible"));
            $("#filasFormulario #columnaTamanyo #txtTamanyo").val(fila.data("tamanyo"));
            $("#filasFormulario #columnaCantidad #txtCantidad").val(fila.data("cantidad"));
            $("#filasFormulario #columnaEquipos #selectEquipos").val(fila.data("numequipos"));
            $("#filasFormulario #columnaHerramientas #selectHerramientas").val(fila.data("numherramientas"));

            if (accion === 'Consultar') {
                // Cambiar el texto del título del modal
                $(".modal-title").text("Información del fungible");
                $("#tituloEliminar").hide();

                $("#filasFormulario #columnaMarcaFungible #txtMarcaFungible").prop("readonly", true);
                $("#filasFormulario #columnaModeloFungible #txtModeloFungible").prop("readonly", true);
                $("#filasFormulario #columnaTamanyo #txtTamanyo").prop("readonly", true);
                $("#filasFormulario #columnaCantidad #txtCantidad").prop("disabled", true);
                $("#filasFormulario .minus, #filasFormulario .plus").prop("disabled", true);
                $("#filasFormulario #columnaEquipos #selectEquipos").prop("disabled", true);
                $("#filasFormulario #columnaHerramientas #selectHerramientas").prop("disabled", true);

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
                $(".modal-title").text("Editar fungible");
                $("#tituloEliminar").hide();

                if (usuario !== null) {
                    if (rol === 1) {
                        $("#filasFormulario #columnaMarcaFungible #txtMarcaFungible").prop("readonly", false);
                        $("#filasFormulario #columnaModeloFungible #txtModeloFungible").prop("readonly", false);
                        $("#filasFormulario #columnaTamanyo #txtTamanyo").prop("readonly", false);
                        $("#filasFormulario #columnaEquipos #selectEquipos").prop("disabled", false);
                        $("#filasFormulario #columnaHerramientas #selectHerramientas").prop("disabled", false);
                    } else if (rol === 2) {
                        $("#filasFormulario #columnaMarcaFungible #txtMarcaFungible").prop("readonly", true);
                        $("#filasFormulario #columnaModeloFungible #txtModeloFungible").prop("readonly", true);
                        $("#filasFormulario #columnaTamanyo #txtTamanyo").prop("readonly", true);
                        $("#filasFormulario #columnaEquipos #selectEquipos").prop("disabled", true);
                        $("#filasFormulario #columnaHerramientas #selectHerramientas").prop("disabled", true);
                    }
                }

                $("#filasFormulario #columnaCantidad #txtCantidad").prop("disabled", false);
                $("#filasFormulario .minus, #filasFormulario .plus").prop("disabled", false);

                // Poner visibles los campos
                $("#filasFormulario").show();

                $("[name='btnAgregar']").hide();
                $("[name='btnAgregar']").prop("disabled", true);
                $("[name='btnEditar']").show();
                $("[name='btnEditar']").prop("disabled", false);
                $("[name='btnEliminar']").hide();
                $("[name='btnEliminar']").prop("disabled", true);
            } else if (accion === 'Eliminar') {
                // Cambiar el texto del título del modal
                $(".modal-title").text("Confirmar acción");
                $("#tituloEliminar").show();

                $("#filasFormulario #columnaMarcaFungible #txtMarcaFungible").prop("readonly", true);
                $("#filasFormulario #columnaModeloFungible #txtModeloFungible").prop("readonly", true);
                $("#filasFormulario #columnaTamanyo #txtTamanyo").prop("readonly", true);
                $("#filasFormulario #columnaCantidad #txtCantidad").prop("disabled", true);
                $("#filasFormulario .minus, #filasFormulario .plus").prop("disabled", true);
                $("#filasFormulario #columnaEquipos #selectEquipos").prop("disabled", true);
                $("#filasFormulario #columnaHerramientas #selectHerramientas").prop("disabled", true);

                // Poner invisibles los campos
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

document.addEventListener('DOMContentLoaded', function () {
    // Obtener referencia a los botones
    var plusButton = document.querySelector('.plus');
    var minusButton = document.querySelector('.minus');
    var quantityInput = document.getElementById('txtCantidad');

    // Agregar event listeners a los botones
    plusButton.addEventListener('click', function () {
        quantityInput.value = parseInt(quantityInput.value) + 1;
    });

    minusButton.addEventListener('click', function () {
        // Asegurarse de que el valor nunca sea menor que 1
        if (quantityInput.value > 0) {
            quantityInput.value = parseInt(quantityInput.value) - 1;
        }
    });

    quantityInput.addEventListener('keydown', function (event) {
        if (event.key === "Backspace") {
            event.preventDefault();
        }
    });
});
