/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controlador;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Part;
import java.io.File;
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
@MultipartConfig(maxFileSize = 10485760L) // 10MB máximo de subida de ficheros
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
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            String usuario = (String) request.getSession().getAttribute("usuario");
            if (usuario != null) {
                Integer rol = (Integer) request.getSession().getAttribute("rol");
                String btnAgregar = generarBotonHTML(usuario, rol);
                request.setAttribute("btnAgregar", btnAgregar);
                String tablaEquipos = generarTablaHTML(request, usuario, rol);
                request.setAttribute("tablaEquipos", tablaEquipos);
                String formEquipos = generarFormularioHTML(request);
                request.setAttribute("formEquipos", formEquipos);
                request.getRequestDispatcher("equipos.jsp").forward(request, response);
            } else {
                request.getRequestDispatcher("error.jsp").include(request, response);
                // Obtiene la URL base de la aplicación
                String baseURL = request.getRequestURL().toString().replace(request.getRequestURI(), request.getContextPath());
                out.write("<div><p class=\"text-center\" style=\"color: red; font-weight: bold;\">Para gestionar equipos debe <a href=\"" + baseURL + "\">" + "autenticarse</a> primero.</p></div>");
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
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        try {
            Equipo e = new Equipo();
            String idStr = request.getParameter("txtNumEquipo");
            if (idStr != null) {
                int id = Integer.parseInt(idStr);
                e.setId(id);
            }
            String numInventarioStr = request.getParameter("txtNumInventarioCEDEX");
            if (numInventarioStr != null) {
                int numInventario = Integer.parseInt(numInventarioStr);
                e.setNumInventario(numInventario);
            }
            String nombre = request.getParameter("txtNombreEquipo");
            if (nombre != null) {
                e.setNombre(nombre);
            }
            String fechaCompraEquipoStr = request.getParameter("txtFechaCompraEquipo");
            if (fechaCompraEquipoStr != null) {
                Date fechaCompraEquipo = dateFormat.parse(fechaCompraEquipoStr);
                e.setFechaCompra(fechaCompraEquipo);
            }
            String fabricante = request.getParameter("txtFabricanteEquipo");
            if (fabricante != null) {
                e.setFabricante(fabricante);
            }
            String fechaUltimaCalibracionStr = request.getParameter("txtFechaUltimaCalibracion");
            if (fechaUltimaCalibracionStr != null) {
                Date fechaUltimaCalibracion = dateFormat.parse(fechaUltimaCalibracionStr);
                e.setFechaUltimaCalibracion(fechaUltimaCalibracion);
            }
            String fechaProximaCalibracionStr = request.getParameter("txtFechaProximaCalibracion");
            if (fechaProximaCalibracionStr != null) {
                Date fechaProximaCalibracion = dateFormat.parse(fechaProximaCalibracionStr);
                e.setFechaProximaCalibracion(fechaProximaCalibracion);
            }
            String fechaUltimoMantenimientoStr = request.getParameter("txtFechaUltimoMantenimiento");
            if (fechaUltimoMantenimientoStr != null) {
                Date fechaUltimoMantenimiento = dateFormat.parse(fechaUltimoMantenimientoStr);
                e.setFechaUltimoMantenimiento(fechaUltimoMantenimiento);
            }
            String fechaProximoMantenimientoStr = request.getParameter("txtFechaProximoMantenimiento");
            if (fechaProximoMantenimientoStr != null) {
                Date fechaProximoMantenimiento = dateFormat.parse(fechaProximoMantenimientoStr);
                e.setFechaProximoMantenimiento(fechaProximoMantenimiento);
            }
            Part parteArchivo = request.getPart("inputFotoEquipo"); // Recibe la imagen en un objeto de tipo Part
            if (parteArchivo != null) {
                if (parteArchivo.getSize() > 0 && parteArchivo.getContentType().startsWith("image/")) {
                    String rutaArchivo = request.getServletContext().getRealPath("/img2");
                    parteArchivo.write(rutaArchivo + File.separator + parteArchivo.getSubmittedFileName()); // Guarda en el disco con nombre original
                    e.setFoto(parteArchivo.getSubmittedFileName());
                } else if (parteArchivo.getSize() <= 0) { // Verifica si el tamaño del archivo es menor o igual a 0
                    // Obtiene la extensión de la imagen
                    String fotoEquipo = request.getParameter("txtFotoEquipo");
                    String extension = fotoEquipo.substring(fotoEquipo.lastIndexOf(".") + 1);
                    // Verifica si la extensión es de imagen
                    if (extension.equalsIgnoreCase("tiff") || extension.equalsIgnoreCase("jfif")
                            || extension.equalsIgnoreCase("bmp") || extension.equalsIgnoreCase("gif")
                            || extension.equalsIgnoreCase("svg") || extension.equalsIgnoreCase("png")
                            || extension.equalsIgnoreCase("webp") || extension.equalsIgnoreCase("svgz")
                            || extension.equalsIgnoreCase("jpg") || extension.equalsIgnoreCase("jpeg")
                            || extension.equalsIgnoreCase("ico") || extension.equalsIgnoreCase("xbm")
                            || extension.equalsIgnoreCase("dib") || extension.equalsIgnoreCase("pip")
                            || extension.equalsIgnoreCase("apng") || extension.equalsIgnoreCase("tif")
                            || extension.equalsIgnoreCase("pjpeg") || extension.equalsIgnoreCase("avif")) {
                        e.setFoto(fotoEquipo);
                    }
                }
            }
            e.setFungibles(c.obtenerFungiblesPorEquipo(e));
            e.setHerramientas(c.obtenerHerramientasPorEquipo(e));
            String[] opcionesFungibles = request.getParameterValues("selectFungibles");
            String[] opcionesHerramientas = request.getParameterValues("selectHerramientas");
            if (opcionesFungibles != null) {
                for (String idFungible : opcionesFungibles) {
                    Fungible f = c.buscarFungible(Integer.parseInt(idFungible));
                    boolean exists = false;
                    if (f != null) {
                        for (Fungible fungible : e.getFungibles()) {
                            if (fungible.getId() == f.getId()) {
                                exists = true;
                                break;
                            }
                        }
                        for (Equipo equipo : f.getEquipos()) {
                            if (equipo.getId() == e.getId()) {
                                exists = true;
                                break;
                            }
                        }
                        if (!exists) {
                            e.getFungibles().add(f);
                            f.getEquipos().add(e);
                        }
                    }
                }
            }
            if (opcionesHerramientas != null) {
                for (String idHerramienta : opcionesHerramientas) {
                    Herramienta h = c.buscarHerramienta(Integer.parseInt(idHerramienta));
                    boolean exists = false;
                    if (h != null) {
                        for (Herramienta herramienta : e.getHerramientas()) {
                            if (herramienta.getId() == h.getId()) {
                                exists = true;
                                break;
                            }
                        }
                        for (Equipo equipo : h.getEquipos()) {
                            if (equipo.getId() == h.getId()) {
                                exists = true;
                                break;
                            }
                        }
                        if (!exists) {
                            e.getHerramientas().add(h);
                            h.getEquipos().add(e);
                        }
                    }
                }
            }
            int res;
            String mensaje = "";
            if (request.getParameter("btnAgregar") != null) {
                res = c.insertarEquipo(e);
                if (res != 0) {
                    mensaje = "Equipo con id " + e.getId() + " dado de alta correctamente";
                } else {
                    mensaje = "Error al dar de alta el equipo con id " + e.getId();
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
                    mensaje = "Equipo con id " + e.getId() + " dado de baja correctamente";
                } else {
                    mensaje = "Error al dar de baja el equipo con id " + e.getId();
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

    private String generarBotonHTML(String usuario, Integer rol) {
        if (usuario != null && rol.equals(1)) {
            StringBuilder btnHTML = new StringBuilder();
            btnHTML.append("<button type=\"button\" class=\"btn btn-success\" data-bs-toggle=\"modal\" data-bs-target=\"#modalEquipos\" id=\"btnAgregarEquipo\">Agregar</button>");
            return btnHTML.toString();
        } else {
            return null;
        }
    }

    private String generarFormularioHTML(HttpServletRequest request) {
        int ultimoNumEquipo = c.obtenerNumRegistro("equipos");
        List<Fungible> fungibles = c.leerFungibles();
        List<Herramienta> herramientas = c.leerHerramientas();
        request.setAttribute("ultimoNumEquipo", ultimoNumEquipo);
        StringBuilder formHTML = new StringBuilder();

        formHTML.append("<h6 id=\"titulo\"></h6><form action=\"").append(request.getRequestURI()).append("\" method=\"post\" role=\"form\" enctype=\"multipart/form-data\">")
                .append("<div class=\"row\" id=\"filasFormulario\">")
                // Columna id de equipo
                .append("<div class=\"col-6\" id=\"columnaNumEquipo\">")
                .append("<label>ID del equipo:</label>")
                .append("<input type=\"text\" readonly=\"true\" value=\"")
                .append(ultimoNumEquipo)
                .append("\" class=\"form-control\" name=\"txtNumEquipo\" id=\"txtNumEquipo\">")
                .append("</div>")
                // Columna nº de identificación
                .append("<div class=\"col-6\" id=\"columnaNumInventarioCEDEX\">")
                .append("<label>Número inventario CEDEX:</label>")
                .append("<input type=\"text\" class=\"form-control\" name=\"txtNumInventarioCEDEX\" id=\"txtNumInventarioCEDEX\" required placeholder=\"Número de identificación\">")
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
                .append("<div class=\"col-6\" id=\"columnaFungibles\">")
                .append("<label>Fungibles:</label>")
                .append("<select class=\"form-control\" name=\"selectFungibles\" id=\"selectFungibles\" multiple required>");
        for (Fungible fungible : fungibles) {
            formHTML.append("<option name=\"opcFungibles\" value=\"").append(fungible.getId()).append("\">")
                    .append(fungible.getMarca()).append(" - ").append(fungible.getModelo())
                    .append("</option>");
        }
        formHTML.append("</select>").append("</div>")
                // Columna herramientas
                .append("<div class=\"col-6\" id=\"columnaHerramientas\">")
                .append("<label>Herramientas:</label>")
                .append("<select class=\"form-control\" name=\"selectHerramientas\" id=\"selectHerramientas\" multiple required>");
        for (Herramienta herramienta : herramientas) {
            formHTML.append("<option name=\"opcHerramientas\" value=\"").append(herramienta.getId()).append("\">")
                    .append(herramienta.getMarca()).append(" - ").append(herramienta.getModelo())
                    .append("</option>");
        }
        formHTML.append("</select>").append("</div>");
        // Columna imagen
        formHTML.append("<div class=\"col-6\" id=\"columnaFotoEquipo\">")
                .append("<label>Foto:</label>")
                .append("<input type=\"file\" class=\"form-control\" name=\"inputFotoEquipo\" id=\"inputFotoEquipo\" accept=\"image/*\">")
                .append("<label id=\"labelFotoEquipo\" name=\"labelFotoEquipo\">")
                .append("<img src=\"#\" id=\"imgEquipo\">")
                .append("</label>")
                .append("<input type=\"text\" id=\"txtFotoEquipo\" name=\"txtFotoEquipo\" readonly=\"true\" style=\"display: none;\">")
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
        List<Equipo> equipos = c.leerEquipos();
        StringBuilder tablaHTML = new StringBuilder();

        if (equipos != null && !equipos.isEmpty()) {
            if (usuario != null) {
                tablaHTML.append("<table id=\"tablaEquipos\" class=\"table table-bordered table-hover display responsive nowrap\" width=\"100%\">")
                        .append("<thead><tr>");

                if (rol.equals(1)) {
                    tablaHTML.append("<th scope=\"col\">Acciones</th>");
                }

                tablaHTML.append("<th scope=\"col\" id=\"celdaEncabezadoIdEquipo\">ID</th><th scope=\"col\">Nº inventario CEDEX</th>")
                        .append("<th scope=\"col\">Nombre</th><th scope=\"col\">Fecha de compra</th>")
                        .append("<th scope=\"col\">Fabricante</th><th scope=\"col\">Fecha última calibración</th>")
                        .append("<th scope=\"col\">Fecha próxima calibración</th><th scope=\"col\">Fecha último mantenimiento</th>")
                        .append("<th scope=\"col\">Fecha próximo mantenimiento</th><th scope=\"col\">Listado de fungibles del equipo</th>")
                        .append("<th scope=\"col\">Listado de herramientas del equipo</th><th scope=\"col\">Foto</th>");

                tablaHTML.append("</tr></thead>");

                tablaHTML.append("<tbody>");
                for (Equipo equipo : equipos) {
                    List<Fungible> fungibles = c.obtenerFungiblesPorEquipo(equipo);
                    List<Integer> numFungibles = new ArrayList<>();
                    for (Fungible fungible : fungibles) {
                        numFungibles.add(fungible.getId());
                    }
                    List<Herramienta> herramientas = c.obtenerHerramientasPorEquipo(equipo);
                    List<Integer> numHerramientas = new ArrayList<>();
                    for (Herramienta herramienta : herramientas) {
                        numHerramientas.add(herramienta.getId());
                    }
                    equipo.setFungibles(fungibles);
                    equipo.setHerramientas(herramientas);
                    tablaHTML.append("<tr id=fila_").append(equipo.getId()).append("\"")
                            .append(" data-action=\"Consultar\"")
                            .append(" data-idequipo=\"").append(equipo.getId()).append("\"")
                            .append(" data-numinventariocedex=\"").append(equipo.getNumInventario()).append("\"")
                            .append(" data-nombre=\"").append(equipo.getNombre()).append("\"")
                            .append(" data-fechacompraequipo=\"").append(equipo.getFechaCompra()).append("\"")
                            .append(" data-fabricanteequipo=\"").append(equipo.getFabricante()).append("\"")
                            .append(" data-fechaultimacalibracion=\"").append(equipo.getFechaUltimaCalibracion()).append("\"")
                            .append(" data-fechaproximacalibracion=\"").append(equipo.getFechaProximaCalibracion()).append("\"")
                            .append(" data-fechaultimomantenimiento=\"").append(equipo.getFechaUltimoMantenimiento()).append("\"")
                            .append(" data-fechaproximomantenimiento=\"").append(equipo.getFechaProximoMantenimiento()).append("\"")
                            .append(" data-numfungibles=\"").append(numFungibles).append("\"")
                            .append(" data-numherramientas=\"").append(numHerramientas).append("\"")
                            .append(" data-fotoequipo=\"").append(equipo.getFoto()).append("\">");

                    if (rol.equals(1)) {
                        tablaHTML.append("<td>")
                                .append("<button type=\"button\" class=\"btn btn-warning btnEditar\" data-bs-toggle=\"modal\" data-bs-target=\"#modalEquipos\" data-action=\"Editar\" name=\"btnEditarTrabajo\">Editar</button>&nbsp;")
                                .append("<button type=\"button\" class=\"btn btn-danger btnEliminar\" data-bs-toggle=\"modal\" data-bs-target=\"#modalEquipos\" data-action=\"Eliminar\" name=\"btnEliminarTrabajo\">Eliminar</button>&nbsp;")
                                .append("</td>");
                    }

                    tablaHTML.append("<td>").append(equipo.getId()).append("</td>")
                            .append("<td>").append(equipo.getNumInventario()).append("</td>")
                            .append("<td>").append(equipo.getNombre()).append("</td>")
                            .append("<td>").append(equipo.getFechaCompra()).append("</td>")
                            .append("<td>").append(equipo.getFabricante()).append("</td>")
                            .append("<td>").append(equipo.getFechaUltimaCalibracion()).append("</td>")
                            .append("<td>").append(equipo.getFechaProximaCalibracion()).append("</td>")
                            .append("<td>").append(equipo.getFechaUltimoMantenimiento()).append("</td>")
                            .append("<td>").append(equipo.getFechaProximoMantenimiento()).append("</td>")
                            .append("<td><br>");
                    for (Fungible fungible : equipo.getFungibles()) {
                        tablaHTML.append(fungible).append(";<br>");
                    }
                    tablaHTML.append("</td><td><br>");
                    for (Herramienta herramienta : equipo.getHerramientas()) {
                        tablaHTML.append(herramienta).append(";<br>");
                    }
                    tablaHTML.append("</td>")
                            .append("<td><img class=\"foto\" id=\"fotoEquipo").append(equipo.getId()).append("\" src=\"").append(request.getContextPath()).append("/img2/").append(equipo.getFoto()).append("\"></td></tr>");
                }
                tablaHTML.append("</tbody></table>");
                request.setAttribute("cantidadEquipos", equipos.size());
            }
            tablaHTML.append("<hr><footer>")
                    .append("<h4>Realizado por: Carlos Mondéjar Morcillo</h4><h4>Última actualización: 20/03/2024</h4>")
                    .append("</footer>");
        }

        return tablaHTML.toString();
    }
}
