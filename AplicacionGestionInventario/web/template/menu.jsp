<%-- 
    Document   : menu
    Created on : 12 feb. 2024, 11:54:22
    Author     : carlos.mondejar
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
        <a class="nav-link active" aria-current="page" href="${pageContext.servletContext.contextPath}/Inicio"><img src="${pageContext.servletContext.contextPath}/img/202210_Logo_CEDEX_GRIS_web.jpg" style="width: 373.6px; height: 51.5px;"/></a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link" href="${pageContext.servletContext.contextPath}/GestionEquipos">Equipos</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="${pageContext.servletContext.contextPath}/GestionFungibles">Fungibles</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="${pageContext.servletContext.contextPath}/GestionHerramientas">Herramientas</a>
                </li>
                <% if (session.getAttribute("usuario") != null) { %>
                <li class="nav-item">
                    <a class="nav-link" href="${pageContext.servletContext.contextPath}/Logout">Cerrar sesión</a>
                </li>
                <% } %>
            </ul>
            <% if (session.getAttribute("usuario") != null) { %>
            <h6>Usuario conectado: <%= session.getAttribute("usuario") %></h6>
            <% } %>
        </div>
    </div>
</nav>
