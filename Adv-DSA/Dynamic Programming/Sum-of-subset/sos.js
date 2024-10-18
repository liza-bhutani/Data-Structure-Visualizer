let set = [];
    let sum = 0;
    let n = 0;
    let dpTable = [];
    let interval;
    let isStopped = false;
    let currentRow = 0;
    let currentCol = 0;
    let operationsCount = 0; // Track the number of operations (for time complexity)

    document.getElementById("startBtn").addEventListener("click", function() {
        startVisualization();
    });

    document.getElementById("stopBtn").addEventListener("click", function() {
        clearInterval(interval);
        isStopped = true;
        document.getElementById("explanation").innerText = `Stopped simulation at dp[${currentRow}][${currentCol}].`;
        document.getElementById("resumeBtn").disabled = false;
    });

    document.getElementById("resumeBtn").addEventListener("click", function() {
        resumeVisualization();
    });

    function startVisualization() {
        set = document.getElementById("setInput").value.split(",").map(Number);
        sum = parseInt(document.getElementById("sumInput").value);
        n = set.length;

        // Initialize dpTable with false
        dpTable = Array(n + 1).fill().map(() => Array(sum + 1).fill(false));
        dpTable[0][0] = true;

        // Reset UI elements
        document.getElementById("dpTable").innerHTML = '';
        operationsCount = 0; // Reset operations count

        // Create the header row
        let headerRow = `<tr><th class="header-cell">Set/Sum</th>`;
        for (let j = 0; j <= sum; j++) {
            headerRow += `<th class="header-cell">${j}</th>`;
        }
        headerRow += `</tr>`;
        document.getElementById("dpTable").innerHTML += headerRow;

        // Create the rest of the DP table with row labels
        for (let i = 0; i <= n; i++) {
            let row = `<tr>`;
            row += `<td class="header-cell">${i === 0 ? "0" : set[i - 1]}</td>`; // Display element or 0
            for (let j = 0; j <= sum; j++) {
                row += `<td id="dp-${i}-${j}" class="dp-cell">${dpTable[i][j] ? "T" : "F"}</td>`;
            }
            row += `</tr>`;
            document.getElementById("dpTable").innerHTML += row;
        }

        currentRow = 1;
        currentCol = 0;
        isStopped = false;
        document.getElementById("explanation").innerText = "Starting simulation...";
        document.getElementById("stopBtn").disabled = false;
        document.getElementById("resumeBtn").disabled = true;

        updateSpaceComplexity(); // Update space complexity at the start
        updateComplexity(); // Update time complexity before the process starts
        interval = setInterval(fillDPTableStep, 1000); // Start filling DP table step by step
    }

    function fillDPTableStep() {
        if (currentRow > n) {
            clearInterval(interval);
            displayFinalResult();
            return;
        }

        if (currentCol > sum) {
            currentRow++;
            currentCol = 0;
            return;
        }

        // Perform DP logic
        if (currentCol === 0) {
            dpTable[currentRow][currentCol] = true;
        } else if (set[currentRow - 1] > currentCol) {
            dpTable[currentRow][currentCol] = dpTable[currentRow - 1][currentCol];
        } else {
            dpTable[currentRow][currentCol] = dpTable[currentRow - 1][currentCol] || dpTable[currentRow - 1][currentCol - set[currentRow - 1]];
        }

        operationsCount++; // Increment operation count at each step

        // Update UI for the current cell
        const cell = document.getElementById(`dp-${currentRow}-${currentCol}`);
        cell.innerText = dpTable[currentRow][currentCol] ? "T" : "F";
        clearActiveCells(); // Clear previously active cells
        cell.classList.add("active"); // Highlight the current cell
        document.getElementById("explanation").innerText = getExplanation(currentRow, currentCol);

        updateComplexity(); // Update time complexity at each step

        currentCol++;
    }

    function clearActiveCells() {
        for (let i = 0; i <= n; i++) {
            for (let j = 0; j <= sum; j++) {
                const cell = document.getElementById(`dp-${i}-${j}`);
                cell.classList.remove("active");
            }
        }
    }

    function getExplanation(row, col) {
        if (col === 0) {
            return `dp[${row}][0] is set to true because sum 0 can always be formed with an empty subset.`;
        }
        if (set[row - 1] > col) {
            return `dp[${row}][${col}] is set to dp[${row-1}][${col}] (i.e., ${dpTable[row - 1][col]}) because element ${set[row-1]} is larger than the current sum ${col}.`;
        } else {
            const include = dpTable[row - 1][col - set[row - 1]];
            const exclude = dpTable[row - 1][col];
            return `dp[${row}][${col}] is set to ${include || exclude} because we can either include the element ${set[row-1]} (dp[${row-1}][${col-set[row-1]}] = ${include}) or exclude it (dp[${row-1}][${col}] = ${exclude}).`;
        }
    }

    function displayFinalResult() {
        const resultDiv = document.getElementById("finalResult");
        if (dpTable[n][sum]) {
            resultDiv.innerText = `Subset with the target sum ${sum} exists.`;
        } else {
            resultDiv.innerText = `Subset with the target sum ${sum} does not exist.`;
        }
    }

    function updateComplexity() {
        // Time Complexity: O(n * sum)
        document.getElementById("timeComplexity").innerText = `O(${operationsCount})`;
    }

    function updateSpaceComplexity() {
        // Space Complexity: O(n * sum), computed only once at the start
        const spaceComplexity = (n + 1) * (sum + 1);
        document.getElementById("spaceComplexity").innerText = `O(${spaceComplexity})`;
    }

    function resumeVisualization() {
        isStopped = false;
        document.getElementById("resumeBtn").disabled = true;
        interval = setInterval(fillDPTableStep, 1000);
    }