import java.util.Scanner;

public class SortingVisualizer {
    // counters that the sorting methods update while they run.
    static int comparisons = 0;
    static int swaps = 0;

    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        System.out.println("=================================");
        System.out.println("       SORTING VISUALIZER");
        System.out.println("=================================");

        // ask the user how many numbers to generate.
        System.out.print("\nChoose an array size: ");
        int size = input.nextInt();
        while (size < 1) {
            System.out.print("Please enter a number of at least 1: ");
            size = input.nextInt();
        }

        // create the random array and show it.
        int[] array = generateRandomArray(size);
        System.out.println("\nOriginal array:");
        printArray(array);

        // ask the user which algorithm to use.
        System.out.println("\nChoose an algorithm:");
        System.out.println("1. Bubble Sort");
        System.out.println("2. Selection Sort");
        System.out.println("3. Compare both");
        System.out.print("\nChoice: ");
        int choice = input.nextInt();
        while (choice < 1 || choice > 3) {
            System.out.print("Please enter 1, 2, or 3: ");
            choice = input.nextInt();
        }

        System.out.println("\nSorting...");

        if (choice == 1) {
            sort(array);
            System.out.println("\nSorted array:");
            printArray(array);
            printStats();
        } else if (choice == 2) {
            selectionSort(array);
            System.out.println("\nSorted array:");
            printArray(array);
            printStats();
        } else {
            compare(array);
        }

        input.close();
    }

    // sorts the array from smallest to largest using Bubble Sort.
    public static void sort(int[] array) {
        resetCounters();
        for (int i = 0; i < array.length - 1; i++) {
            // after each pass, the largest remaining number is already at the end,
            // so the inner loop can stop i spots earlier.
            for (int j = 0; j < array.length - 1 - i; j++) {
                comparisons++;
                if (array[j] > array[j + 1]) {
                    int temp = array[j];
                    array[j] = array[j + 1];
                    array[j + 1] = temp;
                    swaps++;
                }
            }
        }
    }

    // sorts the array from smallest to largest using Selection Sort.
    // each pass finds the smallest remaining number and moves it to the front.
    public static void selectionSort(int[] array) {
        resetCounters();
        for (int i = 0; i < array.length - 1; i++) {
            int minIndex = i;
            for (int j = i + 1; j < array.length; j++) {
                comparisons++;
                if (array[j] < array[minIndex]) {
                    minIndex = j;
                }
            }
            // only swap if the smallest number isn't already in place.
            if (minIndex != i) {
                int temp = array[i];
                array[i] = array[minIndex];
                array[minIndex] = temp;
                swaps++;
            }
        }
    }

    // runs both algorithms on copies of the same data and shows the results.
    public static void compare(int[] array) {
        int[] bubbleArray = copyArray(array);
        int[] selectionArray = copyArray(array);

        sort(bubbleArray);
        int bubbleComparisons = comparisons;
        int bubbleSwaps = swaps;

        selectionSort(selectionArray);
        int selectionComparisons = comparisons;
        int selectionSwaps = swaps;

        System.out.println("\nSorted array:");
        printArray(bubbleArray);

        System.out.println("\nAlgorithm        Comparisons    Swaps");
        System.out.println("Bubble Sort      " + bubbleComparisons + "    " + bubbleSwaps);
        System.out.println("Selection Sort   " + selectionComparisons + "    " + selectionSwaps);

        if (bubbleSwaps < selectionSwaps) {
            System.out.println("\nBubble Sort used fewer swaps.");
        } else if (selectionSwaps < bubbleSwaps) {
            System.out.println("\nSelection Sort used fewer swaps.");
        } else {
            System.out.println("\nBoth algorithms used the same number of swaps.");
        }
    }

    // creates an array of the given size filled with random numbers from 1 to 100.
    public static int[] generateRandomArray(int size) {
        int[] array = new int[size];
        for (int i = 0; i < size; i++) {
            array[i] = (int) (Math.random() * 100) + 1;
        }
        return array;
    }

    // makes a new array with the same numbers, so sorting one doesn't change the other.
    public static int[] copyArray(int[] array) {
        int[] copy = new int[array.length];
        for (int i = 0; i < array.length; i++) {
            copy[i] = array[i];
        }
        return copy;
    }

    // prints each number in the array on one line, separated by spaces.
    public static void printArray(int[] array) {
        for (int i = 0; i < array.length; i++) {
            System.out.print(array[i] + " ");
        }
        System.out.println();
    }

    public static void resetCounters() {
        comparisons = 0;
        swaps = 0;
    }

    public static void printStats() {
        System.out.println("\nComparisons: " + comparisons);
        System.out.println("Swaps: " + swaps);
    }
}
