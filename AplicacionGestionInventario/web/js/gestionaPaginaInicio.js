/* global usuario, contexto */

window.onload = function () {
    if (usuario !== null) {
        $(".nav-link").on("click", function () {
            localStorage.removeItem('id');
        });
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
                            crearAlertaCalibracion(equipo, "yellow", "El equipo con id " + equipo.id + ", número de inventario " + equipo.numInventario + ", nombre " + equipo.nombre + " necesita calibración en menos de 6 meses.");
                        } else if (mesesRestantesProximaCalibracion < 3 && mesesRestantesProximaCalibracion >= 0) {
                            crearAlertaCalibracion(equipo, "orange", "El equipo con id " + equipo.id + ", número de inventario " + equipo.numInventario + ", nombre " + equipo.nombre + " necesita calibración en menos de 3 meses.");
                        } else if (mesesRestantesProximaCalibracion < 0) {
                            crearAlertaCalibracion(equipo, "red", "El equipo con id " + equipo.id + ", número de inventario " + equipo.numInventario + ", nombre " + equipo.nombre + " necesita calibración urgente.");
                        }

                        if (mesesRestantesProximoMantenimiento < 6 && mesesRestantesProximoMantenimiento >= 3) {
                            crearAlertaMantenimiento(equipo, "yellow", "El equipo con id " + equipo.id + ", número de inventario " + equipo.numInventario + ", nombre " + equipo.nombre + " necesita mantenimiento en menos de 6 meses.");
                        } else if (mesesRestantesProximoMantenimiento < 3 && mesesRestantesProximoMantenimiento >= 0) {
                            crearAlertaMantenimiento(equipo, "orange", "El equipo con id " + equipo.id + ", número de inventario " + equipo.numInventario + ", nombre " + equipo.nombre + " necesita mantenimiento en menos de 3 meses.");
                        } else if (mesesRestantesProximoMantenimiento < 0) {
                            crearAlertaMantenimiento(equipo, "red", "El equipo con id " + equipo.id + ", número de inventario " + equipo.numInventario + ", nombre " + equipo.nombre + " necesita mantenimiento urgente.");
                        }
                    });

                    fungibles.forEach(function (fungible) {
                        var cantidad = fungible.cantidad;

                        if (cantidad <= 10 && cantidad > 5) {
                            crearAlertaCantidad(fungible, "yellow", "El fungible con id " + fungible.id + ", marca " + fungible.marca + ", modelo " + fungible.modelo + " tiene 10 unidades o menos.");
                        } else if (cantidad <= 5 && cantidad > 0) {
                            crearAlertaCantidad(fungible, "orange", "El fungible con id " + fungible.id + ", marca " + fungible.marca + ", modelo " + fungible.modelo + " tiene 5 unidades o menos.");
                        } else if (cantidad === 0) {
                            crearAlertaCantidad(fungible, "red", "El fungible con id " + fungible.id + ", marca " + fungible.marca + ", modelo " + fungible.modelo + " no tiene unidades.");
                        }
                    });

                    // Agrupar los divs creados por color en tres listas diferentes
                    var yellowAlerts = document.querySelectorAll('.first-level-warning');
                    var orangeAlerts = document.querySelectorAll('.second-level-warning');
                    var redAlerts = document.querySelectorAll('.third-level-warning');

                    // Convertir las listas NodeList a Arrays para usar el método sort()
                    redAlerts = Array.from(redAlerts);
                    orangeAlerts = Array.from(orangeAlerts);
                    yellowAlerts = Array.from(yellowAlerts);

                    // Ordenar las listas según el color
                    redAlerts.sort(function (a, b) {
                        return getColorIndex(a) - getColorIndex(b);
                    });
                    orangeAlerts.sort(function (a, b) {
                        return getColorIndex(a) - getColorIndex(b);
                    });
                    yellowAlerts.sort(function (a, b) {
                        return getColorIndex(a) - getColorIndex(b);
                    });

                    // Vaciar el contenedor de notificaciones
                    var divNotificaciones = document.getElementById("divNotificaciones");
                    divNotificaciones.innerHTML = '';

                    // Agregar los divs ordenados al contenedor
                    redAlerts.forEach(function (alert) {
                        divNotificaciones.appendChild(alert);
                    });
                    orangeAlerts.forEach(function (alert) {
                        divNotificaciones.appendChild(alert);
                    });
                    yellowAlerts.forEach(function (alert) {
                        divNotificaciones.appendChild(alert);
                    });

                } else {
                    console.error('Hubo un error en la solicitud.');
                }
            }
        };
        xhr.send();
    }
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
    textoAlerta.onclick = function () {
        window.location.href = contexto + "/GestionEquipos";
        id = equipo.id;
        localStorage.setItem('id', equipo.id);
    };
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
        titulo.textContent = "Quedan 10 unidades o menos";
        divAlertaCantidad.className = "first-level-warning";
    } else if (color === "orange") {
        titulo.textContent = "Quedan 5 unidades o menos";
        divAlertaCantidad.className = "second-level-warning";
    } else if (color === "red") {
        titulo.textContent = "Sin unidades";
        divAlertaCantidad.className = "third-level-warning";
    }
    divAlertaCantidad.appendChild(titulo);

    // Añade un salto de línea después del título
    var br = document.createElement("br");
    divAlertaCantidad.appendChild(br);

    var textoAlerta = document.createElement("p");
    textoAlerta.textContent = mensaje;
    textoAlerta.onclick = function () {
        window.location.href = contexto + "/GestionFungibles";
        localStorage.setItem('id', fungible.id);

    };
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
    textoAlerta.onclick = function () {
        window.location.href = contexto + "/GestionEquipos";
        localStorage.setItem('id', equipo.id);
    };
    divAlertaProximoMantenimiento.appendChild(textoAlerta);
}

// Función para obtener el índice del color
function getColorIndex(element) {
    var color = element.style.backgroundColor;
    if (color === "red") {
        return 2;
    } else if (color === "orange") {
        return 1;
    } else if (color === "yellow") {
        return 0;
    }
    return -1; // Si no es ninguno de los colores definidos
}
