/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

/* global ultimoNumFungible, tablaFungibles */

$(document).ready(function () {
    tablaFungibles = $("#tablaFungibles").DataTable({
        language: {
            "url": "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
        },
        order: []
    });

    $("#btnAgregarFungible").on("click", function () {
        var accion = 'Agregar';
        configurarModal(null, accion);
    });

    $("#tablaFungibles tbody").on("click", "tr td .btnHerramientasAFungible", function (e) {
        e.stopPropagation(); // Detener la propagación para evitar que se active el evento de clic en la fila
        fila = obtenerFilaSeleccionada($(this).closest('tr'));
        var accion = 'AsignarHerramientasAFungible';
        configurarModal(fila, accion);
        $('#modalFungibles').modal('show');
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
            $("#filasFormulario #columnaMarcaFungible #txtMarcaFungible").prop("readonly", false);
            $("#filasFormulario #columnaModeloFungible #txtModeloFungible").prop("readonly", false);
            $("#filasFormulario #columnaTamanyo #txtTamanyo").prop("readonly", false);
            $("#filasFormulario #columnaCantidad #txtCantidad").prop("readonly", false);
            $("#filasFormulario #columnaNumFungible").show();
            $("#filasFormulario #columnaMarcaFungible").show();
            $("#filasFormulario #columnaModeloFungible").show();
            $("#filasFormulario #columnaTamanyo").show();
            $("#filasFormulario #columnaCantidad").show();
            $("#filasFormulario #columnaHerramientas #selectHerramientas").val("");
            $("#filasFormulario #columnaHerramientas").hide();

            // Poner visibles los campos
            $("#filasFormulario").show();

            $("[name='btnAgregar']").show();
            $("[name='btnAsignarHerramientasAFungible']").hide();
            $("[name='btnEditar']").hide();
            $("[name='btnEliminar']").hide();
        } else {
            $("#filasFormulario #columnaNumFungible #txtNumFungible").val(fila.data("idfungible"));
            $("#filasFormulario #columnaMarcaFungible #txtMarcaFungible").val(fila.data("marcafungible"));
            $("#filasFormulario #columnaModeloFungible #txtModeloFungible").val(fila.data("modelofungible"));
            $("#filasFormulario #columnaTamanyo #txtTamanyo").val(fila.data("tamanyo"));
            $("#filasFormulario #columnaCantidad #txtCantidad").val(fila.data("cantidad"));

            if (accion === 'AsignarHerramientasAFungible') {
                $(".modal-title").text("Asignar herramientas");
                $("#tituloEliminar").hide();

                $("#filasFormulario #columnaMarcaFungible #txtMarcaFungible").prop("readonly", true);
                $("#filasFormulario #columnaModeloFungible #txtModeloFungible").prop("readonly", true);
                $("#filasFormulario #columnaTamanyo #txtTamanyo").prop("readonly", true);
                $("#filasFormulario .minus, #filasFormulario .plus").prop("disabled", true);
                $("#filasFormulario #columnaNumFungible").show();
                $("#filasFormulario #columnaMarcaFungible").hide();
                $("#filasFormulario #columnaModeloFungible").hide();
                $("#filasFormulario #columnaTamanyo").hide();
                $("#filasFormulario #columnaCantidad").hide();
                $("#filasFormulario #columnaHerramientas #selectHerramientas").prop("required", true);
                $("#filasFormulario #columnaHerramientas #selectHerramientas").val("");
                $("#filasFormulario #columnaHerramientas").show();

                // Poner visibles los campos
                $("#filasFormulario").show();

                $("[name='btnAgregar']").hide();
                $("[name='btnAsignarHerramientasAFungible']").show();
                $("[name='btnEditar']").hide();
                $("[name='btnEliminar']").hide();
            } else if (accion === 'Consultar') {
                // Cambiar el texto del título del modal
                $(".modal-title").text("Información del equipo");
                $("#tituloEliminar").hide();

                $("#filasFormulario #columnaMarcaFungible #txtMarcaFungible").prop("readonly", true);
                $("#filasFormulario #columnaModeloFungible #txtModeloFungible").prop("readonly", true);
                $("#filasFormulario #columnaTamanyo #txtTamanyo").prop("readonly", true);
                $("#filasFormulario .minus, #filasFormulario .plus").prop("disabled", true);
                $("#filasFormulario #columnaNumFungible").show();
                $("#filasFormulario #columnaMarcaFungible").show();
                $("#filasFormulario #columnaModeloFungible").show();
                $("#filasFormulario #columnaTamanyo").show();
                $("#filasFormulario #columnaCantidad").show();
                $("#filasFormulario #columnaHerramientas").hide();

                // Poner visibles los campos
                $("#filasFormulario").show();

                $("[name='btnAgregar']").hide();
                $("[name='btnAsignarHerramientasAFungible']").hide();
                $("[name='btnEditar']").hide();
                $("[name='btnEliminar']").hide();
            } else if (accion === 'Editar') {
                // Cambiar el texto del título del modal
                $(".modal-title").text("Editar fungible");
                $("#tituloEliminar").hide();

                $("#filasFormulario #columnaMarcaFungible #txtMarcaFungible").prop("readonly", false);
                $("#filasFormulario #columnaModeloFungible #txtModeloFungible").prop("readonly", false);
                $("#filasFormulario #columnaTamanyo #txtTamanyo").prop("readonly", false);
                $("#filasFormulario .minus, #filasFormulario .plus").prop("disabled", false);
                $("#filasFormulario #columnaNumFungible").show();
                $("#filasFormulario #columnaMarcaFungible").show();
                $("#filasFormulario #columnaModeloFungible").show();
                $("#filasFormulario #columnaTamanyo").show();
                $("#filasFormulario #columnaCantidad").show();
                $("#filasFormulario #columnaHerramientas").hide();

                // Poner visibles los campos
                $("#filasFormulario").show();

                $("[name='btnAgregar']").hide();
                $("[name='btnAsignarHerramientasAFungible']").hide();
                $("[name='btnEditar']").show();
                $("[name='btnEliminar']").hide();
            } else if (accion === 'Eliminar') {
                // Cambiar el texto del título del modal
                $(".modal-title").text("Eliminar fungible");
                $("#tituloEliminar").show();

                $("#filasFormulario #columnaMarcaFungible #txtMarcaFungible").prop("readonly", true);
                $("#filasFormulario #columnaModeloFungible #txtModeloFungible").prop("readonly", true);
                $("#filasFormulario #columnaTamanyo #txtTamanyo").prop("readonly", true);
                $("#filasFormulario .minus, #filasFormulario .plus").prop("disabled", true);
                $("#filasFormulario #columnaNumFungible").hide();
                $("#filasFormulario #columnaMarcaFungible").hide();
                $("#filasFormulario #columnaModeloFungible").hide();
                $("#filasFormulario #columnaTamanyo").hide();
                $("#filasFormulario #columnaCantidad").hide();
                $("#filasFormulario #columnaHerramientas").hide();

                // Poner invisibles los campos
                $("#filasFormulario").hide();

                $("[name='btnAgregar']").hide();
                $("[name='btnAsignarHerramientasAFungible']").hide();
                $("[name='btnEditar']").hide();
                $("[name='btnEliminar']").show();
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
});
