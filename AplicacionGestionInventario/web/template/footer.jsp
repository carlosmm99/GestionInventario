<%-- 
    Document   : footer
    Created on : 20 mar. 2024, 13:32:29
    Author     : carlos.mondejar
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<% if (session.getAttribute("usuario") != null) { %>
<hr>
<footer>
    <h4>Realizado por: Carlos Mondéjar Morcillo</h4>
    <h4>Última actualización: 20/03/2024</h4>
</footer>
<% } %>
