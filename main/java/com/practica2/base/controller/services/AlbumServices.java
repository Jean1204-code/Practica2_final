package com.practica2.base.controller.services;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Arrays;
import java.text.SimpleDateFormat;

import com.practica2.base.controller.dao.dao_models.DaoAlbum;
import com.practica2.base.controller.dao.dao_models.DaoBanda;
import com.practica2.base.models.Album;
import com.practica2.base.models.Banda;

import com.vaadin.hilla.BrowserCallable;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

@BrowserCallable
@com.vaadin.flow.server.auth.AnonymousAllowed
public class AlbumServices {
    private DaoAlbum db;

    public AlbumServices() {
        db = new DaoAlbum();
    }

    public void create(@NotEmpty String nombre, @NotNull Date fecha, @NotNull Integer id_banda) throws Exception {
        if (nombre.trim().isEmpty() || fecha == null || id_banda == null || id_banda <= 0) {
            throw new Exception("Datos del album incompletos o invalidos.");
        }
        db.getObj().setNombre(nombre);
        db.getObj().setFecha(fecha);
        db.getObj().setId_banda(id_banda);

        if (!db.save())
            throw new Exception("No se pudo guardar los datos del album.");
    }

    public void update(@NotNull Integer id, @NotEmpty String nombre, @NotNull Date fecha, @NotNull Integer id_banda) throws Exception {
        if (id == null || id <= 0 || nombre.trim().isEmpty() || fecha == null || id_banda == null || id_banda <= 0) {
            throw new Exception("Datos del album incompletos o invalidos para actualizar.");
        }

        List<Album> allAlbums = Arrays.asList(db.listAll().toArray());
        Album albumToUpdate = null;
        int posToUpdate = -1;
        for (int i = 0; i < allAlbums.size(); i++) {
            Album a = allAlbums.get(i);
            if (a != null && a.getId() != null && a.getId().equals(id)) {
                albumToUpdate = a;
                posToUpdate = i;
                break;
            }
        }

        if (albumToUpdate == null || posToUpdate == -1) {
            throw new Exception("Album con ID " + id + " no encontrado para actualizar.");
        }

        albumToUpdate.setNombre(nombre);
        albumToUpdate.setFecha(fecha);
        albumToUpdate.setId_banda(id_banda);

        db.setObj(albumToUpdate);
        if (!db.update(posToUpdate)) {
            throw new Exception("No se pudo actualizar los datos del album.");
        }
    }

    public List<HashMap<String, String>> listBandaCombo(){
        List<HashMap<String, String>> lista = new ArrayList<>();
        DaoBanda dbBanda = new DaoBanda();
        if (!dbBanda.listAll().isEmpty()){
            Banda[] arreglo = dbBanda.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("value", arreglo[i].getId().toString());
                aux.put("label", arreglo[i].getNombre());
                lista.add(aux);
            }
        }
        return lista;
    }

    public List<HashMap<String, String>> listAlbum(){
        List<HashMap<String, String>> list = new ArrayList<>();
        DaoBanda daoBanda = new DaoBanda();
        if(!db.listAll().isEmpty()){
            Album[] arreglo = db.listAll().toArray();
            List<Banda> allBands = Arrays.asList(daoBanda.listAll().toArray());
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

            for (int i = 0; i < arreglo.length; i++) {
                Album album = arreglo[i];
                HashMap<String, String> aux = new HashMap<>();

                aux.put("id", album.getId() != null ? album.getId().toString() : "");
                aux.put("nombre", album.getNombre() != null ? album.getNombre() : "");
                aux.put("fecha", album.getFecha() != null ? sdf.format(album.getFecha()) : "");
                aux.put("id_banda", album.getId_banda() != null ? album.getId_banda().toString() : "");

                String nombreBanda = "Desconocida";
                if (album.getId_banda() != null && album.getId_banda() > 0 && album.getId_banda() <= allBands.size()) {
                    Banda bandaEncontrada = allBands.get(album.getId_banda() - 1);
                    if (bandaEncontrada != null && bandaEncontrada.getNombre() != null) {
                        nombreBanda = bandaEncontrada.getNombre();
                    }
                }
                aux.put("Banda", nombreBanda);

                list.add(aux);
            }
        }
        return list;
    }
}