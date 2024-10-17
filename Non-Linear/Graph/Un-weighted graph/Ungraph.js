        const graphContainer = d3.select("#graph-container");
        const graphWidth = 800;
        const graphHeight = 600;

        const graph = graphContainer.append("svg")
            .attr("width", graphWidth)
            .attr("height", graphHeight);

        const nodes = [];
        const edges = [];
        let adjList = {};

        function createCircularLayout() {
            const radius = Math.min(graphWidth, graphHeight) / 3;
            const angleStep = (2 * Math.PI) / nodes.length;

            nodes.forEach((node, index) => {
                node.x = graphWidth / 2 + radius * Math.cos(index * angleStep);
                node.y = graphHeight / 2 + radius * Math.sin(index * angleStep);
            });
        }

        function createGraph() {
            nodes.length = 0;
            edges.length = 0;
            adjList = {};

            const nodesInput = document.getElementById("nodes-input").value.split(',').map(n => n.trim());
            const edgesInput = document.getElementById("edges-input").value.split(',').map(e => e.trim());

            nodesInput.forEach((nodeValue, index) => {
                if (!nodes.some(node => node.value === nodeValue)) {
                    nodes.push({ id: index, value: nodeValue });
                    adjList[nodeValue] = [];
                }
            });

            edgesInput.forEach(edge => {
                const [start, end] = edge.split('-').map(e => e.trim());
                const startNodeIndex = nodes.findIndex(node => node.value === start);
                const endNodeIndex = nodes.findIndex(node => node.value === end);

                if (startNodeIndex !== -1 && endNodeIndex !== -1) {
                    edges.push({ source: startNodeIndex, target: endNodeIndex });
                    adjList[start].push(end);
                    adjList[end].push(start);  // For undirected graph
                }
            });

            createCircularLayout();
            updateGraph();
        }

        function drawNode(node) {
            const nodeGroup = graph.append("g")
                .attr("class", "node")
                .attr("transform", `translate(${node.x}, ${node.y})`)
                .attr("id", `node-${node.value}`);

            nodeGroup.append("circle")
                .attr("r", 25)
                .attr("fill", "blue");

            nodeGroup.append("text")
                .attr("dy", ".35em")
                .attr("text-anchor", "middle")
                .text(node.value)
                .attr("fill", "white");
        }

        function drawEdge(edge) {
            const sourceNode = nodes[edge.source];
            const targetNode = nodes[edge.target];

            graph.append("line")
                .attr("x1", sourceNode.x)
                .attr("y1", sourceNode.y)
                .attr("x2", targetNode.x)
                .attr("y2", targetNode.y)
                .attr("stroke", "black")
                .attr("stroke-width", 2);
        }

        function updateGraph() {
            graph.selectAll(".node").remove();
            graph.selectAll("line").remove();

            nodes.forEach(drawNode);
            edges.forEach(drawEdge);
        }

        // Highlight function for traversal
        function highlightNode(nodeValue) {
            graph.select(`#node-${nodeValue} circle`)
                .attr("fill", "red");
        }

        function resetHighlight() {
            graph.selectAll("circle").attr("fill", "blue");
        }

        // BFS traversal
        async function bfsTraversal(startNode) {
            const visited = new Set();
            const queue = [startNode];
            const output = [];

            const timeComplexity = 'O(V + E)';  // Time complexity for BFS
            const spaceComplexity = 'O(V)';     // Space complexity for BFS

            while (queue.length) {
                const current = queue.shift();
                if (!visited.has(current)) {
                    visited.add(current);
                    output.push(current);
                    highlightNode(current);

                    await new Promise(resolve => setTimeout(resolve, 1000)); // 1-second delay

                    adjList[current].forEach(neighbor => {
                        if (!visited.has(neighbor)) {
                            queue.push(neighbor);
                        }
                    });
                }
            }

            document.getElementById("output").innerHTML = `BFS Traversal Path: ${output.join(" -> ")}<br>Time Complexity: ${timeComplexity}<br>Space Complexity: ${spaceComplexity}`;
            resetHighlight();
        }

        // DFS traversal
        async function dfsTraversal(node, visited, output) {
            visited.add(node);
            output.push(node);
            highlightNode(node);

            await new Promise(resolve => setTimeout(resolve, 1000)); // 1-second delay

            for (let neighbor of adjList[node]) {
                if (!visited.has(neighbor)) {
                    await dfsTraversal(neighbor, visited, output);
                }
            }
        }

        async function startDFS(startNode) {
            const visited = new Set();
            const output = [];
            const timeComplexity = 'O(V + E)';  // Time complexity for DFS
            const spaceComplexity = 'O(V)';     // Space complexity for DFS

            await dfsTraversal(startNode, visited, output);
            document.getElementById("output").innerHTML = `DFS Traversal Path: ${output.join(" -> ")}<br>Time Complexity: ${timeComplexity}<br>Space Complexity: ${spaceComplexity}`;
            resetHighlight();
        }

        document.getElementById("create-graph-btn").addEventListener("click", createGraph);
        document.getElementById("bfs-btn").addEventListener("click", () => bfsTraversal(nodes[0].value));
        document.getElementById("dfs-btn").addEventListener("click", () => startDFS(nodes[0].value));