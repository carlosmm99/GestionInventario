/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package modelo;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author carlos.mondejar
 */
public class Fungible {

    private int id;
    private String marca;
    private String modelo;
    private String tamanyo;
    private int cantidad;
    private List<Equipo> equipos;
    private List<Herramienta> herramientas;
    private String foto;

    public Fungible() {
    }

    public Fungible(int id, String marca, String modelo, String tamanyo, int cantidad, String foto) {
        this.id = id;
        this.marca = marca;
        this.modelo = modelo;
        this.tamanyo = tamanyo;
        this.cantidad = cantidad;
        this.equipos = new ArrayList<>();
        this.herramientas = new ArrayList<>();
        this.foto = foto;
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

    public String getTamanyo() {
        return tamanyo;
    }

    public void setTamanyo(String tamanyo) {
        this.tamanyo = tamanyo;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }

    public List<Equipo> getEquipos() {
        return equipos;
    }

    public void setEquipos(List<Equipo> equipos) {
        this.equipos = equipos;
    }

    public List<Herramienta> getHerramientas() {
        return herramientas;
    }

    public void setHerramientas(List<Herramienta> herramientas) {
        this.herramientas = herramientas;
    }

    public String getFoto() {
        return foto;
    }

    public void setFoto(String foto) {
        this.foto = foto;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("id: ").append(id)
                .append(", marca: ").append(marca)
                .append(", modelo: ").append(modelo)
                .append(", tamaño: ").append(tamanyo)
                .append(", cantidad: ").append(cantidad);
        return sb.toString();
    }
}
