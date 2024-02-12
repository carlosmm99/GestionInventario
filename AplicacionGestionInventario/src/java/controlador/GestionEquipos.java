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
import java.util.List;
import modelo.Equipo;
import modelo.Fungible;
import modelo.Herramienta;

/**
 *
 * @author carlos.mondejar
 */
public class GestionEquipos extends HttpServlet {

    Controlador c = new Controlador();

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
//        String tablaEquipos = generarTablaHTML(request);
//        request.setAttribute("tablaEquipos", tablaEquipos);
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
        processRequest(request, response);
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
                        .append("data-action=\"Consultar\"")
                        .append("data-idEquipo=\"").append(equipo.getId()).append("\"")
                        .append("data-numIdentificacion=\"").append(equipo.getNumIdentificacion()).append("\"")
                        .append("data-nombre=\"").append(equipo.getNombre()).append("\"")
                        .append("data-fechaCompraEquipo=\"").append(equipo.getFechaCompra()).append("\"")
                        .append("data-fabricanteEquipo=\"").append(equipo.getFabricante()).append("\"")
                        .append("data-fechaUltimaCalibracion=\"").append(equipo.getFechaUltimaCalibracion()).append("\"")
                        .append("data-fechaProximaCalibracion=\"").append(equipo.getFechaProximaCalibracion()).append("\">");

                tablaHTML.append("<td>")
                        .append("<button type=\"button\" class=\"btn btn-warning btnEditar\" data-bs-toggle=\"modal\" data-bs-target=\"#modalEquipos\" data-action=\"Editar\" name=\"btnEditarTrabajo\">Editar</button>")
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

        formHTML.append("<form action=\"").append(request.getRequestURI()).append("\" method=\"post\" role=\"form\">")
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
                .append("<input type=\"text\" class=\"form-control\" name=\"txtNumIdentificacion\" id=\"txtNumIdentificacion\" required>")
                .append("</div>")
                // Columna nombre
                .append("<div class=\"col-6\" id=\"columnaNombre\">")
                .append("<label>Nombre:</label>")
                .append("<input type=\"text\" class=\"form-control\" name=\"txtNombre\" id=\"txtNombre\" required>")
                .append("</div>")
                // Columna fecha de compra
                .append("<div class=\"col-6\" id=\"columnaFechaCompra\">")
                .append("<label>Fecha de compra del equipo:</label>")
                .append("<input type=\"date\" class=\"form-control\" name=\"txtFechaCompraEquipo\" id=\"txtFechaCompraEquipo\" required>")
                .append("</div>")
                // Columna fabricante
                .append("<div class=\"col-6\" id=\"columnaFabricanteEquipo\">")
                .append("<label>Fabricante del equipo:</label>")
                .append("<input type=\"text\" class=\"form-control\" name=\"txtFabricanteEquipo\" id=\"txtFabricanteEquipo\" required>")
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
                // Columna fungibles
                .append("<div class=\"col-6\" id=\"columnaFungibles\" style=\"display: none\">")
                .append("<label>Fungibles:</label>")
                .append("<select class=\"form-control\" name=\"selectFungibles\" id=\"selectFungibles\" multiple required>");
        for (Fungible fungible : fungibles) {
            formHTML.append("<option name=\"opcFungibles\" value=\"").append(fungible.getId()).append("\">")
                    .append(fungible.getMarca()).append(" - ").append(fungible.getModelo())
                    .append("</option>");
        }
        formHTML.append("</select>").append("</div>")
                // Columna fungibles
                .append("<div class=\"col-6\" id=\"columnaHerramientas\" style=\"display: none\">")
                .append("<label>Herramientas:</label>")
                .append("<select class=\"form-control\" name=\"selectHerramientas\" id=\"selectHerramientas\" multiple required>");
        for (Herramienta herramienta : herramientas) {
            formHTML.append("<option name=\"opcHerramientas\" value=\"").append(herramienta.getId()).append("\">")
                    .append(herramienta.getMarca()).append(" - ").append(herramienta.getModelo())
                    .append("</option>");
        }
        formHTML.append("</select>").append("</div>").append("</div>")
                .append("<div>");
        
        return formHTML.toString();
    }

}
