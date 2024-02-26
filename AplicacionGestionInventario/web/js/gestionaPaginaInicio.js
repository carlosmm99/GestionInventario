/* global contexto */

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

                var divNotificaciones = document.getElementById("divNotificaciones");

                equipos.forEach(function (equipo) {
                    var fechaProximoMantenimiento = new Date(equipo.fechaProximoMantenimiento).getTime();
                    var fechaProximaCalibracion = new Date(equipo.fechaProximaCalibracion).getTime();
                    var tiempoRestanteProximoMantenimiento = fechaProximoMantenimiento - hoy.getTime();
                    var tiempoRestanteProximaCalibracion = fechaProximaCalibracion - hoy.getTime();
                    var mesesRestantesProximoMantenimiento = tiempoRestanteProximoMantenimiento / (1000 * 60 * 60 * 24 * 30);
                    var mesesRestantesProximaCalibracion = tiempoRestanteProximaCalibracion / (1000 * 60 * 60 * 24 * 30);

                    if (mesesRestantesProximoMantenimiento < 6 && mesesRestantesProximoMantenimiento >= 3) {
                        crearAlertaMantenimiento(equipo, "yellow", "El equipo " + equipo.nombre + " necesita mantenimiento en menos de 6 meses.");
                    } else if (mesesRestantesProximoMantenimiento < 3 && mesesRestantesProximoMantenimiento >= 0) {
                        crearAlertaMantenimiento(equipo, "orange", "El equipo " + equipo.nombre + " necesita mantenimiento en menos de 3 meses.");
                    } else if (mesesRestantesProximoMantenimiento < 0) {
                        crearAlertaMantenimiento(equipo, "red", "El equipo " + equipo.nombre + " necesita mantenimiento urgente.");
                    }

                    if (mesesRestantesProximaCalibracion < 6 && mesesRestantesProximaCalibracion >= 3) {
                        crearAlertaCalibracion(equipo, "yellow", "El equipo " + equipo.nombre + " necesita calibración en menos de 6 meses.");
                    } else if (mesesRestantesProximaCalibracion < 3 && mesesRestantesProximaCalibracion >= 0) {
                        crearAlertaCalibracion(equipo, "orange", "El equipo " + equipo.nombre + " necesita calibración en menos de 3 meses.");
                    } else if (mesesRestantesProximaCalibracion < 0) {
                        crearAlertaCalibracion(equipo, "red", "El equipo " + equipo.nombre + " necesita calibración urgente.");
                    }
                });

                fungibles.forEach(function (fungible) {
                    var cantidad = fungible.cantidad;

                    var divAlertaCantidad = document.createElement("div");
                    divAlertaCantidad.id = "divAlertaCantidadFungible" + fungible.id;
                    divNotificaciones.appendChild(divAlertaCantidad);

                    var icono = document.createElement("img");
                    icono.style.width = "32px";
                    icono.style.height = "32px";

                    var titulo = document.createElement("h6");
                    var textoAlerta = document.createElement("p");

                    if (cantidad <= 10 && cantidad > 5) {
                        divAlertaCantidad.style.backgroundColor = "yellow";
                        divAlertaCantidad.style.marginBottom = "10px";
                        icono.src = contexto + "/img/warning_icon.png";
                        divAlertaCantidad.appendChild(icono);
                        titulo.textContent = "1ª Alerta de Cantidad";
                        divAlertaCantidad.appendChild(titulo);
                        textoAlerta.textContent = "El fungible " + fungible.id + " tiene 10 unidades o menos.";
                        divAlertaCantidad.appendChild(textoAlerta);
                    } else if (cantidad <= 5 && cantidad > 0) {
                        divAlertaCantidad.style.backgroundColor = "orange";
                        divAlertaCantidad.style.marginBottom = "10px";
                        icono.src = contexto + "/img/warning_icon.png";
                        divAlertaCantidad.appendChild(icono);
                        titulo.textContent = "2ª Alerta de Cantidad";
                        divAlertaCantidad.appendChild(titulo);
                        textoAlerta.textContent = "El fungible " + fungible.id + " tiene 5 unidades o menos.";
                        divAlertaCantidad.appendChild(textoAlerta);
                    } else if (cantidad === 0) {
                        divAlertaCantidad.style.backgroundColor = "red";
                        divAlertaCantidad.style.marginBottom = "10px";
                        icono.src = contexto + "/img/warning_shield_icon.png";
                        divAlertaCantidad.appendChild(icono);
                        titulo.textContent = "3ª Alerta de Cantidad Urgente";
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

function crearAlertaMantenimiento(equipo, color, mensaje) {
    var divNotificaciones = document.getElementById("divNotificaciones");

    var divAlertaProximoMantenimiento = document.createElement("div");
    divAlertaProximoMantenimiento.id = "divAlertaProximoMantenimientoEquipo" + equipo.id;
    divAlertaProximoMantenimiento.style.backgroundColor = color;
    divAlertaProximoMantenimiento.style.marginBottom = "10px";
    divNotificaciones.appendChild(divAlertaProximoMantenimiento);

    var icono = document.createElement("img");
    icono.style.width = "32px";
    icono.style.height = "32px";
    if (color === "orange" || color === "yellow") {
        icono.src = contexto + "/img/warning_icon.png";
    } else if (color === "red") {
        icono.src = contexto + "/img/warning_shield_icon.png";
    }
    divAlertaProximoMantenimiento.appendChild(icono);

    var titulo = document.createElement("h6");
    if (color === "yellow" || color === "orange") {
        titulo.textContent = "Próximo mantenimiento dentro de " + fechaProximoMantenimiento + " meses";
    } else if (color === "red") {
        titulo.textContent = "Fecha de próximo mantenimiento pasada";
    }
    divAlertaProximoMantenimiento.appendChild(titulo);

    var textoAlerta = document.createElement("p");
    textoAlerta.textContent = mensaje;
    divAlertaProximoMantenimiento.appendChild(textoAlerta);
}

function crearAlertaCalibracion(equipo, color, mensaje) {
    var divNotificaciones = document.getElementById("divNotificaciones");

    var divAlertaProximaCalibracion = document.createElement("div");
    divAlertaProximaCalibracion.id = "divAlertaProximaCalibracionEquipo" + equipo.id;
    divAlertaProximaCalibracion.style.backgroundColor = color;
    divAlertaProximaCalibracion.style.marginBottom = "10px";
    divNotificaciones.appendChild(divAlertaProximaCalibracion);

    var icono = document.createElement("img");
    icono.style.width = "32px";
    icono.style.height = "32px";
    if (color === "orange" || color === "yellow") {
        icono.src = contexto + "/img/warning_icon.png";
    } else if (color === "red") {
        icono.src = contexto + "/img/warning_shield_icon.png";
    }
    divAlertaProximaCalibracion.appendChild(icono);

    var titulo = document.createElement("h6");
    if (color === "yellow" || color === "orange") {
        titulo.textContent = "Próxima calibración dentro de " + fechaProximaCalibracion + " meses";
    } else if (color === "red") {
        titulo.textContent = "Fecha de próxima calibración pasada";
    }
    divAlertaProximaCalibracion.appendChild(titulo);

    var textoAlerta = document.createElement("p");
    textoAlerta.textContent = mensaje;
    divAlertaProximaCalibracion.appendChild(textoAlerta);
}
