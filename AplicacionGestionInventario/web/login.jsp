<%-- 
    Document   : login
    Created on : 12 feb. 2024, 9:19:18
    Author     : carlos.mondejar
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login</title>
        <link rel="stylesheet" href="style/styles.css"/>
        <link rel="icon" href="img/logo_cedex.png" type="image/x-icon"/>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css">
    </head>
    <body>
        <div class="container">
            <%--<%@include file="template/menu.jsp" %>--%>
            <div class="row align-items-start">
                <div class="col-9">
                    <h1>Iniciar sesión</h1>
                </div>
            </div>
            <hr>
            <div>
                <form action="${pageContext.servletContext.contextPath}/Login" method="post" role="form">
                    <div class="form-group">
                        <label>Usuario:</label>
                        <input type="text" class="form-control" name="txtNombreUsuario" id="txtNombreUsuario" placeholder="Usuario">
                    </div>
                    <div class="form-group">
                        <label>Contraseña:</label>
                        <input type="password" class="form-control" name="txtContrasenia" id="txtContrasenia" placeholder="Contraseña">
                    </div>
                    <hr>
                    <button type="submit" name="btnLogin" class="btn btn-primary">Iniciar sesión</button>
                </form>
            </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>
        <!--<script src="${pageContext.servletContext.contextPath}/js/gestionaPaginaInicio.js"></script>-->
    </body>
</html>
