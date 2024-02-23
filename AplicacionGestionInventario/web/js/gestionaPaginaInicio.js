/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

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

                var divNotificaciones = document.getElementById("divNotificaciones");

                equipos.forEach(function (equipo) {
                    var fechaProximoMantenimiento = formatearFecha(equipo.fechaProximoMantenimiento);
                    var fechaProximaCalibracion = formatearFecha(equipo.fechaProximaCalibracion);
                    var tiempoRestanteProximoMantenimiento = new Date(fechaProximoMantenimiento).getTime() - hoy.getTime();
                    var tiempoRestanteProximaCalibracion = new Date(fechaProximaCalibracion).getTime() - hoy.getTime();
                    var mesesRestantesProximoMantenimiento = tiempoRestanteProximoMantenimiento / (1000 * 60 * 60 * 24 * 30);
                    var mesesRestantesProximaCalibracion = tiempoRestanteProximaCalibracion / (1000 * 60 * 60 * 24 * 30);

                    var divAlertaProximoMantenimiento = document.createElement("div");
                    divAlertaProximoMantenimiento.id = "divAlertaProximoMantenimientoEquipo" + equipo.id;
                    divNotificaciones.appendChild(divAlertaProximoMantenimiento);

                    var icono = document.createElement("img");
                    icono.style.width = "64px";
                    icono.style.height = "64px";

                    var titulo = document.createElement("h3");
                    var textoAlerta = document.createElement("p");

                    if (mesesRestantesProximoMantenimiento < 6 && mesesRestantesProximoMantenimiento >= 3) {
                        divAlertaProximoMantenimiento.style.backgroundColor = "yellow";
                        divAlertaProximoMantenimiento.style.marginBottom = "10px";
                        icono.src = contexto + "/img/warning_icon.png";
                        divAlertaProximoMantenimiento.appendChild(icono);
                        titulo.textContent = "Alerta de Mantenimiento";
                        divAlertaProximoMantenimiento.appendChild(titulo);
                        textoAlerta.textContent = "El equipo " + equipo.nombre + " necesita mantenimiento en menos de 6 meses.";
                        divAlertaProximoMantenimiento.appendChild(textoAlerta);
                    } else if (mesesRestantesProximoMantenimiento < 3 && mesesRestantesProximoMantenimiento >= 0) {
                        divAlertaProximoMantenimiento.style.backgroundColor = "orange";
                        divAlertaProximoMantenimiento.style.marginBottom = "10px";
                        icono.src = contexto + "/img/warning_icon.png";
                        divAlertaProximoMantenimiento.appendChild(icono);
                        titulo.textContent = "Alerta de Mantenimiento";
                        divAlertaProximoMantenimiento.appendChild(titulo);
                        textoAlerta.textContent = "El equipo " + equipo.nombre + " necesita mantenimiento en menos de 3 meses.";
                        divAlertaProximoMantenimiento.appendChild(textoAlerta);
                    } else if (mesesRestantesProximoMantenimiento < 0) {
                        divAlertaProximoMantenimiento.style.backgroundColor = "red";
                        divAlertaProximoMantenimiento.style.marginBottom = "10px";
                        icono.src = contexto + "/img/warning_shield_icon.png";
                        divAlertaProximoMantenimiento.appendChild(icono);
                        titulo.textContent = "Alerta de Mantenimiento Urgente";
                        divAlertaProximoMantenimiento.appendChild(titulo);
                        textoAlerta.textContent = "El equipo " + equipo.nombre + " necesita mantenimiento urgente.";
                        divAlertaProximoMantenimiento.appendChild(textoAlerta);
                    }

                    var divAlertaProximaCalibracion = document.createElement("div");
                    divAlertaProximaCalibracion.id = "divAlertaProximaCalibracionEquipo" + equipo.id;
                    divNotificaciones.appendChild(divAlertaProximaCalibracion);

                    if (mesesRestantesProximaCalibracion < 6 && mesesRestantesProximaCalibracion >= 3) {
                        divAlertaProximaCalibracion.style.backgroundColor = "yellow";
                        divAlertaProximaCalibracion.style.marginBottom = "10px";
                        icono.src = contexto + "/img/warning_icon.png";
                        divAlertaProximaCalibracion.appendChild(icono);
                        titulo.textContent = "Alerta de Calibración";
                        divAlertaProximaCalibracion.appendChild(titulo);
                        textoAlerta.textContent = "El equipo " + equipo.nombre + " necesita calibración en menos de 6 meses.";
                        divAlertaProximaCalibracion.appendChild(textoAlerta);
                    } else if (mesesRestantesProximaCalibracion < 3 && mesesRestantesProximaCalibracion >= 0) {
                        divAlertaProximaCalibracion.style.backgroundColor = "orange";
                        divAlertaProximaCalibracion.style.marginBottom = "10px";
                        icono.src = contexto + "/img/warning_icon.png";
                        divAlertaProximaCalibracion.appendChild(icono);
                        titulo.textContent = "Alerta de Calibración";
                        divAlertaProximaCalibracion.appendChild(titulo);
                        textoAlerta.textContent = "El equipo " + equipo.nombre + " necesita calibración en menos de 3 meses.";
                        divAlertaProximaCalibracion.appendChild(textoAlerta);
                    } else if (mesesRestantesProximaCalibracion < 0) {
                        divAlertaProximaCalibracion.style.backgroundColor = "red";
                        divAlertaProximaCalibracion.style.marginBottom = "10px";
                        icono.src = contexto + "/img/warning_shield_icon.png";
                        divAlertaProximaCalibracion.appendChild(icono);
                        titulo.textContent = "Alerta de Calibración Urgente";
                        divAlertaProximaCalibracion.appendChild(titulo);
                        textoAlerta.textContent = "El equipo " + equipo.nombre + " necesita calibración urgente.";
                        divAlertaProximaCalibracion.appendChild(textoAlerta);
                    }
                });
                fungibles.forEach(function (fungible) {
                    var cantidad = fungible.cantidad;

                    var divAlertaCantidad = document.createElement("div");
                    divAlertaCantidad.id = "divAlertaCantidadFungible" + fungible.id;
                    divNotificaciones.appendChild(divAlertaCantidad);

                    var icono = document.createElement("img");
                    icono.style.width = "64px";
                    icono.style.height = "64px";

                    var titulo = document.createElement("h3");
                    var textoAlerta = document.createElement("p");

                    if (cantidad <= 10 && cantidad > 5) {
                        divAlertaCantidad.style.backgroundColor = "yellow";
                        divAlertaCantidad.style.marginBottom = "10px";
                        icono.src = contexto + "/img/warning_icon.png";
                        divAlertaCantidad.appendChild(icono);
                        titulo.textContent = "Alerta de Cantidad";
                        divAlertaCantidad.appendChild(titulo);
                        textoAlerta.textContent = "El fungible " + fungible.id + " tiene 10 unidades o menos.";
                        divAlertaCantidad.appendChild(textoAlerta);
                    } else if (cantidad <= 5 && cantidad > 0) {
                        divAlertaCantidad.style.backgroundColor = "orange";
                        divAlertaCantidad.style.marginBottom = "10px";
                        icono.src = contexto + "/img/warning_icon.png";
                        divAlertaCantidad.appendChild(icono);
                        titulo.textContent = "Alerta de Cantidad";
                        divAlertaCantidad.appendChild(titulo);
                        textoAlerta.textContent = "El fungible " + fungible.id + " tiene 5 unidades o menos.";
                        divAlertaCantidad.appendChild(textoAlerta);
                    } else if (cantidad === 0) {
                        divAlertaCantidad.style.backgroundColor = "red";
                        divAlertaCantidad.style.marginBottom = "10px";
                        icono.src = contexto + "/img/warning_shield_icon.png";
                        divAlertaCantidad.appendChild(icono);
                        titulo.textContent = "Alerta de Cantidad Urgente";
                        divAlertaCantidad.appendChild(titulo);
                        textoAlerta.textContent = "El fungible " + fungible.id + " no tiene unidades.";
                        divAlertaCantidad.appendChild(textoAlerta);
                    }
                });

            } else {
                console.error('Hubo un error en la solicitud.');
            }
        }
    };
    xhr.send();
};
