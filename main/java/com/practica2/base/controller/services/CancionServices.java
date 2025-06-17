package com.practica2.base.controller.services;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import com.practica2.base.controller.dao.dao_models.DaoAlbum;
import com.practica2.base.controller.dao.dao_models.DaoCancion;
import com.practica2.base.controller.dao.dao_models.DaoGenero;
import com.practica2.base.models.Album;
import com.practica2.base.models.Cancion;
import com.practica2.base.models.Genero;
import com.practica2.base.models.TipoArchivoEnum;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

@BrowserCallable
@AnonymousAllowed
public class CancionServices {
    private DaoCancion dc;

    public CancionServices() {
        dc = new DaoCancion();
    }

    public void create(
            @NotEmpty String nombre,
            @NotNull Integer id_genero,
            @NotNull Integer duracion,
            @NotEmpty String url,
            @NotEmpty String tipo,
            @NotNull Integer id_album) throws Exception {

        if (nombre.trim().isEmpty() || url.trim().isEmpty() || tipo.trim().isEmpty() ||
                duracion <= 0 || id_genero <= 0 || id_album <= 0) {
            throw new Exception("Faltan datos o datos inválidos para crear la canción.");
        }

        dc.getObj().setNombre(nombre);
        dc.getObj().setDuracion(duracion);
        dc.getObj().setUrl(url);
        dc.getObj().setTipo(TipoArchivoEnum.valueOf(tipo.toUpperCase()));
        dc.getObj().setId_genero(id_genero);
        dc.getObj().setId_album(id_album);
        if (!dc.save()) {
            throw new Exception("No se pudo guardar los datos de la canción.");
        }
    }

    public void update(
            @NotNull Integer id,
            @NotEmpty String nombre,
            @NotNull Integer id_genero,
            @NotNull Integer duracion,
            @NotEmpty String url,
            @NotEmpty String tipo,
            @NotNull Integer id_album) throws Exception {

        if (id == null || id <= 0 ||
                nombre.trim().isEmpty() || url.trim().isEmpty() || tipo.trim().isEmpty() ||
                duracion <= 0 || id_genero <= 0 || id_album <= 0) {
            throw new Exception("Faltan datos o datos inválidos para actualizar la canción.");
        }

        Cancion cancionToUpdate = null;
        int posToUpdate = -1;
        List<Cancion> allCanciones = Arrays.asList(dc.listAll().toArray());
        for (int i = 0; i < allCanciones.size(); i++) {
            Cancion c = allCanciones.get(i);
            if (c != null && c.getId() != null && c.getId().equals(id)) {
                cancionToUpdate = c;
                posToUpdate = i;
                break;
            }
        }

        if (cancionToUpdate == null || posToUpdate == -1) {
            throw new Exception("Canción con ID " + id + " no encontrada para actualizar.");
        }

        dc.setObj(cancionToUpdate);
        dc.getObj().setNombre(nombre);
        dc.getObj().setDuracion(duracion);
        dc.getObj().setUrl(url);
        dc.getObj().setTipo(TipoArchivoEnum.valueOf(tipo.toUpperCase()));
        dc.getObj().setId_genero(id_genero);
        dc.getObj().setId_album(id_album);

        if (!dc.update(posToUpdate)) {
            throw new Exception("No se pudo actualizar los datos de la canción.");
        }
    }

    public List<HashMap<String, String>> listAlbumCombo() {
        List<HashMap<String, String>> lista = new ArrayList<>();
        DaoAlbum da = new DaoAlbum();
        if (!da.listAll().isEmpty()) {
            Album[] arreglo = da.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("value", arreglo[i].getId().toString());
                aux.put("label", arreglo[i].getNombre());
                lista.add(aux);
            }
        }
        return lista;
    }

    public List<HashMap<String, String>> listGeneroCombo() {
        List<HashMap<String, String>> lista = new ArrayList<>();
        DaoGenero dg = new DaoGenero();
        if (!dg.listAll().isEmpty()) {
            Genero[] arreglo = dg.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("value", arreglo[i].getId().toString());
                aux.put("label", arreglo[i].getNombre());
                lista.add(aux);
            }
        }
        return lista;
    }

    public List<String> listTipo() {
        List<String> lista = new ArrayList<>();
        for (TipoArchivoEnum tipo : TipoArchivoEnum.values()) {
            lista.add(tipo.toString());
        }
        return lista;
    }

    public List<HashMap<String, String>> listCancion() throws Exception {
        return Arrays.asList(dc.all().toArray());
    }

    public List<HashMap<String, String>> order(String attribute, Integer type) throws Exception {
        if (attribute == null || attribute.isEmpty()) {
            return Arrays.asList(dc.all().toArray());
        } else {
            return Arrays.asList(dc.orderByProperty(type, attribute).toArray());
        }
    }

    public List<HashMap<String, String>> search(String attribute, String value, Integer type) throws Exception {
        if (attribute == null || attribute.isEmpty() || value == null || value.isEmpty()) {
            return Arrays.asList(dc.all().toArray());
        } else {
            return Arrays.asList(dc.search(attribute, value, type).toArray());
        }
    }

    public List<HashMap<String, String>> searchAlbum(String nombreAlbum) throws Exception {
        if (nombreAlbum == null || nombreAlbum.isEmpty()) {
            return Arrays.asList(dc.all().toArray());
        } else {
            return Arrays.asList(dc.binarySearchByAlbum(nombreAlbum).toArray());
        }
    }
}