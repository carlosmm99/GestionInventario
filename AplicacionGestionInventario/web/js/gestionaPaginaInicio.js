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

                equipos.forEach(function (equipo) {
                    var fechaProximaCalibracion = new Date(equipo.fechaProximaCalibracion).getTime();
                    var tiempoRestanteProximaCalibracion = fechaProximaCalibracion - hoy.getTime();
                    var mesesRestantesProximaCalibracion = tiempoRestanteProximaCalibracion / (1000 * 60 * 60 * 24 * 30);
                    var fechaProximoMantenimiento = new Date(equipo.fechaProximoMantenimiento).getTime();
                    var tiempoRestanteProximoMantenimiento = fechaProximoMantenimiento - hoy.getTime();
                    var mesesRestantesProximoMantenimiento = tiempoRestanteProximoMantenimiento / (1000 * 60 * 60 * 24 * 30);

                    if (mesesRestantesProximaCalibracion < 6 && mesesRestantesProximaCalibracion >= 3) {
                        crearAlertaCalibracion(equipo, "yellow", "El equipo " + equipo.nombre + " necesita calibración en menos de 6 meses.");
                    } else if (mesesRestantesProximaCalibracion < 3 && mesesRestantesProximaCalibracion >= 0) {
                        crearAlertaCalibracion(equipo, "orange", "El equipo " + equipo.nombre + " necesita calibración en menos de 3 meses.");
                    } else if (mesesRestantesProximaCalibracion < 0) {
                        crearAlertaCalibracion(equipo, "red", "El equipo " + equipo.nombre + " necesita calibración urgente.");
                    }

                    if (mesesRestantesProximoMantenimiento < 6 && mesesRestantesProximoMantenimiento >= 3) {
                        crearAlertaMantenimiento(equipo, "yellow", "El equipo " + equipo.nombre + " necesita mantenimiento en menos de 6 meses.");
                    } else if (mesesRestantesProximoMantenimiento < 3 && mesesRestantesProximoMantenimiento >= 0) {
                        crearAlertaMantenimiento(equipo, "orange", "El equipo " + equipo.nombre + " necesita mantenimiento en menos de 3 meses.");
                    } else if (mesesRestantesProximoMantenimiento < 0) {
                        crearAlertaMantenimiento(equipo, "red", "El equipo " + equipo.nombre + " necesita mantenimiento urgente.");
                    }
                });

                fungibles.forEach(function (fungible) {
                    var cantidad = fungible.cantidad;

                    if (cantidad <= 10 && cantidad > 5) {
                        crearAlertaCantidad(fungible, "yellow", "El fungible con id " + fungible.id + " tiene 10 unidades o menos");
                    } else if (cantidad <= 5 && cantidad > 0) {
                        crearAlertaCantidad(fungible, "orange", "El fungible con id " + fungible.id + " tiene 5 unidades o menos");
                    } else if (cantidad === 0) {
                        crearAlertaCantidad(fungible, "red", "El fungible con id " + fungible.id + " no tiene unidades");
                    }
                });

            } else {
                console.error('Hubo un error en la solicitud.');
            }
        }
    };
    xhr.send();
};

function crearAlertaCalibracion(equipo, color, mensaje) {
    var divNotificaciones = document.getElementById("divNotificaciones");

    var divAlertaProximaCalibracion = document.createElement("div");
    divAlertaProximaCalibracion.id = "divAlertaProximaCalibracionEquipo" + equipo.id;
    divAlertaProximaCalibracion.style.backgroundColor = color;
    divAlertaProximaCalibracion.style.width = "45%";
    divNotificaciones.appendChild(divAlertaProximaCalibracion);

    // Crear botón de cierre
    var spanCerrar = document.createElement("span");
    spanCerrar.className = "cerrar-alerta"; // Clase para seleccionar fácilmente el botón de cierre
    spanCerrar.innerHTML = "&times;"; // Icono de cerrar

    // Agregar manejador de evento para cerrar la alerta al hacer clic en el botón
    spanCerrar.onclick = function () {
        divAlertaProximaCalibracion.remove(); // Eliminar el div de la alerta
    };

    // Agregar el botón de cierre al div de la alerta
    divAlertaProximaCalibracion.appendChild(spanCerrar);

    var icono = document.createElement("img");
    icono.style.width = "32px";
    icono.style.height = "32px";
    icono.style.display = "inline-block"; // Añade esta línea para hacer el icono inline-block
    if (color === "orange" || color === "yellow") {
        icono.src = contexto + "/img/warning_icon.png";
    } else if (color === "red") {
        icono.src = contexto + "/img/warning_shield_icon.png";
    }
    divAlertaProximaCalibracion.appendChild(icono);

    var titulo = document.createElement("h6");
    titulo.style.display = "inline-block"; // Añade esta línea para hacer el título inline-block
    if (color === "yellow") {
        titulo.textContent = "Próxima calibración en menos de 6 meses";
        divAlertaProximaCalibracion.className = "first-level-warning";
    } else if (color === "orange") {
        titulo.textContent = "Próxima calibración en menos de 3 meses";
        divAlertaProximaCalibracion.className = "second-level-warning";
    } else if (color === "red") {
        titulo.textContent = "Próxima calibración pasada";
        divAlertaProximaCalibracion.className = "third-level-warning";
    }
    divAlertaProximaCalibracion.appendChild(titulo);

    // Añade un salto de línea después del título

    var br = document.createElement("br");
    divAlertaProximaCalibracion.appendChild(br);

    var textoAlerta = document.createElement("p");
    textoAlerta.textContent = mensaje;
    divAlertaProximaCalibracion.appendChild(textoAlerta);
}

function crearAlertaCantidad(fungible, color, mensaje) {
    var divNotificaciones = document.getElementById("divNotificaciones");

    var divAlertaCantidad = document.createElement("div");
    divAlertaCantidad.id = "divAlertaCantidadFungible" + fungible.id;
    divAlertaCantidad.style.backgroundColor = color;
    divAlertaCantidad.style.width = "45%";
    divNotificaciones.appendChild(divAlertaCantidad);

    // Crear botón de cierre
    var spanCerrar = document.createElement("span");
    spanCerrar.className = "cerrar-alerta"; // Clase para seleccionar fácilmente el botón de cierre
    spanCerrar.innerHTML = "&times;"; // Icono de cerrar

    // Agregar manejador de evento para cerrar la alerta al hacer clic en el botón
    spanCerrar.onclick = function () {
        divAlertaCantidad.remove(); // Eliminar el div de la alerta
    };

    // Agregar el botón de cierre al div de la alerta
    divAlertaCantidad.appendChild(spanCerrar);

    var icono = document.createElement("img");
    icono.style.width = "32px";
    icono.style.height = "32px";
    icono.style.display = "inline-block"; // Añade esta línea para hacer el icono inline-block
    if (color === "orange" || color === "yellow") {
        icono.src = contexto + "/img/warning_icon.png";
    } else if (color === "red") {
        icono.src = contexto + "/img/warning_shield_icon.png";
    }
    divAlertaCantidad.appendChild(icono);

    var titulo = document.createElement("h6");
    titulo.style.display = "inline-block"; // Añade esta línea para hacer el título inline-block
    if (color === "yellow") {
        titulo.textContent = "Primer aviso";
        divAlertaCantidad.className = "first-level-warning";
    } else if (color === "orange") {
        titulo.textContent = "Segundo aviso";
        divAlertaCantidad.className = "second-level-warning";
    } else if (color === "red") {
        titulo.textContent = "Tercer aviso";
        divAlertaCantidad.className = "third-level-warning";
    }
    divAlertaCantidad.appendChild(titulo);

    // Añade un salto de línea después del título

    var br = document.createElement("br");
    divAlertaCantidad.appendChild(br);

    var textoAlerta = document.createElement("p");
    textoAlerta.textContent = mensaje;
    divAlertaCantidad.appendChild(textoAlerta);
}

function crearAlertaMantenimiento(equipo, color, mensaje) {
    var divNotificaciones = document.getElementById("divNotificaciones");

    var divAlertaProximoMantenimiento = document.createElement("div");
    divAlertaProximoMantenimiento.id = "divAlertaProximoMantenimientoEquipo" + equipo.id;
    divAlertaProximoMantenimiento.style.backgroundColor = color;
    divAlertaProximoMantenimiento.style.width = "45%";
    divNotificaciones.appendChild(divAlertaProximoMantenimiento);

    // Crear botón de cierre
    var spanCerrar = document.createElement("span");
    spanCerrar.className = "cerrar-alerta"; // Clase para seleccionar fácilmente el botón de cierre
    spanCerrar.innerHTML = "&times;"; // Icono de cerrar

    // Agregar manejador de evento para cerrar la alerta al hacer clic en el botón
    spanCerrar.onclick = function () {
        divAlertaProximoMantenimiento.remove(); // Eliminar el div de la alerta
    };

    // Agregar el botón de cierre al div de la alerta
    divAlertaProximoMantenimiento.appendChild(spanCerrar);

    var icono = document.createElement("img");
    icono.style.width = "32px";
    icono.style.height = "32px";
    icono.style.display = "inline-block"; // Añade esta línea para hacer el icono inline-block
    if (color === "orange" || color === "yellow") {
        icono.src = contexto + "/img/warning_icon.png";
    } else if (color === "red") {
        icono.src = contexto + "/img/warning_shield_icon.png";
    }
    divAlertaProximoMantenimiento.appendChild(icono);

    var titulo = document.createElement("h6");
    titulo.style.display = "inline-block"; // Añade esta línea para hacer el título inline-block
    if (color === "yellow") {
        titulo.textContent = "Próximo mantenimiento en menos de 6 meses";
        divAlertaProximoMantenimiento.className = "first-level-warning";
    } else if (color === "orange") {
        titulo.textContent = "Próximo mantenimiento en menos de 3 meses";
        divAlertaProximoMantenimiento.className = "second-level-warning";
    } else if (color === "red") {
        titulo.textContent = "Próximo mantenimiento pasado";
        divAlertaProximoMantenimiento.className = "third-level-warning";
    }
    divAlertaProximoMantenimiento.appendChild(titulo);

    // Añade un salto de línea después del título

    var br = document.createElement("br");
    divAlertaProximoMantenimiento.appendChild(br);

    var textoAlerta = document.createElement("p");
    textoAlerta.textContent = mensaje;
    divAlertaProximoMantenimiento.appendChild(textoAlerta);
}
