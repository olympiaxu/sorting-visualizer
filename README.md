# Sorting Visualizer

Interactive web software that visualizes sorting algorithms by Java.

## Algorithms

- **Bubble Sort** walks through the array again and again, swapping neighbors that are out of order. Each pass moves the largest remaining number to the end.

- **Selection Sort** finds the smallest remaining number on each pass and swaps it to the front.

** Neither version uses `Arrays.sort()` or any other built-in sorting method.

## Java version

The Java program generates random numbers, lets you pick an algorithm (or compare both on the same data), and reports how many comparisons and swaps were made.

```
javac -d out src/SortingVisualizer.java
java -cp out SortingVisualizer
```

## Version history

Current version: 1.0.0. See [CHANGELOG.md](CHANGELOG.md) for what changed in each release.
