// Modal functionality
const modal = document.getElementById("modal");
const openModalBtn = document.getElementById("open-modal");
const closeModalBtn = document.querySelector(".close");
const addItemForm = document.getElementById("add-item-form");

let orderList = [];

// Open the modal
openModalBtn.addEventListener("click", () => {
  modal.style.display = "block";
});

// Close the modal
closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Close modal when clicking outside of modal content
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// Handle adding items to the list
addItemForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get form values
  const itemName = document.getElementById("item-name").value.trim();
  const unitPrice = parseFloat(document.getElementById("unit-price").value);
  const quantity = parseInt(document.getElementById("quantity").value);

  if (itemName && unitPrice > 0 && quantity > 0) {
    const total = unitPrice * quantity;
    orderList.push({ name: itemName, price: unitPrice, quantity, total });
    updateOrderList();

    // Reset form and close modal
    addItemForm.reset();
    modal.style.display = "none";
  }
});

// Update order list table
function updateOrderList() {
  const orderBody = document.getElementById("order-body");
  const totalAmountElement = document.getElementById("total-amount");
  orderBody.innerHTML = ""; // Clear existing rows

  let totalAmount = 0;

  orderList.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.price.toFixed(2)}</td>
      <td>${item.quantity}</td>
      <td>${item.total.toFixed(2)}</td>
      <td><button class="delete-btn" data-index="${index}">Delete</button></td>
    `;
    orderBody.appendChild(row);
    totalAmount += item.total;
  });

  totalAmountElement.textContent = totalAmount.toFixed(2);

  // Attach delete functionality
  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      orderList.splice(index, 1);
      updateOrderList();
    });
  });
}
