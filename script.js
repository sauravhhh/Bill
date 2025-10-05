document.addEventListener('DOMContentLoaded', function() {
    const formContainer = document.querySelector('.form-container');
    const previewContainer = document.querySelector('.preview-container');
    const previewBtn = document.getElementById('previewBtn');
    const editBtn = document.getElementById('editBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const resetBtn = document.getElementById('resetBtn');
    const addItemBtn = document.getElementById('addItemBtn');
    const itemsContainer = document.getElementById('itemsContainer');
    const logoUpload = document.getElementById('logoUpload');
    const logoPreview = document.getElementById('logoPreview');
    
    // Set today's date as default
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    document.getElementById('invoiceDate').value = formattedToday;
    
    // Logo upload functionality
    logoUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                logoPreview.innerHTML = `<img src="${event.target.result}" alt="Logo Preview">`;
            };
            reader.readAsDataURL(file);
        } else {
            logoPreview.innerHTML = '<i class="fas fa-image text-muted"></i>';
        }
    });
    
    // Add item functionality
    addItemBtn.addEventListener('click', function() {
        const newItemRow = document.createElement('div');
        newItemRow.className = 'item-row';
        newItemRow.innerHTML = `
            <div class="item-input">
                <div class="row">
                    <div class="col-md-4 mb-2">
                        <input type="text" class="form-control item-name" placeholder="Item Name">
                    </div>
                    <div class="col-md-2 mb-2">
                        <input type="number" class="form-control item-qty" placeholder="Qty" min="1" value="1">
                    </div>
                    <div class="col-md-2 mb-2">
                        <input type="number" class="form-control item-price" placeholder="Price" step="0.01" min="0">
                    </div>
                    <div class="col-md-2 mb-2">
                        <select class="form-control item-gst">
                            <option value="0">0%</option>
                            <option value="5">5%</option>
                            <option value="12">12%</option>
                            <option value="40">40%</option>
                        </select>
                    </div>
                    <div class="col-md-2 mb-2">
                        <input type="number" class="form-control item-amount" placeholder="Amount" step="0.01" min="0" readonly>
                    </div>
                </div>
            </div>
            <button type="button" class="remove-btn"><i class="fas fa-times"></i></button>
        `;
        
        itemsContainer.appendChild(newItemRow);
        
        // Add event listeners to the new inputs
        setupItemListeners(newItemRow);
        
        // Add event listener to the remove button
        const removeBtn = newItemRow.querySelector('.remove-btn');
        removeBtn.addEventListener('click', function() {
            newItemRow.remove();
        });
    });
    
    // Setup event listeners for existing items
    document.querySelectorAll('.item-row').forEach(setupItemListeners);
    
    // Setup event listeners for remove buttons
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            btn.closest('.item-row').remove();
        });
    });
    
    function setupItemListeners(itemRow) {
        const qtyInput = itemRow.querySelector('.item-qty');
        const priceInput = itemRow.querySelector('.item-price');
        const gstSelect = itemRow.querySelector('.item-gst');
        const amountInput = itemRow.querySelector('.item-amount');
        
        [qtyInput, priceInput, gstSelect].forEach(input => {
            input.addEventListener('input', function() {
                const qty = parseFloat(qtyInput.value) || 0;
                const price = parseFloat(priceInput.value) || 0;
                const gstPercent = parseFloat(gstSelect.value) || 0;
                
                const subtotal = qty * price;
                const gstAmount = subtotal * (gstPercent / 100);
                const total = subtotal + gstAmount;
                
                amountInput.value = total.toFixed(2);
            });
        });
    }
    
    // Preview button
    previewBtn.addEventListener('click', function() {
        // Get form values
        const code = document.getElementById('invoiceCode').value || '#INV001';
        const table = document.getElementById('tableNumber').value;
        const date = document.getElementById('invoiceDate').value;
        const restaurantName = document.getElementById('restaurantName').value || 'Restaurant Name';
        const address = document.getElementById('restaurantAddress').value || 'Restaurant Address';
        const phone = document.getElementById('restaurantPhone').value || '+91 12345 67890';
        
        // Format date
        const dateObj = new Date(date);
        const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
        
        // Update preview
        document.getElementById('previewCode').textContent = code;
        
        // Handle table number (optional)
        const tableContainer = document.getElementById('previewTableContainer');
        if (table) {
            document.getElementById('previewTable').textContent = table;
            tableContainer.style.display = 'block';
        } else {
            tableContainer.style.display = 'none';
        }
        
        document.getElementById('previewDate').textContent = formattedDate;
        document.getElementById('previewRestaurantName').textContent = restaurantName;
        document.getElementById('previewAddress').textContent = address;
        document.getElementById('previewPhone').textContent = phone;
        
        // Handle logo
        const logoImg = logoPreview.querySelector('img');
        const invoiceLogo = document.getElementById('invoiceLogo');
        const logoImage = document.getElementById('logoImage');
        
        if (logoImg) {
            logoImage.src = logoImg.src;
            invoiceLogo.style.display = 'block';
        } else {
            invoiceLogo.style.display = 'none';
        }
        
        // Clear and populate items
        const previewItems = document.getElementById('previewItems');
        previewItems.innerHTML = '';
        
        document.querySelectorAll('.item-row').forEach((row, index) => {
            const name = row.querySelector('.item-name').value || 'Item Name';
            const qty = row.querySelector('.item-qty').value || '1';
            const price = row.querySelector('.item-price').value || '0';
            const gst = row.querySelector('.item-gst').value;
            const amount = row.querySelector('.item-amount').value || '0';
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${name}</td>
                <td>${qty}</td>
                <td>₹${parseFloat(price).toFixed(2)}</td>
                <td>${gst}%</td>
                <td>₹${parseFloat(amount).toFixed(2)}</td>
            `;
            previewItems.appendChild(tr);
        });
        
        // Show preview
        formContainer.classList.add('hidden');
        previewContainer.classList.add('active');
    });
    
    // Edit button
    editBtn.addEventListener('click', function() {
        formContainer.classList.remove('hidden');
        previewContainer.classList.remove('active');
    });
    
    // Reset button
    resetBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to reset the form?')) {
            document.getElementById('billForm').reset();
            document.getElementById('invoiceDate').value = formattedToday;
            logoPreview.innerHTML = '<i class="fas fa-image text-muted"></i>';
            
            // Reset items to just one empty row
            const itemRows = document.querySelectorAll('.item-row');
            itemRows.forEach((row, index) => {
                if (index > 0) {
                    row.remove();
                } else {
                    row.querySelector('.item-name').value = '';
                    row.querySelector('.item-qty').value = '1';
                    row.querySelector('.item-price').value = '';
                    row.querySelector('.item-gst').value = '0';
                    row.querySelector('.item-amount').value = '';
                }
            });
        }
    });
    
    // Download button
    downloadBtn.addEventListener('click', function() {
        const invoiceElement = document.getElementById('invoicePreview');
        
        html2canvas(invoiceElement, {
            scale: 2,
            backgroundColor: '#ffffff'
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'invoice.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });
});
