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
import java.util.ArrayList;
import java.util.List;
import modelo.Equipo;
import modelo.Fungible;
import modelo.Herramienta;

/**
 *
 * @author carlos.mondejar
 */
public class GestionFungibles extends HttpServlet {

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
            out.println("<title>Servlet GestionFungibles</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet GestionFungibles at " + request.getContextPath() + "</h1>");
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
        String tablaFungibles = generarTablaHTML(request);
        request.setAttribute("tablaFungibles", tablaFungibles);
        String formFungibles = generarFormularioHTML(request);
        request.setAttribute("formFungibles", formFungibles);
        request.getRequestDispatcher("fungibles.jsp").forward(request, response);
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
        String idStr = request.getParameter("txtNumFungible");
        String marca = request.getParameter("txtMarcaFungible");
        String modelo = request.getParameter("txtModeloFungible");
        String tamanyo = request.getParameter("txtTamanyo");
        String cantidadStr = request.getParameter("txtCantidad");
        int id = idStr != null && !idStr.isEmpty() ? Integer.parseInt(idStr) : 0;
        int cantidad = cantidadStr != null && !cantidadStr.isEmpty() ? Integer.parseInt(cantidadStr) : 0;
        Fungible f = new Fungible(id, marca, modelo, tamanyo, cantidad);
        String[] opcionesEquipos = request.getParameterValues("selectEquipos");
        if (opcionesEquipos != null) {
            for (String idEquipo : opcionesEquipos) {
                Equipo e = c.buscarEquipo(Integer.parseInt(idEquipo));
                boolean exists = false;
                if (e != null) {
                    for (Equipo equipo : f.getEquipos()) {
                        if (equipo.getId() == e.getId()) {
                            exists = true;
                            break;
                        }
                    }
                    for (Fungible fungible : e.getFungibles()) {
                        if (fungible.getId() == f.getId()) {
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
        String[] opcionesHerramientas = request.getParameterValues("selectHerramientas");
        if (opcionesHerramientas != null) {
            for (String idHerramienta : opcionesHerramientas) {
                Herramienta h = c.buscarHerramienta(Integer.parseInt(idHerramienta));
                boolean exists = false;
                if (h != null) {
                    for (Herramienta herramienta : f.getHerramientas()) {
                        if (herramienta.getId() == h.getId()) {
                            exists = true;
                            break;
                        }
                    }
                    for (Fungible fungible : h.getFungibles()) {
                        if (fungible.getId() == f.getId()) {
                            exists = true;
                            break;
                        }
                    }
                    if (!exists) {
                        f.getHerramientas().add(h);
                        h.getFungibles().add(f);
                    }
                }
            }
        }
        int res = 0;
        String mensaje = "";
        if (request.getParameter("btnAgregar") != null) {
            res = c.insertarFungible(f);
            if (res != 0) {
                mensaje = "Fungible con id " + f.getId() + " dado de alta correctamente";
            } else {
                mensaje = "Error al dar de alta el fungible con id " + f.getId();
            }
        } else if (request.getParameter("btnEditar") != null) {
            res = c.modificarFungible(f);
            if (res != 0) {
                mensaje = "Fungible con id " + f.getId() + " modificado correctamente";
            } else {
                mensaje = "Error al modificar el fungible con id " + f.getId();
            }
        } else if (request.getParameter("btnEliminar") != null) {
            res = c.borrarFungible(f);
            if (res != 0) {
                mensaje = "Fungible con id " + f.getId() + " dado de baja correctamente";
            } else {
                mensaje = "Error al dar de baja el fungible con id " + f.getId();
            }
        }

        // Establecer atributos para mostrar el cuadro de diálogo y redirigir
        request.setAttribute("showDialog", true);
        request.setAttribute("message", mensaje);
        request.getRequestDispatcher("fungibles.jsp").forward(request, response);
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

    private String generarBotonHTML() {
        StringBuilder btnHTML = new StringBuilder();
        btnHTML.append("<button type=\"button\" class=\"btn btn-success\" data-bs-toggle=\"modal\" data-bs-target=\"#modalFungibles\" id=\"btnAgregarFungible\">Agregar</button>");
        return btnHTML.toString();
    }

    private String generarFormularioHTML(HttpServletRequest request) {
        int ultimoNumFungible = c.obtenerNumRegistro("fungibles");
        List<Equipo> equipos = c.leerEquipos();
        List<Herramienta> herramientas = c.leerHerramientas();
        request.setAttribute("ultimoNumFungible", ultimoNumFungible);
        StringBuilder formHTML = new StringBuilder();

        formHTML.append("<h6 id=\"tituloEliminar\">¿Seguro que deseas eliminar este fungible?</h6><form action=\"").append(request.getRequestURI()).append("\" method=\"post\" role=\"form\">")
                .append("<div class=\"row\" id=\"filasFormulario\">")
                // Columna id de fungible
                .append("<div class=\"col-6\" id=\"columnaNumFungible\" style=\"display: none;\">")
                .append("<label>ID del fungible:</label>")
                .append("<input type=\"text\" readonly=\"true\" value=\"")
                .append(ultimoNumFungible)
                .append("\" class=\"form-control\" name=\"txtNumFungible\" id=\"txtNumFungible\">")
                .append("</div>")
                // Columna marca del fungible
                .append("<div class=\"col-6\" id=\"columnaMarcaFungible\">")
                .append("<label>Marca del fungible:</label>")
                .append("<input type=\"text\" class=\"form-control\" name=\"txtMarcaFungible\" id=\"txtMarcaFungible\" required placeholder=\"Marca del fungible\">")
                .append("</div>")
                // Columna modelo del fungible
                .append("<div class=\"col-6\" id=\"columnaModeloFungible\">")
                .append("<label>Modelo del fungible:</label>")
                .append("<input type=\"text\" class=\"form-control\" name=\"txtModeloFungible\" id=\"txtModeloFungible\" required placeholder=\"Modelo del fungible\">")
                .append("</div>")
                // Columna tamaño
                .append("<div class=\"col-6\" id=\"columnaTamanyo\">")
                .append("<label>Tamaño:</label>")
                .append("<input type=\"text\" class=\"form-control\" name=\"txtTamanyo\" id=\"txtTamanyo\" required placeholder=\"Tamaño\">")
                .append("</div>")
                // Columna cantidad
                .append("<div class=\"col-6\" id=\"columnaCantidad\">")
                .append("<label>Cantidad:</label>")
                .append("<div class=\"input-group\">")
                .append("<input type=\"button\" value=\"-\" class=\"minus btn btn-primary\">")
                .append("<input type=\"number\" step=\"1\" min=\"0\" max=\"\" name=\"txtCantidad\" id=\"txtCantidad\" value=\"0\" title=\"Qty\" class=\"input-text qty text form-control\" size=\"4\" pattern=\"\" inputmode=\"\">") // Añade el atributo readonly aquí
                .append("<input type=\"button\" value=\"+\" class=\"plus btn btn-primary\">")
                .append("</div>")
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
                // Columna herramientas
                .append("<div class=\"col-6\" id=\"columnaHerramientas\">")
                .append("<label>Herramientas:</label>")
                .append("<select class=\"form-control\" name=\"selectHerramientas\" id=\"selectHerramientas\" multiple required>");
        for (Herramienta herramienta : herramientas) {
            formHTML.append("<option name=\"opcHerramientas\" value=\"").append(herramienta.getId()).append("\">")
                    .append(herramienta.getMarca()).append(" - ").append(herramienta.getModelo())
                    .append("</option>");
        }
        formHTML.append("</select>").append("</div>").append("</div>")
                .append("<div class=\"modal-footer\">")
                .append("<button type=\"submit\" name=\"btnAgregar\" class=\"btn btn-success\">Enviar</button>")
                .append("<button type=\"submit\" name=\"btnEditar\" style=\"display: none;\" class=\"btn btn-warning\">Enviar</button>")
                .append("<button type=\"submit\" name=\"btnEliminar\" style=\"display: none;\" class=\"btn btn-danger\">Confirmar</button>")
                .append("<button type=\"button\" name=\"btnCancelar\" class=\"btn btn-dark\" data-bs-dismiss=\"modal\">Cancelar</button>")
                .append("</div>")
                .append("</form>");

        return formHTML.toString();
    }

    private String generarTablaHTML(HttpServletRequest request) {
        List<Fungible> fungibles = c.leerFungibles();
        StringBuilder tablaHTML = new StringBuilder();

        if (fungibles != null || !fungibles.isEmpty()) {
            tablaHTML.append("<table id=\"tablaFungibles\" class=\"table table-bordered table-hover display responsive nowrap\" width=\"100%\">")
                    .append("<thead><tr>");

            tablaHTML.append("<th scope=\"col\">Acciones</th><th scope=\"col\" id=\"celdaEncabezadoIdFungible\">ID</th>")
                    .append("<th scope=\"col\" id=\"celdaEncabezadoMarcaFungible\">Marca</th><th scope=\"col\">Modelo</th>")
                    .append("<th scope=\"col\">Tamaño</th><th scope=\"col\">Cantidad</th>");

            tablaHTML.append("</tr></thead>");

            tablaHTML.append("<tbody>");
            for (Fungible fungible : fungibles) {
                List<Equipo> equipos = c.obtenerEquiposPorFungible(fungible);
                List<Integer> numEquipos = new ArrayList<>();
                for (Equipo equipo : equipos) {
                    numEquipos.add(equipo.getId());
                }
                List<Herramienta> herramientas = c.obtenerHerramientasPorFungible(fungible);
                List<Integer> numHerramientas = new ArrayList<>();
                for (Herramienta herramienta : herramientas) {
                    numHerramientas.add(herramienta.getId());
                }
                tablaHTML.append("<tr id=fila_").append(fungible.getId()).append("\"")
                        .append(" data-action=\"Consultar\"")
                        .append(" data-idfungible=\"").append(fungible.getId()).append("\"")
                        .append(" data-marcafungible=\"").append(fungible.getMarca()).append("\"")
                        .append(" data-modelofungible=\"").append(fungible.getModelo()).append("\"")
                        .append(" data-tamanyo=\"").append(fungible.getTamanyo()).append("\"")
                        .append(" data-cantidad=\"").append(fungible.getCantidad()).append("\"")
                        .append(" data-numequipos=\"").append(numEquipos).append("\"")
                        .append(" data-numherramientas=\"").append(numHerramientas).append("\">");

                tablaHTML.append("<td>")
                        .append("<button type=\"button\" class=\"btn btn-warning btnEditar\" data-bs-toggle=\"modal\" data-bs-target=\"#modalFungibles\" data-action=\"Editar\" name=\"btnEditarFungible\">Editar</button>&nbsp;")
                        .append("<button type=\"button\" class=\"btn btn-danger btnEliminar\" data-bs-toggle=\"modal\" data-bs-target=\"#modalFungibles\" data-action=\"Eliminar\" name=\"btnEliminarFungible\">Eliminar</button>&nbsp;")
                        .append("</td>");

                tablaHTML.append("<td id=\"celdaIdFungible\">").append(fungible.getId()).append("</td>")
                        .append("<td>").append(fungible.getMarca()).append("</td>")
                        .append("<td>").append(fungible.getModelo()).append("</td>")
                        .append("<td>").append(fungible.getTamanyo()).append("</td>")
                        .append("<td>").append(fungible.getCantidad()).append("</td>");

                tablaHTML.append("</tr>");
            }
            tablaHTML.append("</tbody>");

            tablaHTML.append("</table>");
        }

        return tablaHTML.toString();
    }
}
