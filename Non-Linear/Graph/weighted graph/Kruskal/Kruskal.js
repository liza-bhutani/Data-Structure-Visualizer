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
        const [connection, weight] = edge.split(':');
        const [start, end] = connection.split('-').map(e => e.trim());

        const startNodeIndex = nodes.findIndex(node => node.value === start);
        const endNodeIndex = nodes.findIndex(node => node.value === end);

        if (startNodeIndex !== -1 && endNodeIndex !== -1 && !isNaN(weight)) {
            edges.push({ source: startNodeIndex, target: endNodeIndex, weight: parseFloat(weight) });
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

function drawEdge(edge, showWeight = false) {
    const sourceNode = nodes[edge.source];
    const targetNode = nodes[edge.target];

    const line = graph.append("line")
        .attr("x1", sourceNode.x)
        .attr("y1", sourceNode.y)
        .attr("x2", targetNode.x)
        .attr("y2", targetNode.y)
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr('marker-end', 'url(#arrowhead)');

    if (showWeight) {
        const midX = (sourceNode.x + targetNode.x) / 2;
        const midY = (sourceNode.y + targetNode.y) / 2;

        graph.append("text")
            .attr("x", midX + 10)
            .attr("y", midY - 10)
            .text(edge.weight)
            .attr("text-anchor", "middle");
    }
}

function updateGraph() {
    graph.selectAll(".node").remove();
    graph.selectAll("line").remove();

    graph.append('defs').append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '0 0 10 10')
        .attr('refX', 10)
        .attr('refY', 5)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('polygon')
        .attr('points', '0 0, 10 5, 0 10')
        .attr('fill', 'black');

    nodes.forEach(drawNode);
    edges.forEach(edge => drawEdge(edge, true)); // Show weights for all edges
}

function makeSet(parent, rank, n) {
    for (let i = 0; i < n; i++) {
        parent[i] = i;
        rank[i] = 0;
    }
}

function findParent(parent, component) {
    if (parent[component] === component)
        return component;

    return parent[component] = findParent(parent, parent[component]);
}

function unionSet(u, v, parent, rank) {
    u = findParent(parent, u);
    v = findParent(parent, v);

    if (rank[u] < rank[v]) {
        parent[u] = v;
    } else if (rank[u] < rank[v]) {
        parent[v] = u;
    } else {
        parent[v] = u;
        rank[u]++; // since the rank increases if the ranks of two sets are the same
    }
}

function kruskalAlgo(n, edges) {
    edges.sort((a, b) => a.weight - b.weight); // Sort edges by weight
    let parent = new Array(n);
    let rank = new Array(n);
    makeSet(parent, rank, n);

    let mstEdges = [];
    let minCost = 0;

    // Time complexity: O(E log E) due to sorting edges
    const timeComplexity = "Time Complexity: O(E log E)";
    // Space complexity: O(V) for the parent and rank arrays
    const spaceComplexity = "Space Complexity: O(V)";

    for (let i = 0; i < edges.length; i++) {
        let u = edges[i].source;
        let v = edges[i].target;
        let wt = edges[i].weight;

        if (findParent(parent, u) !== findParent(parent, v)) {
            unionSet(u, v, parent, rank);
            mstEdges.push(edges[i]);
            minCost += wt;
        }
    }

    // Clear the graph before drawing the MST
    graph.selectAll(".node").remove();
    graph.selectAll("line").remove();

    graph.append('defs').append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '0 0 10 10')
        .attr('refX', 10)
        .attr('refY', 5)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('polygon')
        .attr('points', '0 0, 10 5, 0 10')
        .attr('fill', 'black');

    // Draw nodes
    nodes.forEach(drawNode);
    // Draw MST edges only with weights
    mstEdges.forEach(edge => drawEdge(edge, true));

    document.getElementById("output").innerHTML = "Minimum Spanning Tree Edges:<br>";
    mstEdges.forEach(edge => {
        const startNode = nodes[edge.source].value;
        const endNode = nodes[edge.target].value;
        document.getElementById("output").innerHTML += `${startNode} - ${endNode} : ${edge.weight}<br>`;
    });

    // Display the time and space complexities
    document.getElementById("complexity-output").innerHTML = `${timeComplexity}<br>${spaceComplexity}`;
}

document.getElementById("create-graph-btn").addEventListener("click", () => {
    createGraph();
});

document.getElementById("kruskal-btn").addEventListener("click", () => {
    kruskalAlgo(nodes.length, edges);
});