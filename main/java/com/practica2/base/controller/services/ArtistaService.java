package com.practica2.base.controller.services;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import com.practica2.base.controller.dao.dao_models.DaoArtista;
import com.practica2.base.models.Artista;
import com.practica2.base.models.RolArtistaEnum;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

@BrowserCallable
@Transactional(propagation = Propagation.REQUIRES_NEW)
@AnonymousAllowed

public class ArtistaService {
    private DaoArtista da;

    public ArtistaService() {
        da = new DaoArtista();
    }

    public void createArtista(@NotEmpty String nombre, @NotEmpty String nacionalidad) throws Exception {
    da.getObj().setNacionalidad(nacionalidad); 
    da.getObj().setNombres(nombre);
    System.out.println("DEBUG (Service - create): Artista a guardar -> Nombres: " + da.getObj().getNombres() + ", Nacionalidad: " + da.getObj().getNacionalidad()); // <-- AGREGAR ESTA LÍNEA
    if (!da.save())
        throw new Exception("No se pudo guardar los datos de artista");
}

    public void aupdateArtista(@NotEmpty Integer id, @NotEmpty String nombre, @NotEmpty String nacionalidad)
            throws Exception {
        da.setObj(da.listAll().get(id));
        da.getObj().setNacionalidad(nacionalidad);
        da.getObj().setNombres(nombre);
        if (!da.update(id))
            throw new Exception("No se pudo modificar los datos de artista");
    }

    public List<Artista> list(Pageable pageable) {
        return Arrays.asList(da.listAll().toArray());
    }

    public List<Artista> listAll() {
        
        return (List<Artista>) Arrays.asList(da.listAll().toArray());
    }

    public List<String> listCountry() {
        List<String> nacionalidades = new ArrayList<>();
        String[] countryCodes = Locale.getISOCountries();
        for (String countryCode : countryCodes) {
            Locale locale = new Locale("", countryCode);
            nacionalidades.add(locale.getDisplayCountry());
            
        }

        return nacionalidades;
    }

    public List<String> listRolArtista() {
        List<String> lista = new ArrayList<>();
        for (RolArtistaEnum r : RolArtistaEnum.values()) {
            lista.add(r.toString());
        }
        return lista;
    }

    public List<Artista> order(String atributo, Integer type) {
        System.out.println(atributo + "  " + type);
        if (atributo.equalsIgnoreCase("nombres"))
            return (List<Artista>) Arrays.asList(da.orderQ(type).toArray());
        else if (atributo.equalsIgnoreCase("nacionalidad"))
            return (List<Artista>) Arrays.asList(da.orderLocate(type).toArray());
        else
            return (List<Artista>) Arrays.asList(da.listAll().toArray());
    }
}
