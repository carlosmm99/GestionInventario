/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controlador;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
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

/**
 *
 * @author carlos.mondejar
 */
public class ObtenerEquiposYFungibles extends HttpServlet {

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
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        Gson gson = new Gson();

        // Obtener los datos de equipos y fungibles del controlador
        // Supongamos que obtienes estos datos de alguna manera
        List<Equipo> equipos = c.leerEquipos();
        // Formatear las fechas de los equipos
        SimpleDateFormat sdf = new SimpleDateFormat("MMM dd, yyyy");
        for (Equipo e : equipos) {
            try {
                String fechaProximaCalibracionStr = sdf.format(e.getFechaProximaCalibracion());
                String fechaProximoMantenimientoStr = sdf.format(e.getFechaProximoMantenimiento());
                Date fechaProximaCalibracion = sdf.parse(fechaProximaCalibracionStr);
                Date fechaProximoMantenimiento = sdf.parse(fechaProximoMantenimientoStr);
                e.setFechaProximaCalibracion(fechaProximaCalibracion);
                e.setFechaProximoMantenimiento(fechaProximoMantenimiento);
            } catch (ParseException ex) {
                out.println("Error: " + ex.getMessage());
            }
        }
        List<Fungible> fungibles = c.leerFungibles();

        // Convertir los datos a arrays
        Equipo[] equiposArray = equipos.toArray(new Equipo[equipos.size()]);
        Fungible[] fungiblesArray = fungibles.toArray(new Fungible[fungibles.size()]);

        // Construir un objeto JSON que contenga ambos arrays
        JsonObject respuestaJson = new JsonObject();
        respuestaJson.add("equipos", gson.toJsonTree(equiposArray));
        respuestaJson.add("fungibles", gson.toJsonTree(fungiblesArray));

        // Enviar la respuesta JSON al cliente
        out.println(respuestaJson.toString());
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
        processRequest(request, response);
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

}
