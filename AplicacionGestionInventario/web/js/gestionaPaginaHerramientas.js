/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

/* global ultimoNumHerramienta, tablaHerramientas, cantidadHerramientas, contexto, tiempoInactividad */

// Agregar un temporizador para detectar la inactividad del usuario
var inactivityTimer;

function startInactivityTimer() {
    inactivityTimer = setTimeout(function () {
        // Mostrar un mensaje emergente de sesión expirada
        alert("La sesión va a expirar debido a la inactividad");
        // Aquí puedes redirigir al usuario a la página de inicio de sesión, por ejemplo
        window.location.href = contexto;
    }, tiempoInactividad * 1000); // Convertir el tiempo de inactividad de segundos a milisegundos
}

function resetInactivityTimer() {
    // Reiniciar el temporizador cada vez que haya actividad del usuario
    clearTimeout(inactivityTimer);
    startInactivityTimer();
}

$(document).ready(function () {
    if (usuario !== null) {
        // Iniciar el temporizador al cargar la página
        startInactivityTimer();

        // Agregar un evento de click al cuerpo de la página para detectar la actividad del usuario
        document.body.addEventListener("click", resetInactivityTimer);
    }
    $.fn.DataTable.ext.classes.sPageButton = 'page-link'; // Change Pagination Button Class
    var indiceColumnaMarca = $("#tablaHerramientas thead th#celdaEncabezadoMarcaFungible").index();
    tablaHerramientas = $("#tablaHerramientas").DataTable({
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
                        for (var row = 2; row <= cantidadHerramientas; row += 2) {
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
        tablaHerramientas.columns.adjust().responsive.recalc();
    }

    $("#filasFormulario #columnaFotoHerramienta #inputFotoHerramienta").change(function () {
        var file = this.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#imgHerramienta').attr('src', e.target.result);
                $('#txtFotoHerramienta').val(file.name);
            };
            reader.readAsDataURL(file);
        }
    });

    $("#btnAgregarHerramienta").on("click", function () {
        var accion = 'Agregar';
        configurarModal(null, accion);
    });

    $("#tablaHerramientas tbody").on("click", "tr td img[id^='fotoHerramienta']", function (e) {
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

    $("#filasFormulario #columnaFotoHerramienta #imgHerramienta").on("click", function () {
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

    $('#modalHerramientas').on('hidden.bs.modal', function () {
        // Cambiar el valor de imagenGrande a false
        $("#filasFormulario #columnaFotoHerramienta #imgHerramienta").data("imagengrande", false);
    });

    $("#tablaHerramientas tbody").on("click", "tr td:not(:first-child)", function () {
        fila = obtenerFilaSeleccionada($(this).closest('tr'));
        var accion = 'Consultar';
        configurarModal(fila, accion);
        $('#modalHerramientas').modal('show');
    });

    $("#tablaHerramientas tbody").on("click", "tr td .btnEditar", function (e) {
        e.stopPropagation(); // Detener la propagación para evitar que se active el evento de clic en la fila
        fila = obtenerFilaSeleccionada($(this).closest('tr'));
        var accion = 'Editar';
        configurarModal(fila, accion);
        $('#modalHerramientas').modal('show');
    });

    $("#tablaHerramientas tbody").on("click", "tr td .btnEliminar", function (e) {
        e.stopPropagation(); // Detener la propagación para evitar que se active el evento de clic en la fila
        fila = obtenerFilaSeleccionada($(this).closest('tr'));
        var accion = 'Eliminar';
        configurarModal(fila, accion);
        $('#modalHerramientas').modal('show');
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
        tablaHerramientas.columns.adjust().responsive.recalc();
        $("#tablaHerramientas tbody tr td img[id^='fotoHerramienta']").css("width", "100px");
        $("#tablaHerramientas tbody tr td img[id^='fotoHerramienta']").css("box-shadow", "none");
    }

    // Función para obtener la fila seleccionada
    function obtenerFilaSeleccionada(elemento) {
        return $(elemento).closest('tr');
    }

    function configurarModal(fila, accion) {
        // Cambiar tamaño a pequeño
        $("#filasFormulario #columnaFotoHerramienta #imgHerramienta").css("width", "100px"); // Cambia el tamaño a tu preferencia
        // Quitar sombreado al cambiar el tamaño a pequeño
        $("#filasFormulario #columnaFotoHerramienta #imgHerramienta").css("box-shadow", "none");
        if (accion === 'Agregar') {
            // Cambiar el texto del título del modal
            $(".modal-title").text("Agregar herramienta");
            if (usuario !== null) {
                if (rol === 1) {
                    $("#titulo").hide();
                    $("#titulo").text("");

                    $("#filasFormulario #columnaNumHerramienta #txtNumHerramienta").val(ultimoNumHerramienta);
                    $("#filasFormulario #columnaMarcaHerramienta #txtMarcaHerramienta").val("");
                    $("#filasFormulario #columnaModeloHerramienta #txtModeloHerramienta").val("");
                    $("#filasFormulario #columnaFabricanteHerramienta #txtFabricanteHerramienta").val("");
                    $("#filasFormulario #columnaFechaCompraHerramienta #txtFechaCompraHerramienta").val("");
                    $("#filasFormulario #columnaEquipos #selectEquipos").val("");
                    $("#filasFormulario #columnaFungibles #selectFungibles").val("");
                    $("#filasFormulario #columnaFotoHerramienta #inputFotoHerramienta").attr("src", "");
                    $("#filasFormulario #columnaFotoHerramienta #imgHerramienta").attr("src", "#");
                    $("#filasFormulario #columnaFotoHerramienta #txtFotoHerramienta").val("");

                    $("#filasFormulario #columnaMarcaHerramienta #txtMarcaHerramienta").prop("readonly", false);
                    $("#filasFormulario #columnaModeloHerramienta #txtModeloHerramienta").prop("readonly", false);
                    $("#filasFormulario #columnaFabricanteHerramienta #txtFabricanteHerramienta").prop("readonly", false);
                    $("#filasFormulario #columnaFechaCompraHerramienta #txtFechaCompraHerramienta").prop("readonly", false);
                    $("#filasFormulario #columnaEquipos #selectEquipos").prop("disabled", false);
                    $("#filasFormulario #columnaFungibles #selectFungibles").prop("disabled", false);
                    $("#filasFormulario #columnaFotoHerramienta #inputFotoHerramienta").prop("disabled", false);
                    $("#filasFormulario #columnaFotoHerramienta #inputFotoHerramienta").prop("required", true);

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
                    $("#titulo").text("Para agregar una herramienta debes ser administrador.");

                    $("#filasFormulario #columnaNumHerramienta #txtNumHerramienta").val(ultimoNumHerramienta);
                    $("#filasFormulario #columnaMarcaHerramienta #txtMarcaHerramienta").val("");
                    $("#filasFormulario #columnaModeloHerramienta #txtModeloHerramienta").val("");
                    $("#filasFormulario #columnaFabricanteHerramienta #txtFabricanteHerramienta").val("");
                    $("#filasFormulario #columnaFechaCompraHerramienta #txtFechaCompraHerramienta").val("");
                    $("#filasFormulario #columnaEquipos #selectEquipos").val("");
                    $("#filasFormulario #columnaFungibles #selectFungibles").val("");
                    $("#filasFormulario #columnaFotoHerramienta #inputFotoHerramienta").attr("src", "");
                    $("#filasFormulario #columnaFotoHerramienta #imgHerramienta").attr("src", "#");
                    $("#filasFormulario #columnaFotoHerramienta #txtFotoHerramienta").val("");

                    $("#filasFormulario #columnaMarcaHerramienta #txtMarcaHerramienta").prop("readonly", true);
                    $("#filasFormulario #columnaModeloHerramienta #txtModeloHerramienta").prop("readonly", true);
                    $("#filasFormulario #columnaFabricanteHerramienta #txtFabricanteHerramienta").prop("readonly", true);
                    $("#filasFormulario #columnaFechaCompraHerramienta #txtFechaCompraHerramienta").prop("readonly", true);
                    $("#filasFormulario #columnaEquipos #selectEquipos").prop("disabled", true);
                    $("#filasFormulario #columnaFungibles #selectFungibles").prop("disabled", true);
                    $("#filasFormulario #columnaFotoHerramienta #inputFotoHerramienta").prop("disabled", true);
                    $("#filasFormulario #columnaFotoHerramienta #inputFotoHerramienta").prop("required", true);

                    // Poner visibles los campos
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
                $("#titulo").text("Para agregar una herramienta debes iniciar sesión.");

                $("#filasFormulario #columnaNumHerramienta #txtNumHerramienta").val(ultimoNumHerramienta);
                $("#filasFormulario #columnaMarcaHerramienta #txtMarcaHerramienta").val("");
                $("#filasFormulario #columnaModeloHerramienta #txtModeloHerramienta").val("");
                $("#filasFormulario #columnaFabricanteHerramienta #txtFabricanteHerramienta").val("");
                $("#filasFormulario #columnaFechaCompraHerramienta #txtFechaCompraHerramienta").val("");
                $("#filasFormulario #columnaEquipos #selectEquipos").val("");
                $("#filasFormulario #columnaFungibles #selectFungibles").val("");
                $("#filasFormulario #columnaFotoHerramienta #inputFotoHerramienta").attr("src", "");
                $("#filasFormulario #columnaFotoHerramienta #imgHerramienta").attr("src", "#");
                $("#filasFormulario #columnaFotoHerramienta #txtFotoHerramienta").val("");

                $("#filasFormulario #columnaMarcaHerramienta #txtMarcaHerramienta").prop("readonly", true);
                $("#filasFormulario #columnaModeloHerramienta #txtModeloHerramienta").prop("readonly", true);
                $("#filasFormulario #columnaFabricanteHerramienta #txtFabricanteHerramienta").prop("readonly", true);
                $("#filasFormulario #columnaFechaCompraHerramienta #txtFechaCompraHerramienta").prop("readonly", true);
                $("#filasFormulario #columnaEquipos #selectEquipos").prop("disabled", true);
                $("#filasFormulario #columnaFungibles #selectFungibles").prop("disabled", true);
                $("#filasFormulario #columnaFotoHerramienta #inputFotoHerramienta").prop("disabled", true);
                $("#filasFormulario #columnaFotoHerramienta #inputFotoHerramienta").prop("required", true);

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
            $("#filasFormulario #columnaNumHerramienta #txtNumHerramienta").val(fila.data("idherramienta"));
            $("#filasFormulario #columnaMarcaHerramienta #txtMarcaHerramienta").val(fila.data("marcaherramienta"));
            $("#filasFormulario #columnaModeloHerramienta #txtModeloHerramienta").val(fila.data("modeloherramienta"));
            $("#filasFormulario #columnaFabricanteHerramienta #txtFabricanteHerramienta").val(fila.data("fabricanteherramienta"));
            $("#filasFormulario #columnaFechaCompraHerramienta #txtFechaCompraHerramienta").val(fila.data("fechacompraherramienta"));
            $("#filasFormulario #columnaEquipos #selectEquipos").val(fila.data("numequipos"));
            $("#filasFormulario #columnaFungibles #selectFungibles").val(fila.data("numfungibles"));
            $("#filasFormulario #columnaFotoHerramienta #txtFotoHerramienta").val(fila.data("fotoherramienta"));
            $("#filasFormulario #columnaFotoHerramienta").find("#inputFotoHerramienta, #labelFotoHerramienta #imgHerramienta").attr("src", contexto + "/img2/" + fila.data("fotoherramienta"));
            $("#filasFormulario #columnaFotoHerramienta #inputFotoHerramienta").prop("required", false);

            if (accion === 'Consultar') {
                // Cambiar el texto del título del modal
                $(".modal-title").text("Información de la herramienta");

                $("#filasFormulario #columnaMarcaHerramienta #txtMarcaHerramienta").prop("readonly", true);
                $("#filasFormulario #columnaModeloHerramienta #txtModeloHerramienta").prop("readonly", true);
                $("#filasFormulario #columnaFabricanteHerramienta #txtFabricanteHerramienta").prop("readonly", true);
                $("#filasFormulario #columnaFechaCompraHerramienta #txtFechaCompraHerramienta").prop("readonly", true);
                $("#filasFormulario #columnaEquipos #selectEquipos").prop("disabled", true);
                $("#filasFormulario #columnaFungibles #selectFungibles").prop("disabled", true);
                $("#filasFormulario #columnaFotoHerramienta #inputFotoHerramienta").prop("disabled", true);

                if (usuario !== null) {
                    $("#titulo").hide();
                    $("#titulo").text("");
                    // Poner visibles los campos
                    $("#filasFormulario").show();
                } else {
                    $("#titulo").show();
                    $("#titulo").text("Para ver la información de la herramienta debes iniciar sesión.");
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
                $(".modal-title").text("Editar herramienta");

                if (usuario !== null) {
                    if (rol === 1) {
                        $("#titulo").hide();
                        $("#titulo").text("");
                        $("#filasFormulario #columnaMarcaHerramienta #txtMarcaHerramienta").prop("readonly", false);
                        $("#filasFormulario #columnaModeloHerramienta #txtModeloHerramienta").prop("readonly", false);
                        $("#filasFormulario #columnaFabricanteHerramienta #txtFabricanteHerramienta").prop("readonly", false);
                        $("#filasFormulario #columnaFechaCompraHerramienta #txtFechaCompraHerramienta").prop("readonly", false);
                        $("#filasFormulario #columnaEquipos #selectEquipos").prop("disabled", false);
                        $("#filasFormulario #columnaFungibles #selectFungibles").prop("disabled", false);
                        $("#filasFormulario #columnaFotoHerramienta").find("#inputFotoHerramienta, #labelFotoHerramienta").prop("disabled", false);

                        // Poner visibles los campos
                        $("#filasFormulario").show();

                        $("[name='btnAgregar']").hide();
                        $("[name='btnAgregar']").prop("disabled", true);
                        $("[name='btnEditar']").show();
                        $("[name='btnEditar']").prop("disabled", false);
                        $("[name='btnEliminar']").hide();
                        $("[name='btnEliminar']").prop("disabled", true);
                    } else if (rol === 2) {
                        $("#titulo").show();
                        $("#titulo").text("Para editar la herramienta con id " + fila.data("idherramienta") + " debes ser administrador.");

                        $("#filasFormulario #columnaMarcaHerramienta #txtMarcaHerramienta").prop("readonly", true);
                        $("#filasFormulario #columnaModeloHerramienta #txtModeloHerramienta").prop("readonly", true);
                        $("#filasFormulario #columnaFabricanteHerramienta #txtFabricanteHerramienta").prop("readonly", true);
                        $("#filasFormulario #columnaFechaCompraHerramienta #txtFechaCompraHerramienta").prop("readonly", true);
                        $("#filasFormulario #columnaEquipos #selectEquipos").prop("disabled", true);
                        $("#filasFormulario #columnaFungibles #selectFungibles").prop("disabled", true);
                        $("#filasFormulario #columnaFotoHerramienta").find("#inputFotoHerramienta, #labelFotoHerramienta").prop("disabled", true);

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
                    $("#titulo").text("Para editar la herramienta con id " + fila.data("idherramienta") + " debes iniciar sesión.");

                    $("#filasFormulario #columnaMarcaHerramienta #txtMarcaHerramienta").prop("readonly", true);
                    $("#filasFormulario #columnaModeloHerramienta #txtModeloHerramienta").prop("readonly", true);
                    $("#filasFormulario #columnaFabricanteHerramienta #txtFabricanteHerramienta").prop("readonly", true);
                    $("#filasFormulario #columnaFechaCompraHerramienta #txtFechaCompraHerramienta").prop("readonly", true);
                    $("#filasFormulario #columnaEquipos #selectEquipos").prop("disabled", true);
                    $("#filasFormulario #columnaFungibles #selectFungibles").prop("disabled", true);
                    $("#filasFormulario #columnaFotoHerramienta").find("#inputFotoHerramienta, #labelFotoHerramienta").prop("disabled", true);

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

                $("#filasFormulario #columnaMarcaHerramienta #txtMarcaHerramienta").prop("readonly", true);
                $("#filasFormulario #columnaModeloHerramienta #txtModeloHerramienta").prop("readonly", true);
                $("#filasFormulario #columnaFabricanteHerramienta #txtFabricanteHerramienta").prop("readonly", true);
                $("#filasFormulario #columnaFechaCompraHerramienta #txtFechaCompraHerramienta").prop("readonly", true);
                $("#filasFormulario #columnaEquipos #selectEquipos").prop("disabled", true);
                $("#filasFormulario #columnaFungibles #selectFungibles").prop("disabled", true);
                $("#filasFormulario #columnaFotoHerramienta").find("#inputFotoHerramienta, #labelFotoHerramienta").prop("disabled", true);

                // Poner invisibles los campos
                $("#filasFormulario").hide();

                if (usuario !== null) {
                    if (rol === 1) {
                        $("#titulo").text("¿Seguro que deseas eliminar esta herramienta?");
                        $("[name='btnAgregar']").hide();
                        $("[name='btnAgregar']").prop("disabled", true);
                        $("[name='btnEditar']").hide();
                        $("[name='btnEditar']").prop("disabled", true);
                        $("[name='btnEliminar']").show();
                        $("[name='btnEliminar']").prop("disabled", false);
                    } else if (rol === 2) {
                        $("#titulo").text("Para eliminar la herramienta con id " + fila.data("idherramienta") + " debes ser administrador.");
                        $("[name='btnAgregar']").hide();
                        $("[name='btnAgregar']").prop("disabled", true);
                        $("[name='btnEditar']").hide();
                        $("[name='btnEditar']").prop("disabled", true);
                        $("[name='btnEliminar']").hide();
                        $("[name='btnEliminar']").prop("disabled", true);
                    }
                } else {
                    $("#titulo").text("Para eliminar la herramienta con id " + fila.data("idherramienta") + " debes iniciar sesión.");
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
