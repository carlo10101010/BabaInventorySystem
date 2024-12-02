// Function to update the dashboard stats
const updateDashboardStats = async () => {
  try {
    // Fetch data for categories, products, and total sales
    const [categoriesRes, productsRes, salesRes] = await Promise.all([
      fetch('/dashboard/category-count'),
      fetch('/dashboard/product-count'),
      fetch('/dashboard/total-sales') // Fetch the total sales instead of monthly sales
    ]);

    // Check if all responses are successful
    if (!categoriesRes.ok || !productsRes.ok || !salesRes.ok) {
      throw new Error('Failed to fetch one or more dashboard stats');
    }

    // Parse JSON responses
    const categoryData = await categoriesRes.json();
    const productData = await productsRes.json();
    const salesData = await salesRes.json();

    // Update the DOM elements with fetched data
    document.querySelector('#category-count').textContent = categoryData.categoryCount || 'N/A';
    document.querySelector('#product-count').textContent = productData.productCount || 'N/A';
    document.querySelector('#sales-count').textContent = `Php ${salesData.totalSales.toFixed(2) || '0.00'}`; // Display the total sales
  } catch (error) {
    console.error('Error updating dashboard stats:', error);

    // Handle errors by displaying "Error" in each card
    document.querySelector('#category-count').textContent = 'Error';
    document.querySelector('#product-count').textContent = 'Error';
    document.querySelector('#sales-count').textContent = 'Error';
  }
};

// Function to populate the top-selling products table
const populateTopSellingTable = (data) => {
  const tableBody = document.querySelector('.top-selling tbody');
  let totalRevenue = 0;

  // Clear existing rows
  tableBody.innerHTML = '';

  data.forEach(item => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.category}</td>
      <td>${item.totalSold}</td>
      <td>Php ${item.totalRevenue.toFixed(2)}</td>
    `;
    tableBody.appendChild(row);
    totalRevenue += item.totalRevenue;
  });

  // Optional: Display the total revenue for top-selling products
  document.querySelector('#total-revenue').textContent = `Php ${totalRevenue.toFixed(2)}`;
};

// Fetch and display top-selling products on page load
const fetchTopSellingProducts = async () => {
  try {
    const res = await fetch('/dashboard/top-selling-products');
    if (!res.ok) {
      throw new Error('Failed to fetch top-selling products');
    }
    const topSellingProducts = await res.json();
    populateTopSellingTable(topSellingProducts); // Populate the table with fetched data
  } catch (error) {
    console.error('Error fetching top-selling products:', error);
  }
};

// Function to populate the low stock alert table
const populateLowStockAlertTable = (data) => {
  const tableBody = document.querySelector('.low-stock tbody');

  // Clear existing rows
  tableBody.innerHTML = '';

  data.forEach(item => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.category}</td>
      <td>${item.stockRemaining}</td>
      <td>${item.status}</td>
    `;
    tableBody.appendChild(row);
  });
};

// Fetch and display low stock alert products on page load
const fetchLowStockAlert = async () => {
  try {
    const res = await fetch('/dashboard/low-stock-alert');
    if (!res.ok) {
      throw new Error('Failed to fetch low stock alert products');
    }
    const lowStockProducts = await res.json();
    populateLowStockAlertTable(lowStockProducts); // Populate the table with fetched data
  } catch (error) {
    console.error('Error fetching low stock alert products:', error);
  }
};

// Fetch and update the stats when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  updateDashboardStats();
  fetchTopSellingProducts();
  fetchLowStockAlert();
});
