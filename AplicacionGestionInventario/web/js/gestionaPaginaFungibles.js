/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

/* global ultimoNumFungible, tablaFungibles, cantidadFungibles, usuario, rol, contexto */

var id = localStorage.getItem('id');

$(document).keydown(function (event) {
    if (event.which === 27 || event.which === 8) { // Verificar si la tecla presionada es la tecla de escape (código 27) o la tecla de retroceso (código 8)
        localStorage.removeItem('id');
    }
});

$(document).mousedown(function (event) {
    // Verificar si el botón presionado es el botón de retroceso (botón 4)
    if (event.which === 4) {
        localStorage.removeItem('id');
    }
});

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
                                        font: {
                                            color: 'FFFFFF'
                                        },
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
                        columns: ':eq(' + indiceColumnaMarca + '), :gt(' + indiceColumnaMarca + '):lt(-1)'
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
        var filaEditar = $("#tablaFungibles tbody tr[data-idfungible='" + id + "']");
        // Verificar si se encontró la fila
        if (filaEditar.length > 0) {
            // Configurar el modal para editar la fila encontrada
            configurarModal(filaEditar, 'Editar');
            // Mostrar el modal
            $('#modalFungibles').modal('show');
            $("[name='btnEditar'], [name='btnCancelar'], .btn-close, body, .container").on("click", function (event) {
                // Verificar si el clic proviene del botón izquierdo del ratón (event.which === 1)
                // o si es un clic en cualquiera de los elementos seleccionados
                if (event.which === 1 || $(event.target).is("[name='btnEditar'], [name='btnCancelar'], .btn-close, body, .container")) {
                    localStorage.removeItem('id');
                }
            });
        }
    }

    $("#filasFormulario #columnaFotoFungible #inputFotoFungible").change(function () {
        var file = this.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#imgFungible').attr('src', e.target.result);
                $('#txtFotoFungible').val(file.name);
            };
            reader.readAsDataURL(file);
        }
    });

    $("#btnAgregarFungible").on("click", function () {
        var accion = 'Agregar';
        configurarModal(null, accion);
    });

    $("#tablaFungibles tbody").on("click", "tr td img[id^='fotoFungible']", function (e) {
        e.stopPropagation();
        // Obtener el estado actual de la imagen (si está en tamaño grande o no)
        var imagenGrande = $(this).data("imagengrande") || false;

        // Verificar si la imagen está en tamaño grande
        if (imagenGrande) {
            // Cambiar tamaño a pequeño
            $(this).css("width", "100px"); // Cambia el tamaño a tu preferencia
            // Quitar sombreado al retirar el ratón de la imagen
            $(this).css("box-shadow", "none");
        } else {
            // Cambiar tamaño a grande
            $(this).css("width", "300px"); // Cambia el tamaño a tu preferencia
            // Agregar sombreado al pasar el ratón sobre la imagen
            $(this).css("box-shadow", "0 0 10px rgba(0, 0, 0, 0.5)");
        }

        // Alternar el estado del tamaño de la imagen
        imagenGrande = !imagenGrande;

        // Actualizar el estado de la imagen en el atributo de datos
        $(this).data("imagengrande", imagenGrande);

        // Agregar transición para suavizar el cambio de tamaño
        $(this).css("transition", "width 0.3s");
    });

    $("#filasFormulario #columnaFotoFungible #imgFungible").on("click", function () {
        // Obtener el estado actual de la imagen (si está en tamaño grande o no)
        var imagenGrande = $(this).data("imagengrande") || false;

        // Verificar si la imagen está en tamaño grande
        if (imagenGrande) {
            // Cambiar tamaño a pequeño
            $(this).css("width", "100px"); // Cambia el tamaño a tu preferencia
            // Quitar sombreado al retirar el ratón de la imagen
            $(this).css("box-shadow", "none");
        } else {
            // Cambiar tamaño a grande
            $(this).css("width", "300px"); // Cambia el tamaño a tu preferencia
            // Agregar sombreado al pasar el ratón sobre la imagen
            $(this).css("box-shadow", "0 0 10px rgba(0, 0, 0, 0.5)");
        }

        // Alternar el estado del tamaño de la imagen
        imagenGrande = !imagenGrande;

        // Actualizar el estado de la imagen en el atributo de datos
        $(this).data("imagengrande", imagenGrande);

        // Agregar transición para suavizar el cambio de tamaño
        $(this).css("transition", "width 0.3s");
    });

    $('#modalFungibles').on('hidden.bs.modal', function () {
        // Cambiar el valor de imagenGrande a false
        $("#filasFormulario #columnaFotoFungible #imgFungible").data("imagengrande", false);
        localStorage.removeItem('id');
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
        // Cambiar tamaño a pequeño
        $("#filasFormulario #columnaFotoFungible #imgFungible").css("width", "100px"); // Cambia el tamaño a tu preferencia
        // Quitar sombreado al cambiar el tamaño a pequeño
        $("#filasFormulario #columnaFotoFungible #imgFungible").css("box-shadow", "none");
        if (accion === 'Agregar') {
            // Cambiar el texto del título del modal
            $(".modal-title").text("Agregar fungible");
            if (usuario !== null) {
                if (rol === 1) {
                    $("#titulo").hide();
                    $("#titulo").text("");

                    $("#filasFormulario #columnaNumFungible #txtNumFungible").val(ultimoNumFungible);
                    $("#filasFormulario #columnaMarcaFungible #txtMarcaFungible").val("");
                    $("#filasFormulario #columnaModeloFungible #txtModeloFungible").val("");
                    $("#filasFormulario #columnaTamanyo #txtTamanyo").val("");
                    $("#filasFormulario #columnaCantidad .input-group input").prop("disabled", false);
                    $("#filasFormulario #columnaCantidad #txtCantidad").val(0);
                    $("#filasFormulario #columnaEquipos #selectEquipos").val("");
                    $("#filasFormulario #columnaHerramientas #selectHerramientas").val("");
                    $("#filasFormulario #columnaFotoFungible #inputFotoFungible").attr("src", "");
                    $("#filasFormulario #columnaFotoFungible #imgFungible").attr("src", "#");
                    $("#filasFormulario #columnaFotoFungible #txtFotoFungible").val("");

                    $("#filasFormulario #columnaMarcaFungible #txtMarcaFungible").prop("readonly", false);
                    $("#filasFormulario #columnaModeloFungible #txtModeloFungible").prop("readonly", false);
                    $("#filasFormulario #columnaTamanyo #txtTamanyo").prop("readonly", false);
                    $("#filasFormulario #columnaCantidad #txtCantidad").prop("disabled", false);
                    $("#filasFormulario #columnaEquipos #selectEquipos").prop("disabled", false);
                    $("#filasFormulario #columnaHerramientas #selectHerramientas").prop("disabled", false);
                    $("#filasFormulario #columnaFotoFungible #inputFotoFungible").prop("disabled", false);
                    $("#filasFormulario #columnaFotoFungible #inputFotoFungible").prop("required", true);

                    // Poner visibles los campos
                    $("#filasFormulario").show();

                    $("[name='btnAgregar']").show();
                    $("[name='btnAgregar']").prop("disabled", false);
                    $("[name='btnEditar']").hide();
                    $("[name='btnEditar']").prop("disabled", true);
                    $("[name='btnEliminar']").hide();
                    $("[name='btnEliminar']").prop("disabled", true);
                } else if (rol === 2) {
                    $("#titulo").show();
                    $("#titulo").text("Para agregar un fungible debes ser administrador.");

                    $("#filasFormulario #columnaNumFungible #txtNumFungible").val(ultimoNumFungible);
                    $("#filasFormulario #columnaMarcaFungible #txtMarcaFungible").val("");
                    $("#filasFormulario #columnaModeloFungible #txtModeloFungible").val("");
                    $("#filasFormulario #columnaTamanyo #txtTamanyo").val("");
                    $("#filasFormulario #columnaCantidad .input-group input").prop("disabled", true);
                    $("#filasFormulario #columnaCantidad #txtCantidad").val(0);
                    $("#filasFormulario #columnaEquipos #selectEquipos").val("");
                    $("#filasFormulario #columnaHerramientas #selectHerramientas").val("");
                    $("#filasFormulario #columnaFotoFungible #inputFotoFungible").attr("src", "");
                    $("#filasFormulario #columnaFotoFungible #imgFungible").attr("src", "#");
                    $("#filasFormulario #columnaFotoFungible #txtFotoFungible").val("");

                    $("#filasFormulario #columnaMarcaFungible #txtMarcaFungible").prop("readonly", true);
                    $("#filasFormulario #columnaModeloFungible #txtModeloFungible").prop("readonly", true);
                    $("#filasFormulario #columnaTamanyo #txtTamanyo").prop("readonly", true);
                    $("#filasFormulario #columnaCantidad #txtCantidad").prop("disabled", true);
                    $("#filasFormulario #columnaEquipos #selectEquipos").prop("disabled", true);
                    $("#filasFormulario #columnaHerramientas #selectHerramientas").prop("disabled", true);
                    $("#filasFormulario #columnaFotoFungible #inputFotoFungible").prop("disabled", true);
                    $("#filasFormulario #columnaFotoFungible #inputFotoFungible").prop("required", true);

                    // Poner invisibles los campos
                    $("#filasFormulario").hide();

                    $("[name='btnAgregar']").hide();
                    $("[name='btnAgregar']").prop("disabled", true);
                    $("[name='btnEditar']").hide();
                    $("[name='btnEditar']").prop("disabled", true);
                    $("[name='btnEliminar']").hide();
                    $("[name='btnEliminar']").prop("disabled", true);
                }
            } else {
                $("#titulo").show();
                $("#titulo").text("Para agregar un fungible debes iniciar sesión.");

                $("#filasFormulario #columnaNumFungible #txtNumFungible").val(ultimoNumFungible);
                $("#filasFormulario #columnaMarcaFungible #txtMarcaFungible").val("");
                $("#filasFormulario #columnaModeloFungible #txtModeloFungible").val("");
                $("#filasFormulario #columnaTamanyo #txtTamanyo").val("");
                $("#filasFormulario #columnaCantidad .input-group input").prop("disabled", true);
                $("#filasFormulario #columnaCantidad #txtCantidad").val(0);
                $("#filasFormulario #columnaEquipos #selectEquipos").val("");
                $("#filasFormulario #columnaHerramientas #selectHerramientas").val("");
                $("#filasFormulario #columnaFotoFungible #inputFotoFungible").attr("src", "");
                $("#filasFormulario #columnaFotoFungible #imgFungible").attr("src", "#");
                $("#filasFormulario #columnaFotoFungible #txtFotoFungible").val("");

                $("#filasFormulario #columnaMarcaFungible #txtMarcaFungible").prop("readonly", true);
                $("#filasFormulario #columnaModeloFungible #txtModeloFungible").prop("readonly", true);
                $("#filasFormulario #columnaTamanyo #txtTamanyo").prop("readonly", true);
                $("#filasFormulario #columnaCantidad #txtCantidad").prop("disabled", true);
                $("#filasFormulario #columnaEquipos #selectEquipos").prop("disabled", true);
                $("#filasFormulario #columnaHerramientas #selectHerramientas").prop("disabled", true);
                $("#filasFormulario #columnaFotoFungible #inputFotoFungible").prop("disabled", true);
                $("#filasFormulario #columnaFotoFungible #inputFotoFungible").prop("required", true);

                // Poner invisibles los campos
                $("#filasFormulario").hide();

                $("[name='btnAgregar']").hide();
                $("[name='btnAgregar']").prop("disabled", true);
                $("[name='btnEditar']").hide();
                $("[name='btnEditar']").prop("disabled", true);
                $("[name='btnEliminar']").hide();
                $("[name='btnEliminar']").prop("disabled", true);
            }

            // Limpiar el valor del input file cuando se cierre el modal o se cancele la acción de agregar un equipo
            $('#modalFungibles').on('hidden.bs.modal', function () {
                $("#filasFormulario #columnaFotoFungible #inputFotoFungible").val("");
            });
        } else {
            $("#filasFormulario #columnaNumFungible #txtNumFungible").val(fila.data("idfungible"));
            $("#filasFormulario #columnaMarcaFungible #txtMarcaFungible").val(fila.data("marcafungible"));
            $("#filasFormulario #columnaModeloFungible #txtModeloFungible").val(fila.data("modelofungible"));
            $("#filasFormulario #columnaTamanyo #txtTamanyo").val(fila.data("tamanyo"));
            $("#filasFormulario #columnaCantidad #txtCantidad").val(fila.data("cantidad"));
            $("#filasFormulario #columnaEquipos #selectEquipos").val(fila.data("numequipos"));
            $("#filasFormulario #columnaHerramientas #selectHerramientas").val(fila.data("numherramientas"));
            $("#filasFormulario #columnaFotoFungible #txtFotoFungible").val(fila.data("fotofungible"));
            $("#filasFormulario #columnaFotoFungible").find("#inputFotoFungible, #labelFotoFungible #imgFungible").attr("src", contexto + "/img2/" + fila.data("fotofungible"));
            $("#filasFormulario #columnaFotoFungible #inputFotoFungible").prop("required", false);

            if (accion === 'Consultar') {
                // Cambiar el texto del título del modal
                $(".modal-title").text("Información del fungible");

                $("#filasFormulario #columnaMarcaFungible #txtMarcaFungible").prop("readonly", true);
                $("#filasFormulario #columnaModeloFungible #txtModeloFungible").prop("readonly", true);
                $("#filasFormulario #columnaTamanyo #txtTamanyo").prop("readonly", true);
                $("#filasFormulario #columnaCantidad .input-group input").prop("disabled", true);
                $("#filasFormulario #columnaEquipos #selectEquipos").prop("disabled", true);
                $("#filasFormulario #columnaHerramientas #selectHerramientas").prop("disabled", true);
                $("#filasFormulario #columnaFotoFungible #inputFotoFungible").prop("disabled", true);

                if (usuario !== null) {
                    $("#titulo").hide();
                    $("#titulo").text("");
                    // Poner visibles los campos
                    $("#filasFormulario").show();
                } else {
                    $("#titulo").show();
                    $("#titulo").text("Para ver la información del fungible debes iniciar sesión");
                    // Poner invisibles los campos
                    $("#filasFormulario").hide();
                }

                $("[name='btnAgregar']").hide();
                $("[name='btnAgregar']").prop("disabled", true);
                $("[name='btnEditar']").hide();
                $("[name='btnEditar']").prop("disabled", true);
                $("[name='btnEliminar']").hide();
                $("[name='btnEliminar']").prop("disabled", true);
            } else if (accion === 'Editar') {
                // Cambiar el texto del título del modal
                $(".modal-title").text("Editar fungible");
                $("#titulo").hide();
                $("#titulo").text("");

                if (usuario !== null) {
                    if (rol === 1) {
                        $("#filasFormulario #columnaMarcaFungible #txtMarcaFungible").prop("readonly", false);
                        $("#filasFormulario #columnaModeloFungible #txtModeloFungible").prop("readonly", false);
                        $("#filasFormulario #columnaTamanyo #txtTamanyo").prop("readonly", false);
                        $("#filasFormulario #columnaEquipos #selectEquipos").prop("disabled", false);
                        $("#filasFormulario #columnaHerramientas #selectHerramientas").prop("disabled", false);
                        $("#filasFormulario #columnaFotoFungible #inputFotoFungible").prop("disabled", false);
                    } else if (rol === 2) {
                        $("#filasFormulario #columnaMarcaFungible #txtMarcaFungible").prop("readonly", true);
                        $("#filasFormulario #columnaModeloFungible #txtModeloFungible").prop("readonly", true);
                        $("#filasFormulario #columnaTamanyo #txtTamanyo").prop("readonly", true);
                        $("#filasFormulario #columnaEquipos #selectEquipos").prop("disabled", true);
                        $("#filasFormulario #columnaHerramientas #selectHerramientas").prop("disabled", true);
                        $("#filasFormulario #columnaFotoFungible #inputFotoFungible").prop("disabled", true);
                    }

                    $("#filasFormulario #columnaCantidad .input-group input").prop("disabled", false);

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
                    $("#titulo").text("Para editar el fungible con id " + fila.data("idfungible") + " debes iniciar sesión.");

                    $("#filasFormulario #columnaMarcaFungible #txtMarcaFungible").prop("readonly", true);
                    $("#filasFormulario #columnaModeloFungible #txtModeloFungible").prop("readonly", true);
                    $("#filasFormulario #columnaTamanyo #txtTamanyo").prop("readonly", true);
                    $("#filasFormulario #columnaCantidad .input-group input").prop("disabled", true);
                    $("#filasFormulario #columnaEquipos #selectEquipos").prop("disabled", true);
                    $("#filasFormulario #columnaHerramientas #selectHerramientas").prop("disabled", true);
                    $("#filasFormulario #columnaFotoFungible #inputFotoFungible").prop("disabled", true);
                    $("#filasFormulario #columnaCantidad #txtCantidad").prop("disabled", false);
                    $("#filasFormulario .minus, #filasFormulario .plus").prop("disabled", false);

                    // Poner invisibles los campos
                    $("#filasFormulario").hide();

                    $("[name='btnAgregar']").hide();
                    $("[name='btnAgregar']").prop("disabled", true);
                    $("[name='btnEditar']").hide();
                    $("[name='btnEditar']").prop("disabled", true);
                    $("[name='btnEliminar']").hide();
                    $("[name='btnEliminar']").prop("disabled", true);
                }
            } else if (accion === 'Eliminar') {
                // Cambiar el texto del título del modal
                $(".modal-title").text("Confirmar acción");
                $("#titulo").show();

                $("#filasFormulario #columnaMarcaFungible #txtMarcaFungible").prop("readonly", true);
                $("#filasFormulario #columnaModeloFungible #txtModeloFungible").prop("readonly", true);
                $("#filasFormulario #columnaTamanyo #txtTamanyo").prop("readonly", true);
                $("#filasFormulario #columnaCantidad .input-group input").prop("disabled", true);
                $("#filasFormulario #columnaEquipos #selectEquipos").prop("disabled", true);
                $("#filasFormulario #columnaHerramientas #selectHerramientas").prop("disabled", true);
                $("#filasFormulario #columnaFotoFungible #inputFotoFungible").prop("disabled", true);

                // Poner invisibles los campos
                $("#filasFormulario").show();

                if (usuario !== null) {
                    if (rol === 1) {
                        $("#titulo").text("¿Seguro que deseas eliminar este fungible?");

                        $("[name='btnAgregar']").hide();
                        $("[name='btnAgregar']").prop("disabled", true);
                        $("[name='btnEditar']").hide();
                        $("[name='btnEditar']").prop("disabled", true);
                        $("[name='btnEliminar']").show();
                        $("[name='btnEliminar']").prop("disabled", false);
                    } else if (rol === 2) {
                        $("#titulo").text("Para eliminar el fungible con id " + fila.data("idfungible") + " debes ser administrador.");

                        $("[name='btnAgregar']").hide();
                        $("[name='btnAgregar']").prop("disabled", true);
                        $("[name='btnEditar']").hide();
                        $("[name='btnEditar']").prop("disabled", true);
                        $("[name='btnEliminar']").hide();
                        $("[name='btnEliminar']").prop("disabled", true);
                    }
                } else {
                    $("#titulo").text("Para eliminar el fungible con id " + fila.data("idfungible") + " debes iniciar sesión");

                    $("[name='btnAgregar']").hide();
                    $("[name='btnAgregar']").prop("disabled", true);
                    $("[name='btnEditar']").hide();
                    $("[name='btnEditar']").prop("disabled", true);
                    $("[name='btnEliminar']").hide();
                    $("[name='btnEliminar']").prop("disabled", true);
                }
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
