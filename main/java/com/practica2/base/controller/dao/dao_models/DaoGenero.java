package com.practica2.base.controller.dao.dao_models;

import com.practica2.base.controller.dao.AdapterDao;
import com.practica2.base.models.Genero; 


public class DaoGenero extends AdapterDao<Genero>{
    private Genero obj;
    
    public DaoGenero() {
        super(Genero.class);
    }
    
    public Genero getObj() {
        if (obj == null) 
            this.obj = new Genero();
        return obj;
    }

    public void setObj(Genero obj) {
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
            // TODO: handle exception
        }
    }
    
    


    public static void main(String[] args) {
        DaoGenero da = new DaoGenero();
        da.getObj().setId(da.listAll().getLength() + 1);
        da.getObj().setNombre("Metal Industrial");
        if (da.save()) {
            System.out.println("Guardado");
        } else {
            System.out.println("Error al guardar");     
 }
}
}