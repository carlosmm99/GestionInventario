/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package modelo;

import java.util.Date;

/**
 *
 * @author carlos.mondejar
 */
public class Equipo {

    private int id;
    private int numIdentificacion;
    private String nombre;
    private Date fechaCompra;
    private String fabricante;
    private Date fechaUltimaCalibracion;
    private Date fechaProximaCalibracion;
    private Date fechaUltimoMantenimiento;
    private Date fechaProximoMantenimiento;

    public Equipo() {
    }

    public Equipo(int id, int numIdentificacion, String nombre, Date fechaCompra, String fabricante, Date fechaUltimaCalibracion, Date fechaProximaCalibracion, Date fechaUltimoMantenimiento, Date fechaProximoMantenimiento) {
        this.id = id;
        this.numIdentificacion = numIdentificacion;
        this.nombre = nombre;
        this.fechaCompra = fechaCompra;
        this.fabricante = fabricante;
        this.fechaUltimaCalibracion = fechaUltimaCalibracion;
        this.fechaProximaCalibracion = fechaProximaCalibracion;
        this.fechaUltimoMantenimiento = fechaUltimoMantenimiento;
        this.fechaProximoMantenimiento = fechaProximoMantenimiento;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getNumIdentificacion() {
        return numIdentificacion;
    }

    public void setNumIdentificacion(int numIdentificacion) {
        this.numIdentificacion = numIdentificacion;
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
}
