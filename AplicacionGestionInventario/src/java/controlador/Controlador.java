/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package controlador;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import modelo.Equipo;
import modelo.Fungible;
import modelo.Herramienta;

/**
 *
 * @author carlos.mondejar
 */
public class Controlador {

    private Connection conn;
    private final String DRIVER = "com.mysql.jdbc.Driver";
    private final String URL = "jdbc:mysql://localhost:3306/inventario";
    private final String USER = "root";
    private final String PASSWORD = "";

    private Connection conectar(boolean b) {
        try {
            Class.forName(DRIVER);
            conn = DriverManager.getConnection(URL, USER, PASSWORD);
        } catch (ClassNotFoundException | SQLException e) {
            System.err.println("Error: " + e.getMessage());
        } finally {
            try {
                if (conn != null && b) {
                    conn.close();
                }
            } catch (SQLException ex) {
                System.out.println("Error: " + ex.getMessage());
            }
        }

        return conn;
    }

    private void desconectar() {
        if (conn != null) {
            try {
                conn.close();
            } catch (SQLException ex) {
                System.err.println("Error: " + ex.getMessage());
            }
        }
    }

    public int obtenerNumRegistro(String tabla) {
        int ultimoNum = 0;
        String sql = "SELECT MAX(id) FROM " + tabla;

        try {
            if (conn == null || conn.isClosed()) {
                conn = this.conectar(false);
            }
            PreparedStatement preparedStatement = conn.prepareStatement(sql);
            ResultSet resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                ultimoNum = resultSet.getInt(1);
            }
        } catch (SQLException e) {
            System.err.println("Error al obtener el último número de registro: " + e.getMessage());
        }

        return ultimoNum + 1;
    }

    public int contarRegistros(String tabla) {
        int numRegistros = 0;
        String sql = "SELECT COUNT(*) FROM " + tabla;

        try {
            if (conn == null || conn.isClosed()) {
                conn = this.conectar(false);
            }
            PreparedStatement preparedStatement = conn.prepareStatement(sql);
            ResultSet resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                numRegistros = resultSet.getInt(1);
            }
        } catch (SQLException e) {
            System.err.println("Error al contarRegistros: " + e.getMessage());
        }

        return numRegistros;
    }

    List<Equipo> leerEquipos() {
        List<Equipo> equipos = new ArrayList<>();
        String sql = "SELECT * FROM equipos";

        try {
            if (conn == null || conn.isClosed()) {
                conn = this.conectar(false);
            }
            PreparedStatement preparedStatement = conn.prepareStatement(sql);
            ResultSet resultSet = preparedStatement.executeQuery();
            while (resultSet.next()) {
                int id = resultSet.getInt("id");
                int numIdentificacion = resultSet.getInt("num_identificacion");
                String nombre = resultSet.getString("nombre");
                Date fechaCompra = resultSet.getDate("fecha_compra");
                String fabricante = resultSet.getString("fabricante");
                Date fechaUltimaCalibracion = resultSet.getDate("fecha_ultima_calibracion");
                Date fechaProximaCalibracion = resultSet.getDate("fecha_proxima_calibracion");
                equipos.add(new Equipo(id, numIdentificacion, nombre, fechaCompra, fabricante, fechaUltimaCalibracion, fechaProximaCalibracion));
            }
        } catch (SQLException ex) {
            System.err.println("Error al leer los equipos: " + ex.getMessage());
        } finally {
            desconectar();
        }

        return equipos;
    }

    List<Fungible> leerFungibles() {
        List<Fungible> fungibles = new ArrayList<>();
        String sql = "SELECT * FROM fungibles";

        try {
            if (conn == null || conn.isClosed()) {
                conn = this.conectar(false);
            }
            PreparedStatement preparedStatement = conn.prepareStatement(sql);
            ResultSet resultSet = preparedStatement.executeQuery();
            while (resultSet.next()) {
                int id = resultSet.getInt("id");
                String marca = resultSet.getString("marca");
                String modelo = resultSet.getString("modelo");
                String tamanyo = resultSet.getString("tamanyo");
                int cantidad = resultSet.getInt("cantidad");
                fungibles.add(new Fungible(id, marca, modelo, tamanyo, cantidad));
            }
        } catch (SQLException ex) {
            System.err.println("Error al leer los equipos: " + ex.getMessage());
        } finally {
            desconectar();
        }

        return fungibles;
    }

    List<Herramienta> leerHerramientas() {
        List<Herramienta> herramientas = new ArrayList<>();
        String sql = "SELECT * FROM herramientas";

        try {
            if (conn == null || conn.isClosed()) {
                conn = this.conectar(false);
            }
            PreparedStatement preparedStatement = conn.prepareStatement(sql);
            ResultSet resultSet = preparedStatement.executeQuery();
            while (resultSet.next()) {
                int id = resultSet.getInt("id");
                String marca = resultSet.getString("marca");
                String modelo = resultSet.getString("modelo");
                String fabricante = resultSet.getString("fabricante");
                Date fechaCompra = resultSet.getDate("fecha_compra");
                herramientas.add(new Herramienta(id, marca, modelo, fabricante, fechaCompra));
            }
        } catch (SQLException ex) {
            System.err.println("Error al leer los equipos: " + ex.getMessage());
        } finally {
            desconectar();
        }

        return herramientas;
    }
}
