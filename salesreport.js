document.addEventListener("DOMContentLoaded", function () {
    const salesTableBody = document.querySelector("tbody");
    const totalSalesElement = document.getElementById("total-sales");
  
    // Clear any existing data before loading the new data
    salesTableBody.innerHTML = '';
  
    // Retrieve the stored sales data from sessionStorage
    const sessionData = JSON.parse(sessionStorage.getItem("currentOrder")) || [];
  
    let totalSales = 0;
  
    // If there are items in sessionStorage, populate the Sales Report table
    if (sessionData.length > 0) {
      sessionData.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${item.name}</td>
          <td>${generateProductID(index)}</td>
          <td>${item.category}</td> <!-- Category is now placed before Quantity -->
          <td>${item.quantity}</td> <!-- Quantity column -->
          <td>${item.total.toFixed(2)}</td>
          <td>${item.date || new Date().toLocaleDateString()}</td>
        `;
        salesTableBody.appendChild(row);
  
        // Add to the total sales amount
        totalSales += item.total;
      });
    } else {
      // If no data is present, display a message
      salesTableBody.innerHTML = `<tr><td colspan="6">No sales data available</td></tr>`;
    }
  
    // Display the total sales
    totalSalesElement.textContent = totalSales.toFixed(2);
});
  
// Utility function to generate a Product ID
function generateProductID(index) {
    return `PROD-${Date.now()}-${index}`;
}
