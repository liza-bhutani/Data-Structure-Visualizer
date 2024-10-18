// Needed variables
let sl = null;
let listCount = 0;
let row_num = 0;
let arr = [];

class LinkedList {
  constructor(n = null) { // Default parameter to handle initialization without a value
    this.head = null;
    this.data = n;
    this.link = null;
  }

  // Method to update complexity display
  updateComplexity( timeComplexity, spaceComplexity) {
    const timeElem = document.getElementById("time-complexity");
    const spaceElem = document.getElementById("space-complexity");

    if (timeElem && spaceElem) {
      timeElem.innerText = `Time Complexity: O(${timeComplexity}) `;
      spaceElem.innerText = `Space Complexity: O(${spaceComplexity})`;
    } else {
      console.error("Complexity display elements not found in HTML.");
    }
  }

  insert(val) {
    let timeComplexity = "n"; // O(n) since we traverse the list
    let spaceComplexity = arr.length + 1; // O(n), depends on the number of nodes
    let node = new LinkedList(val);

    if (this.head === null) {
      this.head = node;
      arr.push(val);
      console.log(arr);
      this.updateComplexity( timeComplexity, spaceComplexity);
      displayNodes();
      return;
    }

    let ptr = this.head;
    while (ptr.link != null) {
      if (val > ptr.data && val < ptr.link.data) {
        node.link = ptr.link;
        ptr.link = node;
        arr.push(val);
        arr.sort(function (a, b) {
          return a - b;
        });
        console.log(arr);
        this.updateComplexity( timeComplexity, spaceComplexity);
        displayNodes();
        return;
      }
      ptr = ptr.link;
    }
    ptr.link = node;
    arr.push(val);
    arr.sort(function (a, b) {
      return a - b;
    });
    this.updateComplexity( timeComplexity, spaceComplexity);
    displayNodes();
  }

  delete(val) {
    let timeComplexity = "n"; // O(n) for delete operation
    let spaceComplexity = arr.length - 1; // O(n) for space
    val = Number.parseInt(val);
    if (this.head === null) {
      popup(false, "Can't delete from an empty linked list");
      return;
    }

    let ptr = this.head,
      pred = null;

    while (ptr !== null) {
      if (ptr.data === val) {
        if (pred === null) {
          // Deleting the head node
          this.head = ptr.link;
        } else {
          pred.link = ptr.link;
        }
        arr.splice(arr.indexOf(val), 1);
        console.log(arr);
        this.updateComplexity( timeComplexity, spaceComplexity);
        displayNodes();
        return;
      }
      pred = ptr;
      ptr = ptr.link;
    }

    popup(false, "Node not found");
  }

  async search(n) {
    let timeComplexity = "n"; // O(n) for search
    let spaceComplexity = arr.length; // O(n) for space
    let flag = false;
    let item = 0;
    let oddrow = true;
    let item_num = 0;
    let first = true;
    let new_row = false;

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === Number.parseInt(n)) {
        await setColor(item, oddrow, "lightgreen");
        flag = true;
        displayNodes();
        this.updateComplexity( timeComplexity, spaceComplexity);
        break;
      }
      await setColor(item, oddrow);
      item++;
      item_num++;
      if (item_num === 1) {
        first = false;
        new_row = false;
      }
      if (item_num === 8) {
        oddrow = false;
      } else if (item_num === 16) {
        item_num = 0;
        new_row = true;
        oddrow = true;
      }
    }

    if (!flag) {
      popup(false, "Node not found in list!");
      this.updateComplexity( timeComplexity, spaceComplexity);
    }

    async function setColor(item, oddrow, last_color) {
      if (oddrow) {
        if (item !== 0 && new_row) {
          let oldchild = document.getElementById(`item${item - 1}`).children;
          oldchild[1].style.backgroundColor = "aqua";
          oldchild[0].childNodes[0].style.backgroundColor = "aqua";
        } else if (item !== 0 && !first) {
          let oldchild = document.getElementById(`item${item - 1}`).children;
          oldchild[0].style.backgroundColor = "aqua";
          oldchild[1].childNodes[0].style.backgroundColor = "aqua";
        }
        let newchild = document.getElementById(`item${item}`).children;
        newchild[0].style.backgroundColor = last_color ?? "red";
        newchild[1].childNodes[0].style.backgroundColor = last_color ?? "red";
        await sleep(700);
        if (last_color != null) {
          await sleep(1100);
        }
      } else {
        if (item % 8 === 0 && item !== 0) {
          let oldchild = document.getElementById(`item${item - 1}`).children;
          oldchild[0].style.backgroundColor = "aqua";
          oldchild[1].childNodes[0].style.backgroundColor = "aqua";
        } else {
          let oldchild = document.getElementById(`item${item - 1}`).children;
          oldchild[1].style.backgroundColor = "aqua";
          oldchild[0].childNodes[0].style.backgroundColor = "aqua";
        }
        let newchild = document.getElementById(`item${item}`).children;
        newchild[1].style.backgroundColor = last_color ?? "red";
        newchild[0].childNodes[0].style.backgroundColor = last_color ?? "red";
        await sleep(700);
        if (last_color != null) {
          await sleep(1000);
        }
      }
    }

    function sleep(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    }

    // Reset colors after search
    if (oddrow) {
      if (item !== 0 && new_row) {
        let oldchild = document.getElementById(`item${item - 1}`).children;
        oldchild[1].style.backgroundColor = "aqua";
        oldchild[0].childNodes[0].style.backgroundColor = "aqua";
      } else if (item !== 0 && !first) {
        let oldchild = document.getElementById(`item${item - 1}`).children;
        oldchild[0].style.backgroundColor = "aqua";
        oldchild[1].childNodes[0].style.backgroundColor = "aqua";
      }
    } else {
      if (item % 8 === 0 && item !== 0) {
        let oldchild = document.getElementById(`item${item - 1}`).children;
        oldchild[0].style.backgroundColor = "aqua";
        oldchild[1].childNodes[0].style.backgroundColor = "aqua";
      } else {
        let oldchild = document.getElementById(`item${item - 1}`).children;
        oldchild[1].style.backgroundColor = "aqua";
        oldchild[0].childNodes[0].style.backgroundColor = "aqua";
      }
    }
  }
}

// Initialize the linked list
sl = new LinkedList();

// Event listeners for buttons
document.getElementById("btnInsert").addEventListener("click", () => {
  let val = document.getElementById("insertInput");
  if (val.value !== "" && !isNaN(val.value)) {
    sl.insert(Number.parseInt(val.value));
    val.value = ""; // Clear input after insertion
  } else {
    popup(false, "Please enter a valid number to insert.");
  }
});

document.getElementById("btnDelete").addEventListener("click", () => {
  let val = document.getElementById("deleteInput");
  if (val.value !== "" && !isNaN(val.value)) {
    sl.delete(Number.parseInt(val.value));
    val.value = ""; // Clear input after deletion
  } else {
    popup(false, "Please enter a valid number to delete.");
  }
});

document.getElementById("btnSearch").addEventListener("click", () => {
  let val = document.getElementById("searchInput").value;
  if (sl.head === null) {
    popup(false, "Can't search before insertion");
    return;
  }
  if (val !== "" && !isNaN(val)) {
    sl.search(Number.parseInt(val));
    document.getElementById("searchInput").value = ""; // Clear input after search
  } else {
    popup(false, "Please enter a valid number to search.");
  }
});

// Function to display the linked list nodes
function displayNodes() {
  let parent = document.getElementById("linked-list-container");
  parent.innerHTML = "";
  listCount = 0;
  row_num = 0;

  for (let a = 0; a < arr.length; a++) {
    listCount++;
    if (listCount === 1 || listCount === 9) {
      row_num++;
      parent.innerHTML += `<div class="row" id="row${row_num}"></div>`;
    }

    let row = document.getElementById(`row${row_num}`);
    if (!row) {
      console.error(`Row ${row_num} not found.`);
      continue;
    }

    if (a === arr.length - 1) {
      if (row_num % 2 === 1) {
        row.innerHTML += `<div class="item" id="item${a}"><div class="value">${arr[a]}</div><div class="null"><div></div></div></div>`;
      } else {
        row.innerHTML += `<div class="item" id="item${a}"><div class="null"><div></div></div><div class="value">${arr[a]}</div></div>`;
      }
    } else if (listCount > 0 && listCount <= 7) {
      row.innerHTML += `<div class="item" id="item${a}"><div class="value">${arr[a]}</div><div class="link-horizontal"><div></div><div></div></div></div>`;
    } else if (listCount === 8) {
      row.innerHTML += `<div class="item" id="item${a}"><div class="value">${arr[a]}</div><div class="link-vertical"><div></div><div></div></div></div>`;
    } else if (listCount > 8 && listCount <= 15) {
      row.innerHTML += `<div class="item" id="item${a}"><div class="link-horizontal" style="transform: rotate(180deg);"><div></div><div></div></div><div class="value">${arr[a]}</div></div>`;
    } else if (listCount === 16) {
      row.innerHTML += `<div class="item" id="item${a}"><div class="link-vertical"><div></div><div></div></div><div class="value">${arr[a]}</div></div>`;
      listCount = 0;
    }
  }
}

// Ensure the DOM is fully loaded before initializing
document.addEventListener("DOMContentLoaded", () => {
  // Initialize the complexity display
  document.getElementById("time-complexity").innerText = "Time Complexity: ";
  document.getElementById("space-complexity").innerText = "Space Complexity: ";
});
