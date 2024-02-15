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
                int id = rs.getInt("id");
                String marca = rs.getString("marca");
                String modelo = rs.getString("modelo");
                String fabricante = rs.getString("fabricante");
                Date fechaCompra = rs.getDate("fecha_compra");
                herramientas.add(new Herramienta(id, marca, modelo, fabricante, fechaCompra));
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
        String sql = "INSERT INTO equipos (num_identificacion, nombre, fecha_compra, fabricante, fecha_ultima_calibracion, fecha_proxima_calibracion, fecha_ultimo_mantenimiento, fecha_proximo_mantenimiento)"
                + "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

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
            ps.setDate(7, new Date(e.getFechaUltimoMantenimiento().getTime()));
            ps.setDate(8, new Date(e.getFechaProximoMantenimiento().getTime()));
            filasAfectadas = ps.executeUpdate();

            // Obtener el ID del equipo recién insertado
            ResultSet rs = ps.getGeneratedKeys();
            if (rs.next()) {
                int idEquipoInsertado = rs.getInt(1);
                e.setId(idEquipoInsertado);
                // Asociar el equipo con los fungibles
                for (Fungible f : e.getFungibles()) {
                    asociarEquipoFungible(e, f);
                }
                // Asociar el equipo con las herramientas
                for (Herramienta h : e.getHerramientas()) {
                    asociarEquipoHerramienta(e, h);
                }
            }

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
        String sql = "UPDATE equipos SET num_identificacion = ?, nombre = ?, fecha_compra = ?, fabricante = ?, fecha_ultima_calibracion = ?, fecha_proxima_calibracion = ?, fecha_ultimo_mantenimiento = ?, fecha_proximo_mantenimiento = ? WHERE id = ?";

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
            ps.setDate(7, new Date(e.getFechaUltimoMantenimiento().getTime()));
            ps.setDate(8, new Date(e.getFechaProximoMantenimiento().getTime()));
            ps.setInt(9, e.getId());
            filasAfectadas = ps.executeUpdate();

            // Verificar si la asociación entre equipos y fungibles existe
            boolean asociacionFungiblesExiste = verificarAsociacionFungiblesExistente(e);
            // Verificar si la asociación entre equipos y herramientas existe
            boolean asociacionHerramientasExiste = verificarAsociacionHerramientasExistente(e);

            // Actualizar asociaciones según corresponda
            if (asociacionFungiblesExiste && asociacionHerramientasExiste) {
                // Ambas asociaciones existen
                for (Fungible f : e.getFungibles()) {
                    filasAfectadas += asociarEquipoFungible(e, f);
                }
                for (Herramienta h : e.getHerramientas()) {
                    filasAfectadas += asociarEquipoHerramienta(e, h);
                }
            } else if (asociacionFungiblesExiste) {
                // Solo la asociación con fungibles existe
                for (Fungible f : e.getFungibles()) {
                    filasAfectadas += asociarEquipoFungible(e, f);
                }
            } else if (asociacionHerramientasExiste) {
                // Solo la asociación con herramientas existe
                for (Herramienta h : e.getHerramientas()) {
                    filasAfectadas += asociarEquipoHerramienta(e, h);
                }
            } else {
                // Ninguna asociación existe
                filasAfectadas = 0;
            }

            return filasAfectadas;
        } catch (SQLException ex) {
            return 0;
        } finally {
            desconectar();
        }
    }

    // Método para verificar si la asociación entre equipos y fungibles existe
    private boolean verificarAsociacionFungiblesExistente(Equipo e) {
        List<Fungible> fungiblesAsociados = obtenerFungiblesPorEquipo(e);
        return !fungiblesAsociados.isEmpty();
    }

    // Método para verificar si la asociación entre equipos y herramientas existe
    private boolean verificarAsociacionHerramientasExistente(Equipo e) {
        List<Herramienta> herramientasAsociadas = obtenerHerramientasPorEquipo(e);
        return !herramientasAsociadas.isEmpty();
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

    int insertarFungible(Fungible f) {
        int filasAfectadas;
        String sql = "INSERT INTO fungibles (marca, modelo, tamanyo, cantidad)"
                + "VALUES (?, ?, ?, ?)";

        try {
            if (conn == null || conn.isClosed()) {
                conn = this.conectar(false);
            }
            PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, f.getMarca());
            ps.setString(2, f.getModelo());
            ps.setString(3, f.getTamanyo());
            ps.setInt(4, f.getCantidad());
            filasAfectadas = ps.executeUpdate();

            // Obtener el ID del fungible recién insertado
            ResultSet rs = ps.getGeneratedKeys();
            if (rs.next()) {
                int idFungibleInsertado = rs.getInt(1);
                f.setId(idFungibleInsertado);
                // Asociar el fungible con las herramientas
                for (Herramienta h : f.getHerramientas()) {
                    asociarFungibleHerramienta(f, h);
                }
            }

            return filasAfectadas;
        } catch (SQLException ex) {
            return 0;
        } finally {
            desconectar();
        }
    }

    int asociarFungibleHerramienta(Fungible f, Herramienta h) {
        int filasAfectadas;
        String sql = "INSERT INTO fungibles_herramientas VALUES (?, ?)";

        try {
            if (conn == null || conn.isClosed()) {
                conn = this.conectar(false);
            }
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, f.getId());
            ps.setInt(2, h.getId());
            filasAfectadas = ps.executeUpdate();
            return filasAfectadas;
        } catch (SQLException ex) {
            return 0;
        } finally {
            desconectar();
        }
    }

    int modificarFungible(Fungible f) {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

    int eliminarFungible(Fungible f) {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

    List<Fungible> obtenerFungiblesPorEquipo(Equipo e) {
        List<Fungible> fungibles = new ArrayList<>();
        String sql = "SELECT f.id, f.marca, f.modelo, f.tamanyo, f.cantidad FROM equipos e JOIN equipos_fungibles ef ON e.id = ef.equipo_id JOIN fungibles f ON ef.fungible_id = f.id WHERE e.id = ?";

        try {
            if (conn == null || conn.isClosed()) {
                conn = this.conectar(false);
            }
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, e.getId());
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                int id = rs.getInt("f.id");
                String marca = rs.getString("f.marca");
                String modelo = rs.getString("f.modelo");
                String tamanyo = rs.getString("f.tamanyo");
                int cantidad = rs.getInt("f.cantidad");
                fungibles.add(new Fungible(id, marca, modelo, tamanyo, cantidad));
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
        String sql = "SELECT h.id, h.marca, h.modelo, h.fabricante, h.fecha_compra FROM equipos e JOIN equipos_herramientas eh ON e.id = eh.equipo_id JOIN herramientas h ON eh.herramienta_id = h.id WHERE e.id = ?";

        try {
            if (conn == null || conn.isClosed()) {
                conn = this.conectar(false);
            }
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, e.getId());
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                int id = rs.getInt("h.id");
                String marca = rs.getString("h.marca");
                String modelo = rs.getString("h.modelo");
                String fabricante = rs.getString("h.fabricante");
                Date fechaCompra = rs.getDate("h.fecha_compra");
                herramientas.add(new Herramienta(id, marca, modelo, fabricante, fechaCompra));
            }
            return herramientas;
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
                int id = rs.getInt("h.id");
                String marca = rs.getString("h.marca");
                String modelo = rs.getString("h.modelo");
                String fabricante = rs.getString("h.fabricante");
                Date fechaCompra = rs.getDate("h.fecha_compra");
                herramientas.add(new Herramienta(id, marca, modelo, fabricante, fechaCompra));
            }
            return herramientas;
        } catch (SQLException ex) {
            return null;
        } finally {
            desconectar();
        }
    }
}
