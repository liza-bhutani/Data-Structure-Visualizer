let deq = null;
let isEqual = false;
let togg = 0;

class DEQueue {
  constructor(s) {
    this.dequeue = [];
    this.size = s;
    this.frontIndex = Number.parseInt(-1);
    this.rearIndex = Number.parseInt(-1);
    popup(true, "Created new queue");
    this.displayComplexity();
  }

  insertFront(data) {
    if (this.frontIndex == 0) {
      popup(false, "Queue overflow");
      return;
    }
    if (this.frontIndex == -1) {
      popup(false, "Empty Queue");
      return;
    }
    this.dequeue.unshift(data);
    this.frontIndex--;
    setInsertFirst(this.frontIndex + 1, data);
    this.displayComplexity();
  }

  insertLast(data) {
    if (this.rearIndex == this.size - 1) {
      popup(false, "Queue Overflow");
      return;
    }

    this.rearIndex++;
    if (this.frontIndex == -1) {
      this.frontIndex = 0;
    }
    this.dequeue.push(data);
    setInsertLast(this.rearIndex + 1, data);
    this.displayComplexity();
  }

  deleteFront() {
    if (this.frontIndex == this.rearIndex + 1 || this.frontIndex == -1) {
      popup(false, "Queue Underflow");
      return;
    }
    if (this.frontIndex == this.rearIndex) {
      document.getElementById("both").remove();
      document.getElementById(`item${this.frontIndex + 1}`).innerHTML = "";
      this.dequeue.shift();
      this.frontIndex = -1;
      this.rearIndex = -1;
      this.displayComplexity();
      return;
    }
    this.frontIndex++;
    this.dequeue.shift();
    setDeleteFirst(this.frontIndex + 1, this.dequeue[0]);
    this.displayComplexity();
  }

  deleteLast() {
    if (this.rearIndex == -1) {
      popup(false, "Can't delete from empty queue");
      return;
    }
    if (this.rearIndex == this.frontIndex) {
      document.getElementById("both").remove();
      document.getElementById(`item${this.frontIndex + 1}`).innerHTML = "";
      this.dequeue.pop();
      this.frontIndex = -1;
      this.rearIndex = -1;
      this.displayComplexity();
      return;
    }
    this.dequeue.pop();
    this.rearIndex--;
    setDeleteLast(this.rearIndex + 1, this.dequeue[this.dequeue.length - 1]);
    this.displayComplexity();
  }

  displayComplexity() {
    // Time complexity for insertions and deletions
    let timeComplexity = "O(1)";
    
    // Space complexity
    let spaceComplexity = `O(${this.dequeue.length})`;

    // Display time and space complexity
    document.getElementById("complexity").innerHTML = `
      <strong>Time Complexity:</strong> ${timeComplexity} <br><br>
      <strong>Space Complexity:</strong> ${spaceComplexity}
    `;
  }
}

// Queue implementation

// Onload code for item background colors
for (let t = 1; t <= 40; t++) {
  if (t % 4 == 0) {
    document.getElementById(`item${t}`).style.backgroundColor = "yellow";
  } else if (t % 3 == 0) {
    document.getElementById(`item${t}`).style.backgroundColor = "lightblue";
  } else if (t % 2 == 0) {
    document.getElementById(`item${t}`).style.backgroundColor = "pink";
  } else {
    document.getElementById(`item${t}`).style.backgroundColor = "lightgreen";
  }
}

// Event listeners for button actions
document.getElementById("btnSize").addEventListener("click", () => {
  let val = Number.parseInt(document.getElementById("inputSize").value);
  if (val >= 5 && val <= 40) {
    if (deq === null) {
      displayQueue(40, "none");
      deq = new DEQueue(val);
      displayQueue(val, "flex");
    } else {
      if (confirm("Are you sure to create new queue?")) {
        deq = null;
        for (let a = 1; a <= 40; a++) {
          document.getElementById(`item${a}`).innerHTML = "";
        }
        document.getElementById("btnSize").click();
      }
    }
  } else {
    popup(false, "Size must be between 5 and 40.");
  }
});

document.getElementById("btnEnq").addEventListener("click", () => {
  let val = document.getElementById("inputEnq").value;
  if (val != "") {
    if (togg == 1) {
      deq.insertFront(Number.parseInt(val));
    } else {
      deq.insertLast(Number.parseInt(val));
    }
  }
  // document.getElementById("inputEnq").value = "";
});

document.getElementById("btnDeq").addEventListener("click", () => {
  if (togg == 1) {
    deq.deleteFront();
  } else {
    deq.deleteLast();
  }
});

function displayQueue(id, value) {
  for (let v = 1; v <= id; v++) {
    document.getElementById(`item${v}`).style.display = value;
  }
}

document.getElementById("togg").addEventListener("click", () => {
  togg = togg == 0 ? 1 : 0;
});

function setInsertLast(id, val) {
  if (id != 1) {
    document.getElementById("rear").remove();
  }
  let parent = document.getElementById(`item${id}`);
  if (deq.frontIndex == deq.rearIndex) {
    parent.innerHTML = `${val}<div class="both" id="both"><div class="innerboth" id="front">front</div><div class="innerboth" id="rear">rear</div></div>`;
    isEqual = true;
  } else {
    if (isEqual == true) {
      document.getElementById(
        `item${deq.frontIndex + 1}`
      ).innerHTML = `${deq.dequeue[0]}<div class='position' id='front'>front</div>`;
      isEqual = false;
    }
    parent.innerHTML = `${val}<div class='position' id='rear'>rear</div>`;
  }
}

function setInsertFirst(id, val) {
  document.getElementById("front").remove();

  let parent = document.getElementById(`item${id}`);

  if (isEqual == true) {
    document.getElementById(
      `item${id + 1}`
    ).innerHTML = `${deq.dequeue[1]}<div class='position' id='rear'>rear</div>`;
    isEqual = false;
  }
  parent.innerHTML = `${val}<div class='position' id='front'>front</div>`;
}

function setDeleteLast(id, val) {
  document.getElementById("rear").remove();
  document.getElementById(`item${id + 1}`).innerHTML = "";
  let parent = document.getElementById(`item${id}`);

  if (deq.frontIndex === deq.rearIndex) {
    isEqual=true;
    parent.innerHTML = `${val}<div class="both" id="both"><div class="innerboth" id="front">front</div><div class="innerboth" id="rear">rear</div></div>`;
  } else {
    parent.innerHTML = `${val}<div class='position' id='rear'>rear</div>`;
  }
}
function setDeleteFirst(id, val) {
  document.getElementById("front").remove();
  let parent = document.getElementById(`item${id}`);

  document.getElementById(`item${id - 1}`).innerHTML = "";
  if (deq.frontIndex === deq.rearIndex) {
    isEqual=true;
    parent.innerHTML = `${val}<div class="both" id="both"><div class="innerboth" id="front">front</div><div class="innerboth" id="rear">rear</div></div>`;
  } else {
    parent.innerHTML = `${val}<div class='position' id='front'>front</div>`;
  }
}

function popup(isSuccess, msg) {
  let popupDiv = document.createElement("div");
  popupDiv.className = "popup";
  if (isSuccess) {
    popupDiv.innerHTML = `<div class='success'>${msg}</div>`;
  } else {
    popupDiv.innerHTML = `<div class='error'>${msg}</div>`;
  }
  document.body.appendChild(popupDiv);
  setTimeout(() => {
    popupDiv.remove();
  }, 2000);
}
