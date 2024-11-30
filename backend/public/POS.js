document.addEventListener('DOMContentLoaded', function () {
  const openModalButton = document.getElementById('open-modal');
  const modal = document.getElementById('modal');
  const closeModalButton = modal.querySelector('.close');
  const addItemForm = document.getElementById('addItemForm');
  const orderTableBody = document.getElementById('order-body');
  const totalAmountElement = document.getElementById('total-amount');
  const confirmOrderButton = document.getElementById('confirm-order');

  let orderList = [];
  let totalAmount = 0;

  openModalButton.addEventListener('click', function () {
    modal.style.display = 'block';
  });

  closeModalButton.addEventListener('click', function () {
    modal.style.display = 'none';
  });

  window.addEventListener('click', function (event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  addItemForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const category = document.getElementById('category').value;
    const unitPrice = parseFloat(document.getElementById('unit-price').value);
    const quantity = parseInt(document.getElementById('quantity').value);

    if (!category || isNaN(unitPrice) || isNaN(quantity)) {
      alert('Please fill all fields correctly.');
      return;
    }

    const total = unitPrice * quantity;

    const orderItem = {
      category,
      unitPrice,
      quantity,
      total
    };

    orderList.push(orderItem);
    updateOrderTable();
    updateTotalAmount();

    addItemForm.reset();
    modal.style.display = 'none';
  });

  function updateOrderTable() {
    orderTableBody.innerHTML = '';

    orderList.forEach((item, index) => {
      const row = document.createElement('tr');

      row.innerHTML = `
        <td>${item.category}</td>
        <td>${item.unitPrice.toFixed(2)}</td>
        <td>${item.quantity}</td>
        <td>${item.total.toFixed(2)}</td>
        <td><button class="remove-item" data-index="${index}">Remove</button></td>
      `;

      row.querySelector('.remove-item').addEventListener('click', function () {
        const indexToRemove = parseInt(this.getAttribute('data-index'));
        removeItemFromOrder(indexToRemove);
      });

      orderTableBody.appendChild(row);
    });
  }

  function updateTotalAmount() {
    totalAmount = orderList.reduce((sum, item) => sum + item.total, 0);
    totalAmountElement.textContent = totalAmount.toFixed(2);
  }

  function removeItemFromOrder(index) {
    orderList.splice(index, 1);
    updateOrderTable();
    updateTotalAmount();
  }

  confirmOrderButton.addEventListener('click', function () {
    if (orderList.length === 0) {
      alert('No items in the order to confirm!');
      return;
    }

    alert('Order confirmed. Total Amount: ' + totalAmount.toFixed(2));
    orderList = [];
    updateOrderTable();
    updateTotalAmount();
  });
});
