package com.practica2.base.controller.services;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.text.SimpleDateFormat;

import com.practica2.base.controller.dao.dao_models.DaoBanda;
import com.practica2.base.models.Banda;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;


@BrowserCallable
@AnonymousAllowed
public class BandaService {
    private DaoBanda db;
    public BandaService(){
        db = new DaoBanda();
    }

    public void createBanda(@NotEmpty String nombre, @NotNull Date fecha) throws Exception {
        if(nombre.trim().isEmpty() || fecha == null) {
            throw new Exception("Datos de la banda incompletos o invalidos.");
        }
        db.getObj().setNombre(nombre);
        db.getObj().setFecha(fecha);
        if(!db.save())
            throw new  Exception("No se pudo guardar los datos de la banda");
    }

    public void updateBanda(@NotNull Integer id, @NotEmpty String nombre, @NotNull Date fecha) throws Exception {
        if(id == null || id <= 0 || nombre.trim().isEmpty() || fecha == null) {
            throw new Exception("Datos de la banda incompletos o invalidos para actualizar.");
        }
        Banda bandaToUpdate = null;
        int posToUpdate = -1;
        List<Banda> allBandas = Arrays.asList(db.listAll().toArray());
        for (int i = 0; i < allBandas.size(); i++) {
            Banda b = allBandas.get(i);
            if (b != null && b.getId() != null && b.getId().equals(id)) {
                bandaToUpdate = b;
                posToUpdate = i;
                break;
            }
        }

        if (bandaToUpdate == null || posToUpdate == -1) {
            throw new Exception("Banda con ID " + id + " no encontrada para actualizar.");
        }
        
        db.setObj(bandaToUpdate);
        db.getObj().setNombre(nombre);
        db.getObj().setFecha(fecha);
        if(!db.update(posToUpdate))
            throw new  Exception("No se pudo modificar los datos de la banda");
    }

    public List<HashMap<String, String>> listBanda(){
        List<HashMap<String, String>> lista = new ArrayList<>();
        if(!db.listAll().isEmpty()) {
            Banda [] arreglo = db.listAll().toArray();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

            for(int i = 0; i < arreglo.length; i++) {
                Banda banda = arreglo[i];
                HashMap<String, String> aux = new HashMap<>();
                aux.put("id", banda.getId() != null ? banda.getId().toString() : "");
                aux.put("nombre", banda.getNombre() != null ? banda.getNombre() : "");
                aux.put("fecha", banda.getFecha() != null ? sdf.format(banda.getFecha()) : "");
                lista.add(aux);
            }
        }
        return lista;
    }
}