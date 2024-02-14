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
public class Herramienta {

    private int id;
    private String marca;
    private String modelo;
    private String fabricante;
    private Date fechaCompra;
    private List<Equipo> equipos;
    private List<Fungible> fungibles;

    public Herramienta() {
    }

    public Herramienta(int id, String marca, String modelo, String fabricante, Date fechaCompra) {
        this.id = id;
        this.marca = marca;
        this.modelo = modelo;
        this.fabricante = fabricante;
        this.fechaCompra = fechaCompra;
        this.equipos = new ArrayList<>();
        this.fungibles = new ArrayList<>();
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public String getFabricante() {
        return fabricante;
    }

    public void setFabricante(String fabricante) {
        this.fabricante = fabricante;
    }

    public Date getFechaCompra() {
        return fechaCompra;
    }

    public void setFechaCompra(Date fechaCompra) {
        this.fechaCompra = fechaCompra;
    }

    public List<Equipo> getEquipos() {
        return equipos;
    }

    public void setEquipos(List<Equipo> equipos) {
        this.equipos = equipos;
    }

    public List<Fungible> getFungibles() {
        return fungibles;
    }

    public void setFungibles(List<Fungible> fungibles) {
        this.fungibles = fungibles;
    }
}
