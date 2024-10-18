let edges, numVertices, dist, stepIndex, hasNegativeCycle, tableOutput, prevDist;

function runBellmanFord() {
    const edgesInput = document.getElementById('edges').value.trim();
    edges = edgesInput.split('\n').map(line => {
        const [u, v, weight] = line.split(' ').map(Number);
        return { u, v, weight };
    });

    numVertices = new Set(edges.flatMap(e => [e.u, e.v])).size; // Unique vertices
    dist = new Array(numVertices).fill(Infinity);
    prevDist = [...dist];
    dist[0] = 0; // Assume vertex 0 is the source

    // Display time and space complexity
    const numEdges = edges.length;
    document.getElementById('time-complexity').textContent = `Time complexity: O(${numVertices} * ${numEdges}) => O(${numVertices * numEdges})`;
    document.getElementById('space-complexity').textContent = `Space Complexity: O(${numVertices})`;

    // Create a table for output
    tableOutput = `<table><tr><th>Step</th><th>Edge (u -> v)</th><th>Formula</th><th>New Distance</th></tr>`;
    stepIndex = 0;
    hasNegativeCycle = false;
    simulateRelaxation(numVertices - 1);
}


        function simulateRelaxation(steps) {
            if (stepIndex < steps) {
                // Relax edges
                for (const { u, v, weight } of edges) {
                    const formula = `D(${v}) > D(${u}) + ${weight}  =>  ${dist[v]} > ${dist[u]} + ${weight}`;
                    let newDist = dist[v];
                    if (dist[u] !== Infinity && dist[u] + weight < dist[v]) {
                        prevDist[v] = dist[v]; // Store previous distance for comparison
                        dist[v] = dist[u] + weight;
                        newDist = dist[v];
                        addToTable(stepIndex + 1, `${u} -> ${v}`, formula, newDist);
                    } else {
                        addToTable(stepIndex + 1, `${u} -> ${v}`, formula, "No Relaxation");
                    }
                }
                
                // Update output
                document.getElementById('output').innerHTML = tableOutput;
                
                stepIndex++;
                setTimeout(() => simulateRelaxation(steps), 1000); // Wait 1 second before next step
            } else {
                checkNegativeCycle();
            }
        }

        function checkNegativeCycle() {
            // Check for negative cycles
            const negativeCycleVertices = new Set();
            for (const { u, v, weight } of edges) {
                if (dist[u] !== Infinity && dist[u] + weight < dist[v]) {
                    hasNegativeCycle = true;
                    negativeCycleVertices.add(v);
                    addToTable("N/A", `${u} -> ${v}`, "Negative cycle detected", `Vertex ${v}`);
                }
            }

            // Display final result
            tableOutput += `<tr><td colspan="4">${hasNegativeCycle ? 
                "Result: Negative cycle exists! Vertices involved: " + [...negativeCycleVertices].join(', ') : 
                "Result: No negative cycle."}</td></tr>`;
            document.getElementById('output').innerHTML = tableOutput;
        }

        function addToTable(step, edge, formula, result) {
            tableOutput += `<tr><td>${step}</td><td>${edge}</td><td>${formula}</td><td>${result}</td></tr>`;
        }