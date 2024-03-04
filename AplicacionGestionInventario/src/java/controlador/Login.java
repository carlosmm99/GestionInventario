/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controlador;

import jakarta.servlet.RequestDispatcher;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import modelo.Usuario;

/**
 *
 * @author carlos.mondejar
 */
public class Login extends HttpServlet {

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
            out.println("<title>Servlet Login</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet Login at " + request.getContextPath() + "</h1>");
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
//        processRequest(request, response);
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
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            /* TODO output your page here. You may use following sample code. */
            String nombre = request.getParameter("txtNombreUsuario");
            String contrasenia = request.getParameter("txtContrasenia");

            RequestDispatcher rd = request.getRequestDispatcher("/login.jsp");
            if (nombre.isBlank() && contrasenia.isBlank()) {
                rd.include(request, response);
                out.println("<div><p class=\"text-center\" style=\"color: red; font-weight: bold\">Usuario y contraseña obligatorios</p>");
            } else if (nombre.isBlank()) {
                rd.include(request, response);
                out.println("<div><p class=\"text-center\" style=\"color: red; font-weight: bold\">Usuario obligatorio</p></div>");
            } else if (contrasenia.isBlank()) {
                rd.include(request, response);
                out.println("<div><p class=\"text-center\" style=\"color: red; font-weight: bold\">Contraseña obligatoria</p></div>");
            } else {
                Usuario u = c.comprobarCredenciales(nombre, contrasenia);
                if (u != null) {
                    // Almacena el nombre del usuario y el rol en la sesión
                    request.getSession().setAttribute("usuario", u.getUsuario());
                    request.getSession().setAttribute("rol", u.getRol());
                    request.getSession().setMaxInactiveInterval(3600); // 1 hora
                    response.sendRedirect(request.getContextPath() + "/Inicio");
                } else {
                    rd.include(request, response);
                    out.println("<p class=\"text-center\" style=\"color: red; font-weight: bold\">Usuario/contraseña incorrectos</p>");
                }
            }
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

}
