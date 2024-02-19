/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

/* global toastr */

window.onload = function () {
    // Hacer la solicitud AJAX POST al Servlet
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'ObtenerEquiposYFungibles', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // La respuesta del servidor está en xhr.responseText
                var data = JSON.parse(xhr.responseText);

                // Manejar los datos recibidos
                var equipos = data.equipos;
                var fungibles = data.fungibles;
                var hoy = new Date(); // Obtener la fecha actual

                for (var i = 0; i < equipos.length; i++) {
                    var equipo = equipos[i];
                    var fechaProximoMantenimiento = new Date(equipo.fechaProximoMantenimiento);
                    var fechaProximaCalibracion = new Date(equipo.fechaProximaCalibracion);
                    var tiempoRestanteProximoMantenimiento = fechaProximoMantenimiento.getTime() - hoy.getTime(); // Calcular el tiempo restante en milisegundos
                    var tiempoRestanteProximaCalibracion = fechaProximaCalibracion.getTime() - hoy.getTime(); // Calcular el tiempo restante en milisegundos

                    // Convertir el tiempo restante a meses
                    var mesesRestantesProximoMantenimiento = tiempoRestanteProximoMantenimiento / (1000 * 60 * 60 * 24 * 30); // 1000 ms * 60 s * 60 min * 24 h * 30 días (aproximadamente)

                    // Mostrar notificaciones según el tiempo restante
                    if (mesesRestantesProximoMantenimiento < 6 && mesesRestantesProximoMantenimiento >= 3) {
                        toastr.warning('El equipo ' + equipo.nombre + ' necesita mantenimiento en menos de 6 meses.', 'Advertencia', {
                            toastClass: 'first-level-warning-toast'
                        });
                    } else if (mesesRestantesProximoMantenimiento < 3 && mesesRestantesProximoMantenimiento >= 0) {
                        toastr.warning('El equipo ' + equipo.nombre + ' necesita mantenimiento en menos de 3 meses.', 'Advertencia', {
                            toastClass: 'second-level-warning-toast'
                        });
                    } else if (mesesRestantesProximoMantenimiento < 0) {
                        toastr.error('El equipo ' + equipo.nombre + ' necesita mantenimiento urgente.', 'Error', {
                            toastClass: 'error-toast'
                        });
                    }

                    // Convertir el tiempo restante a meses
                    var mesesRestantesProximaCalibracion = tiempoRestanteProximaCalibracion / (1000 * 60 * 60 * 24 * 30); // 1000 ms * 60 s * 60 min * 24 h * 30 días (aproximadamente)

                    // Mostrar notificaciones según el tiempo restante
                    if (mesesRestantesProximaCalibracion < 6 && mesesRestantesProximaCalibracion >= 3) {
                        toastr.warning('El equipo ' + equipo.nombre + ' necesita calibración en menos de 6 meses.', 'Advertencia', {
                            toastClass: 'first-level-warning-toast'
                        });
                    } else if (mesesRestantesProximaCalibracion < 3 && mesesRestantesProximaCalibracion >= 0) {
                        toastr.warning('El equipo ' + equipo.nombre + ' necesita calibración en menos de 3 meses.', 'Advertencia', {
                            toastClass: 'second-level-warning-toast'
                        });
                    } else if (mesesRestantesProximaCalibracion < 0) {
                        toastr.error('El equipo ' + equipo.nombre + ' necesita calibración urgente.', 'Error', {
                            toastClass: 'error-toast'
                        });
                    }
                }

                for (var i = 0; i < fungibles.length; i++) {
                    var fungible = fungibles[i];
                    var cantidad = fungible.cantidad;

                    // Mostrar notificaciones según la cantidad
                    if (cantidad <= 10 && cantidad > 5) {
                        toastr.warning('El fungible con id ' + fungible.id + ' tiene 10 unidades o menos.', 'Advertencia', {
                            toastClass: 'first-level-warning-toast'
                        });
                    } else if (cantidad <= 5 && cantidad > 0) {
                        toastr.warning('El fungible con id ' + fungible.id + ' tiene 5 unidades o menos.', 'Advertencia', {
                            toastClass: 'second-level-warning-toast'
                        });
                    } else if (cantidad === 0) {
                        toastr.error('El fungible con id ' + fungible.id + ' no tiene unidades.', 'Error', {
                            toastClass: 'error-toast'
                        });
                    }
                }
            } else {
                console.error('Hubo un error en la solicitud.');
            }
        }
    };

    xhr.send();
};
