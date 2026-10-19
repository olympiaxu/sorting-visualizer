// ----- page elements -----
const sizeSlider = document.getElementById("sizeSlider");
const sizeLabel = document.getElementById("sizeLabel");
const speedSlider = document.getElementById("speedSlider");
const algorithmSelect = document.getElementById("algorithmSelect");
const generateButton = document.getElementById("generateButton");
const sortButton = document.getElementById("sortButton");
const statusText = document.getElementById("status");

// a "panel" holds everything for one visualizer: its numbers, bars, and counters.
function makePanel(id) {
    const element = document.getElementById(id);
    return {
        element: element,
        title: element.querySelector(".panel-title"),
        barsContainer: element.querySelector(".bars"),
        comparisonsText: element.querySelector(".comparisons"),
        swapsText: element.querySelector(".swaps"),
        array: [],
        bars: [],
        comparisons: 0,
        swaps: 0
    };
}

const panelA = makePanel("panelA");
const panelB = makePanel("panelB");

// the numbers both panels start from, so comparisons are fair.
let originalArray = [];

// ----- creating and drawing arrays -----

// same idea as generateRandomArray in Java: random numbers from 1 to 100.
function generateRandomArray(size) {
    const array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 100) + 1);
    }
    return array;
}

// same idea as copyArray in Java.
function copyArray(array) {
    const copy = [];
    for (let i = 0; i < array.length; i++) {
        copy.push(array[i]);
    }
    return copy;
}

// load numbers into a panel and draw one bar per number.
function drawPanel(panel, array) {
    panel.array = copyArray(array);
    panel.bars = [];
    panel.barsContainer.innerHTML = "";
    panel.comparisons = 0;
    panel.swaps = 0;
    updateStats(panel);

    for (let i = 0; i < panel.array.length; i++) {
        const bar = document.createElement("div");
        bar.className = "bar";
        bar.style.height = panel.array[i] + "%";
        panel.barsContainer.appendChild(bar);
        panel.bars.push(bar);
    }
}

function updateStats(panel) {
    panel.comparisonsText.textContent = panel.comparisons;
    panel.swapsText.textContent = panel.swaps;
}

// ----- helpers used while sorting -----

// wait a short time so the user can see each step. a higher speed means a shorter wait.
function pause() {
    const delay = 205 - speedSlider.value * 2;
    return new Promise(function (resolve) {
        setTimeout(resolve, delay);
    });
}

// color one bar (or remove its color when state is "").
function setColor(panel, index, state) {
    panel.bars[index].className = "bar " + state;
}

// swap two numbers and their bar heights.
function swap(panel, i, j) {
    const temp = panel.array[i];
    panel.array[i] = panel.array[j];
    panel.array[j] = temp;

    panel.bars[i].style.height = panel.array[i] + "%";
    panel.bars[j].style.height = panel.array[j] + "%";

    panel.swaps++;
    updateStats(panel);
}

function markAllSorted(panel) {
    for (let i = 0; i < panel.bars.length; i++) {
        setColor(panel, i, "sorted");
    }
}

// ----- the sorting algorithms -----
// "async" and "await pause()" let the code stop for a moment after each step,
// so the browser has time to redraw the bars.

async function bubbleSort(panel) {
    const array = panel.array;
    for (let i = 0; i < array.length - 1; i++) {
        // the end of the array is already sorted, so stop i spots earlier.
        for (let j = 0; j < array.length - 1 - i; j++) {
            setColor(panel, j, "comparing");
            setColor(panel, j + 1, "comparing");
            panel.comparisons++;
            updateStats(panel);
            await pause();

            if (array[j] > array[j + 1]) {
                setColor(panel, j, "swapping");
                setColor(panel, j + 1, "swapping");
                swap(panel, j, j + 1);
                await pause();
            }

            setColor(panel, j, "");
            setColor(panel, j + 1, "");
        }
        // after each pass, the largest remaining number is at the end.
        setColor(panel, array.length - 1 - i, "sorted");
    }
    markAllSorted(panel);
}

async function selectionSort(panel) {
    const array = panel.array;
    for (let i = 0; i < array.length - 1; i++) {
        let minIndex = i;
        setColor(panel, minIndex, "swapping");

        for (let j = i + 1; j < array.length; j++) {
            setColor(panel, j, "comparing");
            panel.comparisons++;
            updateStats(panel);
            await pause();

            if (array[j] < array[minIndex]) {
                setColor(panel, minIndex, "");
                minIndex = j;
                setColor(panel, minIndex, "swapping");
            } else {
                setColor(panel, j, "");
            }
        }

        if (minIndex != i) {
            swap(panel, i, minIndex);
            await pause();
            setColor(panel, minIndex, "");
        }
        // the smallest remaining number is now in place at the front.
        setColor(panel, i, "sorted");
    }
    markAllSorted(panel);
}

// ----- buttons and controls -----

function setControlsEnabled(enabled) {
    sizeSlider.disabled = !enabled;
    algorithmSelect.disabled = !enabled;
    generateButton.disabled = !enabled;
    sortButton.disabled = !enabled;

    // the status in the top bar shows whether a sort is running.
    statusText.textContent = enabled ? "Idle" : "Running";
    statusText.classList.toggle("running", !enabled);
}

// show one panel or two, depending on the algorithm choice.
function showPanels() {
    const choice = algorithmSelect.value;
    if (choice == "compare") {
        panelA.title.textContent = "Bubble Sort";
        panelB.element.classList.remove("hidden");
    } else {
        panelA.title.textContent = choice == "bubble" ? "Bubble Sort" : "Selection Sort";
        panelB.element.classList.add("hidden");
    }
    drawPanel(panelA, originalArray);
    drawPanel(panelB, originalArray);
}

function newArray() {
    originalArray = generateRandomArray(Number(sizeSlider.value));
    showPanels();
}

async function startSort() {
    // redraw first, so pressing Sort twice re-runs on the same numbers.
    showPanels();
    setControlsEnabled(false);

    const choice = algorithmSelect.value;
    if (choice == "bubble") {
        await bubbleSort(panelA);
    } else if (choice == "selection") {
        await selectionSort(panelA);
    } else {
        // run both at the same time on the same data, like a race.
        await Promise.all([bubbleSort(panelA), selectionSort(panelB)]);
    }

    setControlsEnabled(true);
}

sizeSlider.addEventListener("input", function () {
    sizeLabel.textContent = sizeSlider.value;
    newArray();
});
algorithmSelect.addEventListener("change", showPanels);
generateButton.addEventListener("click", newArray);
sortButton.addEventListener("click", startSort);

// draw the first array when the page loads.
newArray();
