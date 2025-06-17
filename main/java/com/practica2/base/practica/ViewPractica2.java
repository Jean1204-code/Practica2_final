package com.practica2.base.practica;

public class ViewPractica2 {
    public static void main(String[] args) throws Exception {
        Practica2 p = new Practica2();
        p.cargar();

        // Ordenamiento QuickSort
        long inicioQuick = System.nanoTime();
        p.quickSort();
        long finQuick = System.nanoTime();
        System.out.println("QuickSort -> Comparaciones: " + p.cont + ", Tiempo: " + (finQuick - inicioQuick));

        // Se vuelve a cargar un ShellSort
        p = new Practica2();
        p.cargar();

        long inicioShell = System.nanoTime();
        p.shellSort();
        long finShell = System.nanoTime();
        System.out.println("ShellSort -> Comparaciones: " + p.cont + ", Tiempo: " + (finShell - inicioShell));

        // Búsqueda lineal
        int buscar = 25;
        int posL = p.busquedaLineal(buscar);
        System.out.println("Búsqueda Lineal -> Posición: " + posL + ", Comparaciones: " + p.cont);

        // Búsqueda binaria
        int posB = p.busquedaBinaria(buscar);
        System.out.println("Búsqueda Binaria -> Posición: " + posB + ", Comparaciones: " + p.cont);
    }
}
