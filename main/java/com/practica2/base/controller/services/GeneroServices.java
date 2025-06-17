package com.practica2.base.controller.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Arrays; 

import com.practica2.base.controller.dao.dao_models.DaoGenero;
import com.practica2.base.models.Genero;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull; 

@BrowserCallable
@AnonymousAllowed
public class GeneroServices {
    private DaoGenero db;

    public GeneroServices() {
        db = new DaoGenero();
    }

   
    public void create(@NotEmpty String nombre) throws Exception {
        if (nombre.trim().isEmpty()) {
            throw new Exception("El nombre del género no puede estar vacío.");
        }
        db.getObj().setNombre(nombre);
        if (!db.save()) {
            throw new Exception("No se pudo guardar los datos del género.");
        }
    }

    
    public void update(@NotNull Integer id, @NotEmpty String nombre) throws Exception {
        if (id == null || id <= 0) {
            throw new Exception("ID del género inválido para actualizar.");
        }
        if (nombre.trim().isEmpty()) {
            throw new Exception("El nombre del género no puede estar vacío.");
        }

        
        List<Genero> allGeneros = Arrays.asList(db.listAll().toArray());
        
        // Busqueda por el género por ID y su posición
        Genero generoToUpdate = null;
        int posToUpdate = -1;
        for (int i = 0; i < allGeneros.size(); i++) {
            Genero g = allGeneros.get(i);
            
            if (g != null && g.getId() != null && g.getId().equals(id)) {
                generoToUpdate = g;
                posToUpdate = i;
                break;
            }
        }

        if (generoToUpdate == null || posToUpdate == -1) {
            throw new Exception("Género con ID " + id + " no encontrado para actualizar.");
        }

        
        generoToUpdate.setNombre(nombre);

      
        db.setObj(generoToUpdate);

      
        db.update(generoToUpdate, posToUpdate); 
        
    }

   
    public List<HashMap<String, String>> listGenero() { 
        List<HashMap<String, String>> lista = new ArrayList<>();
        if (!db.listAll().isEmpty()) {
            Genero[] arreglo = db.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("id", arreglo[i].getId() != null ? arreglo[i].getId().toString() : ""); 
                aux.put("nombre", arreglo[i].getNombre());
                lista.add(aux);
            }
        }
        return lista;
    }
  
    public List<Genero> listAllGenerosRaw() {
        return Arrays.asList(db.listAll().toArray());
    }
}