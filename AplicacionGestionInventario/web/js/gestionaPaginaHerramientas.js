/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

/* global ultimoNumHerramienta, tablaHerramientas */

$(document).ready(function () {
    tablaHerramientas = $("#tablaHerramientas").DataTable({
        searching: true,
        select: false,
        responsive: true,
        language: {
            "url": "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
        },
        order: []
    });

    $("#btnAgregarHerramienta").on("click", function () {
        var accion = 'Agregar';
        configurarModal(null, accion);
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

    // Función para obtener la fila seleccionada
    function obtenerFilaSeleccionada(elemento) {
        return $(elemento).closest('tr');
    }

    function configurarModal(fila, accion) {
        if (accion === 'Agregar') {
            // Cambiar el texto del título del modal
            $(".modal-title").text("Agregar herramienta");
            $("#tituloEliminar").hide();

            $("#filasFormulario #columnaNumHerramienta #txtNumHerramienta").val(ultimoNumHerramienta);
            $("#filasFormulario #columnaMarcaHerramienta #txtMarcaHerramienta").val("");
            $("#filasFormulario #columnaModeloHerramienta #txtModeloHerramienta").val("");
            $("#filasFormulario #columnaFabricanteHerramienta #txtFabricanteHerramienta").val("");
            $("#filasFormulario #columnaFechaCompraHerramienta #txtFechaCompraHerramienta").val("");
            $("#filasFormulario #columnaEquipos #selectEquipos").val("");
            $("#filasFormulario #columnaFungibles #selectFungibles").val("");
            $("#filasFormulario #columnaMarcaHerramienta #txtMarcaHerramienta").prop("readonly", false);
            $("#filasFormulario #columnaModeloHerramienta #txtModeloHerramienta").prop("readonly", false);
            $("#filasFormulario #columnaFabricanteHerramienta #txtFabricanteHerramienta").prop("readonly", false);
            $("#filasFormulario #columnaFechaCompraHerramienta #txtFechaCompraHerramienta").prop("readonly", false);
            $("#filasFormulario #columnaEquipos #selectEquipos").prop("disabled", false);
            $("#filasFormulario #columnaFungibles #selectFungibles").prop("disabled", false);

            // Poner visibles los campos
            $("#filasFormulario").show();

            $("[name='btnAgregar']").show();
            $("[name='btnAgregar']").prop("disabled", false);
            $("[name='btnEditar']").hide();
            $("[name='btnEditar']").prop("disabled", true);
            $("[name='btnEliminar']").hide();
            $("[name='btnEliminar']").prop("disabled", true);
        } else {
            $("#filasFormulario #columnaNumHerramienta #txtNumHerramienta").val(fila.data("idherramienta"));
            $("#filasFormulario #columnaMarcaHerramienta #txtMarcaHerramienta").val(fila.data("marcaherramienta"));
            $("#filasFormulario #columnaModeloHerramienta #txtModeloHerramienta").val(fila.data("modeloherramienta"));
            $("#filasFormulario #columnaFabricanteHerramienta #txtFabricanteHerramienta").val(fila.data("fabricanteherramienta"));
            $("#filasFormulario #columnaFechaCompraHerramienta #txtFechaCompraHerramienta").val(fila.data("fechacompraherramienta"));
            $("#filasFormulario #columnaEquipos #selectEquipos").val(fila.data("numequipos"));
            $("#filasFormulario #columnaFungibles #selectFungibles").val(fila.data("numfungibles"));

            if (accion === 'Consultar') {
                // Cambiar el texto del título del modal
                $(".modal-title").text("Información de la herramienta");
                $("#tituloEliminar").hide();

                $("#filasFormulario #columnaMarcaHerramienta #txtMarcaHerramienta").prop("readonly", true);
                $("#filasFormulario #columnaModeloHerramienta #txtModeloHerramienta").prop("readonly", true);
                $("#filasFormulario #columnaFabricanteHerramienta #txtFabricanteHerramienta").prop("readonly", true);
                $("#filasFormulario #columnaFechaCompraHerramienta #txtFechaCompraHerramienta").prop("readonly", true);
                $("#filasFormulario #columnaEquipos #selectEquipos").prop("disabled", true);
                $("#filasFormulario #columnaFungibles #selectFungibles").prop("disabled", true);

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
                $(".modal-title").text("Editar herramienta");
                $("#tituloEliminar").hide();

                $("#filasFormulario #columnaMarcaHerramienta #txtMarcaHerramienta").prop("readonly", false);
                $("#filasFormulario #columnaModeloHerramienta #txtModeloHerramienta").prop("readonly", false);
                $("#filasFormulario #columnaFabricanteHerramienta #txtFabricanteHerramienta").prop("readonly", false);
                $("#filasFormulario #columnaFechaCompraHerramienta #txtFechaCompraHerramienta").prop("readonly", false);
                $("#filasFormulario #columnaEquipos #selectEquipos").prop("disabled", false);
                $("#filasFormulario #columnaFungibles #selectFungibles").prop("disabled", false);

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

                $("#filasFormulario #columnaMarcaHerramienta #txtMarcaHerramienta").prop("readonly", true);
                $("#filasFormulario #columnaModeloHerramienta #txtModeloHerramienta").prop("readonly", true);
                $("#filasFormulario #columnaFabricanteHerramienta #txtFabricanteHerramienta").prop("readonly", true);
                $("#filasFormulario #columnaFechaCompraHerramienta #txtFechaCompraHerramienta").prop("readonly", true);
                $("#filasFormulario #columnaEquipos #selectEquipos").prop("disabled", true);
                $("#filasFormulario #columnaFungibles #selectFungibles").prop("disabled", true);

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
