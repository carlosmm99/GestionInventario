/* global usuario, contexto, tiempoInactividad */

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

window.onload = function () {
    if (usuario !== null) {
        // Iniciar el temporizador al cargar la página
        startInactivityTimer();

        // Agregar un evento de click al cuerpo de la página para detectar la actividad del usuario
        document.body.addEventListener("click", resetInactivityTimer);
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
                            crearAlertaCalibracion(equipo, "#ffff00", "El equipo con id " + equipo.id + ", número de inventario " + equipo.numInventario + ", nombre " + equipo.nombre + " necesita calibración en menos de 6 meses.");
                        } else if (mesesRestantesProximaCalibracion < 3 && mesesRestantesProximaCalibracion >= 0) {
                            crearAlertaCalibracion(equipo, "#ffa500", "El equipo con id " + equipo.id + ", número de inventario " + equipo.numInventario + ", nombre " + equipo.nombre + " necesita calibración en menos de 3 meses.");
                        } else if (mesesRestantesProximaCalibracion < 0) {
                            crearAlertaCalibracion(equipo, "#ff0000", "El equipo con id " + equipo.id + ", número de inventario " + equipo.numInventario + ", nombre " + equipo.nombre + " necesita calibración urgente.");
                        }

                        if (mesesRestantesProximoMantenimiento < 6 && mesesRestantesProximoMantenimiento >= 3) {
                            crearAlertaMantenimiento(equipo, "#ffff00", "El equipo con id " + equipo.id + ", número de inventario " + equipo.numInventario + ", nombre " + equipo.nombre + " necesita mantenimiento en menos de 6 meses.");
                        } else if (mesesRestantesProximoMantenimiento < 3 && mesesRestantesProximoMantenimiento >= 0) {
                            crearAlertaMantenimiento(equipo, "#ffa500", "El equipo con id " + equipo.id + ", número de inventario " + equipo.numInventario + ", nombre " + equipo.nombre + " necesita mantenimiento en menos de 3 meses.");
                        } else if (mesesRestantesProximoMantenimiento < 0) {
                            crearAlertaMantenimiento(equipo, "#ff0000", "El equipo con id " + equipo.id + ", número de inventario " + equipo.numInventario + ", nombre " + equipo.nombre + " necesita mantenimiento urgente.");
                        }
                    });

                    fungibles.forEach(function (fungible) {
                        var cantidad = fungible.cantidad;

                        if (cantidad <= 10 && cantidad > 5) {
                            crearAlertaCantidad(fungible, "#ffff00", "El fungible con id " + fungible.id + ", marca " + fungible.marca + ", modelo " + fungible.modelo + " tiene 10 unidades o menos.");
                        } else if (cantidad <= 5 && cantidad > 0) {
                            crearAlertaCantidad(fungible, "#ffa500", "El fungible con id " + fungible.id + ", marca " + fungible.marca + ", modelo " + fungible.modelo + " tiene 5 unidades o menos.");
                        } else if (cantidad === 0) {
                            crearAlertaCantidad(fungible, "#ff0000", "El fungible con id " + fungible.id + ", marca " + fungible.marca + ", modelo " + fungible.modelo + " no tiene unidades.");
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
    divAlertaProximaCalibracion.style.borderRadius = "4px";
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
    if (color === "#ffa500" || color === "#ffff00") {
        icono.src = contexto + "/img/warning_icon.png";
    } else if (color === "#ff0000") {
        icono.src = contexto + "/img/warning_shield_icon.png";
    }
    divAlertaProximaCalibracion.appendChild(icono);

    var titulo = document.createElement("h6");
    titulo.style.display = "inline-block"; // Añade esta línea para hacer el título inline-block
    if (color === "#ffff00") {
        titulo.textContent = "Próxima calibración en menos de 6 meses";
        divAlertaProximaCalibracion.className = "first-level-warning";
    } else if (color === "#ffa500") {
        titulo.textContent = "Próxima calibración en menos de 3 meses";
        divAlertaProximaCalibracion.className = "second-level-warning";
    } else if (color === "#ff0000") {
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

    // Agregar manejador de evento para redireccionar y establecer el local storage
    divAlertaProximaCalibracion.onclick = function (event) {
        if (event.target !== spanCerrar) { // Verificar que el clic no sea en el botón de cierre
            window.location.href = contexto + "/GestionEquipos";
            localStorage.setItem('id', equipo.id);
        }
    };

    divAlertaProximaCalibracion.onmouseover = function () {
        var currentLocation = window.location.href;
        var titleText = "";

        // Verificar si estamos en localhost
        if (currentLocation.includes("localhost") || currentLocation.includes("127.0.0.1")) {
            titleText = "http://localhost:8080" + contexto + "/GestionEquipos";
        } else {
            // Obtener la dirección IP del servidor
            var ipAddress = currentLocation.split('/')[2];
            titleText = "http://" + ipAddress + contexto + "/GestionEquipos";
        }

        if (divAlertaProximaCalibracion.className === "first-level-warning") {
            divAlertaProximaCalibracion.style.backgroundColor = "#ffff50";
        } else if (divAlertaProximaCalibracion.className === "second-level-warning") {
            divAlertaProximaCalibracion.style.backgroundColor = "#ffa550";
        } else if (divAlertaProximaCalibracion.className === "third-level-warning") {
            divAlertaProximaCalibracion.style.backgroundColor = "#ff5050";
        }
        divAlertaProximaCalibracion.style.cursor = "pointer";
        divAlertaProximaCalibracion.title = titleText;
    };

    divAlertaProximaCalibracion.onmouseout = function () {
        divAlertaProximaCalibracion.style.backgroundColor = color;
    };
}

function crearAlertaCantidad(fungible, color, mensaje) {
    var divNotificaciones = document.getElementById("divNotificaciones");

    var divAlertaCantidad = document.createElement("div");
    divAlertaCantidad.id = "divAlertaCantidadFungible" + fungible.id;
    divAlertaCantidad.style.backgroundColor = color;
    divAlertaCantidad.style.borderRadius = "4px";
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
    if (color === "#ffa500" || color === "#ffff00") {
        icono.src = contexto + "/img/warning_icon.png";
    } else if (color === "#ff0000") {
        icono.src = contexto + "/img/warning_shield_icon.png";
    }
    divAlertaCantidad.appendChild(icono);

    var titulo = document.createElement("h6");
    titulo.style.display = "inline-block"; // Añade esta línea para hacer el título inline-block
    if (color === "#ffff00") {
        titulo.textContent = "Quedan 10 unidades o menos";
        divAlertaCantidad.className = "first-level-warning";
    } else if (color === "#ffa500") {
        titulo.textContent = "Quedan 5 unidades o menos";
        divAlertaCantidad.className = "second-level-warning";
    } else if (color === "#ff0000") {
        titulo.textContent = "Sin unidades";
        divAlertaCantidad.className = "third-level-warning";
    }
    divAlertaCantidad.appendChild(titulo);

    // Añade un salto de línea después del título
    var br = document.createElement("br");
    divAlertaCantidad.appendChild(br);

    var textoAlerta = document.createElement("p");
    textoAlerta.textContent = mensaje;
    divAlertaCantidad.appendChild(textoAlerta);

    // Agregar manejador de evento para redireccionar y establecer el local storage
    divAlertaCantidad.onclick = function (event) {
        if (event.target !== spanCerrar) { // Verificar que el clic no sea en el botón de cierre
            window.location.href = contexto + "/GestionFungibles";
            localStorage.setItem('id', fungible.id);
        }
    };

    divAlertaCantidad.onmouseover = function () {
        var currentLocation = window.location.href;
        var titleText = "";

        // Verificar si estamos en localhost
        if (currentLocation.includes("localhost") || currentLocation.includes("127.0.0.1")) {
            titleText = "http://localhost:8080" + contexto + "/GestionEquipos";
        } else {
            // Obtener la dirección IP del servidor
            var ipAddress = currentLocation.split('/')[2];
            titleText = "http://" + ipAddress + contexto + "/GestionEquipos";
        }

        if (divAlertaCantidad.className === "first-level-warning") {
            divAlertaCantidad.style.backgroundColor = "#ffff50";
        } else if (divAlertaCantidad.className === "second-level-warning") {
            divAlertaCantidad.style.backgroundColor = "#ffa550";
        } else if (divAlertaCantidad.className === "third-level-warning") {
            divAlertaCantidad.style.backgroundColor = "#ff5050";
        }
        divAlertaCantidad.style.cursor = "pointer";
        divAlertaCantidad.title = titleText;
    };

    divAlertaCantidad.onmouseout = function () {
        divAlertaCantidad.style.backgroundColor = color;
    };
}

function crearAlertaMantenimiento(equipo, color, mensaje) {
    var divNotificaciones = document.getElementById("divNotificaciones");

    var divAlertaProximoMantenimiento = document.createElement("div");
    divAlertaProximoMantenimiento.id = "divAlertaProximoMantenimientoEquipo" + equipo.id;
    divAlertaProximoMantenimiento.style.backgroundColor = color;
    divAlertaProximoMantenimiento.style.borderRadius = "4px";
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
    if (color === "#ffa500" || color === "#ffff00") {
        icono.src = contexto + "/img/warning_icon.png";
    } else if (color === "#ff0000") {
        icono.src = contexto + "/img/warning_shield_icon.png";
    }
    divAlertaProximoMantenimiento.appendChild(icono);

    var titulo = document.createElement("h6");
    titulo.style.display = "inline-block"; // Añade esta línea para hacer el título inline-block
    if (color === "#ffff00") {
        titulo.textContent = "Próximo mantenimiento en menos de 6 meses";
        divAlertaProximoMantenimiento.className = "first-level-warning";
    } else if (color === "#ffa500") {
        titulo.textContent = "Próximo mantenimiento en menos de 3 meses";
        divAlertaProximoMantenimiento.className = "second-level-warning";
    } else if (color === "#ff0000") {
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

    // Agregar manejador de evento para redireccionar y establecer el local storage
    divAlertaProximoMantenimiento.onclick = function (event) {
        if (event.target !== spanCerrar) { // Verificar que el clic no sea en el botón de cierre
            window.location.href = contexto + "/GestionEquipos";
            localStorage.setItem('id', equipo.id);
        }
    };

    divAlertaProximoMantenimiento.onmouseover = function () {
        var currentLocation = window.location.href;
        var titleText = "";

        // Verificar si estamos en localhost
        if (currentLocation.includes("localhost") || currentLocation.includes("127.0.0.1")) {
            titleText = "http://localhost:8080" + contexto + "/GestionEquipos";
        } else {
            // Obtener la dirección IP del servidor
            var ipAddress = currentLocation.split('/')[2];
            titleText = "http://" + ipAddress + contexto + "/GestionFungibles";
        }

        if (divAlertaProximoMantenimiento.className === "first-level-warning") {
            divAlertaProximoMantenimiento.style.backgroundColor = "#ffff50";
        } else if (divAlertaProximoMantenimiento.className === "second-level-warning") {
            divAlertaProximoMantenimiento.style.backgroundColor = "#ffa550";
        } else if (divAlertaProximoMantenimiento.className === "third-level-warning") {
            divAlertaProximoMantenimiento.style.backgroundColor = "#ff5050";
        }
        divAlertaProximoMantenimiento.style.cursor = "pointer";
        divAlertaProximoMantenimiento.title = titleText;
    };

    divAlertaProximoMantenimiento.onmouseout = function () {
        divAlertaProximoMantenimiento.style.backgroundColor = color;
    };
}

// Función para obtener el índice del color
function getColorIndex(element) {
    var color = element.style.backgroundColor;
    if (color === "#ff0000") {
        return 2;
    } else if (color === "#ffa500") {
        return 1;
    } else if (color === "#ffff00") {
        return 0;
    }
    return -1; // Si no es ninguno de los colores definidos
}
