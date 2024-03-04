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
import java.util.ArrayList;
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
public class GestionHerramientas extends HttpServlet {

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
            out.println("<title>Servlet GestionHerramientas</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet GestionHerramientas at " + request.getContextPath() + "</h1>");
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
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            String usuario = (String) request.getSession().getAttribute("usuario");
            if (usuario != null) {
                Integer rol = (Integer) request.getSession().getAttribute("rol");
                String btnAgregar = generarBotonHTML(usuario, rol);
                request.setAttribute("btnAgregar", btnAgregar);
                String tablaHerramientas = generarTablaHTML(request, usuario, rol);
                request.setAttribute("tablaHerramientas", tablaHerramientas);
                String formHerramientas = generarFormularioHTML(request);
                request.setAttribute("formHerramientas", formHerramientas);
                request.getRequestDispatcher("herramientas.jsp").forward(request, response);
            } else {
                request.getRequestDispatcher("error.jsp").include(request, response);
                // Obtiene la URL base de la aplicación
                String baseURL = request.getRequestURL().toString().replace(request.getRequestURI(), request.getContextPath());
                out.write("<div><p class=\"text-center\" style=\"color: red; font-weight: bold;\">Para gestionar herramientas debe <a href=\"" + baseURL + "\">" + "autenticarse</a> primero.</p></div>");
            }
        }
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
        int id = 0;
        Date fechaCompra = null;
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        try {
            Herramienta h = new Herramienta();
            String idStr = request.getParameter("txtNumHerramienta");
            if (idStr != null) {
                id = Integer.parseInt(idStr);
                h.setId(id);
            }
            String marca = request.getParameter("txtMarcaHerramienta");
            if (marca != null) {
                h.setMarca(marca);
            }
            String modelo = request.getParameter("txtModeloHerramienta");
            if (modelo != null) {
                h.setModelo(modelo);
            }
            String fabricante = request.getParameter("txtFabricanteHerramienta");
            if (fabricante != null) {
                h.setFabricante(fabricante);
            }
            String fechaCompraStr = request.getParameter("txtFechaCompraHerramienta");
            if (fechaCompraStr != null) {
                fechaCompra = dateFormat.parse(fechaCompraStr);
                h.setFechaCompra(fechaCompra);
            }
            String nombreArchivo = request.getParameter("txtFotoHerramienta");
            if (nombreArchivo != null) {
                h.setFoto(nombreArchivo);
            }
            h.setEquipos(c.obtenerEquiposPorHerramienta(h));
            h.setFungibles(c.obtenerFungiblesPorHerramienta(h));
            String[] opcionesEquipos = request.getParameterValues("selectEquipos");
            String[] opcionesFungibles = request.getParameterValues("selectFungibles");
            if (opcionesEquipos != null) {
                for (String idEquipo : opcionesEquipos) {
                    Equipo e = c.buscarEquipo(Integer.parseInt(idEquipo));
                    if (e != null) {
                        e.setHerramientas(c.obtenerHerramientasPorEquipo(e));
                        e.getHerramientas().add(h);
                        h.getEquipos().add(e);
                    }
                }
            }
            if (opcionesFungibles != null) {
                for (String idFungible : opcionesFungibles) {
                    Fungible f = c.buscarFungible(Integer.parseInt(idFungible));
                    if (f != null) {
                        f.setHerramientas(c.obtenerHerramientasPorFungible(f));
                        f.getHerramientas().add(h);
                        h.getFungibles().add(f);
                    }
                }
            }

            int res = 0;
            String mensaje = "";
            if (request.getParameter("btnAgregar") != null) {
                res = c.insertarHerramienta(h);
                if (res != 0) {
                    mensaje = "Herramienta con id " + h.getId() + " dada de alta correctamente";
                } else {
                    mensaje = "Error al dar de alta la herramienta con id " + h.getId();
                }
            } else if (request.getParameter("btnEditar") != null) {
                res = c.modificarHerramienta(h);
                if (res != 0) {
                    mensaje = "Herramienta con id " + h.getId() + " modificada correctamente";
                } else {
                    mensaje = "Error al modificar la herramienta con id " + h.getId();
                }
            } else if (request.getParameter("btnEliminar") != null) {
                res = c.borrarHerramienta(h);
                if (res != 0) {
                    mensaje = "Herramienta con id " + h.getId() + " dada de baja correctamente";
                } else {
                    mensaje = "Error al dar de baja la herramienta con id " + h.getId();
                }
            }

            // Establecer atributos para mostrar el cuadro de diálogo y redirigir
            request.setAttribute("showDialog", true);
            request.setAttribute("message", mensaje);
            request.getRequestDispatcher("herramientas.jsp").forward(request, response);
        } catch (ParseException ex) {
            Logger.getLogger(GestionHerramientas.class.getName()).log(Level.SEVERE, null, ex);
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

    private String generarBotonHTML(String usuario, Integer rol) {
        if (usuario != null && rol.equals(1)) {
            StringBuilder btnHTML = new StringBuilder();
            btnHTML.append("<button type=\"button\" class=\"btn btn-success\" data-bs-toggle=\"modal\" data-bs-target=\"#modalHerramientas\" id=\"btnAgregarHerramienta\">Agregar</button>");
            return btnHTML.toString();
        } else {
            return null;
        }
    }

    private String generarFormularioHTML(HttpServletRequest request) {
        int ultimoNumHerramienta = c.obtenerNumRegistro("herramientas");
        List<Equipo> equipos = c.leerEquipos();
        List<Fungible> fungibles = c.leerFungibles();
        request.setAttribute("ultimoNumHerramienta", ultimoNumHerramienta);
        StringBuilder formHTML = new StringBuilder();

        formHTML.append("<h6 id=\"titulo\">¿Seguro que deseas eliminar esta herramienta?</h6><form action=\"").append(request.getRequestURI()).append("\" method=\"post\" role=\"form\">")
                .append("<div class=\"row\" id=\"filasFormulario\">")
                // Columna nº de herramienta
                .append("<div class=\"col-6\" id=\"columnaNumHerramienta\" style=\"display: none;\">")
                .append("<label>Número de herramienta:</label>")
                .append("<input type=\"text\" readonly=\"true\" value=\"")
                .append(ultimoNumHerramienta)
                .append("\" class=\"form-control\" name=\"txtNumHerramienta\" id=\"txtNumHerramienta\">")
                .append("</div>")
                // Columna marca de la herramienta
                .append("<div class=\"col-6\" id=\"columnaMarcaHerramienta\">")
                .append("<label>Marca de la herramienta:</label>")
                .append("<input type=\"text\" class=\"form-control\" name=\"txtMarcaHerramienta\" id=\"txtMarcaHerramienta\" required placeholder=\"Marca de la herramienta\">")
                .append("</div>")
                // Columna modelo de la herramienta
                .append("<div class=\"col-6\" id=\"columnaModeloHerramienta\">")
                .append("<label>Modelo de la herramienta:</label>")
                .append("<input type=\"text\" class=\"form-control\" name=\"txtModeloHerramienta\" id=\"txtModeloHerramienta\" required placeholder=\"Modelo de la herramienta\">")
                .append("</div>")
                // Columna fabricante
                .append("<div class=\"col-6\" id=\"columnaFabricanteHerramienta\">")
                .append("<label>Fabricante de la herramienta:</label>")
                .append("<input type=\"text\" class=\"form-control\" name=\"txtFabricanteHerramienta\" id=\"txtFabricanteHerramienta\" required placeholder=\"Fabricante de la herramienta\">")
                .append("</div>")
                // Columna fecha de compra
                .append("<div class=\"col-6\" id=\"columnaFechaCompraHerramienta\">")
                .append("<label>Fecha de compra de la herramienta:</label>")
                .append("<input type=\"date\" class=\"form-control\" name=\"txtFechaCompraHerramienta\" id=\"txtFechaCompraHerramienta\" required>")
                .append("</div>")
                // Columna equipos
                .append("<div class=\"col-6\" id=\"columnaEquipos\">")
                .append("<label>Equipos:</label>")
                .append("<select class=\"form-control\" name=\"selectEquipos\" id=\"selectEquipos\" multiple required>");
        for (Equipo equipo : equipos) {
            formHTML.append("<option name=\"opcEquipos\" value=\"").append(equipo.getId()).append("\">")
                    .append(equipo.getNumInventario()).append(" - ").append(equipo.getNombre())
                    .append("</option>");
        }
        formHTML.append("</select>").append("</div>")
                // Columna fungibles
                .append("<div class=\"col-6\" id=\"columnaFungibles\">")
                .append("<label>Fungibles:</label>")
                .append("<select class=\"form-control\" name=\"selectFungibles\" id=\"selectFungibles\" multiple required>");
        for (Fungible fungible : fungibles) {
            formHTML.append("<option name=\"opcFungibles\" value=\"").append(fungible.getId()).append("\">")
                    .append(fungible.getMarca()).append(" - ").append(fungible.getModelo())
                    .append("</option>");
        }
        formHTML.append("</select>").append("</div>");
        // Columna imagen
        formHTML.append("<div class=\"col-6\" id=\"columnaFotoHerramienta\">")
                .append("<label>Foto:</label>")
                .append("<input type=\"file\" class=\"form-control\" name=\"inputFotoHerramienta\" id=\"inputFotoHerramienta\" style=\"display: none;\">")
                .append("<label for=\"inputFotoHerramienta\" id=\"labelFotoHerramienta\" name=\"labelFotoHerramienta\">")
                .append("<img src=\"#\" id=\"imgHerramienta\">")
                .append("</label>")
                .append("<input type=\"text\" id=\"txtFotoHerramienta\" name=\"txtFotoHerramienta\" readonly=\"true\" style=\"display: none;\">")
                .append("</div>").append("</div>");
        formHTML.append("<div class=\"modal-footer\">")
                .append("<button type=\"submit\" name=\"btnAgregar\" class=\"btn btn-success\">Enviar</button>")
                .append("<button type=\"submit\" name=\"btnEditar\" style=\"display: none;\" class=\"btn btn-warning\">Enviar</button>")
                .append("<button type=\"submit\" name=\"btnEliminar\" style=\"display: none;\" class=\"btn btn-danger\">Confirmar</button>")
                .append("<button type=\"button\" name=\"btnCancelar\" class=\"btn btn-dark\" data-bs-dismiss=\"modal\">Cancelar</button>")
                .append("</div>")
                .append("</form>");

        return formHTML.toString();
    }

    private String generarTablaHTML(HttpServletRequest request, String usuario, Integer rol) {
        List<Herramienta> herramientas = c.leerHerramientas();
        StringBuilder tablaHTML = new StringBuilder();

        if (herramientas != null || !herramientas.isEmpty()) {
            tablaHTML.append("<table id=\"tablaHerramientas\" class=\"table table-bordered table-hover display responsive nowrap\" width=\"100%\">")
                    .append("<thead><tr>");

            if (usuario != null && rol.equals(1)) {
                tablaHTML.append("<th scope=\"col\">Acciones</th>");
            }

            tablaHTML.append("<th scope=\"col\" id=\"celdaEncabezadoIdHerramienta\">ID</th><th scope=\"col\" id=\"celdaEncabezadoMarcaFungible\">Marca</th>")
                    .append("<th scope=\"col\">Modelo</th><th scope=\"col\">Fabricante</th>")
                    .append("<th scope=\"col\">Fecha de compra</th><th scope=\"col\">Foto</th>");

            tablaHTML.append("</tr></thead>");

            tablaHTML.append("<tbody>");
            for (Herramienta herramienta : herramientas) {
                List<Equipo> equipos = c.obtenerEquiposPorHerramienta(herramienta);
                List<Integer> numEquipos = new ArrayList<>();
                for (Equipo equipo : equipos) {
                    numEquipos.add(equipo.getId());
                }
                List<Fungible> fungibles = c.obtenerFungiblesPorHerramienta(herramienta);
                List<Integer> numFungibles = new ArrayList<>();
                for (Fungible fungible : fungibles) {
                    numFungibles.add(fungible.getId());
                }
                tablaHTML.append("<tr id=fila_").append(herramienta.getId()).append("\"")
                        .append(" data-action=\"Consultar\"")
                        .append(" data-idherramienta=\"").append(herramienta.getId()).append("\"")
                        .append(" data-marcaherramienta=\"").append(herramienta.getMarca()).append("\"")
                        .append(" data-modeloherramienta=\"").append(herramienta.getModelo()).append("\"")
                        .append(" data-fabricanteherramienta=\"").append(herramienta.getFabricante()).append("\"")
                        .append(" data-fechacompraherramienta=\"").append(herramienta.getFechaCompra()).append("\"")
                        .append(" data-numequipos=\"").append(numEquipos).append("\"")
                        .append(" data-numfungibles=\"").append(numFungibles).append("\"")
                        .append(" data-fotoherramienta=\"").append(herramienta.getFoto()).append("\">");

                if (usuario != null && rol.equals(1)) {
                    tablaHTML.append("<td>")
                            .append("<button type=\"button\" class=\"btn btn-warning btnEditar\" data-bs-toggle=\"modal\" data-bs-target=\"#modalHerramientas\" data-action=\"Editar\" name=\"btnEditarFungible\">Editar</button>&nbsp;")
                            .append("<button type=\"button\" class=\"btn btn-danger btnEliminar\" data-bs-toggle=\"modal\" data-bs-target=\"#modalHerramientas\" data-action=\"Eliminar\" name=\"btnEliminarFungible\">Eliminar</button>&nbsp;")
                            .append("</td>");
                }

                tablaHTML.append("<td id=\"celdaIdHerramienta\">").append(herramienta.getId()).append("</td>")
                        .append("<td>").append(herramienta.getMarca()).append("</td>")
                        .append("<td>").append(herramienta.getModelo()).append("</td>")
                        .append("<td>").append(herramienta.getFabricante()).append("</td>")
                        .append("<td>").append(herramienta.getFechaCompra()).append("</td>")
                        .append("<td>").append("<img src=\"").append(request.getContextPath()).append("/img2/").append(herramienta.getFoto()).append("\">").append("</td>").append("</tr>");
            }
            tablaHTML.append("</tbody>").append("</table>");
        }

        request.setAttribute("cantidadHerramientas", herramientas.size());

        return tablaHTML.toString();
    }
}
