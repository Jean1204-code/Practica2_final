package com.practica2.base.controller.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.practica2.base.controller.dao.dao_models.DaoGenero;
import com.practica2.base.models.Genero;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

import jakarta.validation.constraints.NotEmpty;

@BrowserCallable
@AnonymousAllowed
public class GeneroServices {
    private DaoGenero db;

    public GeneroServices() {
        db = new DaoGenero();
    }

    public void create(@NotEmpty String nombre) throws Exception {
        if (nombre.trim().length() > 0) {
            db.getObj().setNombre(nombre);
            if (!db.save())
                throw new Exception("No se pudo guardar los datos del género");
        } else {
            throw new Exception("El nombre del género no puede estar vacío");
        }
    }

    public void update(Integer id, @NotEmpty String nombre) throws Exception {
        if (nombre.trim().length() > 0) {
            if (id == null || id <= 0) {
                throw new Exception("ID del género inválido para actualizar");
            }
            
            Genero generoToUpdate = null;
            int pos = -1;
            if(!db.listAll().isEmpty()) {
                Genero[] arreglo = db.listAll().toArray();
                for(int i = 0; i < arreglo.length; i++) {
                    if (arreglo[i].getId() != null && arreglo[i].getId().equals(id)) {
                        generoToUpdate = arreglo[i];
                        pos = i;
                        break;
                    }
                }
            }

            if (generoToUpdate != null && pos != -1) {
                db.setObj(generoToUpdate);
                db.getObj().setNombre(nombre);
                
            } else {
                throw new Exception("Género con ID " + id + " no encontrado para actualizar.");
            }
        } else {
            throw new Exception("El nombre del género no puede estar vacío");
        }
    }

    public List<HashMap> listGenero() {
        List<HashMap> lista = new ArrayList<>();
        if (!db.listAll().isEmpty()) {
            Genero[] arreglo = db.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("id", arreglo[i].getId().toString());
                aux.put("nombre", arreglo[i].getNombre());
                lista.add(aux);
            }
        }
        return lista;
    }
}