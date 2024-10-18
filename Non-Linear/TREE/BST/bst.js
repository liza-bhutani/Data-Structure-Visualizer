class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
    this.x = 0;
    this.y = 0;
  }
}

class BST {
  constructor() {
    this.root = null;
    this.comparisons = 0; // For time complexity
    this.height = 0; // For space complexity
  }

  insert(data) {
    let newNode = new Node(data);
    if (!this.root) {
      this.root = newNode;
      this.root.x = 500;
      this.root.y = 50;
    } else {
      this.comparisons = 0;
      this.height = 0;
      this.insertNode(this.root, newNode, 500, 50, 200);
    }
  }

  insertNode(node, newNode, x, y, offset) {
    this.comparisons++; // Counting comparisons for time complexity

    if (newNode.data < node.data) {
      if (!node.left) {
        newNode.x = x - offset;
        newNode.y = y + 80;
        node.left = newNode;
      } else {
        this.height++; // Counting height for space complexity
        this.insertNode(node.left, newNode, x - offset, y + 80, offset / 2);
      }
    } else {
      if (!node.right) {
        newNode.x = x + offset;
        newNode.y = y + 80;
        node.right = newNode;
      } else {
        this.height++; // Counting height for space complexity
        this.insertNode(node.right, newNode, x + offset, y + 80, offset / 2);
      }
    }
  }

  // Delete a node from the BST
  delete(data) {
    this.comparisons = 0;
    this.height = 0;
    this.root = this.deleteNode(this.root, data);
  }

  deleteNode(node, data) {
    if (node == null) {
      return null;
    }

    this.comparisons++; // For time complexity

    if (data < node.data) {
      node.left = this.deleteNode(node.left, data);
    } else if (data > node.data) {
      node.right = this.deleteNode(node.right, data);
    } else {
      // Node found, now to delete it
      if (!node.left && !node.right) {
        node = null; // No child
      } else if (!node.left) {
        node = node.right; // One child
      } else if (!node.right) {
        node = node.left; // One child
      } else {
        // Two children, find the inorder successor
        let minNode = this.findMinNode(node.right);
        node.data = minNode.data;
        node.right = this.deleteNode(node.right, minNode.data);
      }
    }
    return node;
  }

  // Find minimum node in a subtree
  findMinNode(node) {
    while (node.left !== null) {
      node = node.left;
    }
    return node;
  }

  // Search a node in the BST
  search(data) {
    this.comparisons = 0;
    return this.searchNode(this.root, data);
  }

  searchNode(node, data) {
    if (node == null) {
      return null;
    }

    this.comparisons++; // For time complexity

    if (data < node.data) {
      return this.searchNode(node.left, data);
    } else if (data > node.data) {
      return this.searchNode(node.right, data);
    } else {
      return node; // Node found
    }
  }

  drawTree(ctx, node) {
    if (node === null) return;

    if (node.left) {
      ctx.beginPath();
      ctx.moveTo(node.x, node.y);
      ctx.lineTo(node.left.x, node.left.y);
      ctx.stroke();
      this.drawTree(ctx, node.left);
    }

    if (node.right) {
      ctx.beginPath();
      ctx.moveTo(node.x, node.y);
      ctx.lineTo(node.right.x, node.right.y);
      ctx.stroke();
      this.drawTree(ctx, node.right);
    }

    ctx.beginPath();
    ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillText(node.data, node.x - 10, node.y + 5);
  }

  displayComplexity() {
    const logHeight = Math.log2(this.height + 2);
    const timeComplexity = this.comparisons <= logHeight ? "O(log n)" : "O(n)";
    const spaceComplexity = this.height <= logHeight ? "O(log n)" : "O(n)";

    document.getElementById("time-complexity").innerHTML = `Time Complexity: ${timeComplexity}`;
    document.getElementById("space-complexity").innerHTML = `Space Complexity: ${spaceComplexity}`;
  }
}

const bst = new BST();
const canvas = document.getElementById("myBstCanvas");
const ctx = canvas.getContext("2d");
ctx.font = "16px Arial";

// Insert nodes with animation
function insertWithAnimation(data) {
  bst.insert(data);

  // Clear the canvas and redraw the tree with the new node
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bst.drawTree(ctx, bst.root);

  // Display time and space complexity
  bst.displayComplexity();
}

// Delete nodes with animation
function deleteWithAnimation(data) {
  bst.delete(data);

  // Clear the canvas and redraw the tree after deletion
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bst.drawTree(ctx, bst.root);

  // Display time and space complexity
  bst.displayComplexity();
}

// Search for a node with animation (highlight node if found)
function searchWithAnimation(data) {
  const node = bst.search(data);
  
  if (node) {
    // Clear the canvas and redraw the tree
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bst.drawTree(ctx, bst.root);
    
    // Highlight the found node
    ctx.beginPath();
    ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.strokeStyle = 'black'; // Reset stroke color
    ctx.fillStyle = 'black'; // Set fill color for the text
    ctx.fillText(node.data, node.x - 10, node.y + 5); 

    
  } else {
    alert("Node not found");
  }

  // Display time complexity (no space complexity changes during search)
  bst.displayComplexity();
}

// Function to handle user input and insert a node
function insertUserValue() {
  const value = parseInt(document.getElementById("nodeValue").value);
  if (!isNaN(value)) {
    insertWithAnimation(value);
    document.getElementById("nodeValue").value = ''; // Clear the input field
  } else {
    alert("Please enter a valid number");
  }
}

// Function to handle user input and delete a node
function deleteUserValue() {
  const value = parseInt(document.getElementById("delval").value);
  if (!isNaN(value)) {
    deleteWithAnimation(value);
    document.getElementById("delval").value = ''; // Clear the input field
  } else {
    alert("Please enter a valid number");
  }
}

// Function to handle user input and search a node
function searchUserValue() {
  const value = parseInt(document.getElementById("search").value);
  if (!isNaN(value)) {
    searchWithAnimation(value);
    document.getElementById("search").value = ''; // Clear the input field
  } else {
    alert("Please enter a valid number");
  }
}
