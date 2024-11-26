let currentPage = 1; // Tracks the current page
const rowsPerPage = 10; // Number of rows per page
let allSalesData = []; // Stores all fetched sales data (unfiltered)
let filteredSalesData = []; // Stores sales data after filtering

// Fetch all sales data from the server
async function fetchSalesData() {
    try {
        const response = await fetch('http://localhost:3000/api/sales');
        if (response.ok) {
            allSalesData = await response.json(); // Save all sales data
            filteredSalesData = allSalesData; // Initialize filtered data
            updateSalesTable(); // Update table with all sales
            updatePagination(); // Initialize pagination
        } else {
            console.error('Error fetching sales data');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Populate the sales table with data for the current page
function updateSalesTable() {
    const tableBody = document.querySelector('#salesTable tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    // Determine the slice of data for the current page
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedSales = filteredSalesData.slice(start, end);

    // Add rows to the table
    paginatedSales.forEach(sale => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.productName}</td>
            <td>${sale.productID}</td>
            <td>${sale.productSold}</td>
            <td>${sale.category}</td>
            <td>${new Date(sale.date).toLocaleDateString()}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Update pagination controls and page indicator
function updatePagination() {
    const totalPages = Math.ceil(filteredSalesData.length / rowsPerPage);

    // Update the page indicator
    const pageIndicator = document.getElementById('pageIndicator');
    pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;

    // Enable/disable navigation buttons
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages || totalPages === 0;
}

// Handle Previous button click
document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        updateSalesTable();
        updatePagination();
    }
});

// Handle Next button click
document.getElementById('nextPage').addEventListener('click', () => {
    const totalPages = Math.ceil(filteredSalesData.length / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        updateSalesTable();
        updatePagination();
    }
});

// Filter sales by category and reset pagination
function filterTableByCategory() {
    const selectedCategory = document.getElementById('category').value;

    // Filter sales data based on selected category
    if (selectedCategory === "") {
        filteredSalesData = allSalesData; // No filter, show all data
    } else {
        filteredSalesData = allSalesData.filter(sale => sale.category === selectedCategory);
    }

    currentPage = 1; // Reset to the first page after filtering
    updateSalesTable(); // Update table with filtered data
    updatePagination(); // Update pagination
}

// Event listener for category dropdown change
document.getElementById('category').addEventListener('change', filterTableByCategory);

// Initial data fetch on page load
document.addEventListener('DOMContentLoaded', fetchSalesData);
