let delay = 1000; // Delay in milliseconds for visualization
        let stepCounter = 0; // Counter for the steps in the sorting process

        // Function to start Quick Sort based on user input
        function startQuickSort() {
            const input = document.getElementById('nodeValue').value; // Get user input
            let arr = input.split(',').map(Number); // Convert input to an array of numbers
            if (arr.length > 0) {
                clearVisualization(); // Clear previous visualizations
                stepCounter = 0; // Reset the step counter
                quickSort(arr, 0, arr.length - 1).then(() => {
                    updateComplexityInfo(); // Update complexity information after sorting is complete
                });
            }
        }

        // Function to clear the previous visualization
        function clearVisualization() {
            const tableBody = document.getElementById('tableBody');
            tableBody.innerHTML = ''; // Clear table content
            document.getElementById("time-complexity").textContent = "Time Complexity:";
            document.getElementById("space-complexity").textContent = "Space Complexity:";
        }

        // Function to display each array state and step in the table
        function visualizeArray(arr, label, pivot = null) {
            const tableBody = document.getElementById('tableBody');

            const row = document.createElement('tr');

            // Step column
            const stepCell = document.createElement('td');
            stepCounter++;
            stepCell.textContent = stepCounter;
            row.appendChild(stepCell);

            // Action label (Partition/Sort)
            const labelCell = document.createElement('td');
            labelCell.textContent = label;
            row.appendChild(labelCell);

            // Array contents
            const arrayCell = document.createElement('td');
            arrayCell.textContent = arr.join(', ');
            row.appendChild(arrayCell);

            // Pivot (if any)
            const pivotCell = document.createElement('td');
            pivotCell.textContent = pivot !== null ? pivot : '-';
            row.appendChild(pivotCell);

            tableBody.appendChild(row);
        }

        // Quick Sort implementation with divide and conquer visualization
        async function quickSort(arr, left, right) {
            if (left < right) {
                const pivotIndex = await partition(arr, left, right); // Get pivot index
                await quickSort(arr, left, pivotIndex - 1); // Sort the left sub-array
                await quickSort(arr, pivotIndex + 1, right); // Sort the right sub-array
            }
        }

        // Function to partition the array
        async function partition(arr, left, right) {
            const pivot = arr[left]; // Taking the leftmost element as pivot
            let i = left + 1; // Pointer for the smaller element

            visualizeArray(arr, `Choosing pivot: ${pivot}`, pivot);
            await new Promise((resolve) => setTimeout(resolve, delay));

            for (let j = left + 1; j <= right; j++) {
                if (arr[j] < pivot) {
                    [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap if the element is less than the pivot
                    visualizeArray(arr, `Swapping ${arr[i]} and ${arr[j]}`, pivot);
                    await new Promise((resolve) => setTimeout(resolve, delay));
                    i++;
                }
            }
            [arr[left], arr[i - 1]] = [arr[i - 1], arr[left]]; // Swap the pivot to the correct position

            visualizeArray(arr, `Placing pivot ${pivot} in correct position`, pivot);
            await new Promise((resolve) => setTimeout(resolve, delay));

            return i - 1; // Return the index of the pivot
        }

        // Update complexity information after sorting
        function updateComplexityInfo() {
            const timeComplexity = "Time Complexity: O(n log n) ";
            const spaceComplexity = "Space Complexity: O(log n) ";
            
            document.getElementById("time-complexity").textContent = timeComplexity;
            document.getElementById("space-complexity").textContent = spaceComplexity;
        }