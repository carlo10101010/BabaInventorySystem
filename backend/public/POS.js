const apiUrl = 'http://localhost:3000/api'; // Backend API base URL

document.addEventListener('DOMContentLoaded', () => {
  const itemNameSelect = document.getElementById('item-name');
  const unitPriceInput = document.getElementById('unit-price');
  const quantityInput = document.getElementById('quantity');
  const addToListButton = document.getElementById('add-to-list');
  const orderBody = document.getElementById('order-body');
  const totalAmountElement = document.getElementById('total-amount');

  let orderList = []; // Tracks current order items

  // Fetch products from the backend and populate the item dropdown
  async function fetchProducts() {
    try {
      const response = await fetch(`${apiUrl}/products`);
      const products = await response.json();
      products.forEach(product => {
        const option = document.createElement('option');
        option.value = product._id; // Using product ID as the value
        option.textContent = product.productName; // Display product name in the dropdown
        option.dataset.price = product.price || 0; // Assuming you might add price field to products
        itemNameSelect.appendChild(option);
      });

      // Set default price for the first product if available
      if (products.length > 0) {
        unitPriceInput.value = products[0].price || 0;
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  // Update unit price when a product is selected
  itemNameSelect.addEventListener('change', (e) => {
    const selectedOption = e.target.selectedOptions[0];
    unitPriceInput.value = selectedOption.dataset.price || 0;
  });

  // Add item to the order list
  addToListButton.addEventListener('click', () => {
    const selectedOption = itemNameSelect.selectedOptions[0];
    const itemName = selectedOption.textContent;
    const unitPrice = parseFloat(unitPriceInput.value);
    const quantity = parseInt(quantityInput.value);

    if (!itemName || isNaN(unitPrice) || isNaN(quantity) || quantity <= 0) {
      alert('Please fill out all fields correctly.');
      return;
    }

    const orderItem = {
      name: itemName,
      unitPrice,
      quantity,
      total: unitPrice * quantity,
    };

    orderList.push(orderItem);
    renderOrderList();
  });

  // Render the order list and calculate the total amount
  function renderOrderList() {
    orderBody.innerHTML = '';
    let totalAmount = 0;

    orderList.forEach((item, index) => {
      totalAmount += item.total;
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.name}</td>
        <td>$${item.unitPrice.toFixed(2)}</td>
        <td>${item.quantity}</td>
        <td>$${item.total.toFixed(2)}</td>
        <td><button class="delete-btn" data-index="${index}">Delete</button></td>
      `;
      orderBody.appendChild(row);
    });

    totalAmountElement.textContent = totalAmount.toFixed(2);

    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const index = e.target.dataset.index;
        orderList.splice(index, 1);
        renderOrderList();
      });
    });
  }

  fetchProducts(); // Initialize product list
});
