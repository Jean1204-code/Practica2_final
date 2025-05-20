package com.practica2.base.controller.dao.dao_models;

import com.practica2.base.controller.dao.AdapterDao;
import com.practica2.base.models.Cancion;
import com.practica2.base.models.TipoArchivoEnum; 

public class DaoCancion extends AdapterDao<Cancion>{
    private Cancion obj;

    public DaoCancion() {
        super(Cancion.class);
    }

    public Cancion getObj() {
        if (obj == null)
            this.obj = new Cancion();
        return obj;
    }

    public void setObj(Cancion obj) {
        this.obj = obj;
    }

    public Boolean save() {
        try {
       
            if (obj.getId() == null) { 
                obj.setId(listAll().getLength() + 1); 
            }
            this.persist(obj);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Error al guardar: " + e.getMessage()); 
            return false;
        }
    }

    public Boolean update() {
        try {
            
            this.update(obj, obj.getId());
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Error al actualizar: " + e.getMessage()); 
            return false;
        }
    }

    // Método main para pruebas
    public static void main(String[] args) {
        DaoCancion daoCancion = new DaoCancion();

        System.out.println("--- Probando Guardar Cancion ---");
        daoCancion.getObj().setNombre("Sonne");
        daoCancion.getObj().setDuracion(240); 
        daoCancion.getObj().setId_album(1); 
        daoCancion.getObj().setId_genero(1); 
        daoCancion.getObj().setTipo(TipoArchivoEnum.VIRTUAL); 
        daoCancion.getObj().setUrl("http://ytmusic.com/cancion.mp3");

        if (daoCancion.save()) {
            System.out.println("CANCION GUARDADA EXITOSAMENTE");
            System.out.println("Lista de Canciones actual: " + daoCancion.listAll());
        } else {
            System.out.println("ERROR AL GUARDAR CANCION");
        }


        if (daoCancion.listAll().getLength() > 0) {
            System.out.println("\n--- Probando Actualizar Cancion ---");
            
            Cancion cancionAActualizar = daoCancion.listAll().get(0); 
            if (cancionAActualizar != null) {
                daoCancion.setObj(cancionAActualizar);
                daoCancion.getObj().setNombre("Cancion Actualizada");
                daoCancion.getObj().setDuracion(300);

                if (daoCancion.update()) {
                    System.out.println("CANCION ACTUALIZADA EXITOSAMENTE");
                    System.out.println("Lista de Canciones actual: " + daoCancion.listAll());
                } else {
                    System.out.println("ERROR AL ACTUALIZAR CANCION");
                }
            }
        }
    }
}