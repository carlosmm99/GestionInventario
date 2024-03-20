<%-- 
    Document   : index
    Created on : 12 feb. 2024, 9:19:18
    Author     : carlos.mondejar
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Inicio</title>
        <link rel="stylesheet" href="style/styles.css"/>
        <link rel="icon" href="img/Logo_CEDEX_Cuadrado.jpg" type="image/x-icon"/>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    </head>
    <body>
        <div class="container" id="contenedor">
            <%@include file="template/menu.jsp" %>
            <h1>Inicio</h1>
            ${divNotificaciones}
            <%@include file="template/footer.jsp" %>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
        <script>
            var usuario = <%= request.getSession().getAttribute("usuario") != null ? "\"" + request.getSession().getAttribute("usuario") + "\"" : "null" %>;
            var contexto = "${pageContext.servletContext.contextPath}";
            var tiempoInactividad = <%= request.getSession().getMaxInactiveInterval() %>;
        </script>
        <script src="${pageContext.servletContext.contextPath}/js/gestionaPaginaInicio.js"></script>
    </body>
</html>
