/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

/* global ultimoNumEquipo, tablaEquipos, cantidadEquipos, usuario, rol, contexto, tiempoInactividad */

var id = localStorage.getItem('id');

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
    if (usuario !== null) {
        // Iniciar el temporizador al cargar la página
        startInactivityTimer();

        // Agregar un evento de click al cuerpo de la página para detectar la actividad del usuario
        document.body.addEventListener("click", resetInactivityTimer);
    }
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
                        columns: ':eq(' + indiceColumnaID + '), :gt(' + indiceColumnaID + '):lt(-1)'
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
        tablaEquipos.columns.adjust().responsive.recalc();
        $("#tablaEquipos tbody tr td img[id^='fotoEquipo']").css("width", "100px");
        $("#tablaEquipos tbody tr td img[id^='fotoEquipo']").css("box-shadow", "none");
    }

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

    $("#filasFormulario #columnaFotoEquipo #inputFotoEquipo").change(function () {
        var file = this.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#imgEquipo').attr('src', e.target.result);
                $('#txtFotoEquipo').val(file.name);
            };
            reader.readAsDataURL(file);
        }
    });

    // Configurar el modal al hacer clic en el botón "Agregar"
    $("#btnAgregarEquipo").on("click", function () {
        var accion = 'Agregar';
        configurarModal(null, accion);
    });

    $("#tablaEquipos tbody").on("click", "tr td img[id^='fotoEquipo']", function (e) {
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

    $("#filasFormulario #columnaFotoEquipo #imgEquipo").on("click", function () {
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

    $('#modalEquipos').on('hidden.bs.modal', function () {
        // Cambiar el valor de imagenGrande a false
        $("#filasFormulario #columnaFotoEquipo #imgEquipo").data("imagengrande", false);
        localStorage.removeItem('id');
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
        // Cambiar tamaño a pequeño
        $("#filasFormulario #columnaFotoEquipo #imgEquipo").css("width", "100px"); // Cambia el tamaño a tu preferencia
        // Quitar sombreado al cambiar el tamaño a pequeño
        $("#filasFormulario #columnaFotoEquipo #imgEquipo").css("box-shadow", "none");
        if (accion === 'Agregar') {
            // Cambiar el texto del título del modal
            $(".modal-title").text("Agregar equipo");
            if (usuario !== null) {
                if (rol === 1) {
                    $("#titulo").hide();
                    $("#titulo").text("");

                    $("#filasFormulario #columnaNumEquipo #txtNumEquipo").val(ultimoNumEquipo);
                    $("#filasFormulario input[id^='txt']:not(#txtNumEquipo), #filasFormulario select").val("");
                    $("#filasFormulario #columnaFotoEquipo #inputFotoEquipo").attr("src", "");
                    $("#filasFormulario #columnaFotoEquipo #imgEquipo").attr("src", "#");
                    $("#filasFormulario #columnaFotoEquipo #txtFotoEquipo").val("");

                    $("#filasFormulario [id^='txt']:not(#txtNumEquipo), #filasFormulario select, #filasFormulario input[type='file']").prop({
                        "readonly": false,
                        "disabled": false
                    });

                    $("#filasFormulario #inputFotoEquipo").prop("required", true);

                    // Poner visibles los campos
                    $("#filasFormulario").show();

                    $("[name='btnAgregar']").show();
                    $("[name='btnAgregar']").prop("disabled", false);
                    $("[name='btnEditar'], [name='btnEliminar']").hide().prop("disabled", true);
                } else if (rol === 2) {
                    $("#titulo").show();
                    $("#titulo").text("Para agregar un equipo debes ser administrador");

                    $("#filasFormulario #columnaNumEquipo #txtNumEquipo").val(ultimoNumEquipo);
                    $("#filasFormulario input[id^='txt']:not(#txtNumEquipo), #filasFormulario select").val("");
                    $("#filasFormulario #columnaFotoEquipo #inputFotoEquipo").attr("src", "");
                    $("#filasFormulario #columnaFotoEquipo #imgEquipo").attr("src", "#");
                    $("#filasFormulario #columnaFotoEquipo #txtFotoEquipo").val("");

                    $("#filasFormulario [id^='txt']:not(#txtNumEquipo), #filasFormulario select, #filasFormulario input[type='file']").prop({
                        "readonly": true,
                        "disabled": true
                    });

                    $("#filasFormulario #inputFotoEquipo").prop("required", false);

                    // Poner invisibles los campos
                    $("#filasFormulario").hide();

                    $("[name='btnAgregar'], [name='btnEditar'], [name='btnEliminar']").hide().prop("disabled", true);
                }
            } else {
                $("#titulo").show();
                $("#titulo").text("Para agregar un equipo debes iniciar sesión");

                $("#filasFormulario #columnaNumEquipo #txtNumEquipo").val(ultimoNumEquipo);
                $("#filasFormulario input[id^='txt']:not(#txtNumEquipo), #filasFormulario select").val("");
                $("#filasFormulario #columnaFotoEquipo #inputFotoEquipo").attr("src", "");
                $("#filasFormulario #columnaFotoEquipo #imgEquipo").attr("src", "#");
                $("#filasFormulario #columnaFotoEquipo #txtFotoEquipo").val("");

                $("#filasFormulario [id^='txt']:not(#txtNumEquipo), #filasFormulario select, #filasFormulario input[type='file']").prop({
                    "readonly": true,
                    "disabled": true
                });

                $("#filasFormulario #inputFotoEquipo").prop("required", false);

                // Poner invisibles los campos
                $("#filasFormulario").show();

                $("[name='btnAgregar'], [name='btnEditar'], [name='btnEliminar']").hide().prop("disabled", true);
            }

            // Limpiar el valor del input file cuando se cierre el modal o se cancele la acción de agregar un equipo
            $('#modalEquipos').on('hidden.bs.modal', function () {
                $("#filasFormulario #columnaFotoEquipo #inputFotoEquipo").val("");
            });
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
            $("#filasFormulario #columnaFotoEquipo #txtFotoEquipo").val(fila.data("fotoequipo"));
            $("#filasFormulario #columnaFotoEquipo").find("#inputFotoEquipo, #labelFotoEquipo #imgEquipo").attr("src", contexto + "/img2/" + fila.data("fotoequipo"));
            $("#filasFormulario #columnaFotoEquipo #inputFotoEquipo").prop("required", false);

            if (accion === 'Consultar') {
                // Cambiar el texto del título del modal
                $(".modal-title").text("Información del equipo");

                $("#filasFormulario [id^='txt']:not(#txtNumEquipo), #filasFormulario select, #filasFormulario input[type='file']").prop({
                    "readonly": true,
                    "disabled": true
                });

                if (usuario !== null) {
                    $("#titulo").hide();
                    $("#titulo").text("");
                    // Poner visibles los campos
                    $("#filasFormulario").show();
                } else {
                    $("#titulo").show();
                    $("#titulo").text("Para ver la información del equipo debes iniciar sesión.");
                    // Poner invisibles los campos
                    $("#filasFormulario").hide();
                }

                $("[name='btnAgregar'], [name='btnEditar'], [name='btnEliminar']").hide().prop("disabled", true);
            } else if (accion === 'Editar') {
                // Cambiar el texto del título del modal
                $(".modal-title").text("Editar equipo");

                if (usuario !== null) {
                    if (rol === 1) {
                        $("#titulo").hide();
                        $("#titulo").text("");

                        $("#filasFormulario [id^='txt']:not(#txtNumEquipo), #filasFormulario select, #filasFormulario input[type='file']").prop({
                            "readonly": false,
                            "disabled": false
                        });

                        // Poner visibles los campos
                        $("#filasFormulario").show();

                        $("[name='btnAgregar'], [name='btnEliminar']").hide().prop("disabled", true);
                        $("[name='btnEditar']").show().prop("disabled", false);
                    } else {
                        $("#titulo").show();
                        $("#titulo").text("Para editar el equipo con id " + fila.data("idequipo") + " debes ser administrador.");

                        $("#filasFormulario [id^='txt']:not(#txtNumEquipo), #filasFormulario select, #filasFormulario input[type='file']").prop({
                            "readonly": true,
                            "disabled": true
                        });

                        // Poner invisibles los campos
                        $("#filasFormulario").hide();

                        $("[name='btnAgregar'], [name='btnEditar'], [name='btnEliminar']").hide().prop("disabled", true);
                    }
                } else {
                    $("#titulo").show();
                    $("#titulo").text("Para editar el equipo con id " + fila.data("idequipo") + " debes iniciar sesión.");

                    $("#filasFormulario [id^='txt']:not(#txtNumEquipo), #filasFormulario select, #filasFormulario input[type='file']").prop({
                        "readonly": true,
                        "disabled": true
                    });

                    // Poner invisibles los campos
                    $("#filasFormulario").hide();

                    $("[name='btnAgregar'], [name='btnEditar'], [name='btnEliminar']").hide().prop("disabled", true);
                }
            } else if (accion === 'Eliminar') {
                // Cambiar el texto del título del modal
                $(".modal-title").text("Confirmar acción");
                $("#titulo").show();

                $("#filasFormulario [id^='txt']:not(#txtNumEquipo), #filasFormulario select, #filasFormulario input[type='file']").prop({
                    "readonly": true,
                    "disabled": true
                });

                // Poner invisibles los campos
                $("#filasFormulario").hide();

                if (usuario !== null) {
                    if (rol === 1) {
                        $("#titulo").text("¿Seguro que deseas eliminar este equipo?");
                        $("[name='btnAgregar'], [name='btnEditar']").hide().prop("disabled", true);
                        $("[name='btnEliminar']").show().prop("disabled", false);
                    } else if (rol === 2) {
                        $("#titulo").text("Para eliminar el equipo con id " + fila.data("idequipo") + " debes ser administrador.");
                        $("[name='btnAgregar'], [name='btnEditar'], [name='btnEliminar']").hide().prop("disabled", true);
                    }
                } else {
                    $("#titulo").text("Para eliminar el equipo con id " + fila.data("idequipo") + " debes iniciar sesión.");
                    $("[name='btnAgregar'], [name='btnEditar'], [name='btnEliminar']").hide().prop("disabled", true);
                }
            }
        }
    }
});