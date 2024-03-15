/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package controlador;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import modelo.*;

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
        int siguienteNum = 0;
        String sql = "SELECT AUTO_INCREMENT FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?";

        try {
            if (conn == null || conn.isClosed()) {
                conn = this.conectar(false);
            }
            PreparedStatement preparedStatement = conn.prepareStatement(sql);
            preparedStatement.setString(1, "inventario");
            preparedStatement.setString(2, tabla);
            ResultSet resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                siguienteNum = resultSet.getInt("AUTO_INCREMENT");
            }
            return siguienteNum;
        } catch (SQLException e) {
            return siguienteNum;
        }
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
                equipos.add(new Equipo(rs.getInt("id"), rs.getInt("num_inventario"), rs.getString("nombre"), rs.getDate("fecha_compra"), rs.getString("fabricante"), rs.getDate("fecha_ultima_calibracion"), rs.getDate("fecha_proxima_calibracion"), rs.getDate("fecha_ultimo_mantenimiento"), rs.getDate("fecha_proximo_mantenimiento"), rs.getString("foto")));
            }
            return equipos;
        } catch (SQLException ex) {
            return null;
        } finally {
            desconectar();
        }
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
                fungibles.add(new Fungible(rs.getInt("id"), rs.getString("marca"), rs.getString("modelo"), rs.getString("tamanyo"), rs.getInt("cantidad"), rs.getString("foto")));
            }
            return fungibles;
        } catch (SQLException ex) {
            return null;
        } finally {
            desconectar();
        }
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
                herramientas.add(new Herramienta(rs.getInt("id"), rs.getString("marca"), rs.getString("modelo"), rs.getString("fabricante"), rs.getDate("fecha_compra"), rs.getString("foto")));
            }
            return herramientas;
        } catch (SQLException ex) {
            return null;
        } finally {
            desconectar();
        }
    }

    int insertarEquipo(Equipo e) {
        // Comprobar si la fecha de próxima calibración es anterior a la fecha de última calibración
        // o a la fecha de compra
        if (e.getFechaProximaCalibracion().before(e.getFechaUltimaCalibracion())
                || e.getFechaProximaCalibracion().before(e.getFechaCompra())) {
            return 0; // No hacer nada si las condiciones no se cumplen
        }

        // Comprobar si la fecha de próximo mantenimiento es anterior a la fecha de último mantenimiento
        // o a la fecha de compra
        if (e.getFechaProximoMantenimiento().before(e.getFechaUltimoMantenimiento())
                || e.getFechaProximoMantenimiento().before(e.getFechaCompra())) {
            return 0; // No hacer nada si las condiciones no se cumplen
        }

        int filasAfectadas;
        String sql = "INSERT INTO equipos (num_inventario, nombre, fecha_compra, fabricante, fecha_ultima_calibracion, fecha_proxima_calibracion, fecha_ultimo_mantenimiento, fecha_proximo_mantenimiento, foto)"
                + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try {
            if (conn == null || conn.isClosed()) {
                conn = this.conectar(false);
            }
            PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, e.getNumInventario());
            ps.setString(2, e.getNombre());
            ps.setDate(3, new Date(e.getFechaCompra().getTime()));
            ps.setString(4, e.getFabricante());
            ps.setDate(5, new Date(e.getFechaUltimaCalibracion().getTime()));
            ps.setDate(6, new Date(e.getFechaProximaCalibracion().getTime()));
            ps.setDate(7, new Date(e.getFechaUltimoMantenimiento().getTime()));
            ps.setDate(8, new Date(e.getFechaProximoMantenimiento().getTime()));
            ps.setString(9, e.getFoto());
            filasAfectadas = ps.executeUpdate();

            // Insertar en la tabla equipos_fungibles
            String sqlFungibles = "INSERT INTO equipos_fungibles (equipo_id, fungible_id) VALUES (?, ?)";
            PreparedStatement psFungibles = conn.prepareStatement(sqlFungibles);
            for (Fungible f : e.getFungibles()) {
                psFungibles.setInt(1, e.getId());
                psFungibles.setInt(2, f.getId()); // Suponiendo que tengas un ID para cada fungible
                psFungibles.addBatch();
            }
            psFungibles.executeBatch();

            // Insertar en la tabla equipos_herramientas
            String sqlHerramientas = "INSERT INTO equipos_herramientas (equipo_id, herramienta_id) VALUES (?, ?)";
            PreparedStatement psHerramientas = conn.prepareStatement(sqlHerramientas);
            for (Herramienta h : e.getHerramientas()) {
                psHerramientas.setInt(1, e.getId());
                psHerramientas.setInt(2, h.getId()); // Suponiendo que tengas un ID para cada herramienta
                psHerramientas.addBatch();
            }
            psHerramientas.executeBatch();

            return filasAfectadas;
        } catch (SQLException ex) {
            return 0;
        } finally {
            desconectar();
        }
    }

    int insertarFungible(Fungible f) {
        int filasAfectadas;
        String sql = "INSERT INTO fungibles (marca, modelo, tamanyo, cantidad, foto)"
                + "VALUES (?, ?, ?, ?, ?)";

        try {
            if (conn == null || conn.isClosed()) {
                conn = this.conectar(false);
            }
            PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, f.getMarca());
            ps.setString(2, f.getModelo());
            ps.setString(3, f.getTamanyo());
            ps.setInt(4, f.getCantidad());
            ps.setString(5, f.getFoto());
            filasAfectadas = ps.executeUpdate();

            // Insertar en la tabla equipos_fungibles
            String sqlEquipos = "INSERT INTO equipos_fungibles (equipo_id, fungible_id) VALUES (?, ?)";
            PreparedStatement psEquipos = conn.prepareStatement(sqlEquipos);
            for (Equipo e : f.getEquipos()) {
                psEquipos.setInt(1, e.getId());
                psEquipos.setInt(2, f.getId()); // Suponiendo que tengas un ID para cada fungible
                psEquipos.addBatch();
            }
            psEquipos.executeBatch();

            // Insertar en la tabla equipos_herramientas
            String sqlHerramientas = "INSERT INTO fungibles_herramientas (fungible_id, herramienta_id) VALUES (?, ?)";
            PreparedStatement psHerramientas = conn.prepareStatement(sqlHerramientas);
            for (Herramienta h : f.getHerramientas()) {
                psHerramientas.setInt(1, f.getId());
                psHerramientas.setInt(2, h.getId()); // Suponiendo que tengas un ID para cada herramienta
                psHerramientas.addBatch();
            }
            psHerramientas.executeBatch();

            return filasAfectadas;
        } catch (SQLException ex) {
            return 0;
        } finally {
            desconectar();
        }
    }

    int insertarHerramienta(Herramienta h) {
        int filasAfectadas;
        String sql = "INSERT INTO herramientas (marca, modelo, fabricante, fecha_compra, foto)"
                + "VALUES (?, ?, ?, ?, ?)";

        try {
            if (conn == null || conn.isClosed()) {
                conn = this.conectar(false);
            }
            PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, h.getMarca());
            ps.setString(2, h.getModelo());
            ps.setString(3, h.getFabricante());
            ps.setDate(4, new Date(h.getFechaCompra().getTime()));
            ps.setString(5, h.getFoto());
            filasAfectadas = ps.executeUpdate();

            // Insertar en la tabla equipos_herramientas
            String sqlEquipos = "INSERT INTO equipos_herramientas (equipo_id, herramienta_id) VALUES (?, ?)";
            PreparedStatement psEquipos = conn.prepareStatement(sqlEquipos);
            for (Equipo e : h.getEquipos()) {
                psEquipos.setInt(1, e.getId());
                psEquipos.setInt(2, h.getId()); // Suponiendo que tengas un ID para cada herramienta
                psEquipos.addBatch();
            }
            psEquipos.executeBatch();

            // Insertar en la tabla fungibles_herramientas
            String sqlHerramientas = "INSERT INTO fungibles_herramientas (fungible_id, herramienta_id) VALUES (?, ?)";
            PreparedStatement psHerramientas = conn.prepareStatement(sqlHerramientas);
            for (Fungible f : h.getFungibles()) {
                psHerramientas.setInt(1, f.getId());
                psHerramientas.setInt(2, h.getId()); // Suponiendo que tengas un ID para cada herramienta
                psHerramientas.addBatch();
            }
            psHerramientas.executeBatch();

            return filasAfectadas;
        } catch (SQLException ex) {
            return 0;
        } finally {
            desconectar();
        }
    }

    Equipo buscarEquipo(int idEquipo) {
        String sql = "SELECT * FROM equipos WHERE id = ?";

        try {
            if (conn == null || conn.isClosed()) {
                conn = this.conectar(false);
            }
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, idEquipo);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return new Equipo(idEquipo, rs.getInt("num_inventario"), rs.getString("nombre"), rs.getDate("fecha_compra"), rs.getString("fabricante"), rs.getDate("fecha_ultima_calibracion"), rs.getDate("fecha_proxima_calibracion"), rs.getDate("fecha_ultimo_mantenimiento"), rs.getDate("fecha_proximo_mantenimiento"), rs.getString("foto"));
            }
        } catch (SQLException ex) {
            return null;
        } finally {
            desconectar();
        }

        return null;
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
                return new Fungible(idFungible, rs.getString("marca"), rs.getString("modelo"), rs.getString("tamanyo"), rs.getInt("cantidad"), rs.getString("foto"));
            }
        } catch (SQLException ex) {
            return null;
        } finally {
            desconectar();
        }

        return null;
    }

    Herramienta buscarHerramienta(int idHerramienta) {
        String sql = "SELECT * FROM herramientas WHERE id = ?";

        try {
            if (conn == null || conn.isClosed()) {
                conn = this.conectar(false);
            }
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, idHerramienta);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return new Herramienta(idHerramienta, rs.getString("marca"), rs.getString("modelo"), rs.getString("fabricante"), rs.getDate("fecha_compra"), rs.getString("foto"));
            }
        } catch (SQLException ex) {
            return null;
        } finally {
            desconectar();
        }

        return null;
    }

    int modificarEquipo(Equipo e) {
        // Comprobar si la fecha de próxima calibración es anterior a la fecha de última calibración
        // o a la fecha de compra
        if (e.getFechaProximaCalibracion().before(e.getFechaUltimaCalibracion())
                || e.getFechaProximaCalibracion().before(e.getFechaCompra())) {
            return 0; // No hacer nada si las condiciones no se cumplen
        }

        // Comprobar si la fecha de próximo mantenimiento es anterior a la fecha de último mantenimiento
        // o a la fecha de compra
        if (e.getFechaProximoMantenimiento().before(e.getFechaUltimoMantenimiento())
                || e.getFechaProximoMantenimiento().before(e.getFechaCompra())) {
            return 0; // No hacer nada si las condiciones no se cumplen
        }

        int filasAfectadas;
        String sql = "UPDATE equipos SET num_inventario = ?, nombre = ?, fecha_compra = ?, fabricante = ?, fecha_ultima_calibracion = ?, fecha_proxima_calibracion = ?, fecha_ultimo_mantenimiento = ?, fecha_proximo_mantenimiento = ?, foto = ? WHERE id = ?";

        try {
            if (conn == null || conn.isClosed()) {
                conn = this.conectar(false);
            }
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, e.getNumInventario());
            ps.setString(2, e.getNombre());
            ps.setDate(3, new Date(e.getFechaCompra().getTime()));
            ps.setString(4, e.getFabricante());
            ps.setDate(5, new Date(e.getFechaUltimaCalibracion().getTime()));
            ps.setDate(6, new Date(e.getFechaProximaCalibracion().getTime()));
            ps.setDate(7, new Date(e.getFechaUltimoMantenimiento().getTime()));
            ps.setDate(8, new Date(e.getFechaProximoMantenimiento().getTime()));
            ps.setString(9, e.getFoto());
            ps.setInt(10, e.getId());
            filasAfectadas = ps.executeUpdate();

            // Insertar en la tabla equipos_fungibles
            String sqlFungibles = "INSERT IGNORE INTO equipos_fungibles (equipo_id, fungible_id) VALUES (?, ?)";
            PreparedStatement psFungibles = conn.prepareStatement(sqlFungibles);
            for (Fungible f : e.getFungibles()) {
                psFungibles.setInt(1, e.getId());
                psFungibles.setInt(2, f.getId()); // Suponiendo que tengas un ID para cada fungible
                psFungibles.addBatch();
            }
            psFungibles.executeBatch();

            // Insertar en la tabla equipos_herramientas
            String sqlHerramientas = "INSERT IGNORE INTO equipos_herramientas (equipo_id, herramienta_id) VALUES (?, ?)";
            PreparedStatement psHerramientas = conn.prepareStatement(sqlHerramientas);
            for (Herramienta h : e.getHerramientas()) {
                psHerramientas.setInt(1, e.getId());
                psHerramientas.setInt(2, h.getId()); // Suponiendo que tengas un ID para cada herramienta
                psHerramientas.addBatch();
            }
            psHerramientas.executeBatch();

            generarCopiaDeSeguridad();
            
            return filasAfectadas;
        } catch (SQLException ex) {
            return 0;
        } finally {
            desconectar();
        }
    }

    int modificarFungible(Fungible f) {
        int filasAfectadas;
        String sql = "UPDATE fungibles SET marca = ?, modelo = ?, tamanyo = ?, cantidad = ?, foto = ? WHERE id = ?";

        try {
            if (conn == null || conn.isClosed()) {
                conn = this.conectar(false);
            }
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, f.getMarca());
            ps.setString(2, f.getModelo());
            ps.setString(3, f.getTamanyo());
            ps.setInt(4, f.getCantidad());
            ps.setString(5, f.getFoto());
            ps.setInt(6, f.getId());
            filasAfectadas = ps.executeUpdate();

            // Insertar en la tabla equipos_fungibles
            String sqlEquipos = "INSERT IGNORE INTO equipos_fungibles (equipo_id, fungible_id) VALUES (?, ?)";
            PreparedStatement psEquipos = conn.prepareStatement(sqlEquipos);
            for (Equipo e : f.getEquipos()) {
                psEquipos.setInt(1, e.getId());
                psEquipos.setInt(2, f.getId()); // Suponiendo que tengas un ID para cada fungible
                psEquipos.addBatch();
            }
            psEquipos.executeBatch();

            // Insertar en la tabla equipos_herramientas
            String sqlHerramientas = "INSERT IGNORE INTO fungibles_herramientas (fungible_id, herramienta_id) VALUES (?, ?)";
            PreparedStatement psHerramientas = conn.prepareStatement(sqlHerramientas);
            for (Herramienta h : f.getHerramientas()) {
                psHerramientas.setInt(1, f.getId());
                psHerramientas.setInt(2, h.getId()); // Suponiendo que tengas un ID para cada herramienta
                psHerramientas.addBatch();
            }
            psHerramientas.executeBatch();

            generarCopiaDeSeguridad();

            return filasAfectadas;
        } catch (SQLException ex) {
            return 0;
        } finally {
            desconectar();
        }
    }

    int modificarHerramienta(Herramienta h) {
        int filasAfectadas;
        String sql = "UPDATE herramientas SET marca = ?, modelo = ?, fabricante = ?, fecha_compra = ?, foto = ? WHERE id = ?";

        try {
            if (conn == null || conn.isClosed()) {
                conn = this.conectar(false);
            }
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, h.getMarca());
            ps.setString(2, h.getModelo());
            ps.setString(3, h.getFabricante());
            ps.setDate(4, new Date(h.getFechaCompra().getTime()));
            ps.setString(5, h.getFoto());
            ps.setInt(6, h.getId());
            filasAfectadas = ps.executeUpdate();

            // Insertar en la tabla equipos_herramientas
            String sqlEquipos = "INSERT IGNORE INTO equipos_herramientas (equipo_id, herramienta_id) VALUES (?, ?)";
            PreparedStatement psEquipos = conn.prepareStatement(sqlEquipos);
            for (Equipo e : h.getEquipos()) {
                psEquipos.setInt(1, e.getId());
                psEquipos.setInt(2, h.getId()); // Suponiendo que tengas un ID para cada herramienta
                psEquipos.addBatch();
            }
            psEquipos.executeBatch();

            // Insertar en la tabla fungibles_herramientas
            String sqlHerramientas = "INSERT IGNORE INTO fungibles_herramientas (fungible_id, herramienta_id) VALUES (?, ?)";
            PreparedStatement psHerramientas = conn.prepareStatement(sqlHerramientas);
            for (Fungible f : h.getFungibles()) {
                psHerramientas.setInt(1, f.getId());
                psHerramientas.setInt(2, h.getId()); // Suponiendo que tengas un ID para cada herramienta
                psHerramientas.addBatch();
            }
            psHerramientas.executeBatch();

            generarCopiaDeSeguridad();

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

    int borrarFungible(Fungible f) {
        int filasAfectadas;
        String sql = "DELETE FROM fungibles WHERE id = ?";

        try {
            if (conn == null || conn.isClosed()) {
                conn = this.conectar(false);
            }
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, f.getId());
            filasAfectadas = ps.executeUpdate();
            return filasAfectadas;
        } catch (SQLException ex) {
            return 0;
        } finally {
            desconectar();
        }
    }

    int borrarHerramienta(Herramienta h) {
        int filasAfectadas;
        String sql = "DELETE FROM herramientas WHERE id = ?";

        try {
            if (conn == null || conn.isClosed()) {
                conn = this.conectar(false);
            }
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, h.getId());
            filasAfectadas = ps.executeUpdate();
            return filasAfectadas;
        } catch (SQLException ex) {
            return 0;
        } finally {
            desconectar();
        }
    }

    List<Fungible> obtenerFungiblesPorEquipo(Equipo e) {
        List<Fungible> fungibles = new ArrayList<>();
        String sql = "SELECT f.* FROM fungibles f JOIN equipos_fungibles ef ON f.id = ef.fungible_id JOIN equipos e ON ef.equipo_id = e.id WHERE e.id = ?";

        try {
            if (conn == null || conn.isClosed()) {
                conn = this.conectar(false);
            }
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, e.getId());
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                fungibles.add(new Fungible(rs.getInt("f.id"), rs.getString("f.marca"), rs.getString("f.modelo"), rs.getString("f.tamanyo"), rs.getInt("f.cantidad"), rs.getString("f.foto")));
            }
            return fungibles;
        } catch (SQLException ex) {
            return null;
        } finally {
            desconectar();
        }
    }

    List<Herramienta> obtenerHerramientasPorEquipo(Equipo e) {
        List<Herramienta> herramientas = new ArrayList<>();
        String sql = "SELECT h.* FROM herramientas h JOIN equipos_herramientas eh ON h.id = eh.herramienta_id JOIN equipos e ON eh.equipo_id = e.id WHERE e.id = ?";

        try {
            if (conn == null || conn.isClosed()) {
                conn = this.conectar(false);
            }
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, e.getId());
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                herramientas.add(new Herramienta(rs.getInt("h.id"), rs.getString("h.marca"), rs.getString("h.modelo"), rs.getString("h.fabricante"), rs.getDate("h.fecha_compra"), rs.getString("h.foto")));
            }
            return herramientas;
        } catch (SQLException ex) {
            return null;
        } finally {
            desconectar();
        }
    }

    List<Equipo> obtenerEquiposPorFungible(Fungible f) {
        List<Equipo> equipos = new ArrayList<>();
        String sql = "SELECT e.* FROM equipos e JOIN equipos_fungibles ef ON e.id = ef.equipo_id JOIN fungibles f ON ef.fungible_id = f.id WHERE f.id = ?";

        try {
            if (conn == null || conn.isClosed()) {
                conn = this.conectar(false);
            }
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, f.getId());
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                equipos.add(new Equipo(rs.getInt("e.id"), rs.getInt("e.num_inventario"), rs.getString("e.nombre"), rs.getDate("e.fecha_compra"), rs.getString("e.fabricante"), rs.getDate("e.fecha_ultima_calibracion"), rs.getDate("e.fecha_proxima_calibracion"), rs.getDate("e.fecha_ultimo_mantenimiento"), rs.getDate("e.fecha_proximo_mantenimiento"), rs.getString("foto")));
            }
            return equipos;
        } catch (SQLException ex) {
            return null;
        } finally {
            desconectar();
        }
    }

    List<Herramienta> obtenerHerramientasPorFungible(Fungible f) {
        List<Herramienta> herramientas = new ArrayList<>();
        String sql = "SELECT h.* FROM herramientas h JOIN fungibles_herramientas fh ON h.id = fh.herramienta_id JOIN fungibles f ON fh.fungible_id = f.id WHERE f.id = ?";

        try {
            if (conn == null || conn.isClosed()) {
                conn = this.conectar(false);
            }
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, f.getId());
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                herramientas.add(new Herramienta(rs.getInt("h.id"), rs.getString("h.marca"), rs.getString("h.modelo"), rs.getString("h.fabricante"), rs.getDate("h.fecha_compra"), rs.getString("h.foto")));
            }
            return herramientas;
        } catch (SQLException ex) {
            return null;
        } finally {
            desconectar();
        }
    }

    List<Equipo> obtenerEquiposPorHerramienta(Herramienta h) {
        List<Equipo> equipos = new ArrayList<>();
        String sql = "SELECT e.* FROM equipos e JOIN equipos_herramientas eh ON e.id = eh.equipo_id JOIN herramientas h ON eh.herramienta_id = h.id WHERE h.id = ?";

        try {
            if (conn == null || conn.isClosed()) {
                conn = this.conectar(false);
            }
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, h.getId());
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                equipos.add(new Equipo(rs.getInt("e.id"), rs.getInt("e.num_inventario"), rs.getString("e.nombre"), rs.getDate("e.fecha_compra"), rs.getString("e.fabricante"), rs.getDate("e.fecha_ultima_calibracion"), rs.getDate("e.fecha_proxima_calibracion"), rs.getDate("e.fecha_ultimo_mantenimiento"), rs.getDate("e.fecha_proximo_mantenimiento"), rs.getString("e.foto")));
            }
            return equipos;
        } catch (SQLException ex) {
            return null;
        } finally {
            desconectar();
        }
    }

    List<Fungible> obtenerFungiblesPorHerramienta(Herramienta h) {
        List<Fungible> fungibles = new ArrayList<>();
        String sql = "SELECT f.* FROM fungibles f JOIN fungibles_herramientas fh ON f.id = fh.fungible_id JOIN herramientas h ON fh.herramienta_id = h.id WHERE h.id = ?";

        try {
            if (conn == null || conn.isClosed()) {
                conn = this.conectar(false);
            }
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, h.getId());
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                fungibles.add(new Fungible(rs.getInt("f.id"), rs.getString("f.marca"), rs.getString("f.modelo"), rs.getString("f.tamanyo"), rs.getInt("f.cantidad"), rs.getString("f.foto")));
            }
            return fungibles;
        } catch (SQLException ex) {
            return null;
        } finally {
            desconectar();
        }
    }

    Usuario comprobarCredenciales(String nombreUsuario, String contrasenia) {
        String sql = "SELECT * FROM usuarios WHERE usuario = ? AND contrasenia = ?";

        try {
            if (conn == null || conn.isClosed()) {
                conn = this.conectar(false);
            }

            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, nombreUsuario);
            ps.setString(2, contrasenia);

            ResultSet rs = ps.executeQuery();

            // Si hay al menos una fila en el resultado, las credenciales son válidas
            if (rs.next()) {
                if (rs.getString("contrasenia").equals(contrasenia)) {
                    Integer rol = rs.getInt("rol");
                    return new Usuario(nombreUsuario, contrasenia, rol);
                }
            }
        } catch (SQLException ex) {
            return null;
        } finally {
            desconectar();
        }

        // Si hay algún error o las credenciales son inválidas, retornar null
        return null;
    }
    
    private void generarCopiaDeSeguridad() {
        try {
            // Ruta del archivo backup.sql
            String backupSqlPath = System.getProperty("user.home") + "\\Documents\\backupInventario.sql";

            // Verificar si existe un archivo backup.sql
            File sqlFile = new File(backupSqlPath);
            if (sqlFile.exists()) {
                // Cambiar la extensión del archivo existente a .sql.zip
                File zipFile = new File(System.getProperty("user.home") + "\\Documents\\backupInventario.sql.zip");
                sqlFile.renameTo(zipFile);

                // Generar un nuevo archivo .sql con el contenido del archivo original
                File newSqlFile = new File(backupSqlPath);
                newSqlFile.createNewFile();
                FileWriter writer = new FileWriter(newSqlFile);
                BufferedReader reader = new BufferedReader(new FileReader(zipFile));
                String line;
                while ((line = reader.readLine()) != null) {
                    writer.write(line + "\n");
                }
                writer.close();
                reader.close();

                // Sobreescribir el contenido del archivo .sql.zip con el nuevo archivo .sql
                FileOutputStream fos = new FileOutputStream(zipFile);
                FileInputStream fis = new FileInputStream(newSqlFile);
                byte[] buffer = new byte[1024];
                int length;
                while ((length = fis.read(buffer)) > 0) {
                    fos.write(buffer, 0, length);
                }
                fos.close();
                fis.close();

                // Realizar la copia de seguridad en el archivo .sql.zip
                realizarCopiaSeguridad(zipFile);
            } else {
                // Si no existe, crear un nuevo archivo .sql
                sqlFile.createNewFile();

                // Realizar la copia de seguridad en el nuevo archivo .sql
                realizarCopiaSeguridad(sqlFile);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void realizarCopiaSeguridad(File sqlFile) {
        try {
            // Generar una nueva copia de seguridad en el archivo .sql
            ProcessBuilder processBuilder = new ProcessBuilder(
                    "C:\\xampp\\mysql\\bin\\mysqldump",
                    "--user=" + USER,
                    "--password=" + PASSWORD,
                    "--host=localhost",
                    "--port=3306",
                    "inventario"
            );
            processBuilder.redirectOutput(sqlFile);
            Process process = processBuilder.start();
            process.waitFor();
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }
}
