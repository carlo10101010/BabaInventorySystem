let salesData = []; // Store the fetched sales data globally

// Function to populate the sales report table
function populateTable(data) {
    const tableBody = document.querySelector('tbody');
    let totalSales = 0;

    // Clear existing rows
    tableBody.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${item.name}</td>  <!-- Using the name of the product -->
            <td>${item.productId ? item.productId._id : 'N/A'}</td> <!-- Display product ID or 'N/A' if not available -->
            <td>${item.category}</td>
            <td>${item.quantity}</td>
            <td>${item.total.toFixed(2)}</td>
            <td>${new Date(item.date).toLocaleDateString()}</td> <!-- Formatting the date -->
        `;
        tableBody.appendChild(row);
        totalSales += item.total;
    });

    // Update total sales
    document.getElementById('total-sales').textContent = totalSales.toFixed(2);
}

// Function to populate category filter dropdown
function populateCategories(data) {
    const categories = new Set(data.map(item => item.category));
    const categorySelect = document.getElementById('category');
    
    // Adding a default category option
    const defaultOption = document.createElement('option');
    defaultOption.value = '- Select Category -';
    defaultOption.textContent = '- Select Category -';
    categorySelect.appendChild(defaultOption);

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

// Function to filter the table by selected category
function filterByCategory() {
    const selectedCategory = document.getElementById('category').value;
    const filteredData = selectedCategory === '- Select Category -'
        ? salesData
        : salesData.filter(item => item.category === selectedCategory);
    populateTable(filteredData);
}

// Initialize table and category filter
document.addEventListener('DOMContentLoaded', () => {
    // Fetch sales data from backend
    fetch('/api/sales')
        .then(response => response.json())
        .then(data => {
            salesData = data; // Store the fetched sales data globally
            populateTable(data); // Populate table with the fetched sales data
            populateCategories(data); // Populate category filter dropdown
        })
        .catch(error => console.error('Error fetching sales data:', error));

    // Event listener for category change
    document.getElementById('category').addEventListener('change', filterByCategory);
});
