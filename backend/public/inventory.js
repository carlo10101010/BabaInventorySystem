document.addEventListener("DOMContentLoaded", async function () {
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const statusFilter = document.getElementById("statusFilter");
  const addProductBtn = document.getElementById("addProductBtn");
  const productTable = document.getElementById("productTable").getElementsByTagName("tbody")[0];
  const addItemForm = document.getElementById("addItemForm");

  // Fetch categories from the backend
  async function fetchCategories() {
    try {
      const response = await fetch("/api/products/categories");
      const categories = await response.json();
      categoryFilter.innerHTML = '<option value="all">All Categories</option>';
      categories.forEach((category) => {
        categoryFilter.innerHTML += `<option value="${category}">${category}</option>`;
      });
      const categorySelect = document.getElementById("category");
      categorySelect.innerHTML = categories
        .map((category) => `<option value="${category}">${category}</option>`)
        .join("");
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  // Fetch products from the backend
  async function fetchProducts() {
    try {
      const response = await fetch("/api/products");
      const products = await response.json();
      renderTable(products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  // Render the product table
  function renderTable(data) {
    productTable.innerHTML = "";
    data.forEach((product) => {
      const row = productTable.insertRow();
      row.innerHTML = `
        <td>${product.name}</td>
        <td>${product._id}</td>
        <td>${product.category}</td>
        <td>${product.stock}</td>
        <td>${product.threshold}</td>
        <td>${product.status}</td>
        <td>
          <button class="btn btn-success btn-sm restock-btn" data-id="${product._id}">Restock</button>
          <button class="btn btn-warning btn-sm edit-btn" data-id="${product._id}">Edit</button>
          <button class="btn btn-danger btn-sm delete-btn" data-id="${product._id}">Delete</button>
        </td>
      `;
    });

    // Add event listeners for restock, edit, and delete buttons
    const restockButtons = document.querySelectorAll(".restock-btn");
    restockButtons.forEach((button) => {
      button.addEventListener("click", async (e) => {
        const productId = e.target.dataset.id;
        const newStock = prompt("Enter new stock value:");

        if (newStock && !isNaN(newStock)) {
          try {
            const response = await fetch(`/api/products/restock/${productId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ stock: parseInt(newStock) }),
            });

            if (response.ok) {
              alert("Product restocked successfully!");
              await fetchProducts();
            } else {
              alert("Error restocking product.");
            }
          } catch (error) {
            console.error("Error restocking product:", error);
          }
        } else {
          alert("Invalid stock value");
        }
      });
    });

    const editButtons = document.querySelectorAll(".edit-btn");
    editButtons.forEach((button) => {
      button.addEventListener("click", async (e) => {
        const productId = e.target.dataset.id;
        // Here, you could open a modal or pre-fill a form with the current product details for editing
        const product = await fetch(`/api/products/${productId}`).then((res) => res.json());
        const newName = prompt("Enter new product name", product.name);
        const newCategory = prompt("Enter new category", product.category);
        const newStock = prompt("Enter new stock value", product.stock);
        const newThreshold = prompt("Enter new threshold", product.threshold);

        if (newName && newCategory && newStock && newThreshold) {
          try {
            const response = await fetch(`/api/products/${productId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: newName,
                category: newCategory,
                stock: parseInt(newStock),
                threshold: parseInt(newThreshold),
              }),
            });

            if (response.ok) {
              alert("Product updated successfully!");
              await fetchProducts();
            } else {
              alert("Error updating product.");
            }
          } catch (error) {
            console.error("Error updating product:", error);
          }
        } else {
          alert("Please fill out all fields.");
        }
      });
    });

    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", async (e) => {
        const productId = e.target.dataset.id;
        const confirmDelete = confirm("Are you sure you want to delete this product?");
        if (confirmDelete) {
          try {
            const response = await fetch(`/api/products/${productId}`, {
              method: "DELETE",
            });

            if (response.ok) {
              alert("Product deleted successfully!");
              await fetchProducts();
            } else {
              alert("Error deleting product.");
            }
          } catch (error) {
            console.error("Error deleting product:", error);
          }
        }
      });
    });
  }

  // Filter functionality
  async function filterTable() {
    try {
      const response = await fetch("/api/products");
      let products = await response.json();

      const searchValue = searchInput.value.toLowerCase();
      const selectedCategory = categoryFilter.value;
      const selectedStatus = statusFilter.value;

      products = products.filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(searchValue) || product._id.includes(searchValue);
        const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
        const matchesStatus = selectedStatus === "all" || product.status === selectedStatus;
        return matchesSearch && matchesCategory && matchesStatus;
      });

      renderTable(products);
    } catch (error) {
      console.error("Error filtering table:", error);
    }
  }

  // Add product
  addItemForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const productName = document.getElementById("productName").value.trim();
    const category = document.getElementById("category").value.trim();
    const stock = parseInt(document.getElementById("stock").value, 10);
    const threshold = parseInt(document.getElementById("threshold").value, 10);

    if (!productName || !category || isNaN(stock) || isNaN(threshold)) {
      alert("Please fill out all fields correctly.");
      return;
    }

    const newProduct = {
      name: productName,
      category: category,
      stock: stock,
      threshold: threshold,
      status: stock > threshold ? "In Stock" : stock === 0 ? "Out of Stock" : "Low Stock",
    };

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        await fetchProducts();
        addItemForm.reset();
        bootstrap.Modal.getInstance(document.getElementById("addItemModal")).hide();
      } else {
        console.error("Error adding product:", await response.text());
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  });

  // Event listeners
  searchInput.addEventListener("input", filterTable);
  categoryFilter.addEventListener("change", filterTable);
  statusFilter.addEventListener("change", filterTable);

  // Initialize the page
  await fetchCategories();
  await fetchProducts();
});