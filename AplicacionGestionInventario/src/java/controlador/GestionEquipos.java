/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controlador;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import modelo.Equipo;
import modelo.Fungible;
import modelo.Herramienta;

/**
 *
 * @author carlos.mondejar
 */
public class GestionEquipos extends HttpServlet {

    private final Controlador c = new Controlador();

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            /* TODO output your page here. You may use following sample code. */
            out.println("<!DOCTYPE html>");
            out.println("<html>");
            out.println("<head>");
            out.println("<title>Servlet GestionEquipos</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet GestionEquipos at " + request.getContextPath() + "</h1>");
            out.println("</body>");
            out.println("</html>");
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String btnAgregar = generarBotonHTML();
        request.setAttribute("btnAgregar", btnAgregar);
        String tablaEquipos = generarTablaHTML(request);
        request.setAttribute("tablaEquipos", tablaEquipos);
        String formEquipos = generarFormularioHTML(request);
        request.setAttribute("formEquipos", formEquipos);
        request.getRequestDispatcher("equipos.jsp").forward(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            int id = Integer.parseInt(request.getParameter("txtNumEquipo"));
            int numIdentificacion = Integer.parseInt(request.getParameter("txtNumIdentificacion"));
            String nombre = request.getParameter("txtNombreEquipo");
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date fechaCompraEquipo = dateFormat.parse(request.getParameter("txtFechaCompraEquipo"));
            String fabricante = request.getParameter("txtFabricanteEquipo");
            Date fechaUltimaCalibracion = dateFormat.parse(request.getParameter("txtFechaUltimaCalibracion"));
            Date fechaProximaCalibracion = dateFormat.parse(request.getParameter("txtFechaProximaCalibracion"));
            Date fechaUltimoMantenimiento = dateFormat.parse(request.getParameter("txtFechaUltimoMantenimiento"));
            Date fechaProximoMantenimiento = dateFormat.parse(request.getParameter("txtFechaProximoMantenimiento"));
            Equipo e = new Equipo(id, numIdentificacion, nombre, fechaCompraEquipo, fabricante, fechaUltimaCalibracion, fechaProximaCalibracion, fechaUltimoMantenimiento, fechaProximoMantenimiento);
            int res = 0;
            String mensaje = "";
            if (request.getParameter("btnAgregar") != null) {
                res = c.insertarEquipo(e);
                if (res != 0) {
                    mensaje = "Equipo con id " + e.getId() + " dado de alta correctamente";
                } else {
                    mensaje = "Error al dar de alta el equipo con id " + e.getId();
                }
            } else if (request.getParameter("btnAsignarFungiblesAEquipo") != null) {
                String[] opcionesFungibles = request.getParameterValues("selectFungibles");
                for (String idFungible : opcionesFungibles) {
                    Fungible f = c.buscarFungible(Integer.parseInt(idFungible));
                    if (f != null) {
                        res = c.asociarEquipoFungible(e, f);
                        if (res != 0) {
                            mensaje = "Equipo y fungible asociados correctamente";
                        } else {
                            mensaje = "Error al asociar el equipo y el fungible";
                        }
                    }
                }
            } else if (request.getParameter("btnAsignarHerramientasAEquipo") != null) {
                String[] opcionesHerramientas = request.getParameterValues("selectHerramientas");
                for (String idHerramienta : opcionesHerramientas) {
                    Herramienta h = c.buscarHerramientas(Integer.parseInt(idHerramienta));
                    if (h != null) {
                        res = c.asociarEquipoHerramienta(e, h);
                        if (res != 0) {
                            mensaje = "Equipo y herramienta asociados correctamente";
                        } else {
                            mensaje = "Error al asociar el equipo y la herramienta";
                        }
                    }
                }
            } else if (request.getParameter("btnEditar") != null) {
                res = c.modificarEquipo(e);
                if (res != 0) {
                    mensaje = "Equipo con id " + e.getId() + " modificado correctamente";
                } else {
                    mensaje = "Error al modificar el equipo con id " + e.getId();
                }
            } else if (request.getParameter("btnEliminar") != null) {
                res = c.borrarEquipo(e);
                if (res != 0) {
                    mensaje = "Equipo con id " + e.getId() + " borrado correctamente";
                } else {
                    mensaje = "Error al borrar el equipo con id " + e.getId();
                }
            }

            // Establecer atributos para mostrar el cuadro de diálogo y redirigir
            request.setAttribute("showDialog", true);
            request.setAttribute("message", mensaje);
            request.getRequestDispatcher("equipos.jsp").forward(request, response);
        } catch (ParseException ex) {
            Logger.getLogger(GestionEquipos.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

    private String generarTablaHTML(HttpServletRequest request) {
        List<Equipo> equipos = c.leerEquipos();
        StringBuilder tablaHTML = new StringBuilder();

        if (equipos != null || !equipos.isEmpty()) {
            tablaHTML.append("<table id=\"tablaEquipos\" class=\"table table-bordered table-hover display responsive nowrap\" width=\"100%\">")
                    .append("<thead><tr>");

            tablaHTML.append("<th scope=\"col\">Acciones</th>");
            tablaHTML.append("<th scope=\"col\" id=\"columnaNumEquipo\">Nº de equipo</th>")
                    .append("<th scope=\"col\">Nº de identificación</th><th scope=\"col\">Nombre</th>")
                    .append("<th scope=\"col\">Fecha de compra</th><th scope=\"col\">Fabricante</th>")
                    .append("<th scope=\"col\">Fecha última calibración</th><th scope=\"col\">Fecha próxima calibración</th>");

            tablaHTML.append("</tr></thead>");

            tablaHTML.append("<tbody>");
            for (Equipo equipo : equipos) {
                tablaHTML.append("<tr id=fila_").append(equipo.getId()).append("\"")
                        .append(" data-action=\"Consultar\"")
                        .append(" data-idequipo=\"").append(equipo.getId()).append("\"")
                        .append(" data-numidentificacion=\"").append(equipo.getNumIdentificacion()).append("\"")
                        .append(" data-nombre=\"").append(equipo.getNombre()).append("\"")
                        .append(" data-fechacompraequipo=\"").append(equipo.getFechaCompra()).append("\"")
                        .append(" data-fabricanteequipo=\"").append(equipo.getFabricante()).append("\"")
                        .append(" data-fechaultimacalibracion=\"").append(equipo.getFechaUltimaCalibracion()).append("\"")
                        .append(" data-fechaproximacalibracion=\"").append(equipo.getFechaProximaCalibracion()).append("\">");

                tablaHTML.append("<td>")
                        .append("<button type=\"button\" class=\"btn btn-primary btnFungiblesAEquipo\" data-bs-toggle=\"modal\" data-bs-target=\"#modalEquipos\" data-action=\"AsignarFungiblesAEquipo\" name=\"btnFungiblesAEquipo\">Fungibles</button>&nbsp;")
                        .append("<button type=\"button\" class=\"btn btn-secondary btnHerramientasAEquipo\" data-bs-toggle=\"modal\" data-bs-target=\"#modalEquipos\" data-action=\"AsignarHerramientasAEquipo\" name=\"btnHerramientasAEquipo\">Herramientas</button>&nbsp;")
                        .append("<button type=\"button\" class=\"btn btn-warning btnEditar\" data-bs-toggle=\"modal\" data-bs-target=\"#modalEquipos\" data-action=\"Editar\" name=\"btnEditarTrabajo\">Editar</button>&nbsp;")
                        .append("<button type=\"button\" class=\"btn btn-danger btnEliminar\" data-bs-toggle=\"modal\" data-bs-target=\"#modalEquipos\" data-action=\"Eliminar\" name=\"btnEliminarTrabajo\">Eliminar</button>&nbsp;")
                        .append("</td>");

                tablaHTML.append("<td>").append(equipo.getId()).append("</td>")
                        .append("<td>").append(equipo.getNumIdentificacion()).append("</td>")
                        .append("<td>").append(equipo.getNombre()).append("</td>")
                        .append("<td>").append(equipo.getFechaCompra()).append("</td>")
                        .append("<td>").append(equipo.getFabricante()).append("</td>")
                        .append("<td>").append(equipo.getFechaUltimaCalibracion()).append("</td>")
                        .append("<td>").append(equipo.getFechaProximaCalibracion()).append("</td>");

                tablaHTML.append("</tr>");
            }
            tablaHTML.append("</tbody>");

            tablaHTML.append("</table>");
        }

        return tablaHTML.toString();
    }

    private String generarBotonHTML() {
        StringBuilder btnHTML = new StringBuilder();
        btnHTML.append("<button type=\"button\" class=\"btn btn-success\" data-bs-toggle=\"modal\" data-bs-target=\"#modalEquipos\" id=\"btnAgregarEquipo\">Agregar</button>");
        return btnHTML.toString();
    }

    private String generarFormularioHTML(HttpServletRequest request) {
        int ultimoNumEquipo = c.obtenerNumRegistro("equipos");
        List<Fungible> fungibles = c.leerFungibles();
        List<Herramienta> herramientas = c.leerHerramientas();
        request.setAttribute("ultimoNumEquipo", ultimoNumEquipo);
        StringBuilder formHTML = new StringBuilder();

        formHTML.append("<h5 id=\"tituloEliminar\">¿Seguro que deseas eliminar este equipo?</h5><form action=\"").append(request.getRequestURI()).append("\" method=\"post\" role=\"form\">")
                .append("<div class=\"row\" id=\"filasFormulario\">")
                // Columna nº de equipo
                .append("<div class=\"col-6\" id=\"columnaNumEquipo\">")
                .append("<label>Número de equipo:</label>")
                .append("<input type=\"text\" readonly=\"true\" value=\"")
                .append(ultimoNumEquipo)
                .append("\" class=\"form-control\" name=\"txtNumEquipo\" id=\"txtNumEquipo\">")
                .append("</div>")
                // Columna nº de identificación
                .append("<div class=\"col-6\" id=\"columnaNumIdentificacion\">")
                .append("<label>Número de identificación:</label>")
                .append("<input type=\"text\" class=\"form-control\" name=\"txtNumIdentificacion\" id=\"txtNumIdentificacion\" required placeholder=\"Número de identificación\">")
                .append("</div>")
                // Columna nombre
                .append("<div class=\"col-6\" id=\"columnaNombreEquipo\">")
                .append("<label>Nombre:</label>")
                .append("<input type=\"text\" class=\"form-control\" name=\"txtNombreEquipo\" id=\"txtNombreEquipo\" required placeholder=\"Nombre\">")
                .append("</div>")
                // Columna fecha de compra
                .append("<div class=\"col-6\" id=\"columnaFechaCompraEquipo\">")
                .append("<label>Fecha de compra del equipo:</label>")
                .append("<input type=\"date\" class=\"form-control\" name=\"txtFechaCompraEquipo\" id=\"txtFechaCompraEquipo\" required>")
                .append("</div>")
                // Columna fabricante
                .append("<div class=\"col-6\" id=\"columnaFabricanteEquipo\">")
                .append("<label>Fabricante del equipo:</label>")
                .append("<input type=\"text\" class=\"form-control\" name=\"txtFabricanteEquipo\" id=\"txtFabricanteEquipo\" required placeholder=\"Fabricante del equipo\">")
                .append("</div>")
                // Columna fecha última calibración
                .append("<div class=\"col-6\" id=\"columnaFechaUltimaCalibracion\">")
                .append("<label>Fecha última calibración:</label>")
                .append("<input type=\"date\" class=\"form-control\" name=\"txtFechaUltimaCalibracion\" id=\"txtFechaUltimaCalibracion\" required>")
                .append("</div>")
                // Columna fecha próxima calibración
                .append("<div class=\"col-6\" id=\"columnaFechaProximaCalibracion\">")
                .append("<label>Fecha próxima calibración:</label>")
                .append("<input type=\"date\" class=\"form-control\" name=\"txtFechaProximaCalibracion\" id=\"txtFechaProximaCalibracion\" required>")
                .append("</div>")
                // Columna fecha última calibración
                .append("<div class=\"col-6\" id=\"columnaFechaUltimoMantenimiento\">")
                .append("<label>Fecha último mantenimiento:</label>")
                .append("<input type=\"date\" class=\"form-control\" name=\"txtFechaUltimoMantenimiento\" id=\"txtFechaUltimoMantenimiento\" required>")
                .append("</div>")
                // Columna fecha próxima calibración
                .append("<div class=\"col-6\" id=\"columnaFechaProximoMantenimiento\">")
                .append("<label>Fecha próximo mantenimiento:</label>")
                .append("<input type=\"date\" class=\"form-control\" name=\"txtFechaProximoMantenimiento\" id=\"txtFechaProximoMantenimiento\" required>")
                .append("</div>")
                // Columna fungibles
                .append("<div class=\"col-6\" id=\"columnaFungibles\" style=\"display: none\">")
                .append("<label>Fungibles:</label>")
                .append("<select class=\"form-control\" name=\"selectFungibles\" id=\"selectFungibles\" multiple>");
        for (Fungible fungible : fungibles) {
            formHTML.append("<option name=\"opcFungibles\" value=\"").append(fungible.getId()).append("\">")
                    .append(fungible.getMarca()).append(" - ").append(fungible.getModelo())
                    .append("</option>");
        }
        formHTML.append("</select>").append("</div>")
                // Columna fungibles
                .append("<div class=\"col-6\" id=\"columnaHerramientas\" style=\"display: none\">")
                .append("<label>Herramientas:</label>")
                .append("<select class=\"form-control\" name=\"selectHerramientas\" id=\"selectHerramientas\" multiple>");
        for (Herramienta herramienta : herramientas) {
            formHTML.append("<option name=\"opcHerramientas\" value=\"").append(herramienta.getId()).append("\">")
                    .append(herramienta.getMarca()).append(" - ").append(herramienta.getModelo())
                    .append("</option>");
        }
        formHTML.append("</select>").append("</div>").append("</div>")
                .append("<div class=\"modal-footer\">")
                .append("<button type=\"submit\" name=\"btnAgregar\" class=\"btn btn-success\">Aceptar</button>")
                .append("<button type=\"submit\" name=\"btnAsignarFungiblesAEquipo\" style=\"display: none;\" class=\"btn btn-primary\">Aceptar</button>")
                .append("<button type=\"submit\" name=\"btnAsignarHerramientasAEquipo\" style=\"display: none;\" class=\"btn btn-secondary\">Aceptar</button>")
                .append("<button type=\"submit\" name=\"btnEditar\" style=\"display: none;\" class=\"btn btn-warning\">Aceptar</button>")
                .append("<button type=\"submit\" name=\"btnEliminar\" style=\"display: none;\" class=\"btn btn-danger\">Aceptar</button>")
                .append("<button type=\"button\" name=\"btnCancelar\" class=\"btn btn-dark\" data-bs-dismiss=\"modal\">Cancelar</button>")
                .append("</div>")
                .append("</form>");

        return formHTML.toString();
    }

}
