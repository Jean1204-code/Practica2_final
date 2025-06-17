package com.practica2.base.controller.dao.dao_models;

import com.practica2.base.controller.dao.AdapterDao;
import com.practica2.base.models.Genero;


public class DaoGenero extends AdapterDao<Genero>{
    private Genero obj;

    public DaoGenero() {
        super (Genero.class);
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
            obj.setId(listAll().getLength() + 1);
            this.persist(obj); 
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e);
            return false;
        }
    }

    public Boolean update(Integer pos){
        try {
            this.update(obj,pos);
            return true;
        } catch (Exception e) {
            System.out.println("Objeto no guardado" + e.getMessage());
            return false;
        }
    }
}