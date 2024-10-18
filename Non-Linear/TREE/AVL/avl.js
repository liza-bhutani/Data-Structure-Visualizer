
class Node {
  constructor(key) {
      this.key = key;
      this.left = null;
      this.right = null;
      this.height = 1;
  }
}

// AVL Tree class
class AVLTree {
  constructor() {
      this.root = null;
      this.canvasWidth = 600; // Set canvas width
      this.canvasHeight = 600; // Set canvas height
      this.pathNodes = []; // To store nodes in the search path
  }

  // Function to insert a node
  insert(key) {
      this.root = this._insert(this.root, key);
      this.updateComplexity();
      this.drawTree(); // Update the visualization
  }

  _insert(node, key) {
      if (!node) return new Node(key);

      if (key < node.key) {
          node.left = this._insert(node.left, key);
      } else if (key > node.key) {
          node.right = this._insert(node.right, key);
      } else {
          return node; // Duplicate keys are not allowed
      }

      node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
      return this._balance(node);
  }

  // Function to delete a node with simulation
  delete(key) {
      this.root = this._delete(this.root, key);
      this.updateComplexity();
      this.drawTree(); 
  }

  _delete(node, key) {
      if (!node) return node;

      if (key < node.key) {
          node.left = this._delete(node.left, key);
      } else if (key > node.key) {
          node.right = this._delete(node.right, key);
      } else {
          // Node with only one child or no child
          if (!node.left) return node.right;
          if (!node.right) return node.left;

          // Node with two children: get the inorder successor (smallest in the right subtree)
          let temp = this.getMinValueNode(node.right);
          node.key = temp.key;
          node.right = this._delete(node.right, temp.key);
      }

      node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
      return this._balance(node);
  }

  // Function to search for a node with simulation
  search(key) {
      this.pathNodes = []; // Reset path nodes before search
      const result = this._search(this.root, key);
      this.drawTree(); // Update the visualization
      return result;
  }

  _search(node, key) {
      if (!node) return null;

      // Store the node in the search path
      this.pathNodes.push(node);

      if (node.key === key) {
          return node;
      }

      if (key < node.key) {
          return this._search(node.left, key);
      }

      return this._search(node.right, key);
  }

  // Function to get the height of a node
  getHeight(node) {
      if (!node) return 0;
      return node.height;
  }

  // Function to get minimum value node
  getMinValueNode(node) {
      let current = node;
      while (current && current.left) {
          current = current.left;
      }
      return current;
  }

  // Function to balance the tree
  _balance(node) {
      const balance = this.getBalance(node);

      // Left Left Case
      if (balance > 1 && this.getBalance(node.left) >= 0) {
          return this.rotateRight(node);
      }

      // Right Right Case
      if (balance < -1 && this.getBalance(node.right) <= 0) {
          return this.rotateLeft(node);
      }

      // Left Right Case
      if (balance > 1 && this.getBalance(node.left) < 0) {
          node.left = this.rotateLeft(node.left);
          return this.rotateRight(node);
      }

      // Right Left Case
      if (balance < -1 && this.getBalance(node.right) > 0) {
          node.right = this.rotateRight(node.right);
          return this.rotateLeft(node);
      }

      return node;
  }

  getBalance(node) {
      if (!node) return 0;
      return this.getHeight(node.left) - this.getHeight(node.right);
  }

  rotateLeft(z) {
      let y = z.right;
      let T2 = y.left;
      y.left = z;
      z.right = T2;
      z.height = Math.max(this.getHeight(z.left), this.getHeight(z.right)) + 1;
      y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
      return y;
  }

  rotateRight(z) {
      let y = z.left;
      let T3 = y.right;
      y.right = z;
      z.left = T3;
      z.height = Math.max(this.getHeight(z.left), this.getHeight(z.right)) + 1;
      y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
      return y;
  }

  // Function to update complexity info
  updateComplexity() {
      const timeComplexity = "O(log n)"; // Average case for AVL tree operations
      const spaceComplexity = "O(n)"; // Space complexity for AVL tree
      document.getElementById("time-complexity").innerText = `Time complexity: ${timeComplexity}`;
      document.getElementById("space-complexity").innerText = `Space complexity: ${spaceComplexity}`;
  }

  // Function to visualize the AVL tree
  drawTree() {
      const canvas = document.getElementById("myBstCanvas");
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawing
      this._drawNode(this.root, this.canvasWidth / 2, 40, this.canvasWidth / 4, ctx); // Start drawing from the center
  }

  _drawNode(node, x, y, offset, ctx) {
    if (!node) return;

    // Store the node's position for future reference
    node.x = x; // Assign x coordinate
    node.y = y; // Assign y coordinate

    // Highlight node if it's part of the search path
    ctx.strokeStyle = "black"; // Node border color
    ctx.lineWidth = 2; // Border width
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2); // Draw circle
    ctx.stroke(); // Draw border

    ctx.fillStyle = "black"; // Text color
    ctx.font = "19px Arial"; // Increase font size
    ctx.fillText(node.key, x - 10, y + 5); // Draw node value

    // Draw left child
    if (node.left) {
        ctx.beginPath();
        ctx.moveTo(x, y + 20); // Start from bottom of node
        ctx.lineTo(x - offset, y + 70); // Draw line to left child
        ctx.stroke();
        this._drawNode(node.left, x - offset, y + 70, offset / 2, ctx); // Recursive call for left child
    }

    // Draw right child
    if (node.right) {
        ctx.beginPath();
        ctx.moveTo(x, y + 20); // Start from bottom of node
        ctx.lineTo(x + offset, y + 70); // Draw line to right child
        ctx.stroke();
        this._drawNode(node.right, x + offset, y + 70, offset / 2, ctx); // Recursive call for right child
    }
  }

}

// Create an instance of AVLTree
const avlTree = new AVLTree();

// Insert user value with simulation
function insertUserValue() {
  const value = document.getElementById("nodeValue").value;
  if (value) {
      insertWithAnimation(parseInt(value)); // Call the insert with animation function
  }
}

// Delete user value with simulation
function deleteUserValue() {
  const value = document.getElementById("delval").value;
  if (value) {
      deleteWithAnimation(parseInt(value)); // Call the delete with animation function
  }
}

// Search user value with simulation
function searchUserValue() {
  const value = document.getElementById("search").value;
  if (value) {
      searchWithAnimation(parseInt(value)); // Call the search with animation function
  }
}

// Canvas setup
const canvas = document.getElementById("myBstCanvas");
const ctx = canvas.getContext("2d");
ctx.font = "16px Arial";

// Insert nodes with animation
function insertWithAnimation(data) {
  avlTree.insert(data);

  // Clear the canvas and redraw the tree with the new node
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  avlTree.drawTree(ctx, avlTree.root);

  // Display time and space complexity
  avlTree.updateComplexity();
}

// Delete nodes with animation
function deleteWithAnimation(data) {
  avlTree.delete(data);

  // Clear the canvas and redraw the tree after deletion
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  avlTree.drawTree(ctx, avlTree.root);

  // Display time and space complexity
  avlTree.updateComplexity();
}

// Search nodes with animation
function searchWithAnimation(data) {
  const result = avlTree.search(data);

  // Clear the canvas and redraw the tree
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  avlTree.drawTree(ctx, avlTree.root);

  // Highlight the found node if it exists
  if (result) {
      ctx.beginPath();
      ctx.arc(result.x, result.y, 25, 0, 2 * Math.PI); // Draw circle for the found node
      ctx.fillStyle = 'red'; // Set fill color for highlight
      ctx.fill();
      ctx.strokeStyle = 'black'; // Reset stroke color for border
      ctx.lineWidth = 2; // Border width
      ctx.stroke();
      ctx.fillStyle = 'black'; // Set fill color for the text
      ctx.fillText(result.key, result.x - 10, result.y + 5); // Draw the node's value
  }

  // Update time and space complexity
  avlTree.updateComplexity();
}
