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
    private int numIdentificacion;
    private String nombre;
    private Date fechaCompra;
    private String fabricante;
    private Date fechaUltimaCalibracion;
    private Date fechaProximaCalibracion;
    private List<Fungible> fungibles;
    private List<Herramienta> herramientas = new ArrayList<>();

    public Equipo() {
    }

    public Equipo(int id, int numIdentificacion, String nombre, Date fechaCompra, String fabricante, Date fechaUltimaCalibracion, Date fechaProximaCalibracion) {
        this.id = id;
        this.numIdentificacion = numIdentificacion;
        this.nombre = nombre;
        this.fechaCompra = fechaCompra;
        this.fabricante = fabricante;
        this.fechaUltimaCalibracion = fechaUltimaCalibracion;
        this.fechaProximaCalibracion = fechaProximaCalibracion;
        this.fungibles = new ArrayList<>();
        this.herramientas = new ArrayList<>();
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
}
