/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package modelo;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 *
 * @author carlos.mondejar
 */
public class Equipo {

    private int id;
    private int numInventario;
    private String nombre;
    private Date fechaCompra;
    private String fabricante;
    private Date fechaUltimaCalibracion;
    private Date fechaProximaCalibracion;
    private Date fechaUltimoMantenimiento;
    private Date fechaProximoMantenimiento;
    private List<Fungible> fungibles;
    private List<Herramienta> herramientas;

    public Equipo() {
    }

    public Equipo(int id, int numInventario, String nombre, Date fechaCompra, String fabricante, Date fechaUltimaCalibracion, Date fechaProximaCalibracion, Date fechaUltimoMantenimiento, Date fechaProximoMantenimiento) {
        this.id = id;
        this.numInventario = numInventario;
        this.nombre = nombre;
        this.fechaCompra = fechaCompra;
        this.fabricante = fabricante;
        this.fechaUltimaCalibracion = fechaUltimaCalibracion;
        this.fechaProximaCalibracion = fechaProximaCalibracion;
        this.fechaUltimoMantenimiento = fechaUltimoMantenimiento;
        this.fechaProximoMantenimiento = fechaProximoMantenimiento;
        this.fungibles = new ArrayList<>();
        this.herramientas = new ArrayList<>();
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getNumInventario() {
        return numInventario;
    }

    public void setNumInventario(int numInventario) {
        this.numInventario = numInventario;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Date getFechaCompra() {
        return fechaCompra;
    }

    public void setFechaCompra(Date fechaCompra) {
        this.fechaCompra = fechaCompra;
    }

    public String getFabricante() {
        return fabricante;
    }

    public void setFabricante(String fabricante) {
        this.fabricante = fabricante;
    }

    public Date getFechaUltimaCalibracion() {
        return fechaUltimaCalibracion;
    }

    public void setFechaUltimaCalibracion(Date fechaUltimaCalibracion) {
        this.fechaUltimaCalibracion = fechaUltimaCalibracion;
    }

    public Date getFechaProximaCalibracion() {
        return fechaProximaCalibracion;
    }

    public void setFechaProximaCalibracion(Date fechaProximaCalibracion) {
        this.fechaProximaCalibracion = fechaProximaCalibracion;
    }

    public Date getFechaUltimoMantenimiento() {
        return fechaUltimoMantenimiento;
    }

    public void setFechaUltimoMantenimiento(Date fechaUltimoMantenimiento) {
        this.fechaUltimoMantenimiento = fechaUltimoMantenimiento;
    }

    public Date getFechaProximoMantenimiento() {
        return fechaProximoMantenimiento;
    }

    public void setFechaProximoMantenimiento(Date fechaProximoMantenimiento) {
        this.fechaProximoMantenimiento = fechaProximoMantenimiento;
    }

    public List<Fungible> getFungibles() {
        return fungibles;
    }

    public void setFungibles(List<Fungible> fungibles) {
        this.fungibles = fungibles;
    }

    public List<Herramienta> getHerramientas() {
        return herramientas;
    }

    public void setHerramientas(List<Herramienta> herramientas) {
        this.herramientas = herramientas;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("id: ").append(id)
                .append(", número CEDEX: ").append(numInventario)
                .append(", nombre: ").append(nombre)
                .append(", fecha de compra: ").append(fechaCompra)
                .append(", fabricante: ").append(fabricante)
                .append(", fecha de la última calibración: ").append(fechaUltimaCalibracion)
                .append(", fecha de la próxima calibración: ").append(fechaProximaCalibracion)
                .append(", fecha del último mantenimiento: ").append(fechaUltimoMantenimiento)
                .append(", fecha del próximo mantenimiento: ").append(fechaProximoMantenimiento);
        return sb.toString();
    }
}
