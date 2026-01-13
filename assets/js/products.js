// Products Management Logic

let editingProductId = null;

// Update user info
function updateUserInfo() {
    const user = getCurrentUser();
    if (user.name) {
        document.getElementById('userName').textContent = user.name;
        document.getElementById('userEmail').textContent = user.email;
        document.getElementById('userAvatar').textContent = user.name.charAt(0).toUpperCase();
    }
}

// Load categories into select dropdown
function loadCategoryOptions() {
    const categories = getCategories();
    const categorySelect = document.getElementById('productCategory');
    const categoryFilter = document.getElementById('categoryFilter');
    
    categorySelect.innerHTML = '<option value="">Sélectionner une catégorie</option>';
    categoryFilter.innerHTML = '<option value="">Toutes les catégories</option>';
    
    categories.forEach(category => {
        categorySelect.innerHTML += `<option value="${category.id}">${category.name}</option>`;
        categoryFilter.innerHTML += `<option value="${category.id}">${category.name}</option>`;
    });
}

// Load suppliers into select dropdown
function loadSupplierOptions() {
    const suppliers = getSuppliers();
    const supplierSelect = document.getElementById('productSupplier');
    
    supplierSelect.innerHTML = '<option value="">Sélectionner un fournisseur</option>';
    
    suppliers.forEach(supplier => {
        supplierSelect.innerHTML += `<option value="${supplier.id}">${supplier.name}</option>`;
    });
}

// Load and display all products
function loadProducts() {
    const products = getProducts();
    const categories = getCategories();
    const suppliers = getSuppliers();
    const tableBody = document.getElementById('productsTable');
    
    if (products.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" class="text-center text-gray-500">Aucun produit disponible</td></tr>';
        return;
    }
    
    tableBody.innerHTML = products.map(product => {
        const category = getCategoryById(product.categoryId);
        const supplier = getSupplierById(product.supplierId);
        const status = getProductStatus(product.quantity, product.minStock);
        
        let statusBadge = '';
        if (status === 'available') {
            statusBadge = '<span class="badge-available">Disponible</span>';
        } else if (status === 'low-stock') {
            statusBadge = '<span class="badge-low-stock">Stock faible</span>';
        } else {
            statusBadge = '<span class="badge-out-of-stock">Rupture</span>';
        }
        
        return `
            <tr>
                <td class="font-semibold">#${product.id}</td>
                <td>${product.name}</td>
                <td>${category ? category.name : 'N/A'}</td>
                <td>${supplier ? supplier.name : 'N/A'}</td>
                <td><span class="font-semibold">${product.quantity}</span></td>
                <td>${formatPrice(product.price)}</td>
                <td>${statusBadge}</td>
                <td>
                    <button class="action-btn edit me-2" onclick="editProduct(${product.id})" data-bs-toggle="modal" data-bs-target="#productModal">
                        <svg class="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        Modifier
                    </button>
                    <button class="action-btn delete" onclick="deleteProduct(${product.id})">
                        <svg class="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Supprimer
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Filter products based on search and filters
function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    const products = getProducts();
    
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || product.categoryId === parseInt(categoryFilter);
        const matchesStatus = !statusFilter || getProductStatus(product.quantity, product.minStock) === statusFilter;
        
        return matchesSearch && matchesCategory && matchesStatus;
    });
    
    const tableBody = document.getElementById('productsTable');
    
    if (filteredProducts.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" class="text-center text-gray-500">Aucun produit trouvé</td></tr>';
        return;
    }
    
    tableBody.innerHTML = filteredProducts.map(product => {
        const category = getCategoryById(product.categoryId);
        const supplier = getSupplierById(product.supplierId);
        const status = getProductStatus(product.quantity, product.minStock);
        
        let statusBadge = '';
        if (status === 'available') {
            statusBadge = '<span class="badge-available">Disponible</span>';
        } else if (status === 'low-stock') {
            statusBadge = '<span class="badge-low-stock">Stock faible</span>';
        } else {
            statusBadge = '<span class="badge-out-of-stock">Rupture</span>';
        }
        
        return `
            <tr>
                <td class="font-semibold">#${product.id}</td>
                <td>${product.name}</td>
                <td>${category ? category.name : 'N/A'}</td>
                <td>${supplier ? supplier.name : 'N/A'}</td>
                <td><span class="font-semibold">${product.quantity}</span></td>
                <td>${formatPrice(product.price)}</td>
                <td>${statusBadge}</td>
                <td>
                    <button class="action-btn edit me-2" onclick="editProduct(${product.id})" data-bs-toggle="modal" data-bs-target="#productModal">
                        <svg class="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        Modifier
                    </button>
                    <button class="action-btn delete" onclick="deleteProduct(${product.id})">
                        <svg class="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Supprimer
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        minimumFractionDigits: 0
    }).format(price);
}

// Open modal for adding new product
function openAddProductModal() {
    editingProductId = null;
    document.getElementById('productModalLabel').textContent = 'Ajouter un produit';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
}

// Edit product
function editProduct(id) {
    editingProductId = id;
    const product = getProductById(id);
    
    if (!product) return;
    
    document.getElementById('productModalLabel').textContent = 'Modifier le produit';
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.categoryId;
    document.getElementById('productSupplier').value = product.supplierId;
    document.getElementById('productQuantity').value = product.quantity;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productMinStock').value = product.minStock || 10;
}

// Save product (add or update)
function saveProduct() {
    const form = document.getElementById('productForm');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const productData = {
        name: document.getElementById('productName').value,
        categoryId: parseInt(document.getElementById('productCategory').value),
        supplierId: parseInt(document.getElementById('productSupplier').value),
        quantity: parseInt(document.getElementById('productQuantity').value),
        price: parseFloat(document.getElementById('productPrice').value),
        minStock: parseInt(document.getElementById('productMinStock').value) || 10
    };
    
    const products = getProducts();
    
    if (editingProductId) {
        // Update existing product
        const index = products.findIndex(p => p.id === editingProductId);
        if (index !== -1) {
            products[index] = {
                ...products[index],
                ...productData
            };
        }
    } else {
        // Add new product
        const newProduct = {
            id: getNextId(products),
            ...productData,
            createdAt: new Date().toISOString()
        };
        products.push(newProduct);
    }
    
    saveProducts(products);
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
    modal.hide();
    
    // Reload products
    loadProducts();
    
    // Reset form
    form.reset();
    editingProductId = null;
}

// Delete product
function deleteProduct(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        return;
    }
    
    const products = getProducts();
    const filteredProducts = products.filter(p => p.id !== id);
    saveProducts(filteredProducts);
    
    loadProducts();
}

// Initialize page
function initProductsPage() {
    updateUserInfo();
    loadCategoryOptions();
    loadSupplierOptions();
    loadProducts();
}

// Load page on DOM ready
document.addEventListener('DOMContentLoaded', initProductsPage);
