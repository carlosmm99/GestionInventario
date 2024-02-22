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
import modelo.Usuario;

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
                int id = rs.getInt("id");
                int numIdentificacion = rs.getInt("num_inventario");
                String nombre = rs.getString("nombre");
                Date fechaCompra = rs.getDate("fecha_compra");
                String fabricante = rs.getString("fabricante");
                Date fechaUltimaCalibracion = rs.getDate("fecha_ultima_calibracion");
                Date fechaProximaCalibracion = rs.getDate("fecha_proxima_calibracion");
                Date fechaUltimoMantenimiento = rs.getDate("fecha_ultimo_mantenimiento");
                Date fechaProximoMantenimiento = rs.getDate("fecha_proximo_mantenimiento");
                equipos.add(new Equipo(id, numIdentificacion, nombre, fechaCompra, fabricante, fechaUltimaCalibracion, fechaProximaCalibracion, fechaUltimoMantenimiento, fechaProximoMantenimiento));
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
        String sql = "INSERT INTO equipos (num_inventario, nombre, fecha_compra, fabricante, fecha_ultima_calibracion, fecha_proxima_calibracion, fecha_ultimo_mantenimiento, fecha_proximo_mantenimiento)"
                + "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

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
                // Asociar el fungible con los equipos
                for (Equipo e : f.getEquipos()) {
                    asociarEquipoFungible(e, f);
                }
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

    int insertarHerramienta(Herramienta h) {
        int filasAfectadas;
        String sql = "INSERT INTO herramientas (marca, modelo, fabricante, fecha_compra)"
                + "VALUES (?, ?, ?, ?)";

        try {
            if (conn == null || conn.isClosed()) {
                conn = this.conectar(false);
            }
            PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, h.getMarca());
            ps.setString(2, h.getModelo());
            ps.setString(3, h.getFabricante());
            ps.setDate(4, new Date(h.getFechaCompra().getTime()));
            filasAfectadas = ps.executeUpdate();

            // Obtener el ID de la herramienta recién insertada
            ResultSet rs = ps.getGeneratedKeys();
            if (rs.next()) {
                int idHerramientaInsertada = rs.getInt(1);
                h.setId(idHerramientaInsertada);
                // Asociar la herramienta con los equipos
                for (Equipo e : h.getEquipos()) {
                    asociarEquipoHerramienta(e, h);
                }
                // Asociar la herramienta con los fungibles
                for (Fungible f : h.getFungibles()) {
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
                return new Equipo(idEquipo, rs.getInt("num_inventario"), rs.getString("nombre"), rs.getDate("fecha_compra"), rs.getString("fabricante"), rs.getDate("fecha_ultima_calibracion"), rs.getDate("fecha_proxima_calibracion"), rs.getDate("fecha_ultimo_mantenimiento"), rs.getDate("fecha_proximo_mantenimiento"));
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
                return new Fungible(idFungible, rs.getString("marca"), rs.getString("modelo"), rs.getString("tamanyo"), rs.getInt("cantidad"));
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
                return new Herramienta(idHerramienta, rs.getString("marca"), rs.getString("modelo"), rs.getString("fabricante"), rs.getDate("fecha_compra"));
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
        String sql = "UPDATE equipos SET num_inventario = ?, nombre = ?, fecha_compra = ?, fabricante = ?, fecha_ultima_calibracion = ?, fecha_proxima_calibracion = ?, fecha_ultimo_mantenimiento = ?, fecha_proximo_mantenimiento = ? WHERE id = ?";

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
            ps.setInt(9, e.getId());
            filasAfectadas = ps.executeUpdate();

            // Verificar si la asociación entre equipos y fungibles existe
            boolean asociacionFungiblesExiste = verificarAsociacionEquiposFungiblesExistente(e);
            // Verificar si la asociación entre equipos y herramientas existe
            boolean asociacionHerramientasExiste = verificarAsociacionEquiposHerramientasExistente(e);

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

    int modificarFungible(Fungible f) {
        int filasAfectadas;
        String sql = "UPDATE fungibles SET marca = ?, modelo = ?, tamanyo = ?, cantidad = ? WHERE id = ?";

        try {
            if (conn == null || conn.isClosed()) {
                conn = this.conectar(false);
            }
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, f.getMarca());
            ps.setString(2, f.getModelo());
            ps.setString(3, f.getTamanyo());
            ps.setInt(4, f.getCantidad());
            ps.setInt(5, f.getId());
            filasAfectadas = ps.executeUpdate();

            // Verificar si la asociación entre fungibles y equipos existe
            boolean asociacionEquiposExiste = verificarAsociacionFungiblesEquiposExistente(f);
            // Verificar si la asociación entre fungibles y herramientas existe
            boolean asociacionHerramientasExiste = verificarAsociacionFungiblesHerramientasExistente(f);

            // Actualizar asociaciones según corresponda
            if (asociacionEquiposExiste && asociacionHerramientasExiste) {
                // Ambas asociaciones existen
                for (Equipo e : f.getEquipos()) {
                    filasAfectadas += asociarEquipoFungible(e, f);
                }
                for (Herramienta h : f.getHerramientas()) {
                    filasAfectadas += asociarFungibleHerramienta(f, h);
                }
            } else if (asociacionEquiposExiste) {
                // Solo la asociación con equipos existe
                for (Equipo e : f.getEquipos()) {
                    filasAfectadas += asociarEquipoFungible(e, f);
                }
            } else if (asociacionHerramientasExiste) {
                // Solo la asociación con herramientas existe
                for (Herramienta h : f.getHerramientas()) {
                    filasAfectadas += asociarFungibleHerramienta(f, h);
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

    int modificarHerramienta(Herramienta h) {
        int filasAfectadas;
        String sql = "UPDATE herramientas SET marca = ?, modelo = ?, fabricante = ?, fecha_compra = ? WHERE id = ?";

        try {
            if (conn == null || conn.isClosed()) {
                conn = this.conectar(false);
            }
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, h.getMarca());
            ps.setString(2, h.getModelo());
            ps.setString(3, h.getFabricante());
            ps.setDate(4, new Date(h.getFechaCompra().getTime()));
            ps.setInt(5, h.getId());
            filasAfectadas = ps.executeUpdate();

            // Verificar si la asociación entre herramientas y equipos existe
            boolean asociacionEquiposExiste = verificarAsociacionHerramientasEquiposExistente(h);
            // Verificar si la asociación entre herramientas y fungibles existe
            boolean asociacionFungiblesExiste = verificarAsociacionHerramientasFungiblesExistente(h);

            // Actualizar asociaciones según corresponda
            if (asociacionEquiposExiste && asociacionFungiblesExiste) {
                // Ambas asociaciones existen
                for (Equipo e : h.getEquipos()) {
                    filasAfectadas += asociarEquipoHerramienta(e, h);
                }
                for (Fungible f : h.getFungibles()) {
                    filasAfectadas += asociarFungibleHerramienta(f, h);
                }
            } else if (asociacionEquiposExiste) {
                // Solo la asociación con equipos existe
                for (Equipo e : h.getEquipos()) {
                    filasAfectadas += asociarEquipoHerramienta(e, h);
                }
            } else if (asociacionFungiblesExiste) {
                // Solo la asociación con fungibles existe
                for (Fungible f : h.getFungibles()) {
                    filasAfectadas += asociarFungibleHerramienta(f, h);
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
    private boolean verificarAsociacionEquiposFungiblesExistente(Equipo e) {
        List<Fungible> fungiblesAsociados = obtenerFungiblesPorEquipo(e);
        return !fungiblesAsociados.isEmpty();
    }

    // Método para verificar si la asociación entre equipos y herramientas existe
    private boolean verificarAsociacionEquiposHerramientasExistente(Equipo e) {
        List<Herramienta> herramientasAsociadas = obtenerHerramientasPorEquipo(e);
        return !herramientasAsociadas.isEmpty();
    }

    // Método para verificar si la asociación entre fungibles y equipos existe
    private boolean verificarAsociacionFungiblesEquiposExistente(Fungible f) {
        List<Equipo> equiposAsociados = obtenerEquiposPorFungible(f);
        return !equiposAsociados.isEmpty();
    }

    // Método para verificar si la asociación entre fungibles y herramientas existe
    private boolean verificarAsociacionFungiblesHerramientasExistente(Fungible f) {
        List<Herramienta> herramientasAsociadas = obtenerHerramientasPorFungible(f);
        return !herramientasAsociadas.isEmpty();
    }

    // Método para verificar si la asociación entre herramientas y equipos existe
    private boolean verificarAsociacionHerramientasEquiposExistente(Herramienta h) {
        List<Equipo> equiposAsociados = obtenerEquiposPorHerramienta(h);
        return !equiposAsociados.isEmpty();
    }

    // Método para verificar si la asociación entre herramientas y fungibles existe
    private boolean verificarAsociacionHerramientasFungiblesExistente(Herramienta h) {
        List<Fungible> fungiblesAsociados = obtenerFungiblesPorHerramienta(h);
        return !fungiblesAsociados.isEmpty();
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
                int id = rs.getInt("f.id");
                String marca = rs.getString("f.marca");
                String modelo = rs.getString("f.modelo");
                String tamanyo = rs.getString("f.tamanyo");
                int cantidad = rs.getInt("f.cantidad");
                fungibles.add(new Fungible(id, marca, modelo, tamanyo, cantidad));
            }
            return fungibles;
        } catch (SQLException ex) {
            Logger.getLogger(Controlador.class.getName()).log(Level.SEVERE, null, ex);
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
                int id = rs.getInt("e.id");
                int numIdentificacion = rs.getInt("e.num_inventario");
                String nombre = rs.getString("e.nombre");
                Date fechaCompra = rs.getDate("e.fecha_compra");
                String fabricante = rs.getString("e.fabricante");
                Date fechaUltimaCalibracion = rs.getDate("e.fecha_ultima_calibracion");
                Date fechaProximaCalibracion = rs.getDate("e.fecha_proxima_calibracion");
                Date fechaUltimoMantenimiento = rs.getDate("e.fecha_ultimo_mantenimiento");
                Date fechaProximoMantenimiento = rs.getDate("e.fecha_proximo_mantenimiento");
                equipos.add(new Equipo(id, numIdentificacion, nombre, fechaCompra, fabricante, fechaUltimaCalibracion, fechaProximaCalibracion, fechaUltimoMantenimiento, fechaProximoMantenimiento));
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
                int id = rs.getInt("e.id");
                int numIdentificacion = rs.getInt("e.num_inventario");
                String nombre = rs.getString("e.nombre");
                Date fechaCompra = rs.getDate("e.fecha_compra");
                String fabricante = rs.getString("e.fabricante");
                Date fechaUltimaCalibracion = rs.getDate("e.fecha_ultima_calibracion");
                Date fechaProximaCalibracion = rs.getDate("e.fecha_proxima_calibracion");
                Date fechaUltimoMantenimiento = rs.getDate("e.fecha_ultimo_mantenimiento");
                Date fechaProximoMantenimiento = rs.getDate("e.fecha_proximo_mantenimiento");
                equipos.add(new Equipo(id, numIdentificacion, nombre, fechaCompra, fabricante, fechaUltimaCalibracion, fechaProximaCalibracion, fechaUltimoMantenimiento, fechaProximoMantenimiento));
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
                int id = rs.getInt("f.id");
                String marca = rs.getString("f.marca");
                String modelo = rs.getString("f.modelo");
                String tamanyo = rs.getString("f.tamanyo");
                int cantidad = rs.getInt("f.cantidad");
                fungibles.add(new Fungible(id, marca, modelo, tamanyo, cantidad));
            }
            return fungibles;
        } catch (SQLException ex) {
            Logger.getLogger(Controlador.class.getName()).log(Level.SEVERE, null, ex);
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

}
