package com.practica2.base.controller.dao.dao_models;

import com.practica2.base.controller.dao.AdapterDao;
import com.practica2.base.models.Cancion;
import com.practica2.base.models.TipoArchivoEnum;
import com.practica2.base.controller.Utiles;
import com.practica2.base.controller.data_struct.list.LinkedList;
import com.practica2.base.models.Album;
import com.practica2.base.models.Genero;

import java.util.HashMap;
import java.util.Objects;

public class DaoCancion extends AdapterDao<Cancion> {
    private Cancion obj;

    public DaoCancion() {
        super(Cancion.class);
    }

    public Cancion getObj() {
        if (obj == null)
            this.obj = new Cancion();
        return this.obj;
    }

    public void setObj(Cancion obj) {
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

    public Boolean update(Integer pos) {
        try {
            this.update(obj, pos);
            return true;
        } catch (Exception e) {
            System.out.println("Error al actualizar objeto: " + e.getMessage());
            return false;
        }
    }

    private HashMap<String, String> toDict(Cancion arreglo) throws Exception {
        HashMap<String, String> aux = new HashMap<>();
        DaoAlbum da = new DaoAlbum();
        DaoGenero dg = new DaoGenero();

        LinkedList<Album> allAlbums = da.listAll();
        LinkedList<Genero> allGeneros = dg.listAll();

        String albumNombre = "";
        String generoNombre = "";

        if (arreglo.getId_album() != null && arreglo.getId_album() > 0
                && arreglo.getId_album() <= allAlbums.getLength()) {
            Album albumEncontrado = allAlbums.get(arreglo.getId_album() - 1);
            if (albumEncontrado != null) {
                albumNombre = Objects.requireNonNullElse(albumEncontrado.getNombre(), "");
            }
        }

        if (arreglo.getId_genero() != null && arreglo.getId_genero() > 0
                && arreglo.getId_genero() <= allGeneros.getLength()) {
            Genero generoEncontrado = allGeneros.get(arreglo.getId_genero() - 1);
            if (generoEncontrado != null) {
                generoNombre = Objects.requireNonNullElse(generoEncontrado.getNombre(), "");
            }
        }

        aux.put("id", Objects.requireNonNullElse(arreglo.getId(), 0).toString());
        aux.put("nombre", Objects.requireNonNullElse(arreglo.getNombre(), ""));
        aux.put("album", albumNombre);
        aux.put("genero", generoNombre);
        aux.put("url", Objects.requireNonNullElse(arreglo.getUrl(), ""));
        aux.put("duracion", Objects.requireNonNullElse(arreglo.getDuracion(), 0).toString());
        aux.put("tipo", Objects.requireNonNullElse(arreglo.getTipo(), TipoArchivoEnum.VIRTUAL).toString());
        return aux;
    }

    public LinkedList<HashMap<String, String>> all() throws Exception {
        LinkedList<HashMap<String, String>> lista = new LinkedList<>();
        if (!this.listAll().isEmpty()) {
            Cancion[] arreglo = this.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                lista.add(toDict(arreglo[i]));
            }
        }
        return lista;
    }

    private int partition(HashMap<String, String>[] arr, int low, int high, Integer type, String attribute) {
        String pivot = arr[high].get(attribute);
        if (pivot == null)
            pivot = "";
        pivot = pivot.toLowerCase();

        int i = low - 1;
        for (int j = low; j < high; j++) {
            String current = arr[j].get(attribute);
            if (current == null)
                current = "";
            current = current.toLowerCase();

            if (type == Utiles.ASCEDENTE) {
                if (current.compareTo(pivot) < 0) {
                    i++;
                    swap(arr, i, j);
                }
            } else {
                if (current.compareTo(pivot) > 0) {
                    i++;
                    swap(arr, i, j);
                }
            }
        }
        swap(arr, i + 1, high);
        return i + 1;
    }

    private void swap(HashMap<String, String>[] arr, int i, int j) {
        HashMap<String, String> temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    private void quickSort(HashMap<String, String>[] arr, int low, int high, int type, String attribute) {
        if (low < high) {
            int pi;
            pi = partition(arr, low, high, type, attribute);
            quickSort(arr, low, pi - 1, type, attribute);
            quickSort(arr, pi + 1, high, type, attribute);
        }
    }

    public LinkedList<HashMap<String, String>> orderByProperty(Integer type, String attribute) throws Exception {
        LinkedList<HashMap<String, String>> lista = all();
        if (!lista.isEmpty()) {
            HashMap<String, String>[] arreglo = lista.toArray();
            quickSort(arreglo, 0, arreglo.length - 1, type, attribute);
            lista.clear();
            for (HashMap<String, String> map : arreglo) {
                lista.add(map);
            }
        }
        return lista;
    }

    public LinkedList<HashMap<String, String>> search(String attribute, String text, Integer type) throws Exception {
        LinkedList<HashMap<String, String>> lista = all();
        LinkedList<HashMap<String, String>> resp = new LinkedList<>();

        if (lista.isEmpty() || text == null || text.trim().isEmpty()) {
            return resp;
        }

        lista = orderByProperty(Utiles.ASCEDENTE, attribute);
        HashMap<String, String>[] arr = lista.toArray();
        String searchText = text.trim().toLowerCase();

        for (HashMap<String, String> item : arr) {
            String value = item.get(attribute);
            if (value == null)
                value = "";
            value = value.toLowerCase();

            if (type == Utiles.START) {
                if (value.startsWith(searchText)) {
                    resp.add(item);
                }
            } else if (type == Utiles.CONSTIANS) {
                if (value.contains(searchText)) {
                    resp.add(item);
                }
            } else {
                if (value.contains(searchText)) {
                    resp.add(item);
                }
            }
        }
        return resp;
    } 

    public LinkedList<HashMap<String, String>> binarySearchByAlbum(String album) throws Exception {
        LinkedList<HashMap<String, String>> listaOrdenada = orderByProperty(Utiles.ASCEDENTE, "album");
        LinkedList<HashMap<String, String>> resultados = new LinkedList<>();

        if (listaOrdenada.isEmpty() || album == null || album.trim().isEmpty())
            return resultados;

        HashMap<String, String>[] arr = listaOrdenada.toArray();
        String searchAlbum = album.trim().toLowerCase();

        int low = 0, high = arr.length - 1;
        int found = -1;

        while (low <= high) {
            int mid = low + (high - low) / 2;
            String midAlbum = arr[mid].get("album");

            if (midAlbum == null) {
                low = mid + 1;
                continue;
            }
            int cmp = midAlbum.toLowerCase().compareTo(searchAlbum);

            if (cmp == 0) {
                found = mid;
                break;
            } else if (cmp < 0) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }

        if (found != -1) {
            
            int i = found;
            
            LinkedList<HashMap<String, String>> tempResultsLeft = new LinkedList<>();
            while (i >= 0) {
                String currentAlbum = arr[i].get("album");
                if (currentAlbum == null) currentAlbum = "";
                if (currentAlbum.toLowerCase().equals(searchAlbum)) {
                    tempResultsLeft.add(arr[i], 0); 
                    i--;
                } else {
                    break;
                }
            }
           
            for(int k = 0; k < tempResultsLeft.getLength(); k++) {
                resultados.add(tempResultsLeft.get(k));
            }


            
            int j = found + 1;
            while (j < arr.length) {
                String currentAlbum = arr[j].get("album");
                if (currentAlbum == null) currentAlbum = "";
                if (currentAlbum.toLowerCase().equals(searchAlbum)) {
                    resultados.add(arr[j]); 
                    j++;
                } else {
                    break;
                }
            }
        }
        return resultados;
    }

    private Integer bynaryLineal(HashMap<String, String>[] arr, String attribute, String text) {
        Integer half = 0;
        if (!(arr.length == 0) && text != null && !text.isEmpty()) {
            half = arr.length / 2;
            int aux = 0;
            String attrValue = arr[half].get(attribute);
            if (attrValue == null)
                attrValue = "";

            if (text.trim().toLowerCase().charAt(0) > attrValue.trim().toLowerCase().charAt(0))
                aux = 1;
            else if (text.trim().toLowerCase().charAt(0) < attrValue.trim().toLowerCase().charAt(0))
                aux = -1;
            half = half * aux;
        }
        return half;
    }
}