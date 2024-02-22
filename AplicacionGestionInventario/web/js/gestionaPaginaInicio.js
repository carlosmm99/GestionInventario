/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

/* global toastr */

window.onload = function () {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'ObtenerEquiposYFungibles', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                var equipos = data.equipos;
                var fungibles = data.fungibles;
                var hoy = new Date();
                function mostrarToastsSecuencialmente(toasts, index) {
                    if (index < toasts.length) {
                        var toast = toasts[index];
                        mostrarToast(toast.mensaje, toast.tipo, toast.toastClass);
                        setTimeout(function () {
                            mostrarToastsSecuencialmente(toasts, index + 1);
                        }, 2000); // Cambia este valor si deseas un retraso diferente entre cada toast
                    }
                }

                function mostrarToast(mensaje, tipo, toastClass) {
                    var titulo = '';
                    if (tipo === 'warning') {
                        if (toastClass === 'first-level-warning-toast') {
                            titulo = '1ª advertencia';
                        } else if (toastClass === 'second-level-warning-toast') {
                            titulo = '2ª advertencia';
                        }
                    } else if (tipo === 'error') {
                        titulo = 'Error';
                    }

                    toastr[tipo](mensaje, titulo, {
                        toastClass: toastClass
                    });
                }

                function formatearFecha(fechaOriginal) {
                    // Expresión regular para extraer el mes, el día y el año
                    var regex = /([a-z]{3})\. (\d{1,2}), (\d{4})/i;
                    var match = regex.exec(fechaOriginal);
                    if (match) {
                        // Mapear el mes abreviado a un nombre completo de mes
                        var meses = {
                            "ene": "January", "feb": "February", "mar": "March", "abr": "April", "may": "May", "jun": "June",
                            "jul": "July", "ago": "August", "sep": "September", "oct": "October", "nov": "November", "dic": "December"
                        };
                        var month = meses[match[1].toLowerCase()];
                        var day = match[2];
                        var year = match[3];
                        // Formatear la fecha
                        return month + ' ' + day + ', ' + year;
                    } else {
                        // Si no se puede analizar la fecha, devolver la cadena original
                        return fechaOriginal;
                    }
                }

                var toasts = [];
                equipos.forEach(function (equipo) {
                    var fechaProximoMantenimiento = formatearFecha(equipo.fechaProximoMantenimiento);
                    var fechaProximaCalibracion = formatearFecha(equipo.fechaProximaCalibracion);
                    var tiempoRestanteProximoMantenimiento = new Date(fechaProximoMantenimiento).getTime() - hoy.getTime();
                    var tiempoRestanteProximaCalibracion = new Date(fechaProximaCalibracion).getTime() - hoy.getTime();
                    var mesesRestantesProximoMantenimiento = tiempoRestanteProximoMantenimiento / (1000 * 60 * 60 * 24 * 30);
                    var mesesRestantesProximaCalibracion = tiempoRestanteProximaCalibracion / (1000 * 60 * 60 * 24 * 30);
                    if (mesesRestantesProximoMantenimiento < 6 && mesesRestantesProximoMantenimiento >= 3) {
                        toasts.push({
                            mensaje: 'El equipo ' + equipo.nombre + ' necesita mantenimiento en menos de 6 meses.',
                            tipo: 'warning',
                            toastClass: 'first-level-warning-toast'
                        });
                    } else if (mesesRestantesProximoMantenimiento < 3 && mesesRestantesProximoMantenimiento >= 0) {
                        toasts.push({
                            mensaje: 'El equipo ' + equipo.nombre + ' necesita mantenimiento en menos de 3 meses.',
                            tipo: 'warning',
                            toastClass: 'second-level-warning-toast'
                        });
                    } else if (mesesRestantesProximoMantenimiento < 0) {
                        toasts.push({
                            mensaje: 'El equipo ' + equipo.nombre + ' necesita mantenimiento urgente.',
                            tipo: 'error',
                            toastClass: 'error-toast'
                        });
                    }

                    if (mesesRestantesProximaCalibracion < 6 && mesesRestantesProximaCalibracion >= 3) {
                        toasts.push({
                            mensaje: 'El equipo ' + equipo.nombre + ' necesita calibración en menos de 6 meses.',
                            tipo: 'warning',
                            toastClass: 'first-level-warning-toast'
                        });
                    } else if (mesesRestantesProximaCalibracion < 3 && mesesRestantesProximaCalibracion >= 0) {
                        toasts.push({
                            mensaje: 'El equipo ' + equipo.nombre + ' necesita calibración en menos de 3 meses.',
                            tipo: 'warning',
                            toastClass: 'second-level-warning-toast'
                        });
                    } else if (mesesRestantesProximaCalibracion < 0) {
                        toasts.push({
                            mensaje: 'El equipo ' + equipo.nombre + ' necesita calibración urgente.',
                            tipo: 'error',
                            toastClass: 'error-toast'
                        });
                    }
                });
                fungibles.forEach(function (fungible) {
                    var cantidad = fungible.cantidad;
                    if (cantidad <= 10 && cantidad > 5) {
                        toasts.push({
                            mensaje: 'El fungible ' + fungible.marca + ' ' + fungible.modelo + ' tiene 10 unidades o menos.',
                            tipo: 'warning',
                            toastClass: 'first-level-warning-toast'
                        });
                    } else if (cantidad <= 5 && cantidad > 0) {
                        toasts.push({
                            mensaje: 'El fungible ' + fungible.marca + ' ' + fungible.modelo + ' tiene 5 unidades o menos.',
                            tipo: 'warning',
                            toastClass: 'second-level-warning-toast'
                        });
                    } else if (cantidad === 0) {
                        toasts.push({
                            mensaje: 'El fungible ' + fungible.marca + ' ' + fungible.modelo + ' no tiene unidades.',
                            tipo: 'error',
                            toastClass: 'error-toast'
                        });
                    }
                });
                mostrarToastsSecuencialmente(toasts, 0);
            } else {
                console.error('Hubo un error en la solicitud.');
            }
        }
    };
    xhr.send();
};
