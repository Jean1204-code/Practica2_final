package com.practica2.base.controller.dao.dao_models;

import com.practica2.base.controller.dao.AdapterDao;
import com.practica2.base.models.Album; 

public class DaoAlbum extends AdapterDao<Album>{
    private Album obj;
    
    public DaoAlbum() {
        super(Album.class);
    }
    
    public Album getObj() {
        if (obj == null) 
            this.obj = new Album();
        return obj;
    }

    public void setObj(Album obj) {
        this.obj = obj;
    }

    public Boolean save() {
        try {
            this.persist(obj);
            return true;
        } catch (Exception e) {
            //Log de errores
            e.printStackTrace();
            System.out.println(e);
            return false;
            // TODO: handle exception
        }
    }


    public Boolean update() {
        try {
            this.update(obj, obj.getId());
            return true;
        } catch (Exception e) {
            //Log de errores
            e.printStackTrace();
            System.out.println(e);
            return false;
        }
    }
    
    


    public static void main(String[] args) {
        DaoAlbum da = new DaoAlbum();
        da.getObj().setId(((java.util.List<Album>) da.listAll()).size() + 1);
        da.getObj().setNombre("Rosenrot");
        da.getObj().setFecha(new java.util.Date());
        da.getObj().setId_banda(1);
        if (da.save()) {
            System.out.println("Guardado");
        } else {
            System.out.println("Error al guardar");     
 }
}
}