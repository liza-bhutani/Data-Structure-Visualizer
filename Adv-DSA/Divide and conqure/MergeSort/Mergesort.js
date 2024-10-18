let delay = 1000; // Delay in milliseconds for visualization
let stepCounter = 0;

// Function to start merge sort based on user input
function startMergeSort() {
    const input = document.getElementById('nodeValue').value; // Changed from 'arrayInput' to 'nodeValue'
    let arr = input.split(',').map(Number); // Convert input to an array of numbers
    if (arr.length > 0) {
        clearVisualization(); // Clear previous visualizations
        stepCounter = 0; // Reset the step counter
        mergeSort(arr, 0, arr.length - 1);
    }
}

// Function to clear the previous visualization
function clearVisualization() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = ''; // Clear table content
    document.getElementById('complexityInfo').innerHTML = ''; // Clear previous complexity output
}

// Function to display each array state and step in the table
function visualizeArray(arr, label, midPoint = null) {
    const tableBody = document.getElementById('tableBody');

    const row = document.createElement('tr');

    // Step column
    const stepCell = document.createElement('td');
    stepCounter++;
    stepCell.textContent = stepCounter;
    row.appendChild(stepCell);

    // Action label (Divide/Merge)
    const labelCell = document.createElement('td');
    labelCell.textContent = label;
    row.appendChild(labelCell);

    // Array contents
    const arrayCell = document.createElement('td');
    arrayCell.textContent = arr.join(', ');
    row.appendChild(arrayCell);

    // Midpoint (if any)
    const midPointCell = document.createElement('td');
    if (midPoint !== null) {
        midPointCell.innerHTML = `<span class="mid-point">${midPoint}</span>`;
    } else {
        midPointCell.textContent = '-';
    }
    row.appendChild(midPointCell);

    tableBody.appendChild(row);
}

// Merge Sort implementation with divide and conquer visualization
async function mergeSort(arr, left, right) {
    if (left >= right) return;

    const middle = Math.floor((left + right) / 2);

    const leftHalf = arr.slice(left, middle + 1);
    const rightHalf = arr.slice(middle + 1, right + 1);

    // Visualize the "divide" phase with left and right halves and show midpoint
    visualizeArray([...leftHalf, ...rightHalf], `Divide: [${left}-${right}]`, middle);
    await new Promise((resolve) => setTimeout(resolve, delay));

    await mergeSort(arr, left, middle);   // Sort the left half
    await mergeSort(arr, middle + 1, right); // Sort the right half

    await merge(arr, left, middle, right); // Merge both halves
}

// Function to merge two halves of an array
async function merge(arr, left, middle, right) {
    const leftHalf = arr.slice(left, middle + 1);
    const rightHalf = arr.slice(middle + 1, right + 1);

    let i = 0, j = 0, k = left;

    while (i < leftHalf.length && j < rightHalf.length) {
        if (leftHalf[i] <= rightHalf[j]) {
            arr[k++] = leftHalf[i++];
        } else {
            arr[k++] = rightHalf[j++];
        }
    }

    while (i < leftHalf.length) {
        arr[k++] = leftHalf[i++];
    }

    while (j < rightHalf.length) {
        arr[k++] = rightHalf[j++];
    }

    // Visualize the "merge" phase
    visualizeArray(arr, `Merge: [${left}-${right}]`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    
    // Calculate and display complexities
    document.getElementById('time-complexity').textContent = `Time complexity: O(n log n)`;
    document.getElementById('space-complexity').textContent = `Space Complexity: O(n)`;
}
