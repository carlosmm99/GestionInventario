<%-- 
    Document   : footer
    Created on : 20 mar. 2024, 13:32:29
    Author     : carlos.mondejar
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<% if (session.getAttribute("usuario") != null) { %>
<hr>
<footer>
    <h6>Realizado por: Carlos Mondéjar Morcillo</h6>
    <h6>Última actualización: 20/03/2024</h6>
</footer>
<% } %>
