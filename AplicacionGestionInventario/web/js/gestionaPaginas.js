/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

$(document).ready(function () {


});

// Función para configurar el modal al agregar una nueva muestra
function configurarModalAgregarEquipo() {
    // Cambiar el texto del título del modal
    $(".modal-title").text("Agregar equipo");

    // Poner visibles los campos
    $("#filasFormulario").show();

    // Mostrar el botón de guardar y ocultar los de editar y eliminar
    $("[name='btnAgregar']").show();
    $("[name='btnEditar']").hide();
}

// Configurar el modal al hacer clic en el botón "Agregar"
$("#btnAgregarEquipo").on('click', function () {
    configurarModalAgregarEquipo();
});
