document.addEventListener("DOMContentLoaded", () => {
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
    const category = document.getElementById("category").value;

    if (itemName && unitPrice > 0 && quantity > 0 && category) {
      const total = unitPrice * quantity;
      orderList.push({ name: itemName, price: unitPrice, quantity, total, category });

      // Save to sessionStorage temporarily
      sessionStorage.setItem("currentOrder", JSON.stringify(orderList));

      updateOrderList();

      // Reset form and close modal
      addItemForm.reset();
      modal.style.display = "none";
    }
  });

  // Update order list table and total sales
  function updateOrderList() {
    const orderBody = document.getElementById("order-body");
    const totalAmountElement = document.getElementById("total-amount");
    orderBody.innerHTML = ""; 

    let totalAmount = 0;

    orderList.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.price.toFixed(2)}</td>
        <td>${item.category}</td> <!-- Display category -->
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
        sessionStorage.setItem("currentOrder", JSON.stringify(orderList));
        updateOrderList();
      });
    });
  }

  // Handle the confirm action in POS when the user clicks 'Confirm'
  document.getElementById("confirm-order").addEventListener("click", function () {
    if (orderList.length === 0) {
      alert("No items in the order list to confirm!");
      return;
    }

    // Store the order list to sessionStorage
    sessionStorage.setItem("currentOrder", JSON.stringify(orderList));

    // Optionally, log to the console to confirm it's being stored
    console.log("Order Confirmed and Stored:", orderList);

    alert("Order confirmed and sent to Sales Report!");

    // Clear the current order list in POS after confirmation
    orderList = [];
    updateOrderList();
  });

  // Add an event listener to populate the unit price input and dropdown
  document.getElementById("item-name").addEventListener("change", function () {
    const selectedOption = this.options[this.selectedIndex];
    const unitPrice = selectedOption.getAttribute("data-price");

    // Populate the dropdown with price options
    const unitPriceDropdown = document.getElementById("unit-price-options");
    unitPriceDropdown.innerHTML = `
      <button type="button" class="dropdown-option" data-price="${unitPrice}">${unitPrice}</button>
    `;

    // Update the value of the unit price input when an option is selected
    document.querySelectorAll(".dropdown-option").forEach((button) => {
      button.addEventListener("click", (e) => {
        const price = parseFloat(e.target.getAttribute("data-price"));
        document.getElementById("unit-price").value = price;
        document.getElementById("unit-price-options").style.display = "none";
      });
    });

    document.getElementById("unit-price-dropdown-btn").addEventListener("click", () => {
      const options = document.getElementById("unit-price-options");
      options.style.display = options.style.display === "block" ? "none" : "block";
    });
  });

  document.getElementById("quantity").addEventListener("focus", function () {
    const quantityDropdown = document.getElementById("quantity-dropdown");
    if (quantityDropdown) {
      quantityDropdown.style.display = "none";
    }
  });
});
