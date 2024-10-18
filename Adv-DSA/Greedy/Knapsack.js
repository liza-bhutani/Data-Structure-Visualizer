// Function to visualize 0/1 Knapsack using greedy approach
function greedyKnapsack(capacity, weights, profits) {
    const n = weights.length;
    const items = weights.map((weight, index) => ({ weight, profit: profits[index], index }));
    items.sort((a, b) => (b.profit / b.weight) - (a.profit / a.weight)); // Sort by profit-to-weight ratio

    const result = [];
    let totalProfit = 0;
    const visualization = document.getElementById("visualization");
    visualization.innerHTML = ""; // Clear previous visualization

    // Use a promise to control visualization
    const promises = items.map((item, index) => {
        return new Promise((resolve) => {
            const row = document.createElement("div");
            row.textContent = `Item ${item.index + 1}: Weight = ${item.weight}, Profit = ${item.profit}`;

            setTimeout(() => {
                if (capacity >= item.weight) {
                    capacity -= item.weight;
                    totalProfit += item.profit;
                    row.className = "highlight"; // Highlight selected items
                    row.textContent += " (Selected)";
                    result.push({ ...item, taken: true });
                } else {
                    row.textContent += " (Not Selected)";
                    result.push({ ...item, taken: false });
                }

                visualization.appendChild(row); // Add to visualization
                resolve();
            }, index * 1000); // Delay for each item
        });
    });

    return Promise.all(promises).then(() => {
        fillResultTable(result);
        
        // Display complexities
        document.getElementById("time-complexity").textContent = "Time Complexity: O(n log n) for sorting + O(n) for traversal = O(n log n)";
        document.getElementById("space-complexity").textContent = "Space Complexity: O(n) for storing items.";
        
        return totalProfit;
    });
}

function fillResultTable(items) {
    const table = document.getElementById("resultTable");
    table.innerHTML = ""; // Clear previous table

    // Create table header
    let header = "<tr><th>Item Index</th><th>Weight</th><th>Profit</th><th>Taken</th></tr>";
    table.innerHTML += header;

    // Create table rows
    items.forEach(item => {
        const row = `<tr>
            <td>${item.index + 1}</td>
            <td>${item.weight}</td>
            <td>${item.profit}</td>
            <td>${item.taken ? 'Yes' : 'No'}</td>
        </tr>`;
        table.innerHTML += row;
    });
}

// Fractional Knapsack Problem
class Item {
    constructor(profit, weight) {
        this.profit = profit;
        this.weight = weight;
        this.ratio = profit / weight;
    }
}

function fractionalKnapsack(W, arr) {
    arr.sort((a, b) => b.ratio - a.ratio);
    let finalValue = 0.0;
    const visualization = document.getElementById("visualization");
    visualization.innerHTML = ""; // Clear previous visualization

    // Use a promise to control visualization
    const promises = arr.map((item, index) => {
        return new Promise((resolve) => {
            const row = document.createElement("div");
            row.textContent = `Item with Profit = ${item.profit} and Weight = ${item.weight}`;

            setTimeout(() => {
                if (item.weight <= W) {
                    W -= item.weight;
                    finalValue += item.profit;
                    row.className = "highlight"; // Highlight selected items
                    row.textContent += " (Selected)";
                } else {
                    finalValue += item.profit * (W / item.weight);
                    row.textContent += ` (Partially Selected, Fraction = ${(W/item.weight).toFixed(2)})`;
                    W = 0; // All capacity used
                }

                visualization.appendChild(row); // Add to visualization
                resolve();
            }, index * 1000); // Delay for each item
        });
    });

    return Promise.all(promises).then(() => {
        // Display complexities
        document.getElementById("time-complexity").textContent = "Time Complexity: O(n log n) for sorting + O(n) for traversal = O(n log n)";
        document.getElementById("space-complexity").textContent = "Space Complexity: O(n) for storing items.";
        
        return finalValue;
    });
}

document.getElementById("startButton").addEventListener("click", function() {
    const capacity = parseInt(document.getElementById("capacity").value);
    const weights = document.getElementById("weights").value.split(",").map(Number);
    const profits = document.getElementById("profits").value.split(",").map(Number);

    greedyKnapsack(capacity, weights, profits).then(maxProfit => {
        document.getElementById("finalResult").innerHTML = `Maximum Profit (0/1 Knapsack): ${maxProfit}`;
        document.getElementById("explanation").innerHTML = `
            <strong>Explanation:</strong> 
            The greedy approach selects items based on their profit-to-weight ratio until the knapsack is full. 
            The maximum profit is achieved by selecting the most valuable items first.
        `;
    });
});

document.getElementById("startFractionalButton").addEventListener("click", function() {
    const capacity = parseInt(document.getElementById("capacity").value);
    const weights = document.getElementById("weights").value.split(",").map(Number);
    const profits = document.getElementById("profits").value.split(",").map(Number);
    const arr = weights.map((weight, index) => new Item(profits[index], weight));

    fractionalKnapsack(capacity, arr).then(maxProfit => {
        document.getElementById("finalResult").innerHTML = `Maximum Profit (Fractional): ${maxProfit}`;
        document.getElementById("explanation").innerHTML = `
            <strong>Explanation:</strong> 
            The fractional knapsack allows taking fractions of items, maximizing profit by considering the ratio of profit to weight. 
            The greedy approach prioritizes higher ratios for selection.
        `;
    });
});
