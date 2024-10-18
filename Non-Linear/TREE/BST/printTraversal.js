class BSTTraversal {
  constructor(bst) {
    this.bst = bst;
    this.traversalResult = [];
  }

  // In-order traversal: left, root, right
  async inOrder(node) {
    if (node) {
      await this.inOrder(node.left);
      this.traversalResult.push(node.data);
      await this.highlightNode(node);
      await this.inOrder(node.right);
    }
  }

  // Pre-order traversal: root, left, right
  async preOrder(node) {
    if (node) {
      this.traversalResult.push(node.data);
      await this.highlightNode(node);
      await this.preOrder(node.left);
      await this.preOrder(node.right);
    }
  }

  // Post-order traversal: left, right, root
  async postOrder(node) {
    if (node) {
      await this.postOrder(node.left);
      await this.postOrder(node.right);
      this.traversalResult.push(node.data);
      await this.highlightNode(node);
    }
  }

  // Function to highlight the current node
  async highlightNode(node) {
    const originalColor = ctx.strokeStyle; // Save original color
    ctx.strokeStyle = 'black'; // Change to red to highlight

    // Draw the node with a larger radius to represent highlighted background
    ctx.beginPath();
    ctx.arc(node.x, node.y, 30, 0, 2 * Math.PI); // Highlight background
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.stroke();

    // Draw the node again with the original size for the data
    ctx.strokeStyle = 'black'; // Reset stroke color to black
    ctx.beginPath();
    ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = 'black'; // Set fill color for the text
    ctx.fillText(node.data, node.x - 10, node.y + 5); // Display node data

    // Display the current node's data and the traversal array in the output area
    document.getElementById("output-text").innerText = `Current Node: ${node.data} | Traversal Array: [${this.traversalResult.join(", ")}]`;

    // Delay for a brief moment to simulate highlighting
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay

    // Restore original color
    ctx.strokeStyle = originalColor; // Reset to original color
    ctx.beginPath();
    ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillText(node.data, node.x - 10, node.y + 5); // Draw the data again
  }

  // Function to clear the previous result
  clearResult() {
    this.traversalResult = [];
    document.getElementById("output-text").innerText = ''; // Clear output text
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    this.bst.drawTree(ctx, this.bst.root); // Redraw the tree
  }

  // Function to get the traversal result as a string
  getResult() {
    return this.traversalResult.join(", "); // Join the results with commas
  }

  // Function to perform in-order traversal and display result
  async printIn() {
    this.clearResult(); // Clear previous result
    await this.inOrder(this.bst.root);
    this.displayResult("In-Order Traversal: " + this.getResult());
  }

  // Function to perform pre-order traversal and display result
  async printPre() {
    this.clearResult(); // Clear previous result
    await this.preOrder(this.bst.root);
    this.displayResult("Pre-Order Traversal: " + this.getResult());
  }

  // Function to perform post-order traversal and display result
  async printPost() {
    this.clearResult(); // Clear previous result
    await this.postOrder(this.bst.root);
    this.displayResult("Post-Order Traversal: " + this.getResult());
  }

  // Function to display result and reset simulation
  displayResult(result) {
    document.getElementById("output-text").innerText = result; // Show result in the output area
    alert(result); // Show an alert with the result
    setTimeout(() => {
      this.clearResult(); // Reset simulation after a short delay
    }, 2000); // Reset after 2 seconds
  }
}

// Create an instance of BSTTraversal
const traversal = new BSTTraversal(bst);

// Attach traversal functions to HTML buttons (assuming these functions are called on button clicks)
async function printIn() {
  await traversal.printIn();
}

async function printPre() {
  await traversal.printPre();
}

async function printPost() {
  await traversal.printPost();
}
