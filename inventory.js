// Modal Elements
const addProductModal = document.getElementById("addProductModal");
const editProductModal = document.getElementById("editProductModal");
const deleteProductModal = document.getElementById("deleteProductModal");

const closeModalButtons = document.querySelectorAll(".close-btn");

// Open Add Product Modal
document.getElementById("addProductBtn").addEventListener("click", () => {
  addProductModal.style.display = "block";
});

// Close All Modals
closeModalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    addProductModal.style.display = "none";
    editProductModal.style.display = "none";
    deleteProductModal.style.display = "none";
  });
});

// Dynamic Product Table Handling
const productTable = document.querySelector("#productTable tbody");
let currentEditRow = null;

// Add Product
document.getElementById("addProductForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("addProductName").value;
  const category = document.getElementById("addCategory").value;
  const price = document.getElementById("addPrice").value;
  const stock = document.getElementById("addStock").value;
  const threshold = document.getElementById("addThreshold").value;

  const newRow = `
    <tr>
      <td>${name}</td>
      <td>${Date.now()}</td>
      <td>${category}</td>
      <td>${stock}</td>
      <td>${threshold}</td>
      <td>${stock <= threshold ? "Low Stock" : "In Stock"}</td>
      <td>
        <button class="editBtn">Edit</button>
        <button class="deleteBtn">Delete</button>
      </td>
    </tr>
  `;
  productTable.insertAdjacentHTML("beforeend", newRow);
  addProductModal.style.display = "none";
});

// Edit Product
productTable.addEventListener("click", (e) => {
  if (e.target.classList.contains("editBtn")) {
    currentEditRow = e.target.closest("tr");
    const cells = currentEditRow.children;

    document.getElementById("editProductName").value = cells[0].textContent;
    document.getElementById("editCategory").value = cells[2].textContent.toLowerCase();
    document.getElementById("editPrice").value = parseFloat(cells[3].textContent);
    document.getElementById("editStock").value = parseInt(cells[4].textContent);
    document.getElementById("editThreshold").value = parseInt(cells[5].textContent);

    editProductModal.style.display = "block";
  }
});

document.getElementById("editProductForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("editProductName").value;
  const category = document.getElementById("editCategory").value;
  const stock = document.getElementById("editStock").value;
  const threshold = document.getElementById("editThreshold").value;

  currentEditRow.children[0].textContent = name;
  currentEditRow.children[2].textContent = category;
  currentEditRow.children[3].textContent = stock;
  currentEditRow.children[4].textContent = threshold;
  currentEditRow.children[5].textContent = stock <= threshold ? "Low Stock" : "In Stock";

  editProductModal.style.display = "none";
});

// Delete Product
productTable.addEventListener("click", (e) => {
  if (e.target.classList.contains("deleteBtn")) {
    deleteProductModal.style.display = "block";
    const rowToDelete = e.target.closest("tr");

    document.getElementById("confirmDelete").onclick = () => {
      rowToDelete.remove();
      deleteProductModal.style.display = "none";
    };
  }
});
