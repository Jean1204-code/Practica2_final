package com.practica2.base.models;

public class Artista {
    private Integer id;
    private String nombres;
    private String nacionalidad;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNombres() {
        return this.nombres;
    }

    public void setNombres(String nombres) {
        this.nombres = nombres;
    }

    public String getNacionalidad() {
        return this.nacionalidad;
    }

    public void setNacionalidad(String nacionalidad) { 
        this.nacionalidad = nacionalidad;
    }

}