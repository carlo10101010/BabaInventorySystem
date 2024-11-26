document.addEventListener("DOMContentLoaded", () => {
    const addItemForm = document.getElementById("addItemForm");
    const tableBody = document.querySelector("tbody");
    const searchBar = document.getElementById("searchInput");

    let editingRow = null;
    let productIdCounter = 1; // Start product ID counter

    // Add new product or edit existing product
    addItemForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const productName = document.getElementById("productName").value.trim();
        const category = document.getElementById("category").value;
        const stock = parseInt(document.getElementById("stock").value.trim(), 10);
        const threshold = parseInt(document.getElementById("threshold").value.trim(), 10);

        if (!productName || isNaN(stock) || !category || isNaN(threshold)) {
            alert("Please fill in all fields correctly.");
            return;
        }

        const status = getStatus(stock, threshold);

        // If editing an existing row
        if (editingRow) {
            updateRow(editingRow, productName, category, stock, threshold, status);
            editingRow = null; // Reset the editingRow to null after editing
        } else {
            // Generate a new Product ID
            const productID = generateProductID();

            // Add a new product row
            const newRow = createNewRow(productName, productID, category, stock, threshold, status);
            tableBody.appendChild(newRow);
            attachRowEventListeners(newRow); // Attach event listeners to the new row's buttons
        }

        // Close the modal after form submission
        const modal = bootstrap.Modal.getInstance(document.getElementById("addItemModal"));
        modal.hide();

        // Reset form for the next entry or edit
        addItemForm.reset();
    });

    // Show modal when Add New Product button is clicked
    document.getElementById('addProductBtn').addEventListener('click', () => {
        const modal = new bootstrap.Modal(document.getElementById('addItemModal'));
        modal.show();
    });

    // Search functionality
    searchBar.addEventListener("input", () => {
        const searchTerm = searchBar.value.toLowerCase();
        const rows = tableBody.getElementsByTagName("tr");

        Array.from(rows).forEach((row) => {
            const cells = row.getElementsByTagName("td");
            const rowText = Array.from(cells).map(cell => cell.textContent.toLowerCase()).join(" ");
            row.style.display = rowText.includes(searchTerm) ? "" : "none";
        });
    });

    // Function to create a new row
    function createNewRow(productName, productID, category, stock, threshold, status) {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${productName}</td>
            <td>${productID}</td>
            <td>${category}</td>
            <td>${stock}</td>
            <td>${threshold}</td>
            <td>${status}</td>
            <td>
                <button class="btn btn-success btn-sm restock-btn">Restock</button>
                <button class="btn btn-warning btn-sm edit-btn">Edit</button>
                <button class="btn btn-danger btn-sm delete-btn">Delete</button>
            </td>
        `;
        return newRow;
    }

    // Generate a unique Product ID
    function generateProductID() {
        const id = productIdCounter.toString().padStart(3, '0'); // Format as 3-digit ID
        productIdCounter++;
        return id;
    }

    // Function to update an existing row
    function updateRow(row, productName, category, stock, threshold, status) {
        row.children[0].textContent = productName;
        row.children[2].textContent = category;
        row.children[3].textContent = stock;
        row.children[4].textContent = threshold;
        row.children[5].textContent = status;
    }

    // Attach event listeners to row buttons (Restock, Edit, Delete)
    function attachRowEventListeners(row) {
        const restockBtn = row.querySelector(".restock-btn");
        const editBtn = row.querySelector(".edit-btn");
        const deleteBtn = row.querySelector(".delete-btn");

        // Restock functionality
        restockBtn.addEventListener("click", () => {
            const stockCell = row.children[3];
            let currentStock = parseInt(stockCell.textContent, 10);
            currentStock += 10; // Increment stock by 10
            stockCell.textContent = currentStock;

            const thresholdCell = row.children[4];
            const statusCell = row.children[5];
            statusCell.textContent = getStatus(currentStock, parseInt(thresholdCell.textContent, 10));
        });

        // Edit functionality
        editBtn.addEventListener("click", () => {
            // Store the row being edited
            editingRow = row;

            // Pre-fill modal with existing row data
            document.getElementById("productName").value = row.children[0].textContent.trim();
            document.getElementById("category").value = row.children[2].textContent.trim();
            document.getElementById("stock").value = parseInt(row.children[3].textContent.trim(), 10);
            document.getElementById("threshold").value = parseInt(row.children[4].textContent.trim(), 10);

            // Show modal to edit product
            const modal = new bootstrap.Modal(document.getElementById("addItemModal"));
            modal.show();
        });

        // Delete functionality
        deleteBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to delete this product?")) {
                row.remove();
            }
        });
    }

    // Determine status based on stock and threshold
    function getStatus(stock, threshold) {
        if (stock === 0) {
            return "Out of Stock";
        } else if (stock <= threshold) {
            return "Low Stock";
        } else {
            return "In Stock";
        }
    }

    // Attach event listeners to existing rows on page load
    Array.from(tableBody.querySelectorAll("tr")).forEach(attachRowEventListeners);
});
