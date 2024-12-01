document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal");
    const openModalBtn = document.getElementById("open-modal");
    const closeModalBtn = document.querySelector(".close");
    const addItemForm = document.getElementById("add-item-form");
  
    let orderList = [];
  
    // Open the modal
    openModalBtn.addEventListener("click", () => {
      modal.style.display = "block";
      fetchItems(); // Fetch items when the modal opens
      fetchCategories(); // Fetch categories when the modal opens
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
        const response = await fetch("/api/products"); // Fetch items
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
  
      // Add event listener to update unit price, category, and stock based on selected item
      itemDropdown.addEventListener("change", function () {
        const selectedOption = this.options[this.selectedIndex];
        const unitPrice = selectedOption.getAttribute("data-price");
        const category = selectedOption.getAttribute("data-category");
        const stock = selectedOption.getAttribute("data-stock");
  
        document.getElementById("unit-price").value = unitPrice || "";
        document.getElementById("category").value = category || ""; // Automatically sync the category
        document.getElementById("quantity").placeholder = `Max: ${stock}`; // Set stock as a placeholder
        document.getElementById("quantity").max = stock; // Enforce stock limit
      });
    }
  
    // Fetch categories from the database
    async function fetchCategories() {
      try {
        const response = await fetch("/api/products/categories"); // Fetch categories
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
  
      // Get form values
      const itemDropdown = document.getElementById("item-name");
      const itemName = itemDropdown.options[itemDropdown.selectedIndex].text.trim();
      const itemId = itemDropdown.value;
      const unitPrice = parseFloat(document.getElementById("unit-price").value);
      const quantity = parseInt(document.getElementById("quantity").value);
      const category = document.getElementById("category").value;
  
      // Validate quantity against stock
      const selectedOption = itemDropdown.options[itemDropdown.selectedIndex];
      const stock = parseInt(selectedOption.getAttribute("data-stock"), 10);
      if (quantity > stock) {
        alert(`Quantity cannot exceed available stock (${stock}).`);
        return;
      }
  
      if (itemId && itemName && unitPrice > 0 && quantity > 0 && category) {
        const total = unitPrice * quantity;
        orderList.push({ productId: itemId, name: itemName, price: unitPrice, quantity, total, category });
  
        // Save to sessionStorage temporarily
        sessionStorage.setItem("currentOrder", JSON.stringify(orderList));
  
        updateOrderList();
  
        // Reset form and close modal
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
  });
  