package com.practica2.base.controller.services;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import com.practica2.base.controller.dao.dao_models.DaoAlbum;
import com.practica2.base.controller.dao.dao_models.DaoBanda; 
import com.practica2.base.models.Album;
import com.practica2.base.models.Banda; 

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

@BrowserCallable
@AnonymousAllowed
public class AlbumServices {
    private DaoAlbum db;

    public AlbumServices() {
        db = new DaoAlbum();
    }

    public void create(@NotEmpty String nombre, @NotNull Date fecha, Integer id_banda) throws Exception {
        if (nombre.trim().length() > 0 && fecha != null && id_banda != null && id_banda > 0) {
            db.getObj().setNombre(nombre);
            db.getObj().setFecha(fecha);
            db.getObj().setId_banda(id_banda);
         
            if (!db.save())
                throw new Exception("No se pudo guardar los datos del álbum");
        } else {
            throw new Exception("Datos del álbum incompletos o inválidos");
        }
    }

    public void update(Integer id, @NotEmpty String nombre, @NotNull Date fecha, Integer id_banda) throws Exception {
        if (nombre.trim().length() > 0 && fecha != null && id_banda != null && id_banda > 0) {
            if (id == null || id <= 0) {
                throw new Exception("ID del álbum inválido para actualizar");
            }

            Album albumToUpdate = null;
            int pos = -1;
            if (!db.listAll().isEmpty()) {
                Album[] arreglo = db.listAll().toArray();
                for (int i = 0; i < arreglo.length; i++) {
                    if (arreglo[i].getId() != null && arreglo[i].getId().equals(id)) {
                        albumToUpdate = arreglo[i];
                        pos = i;
                        break;
                    }
                }
            }

            if (albumToUpdate != null && pos != -1) {
                db.setObj(albumToUpdate);
                db.getObj().setNombre(nombre);
                db.getObj().setFecha(fecha);
                db.getObj().setId_banda(id_banda);
                
                if (!db.update()) { 
                    throw new Exception("No se pudo actualizar los datos del álbum");
                }
            } else {
                throw new Exception("Álbum con ID " + id + " no encontrado para actualizar.");
            }
        } else {
            throw new Exception("Datos del álbum incompletos o inválidos");
        }
    }

    public List<HashMap> listAlbum() {
        List<HashMap> lista = new ArrayList<>();
        DaoBanda daoBanda = new DaoBanda(); 
        if (!db.listAll().isEmpty()) {
            Album[] arreglo = db.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("id", arreglo[i].getId().toString());
                aux.put("nombre", arreglo[i].getNombre());
                aux.put("fecha", arreglo[i].getFecha().toString()); 
                aux.put("id_banda", arreglo[i].getId_banda().toString());

                
                Banda banda = null;
                
                if (!daoBanda.listAll().isEmpty()) {
                    try {
                        
                        banda = (Banda) daoBanda.listAll().get(arreglo[i].getId_banda() - 1);
                    } catch (IndexOutOfBoundsException e) {
                        
                        banda = null;
                    }
                }
                aux.put("nombre_banda", (banda != null) ? banda.getNombre() : "Desconocida");

                lista.add(aux);
            }
        }
        return lista;
    }

    public List<HashMap> listaBandaCombo() {
        List<HashMap> lista = new ArrayList<>();
        DaoBanda da = new DaoBanda();
        if (!da.listAll().isEmpty()) {
            Banda[] arreglo = da.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                HashMap<String, String> aux = new HashMap<>();
                
                aux.put("value", arreglo[i].getId().toString());
                aux.put("label", arreglo[i].getNombre());
                lista.add(aux);
            }
        }
        return lista;
    }
}