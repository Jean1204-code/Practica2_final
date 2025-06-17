package com.practica2.base.practica;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

import com.practica2.base.controller.data_struct.list.LinkedList;

public class Practica2 {

    private LinkedList<Integer> lista;
    public int cont = 0;

    public void cargar() {
        lista = new LinkedList<>();
        try (BufferedReader br = new BufferedReader(new FileReader("data.txt"))) {
            String linea;
            while ((linea = br.readLine()) != null) {
                String[] datos = linea.split("[ ,]+");
                for (String dato : datos) {
                    if (!dato.isEmpty()) {
                        lista.add(Integer.parseInt(dato.trim()));
                    }
                }
            }
        } catch (IOException e) {
            System.out.println("Error al leer el archivo: " + e.getMessage());
        }
    }

    // QuickSort
    public void quickSort() throws Exception {
        cont = 0;
        ordenar(0, lista.getLength() - 1);
    }

    private void ordenar(int inicio, int fin) throws Exception {
        if (inicio < fin) {
            int p = particion(inicio, fin);
            ordenar(inicio, p - 1);
            ordenar(p + 1, fin);
        }
    }

    private int particion(int inicio, int fin) throws Exception {
        int pivote = lista.get(fin);
        int i = inicio - 1;

        for (int j = inicio; j < fin; j++) {
            cont++;
            int actual = lista.get(j);
            if (actual < pivote) {
                i++;
                intercambiar(i, j);
            }
        }
        intercambiar(i + 1, fin);
        return i + 1;
    }

    private void intercambiar(int i, int j) throws Exception {
        int temp = lista.get(i);
        lista.update(lista.get(j), i);
        lista.update(temp, j);
    }

    // ShellSort
    public void shellSort() throws Exception {
        cont = 0;
        int n = lista.getLength();
        for (int gap = n / 2; gap > 0; gap /= 2) {
            for (int i = gap; i < n; i++) {
                int temp = lista.get(i);
                int j = i;
                while (j >= gap && lista.get(j - gap) > temp) {
                    cont++;
                    lista.update(lista.get(j - gap), j);
                    j -= gap;
                }
                if (j >= gap)
                    cont++;
                lista.update(temp, j);
            }
        }
    }

    // Búsqueda lineal
    public int busquedaLineal(int valor) throws Exception {
        cont = 0;
        for (int i = 0; i < lista.getLength(); i++) {
            cont++;
            if (lista.get(i) == valor) {
                return i;
            }
        }
        return -1;
    }

    // Búsqueda binaria que solo funciona ordenado
    public int busquedaBinaria(int valor) throws Exception {
        cont = 0;
        int inicio = 0;
        int fin = lista.getLength() - 1;

        while (inicio <= fin) {
            cont++;
            int medio = (inicio + fin) / 2;
            int dato = lista.get(medio);

            if (dato == valor)
                return medio;
            else if (dato < valor)
                inicio = medio + 1;
            else
                fin = medio - 1;
        }
        return -1;
    }

}
