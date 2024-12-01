document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal");
  const openModalBtn = document.getElementById("open-modal");
  const closeModalBtn = document.querySelector(".close");
  const addItemForm = document.getElementById("add-item-form");
  const confirmOrderBtn = document.getElementById("confirm-order");

  let orderList = [];

  // Open the modal
  openModalBtn.addEventListener("click", () => {
    modal.style.display = "block";
    fetchItems();
    fetchCategories();
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

  // Fetch items from the database
  async function fetchItems() {
    try {
      const response = await fetch("/api/products");
      const items = await response.json();
      populateItemDropdown(items);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  }

  // Populate item dropdown with database items
  function populateItemDropdown(items) {
    const itemDropdown = document.getElementById("item-name");
    itemDropdown.innerHTML = `<option value="" disabled selected>Select an item</option>`;
    items.forEach((item) => {
      itemDropdown.innerHTML += `
        <option value="${item._id}" data-price="${item.price}" data-category="${item.category}" data-stock="${item.stock}">${item.name}</option>`;
    });

    itemDropdown.addEventListener("change", function () {
      const selectedOption = this.options[this.selectedIndex];
      const unitPrice = selectedOption.getAttribute("data-price");
      const category = selectedOption.getAttribute("data-category");
      const stock = selectedOption.getAttribute("data-stock");

      document.getElementById("unit-price").value = unitPrice || "";
      document.getElementById("category").value = category || "";
      document.getElementById("quantity").placeholder = `Max: ${stock}`;
      document.getElementById("quantity").max = stock;
    });
  }

  // Fetch categories from the database
  async function fetchCategories() {
    try {
      const response = await fetch("/api/products/categories");
      const categories = await response.json();
      populateCategoryDropdown(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  // Populate category dropdown with database categories
  function populateCategoryDropdown(categories) {
    const categoryDropdown = document.getElementById("category");
    categoryDropdown.innerHTML = `<option value="" disabled selected>Select a category</option>`;
    categories.forEach((category) => {
      categoryDropdown.innerHTML += `<option value="${category}">${category}</option>`;
    });
  }

  // Handle adding items to the list
  addItemForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const itemDropdown = document.getElementById("item-name");
    const itemName = itemDropdown.options[itemDropdown.selectedIndex].text.trim();
    const itemId = itemDropdown.value;
    const unitPrice = parseFloat(document.getElementById("unit-price").value);
    const quantity = parseInt(document.getElementById("quantity").value);
    const category = document.getElementById("category").value;

    const selectedOption = itemDropdown.options[itemDropdown.selectedIndex];
    const stock = parseInt(selectedOption.getAttribute("data-stock"), 10);
    if (quantity > stock) {
      alert(`Quantity cannot exceed available stock (${stock}).`);
      return;
    }

    if (itemId && itemName && unitPrice > 0 && quantity > 0 && category) {
      const total = unitPrice * quantity;
      orderList.push({ productId: itemId, name: itemName, price: unitPrice, quantity, total, category });
      sessionStorage.setItem("currentOrder", JSON.stringify(orderList));
      updateOrderList();
      addItemForm.reset();
      modal.style.display = "none";
    } else {
      alert("Please fill out all fields correctly.");
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
        <td>${item.category}</td>
        <td>${item.quantity}</td>
        <td>${item.total.toFixed(2)}</td>
        <td><button class="delete-btn" data-index="${index}">Delete</button></td>
      `;
      orderBody.appendChild(row);
      totalAmount += item.total;
    });

    totalAmountElement.textContent = totalAmount.toFixed(2);

    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const index = e.target.getAttribute("data-index");
        orderList.splice(index, 1);
        sessionStorage.setItem("currentOrder", JSON.stringify(orderList));
        updateOrderList();
      });
    });
  }

  // Confirm order and submit details to the database
  confirmOrderBtn.addEventListener("click", async () => {
    if (orderList.length === 0) {
      alert("No items in the order list to confirm!");
      return;
    }

    try {
      const response = await fetch("/api/sales/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderList }),
      });

      if (response.ok) {
        alert("Order confirmed and recorded in the database!");
        orderList = [];
        sessionStorage.removeItem("currentOrder");
        updateOrderList();
      } else {
        const errorData = await response.json();
        alert(`Error confirming order: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      alert("An error occurred while confirming the order.");
    }
  });
});
