/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package controlador;

import java.sql.*;
import java.util.ArrayList;
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
            PreparedStatement ps = conn.prepareStatement(sql);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                int id = rs.getInt("id");
                int numIdentificacion = rs.getInt("num_identificacion");
                String nombre = rs.getString("nombre");
                Date fechaCompra = rs.getDate("fecha_compra");
                String fabricante = rs.getString("fabricante");
                Date fechaUltimaCalibracion = rs.getDate("fecha_ultima_calibracion");
                Date fechaProximaCalibracion = rs.getDate("fecha_proxima_calibracion");
                Date fechaUltimoMantenimiento = rs.getDate("fecha_ultimo_mantenimiento");
                Date fechaProximoMantenimiento = rs.getDate("fecha_proximo_mantenimiento");
                equipos.add(new Equipo(id, numIdentificacion, nombre, fechaCompra, fabricante, fechaUltimaCalibracion, fechaProximaCalibracion, fechaUltimoMantenimiento, fechaProximoMantenimiento));
            }
        } catch (SQLException ex) {
            return null;
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
            PreparedStatement ps = conn.prepareStatement(sql);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                int id = rs.getInt("id");
                String marca = rs.getString("marca");
                String modelo = rs.getString("modelo");
                String tamanyo = rs.getString("tamanyo");
                int cantidad = rs.getInt("cantidad");
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
            PreparedStatement ps = conn.prepareStatement(sql);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                int id = rs.getInt("id");
                String marca = rs.getString("marca");
                String modelo = rs.getString("modelo");
                String fabricante = rs.getString("fabricante");
                Date fechaCompra = rs.getDate("fecha_compra");
                herramientas.add(new Herramienta(id, marca, modelo, fabricante, fechaCompra));
            }
        } catch (SQLException ex) {
            System.err.println("Error al leer los equipos: " + ex.getMessage());
        } finally {
            desconectar();
        }

        return herramientas;
    }

    int insertarEquipo(Equipo e) {
        int filasAfectadas;
        String sql = "INSERT INTO equipos (num_identificacion, nombre, fecha_compra, fabricante, fecha_ultima_calibracion, fecha_proxima_calibracion)"
                + "VALUES (?, ?, ?, ?, ?, ?)";

        try {
            if (conn == null || conn.isClosed()) {
                conn = this.conectar(false);
            }
            PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, e.getNumIdentificacion());
            ps.setString(2, e.getNombre());
            ps.setDate(3, new Date(e.getFechaCompra().getTime()));
            ps.setString(4, e.getFabricante());
            ps.setDate(5, new Date(e.getFechaUltimaCalibracion().getTime()));
            ps.setDate(6, new Date(e.getFechaProximaCalibracion().getTime()));
            filasAfectadas = ps.executeUpdate();
            return filasAfectadas;
        } catch (SQLException ex) {
            return 0;
        } finally {
            desconectar();
        }
    }

    Fungible buscarFungible(int idFungible) {
        String sql = "SELECT * FROM fungibles WHERE id = ?";

        try {
            if (conn == null || conn.isClosed()) {
                conn = this.conectar(false);
            }
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, idFungible);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return new Fungible(idFungible, rs.getString("marca"), rs.getString("modelo"), rs.getString("tamanyo"), rs.getInt("cantidad"));
            }
        } catch (SQLException ex) {
            return null;
        } finally {
            desconectar();
        }

        return null;
    }

    int asociarEquipoFungible(Equipo e, Fungible f) {
        int filasAfectadas;
        String sql = "INSERT INTO equipos_fungibles VALUES (?, ?)";

        try {
            if (conn == null || conn.isClosed()) {
                conn = this.conectar(false);
            }
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, e.getId());
            ps.setInt(2, f.getId());
            filasAfectadas = ps.executeUpdate();
            return filasAfectadas;
        } catch (SQLException ex) {
            return 0;
        } finally {
            desconectar();
        }
    }

    Herramienta buscarHerramientas(int idHerramienta) {
        String sql = "SELECT * FROM herramientas WHERE id = ?";

        try {
            if (conn == null || conn.isClosed()) {
                conn = this.conectar(false);
            }
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, idHerramienta);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return new Herramienta(idHerramienta, rs.getString("marca"), rs.getString("modelo"), rs.getString("fabricante"), rs.getDate("fecha_compra"));
            }
        } catch (SQLException ex) {
            return null;
        } finally {
            desconectar();
        }

        return null;
    }

    int asociarEquipoHerramienta(Equipo e, Herramienta h) {
        int filasAfectadas;
        String sql = "INSERT INTO equipos_herramientas VALUES (?, ?)";

        try {
            if (conn == null || conn.isClosed()) {
                conn = this.conectar(false);
            }
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, e.getId());
            ps.setInt(2, h.getId());
            filasAfectadas = ps.executeUpdate();
            return filasAfectadas;
        } catch (SQLException ex) {
            return 0;
        } finally {
            desconectar();
        }
    }

    int modificarEquipo(Equipo e) {
        int filasAfectadas;
        String sql = "UPDATE equipos SET num_identificacion = ?, nombre = ?, fecha_compra = ?, fabricante = ?, fecha_ultima_calibracion = ?, fecha_proxima_calibracion = ? WHERE id = ?";

        try {
            if (conn == null || conn.isClosed()) {
                conn = this.conectar(false);
            }
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, e.getNumIdentificacion());
            ps.setString(2, e.getNombre());
            ps.setDate(3, new Date(e.getFechaCompra().getTime()));
            ps.setString(4, e.getFabricante());
            ps.setDate(5, new Date(e.getFechaUltimaCalibracion().getTime()));
            ps.setDate(6, new Date(e.getFechaProximaCalibracion().getTime()));
            ps.setInt(7, e.getId());
            filasAfectadas = ps.executeUpdate();
            return filasAfectadas;
        } catch (SQLException ex) {
            return 0;
        } finally {
            desconectar();
        }
    }

    int borrarEquipo(Equipo e) {
        int filasAfectadas;
        String sql = "DELETE FROM equipos WHERE id = ?";

        try {
            if (conn == null || conn.isClosed()) {
                conn = this.conectar(false);
            }
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, e.getId());
            filasAfectadas = ps.executeUpdate();
            return filasAfectadas;
        } catch (SQLException ex) {
            return 0;
        } finally {
            desconectar();
        }
    }
}
