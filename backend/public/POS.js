const apiUrl = 'http://localhost:3000/api';
const itemCategorySelect = document.getElementById('item-name'); // Dropdown for categories
const unitPriceInput = document.getElementById('unit-price');
const quantityInput = document.getElementById('quantity');
const addToListButton = document.getElementById('add-to-list');
const orderBody = document.getElementById('order-body');
const totalAmountElement = document.getElementById('total-amount');

let orderList = [];

async function fetchCategories() {
  try {
    const response = await fetch(`${apiUrl}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');

    const categories = await response.json();
    itemCategorySelect.innerHTML = '';  // Clear previous options
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category; // Set category name as the value
      option.textContent = category; // Display category in dropdown
      itemCategorySelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    alert('Failed to load categories.');
  }
}

// Function to fetch products based on selected category
async function fetchProductsByCategory(category) {
  try {
    const response = await fetch(`${apiUrl}/products?category=${category}`);
    if (!response.ok) throw new Error('Failed to fetch products');

    const products = await response.json();
    const productDropdown = document.getElementById('product-dropdown'); // Make sure you have a dropdown for products
    productDropdown.innerHTML = ''; // Clear previous products

    products.forEach(product => {
      const option = document.createElement('option');
      option.value = product._id;
      option.textContent = product.productName;
      option.dataset.price = product.price || 0;
      productDropdown.appendChild(option);
    });

    if (products.length > 0) {
      unitPriceInput.value = products[0].price || 0;
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    alert('Failed to load products.');
  }
}

// Event listener for category selection to load respective products
itemCategorySelect.addEventListener('change', (e) => {
  const selectedCategory = e.target.value;
  if (selectedCategory) {
    fetchProductsByCategory(selectedCategory); // Fetch products when a category is selected
  }
});

// Add item to the order list
addToListButton.addEventListener('click', () => {
  const selectedOption = document.getElementById('product-dropdown').selectedOptions[0]; // Get selected product
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

// Render the order list
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

  // Handle delete button for each item
  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      orderList.splice(index, 1);
      renderOrderList();
    });
  });
}

// Initialize category fetch on page load
document.addEventListener('DOMContentLoaded', fetchCategories);
